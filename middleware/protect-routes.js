module.exports = (req, res, next) => {
    req.session.oldUrl = req.url;
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}