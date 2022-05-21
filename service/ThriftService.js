const ThriftGroup = require("../models/Thrift");
const User = require("../models/User");

exports.createNewGroup = async (request, transaction) => {
  const group = await ThriftGroup.create(request, { transaction });
  return group;
};

exports.checkForGroup = async name => {
  const group = await ThriftGroup.findOne({ where: { name } });
  return group;
};

exports.findAllGroup = async () => {
  const groups = await ThriftGroup.findAll({
    order: [["name", "ASC"]],
    attributes: [
      "id",
      "name",
      "description",
      "startAmount",
      "capacity",
      "isSearchAble",
      "createdAt"
    ],
    include: [
      {
        model: User,
        as: "admin",
        attributes: ["name", "email"]
      }
    ]
  });
  return groups;
};

exports.findAllUserGroup = async userId => {
  const groups = await ThriftGroup.findAll({
    where: { adminId: userId },
    order: [["name", "ASC"]],
    attributes: [
      "id",
      "name",
      "description",
      "startAmount",
      "capacity",
      "isSearchAble",
      "createdAt"
    ],
    include: [
      {
        model: User,
        as: "admin",
        attributes: ["name", "email"]
      }
    ]
  });
  return groups;
};

exports.findAGroup = async id => {
  const groups = await ThriftGroup.findOne({
    where: { id },
    attributes: [
      "id",
      "name",
      "description",
      "startAmount",
      "capacity",
      "isSearchAble",
      "createdAt"
    ],
    include: [
      {
        model: User,
        as: "admin",
        attributes: ["name", "email"]
      }
    ]
  });
  return groups;
};

exports.SearchForGroup = async conditions => {
  const groups = await ThriftGroup.findAll({
    where: conditions,
    order: [["name", "ASC"]],
    attributes: [
      "id",
      "name",
      "description",
      "startAmount",
      "capacity",
      "isSearchAble",
      "createdAt"
    ],
    include: [
      {
        model: User,
        as: "admin",
        attributes: ["name", "email"]
      }
    ]
  });
  return groups;
};
