const ThreadCommentRepository = require('../ThreadCommentRepository');

describe('ThreadCommentRepository', () => {
  it('should throw error when its abstract method is called', async () => {
    const commentRepo = new ThreadCommentRepository();

    await expect(() =>
      commentRepo.addComment('user-123', 'thread-123', 'content'),
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.ADD_COMMENT_NOT_IMPLEMENTED');

    await expect(() => commentRepo.deleteComment('comment-123')).rejects.toThrowError(
      'THREAD_COMMENT_REPOSITORY.DELETE_COMMENT_NOT_IMPLEMENTED',
    );

    await expect(() => commentRepo.verifyComment('comment-123')).rejects.toThrowError(
      'THREAD_COMMENT_REPOSITORY.VERIFY_COMMENT_NOT_IMPLEMENTED',
    );

    await expect(() =>
      commentRepo.verifyCommentOwner('comment-123', 'user-123'),
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.VERIFY_COMMENT_OWNER_NOT_IMPLEMENTED');
  });
});
