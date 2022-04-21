const ThreadCommentLike = require('../ThreadCommentLike');

describe('ThreadCommentLike', () => {
  it('should throw error when payload didn`t contain needed property', () => {
    const payload = {
      userId: 'user-123',
    };

    expect(() => new ThreadCommentLike(payload)).toThrowError(
      'THREAD_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload data type is not correct', () => {
    const payload = {
      threadCommentId: {},
      userId: 123,
    };

    expect(() => new ThreadCommentLike(payload)).toThrowError(
      'THREAD_COMMENT_LIKE.NOT_CORRECT_DATA_TYPE',
    );
  });

  it('should create ThreadCommentLike object correctly when given correct payload', () => {
    const payload = {
      threadCommentId: 'comment-123',
      userId: 'user-123',
    };

    const like = new ThreadCommentLike(payload);

    expect(like.id).toEqual(payload.id);
    expect(like.content).toEqual(payload.content);
    expect(like.owner).toEqual(payload.owner);
  });
});
