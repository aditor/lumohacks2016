var router = require('express').Router();
var User = require('../models/user');
var Home = require('../models/home');
var Cart = require('../models/cart');
var async = require('async');
var passport = require('passport');
var passportConf = require('../config/passport');

var sendJSONResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};


//home
router.post('/user/userid/home', function (req, res) {
  if (!req.params.userid || !req.params.homeid) {
    sendJSONResponse(res, 404, {"message": "Not found, userid and homeid are both required"});
    return;
  }
  User
  .findById(req.params.userid)  //find parent doc
  .select('home')
  .exec(
    function(err, user) {
      var thisHome;
      if (!user) {
        sendJSONResponse(res, 404, {"message": "userid not found"});
        return;
      } else if (err) {
        sendJSONResponse(res, 400, err);
        return;
      }
      if (user.home) {
          //find subdocument
          thisHome = user.home.id(req.params.homeid);
          if (!thisHome) {
            sendJSONResponse(res, 404, {"message": "homeid not found"});
          }
          else {
              thisHome.log = req.body.log;

              user.save(function(err, user) {
                if (err) {
                  sendJSONResponse(res, 404, err);
                }
                else {
                  sendJSONResponse(res, 200, thisHome);
                }
              });
            }
        }
      else {
          sendJSONResponse(res, 404, {"message": "No home to update"});
      }
    }
  );
}); //need

router.get('/user/userid/home/:homeid', function (req, res) {
  if(req.params && req.params.userid && req.params.homeid){
    User.findById(req.params.userid).select('profile.name home').exec(function(err,user) {
                                       //select is mongoose
                                       //method for getting
                                       //ONLY a name and home
                                       //of a location
        var response, home;
        if(!user){
          sendJSONResponse(res, 404, {"message":"userid not found"});
          return;
        } else if(err){
          sendJSONResponse(res, 404, err);
          return;
        }
        //check if returned location HAS reviews
        if(user.home){
          //method .id RETURNS the single matching SUBdocument
          home = user.home.id(req.params.homeid);
            if(!home){
              sendJSONResponse(res, 404, {"message":"homeid not found"});
            }
            else{
              response = {user : { name : user.profile.name,
                                   id : req.params.userid},
                          home : home};
              sendJSONResponse(res, 200, response);
            }
        }
        else {
          sendJSONResponse(res, 404, {"message" : "No home found"});
        }
    });
  }else {
    sendJSONResponse(res, 404, {"message":"Not found, userid and homeid both required"});
  }
});

router.put('/user/userid/home/:homeid', function (req, res) {
  if (!req.params.userid || !req.params.homeid) {
    sendJSONResponse(res, 404, {"message": "Not found, userid and homeid are both required"});
    return;
  }
  User
  .findById(req.params.userid)  //find parent doc
  .select('home')
  .exec(
    function(err, user) {
      var thisHome;
      if (!user) {
        sendJSONResponse(res, 404, {"message": "userid not found"});
        return;
      } else if (err) {
        sendJSONResponse(res, 400, err);
        return;
      }
      if (user.home) {
          //find subdocument
          thisHome = user.home.id(req.params.homeid);
          if (!thisHome) {
            sendJSONResponse(res, 404, {"message": "homeid not found"});
          }
          else {
              thisHome.log = req.body.log;

              user.save(function(err, user) {
                if (err) {
                  sendJSONResponse(res, 404, err);
                }
                else {
                  sendJSONResponse(res, 200, thisHome);
                }
              });
            }
        }
      else {
          sendJSONResponse(res, 404, {"message": "No home to update"});
      }
    }
  );
});

router.delete('/user/userid/home/:homeid', function (req, res) {
  if (!req.params.userid || !req.params.homeid) {
    sendJSONResponse(res, 404, {"message": "Not found, userid and homeid are both required"});
    return;
  }
  User
    .findById(req.params.userid)
    .select('home')
    .exec(
      function(err, user) {
        if (!user) {
          sendJSONResponse(res, 404, {"message": "userid not found"});
          return;
        }
        else if (err) {
          sendJSONResponse(res, 400, err);
          return;
        }
        if (user.home) {
          if (!user.home.id(req.params.homeid)) {
            sendJSONResponse(res, 404, {"message": "homeid not found"});
          }
          else {
            user.home.id(req.params.homeid).remove();
            user.save(function(err) {
              if (err) {
               sendJSONResponse(res, 404, err);
              }
              else {
                sendJSONResponse(res, 204, null);
              }
            });
          }
        }
        else {
         sendJSONResponse(res, 404, {"message": "No home to delete"});
        }
      }
    );
});

// medications
router.post('/user/userid/home/:homeid/med', ctrlMed.medCreate);
router.get('/user/userid/home/:homeid/med/:medid', ctrlMed.medReadOne);
router.put('/user/userid/home/:homeid/med/:medid', ctrlMed.medUpdateOne);
router.delete('/user/userid/home/:homeid/med/:medid', ctrlMed.medDeleteOne);


// lifestyle
router.post('/user/userid/home/:homeid/lifestyle', ctrlLifestyle.lifestyleCreate);
router.get('/user/userid/home/:homeid/lifestyle/:lifestyleid', ctrlLifestyle.lifestyleReadOne);
router.put('/user/userid/home/:homeid/lifestyle/:lifestyleid', ctrlLifestyle.lifestyleUpdateOne);
router.delete('/user/userid/home/:homeid/lifestyle/:lifestyleid', ctrlLifestyle.lifestyleDeleteOne);
