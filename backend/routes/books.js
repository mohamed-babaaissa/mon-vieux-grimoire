const express = require("express");
const router = express.Router();
const booksCtrl = require("../controllers/books"); // Assure-toi que ce fichier existe et est bien importé
const { upload, resizeImage } = require("../middleware/multer-config");
const auth = require("../middleware/auth");

router.post("/", auth, upload, resizeImage, booksCtrl.createBook);
router.post("/:id/rate", auth, booksCtrl.rateBook);
router.get("/bestrating", auth, booksCtrl.getBestRatedBooks);
router.get("/", auth, booksCtrl.getAllBooks);
router.get("/:id", auth, booksCtrl.getBookById);
router.put("/:id", auth, upload, resizeImage, booksCtrl.updateBook);
router.delete("/:id", auth, booksCtrl.deleteBook);

module.exports = router;





