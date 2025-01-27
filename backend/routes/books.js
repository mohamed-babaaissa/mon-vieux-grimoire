const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/books');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

router.post('/', auth, multer, booksCtrl.createBook);
router.post('/:id/rate', auth, booksCtrl.rateBook); // Route pour noter un livre
router.get('/bestrating', auth, booksCtrl.getBestRatedBooks);
router.get('/', auth, booksCtrl.getAllBooks);
router.get('/:id', auth, booksCtrl.getBookById);
router.put('/:id', auth, multer, booksCtrl.updateBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;



