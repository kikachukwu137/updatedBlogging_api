import jwt from 'jsonwebtoken';
/*

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    //const token = req.headers.Authoraization
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

export default authMiddleware;
*/

const authMiddleware = (req,res,next) => {
    const authorizationMiddleware = req.headers.authorization
    if(!authorizationMiddleware){
        return res.status(400).json({message: "unauthorixed",info: "access token required"})
    }
    const token = authorizationMiddleware.split(" ")
    if(token.length !== 2){
        return res.status(400).json({message: "bad token"})
    }
    const JWT_SECRET = process.env.JWT_SECRET
    jwt.verify(token[1],JWT_SECRET,(err,decoded) =>{
        if(err){
            return res.status(400).json({message: "access denied"})
        }
        req.user = decoded
        next()
    })
}
export default authMiddleware;
