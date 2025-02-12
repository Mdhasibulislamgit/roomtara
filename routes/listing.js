const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateListing } = require("../middleware/validation.js");

// Index - Show all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings, active: "listings" });
  })
);

// New - Show form to create new listing
router.get("/new", (req, res) => {
  res.render("listings/new.ejs", { active: "new" });
});

// Show - Show details of one listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      throw new ExpressError("Listing not found", 404);
    }
    res.render("listings/show.ejs", { listing, active: "listings" });
  })
);

// Create - Create new listing
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Edit - Show form to edit listing
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError("Listing not found", 404);
    }
    res.render("listings/edit.ejs", { listing, active: "listings" });
  })
);

// Update - Update listing
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError("Invalid listing data", 400);
    }
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    if (!listing) {
      throw new ExpressError("Listing not found", 404);
    }
    res.redirect(`/listings/${id}`);
  })
);

// Delete - Delete listing
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      throw new ExpressError("Listing not found", 404);
    }
    res.redirect("/listings");
  })
);

// Search - Handle search request
router.get("/api/search", wrapAsync(async (req, res) => {
  const { query } = req.query;
  const listings = await Listing.find({ title: { $regex: query, $options: "i" } });
  res.json(listings);
}));

module.exports = router;
