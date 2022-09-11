"use strict";

import Sequelize from "sequelize";
import { sequelizeCon } from "../utils/database.js";

const options = {
  defaultScope: {
    // exclude hash by default
    attributes: { exclude: ["hash"] },
  },
  scopes: {
    // include hash with this scope
    withHash: { attributes: {} },
  },
};

export const User = sequelizeCon.define(
  "user",
  {
    user_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    Username: { type: Sequelize.STRING, allowNull: false },
    Hash: { type: Sequelize.STRING, allowNull: false },
  },
  options
);
