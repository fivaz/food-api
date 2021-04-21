class ModelNotFoundError extends Error {
  constructor() {
    super('The resource does not exist');
    this.status = 404;
  }
}

module.exports = new ModelNotFoundError();
