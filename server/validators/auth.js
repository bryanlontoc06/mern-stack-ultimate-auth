const {body} = require('express-validator');


exports.userSignupValidator = [
    body('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    body('email')
        .isEmail()
        .not()
        .isEmpty()
        .withMessage('Must be a valid email address'),
    body('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long')
];     // end exports.userSignupValidator


exports.userSigninValidator = [
    body('email')
        .isEmail()
        .not()
        .isEmpty()
        .withMessage('Must be a valid email address'),
    body('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long')
];     // end exports.userSigninValidator


exports.forgotPasswordValidator = [
    body('email')
        .isEmail()
        .not()
        .isEmpty()
        .withMessage('Must be a valid email address'),
];   // end exports.forgotPasswordValidator


exports.resetPasswordValidator = [
    body('newPassword')
        .not()
        .isEmpty()
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long')
];   // end exports.resetPasswordValidator


