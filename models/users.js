var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

///////// USER SCHEMA //////////
var userSchema = mongoose.Schema({

  local            : {
    display_name : String,
    email        : String,
    password     : String
  }

});

////////// METHODS //////////

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
