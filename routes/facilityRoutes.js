const facilityController = require('../controllers/facilityController');
const router = require('express').Router();
const expressValidator = require('express-validator');
router.use(expressValidator());
const connectFlash = require('connect-flash');
const expressSession = require('express-session');
const methodOverride = require('method-override');
router.use(connectFlash());
const usersController = require("../controllers/userController");
router.use(
    expressSession({
      secret: 'secret_passcode',
      cookie: {
        maxAge: 40000,
      },
      resave: false,
      saveUninitialized: false,
    }),
);
router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
router.use(
    methodOverride('_method', {
      methods: ['POST', 'GET'],
    }),
);
router.use(connectFlash());
// Handle routes for job models
router.get('/', facilityController.index, facilityController.indexView);
router.get('/new', facilityController.new);
router.post('/create', usersController.isAdmin, facilityController.validate, facilityController.create, facilityController.redirectView);
router.get('/:id', facilityController.show, facilityController.showView);
router.get('/:id/edit', usersController.isAdmin, facilityController.edit);
router.put(
    '/:id/update',
    usersController.isAdmin,
    facilityController.validate,
    facilityController.update,
    facilityController.redirectView,
);
router.delete(
    '/:id/delete',
    usersController.isAdmin,
    facilityController.delete,
    facilityController.redirectView,
);

module.exports = router;
