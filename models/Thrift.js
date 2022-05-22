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
    type: Sequelize.INTEGER,
    allowNull: true
  },
  isSearchAble: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  totalAmountSaved: {
    type: Sequelize.FLOAT,
    defaultValue: 0,
    allowNull: true
  },
  groupStatus: {
    type: Sequelize.ENUM("pending", "ongoing", "end"),
    defaultValue: "pending",
    allowNull: true
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
