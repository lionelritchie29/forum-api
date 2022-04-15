const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadComment = require('../../Domains/threads/entities/ThreadComment');
const ThreadCommentCreated = require('../../Domains/threads/entities/ThreadCommentCreated');
const ThreadCommentRepository = require('../../Domains/threads/ThreadCommentRepository');

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(userId, threadId, content) {
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO thread_comments VALUES ($1, $2, $3, $4) RETURNING *',
      values: [id, content, threadId, userId],
    };

    const result = await this._pool.query(query);
    const comment = result.rows[0];
    return new ThreadCommentCreated({
      id: comment.id,
      content: comment.content,
      owner: comment.userId,
    });
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE thread_comments SET is_deleted = true WHERE id = $1 AND is_deleted = false',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async verifyComment(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1 AND is_deleted = false',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Comment tidak valid');
    }
  }

  async verifyCommentOwner(id, userId) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1 AND "userId" = $2 AND is_deleted = false',
      values: [id, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Comment hanya dapat dihapus oleh owner');
    }
  }

  async getCommentsByThread(threadId) {
    const query = {
      text: `
        SELECT tc.id, u.username, tc.content, tc."createdAt" as date, tc.is_deleted
        FROM thread_comments tc
        JOIN users u ON u.id = tc."userId"
        WHERE "threadId" = $1
        ORDER BY tc."createdAt" asc
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map(
      (row) =>
        new ThreadComment({
          id: row.id,
          username: row.username,
          date: row.date.toISOString(),
          content: row.content,
          isDeleted: row.is_deleted,
          replies: [],
        }),
    );
  }
}

module.exports = ThreadCommentRepositoryPostgres;
