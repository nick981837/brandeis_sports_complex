const router = require('express').Router();

const userRoutes = require('./userRoutes');
const errorRoutes = require('./errorRoutes');
const mainRoutes = require('./mainRoutes');
const facilityRoutes = require('./facilityRoutes');
const programRoutes = require('./programRoutes');
const membershipRoutes = require('./membershipRoutes');

router.use('/users', userRoutes);
router.use('/facilities', facilityRoutes);
router.use('/programs', programRoutes);
router.use('/memberships', membershipRoutes);
router.use('/', mainRoutes);
router.use('/', errorRoutes);

module.exports = router;
