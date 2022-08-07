import cookieParser from "cookie-parser";
import express from "express";
import createError from "http-errors";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { sequelizeCon } from "./utils/database.js";
import errorHandler from "./middleware/error-handler.js";

sequelizeCon.sync();
//sequelizeCon.sync({ force: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//const jwt = require("./helper/jwt");

import statsRouter from "./routes/stats.js";

const app = express();

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

//app.use(jwt());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser);
app.use(express.static(join(__dirname, "public")));
console.log(join(__dirname, "views"));

app.use("/stats", statsRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

var port = 3001;
app.listen(port, function () {
  console.log("app listening on port " + port);
});

export default app;
