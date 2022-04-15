/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
class ThreadCommentReply {
  constructor(payload) {
    this._validate(payload);

    const { id, content, username, date } = payload;
    this.id = id;
    this.content = content;
    this.username = username;
    this.date = date;
  }

  _validate(payload) {
    const { id, content, username, date } = payload;
    if (!content || !username || !id || !date) {
      throw new Error('THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string' ||
      typeof username !== 'string' ||
      typeof id !== 'string' ||
      typeof date !== 'string'
    ) {
      throw new Error('THREAD_COMMENT_REPLY.NOT_CORRECT_DATA_TYPE');
    }
  }
}

module.exports = ThreadCommentReply;
