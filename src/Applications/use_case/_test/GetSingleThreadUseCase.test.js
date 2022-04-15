const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadComment = require('../../../Domains/threads/entities/ThreadComment');
const ThreadCommentReply = require('../../../Domains/threads/entities/ThreadCommentReply');
const ThreadCommentReplyRepository = require('../../../Domains/threads/ThreadCommentReplyRepository');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetSingleThreadUseCase = require('../GetSingleThreadUseCase');

describe('GetSingleThreadUseCase', () => {
  it('should perform get single thread action correctly', async () => {
    const dummyDate = new Date();
    const expected = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: dummyDate.toISOString(),
      username: 'lionel',
      comments: [
        {
          id: 'comment-123',
          username: 'lionel',
          date: dummyDate.toISOString(),
          replies: [
            {
              id: 'reply-123',
              content: '**balasan telah dihapus**',
              date: dummyDate.toISOString(),
              username: 'lionel',
            },
            {
              id: 'reply-456',
              content: 'sebuah balasan',
              date: dummyDate.toISOString(),
              username: 'lionel',
            },
          ],
          content: 'content',
        },
        {
          id: 'comment-456',
          username: 'lionel',
          date: dummyDate.toISOString(),
          replies: [
            {
              id: 'reply-123',
              content: '**balasan telah dihapus**',
              date: dummyDate.toISOString(),
              username: 'lionel',
            },
            {
              id: 'reply-456',
              content: 'sebuah balasan',
              date: dummyDate.toISOString(),
              username: 'lionel',
            },
          ],
          content: '**komentar telah dihapus**',
        },
      ],
    };

    const mockThreadRepo = new ThreadRepository();
    mockThreadRepo.getThread = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new Thread({
          id: 'thread-123',
          title: 'Thread Title',
          body: 'Thread Body',
          date: dummyDate.toISOString(),
          username: 'lionel',
          comments: [],
        }),
      ),
    );

    const mockCommentRepo = new ThreadCommentRepository();
    mockCommentRepo.getCommentsByThread = jest.fn().mockImplementation(() =>
      Promise.resolve([
        new ThreadComment({
          id: 'comment-123',
          username: 'lionel',
          date: dummyDate.toISOString(),
          content: 'content',
          isDeleted: false,
          replies: [],
        }),
        new ThreadComment({
          id: 'comment-456',
          username: 'lionel',
          date: dummyDate.toISOString(),
          content: 'content hapus',
          isDeleted: true,
          replies: [],
        }),
      ]),
    );

    const mockReplyRepo = new ThreadCommentReplyRepository();
    mockReplyRepo.getRepliesByComment = jest.fn().mockImplementation(() =>
      Promise.resolve([
        new ThreadCommentReply({
          id: 'reply-123',
          content: 'balasan hehe',
          date: dummyDate.toISOString(),
          username: 'lionel',
          isDeleted: true,
        }),
        new ThreadCommentReply({
          id: 'reply-456',
          content: 'sebuah balasan',
          date: dummyDate.toISOString(),
          username: 'lionel',
          isDeleted: false,
        }),
      ]),
    );

    const useCase = new GetSingleThreadUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
      replyRepository: mockReplyRepo,
    });
    const result = await useCase.execute('thread-123');

    expect(mockThreadRepo.getThread).toBeCalledWith('thread-123');
    expect(mockCommentRepo.getCommentsByThread).toBeCalledWith('thread-123');
    expect(mockReplyRepo.getRepliesByComment).toBeCalledTimes(expected.comments.length);

    expect(result).toEqual(expected);
  });
});