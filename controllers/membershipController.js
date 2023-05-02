const Membership = require('../model/membership');
const User = require('../model/user');

// Function to get membership parameters from request body and locals
const getMembershipParams = (body) => {
  return {
    type: body.type,
    duration: body.duration,
    price: body.price,
  };
};

// Define route handlers
module.exports = {
  // GET route for displaying all membership
  index: (req, res, next) => {
    Membership.find({})
        .then((membership) => {
          res.locals.memberships = membership;
          next();
        })
        .catch((error) => {
          console.log(`Error fetching memberships: ${error.message}`);
          next(error);
        });
  },
  // GET route for rendering membership index page
  indexView: (req, res) => {
    res.render('membership/index');
  },
  // GET route for rendering new membership form
  new: (req, res) => {
    res.render('membership/new');
  },
  // POST route for creating a new event
  create: (req, res, next) => {
    if (req.skip) return next();
    const newmembership = new Membership(getMembershipParams(req.body));
    newmembership
        .save()
        .then((membership) => {
          req.flash('success', `${membership.name} was posted successfully!`);
          res.locals.redirect = '/memberships';
          next();
        })
        .catch((error) => {
          req.flash('error', `Failed to create a new membership because: ${error.message}.`);
          res.locals.redirect = '/membership/new';
          next();
        });
  },
  // Middleware to handle redirect after POST requests
  redirectView: (req, res, next) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  // GET route for displaying a single membership
  show: (req, res, next) => {
    const membershipId = req.params.id;
    Membership.findById(membershipId)
        .then((membership) => {
          res.locals.membership = membership;
          next();
        })
        .catch((error) => {
          console.log(`Error fetching membership by ID: ${error.message}`);
          next(error);
        });
  },
  // GET route for rendering single membership page
  showView: (req, res) => {
    res.render('membership/show');
  },
  // GET route for rendering membership edit form
  edit: (req, res, next) => {
    const membershipId = req.params.id;
    Membership.findById(membershipId)
        .then((membership) => {
          res.render('membership/edit', {
            membership: membership,
          });
        })
        .catch((error) => {
          console.log(`Error fetching membership by ID: ${error.message}`);
          next(error);
        });
  },
  // PUT route to update the membership
  update: (req, res, next) => {
    const membershipId = req.params.id;
    const membershipParams = getMembershipParams(req.body);
    console.log('hi I am here');
    Membership.findByIdAndUpdate(membershipId, {
      $set: membershipParams,
    })
        .then((membership) => {
          res.locals.redirect = `/memberships/${membershipId}`;
          res.locals.membership = membership;
          next();
        })
        .catch((error) => {
          console.log(`Error updating membership by ID: ${error.message}`);
          next(error);
        });
  },
  // DELETE route to delete a event
  delete: (req, res, next) => {
    console.log('I am here delete');
    const membershipId = req.params.id;
    Membership.findByIdAndRemove(membershipId)
        .then(() => {
          res.locals.redirect = '/memberships';
          next();
        })
        .catch((error) => {
          console.log(`Error deleting membership by ID: ${error.message}`);
          next();
        });
  },
  buy: (req, res, next) => {
    const membershipId = req.params.id;
    User.findByIdAndUpdate(res.locals.currentUser._id, {
      $addToSet: {memberships: membershipId},
    },
    ).then((user) => {
      req.flash(
          'success',
          `${user.name} buy memberhsip successfully!`,
      );
      res.locals.redirect = `/users/${res.locals.currentUser._id}`;
      next();
    })
        .catch((error) => {
          console.log(`Error : ${error.message}`);
          next(error);
        });
  },
  // validate the form data
  validate: (req, res, next) => {
    req.check('type', 'Type cannot be empty').notEmpty();
    req.check('duration', 'Duration cannot be empty').notEmpty();
    req.check('price', 'Price can not be empty').notEmpty();
    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        const messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash('error', messages);
        if (req.method === 'PUT') {
          console.log('error put');
          const membershipId = req.params.id;
          res.redirect(`/memberships/${membershipId}/edit`);
        } else {
          res.locals.redirect = '/memberships/new';
          next();
        }
      } else {
        next();
      }
    });
  },
};
