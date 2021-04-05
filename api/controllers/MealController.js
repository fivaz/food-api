const database = require('../models');

class MealController {

    static async getAll(req, res) {
        try {
            const options = req.query?.full ? {include: database.ingredients} : {};
            const all = await database.meals.findAll(options);
            return res.status(200).json(all);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async get(req, res) {
        const {id} = req.params;
        try {
            const element = req.query?.full ?
                await MealController.findOneFull(id) :
                await MealController.findOne(id);

            return res.status(200).json(element);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async create(req, res) {
        const meal = req.body;
        try {
            let createdMeal = await database.meals.create(meal);
            if (meal.ingredients?.length > 0)
                [, createdMeal] = await MealController.createChildren(meal, createdMeal.id);
            return res.status(201).json(createdMeal);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    //TODO check if I can remove these Number(id)
    static async findOne(id) {
        return database.meals.findOne({
            where: {id: Number(id)}
        });
    }

    static async findOneFull(id) {
        return database.meals.findOne({
            where: {id: Number(id)},
            include: database.ingredients
        });
    }

    static async createChildren(meal, id) {
        const records = MealController.getMealIngredients(meal, id);
        await database.mealIngredients.bulkCreate(records);
        return MealController.findOneFull(id);
    }

    static getMealIngredients(meal, id) {
        return meal.ingredients.map(row => {
            row.mealIngredients.mealId = id;
            return row.mealIngredients;
        });
    }

    //TODO try to do this better
    static async update(req, res) {
        const id = Number(req.params.id);
        const newData = req.body;
        try {
            await database.meals.update(newData, {where: {id}});
            let result = await database.meals.findOne({where: {id}});
            if (newData.ingredients?.length > 0)
                result = await MealController.updateChildren(newData, id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async updateChildren(newData, id) {
        const records = MealController.getMealIngredients(newData, id);
        //TODO check afterBulkDestroy as an option
        await database.mealIngredients.destroy({where: {mealId: id}});
        await database.mealIngredients.bulkCreate(records);
        return MealController.findOneFull(id);
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
