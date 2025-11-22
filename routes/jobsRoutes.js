const express = require("express");
const router = express.Router();
const jobsController = require("../controllers/jobsController");

// public
router.get("/", jobsController.getJobs);
router.get("/applications", jobsController.getJobsWithApplications);
router.get("/:id", jobsController.getJobById);

// protected (if you want, you can add verifyJwt or verifyFirebase here)
router.post("/", jobsController.createJob);

module.exports = router;
