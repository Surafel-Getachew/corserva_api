const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });
const { DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_DIALECT, DB_STORAGE } = process.env;

module.exports = {
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  dialect: DB_DIALECT,
  storage: DB_STORAGE ?? undefined,
};
