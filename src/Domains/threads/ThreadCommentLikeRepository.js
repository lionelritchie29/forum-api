/* eslint-disable no-unused-vars */
class ThreadCommentLikeRepository {
  async addLike(userId, commentId) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.ADD_LIKE_NOT_IMPLEMENTED');
  }

  async removeLike(userId, commentId) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.REMOVE_LIKE_NOT_IMPLEMENTED');
  }

  async checkLikeExist(userId, commentId) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.CHECK_LIKE_EXIST_NOT_IMPLEMENTED');
  }

  async getLikesCount(commentId) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.GET_LIKES_COUNT_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadCommentLikeRepository;
