exports.up = (pgm) => {
  pgm.createTable('thread_comment_likes', {
    threadCommentId: {
      type: 'TEXT',
      notNull: true,
      primaryKey: true,
    },
    userId: {
      type: 'TEXT',
      notNull: true,
      primaryKey: true,
    },
    createdAt: {
      type: 'TIMESTAMP',
      notNull: true,
      default: 'NOW()',
    },
  });

  pgm.addConstraint('thread_comment_likes', 'threads_comments_likes_comment_fk', {
    foreignKeys: {
      columns: 'threadCommentId',
      references: 'thread_comments(id)',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
  });

  pgm.addConstraint('thread_comment_likes', 'threads_comments_likes_user_fk', {
    foreignKeys: {
      columns: 'userId',
      references: 'users(id)',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('thread_comment_likes', 'threads_comments_likes_comment_fk');
  pgm.dropConstraint('thread_comment_likes', 'threads_comments_likes_user_fk');
  pgm.dropTable('thread_comment_likes');
};
