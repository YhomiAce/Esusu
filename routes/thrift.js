const express = require("express");

const router = express.Router();
const ThriftController = require("../controllers/ThriftController");
const Auth = require("../middleware/auth");
const {
  validate,
  thriftGroupValidation,
  joinGroupValidation,
  invitationValidation
} = require("../helpers/validators");

// @route  api/thrift/create-group
// @method POST
// @access private
// @desc create a group
router
  .route("/thrift/create-group")
  .post(thriftGroupValidation(), validate, Auth, ThriftController.createGroup);

// @route  api/thrift/start-thrift/:groupId
// @method PATCH
// @access private
// @desc Start group thrift
router
  .route("/thrift/start-thrift/:groupId")
  .patch(Auth, ThriftController.startThrift);

// @route  api/thrift/groups
// @method Get
// @access private
// @desc get all group
router.route("/thrift/groups").get(Auth, ThriftController.getAllGroup);

// @route  api/thrift/group/:id
// @method Get
// @access private
// @desc find group by Id
router.route("/thrift/group/:id").get(Auth, ThriftController.findAgroup);

// @route  api/thrift/get-my-groups
// @method Get
// @access private
// @desc get user groups
router
  .route("/thrift/get-my-groups")
  .get(Auth, ThriftController.getAllUserGroups);

// @route  api/thrift/join-group
// @method POST
// @access private
// @desc join a group
router
  .route("/thrift/join-group")
  .post(joinGroupValidation(), validate, Auth, ThriftController.joinGroup);

// @route  api/thrift/invite
// @method POST
// @access private
// @desc join a group
router
  .route("/thrift/group/invitation")
  .post(
    invitationValidation(),
    validate,
    Auth,
    ThriftController.sendInvitation
  );

// @route  api/signup
// @method POST
// @access Public
// @desc register user
router.route("/thrift/invite-user").post(ThriftController.joinGroupById);

router.get("/find-max/:groupId", ThriftController.getMaximumNum);

module.exports = router;
