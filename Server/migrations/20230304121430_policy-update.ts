import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('policy', (table) => {
    table.dropColumns(
      'policy_type',
      'policy_term',
      'coverage_amount',
      'coverage_period',
      'premium',
      'claims_amount',
      'user_id'
    )
    table.date("end_date");
    table.boolean("blocked");
    table.integer('panel_expense_limit1');
    table.integer('per_claim_limit1');
    table.integer('panel_expense_limit2');
    table.integer('per_claim_limit2');
    table.integer('panel_expense_limit3');
    table.integer('per_claim_limit3');
  })

  await knex.schema.alterTable('policy_holder', (table) => {
    table.string('sanction_record');
  })

  await knex.schema.alterTable('insurer', (table) => {
    table.string('sanction_record');
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('policy', (table) => {
    table.dropColumns(
      'panel_expense_limit1',
      'per_claim_limit1',
      'panel_expense_limit2',
      'per_claim_limit2',
      'panel_expense_limit3',
      'per_claim_limit3',
    )
    table.string("policy_type",50).notNullable();
    table.integer("policy_term");
    table.decimal("coverage_amount",10,2);
    table.date("coverage_period");
    table.decimal("premium",10,2);
    table.decimal("claims_amount",10,2)
    table.integer("user_id").unsigned();
    table.foreign("user_id").references("users.id");
  })

  await knex.schema.alterTable('policy_holder', (table) => {
    table.dropColumns('sanction_record');
  })

  await knex.schema.alterTable('insurer', (table) => {
    table.dropColumns('sanction_record');
  })
}

