const mongoose = require("mongoose");

const connectDb = async() => {
	const uri = process.env.MONGODB_URI;
	if(!uri) throw new Error("MONGODB_URI is not defined");

	try {
		await mongoose.connect(uri, {
			serverSelectionTimeoutMS: 5000,
		});
		console.log("You've successfully connected to MongoDB with Mongoose!");
	} catch (error) {
		console.log(error);
	}
}

module.exports = connectDb;