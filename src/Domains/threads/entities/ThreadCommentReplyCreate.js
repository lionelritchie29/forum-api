/* eslint-disable operator-linebreak */
class ThreadCommentReplyCreated {
  constructor(payload) {
    this._validate(payload);

    // eslint-disable-next-line object-curly-newline
    const { userId, threadId, commentId, content } = payload;
    this.userId = userId;
    this.threadId = threadId;
    this.commentId = commentId;
    this.content = content;
  }

  _validate(payload) {
    // eslint-disable-next-line object-curly-newline
    const { userId, threadId, commentId, content } = payload;
    if (!userId || !threadId || !commentId || !content) {
      throw new Error('THREAD_COMMENT_REPLY_CREATE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof userId !== 'string' ||
      typeof threadId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof content !== 'string'
    ) {
      throw new Error('THREAD_COMMENT_REPLY_CREATE.NOT_CORRECT_DATA_TYPE');
    }
  }
}

module.exports = ThreadCommentReplyCreated;
