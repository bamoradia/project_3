const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Job = require('../models/job');



const bcrypt = require('bcrypt');

// User Login //
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


// Create New User //
router.post('/register', async (req, res) => {
	console.log(req.body)
	try{

		const password = req.body.password;
    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // Create an object to enter into the User model.
    const userDbEntry = {};
    userDbEntry.username = req.body.username;
    userDbEntry.password = passwordHash;

    //create new user in database
    const createdUser = await User.create(userDbEntry);
    req.session.userId = createdUser.id;
  	req.session.username = createdUser.username;
  	req.session.logged = true;

  	//send back user information
  	res.json({
  		status: 200,
  		data: createdUser
  	})

	} catch (err) {
		console.log(err, "this is the error from trying to register");
		res.json({
			status: 404,
			data: err
		})
	}
})


// Edit User //
router.put('/:id', async (req, res) => {
	try{
		//check to ensure user to be updated matches user credentials
		if(req.session.userID === req.params.id) {
			//find user using id hash
			const foundUser = await User.findOne({username: req.body.username});
			//update username
			foundUser.username = req.body.username;
			//hash new password
			const password = req.body.password;
	   		const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
	   		//update new password
	   		foundUser.password = passwordHash;
	   		//save updates to database
	   		await foundUser.save();
	   		//update session info
	   		req.session.username = foundUser.username;
	   		//send back information
	   		req.send({
	   			status: 200,
	   			data: foundUser
	   		})

	   	//send back error if user is not authorized
		} else {
			res.json({
				status: 401,
				data: 'User not authorized'
			})
		}

	} catch (err) {
		res.json({
			status: 404,
			data: err
		})
	}
})


//Delete User //
router.delete('/:id', async (req, res) => {
	try{
		//check to ensure user to be updated matches user credentials
		if(req.session.userID === req.params.id) {
			//find user using id hash
			const foundUser = await User.findOne({username: req.body.username});

			const jobsIdArray = [];
			//make an array of all jobs ids
			for(let i = 0; i < foundUser.jobs.length; i++) {
				jobsIdArray.push(foundUser.jobs[i].id);
			}

			//delete all jobs associated with user
			await User.remove({_id: {$in: jobsIdArray}})

			//delete user
			const removedUser = await User.findByIdAndRemove(req.params.id);

			res.json({
				status: 200,
				data: 'Deleted User'
			})


	   	//send back error if user is not authorized
		} else {
			res.json({
				status: 401,
				data: 'User not authorized'
			})
		}

	} catch (err) {
		res.json({
			status: 404,
			data: err
		})
	}
})




// Logging out //
router.get('/logout', (req, res) => {

	//destroy user's session data
  	req.session.destroy((err) => {
    if(err) {
      res.json({
      	status: 404,
      	data: 'Error with logout'
      })
    } else {
      res.json({
      	status: 200,
      	data: 'Logged out'
      })
    }
  });
});




module.exports = router;
