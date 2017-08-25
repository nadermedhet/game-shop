var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var adminSchema = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true}
});

adminSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
};

adminSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);  
};


var User =module.exports = mongoose.model('admin', adminSchema);



module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	
     return bcrypt.compareSync(password, this.password); 
}