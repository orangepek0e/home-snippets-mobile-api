var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    _posterId: {type: String, ref: 'User'},
    title: String,
    rooms: String,
    price: String,
    date: {type: Date, default: Date.now},
    content: String,
    wifi: Boolean,
    pets: Boolean,
    parking: Boolean,
    laundry: Boolean,
    furnished: Boolean,
    smoking: Boolean

});

module.exports = mongoose.model('Post', postSchema);