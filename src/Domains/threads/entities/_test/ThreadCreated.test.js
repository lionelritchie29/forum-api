const ThreadCreated = require('../ThreadCreated');

describe('ThreadCreated', () => {
  it('should throw error when payload didn`t contain needed property', () => {
    const payload = {
      title: 'Thread Body',
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
      owner: 123,
    };

    expect(() => new ThreadCreated(payload)).toThrowError('THREAD_CREATED.NOT_CORRECT_DATA_TYPE');
  });

  it('should create ThreadCreated object correctly when given correct payload', () => {
    const payload = {
      id: 'thread-123',
      title: 'Thread Body',
      owner: 'user-123',
    };

    const threadCreate = new ThreadCreated(payload);

    expect(threadCreate.id).toEqual(payload.id);
    expect(threadCreate.owner).toEqual(payload.owner);
    expect(threadCreate.title).toEqual(payload.title);
  });
});
