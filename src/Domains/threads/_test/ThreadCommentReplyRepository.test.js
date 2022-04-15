const ThreadCommentReplyRepository = require('../ThreadCommentReplyRepository');

describe('ThreadCommentReplyRepository', () => {
  it('should throw error when its abstract method is called', async () => {
    const replyRepo = new ThreadCommentReplyRepository();

    await expect(replyRepo.addReply('user-123', 'comment-123', 'content')).rejects.toThrowError(
      'THREAD_COMMENT_REPLY_REPOSITORY.ADD_REPLY_NOT_IMPLEMENTED',
    );

    await expect(replyRepo.verifyReply('reply-123')).rejects.toThrowError(
      'THREAD_COMMENT_REPLY_REPOSITORY.VERIFY_REPLY_NOT_IMPLEMENTED',
    );

    await expect(replyRepo.verifyReplyOwner('reply-123', 'user-123')).rejects.toThrowError(
      'THREAD_COMMENT_REPLY_REPOSITORY.VERIFY_REPLY_OWNER_NOT_IMPLEMENTED',
    );

    await expect(replyRepo.deleteReply('reply-123')).rejects.toThrowError(
      'THREAD_COMMENT_REPLY_REPOSITORY.DELETE_REPLY_NOT_IMPLEMENTED',
    );
  });
});
