import bcrypt from "bcryptjs";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";
import { Player } from "../models/player.js";

export async function getAll() {
  return await Player.findAll({
    attributes: [
      "player_id",
      "FirstName",
      "LastName",
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

export async function createPlayerService(player) {
  const createdPlayer = await Player.create(player);
  console.log(createdPlayer);
  return createdPlayer;
}

export async function editPlayerService(player) {
  const editedPlayer = await Player.update(player, {
    where: {
      player_id: player.player_id,
    },
  });
  return editedPlayer;
}

export async function deletePlayerService(uuid) {
  return Player.destroy({
    where: {
      player_id: uuid,
    },
  });
}
