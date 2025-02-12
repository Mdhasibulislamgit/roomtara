// Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const config = require("./config/config.js");

// Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");

// Error Handling
const ExpressError = require("./utils/ExpressError.js");

// Initialize Express
const app = express();

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

// Database Connection
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// Static Pages
app.get("/privacy", (req, res) => {
  res.render("listings/privacy.ejs", { active: "privacy" });
});

app.get("/terms", (req, res) => {
  res.render("listings/terms.ejs", { active: "terms" });
});

// Mount Routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

// Error Handling
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { 
    status, 
    message,
    active: "error"
  });
});

// Start Server
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
