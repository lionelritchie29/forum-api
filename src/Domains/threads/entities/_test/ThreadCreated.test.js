const ThreadCreated = require('../ThreadCreated');

describe('ThreadCreated', () => {
  it('should throw error when payload didn`t contain needed property', () => {
    const payload = {
      body: 'Thread Body',
      id: 'thread-123',
    };

    expect(() => new ThreadCreated(payload)).toThrowError(
      'THREAD_CREATED.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload data type is not correct', () => {
    const payload = {
      id: 'hehe',
      title: {},
      body: 123,
    };

    expect(() => new ThreadCreated(payload)).toThrowError('THREAD_CREATED.NOT_CORRECT_DATA_TYPE');
  });

  it('should create ThreadCreated object correctly when given correct payload', () => {
    const payload = {
      id: 'thread-123',
      body: 'Thread Body',
      title: 'Thread Title',
    };

    const threadCreate = new ThreadCreated(payload);

    expect(threadCreate.id).toEqual(payload.id);
    expect(threadCreate.body).toEqual(payload.body);
    expect(threadCreate.title).toEqual(payload.title);
  });
});
