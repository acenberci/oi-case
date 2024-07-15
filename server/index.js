const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("sequelize")
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
sequelize.options.logging = false;
app.use(express.json({ limit: "50mb" }));
const db = require("./models");
const userRouter = require("./routes/Users.js");
app.use("/users", userRouter);

db.sequelize.sync().then(() => {
  app.listen(3001, "localhost", () => {
    console.log("Server running on port 3001");
  });
});
