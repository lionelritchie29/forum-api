const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadCommentRepliesTableTestHelper = require('../../../../tests/ThreadCommentRepliesTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentRepliesTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await UsersTableTestHelper.addUser({
      username: 'lionel',
      password: 'secret',
      fullname: 'Lionel Ritchie',
    });
  });

  describe('when POST /threads', () => {
    it('should response with 401 if no authorization header passed', async () => {
      const server = await createServer(container);

      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response with 400 when not given needed property', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const requestPayload = {
        title: 'Thread Title',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response with 400 when request payload not meet data type specification', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const requestPayload = {
        title: { value: 'Thread Title' },
        body: 123,
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai',
      );
    });

    it('should response with 201 and the new thread', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    beforeEach(async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
    });

    it('should response with 401 if no authorization header passed', async () => {
      const server = await createServer(container);

      const requestPayload = {
        content: 'content',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/threads-123/comments',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response with 400 if not given needed payload', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const requestPayload = {
        contenttt: 'content',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response with 400 when payload didn`t meet data type spec', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const requestPayload = {
        content: 123,
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena tipe data tidak sesuai',
      );
    });

    it('should response with 404 when specified thread does not exist', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const requestPayload = {
        content: 'content',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-999/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak valid');
    });

    it('should response with 201 and return added comment', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const requestPayload = {
        content: 'content',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    beforeEach(async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });
    });

    it('should response with 401 if no authorization header passed', async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/threads-123/comments/comment-123',
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response with 404 if thread is not valid', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-999/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak valid');
    });

    it('should response with 404 if comment is not valid', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-999',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Comment tidak valid');
    });

    it('should response with 403 if comment is deleted by other user', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-999',
      });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Comment hanya dapat dihapus oleh owner');
    });

    it('should response with 200 when comment was succesfully deleted', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    beforeEach(async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });
    });

    it('should response with 401 if no authorization header passed', async () => {
      const server = await createServer(container);

      const requestPayload = {
        content: 'content',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/threads-123/comments/comment-123/replies',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response with 400 if not given needed payload', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const requestPayload = {
        contenttt: 'content',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response with 404 if thread does not exist', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const requestPayload = {
        content: 'content',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-999/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak valid');
    });

    it('should response with 404 if thread comment does not exist', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const requestPayload = {
        content: 'content',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-999/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Comment tidak valid');
    });

    it('should response with 201 if reply created succesfully', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const requestPayload = {
        content: 'content',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    beforeEach(async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });
      await ThreadCommentRepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });
    });

    it('should response with 401 if no authorization header passed', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
      });

      const responseJson = JSON.parse(response.payload);
      expect(responseJson.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response with 404 if thread not found', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-999/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toEqual('Thread tidak valid');
    });

    it('should response with 404 if comment not found', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-999/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toEqual('Comment tidak valid');
    });

    it('should response with 404 if reply not found', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-999',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toEqual('Reply tidak valid');
    });

    it('should response with 403 if reply is deleted not by owner', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-999',
      });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.message).toEqual('Reply hanya dapat dihapus oleh owner');
    });

    it('should response with 200 if reply is deleted succesfully', async () => {
      const server = await createServer(container);
      const authTokenManager = container.getInstance(AuthenticationTokenManager.name);
      const accessToken = await authTokenManager.createAccessToken({
        username: 'lionel',
        id: 'user-123',
      });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    beforeEach(async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-456',
        threadId: 'thread-123',
        userId: 'user-123',
      });
      await ThreadCommentRepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        userId: 'user-123',
      });
      await ThreadCommentRepliesTableTestHelper.addReply({
        id: 'reply-456',
        commentId: 'comment-123',
        userId: 'user-123',
      });
      await ThreadCommentsTableTestHelper.deleteComment('comment-456');
      await ThreadCommentRepliesTableTestHelper.deleteReply('reply-123');
    });

    it('should response with 404 if thread not exist', async () => {
      const server = await createServer();

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-999',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak valid');
    });

    it('should response with 200 and the specified thread correctly', async () => {
      const server = await createServer();

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();

      const commentContents = responseJson.data.thread.comments.map((c) => c.content);
      expect(commentContents).toContain('**komentar telah dihapus**');

      const replyContents = responseJson.data.thread.comments.map((c) =>
        c.replies.map((r) => r.content),
      );
      expect(replyContents.flat(Infinity)).toContain('**balasan telah dihapus**');
    });
  });
});
