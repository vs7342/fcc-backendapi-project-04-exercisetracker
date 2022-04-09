const Exercise = require('../models/Excercise');
const User = require('../models/User');

// Inserts a new exercise log for the given user
module.exports.logExercise = (req, res) => {
    const userId = req.params._id;
    const description = req.body.description;
    const duration = req.body.duration;
    const date = req.body.date;

    // Check for the required fields
    // _id check is not required since that is passed as the route param. If not passed, I feel this endpoint wont be hit anyways.
    if(description && duration){

        // Find user if it exists. (We need to make this call anyways to fetch username)
        User.findById(userId).then(userFound => {

            // Check if user was found
            if(userFound){

                // User was found. Proceed with exercise creation.
                
                // If date is not passed, pick the current date
                let exerciseDate = date ? new Date(date) : new Date();

                // Insert document
                Exercise.create({
                    userId: userId,
                    description: description,
                    duration: duration,
                    date: exerciseDate
                }).then(createdExercise => {

                    // Exercise created. Return expected JSON response.
                    res.json({
                        username: userFound.username,
                        description: createdExercise.description,
                        duration: createdExercise.duration,
                        date: createdExercise.date.toDateString(),
                        _id: userId
                    });

                }).catch(err => {
                    res.json({
                        msg: "Error Logging Exercise",
                        err: err.message
                    });
                });


            }else{

                // User not found. Return 404.
                res.status(404).json({
                    message: "User not found"
                });

            }

        }).catch(err => {
            res.json({
                msg: "Error Finding User",
                err: err.message
            });
        });

    }else{

        // Bad Request.
        res.status(400).json({
            msg: "Insufficient request parameters"
        });

    }
}