var mongoose = require('mongoose');

module.exports = mongoose.model('Token', {
  user_id: String,
  token: String
});
