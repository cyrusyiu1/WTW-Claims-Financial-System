import express from "express";
import { UserService } from "../services/UserService";
import { UserController } from "../controllers/UserController";
import { isLoggedIn } from "../guard";
import knex from "../knex";

export const userService = new UserService(knex);
const userController = new UserController(userService);

export const userRoutes = express.Router();
userRoutes.post("/register", userController.register);
userRoutes.post("/login", userController.login); //localhost:8100/users/login [POST]
userRoutes.get("/getAllUsername", userController.getAllUsername)
userRoutes.post("/permissions",isLoggedIn, userController.permissions)
userRoutes.post("/authority",isLoggedIn, userController.authority)
// userRoutes.get("/getUserById/:id",userController.getUserById)
userRoutes.post("/postPolicy",isLoggedIn,userController.postPolicy)
userRoutes.get("/getAllPolicy", userController.getAllPolicy)
userRoutes.put("/editPolicy",userController.editPolicy)
userRoutes.delete("/deletePolicy",userController.deletePolicy)
userRoutes.post('/getUserById',isLoggedIn,userController.getUserById)
