const User = require("../model/user");
const passport = require("passport");

const getUserParams = (body) => {
  return {
    name: body.name,
    email: body.email,
    memberships: body.memberships,
    isAdmin: body.isAdmin,
  };
};

module.exports = {
  // get /users
  // only available to admins
  index: (req, res, next) => {
    User.find()
      .then((users) => {
        res.locals.users = users;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },

  indexView: (req, res) => {
    res.render("users/index");
  },

  // get /users/new
  new: (req, res) => {
    res.render("users/new");
  },
  // post //users/new
  create: (req, res, next) => {
    if (req.skip) return next();
    const newUser = new User(getUserParams(req.body));
    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        req.flash("success", `${user.name}'s account created successfully!`);
        res.locals.redirect = "/";
        next();
      } else {
        req.flash(
          "error",
          `Failed to create user account because: ${error.message}.`
        );
        res.locals.redirect = "/users/new";
        next();
      }
    });
  },

  redirectView: (req, res, next) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  // get /users/:id
  // Can only view own id unless admin
  show: (req, res, next) => {
    const userId = req.params.id;
    User.findById(userId)
      .populate("memberships")
      .then((user) => {
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    const user = res.locals.user; // Get user object from res.locals
    res.render("users/show", { user });
  },

  // get /users/:id/edit
  edit: (req, res, next) => {
    const userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        res.render("users/edit", {
          user: user,
        });
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  // put /users/:id/update
  update: (req, res, next) => {
    const userId = req.params.id;
    const userParams = {
      name: req.body.name,
      email: req.body.email,
      memberships: req.body.memberships,
      isAdmin: req.body.isAdmin,
    };
    User.findByIdAndUpdate(userId, {
      $set: userParams,
    })
      .then((user) => {
        req.flash("success", "User successfully updated");
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },

  // delete /users/:id/delete
  delete: (req, res, next) => {
    const userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then(() => {
        req.flash("success", "User successfully deleted");
        res.locals.redirect = "/users";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },

  // get /users/login
  login: (req, res) => {
    res.render("users/login");
  },

  // get /users/logout
  logout: (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "You have been logged out!");
      res.locals.redirect = "/";
      next();
    });
  },

  // Authenticates with passport
  // post /users/login
  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Failed to login.",
    successRedirect: "/",
  }),

  validate: (req, res, next) => {
    req.sanitizeBody("email").trim();
    req.sanitizeBody("email").normalizeEmail({
      all_lowercase: true,
    });
    req.check("email", "Email is invalid").isEmail();
    req.check("password", "Password cannot be empty").notEmpty();
    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        const messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/users/new";
        next();
      } else {
        next();
      }
    });
  },

  // True if logged in
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      req.flash("error", "Please sign in.");
      res.redirect("/users/login");
    }
  },

  // True if isAdmin
  isAdmin: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        next();
      } else {
        req.flash("error", "You are not an admin.");
        res.redirect("/");
      }
    } else {
      req.flash("error", "Please sign in.");
      res.redirect("/users/login");
    }
  },

  // True if requesting user is access own resource or is admin
  isAdminOrSelf: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user._id !== undefined && req.user._id == req.params.id) {
        next();
      } else if (req.user.isAdmin) {
        next();
      } else {
        req.flash("error", "You are not authorized to perform this action.");
        res.redirect("/");
      }
    } else {
      req.flash("error", "Please sign in.");
      res.redirect("/users/login");
    }
  },
};
