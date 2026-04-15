import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import "./styles/messages.css";

const Messages = () => {
  const { user } = useContext(AuthContext);
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
      markConversationAsActive(conversationId);
    }
  }, [conversationId]);

  const fetchConversations = async () => {
    try {
      const { data } = await API.get("/messages/my-conversations");
      setConversations(data.conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const { data } = await API.get(`/messages/${convId}`);
      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const markConversationAsActive = (convId) => {
    const active = conversations.find((c) => c._id === convId);
    setCurrentConversation(active);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const payload = { text: newMessage };

      if (conversationId) {
        payload.conversationId = conversationId;
      } else if (orderId) {
        payload.orderId = orderId;
      }

      const { data } = await API.post("/messages/send-message", payload);

      setMessages((prev) => [...prev, data.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const startNewConversation = async (orderId) => {
    try {
      const { data } = await API.post("/messages/start-conversation", {
        orderId,
      });
      navigate(`/messages/${data.conversation._id}`);
      fetchConversations();
    } catch (error) {
      console.error("Error starting conversation:", error);
      alert(error.response?.data?.message || "Failed to start conversation");
    }
  };

  const getOtherParticipant = (conversation) => {
    return conversation.members?.find((m) => m._id !== user?._id);
  };

  if (loading) {
    return <div className="loading-container">Loading messages...</div>;
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        {/* Sidebar - Conversations List */}
        <div className="conversations-sidebar">
          <div className="sidebar-header">
            <h2>Messages</h2>
          </div>

          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="no-conversations">
                <p>No conversations yet</p>
                <p className="hint">Order a service to start chatting</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const otherUser = getOtherParticipant(conv);
                return (
                  <div
                    key={conv._id}
                    className={`conversation-item ${
                      conversationId === conv._id ? "active" : ""
                    }`}
                    onClick={() => navigate(`/messages/${conv._id}`)}
                  >
                    <div className="conv-avatar">
                      {otherUser?.avatar ? (
                        <img src={otherUser.avatar} alt={otherUser.name} />
                      ) : (
                        <span>{otherUser?.name?.charAt(0)}</span>
                      )}
                    </div>
                    <div className="conv-info">
                      <h4>{otherUser?.name}</h4>
                      <p className="conv-last-message">
                        {conv.lastMessage || "No messages yet"}
                      </p>
                    </div>
                    <div className="conv-time">
                      {new Date(conv.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-area">
          {!conversationId ? (
            <div className="no-chat-selected">
              <div className="no-chat-icon">💬</div>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                {currentConversation && (
                  <>
                    <div className="chat-user-avatar">
                      {getOtherParticipant(currentConversation)?.avatar ? (
                        <img
                          src={getOtherParticipant(currentConversation).avatar}
                          alt=""
                        />
                      ) : (
                        <span>
                          {getOtherParticipant(
                            currentConversation
                          )?.name?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="chat-user-info">
                      <h3>{getOtherParticipant(currentConversation)?.name}</h3>
                      <p>Online</p>
                    </div>
                  </>
                )}
              </div>

              {/* Messages List */}
              <div className="messages-list">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <p>
                      No messages yet. Send a message to start the conversation!
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwnMessage = msg.sender._id === user?._id;
                    return (
                      <div
                        key={msg._id}
                        className={`message-wrapper ${
                          isOwnMessage ? "own" : "other"
                        }`}
                      >
                        <div
                          className={`message-bubble ${
                            isOwnMessage ? "own" : "other"
                          }`}
                        >
                          <p>{msg.text}</p>
                        </div>
                        <div className="message-time">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="message-input-form">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={sending}
                />
                <button type="submit" disabled={sending || !newMessage.trim()}>
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
