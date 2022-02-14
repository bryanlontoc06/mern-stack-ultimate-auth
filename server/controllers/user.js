const User = require('../models/user');



exports.read = (req, res) => {
    const userId = req.params.id;

    User.findById(userId).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        return res.json(user);
    })
}


exports.update = (req, res) => {
    // console.log('update user - req.user', req.user, 'Update data', req.body);
    const { name, password } = req.body;

    User.findById(req.user._id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if(!name) {
            return res.status(400).json({
                error: 'Name is required!'
            });
        } else {
            user.name = name;
        }
        if (password) {
            if(password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long!'
                });
            } else {
                user.password = password;
            }
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log(`User Update error: ${err}`)
                return res.status(400).json({
                    error: 'Error updating user!'
                });
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            return res.json(updatedUser);
        })
    })
}