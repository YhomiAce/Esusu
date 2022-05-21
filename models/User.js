const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const User = sequelise.define("users", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

module.exports = User;
