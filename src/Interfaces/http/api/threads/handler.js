const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
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

  async deleteThreadCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(commentId, userId, threadId);

    const response = h.response({
      status: 'success',
      data: {
        status: 'success',
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
