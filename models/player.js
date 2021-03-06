"use strict";

import Sequelize from "sequelize";
import { sequelizeCon } from "../utils/database.js";

export const Player = sequelizeCon.define("player", {
  player_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },

  FirstName: { type: Sequelize.STRING, allowNull: false },
  LastName: { type: Sequelize.STRING, allowNull: false },
  Games: { type: Sequelize.INTEGER, allowNull: false },
  Goals: { type: Sequelize.INTEGER, allowNull: false },
  YellowCards: { type: Sequelize.INTEGER, allowNull: false },
  YellowRedCards: { type: Sequelize.INTEGER, allowNull: false },
  RedCards: { type: Sequelize.INTEGER, allowNull: false },

  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});
