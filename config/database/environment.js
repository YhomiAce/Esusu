require("dotenv").config();

module.exports = {
  development: {
    host: process.env.DEVELOPMENT_HOSTNAME,
    database: process.env.DEVELOPMENT_DB_NAME,
    username: process.env.DEVELOPMENT_USERNAME,
    password: process.env.DEVELOPMENT_PASSWORD,
    dialect: process.env.DIALECT
  },
  production: {
    host: process.env.RDS_HOSTNAME,
    database: process.env.RDS_DB_NAME,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    dialect: process.env.DIALECT
  }
};
