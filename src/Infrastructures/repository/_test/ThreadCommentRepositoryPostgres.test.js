const ThreadsTableTesthelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadCommentCreated = require('../../../Domains/threads/entities/ThreadCommentCreated');
const pool = require('../../database/postgres/pool');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTesthelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should return added comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTesthelper.addThread({ threadId: 'thread-123', userId: 'user-123' });
      const fakeIdGen = () => '123';

      const commentRepo = new ThreadCommentRepositoryPostgres(pool, fakeIdGen);
      const addedComment = await commentRepo.addComment('user-123', 'thread-123', 'content');

      expect(addedComment).toStrictEqual(
        new ThreadCommentCreated({
          id: 'comment-123',
          content: 'content',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('deleteComment function', () => {
    it('should return true when succesfully deleted comment', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTesthelper.addThread({ threadId: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      const commentRepo = new ThreadCommentRepositoryPostgres(pool, () => {});
      const deletedStatus = await commentRepo.deleteComment('comment-123');

      const deletedComment = await ThreadCommentsTableTestHelper.getComment('comment-123');

      expect(deletedStatus).toEqual(true);
      expect(deletedComment).not.toEqual(null);
    });
  });

  describe('veriftComment function', () => {
    it('should not throw error when comment is valid', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTesthelper.addThread({ threadId: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      const commentRepo = new ThreadCommentRepositoryPostgres(pool, () => {});

      await expect(commentRepo.verifyComment('comment-123')).resolves.not.toThrowError(
        NotFoundError,
      );
    });

    it('should throw error when comment is not valid', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTesthelper.addThread({ threadId: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      const commentRepo = new ThreadCommentRepositoryPostgres(pool, () => {});

      await expect(commentRepo.verifyComment('comment-999')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should not throw error when comment owner is valid', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTesthelper.addThread({ threadId: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      const commentRepo = new ThreadCommentRepositoryPostgres(pool, () => {});

      await expect(
        commentRepo.verifyCommentOwner('comment-123', 'user-123'),
      ).resolves.not.toThrowError(AuthorizationError);
    });

    it('should throw error when thread owner is not valid', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTesthelper.addThread({ threadId: 'thread-123', userId: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      const commentRepo = new ThreadCommentRepositoryPostgres(pool, () => {});

      await expect(commentRepo.verifyCommentOwner('comment-123', 'user-999')).rejects.toThrowError(
        AuthorizationError,
      );
    });
  });
});
