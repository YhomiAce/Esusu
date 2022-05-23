const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database/connection");
const GroupService = require("../service/ThriftService");
const UserService = require("../service/UserService");
const EmailService = require("../service/emailService");
require("dotenv").config();

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
      const data = {
        userId: req.user.id,
        groupId: group.id
      };

      await GroupService.joinAGroup(data, t);

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

exports.startThrift = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { groupId } = req.params;
      const userId = req.user.id;
      const group = await GroupService.findAGroup(groupId);
      const user = await UserService.findUserById(userId);
      if (!group || !user) {
        return res.status(404).send({
          success: false,
          message: "Invalid group or user"
        });
      }

      if (userId !== group.adminId) {
        return res.status(400).send({
          success: false,
          message: "Unauthorised User"
        });
      }
      if (group.groupStatus === "ongoing") {
        return res.status(200).send({
          success: true,
          message: "Group saving is ongoing"
        });
      }
      const data = {
        id: groupId,
        groupStatus: "ongoing"
      };

      await GroupService.updateGroup(data, t);
      const members = await GroupService.fetchAllUserAtRandom(groupId);
      const bulkData = members.map((member, i) => {
        return {
          groupId,
          userId: member.userId,
          sequenceNumber: i + 1
        };
      });
      const payoutTable = await GroupService.creatPayoutTable(bulkData, t);
      return res.status(200).send({
        success: true,
        message: "Thrift Channel has started",
        payoutTable
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

exports.joinGroup = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { groupId } = req.body;
      const userId = req.user.id;
      await this.addUserToGroup(groupId, userId);
      return res.status(201).send({
        success: true,
        message: "Successfully Joined Group"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

exports.checkGroupCapacity = async groupId => {
  const members = await GroupService.getAllUserInGroup(groupId);
  const group = await GroupService.findAGroup(groupId);
  const total = members.length;
  const capaity = Number(group.capacity);
  if (capaity >= total) {
    return false;
  }
  return true;
};

exports.addUserToGroup = async (groupId, userId) => {
  sequelize.transaction(async t => {
    try {
      const group = await GroupService.findAGroup(groupId);
      const user = await UserService.findUserById(userId);

      if (!group || !user) {
        return "Invalid Group or User";
      }

      const isFilled = await this.checkGroupCapacity(groupId);
      if (isFilled === false) {
        return "Maximum Capacity reached";
      }

      const isMember = await GroupService.checkIfMember(userId, groupId);
      if (isMember) {
        return "You are already a member of this group";
      }

      const data = {
        userId,
        groupId
      };

      await GroupService.joinAGroup(data, t);
      const message = `You have become a part of ${group.name}`;
      return message;
    } catch (error) {
      t.rollback();
      return error;
    }
  });
};

exports.getAllUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const groups = await GroupService.findAllUserGroup(userId);

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

exports.sendInvitation = async (req, res) => {
  try {
    const { groupId, email } = req.body;
    const userId = req.user.id;
    const group = await GroupService.findAGroup(groupId);
    const user = await UserService.findUserById(userId);
    if (userId !== group.adminId) {
      return res.status(401).send({
        success: false,
        message: "Unauthorised user"
      });
    }

    const message = `You have been invited to Join ${group.name} on Esusu Confam LTD,
     by ${user.name}. Click to <a href="${process.env.APP_URL}/invite-user?email=${email}&groupId=${groupId}">Register</a> 
     on platform to get started`;
    const subject = `Invitation to Join ${group.name}`;

    await EmailService.sendMail(email, message, subject);

    return res.status(200).send({
      status: true,
      message: "Invitation Sent"
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Server Error: ${error}`
    });
  }
};

exports.joinGroupById = async (req, res, next) => {
  sequelize.transaction(async t => {
    try {
      const { email, groupId } = req.query;
      if (!email || !groupId) {
        return res.status(400).send({
          success: false,
          message: "Email is required and groupId is to be attached to the link"
        });
      }
      const group = await GroupService.findAGroup(groupId);
      if (!group) {
        return res.status(404).send({
          success: false,
          message: "Invalid group"
        });
      }

      let user = await UserService.findUser(email);

      if (!user) {
        const { name, password } = req.body;
        if (!name || !password) {
          return res.status(400).send({
            success: false,
            message: "name and password is required"
          });
        }
        const hashPassword = bcrypt.hashSync(password, 10);
        const userData = { name, email, password: hashPassword };
        user = await UserService.createNewUser(userData, t);
      }
      await this.addUserToGroup(groupId, user.id);

      return res.status(201).send({
        success: true,
        message: "Successfully Joined Group"
      });
    } catch (error) {
      t.rollback();
      return next(error);
    }
  });
};

// add enum field to determine if the thrift has start/ongoing/end/pending
// cron job to collect weekly payments
