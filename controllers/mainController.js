module.exports = {
  index: (req, res) => {
    res.render('index');
  },
  about: (req, res) => {
    res.render('about');
  },
  facilities: (req, res) => {
    res.render('facilities');
  },
  programs: (req, res) => {
    res.render('programs');
  },
  events: (req, res) => {
    res.render('events');
  },
  membership: (req, res) => {
    res.render('membership');
  },
  contacts: (req, res) => {
    res.render('contacts');
  },
  respondWithForm: (req, res) => {
    res.render('thankYou');
  },
};
