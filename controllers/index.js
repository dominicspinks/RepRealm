module.exports = {
    index,
};

// Redirect to workouts list page for now, add a home page later
function index(req, res) {
    res.render('index', { isActive: 'home' });
}
