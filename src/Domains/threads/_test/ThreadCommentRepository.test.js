const ThreadCommentRepository = require('../ThreadCommentRepository');

describe('ThreadCommentRepository', () => {
  it('should throw error when its abstract method is called', async () => {
    const commentRepo = new ThreadCommentRepository();

    await expect(() =>
      commentRepo.addComment('user-123', 'thread-123', 'content'),
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.ADD_COMMENT_NOT_IMPLEMENTED');
  });
});
