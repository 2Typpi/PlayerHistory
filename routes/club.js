import { Router } from "express";
import { authorize, authorizeAdmin } from "../middleware/authorize.js";
import {
  getAll,
  getById,
  create,
  getClubByUsername,
  deleteClub,
  editClubService,
} from "../repository/clubService.js";

var router = Router();
// routes
router.post("/", authorize(), clubCreate);
router.get("/", authorize(), clubGetAll);
router.get("/:id", authorize(), clubGetById);
router.get("/user/:username", authorize(), clubGetByUser);
router.put("/:uuid", authorizeAdmin(), editClub);
router.delete("/:uuid", authorizeAdmin(), clubDelete);

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

function editClub(req, res, next) {
  const correctedClub = req.body;
  const searchedClub = getById(req.params.uuid);
  if (searchedClub) {
    editClubService(correctedClub)
      .then((stats) => (stats[0] === 1 ? res.json(correctedClub) : res.sendStatus(404)))
      .catch((err) => next(err));
  } else {
    res.sendStatus(404);
  }
}

function clubDelete(req, res, next) {
  deleteClub(req.params.uuid)
    .then((stats) => {
      stats === 1 ? res.sendStatus(204) : res.sendStatus(404);
    })
    .catch((err) => next(err));
}
