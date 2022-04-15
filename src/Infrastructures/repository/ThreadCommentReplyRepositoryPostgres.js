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
      text: 'INSERT INTO thread_comment_replies VALUES ($1, $2, $3, $4, $5) RETURNING id, content, "userId"',
      values: [id, content, commentId, userId, new Date()],
    };

    const result = await this._pool.query(query);
    const reply = result.rows[0];
    return new ThreadCommentReplyCreated({
      id: reply.id,
      content: reply.content,
      owner: reply.userId,
    });
  }
}

module.exports = ThreadCommentReplyRepositoryPostgres;
