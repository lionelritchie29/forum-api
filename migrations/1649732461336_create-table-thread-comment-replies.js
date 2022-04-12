/* eslint-disable camelcase */
/* eslint-disable linebreak-style */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('thread_comment_replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    threadReplyId: {
      type: 'TEXT',
      notNull: true,
    },
    userId: {
      type: 'TEXT',
      notNull: true,
    },
    createdAt: {
      type: 'DATE',
      notNull: true,
      default: 'NOW()',
    },
  });

  pgm.addConstraint(
    'thread_comment_replies',
    'threads_comments_replies_thread_comment_fk',
    {
      foreignKeys: {
        columns: 'id',
        references: 'thread_comments',
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
    },
  );

  pgm.addConstraint(
    'thread_comment_replies',
    'threads_comments_replies_user_fk',
    {
      foreignKeys: {
        columns: 'id',
        references: 'users',
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
    },
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    'thread_comment_replies',
    'threads_comments_replies_thread_comment_fk',
  );
  pgm.dropConstraint(
    'thread_comment_replies',
    'threads_comments_replies_user_fk',
  );
  pgm.dropTable('thread_comment_replies');
};
