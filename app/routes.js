//Models
var Token = require('../models/token.js');
var User = require('../models/users.js');
var Post = require('../models/post.js');

//Dependencies
var express = require('express');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var options = multer.diskStorage({ destination : 'public/uploads/' ,
  filename: function (req, file, cb) {
    cb(null, (Math.random().toString(36)+'00000000000000000').slice(2, 10) + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({ storage: options });


module.exports = function(app, passport){

  app.post('/api/login', function(req, res) {
    passport.authenticate('local-login', {failureFlash: true}, function(err, user, info) {

      //an error was encountered (ie. no database available)
      if (err) {
        return next(err);

      }
      //a user wasn't returned; this means that the user isn't available, or the login information is incorrect
      if (!user) {
        return res.json({
          'loginstatus' : 'failure',
          'message' : info.message
        });
      }
      else {
        //success!  create a token and return the successful status and the if of the logged in user

        // create a token (random 64 character string)
        var token = Math.round((Math.pow(36, 64 + 1) - Math.random() * Math.pow(36, 64))).toString(36).slice(1);
        // add the token to the database
        Token.create({

          user_id: user.id,
          token: token
        }, function(err, tokenRes) {
          if (err)
            res.send(err);

          return res.json({
            'loginstatus' : 'success',
            'userid' : user.id,
            'token' : token
          });
        });
      }

    })(req, res);

  });

  app.post('/api/signup', function(req, res){
    passport.authenticate('local-signup', {failureFlash: true}, function(err, user){

      //Do an error check
      if (err){
        return next(err)
      }

      else{
        //success!  create a token and return the successful status and the if of the logged in user

        // create a token (random 64 character string)
        var token = Math.round((Math.pow(36, 64 + 1) - Math.random() * Math.pow(36, 64))).toString(36).slice(1);

        // add the token to the database
        Token.create({
          user_id: user.id,
          token: token
        }, function(err, tokenRes) {
          if (err)
            res.send(err);

          return res.json({
            'signupstatus' : 'success',
            'userid' : user.id,
            'token' : token
          });
        });
      }
    })(req,res);
  });

// authenticates a userid/token combination
  app.post('/api/authlogin', function(req, res) {

    if (!req.param('user_id') || !req.param('token')) {

      // user_id/token combination not complete, return invalid
      return res.json({ status: 'error'});
    }

    // attempt to retrieve the token info
    Token.find({
      user_id: req.param('user_id'),
      token: req.param('token')
    }, function(err, tokenRes) {
      if (err)
        return res.json(err);

      // not found
      if (!tokenRes || tokenRes.length <= 0) {
        return res.json({ status: 'error'});
      }

      // all checks pass, we're good!
      return res.json({ status: 'success'});
    });
  });

app.post('/api/post', upload.single('file'), function(req,res){
  var newPost = new Post();
  newPost._posterId = req.body.user_id;
  newPost.title = req.body.title;
  newPost.rooms = req.body.rooms;
  newPost.price = req.body.price;
  newPost.wifi = req.body.wifi;
  newPost.pets = req.body.pets;
  newPost.parking = req.body.parking;
  newPost.laundry = req.body.laundry;
  newPost.furnished = req.body.furnished;
  newPost.smoking = req.body.smoking;
  console.log(req.body);
  console.log(newPost);
  if (req.file.filename != "") {

    newPost.content = req.file.filename;
  }
  else {

    // No image, save with the empty image variable
    newPost.content = "";
  }

  newPost.save(function(err){
    if(err){
      throw err;
    }

    var returnJson = {};
    returnJson.status = "success";
    return res.json(returnJson);
    });

  });

app.delete('/api/post/:post_id', function(req, res){
  Post.remove({
    _id: req.params.post_id
  }, function(err, post){
    if (err)
      res.send(err);

    Post.find(function(err, posts){
      if(err)
        res.send(err);
      res.json(posts);
    });
  });
});

app.get('/api/post', function(req,res){
  Post.find({}).sort('-date').exec(function(err, posts){
    if(err){
      console.log(err);
    }
    else{
      return res.json(posts);
    }
  })

});

  
};


// route middleware for API
function isApiLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  else if (req.body.user_id && req.body.token) {
    Token.find({
      user_id: req.body.user_id,
      token: req.body.token
    }, function(err, tokenRes) {
      if (err)
        res.send({ status: 'error', message: "why aren't you logged in?"});

      // not found
      if (!tokenRes) {
        res.send({ status: 'error', message: "why aren't you logged in?"});
      }

      // all checks pass, we're good!
      return next();
    });
  }
  else {
    res.send({ status: 'error', message: "why aren't you logged in?"});
  }
}
