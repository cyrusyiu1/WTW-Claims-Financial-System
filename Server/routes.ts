import express from "express";
import { claimRoutes } from "./routers/claimRoutes";
import { policyRoutes } from "./routers/policyRoutes";
import { sanctionRoutes } from "./routers/sanctionRoutes";
import { userRoutes } from "./routers/userRoutes";

export const routes = express.Router();

routes.use("/users", userRoutes); 
routes.use("/policy", policyRoutes); 
routes.use("/claim", claimRoutes); 
routes.use("/sanction", sanctionRoutes); 