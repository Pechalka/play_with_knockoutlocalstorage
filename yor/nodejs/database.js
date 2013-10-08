var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName : String,
  lastName : String,
  address : String,
  email : String,
  occupation : String,
  postcode : String,
  username : String,
  password : String,
  dateOfBirthday : String,
  active_token :  String , //GUID
  active : { type : Boolean, default : false }
}); 

var MemberSchema = new Schema({
    firstName : String, 
    lastName : String,
    email : String,
    occupation : String,
    relationship :  String,
    accountHolder : Boolean,
    dateOfBirth : String,
    phoneNumber : String
});

exports.User = mongoose.model('User', UserSchema);
exports.Member = mongoose.model('Member', MemberSchema);

exports.connect = function() {
	mongoose.connect('mongodb://localhost/yor');
} 

exports.disconnect = function() {
	mongoose.disconnect(function(err){});
}
