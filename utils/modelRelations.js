import { Player } from "./models/player.js";
import { Club } from "./models/club.js";
import { User } from "./models/user.js";

export default setRelations;

function setRelations() {
  //Set relations for DB Models
  User.hasOne(Club, { foreignKey: "user_id" });
  Club.belongsTo(User);

  Club.hasMany(Player, { foreignKey: "club_id" });
  Player.belongsTo(Club);
}
