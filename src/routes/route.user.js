import * as userController from '../controller/user.controller.js'
import {Router} from 'express';
const userRouter = Router()

userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.get("/",userController.allUser)
userRouter.get("/:Id",userController.findone)


export default userRouter;
