// Create WebSocket connection.
const socket = new WebSocket('wss://devserver.davincischallenge.app:8880')

socket.onopen = function (e) {
    //document.querySelector('#server-status').innerText = 'online'  
    //triggerEvent(document.getElementById('fakeClick'), 'click') 
}

// listen for messages
socket.onmessage = function (e) {
    let message = JSON.parse(e.data)

    // assign a game ID if one hasn't been assigned
    GAME.id = GAME.id || message.gameID

    if (message.type === 'DIRECT') {
        switch (message.event) {
            case 'GAME_CREATED':
                $('#inpCreateGameCode').value = GAME.id
                $('#inpCreateGameCode').setSelectionRange(0, 99999)
                $('#inpCreateGameCode').select() 

                GAME.start()
                
                break
            case 'GAME_STARTED':
                if (message.gameType === 'SOLO') {
                    GAME.join(false) // join as human
                    //loadGamePieces(1)

                    GAME.join(true) // join as bot
                    //loadGamePieces(2)                
                }  
                
                break
        }
    }

    if (message.type === 'BROADCAST') {
        // messages between players of the same game
        if (message.gameID === GAME.id) {
            switch (message.event) {             
                case 'JOINED_GAME':
                    loadGamePieces(message.playerNumber)

                    if (!ME.number) {
                        if (message.playerNumber === 2) {
                            ME.number = 2
                            ME.id = message.playerID 
                        }
                        else {
                            ME.number = 1
                            ME.id = message.playerID
                        }
                    }

                    break
                case 'GAME_READY':
                        // time to play....
                        $('#txtWaiting').classList.add('hidden')
                        $('#menu').style.height = '0%'
                        $('.modal').classList.add('hidden')
                        $('#waitingForPlayer').classList.add('hidden') 

                        GAME.currentPlayer = message.currentPlayer

                        // prevent player 1 from selecting player 2's pieces
                        if (ME.number === 1) {
                            Array.from(document.querySelectorAll('[id^="blackTriangle"],[id^="blackOval"]')).forEach(function(blackPiece) {
                                blackPiece.classList.add('no-pointer-events')
                            })                          
                        }

                        // prevent player 2 from selecting player 1's pieces
                        if (ME.number === 2) {
                            Array.from(document.querySelectorAll('[id^="whiteTriangle"],[id^="whiteOval"]')).forEach(function(whitePiece) {
                                whitePiece.classList.add('no-pointer-events')
                            })                          
                        } 
                        
                        showToast('You are player ' + ME.number)
    
                        GAME.toggleFlashers(1)

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
                    //updateBoard(message.currentPlayer, message.slotID, message.availableSlots)
                    updateBoard(message.currentPlayer, message.slotID)
                    GAME.moveStarted = false

                    break
                case 'SWITCH_PLAYER':
                    GAME.switchPlayer(message.currentPlayer, message.playerTwoIsBot)
                    GAME.toggleFlashers(message.currentPlayer)

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
                            'slotID': message.slotID
                        }))

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
