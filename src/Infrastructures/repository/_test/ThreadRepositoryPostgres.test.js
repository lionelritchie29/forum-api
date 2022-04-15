const ThreadsTableTesthelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadCreate = require('../../../Domains/threads/entities/ThreadCreate');
const ThreadCreated = require('../../../Domains/threads/entities/ThreadCreated');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const Thread = require('../../../Domains/threads/entities/Thread');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTesthelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'lionel' });
  });

  describe('addThread function', () => {
    it('should return added thread correctly', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');

      const threadCreate = new ThreadCreate({
        title: 'Thread Title',
        body: 'Thread Body',
      });
      const fakeIdGen = () => '123';

      const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGen);
      const newThread = await threadRepo.addThread(user[0].id, threadCreate);

      expect(newThread).toStrictEqual(
        new ThreadCreated({
          id: 'thread-123',
          title: 'Thread Title',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('verifyThread function', () => {
    beforeEach(async () => {
      await ThreadsTableTesthelper.addThread({ threadId: 'thread-123', userId: 'user-123' });
    });

    it('should return valid thread correctly', async () => {
      const fakeIdGen = () => '123';

      const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGen);

      await expect(threadRepo.verifyThread('thread-123')).resolves.not.toThrowError(InvariantError);
    });

    it('should throw error when thread id does not valid', async () => {
      const fakeIdGen = () => '123';

      const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGen);

      await expect(threadRepo.verifyThread('thread-999')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getThread function', () => {
    beforeEach(async () => {
      await ThreadsTableTesthelper.addThread({ threadId: 'thread-123', userId: 'user-123' });
    });

    it('should return specified thread correctly', async () => {
      const dummyDate = new Date();
      const expected = new Thread({
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
        date: dummyDate.toISOString(),
        username: 'lionel',
        comments: [],
      });

      const threadRepo = new ThreadRepositoryPostgres(pool, () => {});
      const thread = await threadRepo.getThread('thread-123');

      expect(thread.id).toEqual(expected.id);
      expect(thread.title).toEqual(expected.title);
      expect(thread.body).toEqual(expected.body);
      expect(thread.username).toEqual(expected.username);
      expect(thread.comments).toHaveLength(expected.comments.length);
      expect(thread.date).toBeDefined();
    });

    it('should return null if thread does not exist', async () => {
      const threadRepo = new ThreadRepositoryPostgres(pool, () => {});
      const thread = await threadRepo.getThread('thread-999');

      expect(thread).toEqual(null);
    });
  });
});
