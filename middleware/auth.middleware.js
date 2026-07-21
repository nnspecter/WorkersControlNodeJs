const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || "SECRET_KEY_RANDOM_12345";

function authMiddleWare(req, res, next){
    if(req.method === "OPTIONS"){
        return next();
    }

    try{
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({message: "Не авторизован"})
        }
        const decodedData = jwt.verify(token, SECRET_KEY);
        req.user = decodedData;
        next();
    }
    catch(error){
        return res.status(401).json({message: "Не авторизован, либо токен устарел"})
    }
}

module.exports = authMiddleWare;