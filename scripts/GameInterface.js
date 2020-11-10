class GameInterface {
    constructor(gGame) {
        this._board = document.getElementById("chessboard");
        this._timeField = document.getElementById("time");
        this._turnField = document.getElementById("turn");
        this._game = gGame;
    }

    // Initializes and draws the chessboard
    constructChessboard() {
        this._initializeChessboard();
        this.drawPieces(this._game.chessboard);
        this._startTimer();
    }
    

    _startTimer() {
        let t = this;
        setInterval(function() {
            if (!t._game.finished) {
                t._timeField.innerText = t._game.timer.toString();
            }
        }, 1000);
    }

    // TODO: Naprai i _initializeChessboard(cbChessboard) sto bi bila samo jedna f-ja, oba ne bi bila potrebna
    _initializeChessboard() {
        if (this._board.children.length === 0) {
            for (let i = 0; i < 8; i++) {
                let tr = document.createElement("tr");
                // Color of square
                let white = (i % 2 == 0 ? true : false);
                for (let j = 0; j < 8; j++) {
                    // Create and color the square
                    let td = document.createElement("td");
                    td.classList.add(white ? "white" : "black");
                    // change color for next square
                    white = !white;

                    // Add click event on table element
                    let game = this._game;
                    let guiInstance = this;
                    td.addEventListener("click", function() {
                        // "this" is a reference to clicked HTML object
                        let row = this.parentElement.rowIndex;
                        let col = this.cellIndex;
                        
                        game.playerMove(row, col, guiInstance);
                    });
                    
                    // Add intialized cell to the row
                    tr.appendChild(td);
                }
                // Add the row to the chessboard
                this._board.appendChild(tr);
            }  
        }
    }

    // TODO: Do I need this? DrawChessboard() je opstija varijanta
    drawPieces() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let square = this._game.chessboard.getSquare(i, j);
                if (!square.isEmpty()) {
                    // On position (i, j) draw a chess piece
                    this._board.children[i].children[j].innerText =
                            PieceSymbol[square.piece.color][square.piece.type];
                }
            }
        }
    }
    
    // TODO: Do I need this? DrawChessboard je opstija varijanta
    drawMove(mMove) {
        let from = mMove.from;
        let to = mMove.to;

        // draw chessboard
        this._board.children[from.row].children[from.column].innerText = '';
        this._board.children[to.row].children[to.column].innerText = 
            PieceSymbol[this._game.turn][mMove.pieceType];
    }


    drawChessboard(cbChessboard) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let square = cbChessboard.getSquare(i, j);
                if (!square.isEmpty()) {
                    this._board.children[i].children[j].innerText =
                            PieceSymbol[square.piece.color][square.piece.type];
                } else  {
                    this._board.children[i].children[j].innerText = '';
                }
            }
        }
    }

    
    drawTurn() {
        this._turnField.innerText = PieceColor[this._game.turn];
    }
} 