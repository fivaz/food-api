class ModelNotFoundError extends Error {
  constructor() {
    super('You are not authorized to access this ressource');
    this.status = 403;
  }
}

module.exports = new ModelNotFoundError();
