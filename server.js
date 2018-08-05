const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const session = require('express-session');


//set the port
const port = 5000;


//require the database file
require('./db/db')



//use MiddleWare
app.use(session({
	secret: '9fajdf9urajdkfaskfjip9jkjkaldjsf2o3aaksdf2342342sdfwfkjafaf',
	resave: false, //only save when the session object has been modified
	saveUninitialized: false //user for login sessions, we only want to save when we modify the session
}));
app.use(bodyParser.urlencoded({extended: false}));




//setup the port to listen on set port
app.listen(port, () => {
	console.log(`Server is listening on port: ${port}`)
})