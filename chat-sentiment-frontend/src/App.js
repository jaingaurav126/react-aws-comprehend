import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'; // Import CSS file for custom styles

const socket = io('http://localhost:4000');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => socket.off('receiveMessage');
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = { text: message, user: 'User' };
      socket.emit('sendMessage', newMessage);
      setMessage('');
    }
  };

  const getColorBySentiment = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE': return '#c8f7c5';
      case 'NEGATIVE': return '#f6b6b6';
      case 'NEUTRAL': return '#e0e0e0';
      case 'MIXED': return '#f7e7b5';
      default: return 'white';
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <h1 className="app-title">✨ Real-Time Chat with Sentiment Analysis ✨</h1>
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                backgroundColor: getColorBySentiment(msg.sentiment),
                animationDelay: `${index * 0.1}s`
              }}
              className="message animated-message"
            >
              <strong>{msg.user}: </strong>{msg.text} <em>({msg.sentiment})</em>
            </div>
          ))}
        </div>
        <div className="input-section">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
          />
          <button onClick={handleSendMessage} className="send-button">Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
