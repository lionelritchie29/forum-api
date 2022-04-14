const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { title, body } = request.payload;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const newThread = await addThreadUseCase.execute(userId, { title, body });

    const response = h.response({
      status: 'success',
      data: {
        addedThread: newThread,
      },
    });
    response.code(201);
    return response;
  }

  async postThreadCommentHandler(request, h) {
    const { threadId } = request.params;
    const { id: userId } = request.auth.credentials;
    const { content } = request.payload;

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const newComment = await addCommentUseCase.execute(userId, threadId, content);

    const response = h.response({
      status: 'success',
      data: {
        addedComment: newComment,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
