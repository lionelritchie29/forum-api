/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('thread_comment_replies', {
    is_deleted: 'BOOLEAN',
  });

  pgm.sql('UPDATE thread_comment_replies SET is_deleted = false WHERE is_deleted = NULL');
};

exports.down = (pgm) => {
  pgm.dropColumns('thread_comment_replies', 'is_deleted');
};
