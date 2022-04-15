/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentRepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    commentId = 'comment-123',
    userId = 'user-123',
    content = 'content',
  }) {
    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES ($1, $2, $3, $4, $5, $6)',
      values: [id, content, commentId, userId, new Date(), false],
    };

    await pool.query(query);
  },

  async getReply(id) {
    const query = {
      text: 'SELECT * FROM thread_comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rowCount > 0 ? result.rows[0] : null;
  },

  async cleanTable() {
    const query = {
      text: 'DELETE FROM thread_comment_replies WHERE 1 = 1',
    };

    await pool.query(query);
  },
};

module.exports = ThreadCommentRepliesTableTestHelper;
