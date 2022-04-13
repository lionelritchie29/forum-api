const ThreadCommentCreated = require('../ThreadCommentCreated');

describe('ThreadCommentCreated', () => {
  it('should throw error when payload didn`t contain needed property', () => {
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
    };

    expect(() => new ThreadCommentCreated(payload)).toThrowError(
      'THREAD_COMMENT_CREATED.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload data type is not correct', () => {
    const payload = {
      id: 546,
      content: {},
      owner: 123,
    };

    expect(() => new ThreadCommentCreated(payload)).toThrowError(
      'THREAD_COMMENT_CREATED.NOT_CORRECT_DATA_TYPE',
    );
  });

  it('should create ThreadCommentCreated object correctly when given correct payload', () => {
    const payload = {
      id: 'comment-123',
      content: 'Comment Body',
      owner: 'user-123',
    };

    const comment = new ThreadCommentCreated(payload);

    expect(comment.id).toEqual(payload.id);
    expect(comment.content).toEqual(payload.content);
    expect(comment.owner).toEqual(payload.owner);
  });
});
