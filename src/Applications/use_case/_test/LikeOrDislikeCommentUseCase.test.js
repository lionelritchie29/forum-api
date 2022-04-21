const LikeOrDislikeCommentUseCase = require('../LikeOrDislikeCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const ThreadCommentLikeRepository = require('../../../Domains/threads/ThreadCommentLikeRepository');

describe('LikeOrDislikeCommentUseCase', () => {
  it('should perform like comment action correctly', async () => {
    const mockThreadRepo = new ThreadRepository();
    mockThreadRepo.verifyThread = jest.fn(() => Promise.resolve);

    const mockCommentRepo = new ThreadCommentRepository();
    mockCommentRepo.verifyComment = jest.fn(() => Promise.resolve);

    const mockLikeRepo = new ThreadCommentLikeRepository();
    mockLikeRepo.addLike = jest.fn(() => Promise.resolve);
    mockLikeRepo.removeLike = jest.fn(() => Promise.resolve);
    mockLikeRepo.checkLikeExist = jest.fn(() => Promise.resolve(false));

    const likeOrDislikeUseCase = new LikeOrDislikeCommentUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
      likeRepository: mockLikeRepo,
    });

    await likeOrDislikeUseCase.execute('user-123', 'comment-123', 'thread-123');

    expect(mockThreadRepo.verifyThread).toBeCalledWith('thread-123');
    expect(mockCommentRepo.verifyComment).toBeCalledWith('comment-123');
    expect(mockLikeRepo.addLike).toBeCalledWith('user-123', 'comment-123');
    expect(mockLikeRepo.removeLike).toBeCalledTimes(0);
    expect(mockLikeRepo.checkLikeExist).toBeCalledWith('user-123', 'comment-123');
  });

  it('should perform dislike comment action correctly', async () => {
    const mockThreadRepo = new ThreadRepository();
    mockThreadRepo.verifyThread = jest.fn(() => Promise.resolve);

    const mockCommentRepo = new ThreadCommentRepository();
    mockCommentRepo.verifyComment = jest.fn(() => Promise.resolve);

    const mockLikeRepo = new ThreadCommentLikeRepository();
    mockLikeRepo.addLike = jest.fn(() => Promise.resolve);
    mockLikeRepo.removeLike = jest.fn(() => Promise.resolve);
    mockLikeRepo.checkLikeExist = jest.fn(() => Promise.resolve(true));

    const likeOrDislikeUseCase = new LikeOrDislikeCommentUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
      likeRepository: mockLikeRepo,
    });

    await likeOrDislikeUseCase.execute('user-123', 'comment-123', 'thread-123');

    expect(mockThreadRepo.verifyThread).toBeCalledWith('thread-123');
    expect(mockCommentRepo.verifyComment).toBeCalledWith('comment-123');
    expect(mockLikeRepo.addLike).toBeCalledTimes(0);
    expect(mockLikeRepo.removeLike).toBeCalledWith('user-123', 'comment-123');
    expect(mockLikeRepo.checkLikeExist).toBeCalledWith('user-123', 'comment-123');
  });
});
