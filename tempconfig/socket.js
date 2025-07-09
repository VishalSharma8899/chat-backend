 

import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Message } from '../models/message.js';

dotenv.config();

const onlineUsers = new Map();

export default (io) => {
  console.log(" Socket handler initialized");

 
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      socket.user = {
        id: decoded._id || decoded.userid,
        username: decoded.username,
      };
      next();
    } catch (err) {
      console.error("❌ Socket auth failed:", err.message);
      next(new Error("Authentication error"));
    }
  });
 
  io.on('connection', (socket) => {
    const userId = socket.user.id;
    console.log("🔗 Connected:", socket.id, "| User ID:", userId);
    onlineUsers.set(userId, socket.id);

 
    socket.on('privateMessage', async ({ to, message }) => {
      const newMsg = new Message({ sender: userId, receiver: to, text: message });
      const saved = await newMsg.save();
      const targetSocket = onlineUsers.get(to);

      io.to(socket.id).emit('receivePrivateMessage', saved);
      if (targetSocket) io.to(targetSocket).emit('receivePrivateMessage', saved);
    });

   
    socket.on('editMessage', async ({ messageId, newContent }) => {
      const updated = await Message.findOneAndUpdate(
        { _id: messageId, sender: userId },
        { text: newContent, edited: true },
        { new: true }
      );
      const targetSocket = onlineUsers.get(updated?.receiver);
      io.to(socket.id).emit('messageEdited', updated);
      if (targetSocket) io.to(targetSocket).emit('messageEdited', updated);
    });

    
    socket.on('deleteMessage', async ({ messageId }) => {
      const deleted = await Message.findByIdAndDelete(messageId);
      const targetSocket = onlineUsers.get(deleted?.receiver);
      io.to(socket.id).emit('messageDeleted', { messageId });
      if (targetSocket) io.to(targetSocket).emit('messageDeleted', { messageId });
    });

 
    socket.on('callUser', ({ to, type, offer }) => {
      const targetSocket = onlineUsers.get(to);
      if (targetSocket) {
        io.to(targetSocket).emit('callIncoming', {
          from: { _id: userId, username: socket.user.username },
          type,
          offer,
        });
        console.log(" Emitted callIncoming to", to);
      } else {
        console.log(" Target user offline:", to);
      }
    });

    
    socket.on('answerCall', ({ to, answer }) => {
      const targetSocket = onlineUsers.get(to);
      if (targetSocket) {
        io.to(targetSocket).emit('callAnswered', { answer });
      }
    });

  
    socket.on('iceCandidate', ({ to, candidate }) => {
      const targetSocket = onlineUsers.get(to);
      if (targetSocket) {
        io.to(targetSocket).emit('iceCandidate', { candidate });
      }
    });
 
    socket.on('disconnect', () => {
      console.log("🚫 Disconnected:", userId);
      onlineUsers.delete(userId);
    });
  });
};

