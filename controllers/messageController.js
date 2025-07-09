 import {Message} from '../models/message.js'
 export const messageSend = async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;
    const message = new Message({ sender, receiver, text });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

  export const messageget = async (req, res) => {
  try {
    const currentUserId = req.user._id; 
    const selectedUserId = req.params._id; 

    console.log(" Current User ID:", currentUserId);
    console.log(" Selected User ID:", selectedUserId);

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: selectedUserId },
        { sender: selectedUserId, receiver: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(" Error fetching messages:", err.message);
    res.status(500).json({ error: err.message });
  }
};



 