const express = require('express');
const router = express.Router(); 

const User = require('../models/user');
const Job = require('../models/job');



// get all jobs //
router.get('/', async (req, res) => {
	try{	
		//find all jobs
		const allJobs = await Job.find();
		//get the current time in Unix Time Stamp
		const now = Date.now();

		//only return jobs who have been posted within the last 48 hours
		const openJobs = allJobs.map(job => {
			if((now - job.datePosted) < 172800) {
				return job
			}
		})


		res.json({
			status: 200,
			data: openJobs
		})

	} catch (err) {
		console.log(err, 'error with get route')
		res.json({
			status: 400, 
			data: 'Error with Job Get Route'
		})
	}
})

// Create new job //
router.post('/', async (req, res) => {
	try{
		if(req.session.loggedIn) {
			//make the ownerID the same as the userID
			req.body.userID = req.session.userID;
			//find the User 
			const foundUser = await User.findById(req.session.userID);
			//add the job to the user's job array
			foundUser.jobs.push(req.body);
			await foundUser.save();
			//create the new job in the Jobs model
			const newJob = await Job.create(req.body);

			res.json({
				status: 200,
				data: newJob
			})

		} else {
			res.json({
				status: 403, 
				data: 'Unauthorized Action'
			})
		}
	} catch (err) {
		res.json({
			status: 400, 
			data: 'Error with create job route'
		})
	}
})

// Delete Job //
router.delete('/:id', async (req, res) => {
	try{
		const foundJob = await Job.findById(req.params.id)
		//check if requested job has same userID as user making request
		if(req.session.userID === foundJob.ownerID) {
			const foundUser = await User.findById(req.session.userID);

			//remove the requested job from the user's array
			foundUser.jobs = foundUser.jobs.filter(job => job._id !== req.params.id)
			await foundUser.save();
			//remove the job from the Job model
			const removedJob = await Job.findByIdAndRemove(req.params.id);

			res.json({
				status: 200,
				data: 'Deleted Job'
			})

		} else {
			res.json({
				status: 403, 
				data: 'Unauthorized Action'
			})
		}
	} catch (err) {
		res.json({
			status: 400, 
			data: 'Error with create job route'
		})
	}
})

// Edit Job //
router.put('/:id', async (req, res) => {
	try{
		//find the job 
		const foundJob = await Job.findById(req.params.id)
		//check if user owns the job 
		if(req.session.userID === foundJob.ownerID) {

			//add user ID to updated info
			req.body.ownerID = req.session.userID
			//update the job in the job model
			const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {new: true});

			//find and update job in the user model
			const foundUser = await User.findById(req.session.userID);
			foundUser.jobs.map((job) => {
				if(job._id === req.params.id) {
					job = req.body;
				}
				return job
			})
			await foundUser.save();

			res.json({
				status: 400,
				data: updatedJob
			})

		} else {
			res.json({
				status: 403, 
				data: 'Unauthorized Action'
			})
		}
	} catch (err) {
		res.json({
			status: 400, 
			data: 'Error with create job route'
		})
	}
})





module.exports = router;