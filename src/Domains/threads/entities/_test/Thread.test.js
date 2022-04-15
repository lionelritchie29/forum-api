const Thread = require('../Thread');

describe('Thread', () => {
  it('should throw error when payload didn`t contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2021-08-08T07:59:16.198Z',
    };

    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload data type is not correct', () => {
    const payload = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2021-08-08T07:59:16.198Z',
      username: 'lionel',
      comments: {},
    };

    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CORRECT_DATA_TYPE');
  });

  it('should create Thread object correctly when given correct payload', () => {
    const payload = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2021-08-08T07:59:16.198Z',
      username: 'lionel',
      comments: [],
    };

    const comment = new Thread(payload);

    expect(comment.id).toEqual(payload.id);
    expect(comment.content).toEqual(payload.content);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.replies).toEqual(payload.replies);
  });
});
