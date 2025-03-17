const { Router } = require('express');
const { checkAdmin } = require('../middlewares/auth.middleware'); // Middleware de autorización
const bookController = require('../controllers/book.controller');

const bookRouter = Router();

bookRouter.post('/', checkAdmin, bookController.createBook);
bookRouter.get('/', bookController.getAllBooks);
bookRouter.get('/:isbn', bookController.getBookByISBN);
bookRouter.put('/:isbn', checkAdmin, bookController.updateBook);
bookRouter.delete('/:isbn', checkAdmin, bookController.deleteBook);

module.exports = bookRouter;