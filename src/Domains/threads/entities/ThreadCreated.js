class ThreadCreated {
  constructor(payload) {
    this._validate(payload);

    const { id, title, body } = payload;
    this.title = title;
    this.body = body;
    this.id = id;
  }

  _validate(payload) {
    const { id, title, body } = payload;
    if (!title || !body || !id) {
      throw new Error('THREAD_CREATED.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof id !== 'string') {
      throw new Error('THREAD_CREATED.NOT_CORRECT_DATA_TYPE');
    }
  }
}

module.exports = ThreadCreated;
