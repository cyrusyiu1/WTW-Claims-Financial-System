import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.increments();
        table.string("username").notNullable().unique();
        // table.string("LastName").notNullable();
        table.string("password").notNullable();
        // table.string("icon");
        // table.decimal("description",10,2);
        // table.string("email").notNullable().unique();
        // table.string("phoneNumber",20);
        table.string("userType",20);
        table.integer("permissionsLevel",10).notNullable();
        table.integer("authorityLevel",10);
        // table.date("dateOfBirth")
        // table.string("gender",10)
        // table.date("hireDate")
        // table.boolean("fundAllow")
        table.timestamps(false, true);
      });

      await knex.schema.createTable("policy", (table) => {
        table.increments();
        table.string("policy_number",50).notNullable().unique();
        table.string("policy_type",50).notNullable();
        table.integer("policy_term");
        table.string("description");
        table.decimal("coverage_amount",10,2);
        table.date("coverage_period");
        table.decimal("premium",10,2);
        table.date("start_date");
        table.boolean("email_notification");
        table.boolean("fund_management");
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users.id");
      });

      await knex.schema.createTable("policy_holder", (table) => {
        table.increments();
        table.string("last_name");
        table.string("first_name");
        table.integer("policy_id").unsigned();
        table.foreign("policy_id").references("policy.id");
      });

      await knex.schema.createTable("insurer", (table) => {
        table.increments();
        table.string("last_name");
        table.string("first_name");
        table.integer("policy_id").unsigned();
        table.foreign("policy_id").references("policy.id");
      });

      await knex.schema.createTable("claims", (table) => {
        table.increments();
        table.decimal("amount",10,2);
        table.integer("policy_id").unsigned();
        table.foreign("policy_id").references("policy.id");
      });

      await knex.schema.createTable("transaction", (table) => {
        table.increments();
        table.decimal("income",10,2);
        table.decimal("expenses",10,2);
        table.integer("policy_id").unsigned();
        table.foreign("policy_id").references("policy.id");
      });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transaction");
  await knex.schema.dropTableIfExists("claims");
  await knex.schema.dropTableIfExists("insurer");
  await knex.schema.dropTableIfExists("policy_holder");
  await knex.schema.dropTableIfExists("policy");
  await knex.schema.dropTableIfExists("users");
}

