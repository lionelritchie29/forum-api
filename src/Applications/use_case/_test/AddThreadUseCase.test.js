const ThreadCreate = require('../../../Domains/threads/entities/ThreadCreate');
const ThreadCreated = require('../../../Domains/threads/entities/ThreadCreated');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should perform correct add thread action', async () => {
    const payload = {
      title: 'Thread Title',
      body: 'Thread Body',
    };
    const payloadUserId = 'user-123';

    const expected = new ThreadCreated({
      id: 'thread-123',
      title: 'Thread Title',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new ThreadCreated({
          id: 'thread-123',
          title: 'Thread Title',
          owner: 'user-123',
        }),
      ),
    );

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const threadCreated = await addThreadUseCase.execute(payloadUserId, payload);

    expect(mockThreadRepository.addThread).toBeCalledWith(
      payloadUserId,
      new ThreadCreate({
        title: payload.title,
        body: payload.body,
      }),
    );

    expect(threadCreated).toStrictEqual(expected);
  });
});
