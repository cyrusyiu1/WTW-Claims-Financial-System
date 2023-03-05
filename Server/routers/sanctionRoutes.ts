import express from "express";
import { SanctionController } from "../controllers/SanctionController";
import { isLoggedIn } from "../guard";
import knex from "../knex";

const sanctionController = new SanctionController(knex);

export const sanctionRoutes = express.Router();

sanctionRoutes.get("/", isLoggedIn, sanctionController.getAllSanction);