const ThreadsTableTesthelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadCreate = require('../../../Domains/threads/entities/ThreadCreate');
const ThreadCreated = require('../../../Domains/threads/entities/ThreadCreated');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTesthelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should return added thread correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'lionel' });
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
          body: 'Thread Body',
        }),
      );
    });
  });
});
