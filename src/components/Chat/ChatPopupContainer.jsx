// src/components/Chat/ChatPopupContainer.jsx
import { useSelector } from "react-redux";
import ChatPopup from "./ChatPopup";

const ChatPopupContainer = () => {
  const openPopups = useSelector((state) => state.chatPopup.openPopups);

  return (
    <>
      {openPopups.map((popup, index) => (
        <ChatPopup
          key={`${popup.userId}-${popup.conversationId}-${Date.now()}`}
          userId={popup.userId}
          userInfo={popup.userInfo}
          conversationId={popup.conversationId}
          index={index}
        />
      ))}
    </>
  );
};

export default ChatPopupContainer;
