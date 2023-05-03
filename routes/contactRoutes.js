// Hiro
const router = require('express').Router();
const contactsController = require('../controllers/contactController');
const usersController = require('../controllers/userController');

// Contact Routes
router.get('/', contactsController.index, contactsController.indexView);
router.get('/new', contactsController.new);
router.post(
    '/create',
    contactsController.create,
    contactsController.redirectView,
);
router.get('/:id', contactsController.show, contactsController.showView);
router.get('/:id/edit', usersController.isLoggedIn, contactsController.edit);
router.put(
    '/:id/update',
    usersController.isLoggedIn,
    usersController.isAdmin,
    contactsController.update,
    contactsController.redirectView,
);
router.delete(
    '/:id/delete',
    usersController.isLoggedIn,
    usersController.isAdmin,
    contactsController.delete,
    contactsController.redirectView,
);

module.exports = router;