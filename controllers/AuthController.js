import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";

const maxAge = 3 * 24 * 60 * 60 * 1000; // token will be valid for 3 days.

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

// signup route controller.
export const signup = async (request, response, next) => {
  response.set("Access-Control-Allow-Origin", "http://localhost:5173");
  // response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Max-Age", "1800");
  response.setHeader("Access-Control-Allow-Headers", "content-type");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  try {
    const { username, email, password } = request.body;
    if (!email || !password) {
      response.status(400).send("Email and Password are required.");
    }

    const user = await User.create({ username, email, password });
    // console.log("createToken :: ", createToken(email, user.id));
    // console.log("i m here");
    console.log("email and userId : ", email, user.id);
    response.cookie("jwt", createToken(email, user.id), {
      httpOnly: true,
      maxAge,
      secure: true,
      sameSite: "none",
    });

    // 201 is for create status code
    return response.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log();
    return response.status(500).send("Internal Server Error");
  }
};

// login route controller
export const login = async (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password is required.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send("Can't find user for " + email + " this email");
    }
    // console.log({ user });
    // checking the password
    // console.log(password, user.password);
    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(404).send("Password is incorrect");
    }

    res.cookie("jwt", createToken(email, user.id), {
      httpOnly: true,
      maxAge,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profileSetup: user.profileSetup,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log("login :: AuthController :: Error :: ", error);
    res.status(400).send("LOGIN ERROR");
  }
};
