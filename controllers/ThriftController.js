const { Op } = require("sequelize");
const sequelize = require("../config/database/connection");
const GroupService = require("../service/ThriftService");

exports.createGroup = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const {
        name,
        description,
        startAmount,
        capacity,
        isSearchAble
      } = req.body;
      const groupExist = await GroupService.checkForGroup(name);
      if (groupExist) {
        return res.status(400).send({
          success: false,
          message: "A group with similar name already exist"
        });
      }
      const groupData = {
        name,
        description,
        startAmount,
        capacity,
        isSearchAble,
        adminId: req.user.id
      };
      const group = await GroupService.createNewGroup(groupData, t);

      return res.status(201).send({
        success: true,
        group
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.findAgroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await GroupService.findAGroup(id);
    if (!group) {
      return res.status(404).send({
        success: false,
        group: null,
        message: "Invalid Group"
      });
    }
    return res.status(200).send({
      success: true,
      group
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Server Error"
    });
  }
};

exports.getAllGroup = async (req, res) => {
  try {
    const { search } = req.query;
    let groups = await GroupService.findAllGroup();
    if (search && search !== "") {
      const conditions = {
        isSearchAble: true,
        [Op.or]: {
          name: { [Op.like]: `%${search}%` },
          description: { [Op.like]: `%${search}%` },
          startAmount: { [Op.like]: `%${search}%` }
        }
      };
      groups = await GroupService.SearchForGroup(conditions);
    }

    return res.status(200).send({
      success: true,
      groups
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Server Error"
    });
  }
};
