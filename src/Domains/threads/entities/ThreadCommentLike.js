class ThreadCommentLike {
  constructor(payload) {
    this._validate(payload);

    const { userId, threadCommentId } = payload;
    this.userId = userId;
    this.threadCommentId = threadCommentId;
  }

  _validate(payload) {
    const { userId, threadCommentId } = payload;
    if (!userId || !threadCommentId) {
      throw new Error('THREAD_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof threadCommentId !== 'string') {
      throw new Error('THREAD_COMMENT_LIKE.NOT_CORRECT_DATA_TYPE');
    }
  }
}

module.exports = ThreadCommentLike;
