import messageModel from '../models/message.model.js';
import chatModel from '../models/chatCollection.model.js';
import userModel from '../models/user.model.js';


// GET FRIENDS LIST
async function getFriends(req, res) {
  try {

    const friends = await userModel.find().select('-password');

    res.status(200).json({
      success: true,
      data: friends
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// CREATE OR GET CHAT
async function createChat(req, res) {
  const { userId } = req.body; // receiver user ID

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const existingChat = await chatModel.findOne({
      users: { $all: [req.user._id, userId] }
    });

    if (existingChat) {
      return res.status(200).json({
        success: true,
        chat: existingChat
      });
    }

    const newChat = await chatModel.create({
      users: [req.user._id, userId]
    });

    res.status(201).json({
      success: true,
      chat: newChat 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// SEND MESSAGE
async function messageSend(req, res) {
  const { chatId, content } = req.body;

  try {
    const chat = await chatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    const message = await messageModel.create({
      chat: chat._id,
      from: req.user._id,
      content
    });

    res.status(201).json({
      success: true,
      data: message
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// GET ALL MESSAGES OF A CHAT
async function getChats(req, res) {
  const { chatId } = req.params;

  try {
    const messages = await messageModel
      .find({ chat: chatId })
      .populate('from', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export default { messageSend, getChats, createChat, getFriends };
