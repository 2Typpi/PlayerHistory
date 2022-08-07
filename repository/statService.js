import bcrypt from "bcryptjs";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";
import { Player } from "../models/player.js";

//CRUD for players
export async function getAll() {
  return await Player.findAll({
    attributes: [
      "player_id",
      "Name",
      "Games",
      "YellowCards",
      "YellowRedCards",
      "RedCards",
      "Goals",
    ],
  });
}

export async function getPlayerById(uuid) {
  const player = await Player.findByPk(uuid);
  return player;
}

export async function getPlayerByName(name) {
  const [player, created] = await Player.findOrCreate({
    where: { Name: name },
    defaults: {
      Games: 0,
      Goals: 0,
      YellowCards: 0,
      YellowRedCards: 0,
      RedCards: 0,
    },
  });
  console.log(created);
  return player;
}

export async function createPlayerService(player) {
  const createdPlayer = await Player.create(player);
  return createdPlayer;
}

export async function updatePlayer(dbPlayer, player) {
  await dbPlayer.increment("Games", { by: player.games });
  await dbPlayer.increment("Goals", { by: player.goals });
  await dbPlayer.increment("YellowCards", { by: player.yellow_cards });
  await dbPlayer.increment("YellowRedCards", { by: player.yellow_red_cards });
  await dbPlayer.increment("RedCards", { by: player.red_cards });
  return dbPlayer;
}

export async function editPlayerService(player) {
  const editedPlayer = await Player.update(player, {
    where: {
      player_id: player.player_id,
    },
  });
  console.log("after: " + editedPlayer[0]);
  console.log("before: " + player.player_id);
  return editedPlayer;
}

export async function deletePlayerService(uuid) {
  console.log(uuid);
  return Player.destroy({
    where: {
      player_id: uuid,
    },
  });
}
