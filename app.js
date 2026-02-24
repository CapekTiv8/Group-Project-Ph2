const express = require("express");
const app = express();
const port = 3000;
const errorHandler = require("./middlewares/errorHandler");
const AuthController = require("./controller/AuthController");
const auth = require("./middlewares/authentication");
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", AuthController.Register);
app.post("/login", AuthController.Login);
app.use(auth);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
