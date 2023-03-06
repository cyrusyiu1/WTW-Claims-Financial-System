import express from "express";
import { PolicyController } from "../controllers/PolicyController";
import { isLoggedIn } from "../guard";
import knex from "../knex";

const policyController = new PolicyController(knex);

export const policyRoutes = express.Router();

policyRoutes.post("/", isLoggedIn, policyController.postPolicy);
policyRoutes.get("/", isLoggedIn, policyController.getAllPolicy);
policyRoutes.get("/:id", isLoggedIn, policyController.getPolicy);

policyRoutes.post("/:id/fund", isLoggedIn, policyController.addFund);
policyRoutes.get("/:id/fund", isLoggedIn, policyController.getPolicyFund);

policyRoutes.post("/:id/claim", isLoggedIn, policyController.addClaim);
policyRoutes.get("/:id/claim", isLoggedIn, policyController.getPolicyClaim);