const Membership = require("../model/membership");

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
        res.locals.membership = membership;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching memberships: ${error.message}`);
        next(error);
      });
  },
  // GET route for rendering memberhsip index page
  indexView: (req, res) => {
    res.render("memberhsip/index");
  },
  // GET route for rendering new memberhsip form
  new: (req, res) => {
    res.render("memberhsip/new");
  },
  // POST route for creating a new event
  create: (req, res, next) => {
    if (req.skip) return next();
    let newmembership = new Membership(getMembershipParams(req.body));
    newmembership
      .save()
      .then((memberhsip) => {
        req.flash("success", `${memberhsip.name} was posted successfully!`);
        res.locals.redirect = "/memberhsips";
        next();
      })
      .catch((error) => {
        req.flash("error", `Failed to create a new memberhsip because: ${error.message}.`);
        res.locals.redirect = "/memberhsip/new";
        next();
      });
  },
  // Middleware to handle redirect after POST requests
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  // GET route for displaying a single membership
  show: (req, res, next) => {
    let memberhsipId = req.params.id;
    Membership.findById(memberhsipId)
      .then((memberhsip) => {
        res.locals.memberhsip = memberhsip;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching memberhsip by ID: ${error.message}`);
        next(error);
      });
  },
  // GET route for rendering single membership page
  showView: (req, res) => {
    res.render("memberhsip/show");
  },
  // GET route for rendering membership edit form
  edit: (req, res, next) => {
    let memberhsipId = req.params.id;
    Membership.findById(memberhsipId)
      .then((memberhsip) => {
        res.render("memberhsip/edit", {
          memberhsip: memberhsip,
        });
      })
      .catch((error) => {
        console.log(`Error fetching memberhsip by ID: ${error.message}`);
        next(error);
      });
  },
  // PUT route to update the membership
  update: (req, res, next) => {
    let memberhsipId = req.params.id,
      membershipParams = getMembershipParams(req.body);
    Membership.findByIdAndUpdate(memberhsipId, {
      $set: membershipParams,
    })
      .then((memberhsip) => {
        res.locals.redirect = `/memberhsips/${memberhsipId}`;
        res.locals.memberhsip = memberhsip;
        next();
      })
      .catch((error) => {
        console.log(`Error updating memberhsip by ID: ${error.message}`);
        next(error);
      });
  },
  // DELETE route to delete a event
  delete: (req, res, next) => {
    let memberhsipId = req.params.id;
    Membership.findByIdAndRemove(memberhsipId)
      .then(() => {
        res.locals.redirect = "/memberhsips";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting memberhsip by ID: ${error.message}`);
        next();
      });
  },
  // validate the form data
  validate: (req, res, next) => {
    req.check("type", "Type cannot be empty").notEmpty();
    req.check("duration", "Duration cannot be empty").notEmpty();
    req.check("price", "Price can not be empty").notEmpty();
    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash("error", messages);
        if (req.method === "PUT") {
          console.log("error put");
          let memberhsipId = req.params.id;
          res.redirect(`/memberships/${memberhsipId}/edit`);
        }
        else {
          res.locals.redirect = "/memberships/new";
          next();
        }
      } else {
        next();
      }
    });
  },
};