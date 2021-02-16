const database = require('../models');

class MealController {

    static async getAll(req, res) {
        if (req.query?.full)
            return MealController.getAllFull(req, res);
        else
            return MealController.getAllSimple(req, res);
    }

    static async getAllSimple(req, res) {
        try {
            const all = await database.Meals.findAll();
            return res.status(200).json(all);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async getAllFull(req, res) {
        try {
            const all = await database.Meals.findAll({include: database.Ingredients});
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
                    row.ingredientId = row.id;
                    return row;
                });
                await database.MealIngredients.bulkCreate(records);
            }
            return res.status(201).json(createdMeal);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    //TODO try to do this better
    static async update(req, res) {
        const id = Number(req.params.id);
        const newData = req.body;
        try {
            await database.Meals.update(newData, {where: {id}});
            const result = await database.Meals.findOne({where: {id}});

            if (newData.ingredients)
                await MealController.updateChildren(newData, id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async updateChildren(newData, id) {
        const records = newData.ingredients.map(row => {
            row.mealId = id;
            row.ingredientId = row.id;
            return row;
        });
        //TODO check afterBulkDestroy as an option
        await Promise.all([
            database.MealIngredients.destroy({where: {mealId: id}}),
            database.MealIngredients.bulkCreate(records)
        ]);
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
