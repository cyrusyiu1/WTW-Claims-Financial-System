import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("sanction_history", (table) => {
    table.increments("id").primary();
    table.string('name');
    table.text('result');
    table.dateTime("created_at").notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("sanction_history");
}

