const Job = require("../models/jobModel");
const Application = require("../models/applicationModel");

exports.getJobs = async (req, res) => {
    try {
        const email = req.query.email;
        const query = email ? { hr_email: email } : {};
        const jobs = await Job.find(query).lean();
        res.send(jobs);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
};

exports.getJobsWithApplications = async (req, res) => {
    try {
        const email = req.query.email;
        const query = email ? { hr_email: email } : {};
        const jobs = await Job.find(query).lean();

        // Attach applicationCount
        await Promise.all(
            jobs.map(async (job) => {
                const count = await Application.countDocuments({
                    jobId: job._id.toString(),
                });
                job.applicationCount = count;
            })
        );

        res.send(jobs);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const id = req.params.id;
        const job = await Job.findById(id);
        if (!job) return res.status(404).send({ message: "Job not found" });
        res.send(job);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
};

exports.createJob = async (req, res) => {
    try {
        const jobData = req.body;
        const job = new Job(jobData);
        const result = await job.save();
        res.status(201).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
};
