/*******************************************************************/
/* Game */
class Game {
    constructor() {
        this.id = null
        this.players = []
        this.board = []
        this.filledSlots = []
        this.moves = 0
        this.difficultyLevel = 1
        this.game_type = null
    }

    checkUser = function () {

    }

    get getPlayers() {
        return this.players
    }

    get getRoomId() {
        return this.id
    }

    addPlayer = function (playerID) {
        this.players.push(playerID)
    }

    // Send an update to the opponent to update their UI
    playTurn = function (tile) {
        var clickedTile = $(tile).attr('id');
        var turnObj = {
            tile: clickedTile,
            room: this.getRoomId()
        };

        // Emit an event to update other player that you've played your turn.
        socket.emit('playTurn', turnObj);
    }

    announceWinner = function () {
        var message = player.getPlayerName() + ' wins!';
        socket.emit('gameEnded', {
            room: this.getRoomId(),
            message: message
        });
        alert(message);
        location.reload();
    }
}

 /*******************************************************************/
/* Game pieces (white triangle, white oval, black triangle, black oval) */
class GamePiece {
    constructor(gamePiece, index, gameID) {
      this.piece = document.createElement('img')
      this.piece.src = 'resources/images/' + gamePiece + '.png'
      this.piece.id = gamePiece + index
      this.piece.className = 'game-piece'
  
      // add event listener to move the the 'ready' position
      this.piece.addEventListener('click', stageGamePiece)    
    }
  
    drawPiece = function (x, y, layer) {
      // spread out the pieces some
      let rnd_x = x + (Math.random() - 0.5) * 80
      let rnd_y = y + (Math.random() - 0.5) * 80
  
      this.piece.style.left = rnd_x + 'px'
      this.piece.style.top = rnd_y + 'px'
  
      document.querySelector(layer).appendChild(this.piece)  
    }
  
    destroy = function() {
      this.piece.remove()
    }
  
  }