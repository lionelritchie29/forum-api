const ThreadCommentRepliesTableTestHelper = require('../../../../tests/ThreadCommentRepliesTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadsTableTesthelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadCommentReplyRepositoryPostgres = require('../ThreadCommentReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const ThreadCommentReply = require('../../../Domains/threads/entities/ThreadCommentReply');

describe('ThreadCommentReplyRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentRepliesTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTesthelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTesthelper.addThread({ id: 'thread-123', userId: 'user-123' });
    await ThreadCommentsTableTestHelper.addComment({
      id: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
    });
  });

  describe('addReply function', () => {
    it('should return added reply correctly', async () => {
      const idGen = () => '123';

      const repo = new ThreadCommentReplyRepositoryPostgres(pool, idGen);
      const addedComment = await repo.addReply('user-123', 'comment-123', 'content');

      const added = await ThreadCommentRepliesTableTestHelper.getReply(addedComment.id);

      expect(addedComment.owner).toEqual('user-123');
      expect(addedComment.id).toEqual('reply-123');
      expect(addedComment.content).toEqual('content');
      expect(added).not.toEqual(null);
    });
  });

  describe('verifyReply function', () => {
    beforeEach(async () => {
      await ThreadCommentRepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });
    });

    it('should not throw error when reply is valid', async () => {
      const repo = new ThreadCommentReplyRepositoryPostgres(pool, () => {});

      await expect(repo.verifyReply('reply-123')).resolves.not.toThrowError(NotFoundError);
    });

    it('should throw error when reply is not valid', async () => {
      const repo = new ThreadCommentReplyRepositoryPostgres(pool, () => {});

      await expect(repo.verifyReply('reply-999')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    beforeEach(async () => {
      await ThreadCommentRepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });
    });

    it('should not throw error when reply owner is correct', async () => {
      const repo = new ThreadCommentReplyRepositoryPostgres(pool, () => {});

      await expect(repo.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError(
        AuthorizationError,
      );
    });

    it('should throw error when reply owner is incorrect', async () => {
      const repo = new ThreadCommentReplyRepositoryPostgres(pool, () => {});

      await expect(repo.verifyReplyOwner('reply-123', 'user-999')).rejects.toThrowError(
        AuthorizationError,
      );
    });
  });

  describe('deleteReply function', () => {
    beforeEach(async () => {
      await ThreadCommentRepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });
    });

    it('should return true when succesfully deleted a comment', async () => {
      const repo = new ThreadCommentReplyRepositoryPostgres(pool, () => {});

      const deleteStatus = await repo.deleteReply('reply-123');
      const reply = await ThreadCommentRepliesTableTestHelper.getReply('reply-123');

      expect(deleteStatus).toEqual(true);
      expect(reply.is_deleted).toEqual(true);
    });
  });

  describe('getRepliesByComment function', () => {
    it('should return replies related to a comment correctly', async () => {
      await ThreadCommentRepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });

      const now = new Date();
      const expected = [
        new ThreadCommentReply({
          id: 'reply-123',
          username: 'dicoding',
          content: 'content',
          date: now.toISOString(),
          isDeleted: false,
          threadCommentId: 'comment-123',
        }),
      ];

      const replyRepo = new ThreadCommentReplyRepositoryPostgres(pool, () => {});
      const replies = await replyRepo.getRepliesByComment(['comment-123']);

      expect(replies).toHaveLength(expected.length);
      expect(replies[0].id).toEqual(expected[0].id);
      expect(replies[0].username).toEqual(expected[0].username);
      expect(replies[0].content).toEqual(expected[0].content);
      expect(replies[0].isDeleted).toEqual(expected[0].isDeleted);
      expect(replies[0].threadCommentId).toEqual(expected[0].threadCommentId);
      expect(replies[0].date).toBeDefined();
    });
  });
});
