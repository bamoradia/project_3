const mongoose = require('mongoose');


const time = new Date();

const jobSchema = mongoose.Schema({
	title: {type: String, required: true},
	category: [{type: String, required: true}],
	pay: Number,
	location: [{type: String}],
	phone: String,
	body: String,
	datePosted: {type: Date, default: time},
	ownerID: String
})


module.exports = mongoose.model('Job', jobSchema);