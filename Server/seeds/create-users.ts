import { Knex } from "knex";
import { hashPassword } from "../hash";

export async function seed(knex: Knex): Promise<void> {

    const password = await hashPassword("testingpassword12345");
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        { username: "superadmin1", password: password, userType:"superadmin",permissionsLevel:10 },
    ]);
};
