import dotenv from 'dotenv';
dotenv.config();

const { DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

const dbConfig = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'corserva_database_development',
    host: DB_HOST,
    dialect: 'postgres',
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'corserva_database_test',
    host: DB_HOST,
    dialect: 'postgres',
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'corserva_database_production',
    host: DB_HOST,
    dialect: 'postgres',
  },
};

// module.exports = dbConfig
export default dbConfig;
