/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
class GetSingleThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThread(threadId);
    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._commentRepository.getCommentsByThread(threadId);

    const commentIds = comments.map((comment) => comment.id);
    const replies = await this._replyRepository.getRepliesByComment(commentIds);

    for (const comment of comments) {
      const commentReplies = replies.filter((reply) => reply.threadCommentId === comment.id);
      const repliesWithoutDeletedAt = commentReplies.map((reply) => {
        const { isDeleted, ...filtered } = reply;
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
