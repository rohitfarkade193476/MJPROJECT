const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");   // ✅ FIXED
const { STATUS_CODES } = require('http');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const flash = require('connect-flash');
const { listingSchema } = require('./schema.js');
const Review = require('./models/review.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');


const listingsRouter = require("./routes/listing.js");
const userRouter=require("./routes/user.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions={
  secret:"mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: new Date(Date.now() + 7 * 24 * 60 * 1000) ,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use(session(sessionOptions)); 
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Login route
// app.get("/demouser", async(req, res) => {
//   let fakeUser=new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   })
//   let registeredUser=await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });



app.use("/listings", listingsRouter);
app.use("/", userRouter);

// Review post route
app.post("/listings/:id/reviews", async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
});

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
