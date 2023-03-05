import express from "express";
import { claimRoutes } from "./routers/claimRoutes";
import { policyRoutes } from "./routers/policyRoutes";
import { userRoutes } from "./routers/userRoutes";

export const routes = express.Router();

routes.use("/users", userRoutes); 
routes.use("/policy", policyRoutes); 
routes.use("/claim", claimRoutes); 