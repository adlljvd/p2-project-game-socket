const { Category, Item } = require('../models')

class CategoryController {
    // category
    static async readCategories(req, res, next) {
        try {
            const category = await Category.findAll({
                include: [
                    {
                        model: Item
                    }
                ]
            })

            res.status(200).json({
                category
            })
        } catch (error) {
            next(error)
        }
    }
    static async addCategories(req, res, next) {
        try {
            const { name, imgUrl } = req.body

            const category = await Category.create({ name, imgUrl }, {
                include: [
                    {
                        model: Item
                    }
                ]
            })

            res.status(201).json({
                message: 'Success add Category',
                category
            })
        } catch (error) {
            next(error)
        }
    }
    static async updateCategories(req, res, next) {
        try {
            const { id } = req.params
            const { name, imgUrl } = req.body

            const findCategory = await Category.findByPk(id)

            if (!findCategory) {
                throw { name: "DataNotFound" }
            }

            const category = await findCategory.update({ name, imgUrl }, {
                where: {
                    id: findCategory.id
                }
            })

            res.status(200).json({
                message: 'Success update Category',
                category
            })
        } catch (error) {
            next(error)
        }
    }
    static async deleteCategories(req, res, next) {
        try {
            const { id } = req.params
            // console.log(id, '<<<<<<<<<<<<<,<<<')
            let category = await Category.findByPk(id)

            // console.log(category, '<<<<<<<<<<<<<<<<<<<<<<<<<')
            if (!category) throw { name: `DataNotFound` }

            await Category.destroy({
                where: {
                    id
                },
                force: true
            })

            res.status(200).json({
                message: 'Success delete Category',
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = CategoryController