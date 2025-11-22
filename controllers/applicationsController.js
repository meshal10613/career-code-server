const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");

exports.getApplications = async (req, res) => {
    try {
        const email = req.query.email;
        const query = email ? { applicant: email } : {};
        const applications = await Application.find(query).lean();

        // Enrich with job info
        await Promise.all(
            applications.map(async (app) => {
                const job = await Job.findById(app.jobId).lean();
                if (job) {
                    app.company = job.company;
                    app.title = job.title;
                    app.company_logo = job.company_logo;
                }
            })
        );
        res.send(applications);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
};

exports.getApplicationsForJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const apps = await Application.find({ jobId }).lean();
        res.send(apps);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
};

exports.createApplication = async (req, res) => {
    try {
        const appData = req.body;
        const application = new Application(appData);
        const result = await application.save();
        res.status(201).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const result = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
};
