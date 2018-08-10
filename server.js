const express 	 = require('express');
const app		 = express();
const bodyParser = require('body-parser');
const session 	 = require('express-session');
const cors 		 = require('cors');


//set the port
const port = process.env.PORT || 5000;


//require the database file
require('./db/db')


//add controllers
const userController = require('./controllers/userController');
const jobController = require('./controllers/jobController');


//use MiddleWare
app.use(session({
	secret: '9fajdf9urajdkfaskfjip9jkjkaldjsf2o3aaksdf2342342sdfwfkjafaf',
	resave: false, //only save when the session object has been modified
	saveUninitialized: false, //user for login sessions, we only want to save when we modify the session
	cookie: {
		maxAge: 86400000, 
		secure: false
	}
}));

//setup body parser to read request body information
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//setup cors to allow requests from other servers
const corsOptions = {
  origin: 'http://fine-grind.herokuapp.com',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));


//use controllers
app.use('/api/v1/users', userController);
app.use('/api/v1/jobs', jobController);



//setup the port to listen on set port
app.listen(port, () => {
	console.log(`Server is listening on port: ${port}`)
})
