import Sequelize from "sequelize";

export const sequelizeCon = new Sequelize("playerhistory", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});
