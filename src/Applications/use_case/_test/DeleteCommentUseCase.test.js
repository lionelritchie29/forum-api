const pool = require('../../../Infrastructures/database/postgres/pool');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');

describe('DeleteCommentUseCase', () => {
  afterAll(async () => {
    await pool.end();
  });

  it('should perform delete comment action correctly', async () => {
    const [commentId, userId, threadId] = ['comment-123', 'user-123', 'thread-123'];

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
    const deleteStatus = await deleteCommentUseCase.execute(commentId, userId, threadId);

    expect(threadRepo.verifyThread).toBeCalledWith(threadId);
    expect(commentRepo.verifyComment).toBeCalledWith(commentId);
    expect(commentRepo.verifyCommentOwner).toBeCalledWith(commentId, userId);
    expect(deleteStatus).toEqual(true);
  });
});
