const database = require('../models');

class IngredientController {
    static async getAll(req, res) {
        try {
            const all = await database.Ingredients.findAll();
            return res.status(200).json(all);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async get(req, res) {
        const {id} = req.params;
        try {
            const element = await database.Ingredients.findOne({where: {id: Number(id)}});
            return res.status(200).json(element);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async create(req, res) {
        const ingredient = req.body;
        try {
            const newElement = await database.Ingredients.create(ingredient);
            return res.status(200).json(newElement);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = IngredientController;