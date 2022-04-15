const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const Thread = require('../../Domains/threads/entities/Thread');
const ThreadCreated = require('../../Domains/threads/entities/ThreadCreated');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(userId, threadCreate) {
    const { title, body } = threadCreate;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, title, "userId"',
      values: [id, title, body, userId, new Date()],
    };

    const result = await this._pool.query(query);
    const thread = result.rows[0];
    return new ThreadCreated({
      id: thread.id,
      title: thread.title,
      owner: thread.userId,
    });
  }

  async verifyThread(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak valid');
    }
  }

  async getThread(threadId) {
    const query = {
      text: `
        SELECT t.id, t.title, t.body, t."createdAt" as date, u.username
        FROM threads t
        JOIN users u ON t."userId" = u.id
        WHERE t.id = $1
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      return null;
    }

    return new Thread({
      id: result.rows[0].id,
      title: result.rows[0].title,
      body: result.rows[0].body,
      date: result.rows[0].date.toISOString(),
      username: result.rows[0].username,
      comments: [],
    });
  }
}

module.exports = ThreadRepositoryPostgres;
