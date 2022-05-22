const Sequelize = require("sequelize");
const sequelise = require("../config/database/connection");

const PayoutSequence = sequelise.define("payout_sequences", {
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
  sequenceNumber: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

module.exports = PayoutSequence;
