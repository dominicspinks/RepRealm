// Middleware for new users to complete their account setup
module.exports = function (req, res, next) {
    // Pass the req/res to the next middleware/route handler
    if (req.user?.isNewUser) {
        // Redirect to edit profile page if the user setup is not complete
        res.redirect('/profiles/edit');
    }
    return next();
};
