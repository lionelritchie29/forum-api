const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadCommentReplyCreated = require('../../Domains/threads/entities/ThreadCommentReplyCreated');
const ThreadCommentReplyRepository = require('../../Domains/threads/ThreadCommentReplyRepository');

class ThreadCommentReplyRepositoryPostgres extends ThreadCommentReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(userId, commentId, content) {
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, "userId"',
      values: [id, content, commentId, userId, new Date(), false],
    };

    const result = await this._pool.query(query);
    const reply = result.rows[0];
    return new ThreadCommentReplyCreated({
      id: reply.id,
      content: reply.content,
      owner: reply.userId,
    });
  }

  async verifyReply(id) {
    const query = {
      text: 'SELECT * FROM thread_comment_replies WHERE id = $1 AND is_deleted = false',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Reply tidak valid');
    }
  }

  async verifyReplyOwner(id, userId) {
    const query = {
      text: 'SELECT * FROM thread_comment_replies WHERE id = $1 AND "userId" = $2 AND is_deleted = false',
      values: [id, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Reply hanya dapat dihapus oleh owner');
    }
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE thread_comment_replies SET is_deleted = true WHERE id = $1 AND is_deleted = false',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }
}

module.exports = ThreadCommentReplyRepositoryPostgres;
