import * as userService from '../service/user.service.js';





export const signup = async (req, res) => {
    try {
        const{first_name,last_name,email,password} = req.body
        const user =  await userService.signup(first_name,last_name,email,password)
        
        res.status(201).json({message: user});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async(req,res) => {
    try {
        const {email, password} = req.body
        const accessToken = await userService.login(email, password)
        res.status(200).json({ details: accessToken})
    } catch (error) {
        const statusCode = error.status || 500
        res.status(statusCode).json({message: error.message})
    }
} 



export const allUser = async(req,res)=> {
    try {
        const users = await userService.findAll()
        res.status(200).json({details: users})
        
    } catch (error) {
        const statusCode = error.status || 500
        res.status(statusCode).json({message: error.message})
        
    }
}




export const findone = async(req,res) => {
    try {
        const {userId} = req.params;
        const user = await userService.findOne(userId)
        res.status(200).json({message: user})
    } catch (error) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({message: error.message})
    }
}
    