/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    userId = 'user-123',
    threadId = 'thread-123',
    content = 'content',
    isDeleted = false,
  }) {
    const query = {
      text: 'INSERT INTO thread_comments VALUES ($1, $2, $3, $4, $5, $6)',
      values: [id, content, threadId, userId, new Date(), isDeleted],
    };

    await pool.query(query);
  },

  async getComment(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rowCount > 0 ? result.rows[0] : null;
  },

  async cleanTable() {
    const query = {
      text: 'DELETE FROM thread_comments WHERE 1 = 1',
    };

    await pool.query(query);
  },
};

module.exports = ThreadCommentsTableTestHelper;
