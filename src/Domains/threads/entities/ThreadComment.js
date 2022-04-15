/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
class ThreadComment {
  constructor(payload) {
    this._validate(payload);

    const { id, content, date, username, replies } = payload;
    this.id = id;
    this.content = content;
    this.username = username;
    this.date = date;
    this.replies = replies;
  }

  _validate(payload) {
    const { id, content, username, date, replies } = payload;

    if (!id || !content || !username || !date || !replies) {
      throw new Error('THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string' ||
      !Array.isArray(replies)
    ) {
      throw new Error('THREAD_COMMENT.NOT_CORRECT_DATA_TYPE');
    }
  }
}

module.exports = ThreadComment;
