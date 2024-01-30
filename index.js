const express = require('express');
const { createServer } = require('node:http');
const { join } = require('path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

// Game data
const gameChoices = [];

// Game logic
function playRockPaperScissors(player1, player2) {
  if (player1.choice === player2.choice) {
      return null;
  } else if (
      (player1.choice === 'rock' && player2.choice === 'scissors') ||
      (player1.choice === 'scissors' && player2.choice === 'paper') ||
      (player1.choice === 'paper' && player2.choice === 'rock')
  ) {
      return player1.id;
  } else {
      return player2.id;
  }
}

// Example of playing the game:
const result = playRockPaperScissors('rock', 'scissors'); // Pass choices of player 1 and player 2
console.log(result);


app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // Event listener for the game
  socket.on('choice', (msg) => {
    gameChoices.push(msg)

    console.log(gameChoices)

    if (gameChoices.length === 2) {
      console.log('votes')
      const result = playRockPaperScissors(gameChoices[0], gameChoices[1])

      io.emit('winner', result)
    }
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
