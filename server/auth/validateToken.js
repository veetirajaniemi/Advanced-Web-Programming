const jwt = require("jsonwebtoken");


// Authenticating the user with HTTP-cookie 
module.exports = function(req, res, next) {

    const token = req.cookies.jwt // Getting token from the cookie
    if (token == null) return res.json({message: "Authentication failed."});
    
    jwt.verify(token, process.env.SECRET, (err, user) => { // Verifying the cookie
        if (err) return res.json({message: "Authentication failed."});
        req.user = user;
        next();
    })
}