/**
 *  Main script for the Da Vinci's Challenge app
 */
"use strict"

const $ = document.querySelector.bind(document)

const sndClick = new Sound('resources/sounds/click.mp3')
//const sndOpeningTrack = new Sound('resources/sounds/cinematic-soundtrack-plain-chant-12502.mp3')
const sndBackgroundMusic = new Sound('resources/sounds/davinci-music.mp3')
const sndSymbolFormed = new Sound('resources/sounds/symbol-formed.mp3')
const sndDroppingPieces = new Sound('resources/sounds/dropping-pieces.mp3')
const sndPickPiece = new Sound('resources/sounds/pickpiece.mp3')

const GAME = new Game()
const ME = {}

const FADE_DUR = 700, 
      MIN_DUR = 4000

let toastContain = null

// ****************************************************************
// Game entry point
// ****************************************************************
window.addEventListener("load", function() {
  console.log('Page has loaded!')

  window.setTimeout(function() {
    initEventListeners()
  }, 2000);
})


// ****************************************************************
// Function conjunction
// ****************************************************************

// ****************************************************************
// event handlers
function initEventListeners() {
 
    /* --------------------------------------------------------- */
    const btnClickers = document.querySelectorAll('.clicker')
    const spotter = document.getElementById('spotter')
    const GAME_BOARD = document.getElementById('gameboard')

    /* --------------------------------------------------------- */
    // add mousedown listener for buttons
    Array.from(document.querySelectorAll('.clicker')).forEach(function(clicker) {
        clicker.addEventListener('mousedown', function(e) {
            sndClick.play(false)
        })
    })

    // escape closes menu
    document.addEventListener('keypress', function (e) {
        if (GAME.inProgress && e.code === 'Escape') {
            menu.style.height = '0%'
        }
    })

    /* --------------------------------------------------------- */
    $('#iconSinglePlayer').addEventListener('click', function(e) {
        menu.style.height = '0%'
        GAME.create('SOLO')
    })

    /* --------------------------------------------------------- */
    $('#iconDoublePlayer').addEventListener('click', function(e) {
        document.getElementById('twoPlayerModal').classList.remove('hidden')
    })

    /* --------------------------------------------------------- */
    $('#iconHelp').addEventListener('click', function(e) {
        document.getElementById('modalGameRules').classList.remove('hidden')
    })

    /* --------------------------------------------------------- */
    $('#iconMusic').addEventListener('click', function(e) {
        if (sndBackgroundMusic.isPlaying) {
            sndBackgroundMusic.stop()
            $('#iconMusic').style.backgroundImage = "url('resources/images/icon_music_off.png')"
        } else {
            sndBackgroundMusic.play(true)
            $('#iconMusic').style.backgroundImage = "url('resources/images/icon_music_on.png')"
        }
    })

    /* --------------------------------------------------------- */
    $('#iconExit').addEventListener('click', function(e) {
        window.top.close()
        return false
    })  
      
    /* --------------------------------------------------------- */
    spotter.addEventListener('click', function(e) {
        if (GAME.inProgress) {
            iconSinglePlayer.classList.add('hidden')
            iconDoublePlayer.classList.add('hidden')
            btnMenuClose.classList.remove('hidden')
        }

        menu.style.height = '100%'
    })

    /* --------------------------------------------------------- */
    $('#btnGetGameCode').addEventListener('click', function(e) {
        GAME.create('FRIEND')

        $('#inpCreateGameCode').classList.remove('hidden')
        $('#' + e.target.id).classList.add('hidden')
        $('#sectionCopyCode').classList.remove('hidden')
        $('#sectionJoinGame').classList.add('hidden')
        $('#twoPlayerModalContent > hr').classList.add('hidden')        
    })

    /* --------------------------------------------------------- */
    $('#btnCopy').addEventListener('click', function(e) {
        navigator.clipboard.writeText($('#inpCreateGameCode').value)
        
        GAME.join(false)
        
        $('#twoPlayerModal').classList.add('hidden')
        $('#waitingForPlayer').classList.remove('hidden')

        // do the letter spinning thing
        const txt = " Waiting for player 2 to join..."
        for (var c in txt) {
            let char = txt[c]
            const el = document.createElement("span");

            if (char === ' ') {
                el.setAttribute('style', 'width: 6px')
            } else {
                let m = '--i:' + c;
                el.setAttribute('style', m);
            }

            el.innerText = char;
            $('#txtWaiting').appendChild(el);
        }      
    })   
    
    /* --------------------------------------------------------- */
    $('#btnJoinGame').addEventListener('click', function(e) {
        GAME.id = inpJoinGameCode.value
        GAME.join(false)     
    })

    $('#inpJoinGameCode').addEventListener('focus', function(e) {
        $('#twoPlayerModalContent > hr').classList.add('hidden')
        $('#sectionCreateGame').classList.add('hidden') 
    })

    $('#inpJoinGameCode').addEventListener('keyup', function(e) {
        let length = $('#inpJoinGameCode').value.length

        if (length >= 5) {
            $('#btnJoinGame').classList.remove('hidden')
        } else {
            $('#btnJoinGame').classList.add('hidden')
        }
    })

    /* --------------------------------------------------------- */
    $('#btnMenuClose').addEventListener('click', function(e) {
        menu.style.height = '0%'
    })

    // ******************************************************************************
    // listen for slot cicks on the game board
    GAME_BOARD.addEventListener('click', function(e) {
        let slot = document.getElementById(e.target.id)

        // get object array index from selected piece
        let index = slot.id.match(/\d+/)

        // handle moves
        if (GAME.moveStarted) {
            if (!slot.classList.contains('slot-taken')) {
                if ((slot.id.indexOf('oval') > -1 && GAME.activeGamePiece.id.includes('Oval')) || (slot.id.indexOf('triangle') > -1 && GAME.activeGamePiece.id.includes('Triangle'))) {

                    // send the move to the server
                    socket.send(JSON.stringify({
                        'event': 'MOVE_COMPLETE',
                        'gameID': GAME.id,
                        'currentPlayer': GAME.currentPlayer,
                        'slotID': slot.id
                    }))

                    document.getElementById(GAME.activeGamePiece.id).remove()
                }
            }
        }
    })
}

