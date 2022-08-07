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
import { spawn } from "child_process";
import { isUri } from "valid-url";
var router = Router();

router.get("/script", activateScript);
router.put("/update", addStats);

router.post("/players", createPlayer);
router.get("/players", loadAllPlayers);
router.get("/players/:uuid", loadPlayer);
router.put("/players/:uuid", editPlayer);
router.delete("/players/:uuid", deletePlayer);

export default router;

//Start python webscraper
function activateScript(req, res, next) {
  // console.log(isWebUri(req.query.link));
  // if (isWebUri(req.query.link)) {
  //   res.sendStatus(400);
  // }
  let resultString = "";
  const python = spawn("python", ["python/bfv_players.py", req.query.link]);
  python.stdout.on("data", function (data) {
    resultString = data.toString();
  });
  python.on("close", (code) => {
    if (resultString === "" || code !== 0) {
      res.sendStatus(404);
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
  console.log(req.params.uuid);
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
      .then(async (dbPlayer) => {
        console.log(dbPlayer);
        await updatePlayer(dbPlayer, player);
      })
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
