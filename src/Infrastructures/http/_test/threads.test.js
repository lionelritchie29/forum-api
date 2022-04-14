const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      username: 'lionel',
      password: 'secret',
      fullname: 'Lionel Ritchie',
    });
  });

  describe('when POST /threads', () => {
    it('should response with 400 if no authorization header passed', async () => {
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
    it('should response with 401 if no authorization header passed', async () => {
      const server = await createServer(container);
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

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
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

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
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

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
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

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
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

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
});
