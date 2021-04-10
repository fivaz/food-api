const { History } = require('../models');

class HistoryController {
  static async getAll(req, res) {
    try {
      const histories = await History.scope(['defaultScope', 'full'])
        .findAll();
      return res.status(200)
        .json(histories);
    } catch (error) {
      return res.status(500)
        .json(error.message);
    }
  }
}

module.exports = HistoryController;
