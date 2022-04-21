const ThreadCommentLikeRepositoryPostgres = require('../ThreadCommentLikeRepositoryPostgres');
const ThreadCommentLikesTableTestHelper = require('../../../../tests/ThreadCommentLikesTableTestHelper');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadCommentLike = require('../../../Domains/threads/entities/ThreadCommentLike');

describe('ThreadCommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadCommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
    await ThreadCommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
  });

  describe('addLike function', () => {
    it('should add like to a comment correctly', async () => {
      const [userId, commentId] = ['user-123', 'comment-123'];

      const expected = new ThreadCommentLike({
        userId,
        threadCommentId: commentId,
      });

      const likeRepo = new ThreadCommentLikeRepositoryPostgres(pool);
      await likeRepo.addLike(userId, commentId);
      const addedLike = await ThreadCommentLikesTableTestHelper.getLike({ userId, commentId });
      const convertedAddedLike = new ThreadCommentLike({
        userId: addedLike.userId,
        threadCommentId: addedLike.threadCommentId,
      });

      expect(convertedAddedLike).toEqual(expected);
    });
  });

  describe('removeLike function', () => {
    it('should remove like from a comment correctly', async () => {
      const [userId, commentId] = ['user-123', 'comment-123'];
      await ThreadCommentLikesTableTestHelper.addLike({ userId, commentId });

      const likeRepo = new ThreadCommentLikeRepositoryPostgres(pool);
      await likeRepo.removeLike(userId, commentId);

      const like = await ThreadCommentLikesTableTestHelper.getLike({ userId, commentId });

      expect(like).toBeNull();
    });
  });

  describe('checkLikeExist function', () => {
    it('should return true if like exist', async () => {
      const [userId, commentId] = ['user-123', 'comment-123'];
      await ThreadCommentLikesTableTestHelper.addLike({ userId, commentId });

      const likeRepo = new ThreadCommentLikeRepositoryPostgres(pool);
      const isExist = await likeRepo.checkLikeExist(userId, commentId);

      expect(isExist).toEqual(true);
    });

    it('should return false if like not exist', async () => {
      const [userId, commentId] = ['user-123', 'comment-123'];
      await ThreadCommentLikesTableTestHelper.addLike({ userId, commentId });

      const likeRepo = new ThreadCommentLikeRepositoryPostgres(pool);
      const isExist = await likeRepo.checkLikeExist(userId, 'comment-999');

      expect(isExist).toEqual(false);
    });
  });

  describe('getLikesCount function', () => {
    it('should return like count of a comment correctly', async () => {
      const [userId, commentId] = ['user-123', 'comment-123'];
      await ThreadCommentLikesTableTestHelper.addLike({ userId, commentId });

      const likeRepo = new ThreadCommentLikeRepositoryPostgres(pool);
      const count = await likeRepo.getLikesCount(commentId);

      expect(count).toEqual(1);
    });
  });
});
