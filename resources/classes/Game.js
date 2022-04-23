/*******************************************************************/
/* Game */
class Game {
  constructor() {
    this.id = null
    this.inProgress = false
    this.activeGamePiece = null
    this.filledSlots = []
    this.difficultyLevel = 1
    this.type = null
    this.moveStarted = false
    this.available_slots = []
    this.available_oval_slots = []
    this.available_tri_slots = []
    this.playerNumber = null
    this.currentPlayer = 1

    this.white_ovals = []
    this.black_ovals = []
    this.white_triangles = []
    this.black_triangles = []

    this.sndClick = new Sound('resources/sounds/click.mp3')
    this.sndBackgroundMusic = new Sound('resources/sounds/davinci-music.mp3')
    this.sndSymbolFormed = new Sound('resources/sounds/symbol-formed.mp3')
    this.sndDroppingPieces = new Sound('resources/sounds/dropping-pieces.mp3')
    this.sndPickPiece = new Sound('resources/sounds/pickpiece.mp3')
  }

  join = function (playerNumber, isBot) {
    socket.send(JSON.stringify({
      'event': 'JOIN_GAME',
      'gameID': this.id,
      'playerNumber': playerNumber,
      'isBot': isBot
    }))
  }

  get getPlayers() {
    return this.players
  }


}
