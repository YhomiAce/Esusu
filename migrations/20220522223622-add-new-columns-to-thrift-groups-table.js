/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
  */
    return queryInterface.sequelize.transaction(async t => {
      try {
        const totalAmountSavedColumn = await queryInterface.addColumn(
          "thrift_groups",
          "totalAmountSaved",
          {
            type: Sequelize.FLOAT,
            defaultValue: 0,
            allowNull: true
          },
          {
            transaction: t
          }
        );

        const groupStatusColumn = await queryInterface.addColumn(
          "thrift_groups",
          "groupStatus",
          {
            type: Sequelize.ENUM("pending", "ongoing", "end"),
            defaultValue: "pending",
            allowNull: true
          },
          {
            transaction: t
          }
        );

        return Promise.all(totalAmountSavedColumn, groupStatusColumn);
      } catch (error) {
        return t.rollback();
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
    const totalAmountSavedColumn = await queryInterface.removeColumn(
      "thrift_groups",
      "totalAmountSaved",
      {}
    );
    const groupStatusColumn = await queryInterface.removeColumn(
      "thrift_groups",
      "groupStatus",
      {}
    );
    return Promise.all(totalAmountSavedColumn, groupStatusColumn);
  }
};
