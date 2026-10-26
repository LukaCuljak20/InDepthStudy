const express = require("express");
const controller = require("../controllers/eventController");

const router = express.Router();

//Index
router.get("/", controller.index);
//Create [GET]
router.get("/new", controller.newForm);
//Create [POST]
router.post("/", controller.create);
//Details
router.get("/:id", controller.show);
//Edit [GET]
router.get("/:id/edit", controller.editForm);
//Edit [POST]
router.put("/:id", controller.update);
//Delete
router.delete("/:id", controller.destroy);

module.exports = router;
