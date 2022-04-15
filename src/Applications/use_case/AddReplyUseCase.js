const ThreadCommentReplyCreate = require('../../Domains/threads/entities/ThreadCommentReplyCreate');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(userId, threadId, commentId, content) {
    // eslint-disable-next-line object-curly-newline
    const replyCreate = new ThreadCommentReplyCreate({ userId, threadId, commentId, content });
    await this._threadRepository.verifyThread(replyCreate.threadId);
    await this._commentRepository.verifyComment(replyCreate.commentId);
    return this._replyRepository.addReply(
      replyCreate.userId,
      replyCreate.commentId,
      replyCreate.content,
    );
  }
}

module.exports = AddReplyUseCase;
