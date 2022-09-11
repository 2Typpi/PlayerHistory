import { expressjwt } from "express-jwt";
// import { secret } from "../config.json";
import { User } from "../models/user.js";

export default authorize;

function authorize() {
  // authenticate JWT token and attach decoded token to request as req.user
  return expressjwt({
    secret: "Big Secret",
    algorithms: ["sha1", "RS256", "HS256"],
    isRevoked: isRevoked2,
  }).unless({
    path: [
      // public routes that don't require authentication
      "/user/authenticate",
      "/user/register",
    ],
    ext: ["png", "jpg", "css", "js", "woff2", "woff", "ico", "ttf", "html", "map"],
  });
}

async function isRevoked2(req, token) {
  const user = await User.findByPk(token.payload.sub);

  // revoke token if user no longer exists
  if (!user) {
    return true;
  }

  return false;
}
