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