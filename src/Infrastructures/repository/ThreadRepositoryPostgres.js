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
      text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING *',
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
}

module.exports = ThreadRepositoryPostgres;
