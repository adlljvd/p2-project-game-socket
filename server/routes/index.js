const CategoryController = require('../controllers/categoryController')
const itemController = require('../controllers/itemController')
const RoomController = require('../controllers/roomController')

const router = require('express').Router()

router.get('/', CategoryController.readCategories)
router.post('/', CategoryController.addCategories)
router.put('/:id', CategoryController.updateCategories)
router.delete('/:id', CategoryController.deleteCategories)


// items
router.get('/items', itemController.readItems)
router.post('/items', itemController.addItems)
router.put('/items/:id', itemController.updateItems)
router.delete('/items/:id', itemController.deleteItem)

// rooms
router.get('/rooms', RoomController.read)
router.post('/rooms', RoomController.add)
router.put('/rooms/:id', RoomController.update)
router.delete('/rooms/:id', RoomController.delete)

module.exports = router