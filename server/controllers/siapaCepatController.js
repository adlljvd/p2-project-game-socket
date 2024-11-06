const { Category, Item } = require('../models')

class SiapaCepatController {
    static async readCategories(req, res, next) {
        try {
            const category = await Category.findAll()

            res.status(200).json({
                category
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async addCategories(req, res, next) {
        try {
            const { name, imgUrl } = req.body

            const category = await Category.create({ name, imgUrl })

            res.status(201).json({
                message: 'Success add Category',
                category
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async updateCategories(req, res, next) {
        try {
            const { id } = req.params
            const { name, imgUrl } = req.body

            const category = await Category.update({ name, imgUrl }, {
                where: {
                    id
                }
            })

            res.status(200).json({
                message: 'Success update Category',
                category
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async deleteCategories(req, res, next) {
        try {
            const { id } = req.params
            let category = await Category.findByPk(id)

            if (!category) throw { name: `DataNotFound` }

            await Category.destroy({
                where: {
                    id
                }
            })

            res.status(200).json({
                message: 'Success delete Category',
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    // items
    static async readItems(req, res, next) {
        try {
            const items = await Item.findAll()

            res.status(200).json({
                items
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async addItems(req, res, next) {
        try {
            const { name, CategoryId } = req.body

            const items = await Item.create({ name, CategoryId }, {
                include: [
                    {
                        model: Category
                    }
                ]
            })

            res.status(201).json({
                message: 'Success add Item',
                items
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async updateItems(req, res, next) {
        try {
            const { id } = req.params
            const { name, CategoryId } = req.body

            const items = await Item.update({ name, CategoryId }, { where: { id } }, {
                include: [
                    {
                        model: Category
                    }
                ]
            })

            res.status(200).json({
                message: 'Success update Items',
                items
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    static async deleteItem(req, res, next) {
        try {
            const { id } = req.params
            let item = await Item.findByPk(id)

            if (!item) throw { name: `DataNotFound` }

            await Item.destroy({
                where: {
                    id
                }
            })

            res.status(200).json({
                message: 'Success delete Category',
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

module.exports = SiapaCepatController