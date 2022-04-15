/* eslint-disable linebreak-style */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('thread_comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    threadId: {
      type: 'TEXT',
      notNull: true,
    },
    userId: {
      type: 'TEXT',
      notNull: true,
    },
    createdAt: {
      type: 'TIMESTAMP',
      notNull: true,
      default: 'NOW()',
    },
  });

  pgm.addConstraint('thread_comments', 'threads_comments_thread_fk', {
    foreignKeys: {
      columns: 'threadId',
      references: 'threads(id)',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
  });

  pgm.addConstraint('thread_comments', 'threads_comments_user_fk', {
    foreignKeys: {
      columns: 'userId',
      references: 'users(id)',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('thread_comments', 'threads_comments_thread_fk');
  pgm.dropConstraint('thread_comments', 'threads_comments_user_fk');
  pgm.dropTable('thread_comments');
};
