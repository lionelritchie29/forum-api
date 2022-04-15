/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    body: {
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

  pgm.addConstraint('threads', 'threads_user_fk', {
    foreignKeys: {
      columns: 'userId',
      references: 'users(id)',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('threads', 'threads_user_fk');
  pgm.dropTable('threads');
};
