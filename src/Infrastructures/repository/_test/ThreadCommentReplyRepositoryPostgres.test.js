const ThreadCommentRepliesTableTestHelper = require('../../../../tests/ThreadCommentRepliesTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadsTableTesthelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadCommentReplyRepositoryPostgres = require('../ThreadCommentReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

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
});
