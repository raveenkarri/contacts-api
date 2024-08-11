const express = require("express");
const dbConnection = require("./cofiguration/MongoDb");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
dbConnection();

const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/users", require("./routes/UserContact"));

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
