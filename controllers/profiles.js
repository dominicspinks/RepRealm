const User = require('../models/user');

module.exports = {
    index,
    show,
    edit,
    update,
};

// Redirect to show page
function index(req, res) {
    res.redirect('profiles/show');
}

// Display page to show profile details
function show(req, res) {
    res.render('profiles/show', {
        title: 'My Profile',
        isActive: 'profiles',
    });
}

// Display page to Edit a user's profile
function edit(req, res) {
    res.render('profiles/edit', {
        title: 'Edit Profile',
        isActive: 'profiles',
    });
}

// Save profile edits
async function update(req, res) {
    // Validate username is unique (tbd)

    // Find user
    const editUser = await User.findOne({ _id: req.user._id });
    editUser.username = req.body.username;
    editUser.email = req.body.email;
    editUser.avatar = req.body.avatar;
    editUser.isPublic = req.body.visibility === 'Public';
    editUser.isNew = false;

    // Update details
    await editUser.save();

    res.redirect('/profiles/show');
}
