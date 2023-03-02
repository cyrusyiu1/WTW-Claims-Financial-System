import { env } from "./env";
import Knex from "knex";

const knexConfig = require("./knexfile");

const config = Knex(knexConfig[env.nodeEnv]);

export default config;