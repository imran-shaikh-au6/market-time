const User = require("../Model/User");
const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
    const authToken = req.header("Authorization");
    if (authToken) {
        User.findOne({ token: authToken })
            .then((user) => {
                if (user === undefined) {
                    return res
                        .status(400)
                        .json({ message: "Invalid Credintials" });
                } else {
                    jwt.verify(user.token, "secret key", (err, token) => {
                        if (err) {
                            return res.status(401).send("Invalid credentials");
                        } else {
                            // This step is made to make sure the succeding middlewares have the access to this data.
                            req.user = user;
                            next();
                        }
                    });
                }
            })
            .catch((err) => {
                res.status(400).json({ message: "Invalid Token Provided" });
            });
    }
};

module.exports = auth