class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(commentId, userId, threadId) {
    await this._threadRepository.verifyThread(threadId);
    await this._commentRepository.verifyComment(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, userId);

    return this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
