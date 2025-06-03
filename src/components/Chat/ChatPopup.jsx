import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closePopup } from "../../redux/reducer/chatPopupReducer";
import socket from "../../utils/socket";
import { getMessages } from "../../services/chatService";

export default function ChatPopup({ userId, userInfo, conversationId, index }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.user);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const containerRef = useRef();
  const earliestRef = useRef();

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, []);

  // Load initial messages + join socket room
  useEffect(() => {
    if (!conversationId) return;

    socket.emit("joinConversation", conversationId);

    (async () => {
      try {
        const history = await getMessages(conversationId);
        setMessages(history);
        if (history.length < 20) setHasMore(false);
        earliestRef.current = history[0]?.createdAt;
        scrollToBottom();
      } catch (err) {
        console.error("Lỗi load history:", err);
      }
    })();

    const onReceive = (msg) => {
      if (msg.conversationId !== conversationId) return;

      setMessages((prev) => {
        if (msg.clientTempId) {
          const index = prev.findIndex((m) => m._id === msg.clientTempId);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = msg;
            return updated;
          }
        }

        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });

      scrollToBottom();
    };

    socket.on("receiveMessage", onReceive);
    return () => socket.off("receiveMessage", onReceive);
  }, [conversationId, scrollToBottom]);

  // Infinite scroll to load older messages
  const handleScroll = useCallback(async () => {
    const el = containerRef.current;
    if (!el || loadingHistory || !hasMore) return;
    if (el.scrollTop < 50) {
      setLoadingHistory(true);
      const prevHeight = el.scrollHeight;
      try {
        const older = await getMessages(conversationId, earliestRef.current);
        if (older.length < 20) setHasMore(false);
        if (older.length) {
          earliestRef.current = older[0].createdAt;
          setMessages((m) => [...older, ...m]);
          requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight - prevHeight;
          });
        }
      } catch (err) {
        console.error("Lỗi load thêm lịch sử:", err);
      } finally {
        setLoadingHistory(false);
      }
    }
  }, [conversationId, hasMore, loadingHistory]);

  useEffect(() => {
    const el = containerRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const clientTempId = Date.now().toString();
    const newMsg = {
      _id: clientTempId,
      clientTempId,
      conversationId,
      sender: { _id: currentUser.id },
      text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    scrollToBottom();

    socket.emit("sendMessage", { conversationId, text, clientTempId });
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => dispatch(closePopup(userId));

  return (
    <div
      style={{ bottom: 16, right: 16 + index * 288 }}
      className="fixed w-80 h-[400px] bg-white rounded shadow-lg z-20 flex flex-col border"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-3 py-2 bg-blue-500 text-white rounded-t">
        <div className="flex items-center gap-2">
          <img
            src={userInfo.avatarUrl || "/default-avatar.png"}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold truncate w-32">
            {userInfo.username}
          </span>
        </div>
        <button onClick={handleClose}>✕</button>
      </div>

      {/* BODY */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            Bắt đầu trò chuyện với <b>{userInfo.username}</b>
          </div>
        ) : (
          messages
            .filter((msg) => msg?.sender?._id && msg.text)
            .map((msg) => {
              const isMe = msg?.sender?._id === currentUser?.id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`${
                      isMe ? "bg-blue-500 text-white" : "bg-gray-200"
                    } px-3 py-1 rounded-lg max-w-[70%] whitespace-pre-wrap break-words`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
        )}
        {loadingHistory && (
          <div className="text-center text-xs text-gray-500 py-2">
            Đang tải...
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="flex border-t items-center px-2 py-1 gap-2">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          className="flex-1 outline-none resize-none px-2 py-1 border rounded"
          placeholder="Nhập tin nhắn..."
        />
        <button
          onClick={handleSend}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
