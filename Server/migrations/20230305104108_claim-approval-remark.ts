import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("claim_finance", (table) => {
    table.string("remark");
    table.timestamp("approval_time");
  });

}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('claim_finance', (table) => {
    table.dropColumn('remark');
    table.dropColumn('approval_time');
  })
}

