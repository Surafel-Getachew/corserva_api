import { Sequelize } from 'sequelize-typescript';
import models from '../models';
const dbConfig = require('../config/dbConfg');
console.log("dbConfig",dbConfig);

const connection = new Sequelize({
  ...dbConfig,
  models: Object.values(models),
  logging: false,
});

export default connection;
