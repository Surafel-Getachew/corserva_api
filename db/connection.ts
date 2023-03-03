import { Sequelize } from 'sequelize-typescript';
import models from '../models';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dbConfig = require('../config/dbConfg');

const connection = new Sequelize({
  ...dbConfig,
  models: Object.values(models),
  logging: false,
});

export default connection;
