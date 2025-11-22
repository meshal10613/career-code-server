const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    jobType: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    applicationDeadline: {
        type: String,
        required: true,
    },
    salaryRange: {
        min: {
            type: Number,
            required: true,
            min: 0,
        },
        max: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            required: true,
            // default: "bdt",
            // enum: ["bdt", "usd", "eur"], // add more if needed
        },
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: String,
        required: true,
        trim: true,
    },
    requirements: [
        {
            type: String,
            required: true,
            trim: true,
        },
    ],
    responsibilities: [
        {
            type: String,
            required: true,
            trim: true,
        },
    ],
    status: {
        type: String,
        // enum: ["active", "inactive", "closed", "draft"],
        // default: "active",
    },
    hr_email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    hr_name: {
        type: String,
        required: true,
        trim: true,
    },
    company_logo: {
        type: String,
        trim: true,
        default: null,
    }
});

module.exports = mongoose.model("Job", jobSchema);
