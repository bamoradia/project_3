const mongoose = require('mongoose');
const Job = require('./job');


const userSchema = mongoose.Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	jobs: [Job.schema]
})


module.exports = mongoose.model('User', userSchema);
