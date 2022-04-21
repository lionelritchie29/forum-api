class LikeOrDislikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(userId, commentId, threadId) {
    await this._threadRepository.verifyThread(threadId);
    await this._commentRepository.verifyComment(commentId);
    const isLikeExist = await this._likeRepository.checkLikeExist(userId, commentId);

    if (!isLikeExist) {
      await this._likeRepository.addLike(userId, commentId);
    } else {
      await this._likeRepository.removeLike(userId, commentId);
    }
  }
}

module.exports = LikeOrDislikeCommentUseCase;
