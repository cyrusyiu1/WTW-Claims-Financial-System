import type { Knex } from "knex";
import dotenv from "dotenv";
import { env } from "./env";
dotenv.config();

// Update with your config settings.

// Below are configs of several environments, including:
// local, staging, development, test, production

const config: { [key: string]: Knex.Config } = {
  local: {
    client: "sqlite3",
    connection: {
      filename: "./dev.sqlite3",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  development: {
    debug: false,
    client: "postgresql",
    connection: env.database,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  test: {
    debug: false,
    client: "postgresql",
    connection: env.database,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: env.database,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

module.exports = config;
