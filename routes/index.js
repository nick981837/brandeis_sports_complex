const router = require('express').Router();

const userRoutes = require('./userRoutes');
const errorRoutes = require('./errorRoutes');
const mainRoutes = require('./mainRoutes');
const facilityRoutes = require('./facilityRoutes');
const programRoutes = require('./programRoutes');
const membershipRoutes = require('./membershipRoutes');
const eventRoutes = require('./eventRoutes');

router.use('/users', userRoutes);
router.use('/facilities', facilityRoutes);
router.use('/programs', programRoutes);
router.use('/memberships', membershipRoutes);
router.use('/events', eventRoutes);
router.use('/', mainRoutes);
router.use('/', errorRoutes);

module.exports = router;
