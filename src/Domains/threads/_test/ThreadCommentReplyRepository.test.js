const ThreadCommentReplyRepository = require('../ThreadCommentReplyRepository');

describe('ThreadCommentReplyRepository', () => {
  it('should throw error when its abstract method is called', async () => {
    const replyRepo = new ThreadCommentReplyRepository();

    await expect(replyRepo.addReply('user-123', 'comment-123', 'content')).rejects.toThrowError(
      'THREAD_COMMENT_REPLY_REPOSITORY.ADD_REPLY_NOT_IMPLEMENTED',
    );
  });
});
