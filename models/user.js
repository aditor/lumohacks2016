var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema = mongoose.Schema;

/* The user schema attributes / characteristics / fields */
var UserSchema = new Schema({

  username: { type: String, unique: true, lowercase: true},
  email: { type: String, unique: true, lowercase: true},
  password: String,

  profile: {
    name: { type: String, default: ''},
    address: { type: String, default: ''},
    picture: { type: String, default: ''}
  },

  address: String,
  dateofbirth: Date,
  history: [{
    admissionDate: Date
  }]
});

var medDataSchema = new Schema({
	name: {type: String, required: true},
	description: String,
	dosage: {type: Number, required: true}
});

var medSchema = new Schema();
medSchema.add({
    medicine: [medDataSchema]
});

var date = new Schema({
	date: {type: Date, default: Date.now}
});

var lifestyleSchema = new Schema();
lifestyleSchema.add({
    food: [String],
    discomfort: {type: Number, required: true, min: 0, max: 5},
    createdOn: {type: Date, default: Date.now}
});

//object {} is where we define schema
var homeSchema = new Schema();
	//validation for name: it HAS to be there for every location (required)
	//saving location w/o name would return validation error
homeSchema.add({
  userName: {type: String, required: true},
	medications: [medSchema],
	lifestyle: [lifestyleSchema],
	log: String
});


/*  Hash the password before we even save it to the database */
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

/* compare password in the database and the one that the user type in */
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.gravatar = function(size) {
  if (!this.size) size = 200;
  if (!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
}


module.exports = mongoose.model('User', UserSchema);
