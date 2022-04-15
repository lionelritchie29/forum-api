const ThreadCommentRepliesTableTestHelper = require('../../../../tests/ThreadCommentRepliesTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadsTableTesthelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadCommentReplyRepositoryPostgres = require('../ThreadCommentReplyRepositoryPostgres');

describe('ThreadCommentReplyRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadCommentRepliesTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTesthelper.cleanTable();
  });

  it('should return added reply correctly', async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTesthelper.addThread({ id: 'thread-123', userId: 'user-123' });
    await ThreadCommentsTableTestHelper.addComment({
      id: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
    });
    const idGen = () => '123';

    const repo = new ThreadCommentReplyRepositoryPostgres(pool, idGen);
    const addedComment = await repo.addReply('user-123', 'comment-123', 'content');

    expect(addedComment.owner).toEqual('user-123');
    expect(addedComment.id).toEqual('reply-123');
    expect(addedComment.content).toEqual('content');
  });
});
