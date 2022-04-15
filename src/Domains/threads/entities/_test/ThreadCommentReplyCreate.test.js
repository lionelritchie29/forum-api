const ThreadCommentReplyCreate = require('../ThreadCommentReplyCreate');

describe('ThreadCommentReplyCreate', () => {
  it('should throw error when payload didn`t contain needed property', () => {
    const payload = {
      content: 'content',
      userId: 'user-123',
      threadId: 'thread-123',
    };

    expect(() => new ThreadCommentReplyCreate(payload)).toThrowError(
      'THREAD_COMMENT_REPLY_CREATE.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload data type is not correct', () => {
    const payload = {
      userId: 123,
      threadId: {},
      commentId: 222,
      content: { data: 'asd' },
    };

    expect(() => new ThreadCommentReplyCreate(payload)).toThrowError(
      'THREAD_COMMENT_REPLY_CREATE.NOT_CORRECT_DATA_TYPE',
    );
  });

  it('should create ThreadCommentReplyCreate object correctly when given correct payload', () => {
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'content',
    };

    const reply = new ThreadCommentReplyCreate(payload);

    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.owner).toEqual(payload.owner);
  });
});
