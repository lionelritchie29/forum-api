const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository', () => {
  it('should throw error when its abstract method is called', async () => {
    const threadRepo = new ThreadRepository();

    await expect(() => threadRepo.addThread('user-123', {})).rejects.toThrowError(
      'THREAD_REPOSITORY.ADD_THREAD_NOT_IMPLEMENTED',
    );

    await expect(() => threadRepo.verifyThread('thread-123')).rejects.toThrowError(
      'THREAD_REPOSITORY.VERIFY_THREAD_NOT_IMPLEMENTED',
    );

    await expect(() => threadRepo.getThread('thread-123')).rejects.toThrowError(
      'THREAD_REPOSITORY.GET_THREAD_NOT_IMPLEMENTED',
    );
  });
});
