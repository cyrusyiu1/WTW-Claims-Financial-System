import { Knex } from "knex";
import knex from "./knex";
import { User } from "./models";

class GuardService {
  constructor(private knex: Knex) {}

  async getUserById(id: number) {
    const user = await this.knex<User>("users").where({ id }).first();
    return user;
  }
}

export const guardService = new GuardService(knex);