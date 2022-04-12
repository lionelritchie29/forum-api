const ThreadCreate = require('../ThreadCreate');

describe('ThreadCreate', () => {
  it('should throw error when payload didn`t contain needed property', () => {
    const payload = {
      body: 'Thread Body',
    };

    expect(() => new ThreadCreate(payload)).toThrowError(
      'THREAD_CREATE.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload data type is not correct', () => {
    const payload = {
      title: {},
      body: 123,
    };

    expect(() => new ThreadCreate(payload)).toThrowError(
      'THREAD_CREATE.NOT_CORRECT_DATA_TYPE',
    );
  });

  it('should create ThreadCreate object correctly when given correct payload', () => {
    const payload = {
      body: 'Thread Body',
      title: 'Thread Title',
    };

    const threadCreate = new ThreadCreate(payload);

    expect(threadCreate.body).toEqual(payload.body);
    expect(threadCreate.title).toEqual(payload.title);
  });
});
