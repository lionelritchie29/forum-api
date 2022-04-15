const ThreadComment = require('../ThreadComment');

describe('ThreadComment', () => {
  it('should throw error when payload didn`t contain needed property', () => {
    const payload = {
      id: 'comment-123',
      content: 'content',
      username: 'lionel',
    };

    expect(() => new ThreadComment(payload)).toThrowError(
      'THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload data type is not correct', () => {
    const payload = {
      id: 444,
      content: 'content',
      username: 'lionel',
      date: 123,
      isDeleted: 123,
      replies: {},
    };

    expect(() => new ThreadComment(payload)).toThrowError('THREAD_COMMENT.NOT_CORRECT_DATA_TYPE');
  });

  it('should create ThreadComment object correctly when given correct payload', () => {
    const payload = {
      id: 'comment-123',
      content: 'content',
      username: 'lionel',
      date: '2021-08-08T07:59:48.766Z',
      isDeleted: true,
      replies: [],
    };

    const comment = new ThreadComment(payload);

    expect(comment.id).toEqual(payload.id);
    expect(comment.content).toEqual(payload.content);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.replies).toEqual(payload.replies);
  });
});
