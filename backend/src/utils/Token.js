const jwt = require('jsonwebtoken');
const COOKIE_NAME = require('./Constants');
 
const createToken = (id, email, expiresIn) => {
	const payload = { id, email };

	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn,
	});
	return token;
};

const verifyToken = async (req,res,next) => {
	try {
        const authHeader = req.headers['authorization']; // Assume the token is in the cookies header
        const token = authHeader && authHeader.split(' ')[1];
        //const token = req.signedCookies[`${COOKIE_NAME}`];
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
