const Facility = require("../model/facility");
// Function to get facility parameters from request body and locals
const getFacilityParams = (body) => {
  return {
    name: body.name,
    type: body.type,
    description: body.description,
  };
};
// Define route handlers
module.exports = {
  // GET route for displaying all facility
  index: (req, res, next) => {
    Facility.find({})
      .then((facility) => {
        res.locals.facility = facility;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching facilities: ${error.message}`);
        next(error);
      });
  },
  // GET route for rendering facility index page
  indexView: (req, res) => {
    res.render("facility/index");
  },
  // GET route for rendering new facility form
  new: (req, res) => {
    res.render("facility/new");
  },
  // POST route for creating a new event
  create: (req, res, next) => {
    if (req.skip) return next();
    let newfacility = new Facility(getFacilityParams(req.body));
    newfacility
      .save()
      .then((facility) => {
        req.flash("success", `${facility.name} was posted successfully!`);
        res.locals.redirect = "/facilities";
        next();
      })
      .catch((error) => {
        req.flash("error", `Failed to create a new facility because: ${error.message}.`);
        res.locals.redirect = "/facility/new";
        next();
      });
  },
  // Middleware to handle redirect after POST requests
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  // GET route for displaying a single facility
  show: (req, res, next) => {
    let facilityId = req.params.id;
    Facility.findById(facilityId)
      .then((facility) => {
        res.locals.facility = facility;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching facility by ID: ${error.message}`);
        next(error);
      });
  },
  // GET route for rendering single facility page
  showView: (req, res) => {
    res.render("facility/show");
  },
  // GET route for rendering facility edit form
  edit: (req, res, next) => {
    let facilityId = req.params.id;
    Facility.findById(facilityId)
      .then((facility) => {
        res.render("facility/edit", {
          facility: facility,
        });
      })
      .catch((error) => {
        console.log(`Error fetching facility by ID: ${error.message}`);
        next(error);
      });
  },
  // PUT route to update the facility
  update: (req, res, next) => {
    let facilityId = req.params.id,
      facilityParams = getFacilityParams(req.body);
    Facility.findByIdAndUpdate(facilityId, {
      $set: facilityParams,
    })
      .then((facility) => {
        res.locals.redirect = `/facilities/${facilityId}`;
        res.locals.facility = facility;
        next();
      })
      .catch((error) => {
        console.log(`Error updating facility by ID: ${error.message}`);
        next(error);
      });
  },
  // DELETE route to delete a event
  delete: (req, res, next) => {
    let facilityId = req.params.id;
    Facility.findByIdAndRemove(facilityId)
      .then(() => {
        res.locals.redirect = "/facilities";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting facility by ID: ${error.message}`);
        next();
      });
  },
  // validate the form data
  validate: (req, res, next) => {
    req.check("name", "Name cannot be empty").notEmpty();
    req.check("type", "Type cannot be empty").notEmpty();
    req.check("description", "Description can not be empty").notEmpty();
    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash("error", messages);
        if (req.method === "PUT") {
          console.log("error put");
          let facilityId = req.params.id;
          res.redirect(`/facilities/${facilityId}/edit`);
        }
        else {
          
          res.locals.redirect = "/facilities/new";
          next();
        }
      } else {
        next();
      }
    });
  },
};