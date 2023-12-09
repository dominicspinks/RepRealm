const Workout = require('../models/user');

module.exports = {
    index,
    show,
    edit,
};

// Redirect to show page
function index(req, res) {
    res.redirect('profiles/show');
}

// Page to display profile details
function show(req, res) {
    res.render('profiles/show', {
        title: 'My Profile',
        isActive: 'profiles',
    });
}

// Page to Edit a user's profile
function edit(req, res) {
    res.render('profiles/edit', {
        title: 'Edit Profile',
        isActive: 'profiles',
    });
}
