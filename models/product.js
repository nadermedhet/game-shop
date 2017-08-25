var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description:  String,
    price: {type: String, required: true},
    catagory  : {type : String},
    tumbles : Array
    

});

module.exports = mongoose.model('product', schema);

