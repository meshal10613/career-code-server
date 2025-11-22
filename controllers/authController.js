const jwt = require("jsonwebtoken");

exports.createJwt = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).send({ message: "Email required" });

        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: "10d",
        });

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // set to true if using HTTPS
            sameSite: "lax",
        });

        res.send({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
};
