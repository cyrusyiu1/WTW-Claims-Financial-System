import { Request, Response } from "express";
import { Knex } from "knex";
import { env } from "../env";
import { claimFinanceItems } from "../models";
import { EmailService } from "../services/EmailService";

export class ClaimController {
  constructor(private knex: Knex, private emailService: EmailService) {}
  
  private async getUserLimits(userId: number, claimId: string) {
    const policy = await this.knex("policy")
      .select("policy.*")
      .join("claim", "claim.policy_id", "policy.id")
      .where({ "claim.id": claimId })
      .first();
    
    if (!policy) {
      throw new Error("Policy not found");
    }

    const user = await this.knex("users")
      .select("users.*")
      .where({ id: userId })
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    if (user.userType === 'superadmin') {
      return {
        panel_expense_limit: 0,
        per_claim_limit: 0,
      }
    } else if (user.userType === 'claim') {
      if (user.permissionsLevel === 2) {
        return {
          panel_expense_limit: policy.panel_expense_limit2,
          per_claim_limit: policy.per_claim_limit2
        }
      } else if (user.permissionsLevel === 3) {
        return {
          panel_expense_limit: policy.panel_expense_limit3,
          per_claim_limit: policy.per_claim_limit3
        }
      } else {
        return {
          panel_expense_limit: policy.panel_expense_limit1,
          per_claim_limit: policy.per_claim_limit1
        }
      }
    } else {
      throw new Error("User not allowed");
    }
  }

  getClaimFinanceHistory = async (req: Request, res: Response)=>{
    const pendings = await this.knex("claim_finance").select('*')
    res.send(pendings)
  }

  pendingApproval = async (req: Request, res: Response) => {
    const pendings = await this.knex("claim_finance")
      .select(
        'claim.*',
        'policy.policy_number as policy_number',
        'policy.description as description',
        this.knex.raw('count(*) filter (where approved is null) as pending')
      )
      .join('claim', 'claim.id', 'claim_finance.claim_id')
      .join('policy', 'policy.id', 'claim.policy_id')
      .orWhere(where => {
        where.whereNull("approved").orWhere("approved", true);
      })
      .having(this.knex.raw('count(*) filter (where approved is null) > 0'))
      .groupBy('claim.id', 'policy.id');
    res.send(pendings);
  }

  getClaim = async (req: Request, res: Response) => {
    const { id } = req.params;
    const claim = await this.knex("claim")
      .select("claim.*", "policy.policy_number as policy_number")
      .join("policy", "policy.id", "claim.policy_id")
      .where({ 'claim.id': id }).first();
    if (!claim) {
      res.status(404).send("Claim not found");
      return;
    }
    res.send(claim);
  }

  getCurrentUserLimits = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (req.user?.id == null) {
      res.status(401).send("Unauthorized");
      return;
    }
    
