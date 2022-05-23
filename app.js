/* eslint-disable no-unused-vars */
require("dotenv").config();
const express = require("express");

const app = express();
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const cron = require("node-cron");

const server = http.createServer(app);
require("./config/database/connection");

const Routes = require("./routes");
const GroupService = require("./service/ThriftService");

app.use(morgan("combined"));

app.use(cors());
app.use(express.json());

app.use(
  express.urlencoded({
    extended: false
  })
);

app.get("/", (req, res) => {
  res.send(`Esusu Confam Ltd ${new Date()}`);
});

app.use("/api", Routes);

// Handles all errors
app.use((err, req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      if (err.status === 412) {
        return res
          .status(err.status)
          .send({ success: false, message: err.message });
      }
      return res
        .status(err.status || 400)
        .send({ success: false, message: "An error occur" });
    }
    return res
      .status(err.status || 400)
      .send({ success: false, message: err.message, err });
  } catch (error) {
    return res
      .status(error.status || 400)
      .send({ success: false, message: error.message });
  }
});

// Not found route
app.use((req, res) => {
  return res.status(404).send({ success: false, message: "Route not found" });
});

cron.schedule("* 6 * * monday", async () => {
  console.log("Job Runs");
  const groups = await GroupService.findAllOngoingGroup();
  console.log(groups);
  await Promise.all(
    groups.map(async group => {
      const totalAmountSaved = Number(group.totalAmountSaved);
      const members = await GroupService.getAllUserInGroup(group.id);
      console.log(members, "MEMBERS");
      await Promise.all(
        members.map(async member => {
          const totalAmount = Number(member.totalAmount);

          const updatedAmount = totalAmount + Number(group.startAmount);
          console.log(totalAmount, group.startAmount, updatedAmount);
          const updatedData = {
            totalAmount: updatedAmount,
            groupId: member.groupId,
            userId: member.userId
          };
          await GroupService.updateMemberAmountInGroup(updatedData);
        })
      );
      const newMembers = await GroupService.getAllUserInGroup(group.id);
      const totalSaved = newMembers.reduce((sum, member) => {
        return sum + Number(member.totalAmount);
      }, 0);
      const data = {
        id: group.id,
        totalAmountSaved: totalSaved
      };
      await GroupService.updateAmountSaved(data);
    })
  );
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
