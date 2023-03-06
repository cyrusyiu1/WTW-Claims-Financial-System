import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("claim", (table) => {
    table.increments();
    table.string("claim_financial_number");
    table.string("hkec_claim_number");
    table.string("eg_claim_number");
    table.string("insurer_number");
    table.date("date_of_accident");
    table.string("main_contractor_name");
    table.string("claimant");
    table.boolean("refer_to_insurer");
    table.boolean("tparty");
    table.string("rec_type");
    table.string("recovery");
    table.boolean("closed");
    table.date("closed_date");
    table.date("reopen_date");
    table.integer("severity");
    table.date("next_review_date");
    table.date("client_report_date");
    table.boolean("legal_case");
    table.string("claimant_solicitor");
    table.string("own_solicitor");

    table.integer("hc_handler_id").unsigned();
    table.foreign("hc_handler_id").references("users.id");

    table.integer("claim_handler_id").unsigned();
    table.foreign("claim_handler_id").references("users.id");

    table.integer("policy_id").unsigned();
    table.foreign("policy_id").references("policy.id");
    table.timestamps(false, true);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("claim");
}

