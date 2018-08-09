const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
	title: {type: String, required: true},
	category: [{type: String, required: true}],
	pay: Number,
	location: {type: Object},
	phone: String,
	body: String,
	datePosted: {type: Number, default: Date.now()},
	ownerID: String
})


module.exports = mongoose.model('Job', jobSchema);
