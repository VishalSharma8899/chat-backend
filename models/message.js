import mongoose from "mongoose";
// import User from './user.js';
const { Schema } = mongoose;
const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String },
},
 { timestamps: true });
 
export const Message = mongoose.model("Message", MessageSchema);