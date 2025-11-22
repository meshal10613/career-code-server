const express = require("express");
const router = express.Router();

const applicationsController = require("../controllers/applicationsController");
const verifyFirebase = require("../middlewares/verifyFirebase");

// GET applications for logged-in Firebase-authenticated user
router.get("/", verifyFirebase, applicationsController.getApplications);

// GET all applications for a specific job
router.get("/job/:id", applicationsController.getApplicationsForJob);

// POST new application
router.post("/", applicationsController.createApplication);

// UPDATE application status (HR updates)
router.patch("/:id", applicationsController.updateApplicationStatus);

module.exports = router;
