import { Router } from "express";
import {
  getAll,
  getPlayerById,
  createPlayerService,
  editPlayerService,
  deletePlayerService,
} from "../repository/statService.js";
var router = Router();

router.post("/players", createPlayer);
router.get("/players", loadAllPlayers);
router.get("/players/:uuid", loadPlayer);
router.put("/players/:uuid", editPlayer);
router.delete("/players/:uuid", deletePlayer);

export default router;

function loadAllPlayers(req, res, next) {
  getAll()
    .then((statistic) => (statistic ? res.json(statistic) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function createPlayer(req, res, next) {
  console.log(req.body);
  createPlayerService(req.body)
    .then((statistic) => (statistic ? res.json(statistic) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function loadPlayer(req, res, next) {
  console.log(req.params.uuid);
  getPlayerById(req.params.uuid)
    .then((stats) => (stats ? res.json(stats) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function editPlayer(req, res, next) {
  const correctedPlayer = req.body;
  console.log(correctedPlayer);
  const searchedPlayer = getPlayerById(req.params.uuid);
  if (searchedPlayer) {
    editPlayerService(correctedPlayer)
      .then((stats) => (stats[0] === 1 ? res.json(correctedPlayer) : res.sendStatus(404)))
      .catch((err) => next(err));
  } else {
    res.sendStatus(404);
  }
}

function deletePlayer(req, res, next) {
  deletePlayerService(req.params.uuid)
    .then((stats) => {
      stats === 1 ? res.sendStatus(204) : res.sendStatus(404);
    })
    .catch((err) => next(err));
}