// ****************************************************************
// for simulating events
function triggerEvent(elem, event) {
    let clickEvent = new Event(event)
    elem.dispatchEvent(clickEvent)
}

// ****************************************************************
// close modals
function closeModal(elem) {
    document.getElementById(elem).classList.add('hidden')
}

// ****************************************************************
// show toast
function showToast(str, addClass) {
    let duration = Math.max(MIN_DUR, str.length * 80)

    if (!toastContain) {
        toastContain = document.createElement('div')
        toastContain.classList.add('toast-container')

        if (ME.number === 2) {
            toastContain.classList.add('toast-container-p2')
        }
        else {
            toastContain.classList.add('toast-container-p1')
        }

        document.body.appendChild(toastContain)
    }

    const el = document.createElement('div')
    el.classList.add('toast', addClass)
    el.innerText = str
    toastContain.prepend(el)

    setTimeout(() => el.classList.add('open'))
    setTimeout(
        () => el.classList.remove('open'),
        duration
    )
    setTimeout(
        () => toastContain.removeChild(el),
        duration + FADE_DUR
    )
}

// ****************************************************************
// update game board by filling in slot
function updateBoard(currentPlayer, slotID, availableSlots) {
    // fill the slots    
    if (!document.getElementById(slotID).classList.contains('slot-taken')) {

        if (currentPlayer === 1) {
            document.getElementById(slotID).style = 'fill:#eeeeee;fill-opacity:1;stroke:#000000;stroke-width:21.9435;stroke-miterlimit:2;stroke-opacity:0.840741';
        } else if (currentPlayer === 2) {
            document.getElementById(slotID).style = 'fill:#060606;fill-opacity:1;stroke:#ffba8b;stroke-width:21.9435;stroke-miterlimit:2;stroke-opacity:0.840741';
        }

        document.getElementById(slotID).classList.add('slot-taken')

        sndPickPiece.play()
    }

    socket.send(JSON.stringify({
        'event': 'SWITCH_PLAYER',
        gameID: GAME.id,
        currentPlayer: currentPlayer
    }))
}

// ****************************************************************
// player scored
function score(currentPlayer, playerOneScore, playerTwoScore, symbol) {
    let points_element = null

    if (currentPlayer == 1) {
        points_element = 'ss_player1_' + symbol

        document.getElementById(points_element).innerHTML = parseInt(document.getElementById(points_element).innerHTML) + 1
        $('#player1_Total').innerHTML = playerOneScore

        // show player scores
    } 
    else if (currentPlayer == 2) {
        points_element = 'ss_player2_' + symbol

        document.getElementById(points_element).innerHTML = parseInt(document.getElementById(points_element).innerHTML) + 1
        $('#player2_Total').innerHTML = playerTwoScore

        // show player scores
    }

    GAME.sndSymbolFormed.play()
}

