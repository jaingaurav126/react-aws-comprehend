const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const AWS = require('aws-sdk');
const cors = require('cors'); // Import CORS package

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from your front-end
    methods: ['GET', 'POST']
  }
});

// Configure AWS Comprehend
AWS.config.update({
  region: 'us-east-1', // Update with your region
  accessKeyId: '',
  secretAccessKey: ''
});
const comprehend = new AWS.Comprehend();

// Enable CORS for all routes
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Socket.io for real-time communication
io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for incoming messages
  socket.on('sendMessage', async (message) => {
    try {
      const sentimentData = await analyzeSentiment(message.text);
      io.emit('receiveMessage', { ...message, sentiment: sentimentData });
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Analyze sentiment function
async function analyzeSentiment(text) {
  const params = {
    Text: text,
    LanguageCode: 'en'
  };
  const data = await comprehend.detectSentiment(params).promise();
  return data.Sentiment;
}

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
