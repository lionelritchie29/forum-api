/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
class ThreadComment {
  constructor(payload) {
    this._validate(payload);

    const { id, content, date, username, replies, isDeleted } = payload;
    this.id = id;
    this.content = content;
    this.username = username;
    this.date = date;
    this.replies = replies;
    this.isDeleted = isDeleted;
  }

  _validate(payload) {
    const { id, content, username, date, replies, isDeleted } = payload;

    if (!id || !content || !username || !date || !replies || !isDeleted === undefined) {
      throw new Error('THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string' ||
      typeof isDeleted !== 'boolean' ||
      !Array.isArray(replies)
    ) {
      throw new Error('THREAD_COMMENT.NOT_CORRECT_DATA_TYPE');
    }
  }
}

module.exports = ThreadComment;
