const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const ThreadCommentCreated = require('../../../Domains/threads/entities/ThreadCommentCreated');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should perform add comment action correctly', async () => {
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      content: 'content',
    };
    const expected = new ThreadCommentCreated({
      id: 'thread-123',
      content: 'content',
      owner: 'user-123',
    });

    const threadRepository = new ThreadRepository();
    threadRepository.verifyThread = jest.fn().mockImplementation(() => Promise.resolve);

    const commentRepository = new ThreadCommentRepository();
    commentRepository.addComment = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new ThreadCommentCreated({
          id: 'thread-123',
          content: 'content',
          owner: 'user-123',
        }),
      ),
    );

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository,
      commentRepository,
    });

    const { userId, threadId, content } = payload;
    const addedComment = await addCommentUseCase.execute(userId, threadId, content);

    expect(threadRepository.verifyThread).toBeCalledWith(payload.threadId);
    expect(commentRepository.addComment).toBeCalledWith(
      payload.userId,
      payload.threadId,
      payload.content,
    );
    expect(addedComment).toStrictEqual(expected);
  });
});
