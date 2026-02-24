const express = require("express");
const app = express();
const port = 3000;
const errorHandler = require("./middlewares/errorHandler");
const AuthController = require("./controllers/AuthController");
const auth = require("./middlewares/auth");
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(auth);
app.post("/auth/register", AuthController.Register);
app.post("/auth/login", AuthController.Login);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
