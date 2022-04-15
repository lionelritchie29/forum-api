/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('thread_comments', {
    is_deleted: 'BOOLEAN',
  });

  pgm.sql('UPDATE thread_comments SET is_deleted = false WHERE is_deleted = NULL');
};

exports.down = (pgm) => {
  pgm.dropColumns('thread_comments', 'is_deleted');
};