const database = require('../models');

class IngredientController {
    static async getAll(req, res) {
        const {query} = req;
        if (query.mealId) {
            return IngredientController.getAllWithQuantities(req, res);
        }
        try {
            const all = await database.ingredients.findAll();
            return res.status(200).json(all);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async getAllWithQuantities(req, res) {
        const {mealId} = req.query;
        try {
            const options = {
                include: [{
                    model: database.meals,
                    required: false,
                    where: {id: Number(mealId)},
                    attributes: ['id'],
                    through: {
                        attributes: ['quantity']
                    },
                }],
                raw: true,
                nest: true
            };
            const all = await database.ingredients.findAll(options);
            const ingredientsWithQuantities = all.map(ingredient => {
                ingredient.mealIngredients = ingredient.meals.mealIngredients;
                delete ingredient.meals;
                return ingredient;
            });
            return res.status(200).json(ingredientsWithQuantities);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async get(req, res) {
        const {id} = req.params;
        try {
            const element = await database.ingredients.findOne({where: {id: Number(id)}});
            return res.status(200).json(element);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async create(req, res) {
        const ingredient = req.body;
        try {
            const createdIngredient = await database.ingredients.create(ingredient);
            return res.status(201).json(createdIngredient);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async update(req, res) {
        const id = Number(req.params.id);
        const newData = req.body;
        try {
            await database.ingredients.update(newData, {where: {id}});
            const updatedIngredient = await database.ingredients.findOne({where: {id}});
            return res.status(200).json(updatedIngredient);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async delete(req, res) {
        const {id} = req.params;
        try {
            await database.ingredients.destroy({where: {id: Number(id)}});
            return res.status(200).json(`row ${id} deleted`);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = IngredientController;
