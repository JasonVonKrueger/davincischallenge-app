/* global vars */

module.exports = function() { 
    const sndClick = new Sound('resources/sounds/click.mp3'),
          sndOpeningTrack = new Sound('resources/sounds/cinematic-soundtrack-plain-chant-12502.mp3'),
          sndBackgroundMusic = new Sound('resources/sounds/davinci-music.mp3'),
          sndSymbolFormed = new Sound('resources/sounds/symbol-formed.mp3'),
          sndDroppingPieces = new Sound('resources/sounds/dropping-pieces.mp3'),
          sndPickPiece = new Sound('resources/sounds/pickpiece.mp3')

    const GAME = new Game()
    const ME = {}
    
    const FADE_DUR = 700, 
          MIN_DUR = 4000
    
    let toastContain = null
}


