import validator from "validator";
import { v4 as uuidv4 } from "uuid";
import { Club } from "../models/club.js";
import { User } from "../models/user.js";

//CRUD for players
export async function getAll() {
  return await Club.findAll({
    attributes: ["club_id", "Name", "SecondTeam", "ThirdTeam", "user_id"],
  });
}

export async function create(params) {
  // validate
  if (await Club.findOne({ where: { Name: params.name } })) {
    throw 'Name "' + params.name + '" is already taken';
  }

  const assignedUser = await User.findOne({ where: { Username: params.username } });
  if (assignedUser === null) {
    throw 'Username "' + params.username + '" does not exist!';
  }

  const club = {
    Name: params.name,
    SecondTeam: params.secondTeam,
    ThirdTeam: params.thirdTeam,
    user_id: assignedUser.user_id,
  };

  return await Club.create(club);
}

export async function getById(id) {
  return await getClub(id);
}

export async function getClub(id) {
  const club = await Club.findByPk(id);
  if (!club) throw "Club not found";
  return club;
}

export async function getClubByUsername(username) {
  const assignedUser = await User.findOne({ where: { Username: username } });
  return await Club.findOne({ where: { user_id: assignedUser.user_id } });
}
