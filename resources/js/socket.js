// Create WebSocket connection.
const socket = new WebSocket('wss://devserver.davincischallenge.app:8880')

socket.onopen = function (e) {
    //document.querySelector('#server-status').innerText = 'online'   
}

// listen for messages
socket.onmessage = function (e) {
    let message = JSON.parse(e.data)

    // assign a game ID if one hasn't been assigned
    GAME.id = GAME.id || message.gameID      

    if (message.type === 'DIRECT') {
        switch (message.event) {
            case 'GAME_CREATED':
                // set the game ID
                if (inpCreateGameCode) inpCreateGameCode.value = GAME.id

                //if (GAME.type === 'SOLO') {
                    socket.send(JSON.stringify({
                        'event': 'START_GAME',
                        gameID: GAME.id,
                    }))             
                //}

                break
            case 'GAME_STARTED':
                GAME.inProgress = true

                //if (GAME.type === 'SOLO') {
                    loadGamePieces(1)  
                    loadGamePieces(2)   
                    
                    GAME.join(1, false) // join as human
                    GAME.join(2, true) // join as bot
                //}         

                break   
                 
        }
    }

    if (message.type === 'BROADCAST') {
        // messages between players of the same game
        if (message.gameID === GAME.id) {
            switch (message.event) {
                case 'JOINED_GAME':
                    if (GAME.playerNumber === 1) {

                    }

                    if (GAME.playerNumber === 2) {

                    }
                    
                    // let player 1 know that player 2 has joined
                    if (!message.isBot && message.playerNumber === 2) {
                        txtWaiting.innerHTML = 'Player 2 has joined the game!'

                        setTimeout(function() {
                            txtWaiting.classList.add('hidden')
                            menu.style.height = '0%'
                            document.getElementById('twoPlayerModal').classList.add('hidden')

                            // load game pieces
                            loadGamePieces(2)   
                        }, 2000)                        
                    }
    
                    break
                case 'UPDATE_BOARD':
                    //updateBoard(message.slotID, message.availableSlots) 

                    break
                case 'SCORE':
                    score(message.currentPlayer, message.playerOneScore, message.playerTwoScore, message.symbol)  

                    break
                case 'MOVE_STARTED':
                    GAME.moveStarted = true
                    GAME.currentPlayer = message.currentPlayer

                    break
                case 'MOVE_COMPLETE':
                    updateBoard(message.currentPlayer, message.slotID, message.availableSlots) 
                    GAME.moveStarted = false

                    break
                case 'SWITCH_PLAYER':
                    // is player 2 a bot?
                    if (message.currentPlayer === 2 && message.playerTwoIsBot) {
                        socket.send(JSON.stringify({
                            'event': 'GO_BOT',
                            gameID: GAME.id }))
                    }

                    break 
                case 'STAGE_BOT': 
                   // simulate click event to stage bot
                    triggerEvent(document.getElementById(message.gamePiece), 'click')
                    
                    // pause for effect and send the move
                    setTimeout(function () {
                        socket.send(JSON.stringify({
                            'event': 'MOVE_COMPLETE',
                            'gameID': GAME.id,
                            'currentPlayer': 2,
                            'slotID': message.slotID }))

                            document.getElementById(message.gamePiece).remove()
                    }, 3000)

                    break                                 
            }
        }

    }
}

socket.onerror = function (error) {
    // $('#server-status').html(error)
}
