import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    try {
      set({ isUsersLoading: true });
      const response = await axiosInstance.get("/messages/users");
      set({ users: response.data });
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in getUsers", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    try {
      set({ isMessagesLoading: true });
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in getMessages", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessages: async (message) => {
    const { messages, selectedUser } = get();
    try {
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        message
      );
      set({ messages: [...messages, response.data] });
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in sendMessages", error);
    }
  },

  subscribeToMessages: async () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (message) => {
      if (message.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, message] });
    });

    socket.on("deleteMessage", (id) => {
      set({ messages: get().messages.filter((message) => message._id !== id) });
    });
  },

  unsubscribeFromMessages: async () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("deleteMessage");
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  deleteMessageForAll: async (id) => {
    const { messages } = get();
    const message = messages.find((message) => message._id === id);
    if (!message) return;
    try {
      await axiosInstance.post(`/messages/deleteMessageForAll`, {
        id: id,
        receiverId: message.receiverId,
      });
      set({ messages: messages.filter((message) => message._id !== id) });
    } catch (error) {
      console.log("Error in deleteMessage", error);
    }
  },

  deleteMessageForMe: async (id) => {
    const { messages } = get();
    const message = messages.find((message) => message._id === id);
    if (!message) return;
    try {
      await axiosInstance.delete(`/messages/deleteMessageForMe/${id}`);
      set({ messages: messages.filter((message) => message._id !== id) });
    } catch (error) {
      console.log("Error in deleteMessage", error);
    }
  },

  deleteChatForMe: async (receiverId) => {
    try {
      await axiosInstance.delete(`/messages/deleteChatForMe/${receiverId}`);
      set({ messages: [], selectedUser: null });
    } catch (error) {
      console.log("Error in deleteChat", error);
    }
  },
}));
