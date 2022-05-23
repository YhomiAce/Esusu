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

// @route  api/thrift/invite-user
// @method POST
// @access Public
// @desc invite user to join group
router.route("/thrift/invite-user").post(ThriftController.joinGroupById);

// @route  api/find-max/:groupId
// @method GET
// @access Public
// @desc get the last saved sequence
router.get("/find-max/:groupId", ThriftController.getMaximumNum);

// @route  api/thrift/thrift/member-group-details
// @method Get
// @access private
// @desc Let members of group access group details and view payout list
router
  .route("/thrift/member-group-details/:groupId")
  .get(Auth, ThriftController.groupDetailsByMember);

module.exports = router;
