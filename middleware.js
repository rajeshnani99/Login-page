const jwt = require("jsonwebtoken");
const { exists } = require("./model");

module.exports = function (res, req, next) {
    try {
        let token = req.header("x-token");
        if (!token) {
            return res.status(400).send("token nOt found")
        }
        let decode = jwt.verify(token, "jwtsecert");
        req.user = decode.user;
        next();
    }
    catch (err) {
        console.log(err)
        return res.status(500).send("server error");
    }
}