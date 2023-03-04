import express from "express";
import { PolicyController } from "../controllers/PolicyController";
import { isLoggedIn } from "../guard";
import knex from "../knex";

const policyController = new PolicyController(knex);

export const policyRoutes = express.Router();

policyRoutes.post("/", isLoggedIn, policyController.postPolicy);
policyRoutes.get("/", isLoggedIn, policyController.getAllPolicy);