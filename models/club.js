"use strict";

import Sequelize from "sequelize";
import { sequelizeCon } from "../utils/database.js";
import { User } from "./user.js";

const Club = sequelizeCon.define("club", {
  club_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },

  Name: { type: Sequelize.STRING, allowNull: false },
  SecondTeam: { type: Sequelize.STRING, allowNull: true },
  ThirdTeam: { type: Sequelize.STRING, allowNull: true },

  //ForeignKey to User
  user_id: {
    type: Sequelize.UUID,
    references: {
      model: User,
      key: "user_id",
    },
  },

  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

Club.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });

export { Club };
