const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentReplyRepository = require('../../../Domains/threads/ThreadCommentReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const ThreadCommentReplyCreated = require('../../../Domains/threads/entities/ThreadCommentReplyCreated');

describe('AddReplyUseCase', () => {
  it('should perform add reply action correctly', async () => {
    const userId = 'user-123';
    const commentId = 'comment-123';
    const content = 'content';
    const threadId = 'thread-123';

    const expected = new ThreadCommentReplyCreated({
      id: 'reply-123',
      content: 'content',
      owner: 'user-123',
    });

    const mockThreadRepo = new ThreadRepository();
    mockThreadRepo.verifyThread = jest.fn().mockImplementation(() => Promise.resolve);

    const mockCommentRepo = new ThreadCommentRepository();
    mockCommentRepo.verifyComment = jest.fn().mockImplementation(() => Promise.resolve);

    const mockReplyRepo = new ThreadCommentReplyRepository();
    mockReplyRepo.addReply = jest.fn().mockImplementation(() => Promise.resolve(expected));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
      replyRepository: mockReplyRepo,
    });
    const addedComment = await addReplyUseCase.execute(userId, threadId, commentId, content);

    expect(mockThreadRepo.verifyThread).toBeCalledWith(threadId);
    expect(mockCommentRepo.verifyComment).toBeCalledWith(commentId);
    expect(mockReplyRepo.addReply).toBeCalledWith(userId, commentId, content);

    expect(addedComment).toStrictEqual(expected);
  });
});
