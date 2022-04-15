/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentRepliesTableTestHelper = {
  async cleanTable() {
    const query = {
      text: 'DELETE FROM thread_comment_replies WHERE 1 = 1',
    };

    await pool.query(query);
  },
};

module.exports = ThreadCommentRepliesTableTestHelper;
