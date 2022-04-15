class ThreadCommentReplyCreated {
  constructor(payload) {
    this._validate(payload);

    const { id, content, owner } = payload;
    this.content = content;
    this.owner = owner;
    this.id = id;
  }

  _validate(payload) {
    const { id, content, owner } = payload;
    if (!content || !owner || !id) {
      throw new Error('THREAD_COMMENT_REPLY_CREATED.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof id !== 'string') {
      throw new Error('THREAD_COMMENT_REPLY_CREATED.NOT_CORRECT_DATA_TYPE');
    }
  }
}

module.exports = ThreadCommentReplyCreated;
