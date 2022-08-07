import router from "express";
import Joi from "joi";
import validateRequest from "_middleware/validate-request";
import authorize from "_middleware/authorize";
import { authenticate, getAll, getById } from "../repository/userService.js";

// routes
router.post("/authenticate", authenticateSchema, userAuthenticate);
router.get("/", authorize(), userGetAll);
router.get("/current", authorize(), getCurrent);
router.get("/:id", authorize(), userGetById);

module.exports = router;

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
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
