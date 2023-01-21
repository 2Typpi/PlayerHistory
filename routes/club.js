import { Router } from "express";
import authorize from "../middleware/authorize.js";
import { getAll, getById, create, getClubByUsername } from "../repository/clubService.js";

var router = Router();
// routes
router.post("/", authorize(), clubCreate);
router.get("/", authorize(), clubGetAll);
router.get("/:id", authorize(), clubGetById);
router.get("/user/:username", authorize(), clubGetByUser);

export default router;

function clubGetAll(req, res, next) {
  getAll()
    .then((clubs) => res.json(clubs))
    .catch(next);
}

function clubGetById(req, res, next) {
  getById(req.params.id)
    .then((club) => res.json(club))
    .catch(next);
}

function clubCreate(req, res, next) {
  create(req.body)
    .then(() => res.json({ message: "Club was successfully created!" }))
    .catch(next);
}

function clubGetByUser(req, res, next) {
  getClubByUsername(req.params.username)
    .then((club) => res.json(club))
    .catch(next);
}
