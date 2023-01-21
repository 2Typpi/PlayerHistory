import bcrypt from "bcryptjs";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";
import { Player } from "../models/player.js";
import { Club } from "../models/club.js";

//CRUD for players
export async function getAll(club_name) {
  const club = await findClub(club_name);
  return await Player.findAll({
    where: { club_id: club.club_id },
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

export async function getPlayerByName(name, club_name) {
  const club = await findClub(club_name);

  const [player, created] = await Player.findOrCreate({
    where: { Name: name, club_id: club.club_id },
    defaults: {
      Games: 0,
      Goals: 0,
      YellowCards: 0,
      YellowRedCards: 0,
      RedCards: 0,
      club_id: club.club_id,
    },
  });
  return player;
}

async function findClub(club_name) {
  const club = await Club.findOne({ where: { Name: club_name } });
  if (club === null) {
    throw 'Club "' + club_name + '" does not exist';
  }
  return club;
}

export async function createPlayerService(player, club_name) {
  const club = await findClub(club_name);
  player.club_id = club.club_id;

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
  return editedPlayer;
}

export async function deletePlayerService(uuid) {
  return Player.destroy({
    where: {
      player_id: uuid,
    },
  });
}
