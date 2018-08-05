const express = require('express');
const router = express.Router(); 

const User = require('../models/user');
const Job = require('../models/job');



const bcrypt = require('bcrypt');

//User Login //
router.post('/login', async (req, res) => {
	try{

		const foundUser = await User.findOne({username: req.body.username});
		//if found user, then compare password with that of foundUser
		if(foundUser && bcrypt.compareSync(req.body.password, foundUser.password)) {
			req.session.userID = foundUser.id;
			req.session.username = foundUser.username;
			req.session.loggedIn = true;

			res.json({
				status: 200,
				data: foundUser
			})
		} else {
			res.json({
				status: 404,
				data: 'Username or Password Incorrect'
			})
		}
	} catch (err) {
		res.json({
			status: 404,
			data: err
		})
	}
})


//Create New User //
router.post('/register', async (req, res) => {
	try{

		const password = req.body.password;
	    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

	    // Create an object to enter into the User model. 
	    const userDbEntry = {};
	    userDbEntry.username = req.body.username;
	    userDbEntry.password = passwordHash;

	    //create new user in database
	    const createdUser = await User.create(userDbEntry);

	} catch (err) {
		res.json({
			status: 404,
			data: err
		})
	}


})





// Logging out // 
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if(err) {
      res.send('error destroying session')
    } else {
      res.redirect('/user')
    }
  });
});




module.exports = router;