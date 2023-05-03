// Hiro
const router = require('express').Router();
const eventsController = require('../controllers/eventController');
const usersController = require('../controllers/userController');

// jobs Routes
// add usersController.isLoggedIn later
router.get('/', eventsController.index, eventsController.indexView);
router.get('/new', usersController.isLoggedIn, usersController.isAdmin,eventsController.new);
router.post(
    '/create',
    usersController.isLoggedIn,
    usersController.isAdmin,
    eventsController.create,
    eventsController.redirectView,
);
router.get('/:id', eventsController.show, eventsController.showView);
router.get('/:id/edit', usersController.isLoggedIn, eventsController.edit);
router.put(
    '/:id/update',
    usersController.isLoggedIn,
    usersController.isAdmin,
    eventsController.update,
    eventsController.redirectView,
);
router.delete(
    '/:id/delete',
    usersController.isLoggedIn,
    usersController.isAdmin,
    eventsController.delete,
    eventsController.redirectView,
);

module.exports = router;
