const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

// Signup route
router.get('/signup', (req, res) => {
    res.render("users/signup.ejs");
})

router.post('/signup', wrapAsync(async (req, res) => {
    try{
        let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Account created successfully! Welcome To WanderLust...");
    res.redirect  ('/listings');
    } catch(e){
        req.flash("error", e.message);
        res.redirect('/signup');
     }
  
}));

// Login route
router.get('/login', (req, res) => {
    res.render("users/login.ejs");
})

router.post('/login',
 passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
 }),
 async (req, res) => {
    // Add code to check if user is verified
    req.flash("success","welcome back to WanderLust!You are logged in!");
    res.redirect('/listings');
  }
);

module.exports = router;

