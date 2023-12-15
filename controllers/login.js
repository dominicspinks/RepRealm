const passport = require('passport');

module.exports = {
    login,
    callback,
    logout,
};

// Google OAuth login route
function login(req, res, next) {
    passport.authenticate('google', {
        // Requesting the user's profile and email
        scope: ['profile', 'email'],
        prompt: 'select_account',
    })(req, res, next);
}

// Google OAuth callback route
function callback(req, res, next) {
    passport.authenticate('google', {
        successRedirect: '/workouts',
        failureRedirect: '/',
    })(req, res, next);
}

// OAuth logout route
function logout(req, res) {
    req.logout(function () {
        res.redirect('/');
    });
}
