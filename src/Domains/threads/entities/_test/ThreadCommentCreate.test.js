const ThreadCommentCreate = require('../ThreadCommentCreate');

describe('ThreadCommentCreate', () => {
  it('should throw error when payload didn`t contain needed property', () => {
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
    };

    expect(() => new ThreadCommentCreate(payload)).toThrowError(
      'THREAD_COMMENT_CREATE.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload data type is not correct', () => {
    const payload = {
      userId: 'user-123',
      content: {},
      threadId: 123,
    };

    expect(() => new ThreadCommentCreate(payload)).toThrowError(
      'THREAD_COMMENT_CREATE.NOT_CORRECT_DATA_TYPE',
    );
  });

  it('should create ThreadCommentCreate object correctly when given correct payload', () => {
    const payload = {
      userId: 'user-123',
      content: 'Comment Body',
      threadId: 'thread-123',
    };

    const createComment = new ThreadCommentCreate(payload);

    expect(createComment.id).toEqual(payload.id);
    expect(createComment.content).toEqual(payload.content);
    expect(createComment.owner).toEqual(payload.owner);
  });
});
