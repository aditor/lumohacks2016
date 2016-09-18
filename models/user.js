// Call the mongoose library
var mongoose = require('mongoose');
// Create a hash for passwords, a call on the bcrypt library
var bcrypt = require('bcrypt-nodejs');
// Use this schema for database storage of a User data
var Schema = mongoose.Schema;

/* The user Schema attributes / characteristics / fields in JSON format */
var UserSchema = new Schema({
  "username": { type: String, unique: true, lowercase: true},
  "email": { type: String, unique: true, lowercase: true},
  "password": {type: String},
  "profile": [{
    "name": { type: String, default: ''},
    "picture": { type: String, default: ''},
    "marital status": {type : String, default: "Unmarried"}
  }],
  "address": {type: String},
  "history": [{
    "admissiondate": {type: Date},
    // item: { type:Schema.Types.ObjectId, ref: ''},
  }]
});

/* Hash the password before saving it in the database */
UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/* Compare user and database password */
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}


module.exports = mongoose.model('User', UserSchema);
