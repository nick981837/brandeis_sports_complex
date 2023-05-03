// Hiro
const Event = require('../model/event');
const User = require('../model/user');

// Function to get event parameters from request body and locals
const getEventParams = (body) => {
  return {
    name: body.name,
    description: body.description,
    date: body.date,
    location: body.location,
  };
};

// Define route handlers
module.exports = {
  // GET route for displaying all events
  index: (req, res, next) => {
    Event.find({})
        .then((event) => {
          res.locals.events = event;
          next();
        })
        .catch((error) => {
          console.log(`Error fetching events: ${error.message}`);
          next(error);
        });
  },
  // GET route for rendering event index page
  indexView: (req, res) => {
    res.render('event/index');
  },
  // GET route for rendering new event form
  new: (req, res) => {
    res.render('event/new');
  },
  // POST route for creating a new event
  create: (req, res, next) => {
    if (req.skip) return next();
    const newevent = new Event(getEventParams(req.body));
    newevent
        .save()
        .then((event) => {
          req.flash('success', `${event.name} was posted successfully!`);
          res.locals.redirect = '/events';
          next();
        })
        .catch((error) => {
          req.flash('error', `Failed to create a new event because: ${error.message}.`);
          res.locals.redirect = '/event/new';
          next();
        });
  },
  // Middleware to handle redirect after POST requests
  redirectView: (req, res, next) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  // GET route for displaying a event alone
  show: (req, res, next) => {
    const eventId = req.params.id;
    Event.findById(eventId)
        .then((event) => {
          res.locals.event = event;
          next();
        })
        .catch((error) => {
          console.log(`Error fetching event by ID: ${error.message}`);
          next(error);
        });
  },
  // GET route for rendering an event page
  showView: (req, res) => {
    res.render('event/show');
  },
  // GET route for rendering event edit form
  edit: (req, res, next) => {
    const eventId = req.params.id;
    Event.findById(eventId)
        .then((event) => {
          res.render('event/edit', {
            event: event,
          });
        })
        .catch((error) => {
          console.log(`Error fetching event by ID: ${error.message}`);
          next(error);
        });
  },
  // PUT route to update the event
  update: (req, res, next) => {
    const eventId = req.params.id;
    const eventParams = getEventParams(req.body);
    console.log('hi I am here for event');
    Event.findByIdAndUpdate(eventId, {
      $set: eventParams,
    })
        .then((event) => {
          res.locals.redirect = `/events/${eventId}`;
          res.locals.event = event;
          next();
        })
        .catch((error) => {
          console.log(`Error updating event by ID: ${error.message}`);
          next(error);
        });
  },
  // DELETE route to delete a event
  delete: (req, res, next) => {
    console.log('I am here delete a event');
    const eventId = req.params.id;
    Event.findByIdAndRemove(eventId)
        .then(() => {
          res.locals.redirect = '/eventps';
          next();
        })
        .catch((error) => {
          console.log(`Error deleting event by ID: ${error.message}`);
          next();
        });
  },
  
  
  // validate the form data
  validate: (req, res, next) => {
    req.check('name', 'Name cannot be empty').notEmpty();
    req.check('description', 'Description cannot be empty').notEmpty();
    req.check('date', 'Date can not be empty').notEmpty();
    req.check('location', 'Location can not be empty').notEmpty();

    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        const messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash('error', messages);
        if (req.method === 'PUT') {
          console.log('error put');
          const eventId = req.params.id;
          res.redirect(`/events/${eventId}/edit`);
        } else {
          res.locals.redirect = '/events/new';
          next();
        }
      } else {
        next();
      }
    });
  },
};
