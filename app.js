const express = require('express');

const app = express();
const cors = require("cors");
const morgan = require("morgan");

const Routes = require("./routes");


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
    if (process.env.NODE_ENV === "production") {
        return res.status(err.status || 400).send({ success: false });
    }
    return res
        .status(err.status || 400)
        .send({ success: false, message: err.message });
});

app.use((req, res) =>
    res.status(404).send({ success: false, message: "Route not found" })
);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});