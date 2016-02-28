var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    _posterId: {type: String, ref: 'User'},
    title: String,
    gameName: String,
    systemName: String,
    description: String,
    location: String

});

module.exports = mongoose.model('Post', postSchema);