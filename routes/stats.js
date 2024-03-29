import { Router } from "express";
import {
  findClub,
  getAll,
  getPlayerById,
  getPlayerByName,
  updatePlayer,
  createPlayerService,
  editPlayerService,
  deletePlayerService,
} from "../repository/statService.js";
import { authorize } from "../middleware/authorize.js";

import { spawn } from "child_process";
import { isUri } from "valid-url";
var router = Router();

router.post("/script", authorize(), activateScript);
router.put("/update", authorize(), addStats);

router.post("/players", authorize(), createPlayer);
router.get("/players/:name", authorize(), loadAllPlayers);
router.get("/players/:uuid", authorize(), loadPlayer);
router.put("/players/:uuid", authorize(), editPlayer);
router.delete("/players/:uuid", authorize(), deletePlayer);

export default router;

//Start python webscraper
async function activateScript(req, res, next) {
  const club = await findClub(req.body.club);

  //Check if URL is valid
  if (!isUri(req.body.link)) {
    res.sendStatus(400);
    return;
  }

  let clubname = club.Name.replace(/ /g, "_");
  let secondTeam = club.SecondTeam.replace(/ /g, "_");
  let ThirdTeam = club.ThirdTeam.replace(/ /g, "_");

  //Spawn python script
  let resultString = "";
  const python = spawn("python", [
    "python/bfv_players.py",
    req.body.link,
    clubname,
    secondTeam,
    ThirdTeam,
  ]);

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
  getAll(req.params.name)
    .then((statistic) => (statistic ? res.json(statistic) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function createPlayer(req, res, next) {
  let player = req.body.player;
  let club = req.body.club;
  createPlayerService(player, club)
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
  let players = req.body.players;
  let club = req.body.club;
  players.forEach((player) => {
    getPlayerByName(player.name, club)
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
