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

                // This will make sure that we are only storing dates (with time set to midnight)
                // This is mainly needed when date string is not passed in the request
                exerciseDate.setHours(0,0,0,0);

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

// Fetches exercise log for the given user
module.exports.getExerciseLog = (req, res) => {

    // Extract user ID
    const userId = req.params._id;
    const limit = parseInt(req.query.limit) || 0;
    const fromDate = req.query.from;
    const toDate = req.query.to;

    // Construct the where clause based on 'from' & 'to' query params
    let whereClause = {
        userId: userId
    };

    // If either of the param is passed, we would need the date filter
    if(fromDate || toDate){
        whereClause['date'] = {};
    }
    if(fromDate){
        whereClause['date']['$gte'] = new Date(fromDate)
    }
    if(toDate){
        whereClause['date']['$lte'] = new Date(toDate);
    }

    // First query user collection
    User.findById(userId).then(userFound => {

        if(userFound){

            // User found. Proceed with Exercise Fetching.
            Exercise
                .find(whereClause)
                .select('-_id')
                .limit(limit)
                .exec()
                .then(exerciseArr => {

                    // Loop through the array and update the date
                    // There might be a better way to do that. Should look into it in future.
                    const log = exerciseArr.map(obj => ({
                        description: obj.description,
                        duration: obj.duration,
                        date: obj.date.toDateString()
                    }));

                    // Respond with the expected JSON object
                    res.json({
                        _id: userFound._id,
                        username: userFound.username,
                        count: log.length,
                        log: log
                    })

                })
                .catch(err => {
                    res.json({
                        msg: "Error Fetching Exercise Log",
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

}