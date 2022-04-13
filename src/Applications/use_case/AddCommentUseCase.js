const ThreadCommentCreate = require('../../Domains/threads/entities/ThreadCommentCreate');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(userId, threadId, content) {
    const payload = new ThreadCommentCreate({ userId, threadId, content });
    await this._threadRepository.verifyThread(threadId);
    return this._commentRepository.addComment(payload.userId, payload.threadId, payload.content);
  }
}

module.exports = AddCommentUseCase;
