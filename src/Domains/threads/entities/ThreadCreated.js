class ThreadCreated {
  constructor(payload) {
    this._validate(payload);

    const { id, title, owner } = payload;
    this.title = title;
    this.owner = owner;
    this.id = id;
  }

  _validate(payload) {
    const { id, title, owner } = payload;
    if (!title || !owner || !id) {
      throw new Error('THREAD_CREATED.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof owner !== 'string' || typeof id !== 'string') {
      throw new Error('THREAD_CREATED.NOT_CORRECT_DATA_TYPE');
    }
  }
}

module.exports = ThreadCreated;
