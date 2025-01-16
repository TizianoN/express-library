const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");

router.get("/", booksController.index);
router.get("/:id", booksController.show);
router.get("/:id/reviews", booksController.getReviewsByBookId);
router.post("/:id/reviews", booksController.storeReviewByBookId);

module.exports = router;