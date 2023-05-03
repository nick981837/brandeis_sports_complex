// Hiro
const Contact = require('../model/contact');
const User = require('../model/user');

// Function to get contact parameters from request body and locals
const getContactParams = (body) => {
  return {
    name: body.name,
    email: body.email,
    subject: body.subject,
    message: body.message,
  };
};

// Define route handlers
module.exports = {
  // GET route for displaying all contacts
  index: (req, res, next) => {
    Contact.find({})
        .then((contact) => {
          res.locals.contacts = contact;
          next();
        })
        .catch((error) => {
          console.log(`Error fetching contacts: ${error.message}`);
          next(error);
        });
  },
  // GET route for rendering contact index page
  indexView: (req, res) => {
    res.render('contact/index');
  },
  // GET route for rendering new contact form
  new: (req, res) => {
    res.render('contact/new');
  },
  // POST route for creating a new contact
  create: (req, res, next) => {
    if (req.skip) return next();
    const newcontact = new Contact(getContactParams(req.body));
    newcontact
        .save()
        .then((contact) => {
          req.flash('success', `${contact.name} was posted successfully!`);
          res.locals.redirect = '/contacts';
          next();
        })
        .catch((error) => {
          req.flash('error', `Failed to create a new contact because: ${error.message}.`);
          res.locals.redirect = '/contacts/new';
          next();
        });
  },
  // Middleware to handle redirect after POST requests
  redirectView: (req, res, next) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  // GET route for displaying a contact alone
  show: (req, res, next) => {
    const contactId = req.params.id;
    Contact.findById(contactId)
        .then((contact) => {
          res.locals.contact = contact;
          next();
        })
        .catch((error) => {
          console.log(`Error fetching contact by ID: ${error.message}`);
          next(error);
        });
  },
  // GET route for rendering an contact page
  showView: (req, res) => {
    res.render('contact/show');
  },
  // GET route for rendering contact edit form
  edit: (req, res, next) => {
    const contactId = req.params.id;
    Contact.findById(contactId)
        .then((contact) => {
          res.render('contact/edit', {
            contact: contact,
          });
        })
        .catch((error) => {
          console.log(`Error fetching contact by ID: ${error.message}`);
          next(error);
        });
  },
  // PUT route to update the contact message
  update: (req, res, next) => {
    const contactId = req.params.id;
    const contactParams = getContactParams(req.body);
    console.log('hi I am here for contact');
    Contact.findByIdAndUpdate(contactId, {
      $set: contactParams,
    })
        .then((contact) => {
          res.locals.redirect = `/contacts/${contactId}`;
          res.locals.contact = contact;
          next();
        })
        .catch((error) => {
          console.log(`Error updating contact by ID: ${error.message}`);
          next(error);
        });
  },
  // DELETE route to delete a contact
  delete: (req, res, next) => {
    console.log('I am here delete a contact');
    const contactId = req.params.id;
    Contact.findByIdAndRemove(contactId)
        .then(() => {
          res.locals.redirect = '/contacts';
          next();
        })
        .catch((error) => {
          console.log(`Error deleting contact by ID: ${error.message}`);
          next();
        });
  },
  
  
  // validate the form data
  validate: (req, res, next) => {
    req.check('name', 'Name cannot be empty').notEmpty();
    req.check('email', 'email cannot be empty').notEmpty();
    req.check('subject', 'Subject cannot be empty').notEmpty();
    req.check('message', 'Message cannot be empty').notEmpty();

    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        const messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash('error', messages);
        if (req.method === 'PUT') {
          console.log('error put');
          const contactId = req.params.id;
          res.redirect(`/contacts/${contactId}/edit`);
        } else {
          res.locals.redirect = '/contacts/new';
          next();
        }
      } else {
        next();
      }
    });
  },
};