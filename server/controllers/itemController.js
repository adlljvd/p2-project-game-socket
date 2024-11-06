const { Category, Item } = require('../models')

class itemController {
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

module.exports = itemController