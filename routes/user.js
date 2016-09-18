var router = require('express').Router();
var User = require('../models/user');

// Route for getting a user
// router.get('/signup', function(req, res, next) {
//   res.render('accounts/signup');
// });

// Route for new user
router.post('/signup', function(req, res, next) {
  var user = new User();

  user.username = req.body.username;
  user.profile.name = req.body.name;
  user.password = req.body.password;
  user.email = req.body.email;

// if we create a new user, if the email has been already used, then we send them back to the sign up page
  User.findOne({ email: req.body.email }, function (err, existingUser) {
    if (existingUser) {
      console.log(req.body.email + " already exists");
      return res.redirect('/signup');
    } else {
      user.save(function(err, user) {
        if (err) return next(err);
        res.json("New user has been created");
      });
    }
  });
});
module.exports = router;
