 

import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import passwordhash from "password-hash";

 
// export const userRegister = async (req, res, next) => {
//   try {
//     const { username, password } = req.body;

//     const hashPassword = passwordhash.generate(password);
 
//     const check = await User.findOne({ username });
//     if (check) {
//       return res.status(401).json({
//         msg: "This username is already registered",
//       });
//     }

//     const data = new User({
//       username,
//       password: hashPassword,
//     });

//     await data.save();
//     const userid = data._id;

//     const token = generateToken(userid);

//     return res.status(201).json({
//       msg: "Registration successful",
//       token,
//       user: data,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

 
// export const login = async (req, res) => {
//   const { username, password } = req.body;

//   const check = await User.findOne({ username });
//   if (!check) {
//     return res.status(404).json({
//       msg: "User not found",
//     });
//   }

//   if (passwordhash.verify(password, check.password)) {
//     const userid = check._id;
//     const token = generateToken(userid);

//     return res.status(200).json({
//       msg: "Login successful",
//       token,
//       user: check,
//     });
//   }

//   return res.status(401).json({
//     msg: "Invalid password",
//   });
// };

 
// const generateToken = (userid) => {
//   const key = process.env.JWT_SECRET_KEY;
//   return jwt.sign({ userid }, key, {
//     expiresIn: 86400,
//   });
// };

 
// export const getAllUsers = async (req, res, next) => {
//   try {
//     const users = await User.find({}, { password: 0 });  
//     return res.status(200).json({
//       msg: "Users fetched successfully",
//       users,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
export const userRegister = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const hashPassword = passwordhash.generate(password);

    const check = await User.findOne({ username });
    if (check) {
      return res.status(401).json({
        msg: "This username is already registered",
      });
    }

    const data = new User({
      username,
      password: hashPassword,
    });

    await data.save();
    const userid = data._id;

    const token = generateToken(userid);

    return res.status(201).json({
      msg: "Registration successful",
      token,
      user: data,
    });
  } catch (error) {
    console.error("Register Error:", error); // 🐞 Log full error
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};
