/* eslint-disable no-unused-vars */
class ThreadCommentReplyRepository {
  async addReply(userId, commentId, content) {
    throw new Error('THREAD_COMMENT_REPLY_REPOSITORY.ADD_REPLY_NOT_IMPLEMENTED');
  }

  async verifyReply(id) {
    throw new Error('THREAD_COMMENT_REPLY_REPOSITORY.VERIFY_REPLY_NOT_IMPLEMENTED');
  }

  async verifyReplyOwner(id, userId) {
    throw new Error('THREAD_COMMENT_REPLY_REPOSITORY.VERIFY_REPLY_OWNER_NOT_IMPLEMENTED');
  }

  async deleteReply(id) {
    throw new Error('THREAD_COMMENT_REPLY_REPOSITORY.DELETE_REPLY_NOT_IMPLEMENTED');
  }

  async getRepliesByComment(commentId) {
    throw new Error('THREAD_COMMENT_REPLY_REPOSITORY.GET_REPLIES_BY_COMMENT_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadCommentReplyRepository;
