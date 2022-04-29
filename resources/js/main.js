/**
 *  Main script for the Da Vinci's Challenge app
 */
"use strict"

const GAME = new Game()

document.addEventListener('DOMContentLoaded', function (e) {
    /* --------------------------------------------------------- */
    const txtWaiting = document.getElementById('txtWaiting')
    /* --------------------------------------------------------- */
    const iconSinglePlayer = document.getElementById('iconSinglePlayer')
    const iconDoublePlayer = document.getElementById('iconDoublePlayer')
    const iconHelp = document.getElementById('iconHelp')
    const iconExit = document.getElementById('iconExit')
    const iconMusic = document.getElementById('iconMusic')
    /* --------------------------------------------------------- */
    const btnMenuClose = document.getElementById('btnMenuClose')
    const btnClickers = document.querySelectorAll('.clicker')
    /* --------------------------------------------------------- */
    const menu = document.getElementById('menu')
    const spotter = document.getElementById('spotter')
    const GAME_BOARD = document.getElementById('gameboard')
    /* --------------------------------------------------------- */

    /* --------------------------------------------------------- */
    // add mousedown listener for buttons
    Array.from(btnClickers).forEach(function (clicker) {
        clicker.addEventListener('mousedown', function (e) {
            GAME.sndClick.play()
        })
    })

    /* --------------------------------------------------------- */
    // get initial list of available slots
    Array.from(document.querySelectorAll('[id^="oval"],[id^="triangle"]')).forEach(function (slot) {
        GAME.available_slots.push(slot.id)
    })

    /* --------------------------------------------------------- */
    iconSinglePlayer.addEventListener('click', function (e) {
        menu.style.height = '0%'
        
        GAME.playerNumber = 1
        GAME.currentPlayer = 1
        GAME.type = 'SOLO'

        socket.send(JSON.stringify({
            'event': 'CREATE_GAME',
            'type': GAME.type,
            'currentPlayer': GAME.currentPlayer,
            'availableSlots': GAME.available_slots
        }))
    })

    /* --------------------------------------------------------- */
    iconDoublePlayer.addEventListener('click', function (e) {
        menu.style.height = '0%'
        document.getElementById('twoPlayerModal').classList.remove('hidden')

        GAME.playerNumber = 1
        GAME.currentPlayer = 1
        GAME.type = 'FRIEND'

        socket.send(JSON.stringify({
            'event': 'CREATE_GAME',
            'type': GAME.type,
            'currentPlayer': GAME.currentPlayer,
            'availableSlots': GAME.available_slots
        }))
    })

    /* --------------------------------------------------------- */
    iconHelp.addEventListener('click', function (e) {
        document.getElementById('modalGameRules').classList.remove('hidden')
    })

    /* --------------------------------------------------------- */
    iconMusic.addEventListener('click', function (e) {
        if (GAME.sndBackgroundMusic.isPlaying) {
            GAME.sndBackgroundMusic.stop()
            iconMusic.style.backgroundImage = "url('resources/images/icon_music_off.png')"
        } else {
            GAME.sndBackgroundMusic.play(true)
            iconMusic.style.backgroundImage = "url('resources/images/icon_music_on.png')"
        }
    })

    /* --------------------------------------------------------- */
    iconExit.addEventListener('click', function (e) {
        window.top.close()
        return false
    })

    /* --------------------------------------------------------- */
    spotter.addEventListener('click', function (e) {
        if (GAME.inProgress) {
            iconSinglePlayer.classList.add('hidden')
            iconDoublePlayer.classList.add('hidden')
            btnMenuClose.classList.remove('hidden')
        }

        menu.style.height = '100%'
    })

    // ******************************************************************************
    // listen for slot cicks on the game board
    GAME_BOARD.addEventListener('click', function (e) {
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
})

// ****************************************************************
// Function conjunction
// ****************************************************************

// ****************************************************************
// for simulating events
function triggerEvent(elem, event) {
    let clickEvent = new Event(event)
    elem.dispatchEvent(clickEvent)
}

// ****************************************************************
// close modals
function closeModal(control) {
    document.getElementById(control).classList.add('hidden')
}

// ****************************************************************
// close menu overlay
function closeMenu() {
    menu.style.height = '0%'
}

// ****************************************************************
// copy game code
function copyGameCode() {
    document.execCommand("copy")
    document.getElementById('twoPlayerModal').classList.add('hidden')
    document.getElementById('waitingForPlayer').classList.remove('hidden')

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
        document.getElementById('txtWaiting').appendChild(el);
    }
}

// ****************************************************************
// get game code
function getGameCode(control) {
    inpCreateGameCode.classList.remove('hidden')
    document.getElementById(control.id).classList.add('hidden')
    document.getElementById('sectionCopyCode').classList.remove('hidden')
    document.getElementById('sectionJoinGame').classList.add('hidden')
    document.querySelector('#twoPlayerModalContent > hr').classList.add('hidden')

    inpCreateGameCode.focus()
    inpCreateGameCode.select()
}

// ****************************************************************
// handle join game input focus
function handleJoinGameCodeFocus() {
    document.querySelector('#twoPlayerModalContent > hr').classList.add('hidden')
    document.getElementById('sectionCreateGame').classList.add('hidden')
}

// ****************************************************************
// handle join game input key up
function handleJoinGameCodeKeyUp() {
    let length = inpJoinGameCode.value.length

    if (length >= 5) {
        btnJoinGame.classList.remove('hidden')
    } else {
        btnJoinGame.classList.add('hidden')
    }
}

// ****************************************************************
// handle join game clicked
function joinGame() {
    // assign this guy as player 2
    GAME.playerNumber = 2
    GAME.join(GAME.playerNumber, false)
}

// ****************************************************************
// show toast
const FADE_DUR = 700, MIN_DUR = 6000
let toastContain

function showToast(str, addClass) {
    let duration = Math.max(MIN_DUR, str.length * 80)

    if (!toastContain) {
        toastContain = document.createElement('div')
        toastContain.classList.add('toastContain')
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

        GAME.sndPickPiece.play()

        // update available slots
        if (availableSlots) {
            GAME.available_slots = availableSlots
        }
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
        document.getElementById('player1_Total').innerHTML = playerOneScore
    } else if (currentPlayer == 2) {
        points_element = 'ss_player2_' + symbol

        document.getElementById(points_element).innerHTML = parseInt(document.getElementById(points_element).innerHTML) + 1
        document.getElementById('player2_Total').innerHTML = playerTwoScore
    }

    GAME.sndSymbolFormed.play()
}

// ****************************************************************
// slide the piece to its staging position
function stageGamePiece() {
    if (!GAME.moveStarted) {
        GAME.activeGamePiece = document.getElementById(this.id)

        let leftBox_left = parseInt(document.querySelector('.cup-white-ovals').style.left.replace('px', ''))
        let leftBox_width = parseInt(document.querySelector('.cup-white-ovals').style.width.replace('px', ''))
        let leftBox_right = leftBox_left + leftBox_width
        let rightBox_left = parseInt(document.querySelector('.cup-white-triangles').style.left.replace('px', ''))
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

    GAME.sndDroppingPieces.play()

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