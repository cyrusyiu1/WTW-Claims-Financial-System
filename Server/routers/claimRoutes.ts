import express from "express";
import { ClaimController } from "../controllers/ClaimController";
import { isLoggedIn } from "../guard";
import knex from "../knex";
import { EmailService } from "../services/EmailService";

const claimController = new ClaimController(knex, new EmailService());

export const claimRoutes = express.Router();

claimRoutes.get("/approval", isLoggedIn, claimController.pendingApproval);
claimRoutes.get("/:id", isLoggedIn, claimController.getClaim);
claimRoutes.get("/:id/limits", isLoggedIn, claimController.getCurrentUserLimits);
claimRoutes.get("/:id/finance", isLoggedIn, claimController.getFinanceTransactions);
claimRoutes.post("/:id/finance", isLoggedIn, claimController.addFinanceTransactions);
claimRoutes.put("/:id/approve", isLoggedIn, claimController.approveTransactions);
claimRoutes.get("/:id/claimFinanceHistory",isLoggedIn,claimController.getClaimFinanceHistory)
