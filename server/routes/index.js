const router = require("express").Router();
const CategoryController = require("../controller/categoryController");
const ParagraphController = require("../controller/ParagraphController");
const RoomController = require("../controller/roomController");

router.get("/categories", CategoryController.readCategories);
router.post("/categories", CategoryController.addCategories);
router.put("/categories/:id", CategoryController.updateCategories);
router.delete("/categories/:id", CategoryController.deleteCategories);


// paragraphs  
router.get("/paragraphs", ParagraphController.read);

router.get("/", RoomController.read);
router.get("/:id", RoomController.readOne);
router.post("/", RoomController.create);
router.patch("/:id", RoomController.updateStatus);
router.delete("/:id", RoomController.delete);

module.exports = router;