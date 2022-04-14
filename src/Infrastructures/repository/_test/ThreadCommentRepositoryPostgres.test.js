const ThreadsTableTesthelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadCommentCreated = require('../../../Domains/threads/entities/ThreadCommentCreated');
const pool = require('../../database/postgres/pool');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');

describe('ThreadCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTesthelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

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
