const _ = require('lodash');
const User = require('../models/user');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) return res.status(400).json({error: 'User not found'});

        req.profile = user; // adds profile object for user;
        next();
    });
};

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id;

    if (!authorized) return res.status(403).json({error: 'User is not authorized'});

    next();
};

exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if (err) return res.status(400).json({error: err});

        res.json({users});
    }).select('name email created updated');
};

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;

    return res.json(req.profile);
};

exports.updateUser = (req, res, next) => {
    let user = req.profile;

    user = _.extend(user, req.body);
    user.update = Date.now();
    user.save((err) => {
        if (err) return res.status(400).json({error: 'Not authorized'});

        user.hashed_password = undefined;
        user.salt = undefined;

        res.json({user});
    });
};

exports.deleteUser = (req, res) => {
    let user = req.profile;

    user.remove((err, user) => {
       if (err) return res.status(400).json({error: err});

        user.hashed_password = undefined;
        user.salt = undefined;

        res.json({message: 'User deleted successfully'});
    });
}