/*******************************************************************/
/* Player */
class Player {
    constructor() {
        this.name = null;
        this.isBot = false;
        this.id = 'PLAYER-' + this.createUniqueID();
        this.score = 0;
        this.playerNumber = null;
        this.currentTurn = true;
    }

    get getName() {
        return this.name;
    }

    get getID() {
        return this.id;
    }

    get getNumber() {
        return this.playerNumber;
    }

    get getTurn() {
        return this.currentTurn;
    }

    createUniqueID = () => {
        function chr4() {
            return Math.random().toString(16).slice(-4);
        }

        return chr4() + '-' + chr4() + '-' + chr4();
    };

    setCurrentTurn = function (turn) {
        this.currentTurn = turn;

        if (turn) {
            $('#turn').text('Your turn.');
        } else {
            $('#turn').text('Waiting for Opponent');
        }
    }

}