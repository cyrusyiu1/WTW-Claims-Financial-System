import { Request, Response } from "express";
import { Knex } from "knex";

export class PolicyController {
  constructor(private knex: Knex) {}

  postPolicy = async (req: Request, res: Response) => {
    try {
      const ids = await this.knex.insert({
        policy_number: req.body.policy_number,
        description: req.body.description,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        blocked: req.body.blocked,
        panel_expense_limit1: req.body.panel_expense_limit1,
        per_claim_limit1: req.body.per_claim_limit1,
        panel_expense_limit2: req.body.panel_expense_limit2,
        per_claim_limit2: req.body.per_claim_limit2,
        panel_expense_limit3: req.body.panel_expense_limit3,
        per_claim_limit3: req.body.per_claim_limit3,
      }).into('policy').returning('id')

      await this.knex.insert({
        last_name: req.body.policy_holder,
        policy_id: ids[0].id
      }).into('policy_holder').returning('id')

      await this.knex.insert({
        last_name: req.body.insurer,
        policy_id: ids[0].id
      }).into('insurer').returning('id')

      res.json({'result': 'ok'});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
      return;
    }
  };

  getAllPolicy = async (req: Request, res: Response) => {
    try {
      res.json(await this.knex.select(
        'policy.id',
        'policy.policy_number',
        'policy.description',
        'policy.start_date',
        'policy.end_date',
        'policy.blocked',
        'policy.panel_expense_limit1',
        'policy.per_claim_limit1',
        'policy.panel_expense_limit2',
        'policy.per_claim_limit2',
        'policy.panel_expense_limit3',
        'policy.per_claim_limit3',
        'policy_holder.last_name',
        'insurer.last_name',
      )
        .from('policy')
        .join('policy_holder', 'policy.id', 'policy_holder.policy_id')
        .join('insurer', 'policy.id', 'insurer.policy_id')
      )
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
      return;
    }
  };
}
