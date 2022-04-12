class ThreadCreate {
  constructor(payload) {
    this._validate(payload);

    const { title, body } = payload;
    this.title = title;
    this.body = body;
  }

  _validate(payload) {
    const { title, body } = payload;
    if (!title || !body) {
      throw new Error('THREAD_CREATE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('THREAD_CREATE.NOT_CORRECT_DATA_TYPE');
    }
  }
}

module.exports = ThreadCreate;
