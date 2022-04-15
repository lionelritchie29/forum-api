/* eslint-disable no-unused-vars */
class ThreadRepository {
  async addThread(userId, threadCreate) {
    throw new Error('THREAD_REPOSITORY.ADD_THREAD_NOT_IMPLEMENTED');
  }

  async verifyThread(threadId) {
    throw new Error('THREAD_REPOSITORY.VERIFY_THREAD_NOT_IMPLEMENTED');
  }

  async getThread(threadId) {
    throw new Error('THREAD_REPOSITORY.GET_THREAD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadRepository;
