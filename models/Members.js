const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");
const User = require("./User");
const Thrift = require("./Thrift");

const Members = sequelise.define("members", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
    primaryKey: true
  },
  groupId: {
    type: Sequelize.UUID,
    allowNull: true
  },
  userId: {
    type: Sequelize.UUID,
    allowNull: true
  },
  totalAmount: {
    type: Sequelize.FLOAT,
    defaultValue: 0,
    allowNull: true
  },
  hasCollect: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: false
  }
});

Members.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

Members.belongsTo(Thrift, {
  foreignKey: "groupId",
  as: "group"
});

Thrift.hasMany(Members, {
  foreignKey: "groupId",
  as: "group_members"
});

module.exports = Members;
