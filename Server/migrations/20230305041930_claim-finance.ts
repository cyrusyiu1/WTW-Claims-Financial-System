import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("claim_finance", (table) => {
    table.increments();
    table.integer("claim_id").unsigned();
    table.foreign("claim_id").references("claim.id");
    table.integer("item_id").unsigned();
    table.string("type");
    table.integer("amount");
    table.boolean("approved").nullable(); // null - pending, false - rejected, true - approved
    table.integer("approver_id").unsigned();
    table.foreign("approver_id").references("users.id");
    table.integer("user_id").unsigned();
    table.foreign("user_id").references("users.id");
    table.timestamps(false, true);
  });

  await knex.schema.dropTable('transaction');
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("claim_finance");

  await knex.schema.createTable("transaction", (table) => {
    table.increments();
    table.decimal("income",10,2);
    table.decimal("expenses",10,2);
    table.integer("policy_id").unsigned();
    table.foreign("policy_id").references("policy.id");
  });
}

