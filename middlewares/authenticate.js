const jwt = require("jsonwebtoken")

const {SECRET_KEY} = process.env;

const {HttpError} = require("../helpers")

const User = require("../models/users")

const authenticate = async (req, res, next) => {
    const {authorization = ''} = req.headers;
    const [bearer, token] = authorization.split(" ")
    if(bearer !== "Bearer") {
        next(HttpError(401, "Not authorized"))
    }

    try {
        const {id} = jwt.verify(token, SECRET_KEY)
        const user =  await User.findById(id)
        if(!user || !user.token) {
            next(HttpError(401, "Not authorized"))
        }
        req.user = user
        next()
    }
    catch {
        next(HttpError(401, "Not authorized"))
    }
}

module.exports = authenticate;