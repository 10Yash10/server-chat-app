import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("req.cookies :: ", req.cookies);
  const token = req.cookies.jwt;
  console.log("token :: ", { token });
};
