import { Router } from "express";
import Joi from "joi";
import validateRequest from "../middleware/validate-request.js";
import authorize from "../middleware/authorize.js";
import { authenticate, getAll, getById, create } from "../repository/userService.js";

var router = Router();
// routes
router.post("/authenticate", authenticateSchema, userAuthenticate);
router.post("/register", registerSchema, register);
router.get("/register/toggle", authorize(), registerEnableToggle);
router.get("/", authorize(), userGetAll);
router.get("/current", authorize(), getCurrent);
router.get("/:id", authorize(), userGetById);

export default router;

// Per Konstante activate/deactivate register

var registerEnabled = true;

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    Username: Joi.string().required(),
    Password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function userAuthenticate(req, res, next) {
  authenticate(req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function userGetAll(req, res, next) {
  getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getCurrent(req, res, next) {
  res.json(req.user);
}

function userGetById(req, res, next) {
  getById(req.params.id)
    .then((user) => res.json(user))
    .catch(next);
}

function registerSchema(req, res, next) {
  const schema = Joi.object({
    Username: Joi.string().required(),
    Password: Joi.string().min(5).required(),
  });
  validateRequest(req, next, schema);
}

function register(req, res, next) {
  if (registerEnabled) {
    create(req.body)
      .then(() => res.json({ message: "Registration successful" }))
      .catch(next);
  } else {
    res.json({ message: "Disabled" });
  }
}

function registerEnableToggle(req, res, next) {
  registerEnabled = !registerEnabled;
  res.json({ message: "Toggled" });
}
