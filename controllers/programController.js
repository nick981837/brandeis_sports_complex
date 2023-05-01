const Program = require("../model/program");
// Function to get program parameters from request body and locals
const getProgramParams = (body) => {
  return {
    name: body.name,
    schedule: body.schedule,
    description: body.description,
    instructor: body.instructor
  };
};
// Define route handlers
module.exports = {
  // GET route for displaying all program
  index: (req, res, next) => {
    Program.find({})
      .then((program) => {
        res.locals.program = program;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching programs: ${error.message}`);
        next(error);
      });
  },
  // GET route for rendering program index page
  indexView: (req, res) => {
    res.render("programs/index");
  },
  // GET route for rendering new program form
  new: (req, res) => {
    res.render("programs/new");
  },
  // POST route for creating a new event
  create: (req, res, next) => {
    if (req.skip) return next();
    let newprogram = new Program(getProgramParams(req.body));
    newprogram
      .save()
      .then((program) => {
        req.flash("success", `${program.name} was created successfully!`);
        res.locals.redirect = "/programs";
        next();
      })
      .catch((error) => {
        req.flash("error", `Failed to create a new program because: ${error.message}.`);
        res.locals.redirect = "/programs/new";
        next();
      });
  },
  // Middleware to handle redirect after POST requests
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  // GET route for displaying a single program
  show: (req, res, next) => {
    let programId = req.params.id;
    Program.findById(programId)
      .then((program) => {
        res.locals.program = program;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching program by ID: ${error.message}`);
        next(error);
      });
  },
  // GET route for rendering single program page
  showView: (req, res) => {
    res.render("programs/show");
  },
  // GET route for rendering program edit form
  edit: (req, res, next) => {
    let programId = req.params.id;
    Program.findById(programId)
      .then((program) => {
        res.render("programs/edit", {
          program: program,
        });
      })
      .catch((error) => {
        console.log(`Error fetching program by ID: ${error.message}`);
        next(error);
      });
  },
  // PUT route to update the program
  update: (req, res, next) => {
    let programId = req.params.id,
      programParams = getProgramParams(req.body);
    Program.findByIdAndUpdate(programId, {
      $set: programParams,
    })
      .then((program) => {
        req.flash("success", `${program.name} was updated successfully!`);
        res.locals.redirect = `/programs/${programId}`;
        res.locals.program = program;
        next();
      })
      .catch((error) => {
        console.log(`Error updating program by ID: ${error.message}`);
        next(error);
      });
  },
  // DELETE route to delete a event
  delete: (req, res, next) => {
    let programId = req.params.id;
    Program.findByIdAndRemove(programId)
      .then(() => {
        req.flash("success", `Program was deleted successfully!`);
        res.locals.redirect = "/programs";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting program by ID: ${error.message}`);
        next();
      });
  },
  // validate the form data
  validate: (req, res, next) => {
    req.check("name", "Name cannot be empty").notEmpty();
    req.check("schedule", "Schedule cannot be empty").notEmpty();
    req.check("instructor", "Instructor cannot be empty").notEmpty();
    req.check("description", "Description can not be empty").notEmpty();
    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash("error", messages);
        console.log(messages);
        if (req.method === "PUT") {
          let programId = req.params.id;
          res.redirect(`/programs/${programId}/edit`);
        }
        else {
          res.locals.redirect = "/programs/new";
          next();
        }
      } else {
        next();
      }
    });
  },
};