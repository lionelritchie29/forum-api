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

      const repliesWithoutDeletedAt = replies.map((r) => {
        const { isDeleted, ...filtered } = r;
        if (isDeleted) filtered.content = '**balasan telah dihapus**';
        return filtered;
      });
      comment.replies = repliesWithoutDeletedAt;
    }

    const commentsWithoutDeletedAt = comments.map((c) => {
      const { isDeleted, ...filtered } = c;
      if (isDeleted) filtered.content = '**komentar telah dihapus**';
      return filtered;
    });

    thread.comments = commentsWithoutDeletedAt;

    return thread;
  }
}

module.exports = GetSingleThreadUseCase;
