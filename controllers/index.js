module.exports = {
    show,
};

function show(req, res) {
    res.render('index', { title: 'Index' });
}