    res.send(await this.getUserLimits(req.user?.id, id));
  }

  getFinanceTransactions = async (req: Request, res: Response) => {
    const { id } = req.params;
    const claim = await this.knex("claim").where({ id }).first();
    if (!claim) {
      res.status(404).send("Claim not found");
      return;
    }
    const finance = await this.knex("claim_finance")
      .select(
        'claim_finance.item_id',
        'claim_finance.type',
        this.knex.raw('SUM(claim_finance.amount) filter (where approved is null or approved = true) AS pending_amount'),
        this.knex.raw('SUM(claim_finance.amount) filter (where approved = true) AS amount'),
        this.knex.raw('count(*) filter (where approved is null) as pending')
      )
      .where({ claim_id: claim.id })
      .groupBy('item_id', 'type');
    res.send(finance);
  }

  addFinanceTransactions = async (req: Request, res: Response) => {
    const { id } = req.params;
    const claim = await this.knex("claim").where({ id }).first();
    if (!claim) {
      res.status(404).send("Claim not found");
      return;
    }

    if (req.user?.id == null) {
      res.status(401).send("Unauthorized");
      return;
    }

    const limits = await this.getUserLimits(req.user?.id, id);
    
    console.log(claim.id);
    const finances = await this.knex("claim_finance")
      .select(
        'claim_finance.item_id',
        'claim_finance.type',
        this.knex.raw('SUM(claim_finance.amount) AS amount'),
        this.knex.raw('count(*) filter (where approved is null) as pending')
      )
      .where({ claim_id: claim.id })
      .where(where => {
        where.whereNull("approved").orWhere("approved", true);
      })
      .groupBy('item_id', 'type');

    const amounts: number[] = [];
    if(req.body.amount){
      for (let item = 0; item < req.body.amount.length; item++) {
        const amountInt = parseInt(req.body.amount[item])
        if (amountInt && !isNaN(amountInt)) {
          amounts.push(parseInt(req.body.amount[item]))
        } else {
          amounts.push(0)
        }
      }
    }
    
    for (const finance of finances) {
      if (amounts[finance.item_id] && parseInt(finance.pending) > 0) {
        res.status(400).send("Row " + finance.item_id + " locked");
        return;
      }
    }

    let pendingApprovalAmount = 0;
    let pendingApprovalExpense = 0;

    for (const finance of finances) {
      // if (finance.user_id === req.user?.id) {
        pendingApprovalAmount += parseInt(finance.amount + '');
        const financeItem = claimFinanceItems.find((financeItem) => financeItem.id === finance.item_id);
        if (financeItem?.subgroup === 'expense') {
          pendingApprovalExpense += parseInt(finance.amount + '');
        }
      // }
    }

    for (let item = 0; item < amounts.length; item++) {
      if (item && amounts[item]) {
        const financeItem = claimFinanceItems.find((financeItem) => financeItem.id === item);
        if (financeItem == null) {
          res.status(400).send("Invalid item id");
          return;
        }
        if (financeItem?.subgroup === 'expense') {
          pendingApprovalExpense += parseInt(amounts[item] + '');
        }
        pendingApprovalAmount += parseInt(amounts[item] + '');
      }
    }

    console.log(pendingApprovalAmount, pendingApprovalExpense)
    let pendingItems = false;
    
    for (let item = 0; item < amounts.length; item++) {
      if (item && amounts[item]) {
        const financeItem = claimFinanceItems.find((i) => i.id === item);
        if (financeItem == null) {
          res.status(400).send("Invalid item id");
          return;
        }
        if (pendingApprovalAmount > limits.per_claim_limit || 
          (financeItem?.subgroup === 'expense' && pendingApprovalExpense > limits.panel_expense_limit)) {
          await this.knex("claim_finance").insert({
            claim_id: claim.id,
            item_id: item,
            type: req.body.update,
            amount: amounts[item],
            approved: null,
            approver_id: null,
            user_id: req.user.id,
          });
          pendingItems = true;
        } else {
          await this.knex("claim_finance").insert({
            claim_id: claim.id,
            item_id: item,
            type: req.body.update,
            amount: amounts[item],
            approved: true,
            approver_id: null,
            user_id: req.user.id,
          });
        }
      }
    }

    if (pendingItems) {
      const approvers = await this.knex("users")
        .where('permissionsLevel', '>', req.user.permissionsLevel)
      for (const approver of approvers) {
        // email them one by one
        const limits = await this.getUserLimits(approver.id, id);
        if ((limits.panel_expense_limit === 0 || limits.panel_expense_limit > pendingApprovalExpense)
          && (limits.per_claim_limit === 0 || limits.per_claim_limit > pendingApprovalAmount)) {
          this.emailService.sendEmail(approver.email, 'New claim pending approval', `New claim pending approval:
  
${env.frontendUrl}/claim/${claim.id}/finance`);
        }
      }
    }

    res.send({'result': 'ok'});
  }

  // approve transaction
  approveTransactions = async (req: Request, res: Response) => {
    const { id } = req.params;
    const claim = await this.knex("claim").where({ id }).first();
    if (!claim) {
      res.status(404).send("Claim not found");
      return;
    }

    if (req.user?.id == null) {
      res.status(401).send("Unauthorized");
      return;
    }

    const finance = await this.knex("claim_finance")
      .select(
        'claim_finance.id',
        'claim_finance.item_id',
        'claim_finance.type',
      )
      .where({ claim_id: claim.id })
      .whereNull('approved');

    for (const financeItem of finance) {
      if (req.body.approve[financeItem.item_id]) {
        await this.knex("claim_finance")
          .where({ id: financeItem.id })
          .update({
            approved: req.body.decision === 'approve' ? true : false,
            approval_time: this.knex.fn.now(),
            approver_id: req.user.id,
            remark: req.body.remark
          });
      }
    }

    res.send({'result': 'ok'});
  }
}