/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
class ThreadCommentReply {
  constructor(payload) {
    this._validate(payload);

    const { id, content, username, date, isDeleted } = payload;
    this.id = id;
    this.content = content;
    this.username = username;
    this.date = date;
    this.isDeleted = isDeleted;
  }

  _validate(payload) {
    const { id, content, username, date, isDeleted } = payload;
    if (!content || !username || !id || !date || isDeleted === undefined) {
      throw new Error('THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string' ||
      typeof username !== 'string' ||
      typeof id !== 'string' ||
      typeof date !== 'string' ||
      typeof isDeleted !== 'boolean'
    ) {
      throw new Error('THREAD_COMMENT_REPLY.NOT_CORRECT_DATA_TYPE');
    }
  }
}

module.exports = ThreadCommentReply;
