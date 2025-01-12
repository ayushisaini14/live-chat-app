import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

export const getUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const users = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUsers controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
      deletedBy: { $ne: myId },
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessage controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //realtime functionality with socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMessageForAll = async (req, res) => {
  try {
    const { id, receiverId } = req.body;
    const myId = req.user._id;
    await Message.deleteOne({ _id: id });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("deleteMessage", id);
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error in deleteMessage controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMessageForMe = async (req, res) => {
  try {
    const { id } = req.params;
    const myId = req.user._id;
    const result = await Message.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { deletedBy: myId } },
      { new: true }
    );

    if (!result) return res.status(404).json({ message: "Message not found" });
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error in deleteMessage controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteChatForMe = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    await Message.updateMany(
      {
        $or: [
          {
            senderId: myId,
            receiverId: userToChatId,
          },
          {
            senderId: userToChatId,
            receiverId: myId,
          },
        ],
      },
      { $addToSet: { deletedBy: myId } },
      { new: true }
    );
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.log("Error in deleteChat controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