// ****************************************************************
// slide the piece to its staging position
function stageGamePiece() {
    if ((GAME.currentPlayer === ME.number) || (GAME.currentPlayer === 2 && GAME.type === 'SOLO')) {
        if (!GAME.moveStarted) {
            GAME.activeGamePiece = document.getElementById(this.id)

            let leftBox_left = parseInt($('.cup-white-ovals').style.left.replace('px', ''))
            let leftBox_width = parseInt($('.cup-white-ovals').style.width.replace('px', ''))
            let leftBox_right = leftBox_left + leftBox_width
            let rightBox_left = parseInt($('.cup-white-triangles').style.left.replace('px', ''))
            let center = rightBox_left - leftBox_right

            GAME.activeGamePiece.style.setProperty('--board-width', center + 'px')

            // let the server know that the move started
            socket.send(JSON.stringify({
                'event': 'MOVE_STARTED',
                'currentPlayer': GAME.currentPlayer,
                'gameID': GAME.id
            }))

            if (GAME.activeGamePiece.id.indexOf('Oval') > -1) {
                GAME.activeGamePiece.classList.add('oval-piece-slide')
            } else {
                GAME.activeGamePiece.classList.add('triangle-piece-slide')
            }
        }
    }
}

// ****************************************************************
// load initial game pieces
function loadGamePieces(player_number) {
    // fill up the bowls
    // 45 ovals and 27 triangles for each player
    // 144 total spaces on the board
    let x, y

    // get bounding box for cups
    let cwo = cupWhiteOvals.getBoundingClientRect()
    let cwt = cupWhiteTriangles.getBoundingClientRect()
    let cbo = cupBlackOvals.getBoundingClientRect()
    let cbt = cupBlackTriangles.getBoundingClientRect()

    // draw bounding boxes for cups
    let box_cup_white_ovals = document.querySelector('.cup-white-ovals')
    box_cup_white_ovals.style.left = cwo.x + 'px'
    box_cup_white_ovals.style.top = cwo.y + 'px'
    box_cup_white_ovals.style.width = cwo.width + 'px'
    box_cup_white_ovals.style.height = cwo.height + 'px'

    let box_cup_white_triangles = document.querySelector('.cup-white-triangles')
    box_cup_white_triangles.style.left = cwt.x + 'px'
    box_cup_white_triangles.style.top = cwt.y + 'px'
    box_cup_white_triangles.style.width = cwt.width + 'px'
    box_cup_white_triangles.style.height = cwt.height + 'px'

    let box_cup_black_ovals = document.querySelector('.cup-black-ovals')
    box_cup_black_ovals.style.left = cbo.x + 'px'
    box_cup_black_ovals.style.top = cbo.y + 'px'
    box_cup_black_ovals.style.width = cbo.width + 'px'
    box_cup_black_ovals.style.height = cbo.height + 'px'

    let box_cup_black_triangles = document.querySelector('.cup-black-triangles')
    box_cup_black_triangles.style.left = cbt.x + 'px'
    box_cup_black_triangles.style.top = cbt.y + 'px'
    box_cup_black_triangles.style.width = cbt.width + 'px'
    box_cup_black_triangles.style.height = cbt.height + 'px'

    sndDroppingPieces.play()

    // white ovals
    for (let i = 1; i <= 45; i++) {
        let whiteOval = new GamePiece('whiteOval', i, GAME.id)
        whiteOval.drawPiece(cwo.width / 2 - 19, cwo.height / 2 - 50, '.cup-white-ovals')
        GAME.white_ovals.push(whiteOval);
    }

    // white triangles
    for (let i = 1; i <= 27; i++) {
        let whiteTriangle = new GamePiece('whiteTriangle', i, GAME.id)
        whiteTriangle.drawPiece(cwt.width / 2 - 36, cwt.height / 2 - 40, '.cup-white-triangles')
        GAME.white_triangles.push(whiteTriangle)
    }

    if (player_number === 2) {
        // black ovals
        for (let i = 1; i <= 45; i++) {
            let blackOval = new GamePiece('blackOval', i, GAME.id)
            blackOval.drawPiece(cbo.width / 2 - 19, cbo.height / 2 - 50, '.cup-black-ovals')
            GAME.black_ovals.push(blackOval)
        }

        // black triangles
        for (let i = 1; i <= 27; i++) {
            let blackTriangle = new GamePiece('blackTriangle', i, GAME.id)
            blackTriangle.drawPiece(cbt.width / 2 - 36, cbt.height / 2 - 40, '.cup-black-triangles')
            GAME.black_triangles.push(blackTriangle)
        }
    }
}