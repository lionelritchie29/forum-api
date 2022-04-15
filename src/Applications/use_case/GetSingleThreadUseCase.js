/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
class GetSingleThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._commentRepository.getCommentsByThread(threadId);

    for (const comment of comments) {
      const replies = await this._replyRepository.getRepliesByComment(comment.id);
      if (replies) comment.replies = replies;
    }

    thread.comments = comments;

    return thread;
  }
}

module.exports = GetSingleThreadUseCase;
