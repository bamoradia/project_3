import express from 'express';
const app = express();

//set the port
const port = 4000;


//require the database file
require('./db/db')






//setup the port to listen on set port
app.listen(port, () => {
	console.log(`Server is listening on port: ${port}`)
})