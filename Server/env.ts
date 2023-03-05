import { config } from "dotenv";

config();

function ensure(key: string) {
  let value = process.env[key];
  if (!value) {
    throw new Error(`missing ${key} environment variable`);
  }
  return value;
}

function optional(key: string, def: string) {
  let value = process.env[key];
  if (!value) {
    return def;
  }
  return value;
}

export let env = {
  nodeEnv: ensure("NODE_ENV"),
  port: +ensure("PORT"),
  JWT_SECRET: ensure("JWT_SECRET"),
  database: {
    host: ensure("POSTGRES_HOST"),
    port: +ensure("POSTGRES_PORT"),
    database: ensure("POSTGRES_DB"),
    user: ensure("POSTGRES_USER"),
    password: ensure("POSTGRES_PASSWORD"),
  },
  smtpHost: ensure("SMTP_HOST"),
  smtpSecure: (optional("SMTP_SECURE", '').toLowerCase() === "true"),
  smtpPort: +ensure("SMTP_PORT"),
  smtpUser: optional("SMTP_USER", ''),
  smtpPass: optional("SMTP_PASS", ''),
  frontendUrl: ensure("FRONTEND_URL"),
  namescaneApi: ensure('NAMESCAN_API'),
  aws: {
    //   accessKeyId: ensure("AWS_ACCESS_KEY_ID"),
    //   secretAccessKey: ensure("AWS_SECRET_ACCESS_KEY"),
    // s3Region: ensure("AWS_S3_REGION"),
    // s3Bucket: ensure("AWS_S3_BUCKET"),
  },
};
