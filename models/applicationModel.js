const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true,
        index: true, // Fast lookup by job
    },
    applicant: {
        type: String, // Email of the applicant
        required: true,
        lowercase: true,
        trim: true,
        // match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    linkedin: {
        type: String,
        trim: true,
        default: null,
        // validate: {
        //     validator: function (v) {
        //         if (!v) return true; // optional field
        //         return /^https?:\/\/(www\.)?linkedin\.com\/.*/i.test(v);
        //     },
        //     message: "Please enter a valid LinkedIn URL",
        // },
    },
    github: {
        type: String,
        trim: true,
        default: null,
        // validate: {
        //     validator: function (v) {
        //         if (!v) return true;
        //         return /^https?:\/\/(www\.)?github\.com\/.*/i.test(v);
        //     },
        //     message: "Please enter a valid GitHub URL",
        // },
    },
    resume: {
        type: String,
        required: true,
        trim: true,
    },
});

applicationSchema.index({ jobId: 1, applicant: 1 });        //? Prevent duplicate applications

//? Ensure one application per user per job
applicationSchema.index({ jobId: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
