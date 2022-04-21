/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
class ThreadCommentReply {
  constructor(payload) {
    this._validate(payload);

    const { id, content, username, date, isDeleted, threadCommentId } = payload;
    this.id = id;
    this.content = content;
    this.username = username;
    this.date = date;
    this.isDeleted = isDeleted;
    this.threadCommentId = threadCommentId;
  }

  _validate(payload) {
    const { id, content, username, date, isDeleted, threadCommentId } = payload;
    if (!content || !username || !id || !date || isDeleted === undefined || !threadCommentId) {
      throw new Error('THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string' ||
      typeof username !== 'string' ||
      typeof id !== 'string' ||
      typeof date !== 'string' ||
      typeof isDeleted !== 'boolean' ||
      typeof threadCommentId !== 'string'
    ) {
      throw new Error('THREAD_COMMENT_REPLY.NOT_CORRECT_DATA_TYPE');
    }
  }
}

module.exports = ThreadCommentReply;
