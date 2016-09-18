var mongoose = require('mongoose');
var Schema = mongoose.Schema;


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

var homeSchema = new Schema();
homeSchema.add({
  userName: {type: String, required: true},
	medications: [medSchema],
	lifestyle: [lifestyleSchema],
	log: String
});

module.exports = mongoose.model('Home', HomeSchema);
