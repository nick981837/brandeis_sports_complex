const programController = require('../controllers/programController');
const router = require('express').Router();
const expressValidator = require('express-validator');
router.use(expressValidator());
const connectFlash = require('connect-flash');
const expressSession = require('express-session');
const methodOverride = require('method-override');
const usersController = require("../controllers/userController");
router.use(connectFlash());
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
router.get('/', programController.index, programController.indexView);
router.get('/new', programController.new);
router.post('/create', usersController.isAdmin, programController.validate, programController.create, programController.redirectView);
router.get('/:id', programController.show, programController.showView);
router.get('/:id/edit', usersController.isAdmin,programController.edit);
router.put(
    '/:id/update',
    usersController.isAdmin,
    programController.validate,
    programController.update,
    programController.redirectView,
);
router.delete(
    '/:id/delete',
    usersController.isAdmin,
    programController.delete,
    programController.redirectView,
);

module.exports = router;
