import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
});

let onMessageGlobalCallback = null;
let isCallbackSet = false;

export const setGlobalReceiveMessageCallback = (cb) => {
  onMessageGlobalCallback = cb;

  if (!isCallbackSet) {
    socket.on("receiveMessage", (msg) => {
      if (typeof onMessageGlobalCallback === "function") {
        onMessageGlobalCallback(msg);
      }
    });
    isCallbackSet = true;
  }
};

export default socket;
