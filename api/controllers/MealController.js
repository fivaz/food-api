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
            const all = await database.meals.findAll();
            return res.status(200).json(all);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async getAllFull(req, res) {
        try {
            const all = await database.meals.findAll({include: database.ingredients});
            return res.status(200).json(all);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async get(req, res) {
        const {id} = req.params;
        try {
            const element = await database.meals.findOne({where: {id: Number(id)}});
            return res.status(200).json(element);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async getIngredients(req, res) {
        const {id} = req.params;
        try {
            const element = await database.meals.findOne({where: {id: Number(id)}, include: database.ingredients});
            return res.status(200).json(element.ingredients);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async create(req, res) {
        const meal = req.body;
        try {
            const createdMeal = await database.meals.create(meal);
            if (meal.ingredients) {
                const records = meal.ingredients.map(row => {
                    row.mealIngredients.mealId = createdMeal.id;
                    return row.mealIngredients;
                });
                await database.mealIngredients.bulkCreate(records);
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
            await database.meals.update(newData, {where: {id}});
            const result = await database.meals.findOne({where: {id}});

            if (newData.ingredients)
                await MealController.updateChildren(newData, id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async updateChildren(newData, id) {
        const records = newData.ingredients.map(row => {
            row.mealIngredients.mealId = id;
            return row.mealIngredients;
        });
        //TODO check afterBulkDestroy as an option
        await Promise.all([
            database.mealIngredients.destroy({where: {mealId: id}}),
            database.mealIngredients.bulkCreate(records)
        ]);
    }

    static async delete(req, res) {
        const id = Number(req.params.id);
        try {
            await Promise.all([
                database.mealIngredients.destroy({where: {mealId: id}}),
                database.meals.destroy({where: {id}})
            ]);
            return res.status(200).json(`row ${id} deleted`);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = MealController;
