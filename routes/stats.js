import { Router } from "express";
import {
  getAll,
  getPlayerById,
  getPlayerByName,
  updatePlayer,
  createPlayerService,
  editPlayerService,
  deletePlayerService,
} from "../repository/statService.js";
import authorize from "../middleware/authorize.js";

import { spawn } from "child_process";
import { isUri } from "valid-url";
var router = Router();

router.get("/script", authorize(), activateScript);
router.put("/update", authorize(), addStats);

router.post("/players", authorize(), createPlayer);
router.get("/players", authorize(), loadAllPlayers);
router.get("/players/:uuid", authorize(), loadPlayer);
router.put("/players/:uuid", authorize(), editPlayer);
router.delete("/players/:uuid", authorize(), deletePlayer);

export default router;

//Start python webscraper
function activateScript(req, res, next) {
  //Check if URL is valid
  if (!isUri(req.query.link)) {
    res.sendStatus(400);
    return;
  }

  //Spawn python script
  let resultString = "";
  const python = spawn("python", ["python/bfv_players.py", req.query.link]);

  //Read all printed statements
  python.stdout.on("data", function (data) {
    resultString = data.toString();
  });

  //Send players to frontend
  python.on("close", (code) => {
    if (resultString === "" || code !== 0) {
      res.sendStatus(400);
      return;
    }
    let scrapedPlayers = JSON.parse(resultString);
    res.json(scrapedPlayers);
  });
}

//CRUD for players
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
  getPlayerById(req.params.uuid)
    .then((stats) => (stats ? res.json(stats) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function editPlayer(req, res, next) {
  const correctedPlayer = req.body;
  const searchedPlayer = getPlayerById(req.params.uuid);
  if (searchedPlayer) {
    editPlayerService(correctedPlayer)
      .then((stats) => (stats[0] === 1 ? res.json(correctedPlayer) : res.sendStatus(404)))
      .catch((err) => next(err));
  } else {
    res.sendStatus(404);
  }
}

function addStats(req, res, next) {
  let players = req.body;
  players.forEach((player) => {
    getPlayerByName(player.name)
      .then(async (dbPlayer) => await updatePlayer(dbPlayer, player))
      .catch((err) => next(err));
  });
  res.sendStatus(200);
}

function deletePlayer(req, res, next) {
  deletePlayerService(req.params.uuid)
    .then((stats) => {
      stats === 1 ? res.sendStatus(204) : res.sendStatus(404);
    })
    .catch((err) => next(err));
}
