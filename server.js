const express = require("express");
const dbConnection = require("./cofiguration/MongoDb");
const cors = require("cors");

require("dotenv").config();
dbConnection();

const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", require("./routes/UserContact"));

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
