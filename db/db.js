const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/project_3_GA');

mongoose.connection.on('connected', () => {
	console.log('mongoose is connected to mongoDB server.');
});

mongoose.connection.on('error', (err) => {
	console.log(err, 'error connecting to mongoDB server.');
});

mongoose.connection.on('disconnected', () => {
	console.log('mongoose is disconnected from mongoDB server.');
});

