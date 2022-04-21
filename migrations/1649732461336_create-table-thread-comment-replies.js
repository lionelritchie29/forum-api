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
    threadCommentId: {
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

  pgm.addConstraint('thread_comment_replies', 'threads_comments_replies_thread_comment_fk', {
    foreignKeys: {
      columns: 'threadCommentId',
      references: 'thread_comments(id)',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
  });

  pgm.addConstraint('thread_comment_replies', 'threads_comments_replies_user_fk', {
    foreignKeys: {
      columns: 'userId',
      references: 'users(id)',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('thread_comment_replies', 'threads_comments_replies_thread_comment_fk');
  pgm.dropConstraint('thread_comment_replies', 'threads_comments_replies_user_fk');
  pgm.dropTable('thread_comment_replies');
};
