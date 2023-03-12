import bcrypt from "bcryptjs";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

export async function authenticate({ Username, Password }) {
  const user = await User.scope("withHash").findOne({ where: { Username } });

  if (!user || !(await bcrypt.compare(Password, user.Hash)))
    throw "Username or password is incorrect";

  let userRole = "User";
  if (user.Username === "admin") {
    userRole = "Admin";
  }

  // authentication successful
  const token = jwt.sign({ sub: user.user_id, role: userRole }, "Big Secret", { expiresIn: "7d" });
  return { ...omitHash(user.get()), token };
}

export async function getAll() {
  return await User.findAll();
}

export async function getById(id) {
  return await getUser(id);
}

// helper functions

export async function getUser(id) {
  const user = await User.findByPk(id);
  if (!user) throw "User not found";
  return user;
}

function omitHash(user) {
  const { hash, ...userWithoutHash } = user;
  return userWithoutHash;
}

export async function create(params) {
  // validate
  if (await User.findOne({ where: { Username: params.Username } })) {
    throw 'Username "' + params.username + '" is already taken';
  }

  const newUser = {
    Username: params.Username,
    Hash: "",
  };

  // hash password
  if (params.Password) {
    newUser.Hash = await bcrypt.hash(params.Password, 10);
  }

  // save user
  await User.create(newUser);
}

export async function editUserService(user) {
  const editedUser = await User.update(user, {
    where: {
      user_id: user.user_id,
    },
  });
  return editedUser;
}

export async function deleteUser(uuid) {
  return User.destroy({
    where: {
      user_id: uuid,
    },
  });
}
