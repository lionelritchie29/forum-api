const ThreadCreate = require('../../Domains/threads/entities/ThreadCreate');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, payload) {
    const threadCreate = new ThreadCreate(payload);
    const threadCreated = await this._threadRepository.addThread(userId, threadCreate);
    return threadCreated;
  }
}

module.exports = AddThreadUseCase;
