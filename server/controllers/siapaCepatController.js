const { Category, Item } = require('../models')

class SiapaCepatController {

    // category
    static async readCategories(req, res, next) {
        try {
            const category = await Category.findAll()

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

            const category = await Category.create({ name, imgUrl })

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

    // items
    static async readItems(req, res, next) {
        try {
            const items = await Item.findAll()

            res.status(200).json({
                items
            })
        } catch (error) {
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
            next(error)
        }
    }
    static async updateItems(req, res, next) {
        try {
            const { id } = req.params
            const { name, CategoryId } = req.body


            await Item.update({ name, CategoryId }, { where: { id } })

            const findItems = await Item.findByPk(id)
            if (!findItems) throw { name: 'DataNotFound' }

            res.status(200).json({
                message: 'Success update Items',
                findItems
            })
        } catch (error) {
            next(error)
        }
    }
    static async deleteItem(req, res, next) {
        try {
            const { id } = req.params
            const item = await Item.findByPk(id)
            // console.log("masuk");

            if (!item) {
                throw ({ name: "DataNotFound" })
            }
            // console.log("masuk2");

            await item.destroy()

            res.status(200).json({
                message: 'Success delete Category',
            })
        } catch (error) {
            console.log(error, "<<<errorrrrrr");

            next(error)
        }
    }
}

module.exports = SiapaCepatController