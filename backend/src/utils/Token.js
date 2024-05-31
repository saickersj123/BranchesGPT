const jwt = require('jsonwebtoken');
const COOKIE_NAME = require('./Constants');
 
const createToken = (id, email, expiresIn) => {
	const payload = { id, email };

	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn,
	});
	return token;
};

async verifyToken(req,res,next) {
	const token = req.signedCookies[`${COOKIE_NAME}`]; // signed cookies is an object which can contain all of the cookies data
	console.log("token:",token);
	if (!token || token.trim() === "") {
		return res.status(401).json({ message: "Token Not Received" });
	}
	return new Promise((resolve, reject) => {
		return jwt.verify(
			token,
			process.env.JWT_SECRET,
			(err, success) => {
				if (err) {
					reject(err.message);
					return res.status(401).json({ message: "Token Expired" });
				} else {
					// we will set some local paramaeters for this request in this function
					// and then we can use those parameters inside next function
					// send local variables to next request
=======
const verifyToken = async (req,res,next) => {
	try {
        const token = req.headers.cookie; // Assume the token is in the cookies header
        console.log("token:", token);

        if (!token || token.trim() === "") {
            return res.status(401).json({ message: "Token Not Received" });
        }

        const verifiedToken = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });

        console.log('Token verification successful');
        res.locals.jwtData = verifiedToken; // Pass the verified token data to next middleware
        return next();

    } catch (error) {
        console.error("Error verifying token:", error.message);
        return res.status(401).json({ message: "Token Expired or Invalid" });
    }
};

module.exports = { createToken, verifyToken };
