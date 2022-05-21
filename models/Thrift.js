const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const User = require("./User");

const ThriftGroup = sequelise.define("thrift_groups", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
    primaryKey: true
  },
  adminId: {
    type: Sequelize.UUID,
    allowNull: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true
  },
  startAmount: {
    type: Sequelize.FLOAT,
    allowNull: true
  },
  capacity: {
    type: Sequelize.FLOAT,
    allowNull: true
  },
  isSearchAble: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
});

ThriftGroup.belongsTo(User, {
  foreignKey: "adminId",
  as: "admin"
});

User.hasMany(ThriftGroup, {
  foreignKey: "adminId",
  as: "owner"
});

module.exports = ThriftGroup;
