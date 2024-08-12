import User from '../model/users.model.js';
import ErrorWithStatus from '../exception/errorwithstatus.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
// get all get by id




export const signup = async(first_name,last_name,email,password) => {
    try {
        //check if user exist
        const existingUser = await User.findOne({email})
        if(existingUser){
            throw new ErrorWithStatus("user already exist, please login",400)
        }
        const hashedPassword = await  bcrypt.hash(password, 10)
        const newUser = new User({first_name,last_name,email,password: hashedPassword})
        await newUser.save()
        return newUser
    } catch (error) {
        const statusCode = 500
        throw new ErrorWithStatus(error.message || 'internal server error',statusCode)
        
    }
}
export const login = async(email,password) => {
    try {
        //check if user exist
        const user = await User.findOne({email})
        if(!user){
            throw new ErrorWithStatus("user does not exist here", 400)
        }
        //check for password
        const validPassword = bcrypt.compareSync(password,user.password)
        if(!validPassword){
            throw new ErrorWithStatus("password not match",400)
        }
        const JWT_SECRET = process.env.JWT_SECRET
        const token = jwt.sign({

            password: user.password,
            email: user.email,
            _id: user._id
        },JWT_SECRET,{expiresIn:"1h"})
        return token

    } catch (error) {
        const statusCode = error.status || 500;
        throw new ErrorWithStatus(error.message || 'Internal server error',statusCode)

        
    }
}





export const findAll = async() => {
    try {
        const users = await User.find()
        return users
        
    } catch (error) {
        throw new ErrorWithStatus("error:can't get users",500)
        
    }
}


export const findOne  = async (userId) => {
    try {
        const user = await User.findById(userId)
        if(!user){
            throw new ErrorWithStatus("user not found",404)
        }
        return user
    } catch (error) {
        throw new ErrorWithStatus("error:can't get user",500)
        
    }
}