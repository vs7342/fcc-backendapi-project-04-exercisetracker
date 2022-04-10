const User = require('../models/User');

// Inserts a new user in the DB
module.exports.insertUser = (req, res) => {
    
    // Check if username was sent in the request
    let username = req.body.username;
    if(username){

        // Since username was sent, proceed with user creation
        User.create({
            username: username
        }).then(createdUser => {
            
            // User created. Send the created user document.
            res.json(createdUser);

        }).catch(err => {
            res.json({
                msg: "Error creating user",
                err: err
            });
        })
    }else{
        
        // Username not found in the request body. Bad Request.
        res.status(400).json({
            msg: "Insufficient request parameters"
        });

    }
}

// Gets an array of users inside the DB
module.exports.getAllUsers = async (req, res) => {

    // Fetch all the users from the users collection
    User.find().then(userList => {

        // Send the user array
        res.json(userList);
        
    }).catch(err => {
        res.json({
            msg: "Error fetching user list",
            err: err
        });
    });
}