const pool = require('../../../Infrastructures/database/postgres/pool');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');

describe('DeleteCommentUseCase', () => {
  afterEach(() => {
    ThreadCommentsTableTestHelper.cleanTable();
    ThreadsTableTestHelper.cleanTable();
    UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should perform delete comment action correctly', async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
    await ThreadCommentsTableTestHelper.addComment({
      id: 'comment-123',
      threadId: 'thread-123',
      userId: 'user-123',
    });

    const threadRepo = new ThreadRepository();
    threadRepo.verifyThread = jest.fn().mockImplementation(() => Promise.resolve);

    const commentRepo = new ThreadCommentRepository();
    commentRepo.verifyComment = jest.fn().mockImplementation(() => Promise.resolve);
    commentRepo.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve);
    commentRepo.deleteComment = jest.fn().mockImplementation(() => Promise.resolve(true));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: threadRepo,
      commentRepository: commentRepo,
    });
    const deleteStatus = await deleteCommentUseCase.execute(
      'comment-123',
      'user-123',
      'thread-123',
    );

    expect(threadRepo.verifyThread).toBeCalledWith('thread-123');
    expect(commentRepo.verifyComment).toBeCalledWith('comment-123');
    expect(commentRepo.verifyCommentOwner).toBeCalledWith('comment-123', 'user-123');
    expect(deleteStatus).toEqual(true);
  });
});
