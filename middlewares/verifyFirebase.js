const admin = require("firebase-admin");

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .send({ message: "Unauthorized access - no firebase token" });
        }

        const token = authHeader.split(" ")[1];
        const userInfo = await admin.auth().verifyIdToken(token);
        req.tokenEmail = userInfo.email;
        next();
    } catch (err) {
        console.error("Firebase verify error", err);
        res.status(401).send({
            message: "Unauthorized access - invalid firebase token",
        });
    }
};
