const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require('../schema.js');
const Listing = require('../models/listing.js');

// Index route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// New route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requestd for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}));

// Create route
router.post("/", wrapAsync(async (req, res, next) => {
  let result = listingSchema.validate(req.body);
  console.log(result);
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success", " New Listing created successfully!");
  res.redirect("/listings");
}));

// Edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requestd for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

// Update route
router.put("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let updatedData = req.body.listing;

  let oldListing = await Listing.findById(id);
  if (!updatedData.image || !updatedData.image.url || updatedData.image.url.trim() === "") {
    updatedData.image = oldListing.image;
  }

  await Listing.findByIdAndUpdate(id, updatedData);
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
}));

// Delete route
router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
}));

module.exports = router;
