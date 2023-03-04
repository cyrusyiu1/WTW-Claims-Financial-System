import { Knex } from "knex";
import { hashPassword } from "../hash";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      username: "superadmin",
      password: await hashPassword("superadmin"),
      userType: "superadmin",
      permissionsLevel: 0,
      authorityLevel: 0,
    },
  ]);
  await knex("users").insert([
    {
      username: "claima",
      password: await hashPassword("claima"),
      userType: "claim",
      permissionsLevel: 1,
      authorityLevel: 0,
    },
  ]);
  await knex("users").insert([
    {
      username: "claimb",
      password: await hashPassword("claimb"),
      userType: "claim",
      permissionsLevel: 1,
      authorityLevel: 0,
    },
  ]);
  await knex("users").insert([
    {
      username: "claimc",
      password: await hashPassword("claimc"),
      userType: "claim",
      permissionsLevel: 2,
      authorityLevel: 0,
    },
  ]);
  await knex("users").insert([
    {
      username: "claimd",
      password: await hashPassword("claimd"),
      userType: "claim",
      permissionsLevel: 2,
      authorityLevel: 0,
    },
  ]);
  await knex("users").insert([
    {
      username: "claime",
      password: await hashPassword("claime"),
      userType: "claim",
      permissionsLevel: 3,
      authorityLevel: 0,
    },
  ]);
  await knex("users").insert([
    {
      username: "claimf",
      password: await hashPassword("claimf"),
      userType: "claim",
      permissionsLevel: 3,
      authorityLevel: 0,
    },
  ]);
  await knex("users").insert([
    {
      username: "finance1",
      password: await hashPassword("finance1"),
      userType: "finance",
      permissionsLevel: 0,
      authorityLevel: 0,
    },
  ]);
  await knex("users").insert([
    {
      username: "readonly1",
      password: await hashPassword("readonly1"),
      userType: "readonly",
      permissionsLevel: 0,
      authorityLevel: 0,
    },
  ]);
  await knex("users").insert([
    {
      username: "readonly2",
      password: await hashPassword("readonly2"),
      userType: "readonly",
      permissionsLevel: 0,
      authorityLevel: 0,
    },
  ]);
}
