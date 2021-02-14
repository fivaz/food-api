const database = require('../models');

class MealController {

    static async getAll(req, res) {
        try {
            const all = await database.Meals.findAll();
            return res.status(200).json(all);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async get(req, res) {
        const {id} = req.params;
        try {
            const element = await database.Meals.findOne({where: {id: Number(id)}});
            return res.status(200).json(element);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async getIngredients(req, res) {
        const {id} = req.params;
        try {
            const element = await database.Meals.findOne({where: {id: Number(id)}, include: database.Ingredients});
            return res.status(200).json(element.Ingredients);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async create(req, res) {
        const Meal = req.body;
        try {
            const createdMeal = await database.Meals.create(Meal);
            if (Meal.ingredients) {
                const records = Meal.ingredients.map(row => {
                    row.mealId = createdMeal.id;
                    return row;
                });
                await database.MealIngredients.bulkCreate(records);
            }
            return res.status(201).json(createdMeal);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async update(req, res) {
        const id = Number(req.params.id);
        const newData = req.body;
        try {
            const records = newData.ingredients.map(row => {
                row.mealId = id;
                return row;
            });

            //TODO check afterBulkDestroy as an option
            const [, , , mealCreated] = await Promise.all([
                database.Meals.update(newData, {where: {id}}),
                database.MealIngredients.destroy({where: {mealId: id}}),
                database.MealIngredients.bulkCreate(records),
                database.Meals.findOne({where: {id}})
            ]);
            return res.status(200).json(mealCreated);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async delete(req, res) {
        const id = Number(req.params.id);
        try {
            await Promise.all([
                database.MealIngredients.destroy({where: {mealId: id}}),
                database.Meals.destroy({where: {id}})
            ]);
            return res.status(200).json(`row ${id} deleted`);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = MealController;