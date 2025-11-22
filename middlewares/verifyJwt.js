const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req?.cookies?.token;
        if (!token)
            return res
                .status(401)
                .send({ message: "Unauthorized access - no token" });

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err)
                return res
                    .status(401)
                    .send({ message: "Unauthorized access - invalid token" });
            req.decoded = decoded;
            next();
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
};
