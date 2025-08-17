module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl; // Save the requested URL for redirecting after login
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/login");
  }
  next(); 
}

// module.exports.saveRedirect= (req, res,next) => {
//     if(req.session.redirectUrl){
//     res.locals.redirectUrl = req.session.redirectUrl;
//     }
//     next();
// };
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
