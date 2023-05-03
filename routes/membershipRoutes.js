// Weidong
const router = require('express').Router();
const membershipsController = require('../controllers/membershipController');
const usersController = require('../controllers/userController');

// jobs Routes
// add usersController.isLoggedIn later
router.get('/', membershipsController.index, membershipsController.indexView);
router.get('/new', usersController.isLoggedIn, usersController.isAdmin,membershipsController.new);
router.post(
    '/create',
    usersController.isLoggedIn,
    usersController.isAdmin,
    membershipsController.create,
    membershipsController.redirectView,
);
router.get('/:id', membershipsController.show, membershipsController.showView);
router.get('/:id/edit', usersController.isLoggedIn, membershipsController.edit);
router.put(
    '/:id/update',
    usersController.isLoggedIn,
    usersController.isAdmin,
    membershipsController.update,
    membershipsController.redirectView,
);
router.delete(
    '/:id/delete',
    usersController.isLoggedIn,
    usersController.isAdmin,
    membershipsController.delete,
    membershipsController.redirectView,
);

router.post(
    '/:id/buy',
    usersController.isLoggedIn,
    membershipsController.buy,
    membershipsController.redirectView,
);
module.exports = router;
