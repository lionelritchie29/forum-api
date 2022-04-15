const AddCommentUseCase = require('../AddCommentUseCase');
const pool = require('../../../Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const ThreadCommentCreated = require('../../../Domains/threads/entities/ThreadCommentCreated');

describe('AddCommentUseCase', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should perform add comment action correctly', async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

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
    commentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(expected));

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
