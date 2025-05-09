import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaRegUser, FaHome, FaPaperPlane, FaRegClock } from "react-icons/fa";

// Import dummy data
import { properties, users, messages as allMessages } from "../../data/dummyData";

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);
  
  // Fetch user data from localStorage
  const userId = Number(localStorage.getItem("userId")) || 1; // Default to first tenant if not found
  const userRole = localStorage.getItem("userRole") || "tenant";
  
  // Fetch conversations and messages
  useEffect(() => {
    const fetchData = () => {
      // In a real app, this would be an API call

      // First, organize messages into conversations
      // Group by a unique conversation ID that combines sender and receiver
      const tenantMessages = allMessages.filter(
        msg => msg.senderId === userId || msg.receiverId === userId
      );
      
      // Create a map of conversation IDs to conversation data
      const conversationMap = new Map();
      
      tenantMessages.forEach(msg => {
        // Determine the other party in the conversation
        const otherPartyId = msg.senderId === userId ? msg.receiverId : msg.senderId;
        const conversationId = `conversation-${Math.min(userId, otherPartyId)}-${Math.max(userId, otherPartyId)}-${msg.propertyId}`;
        
        // Find property and other party info
        const property = properties.find(p => p.id === msg.propertyId);
        
        // Find other party (landlord or tenant)
        let otherParty;
        if (userRole === "tenant") {
          otherParty = users.landlords.find(l => l.id === otherPartyId);
        } else {
          otherParty = users.tenants.find(t => t.id === otherPartyId);
        }
        
        if (!conversationMap.has(conversationId)) {
          conversationMap.set(conversationId, {
            id: conversationId,
            otherParty,
            property,
            messages: [],
            latestMessage: null,
            unreadCount: 0
          });
        }
        
        // Add message to conversation
        const conversation = conversationMap.get(conversationId);
        conversation.messages.push(msg);
        
        // Update latest message
        if (!conversation.latestMessage || new Date(msg.timestamp) > new Date(conversation.latestMessage.timestamp)) {
          conversation.latestMessage = msg;
        }
        
        // Count unread messages
        if (msg.receiverId === userId && !msg.read) {
          conversation.unreadCount++;
        }
      });
      
      // Convert map to array and sort by latest message timestamp
      const sortedConversations = Array.from(conversationMap.values())
        .sort((a, b) => new Date(b.latestMessage?.timestamp || 0) - new Date(a.latestMessage?.timestamp || 0));
      
      setConversations(sortedConversations);
      
      // If there are conversations, set the active one
      if (sortedConversations.length > 0) {
        setActiveConversation(sortedConversations[0]);
        setMessages(sortedConversations[0].messages);
      }
      
      setLoading(false);
    };
    
    // Simulate API delay
    setTimeout(() => {
      fetchData();
    }, 500);
  }, [userId, userRole]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Handle conversation click
  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
    setMessages(conversation.messages);
    
    // Mark messages as read in this conversation
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversation.id) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({
            ...msg,
            read: msg.receiverId === userId ? true : msg.read
          }))
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
  };
  
  // Send a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation) return;
    
    // Create a new message object
    const newMessageObj = {
      id: Date.now(),
      conversationId: activeConversation.id,
      senderId: userId,
      receiverId: activeConversation.otherParty.id,
      propertyId: activeConversation.property.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Update messages state
    const updatedMessages = [...messages, newMessageObj];
    setMessages(updatedMessages);
    
    // Update conversations state
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation.id) {
        return {
          ...conv,
          messages: updatedMessages,
          latestMessage: newMessageObj
        };
      }
      return conv;
    });
    
    // Sort conversations by latest message
    const sortedConversations = [...updatedConversations].sort(
      (a, b) => new Date(b.latestMessage?.timestamp || 0) - new Date(a.latestMessage?.timestamp || 0)
    );
    
    setConversations(sortedConversations);
    setNewMessage("");
    
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Filter conversations by search term
  const filteredConversations = conversations.filter(conv => {
    const propertyTitle = conv.property?.title?.toLowerCase() || "";
    const otherPartyName = conv.otherParty?.name?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    
    return propertyTitle.includes(term) || otherPartyName.includes(term);
  });
  
  // Format date and time
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time only
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // This week - show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older - show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/tenant/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
          <p className="text-gray-600 mt-1">
            Communicate with property owners about your rentals
          </p>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* No messages */}
        {!loading && conversations.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="bg-blue-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaPaperPlane className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No messages yet</h2>
            <p className="text-gray-600 mb-6">
              You don't have any messages yet. Browse properties and contact landlords to start a conversation.
            </p>
            <Link 
              to="/properties" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-block"
            >
              Browse Properties
            </Link>
          </div>
        )}
        
        {/* Messaging interface */}
        {!loading && conversations.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row h-[600px]">
              {/* Conversations sidebar */}
              <div className="w-full md:w-80 md:border-r border-gray-200 flex flex-col">
                {/* Search */}
                <div className="p-4 border-b">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
                
                {/* Conversations list */}
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No conversations match your search
                    </div>
                  ) : (
                    filteredConversations.map(conversation => (
                      <div
                        key={conversation.id}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors flex ${
                          activeConversation?.id === conversation.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleConversationClick(conversation)}
                      >
                        {/* Profile icon or image */}
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <FaRegUser className="text-gray-500" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-800 truncate">
                              {conversation.otherParty.name}
                            </h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-1">
                              {formatMessageTime(conversation.latestMessage?.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 truncate mb-1">
                            {conversation.property.title}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.latestMessage?.senderId === userId ? 'You: ' : ''}
                              {conversation.latestMessage?.content}
                            </p>
                            
                            {conversation.unreadCount > 0 && (
                              <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Message area */}
              <div className="w-full flex-1 flex flex-col">
                {activeConversation ? (
                  <>
                    {/* Conversation header */}
                    <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <FaRegUser className="text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {activeConversation.otherParty.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaHome className="mr-1" />
                            <span>{activeConversation.property.title}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        to={`/properties/${activeConversation.property.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Property
                      </Link>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                      <div className="space-y-4">
                        {messages.map(msg => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                msg.senderId === userId
                                  ? 'bg-blue-600 text-white rounded-tr-none'
                                  : 'bg-white border border-gray-200 rounded-tl-none'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                              <div
                                className={`text-xs mt-1 flex justify-end ${
                                  msg.senderId === userId ? 'text-blue-200' : 'text-gray-500'
                                }`}
                              >
                                <span>{formatMessageTime(msg.timestamp)}</span>
                                {msg.senderId === userId && (
                                  <span className="ml-2">
                                    {msg.read ? 'Read' : 'Sent'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                    
                    {/* Message input */}
                    <div className="p-4 border-t bg-white">
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                          disabled={!newMessage.trim()}
                        >
                          <FaPaperPlane />
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-50 p-8 text-center">
                    <div>
                      <div className="bg-gray-200 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                        <FaRegClock className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a conversation</h3>
                      <p className="text-gray-600">
                        Choose a conversation from the list to view messages
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}