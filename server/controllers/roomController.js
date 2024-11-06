const { ROWLOCK } = require('sequelize/lib/table-hints')
const { Room, Category } = require('../models')

class RoomController {
    static async read(req, res, next) {
        try {
            const room = await Room.findAll()
            res.status(200).json({
                room
            })
        } catch (error) {
            next(error)
        }
    }
    static async add(req, res, next) {
        try {
            const { name, status, CategoryId, maxPlayer } = req.body
            const room = await Room.create({ name, status, CategoryId, maxPlayer }, {
                include: [
                    {
                        model: Category
                    }
                ]
            })

            res.status(201).json({
                message: 'Success add new Room',
                room
            })
        } catch (error) {
            next(error)
        }
    }
    static async update(req, res, next) {
        try {
            const { id } = req.params
            const { name, status, CategoryId, maxPlayer } = req.body

            await Room.update({ name, status, CategoryId, maxPlayer }, { where: { id } })

            const findRoom = await Room.findByPk(id)

            if (!findRoom) throw { name: 'DataNotFound' }

            res.status(200).json({
                message: 'Success update room',
                findRoom
            })
        } catch (error) {
            next(error)
        }
    }
    static async delete(req, res, next) {
        try {
            const { id } = req.params
            const room = await Room.findByPk(id)

            if (!room) throw { name: 'DataNotFound' }

            await room.destroy()

            res.status(200).json({
                message: 'Success delete Room'
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = RoomController