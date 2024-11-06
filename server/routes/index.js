const router = require('express').Router()
const SiapaCepatController = require('../controllers/siapaCepatController')


router.get('/', SiapaCepatController.readCategories)
router.post('/', SiapaCepatController.addCategories)
router.put('/:id', SiapaCepatController.updateCategories)
router.delete('/:id', SiapaCepatController.deleteCategories)


// items
router.get('/items', SiapaCepatController.readItems)
router.post('/items', SiapaCepatController.addItems)
router.put('/items/:id', SiapaCepatController.updateItems)
router.delete('/items/:id', SiapaCepatController.deleteItem)

module.exports = router