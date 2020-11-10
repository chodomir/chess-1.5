class Game {
    // TODO: Add timer!
    //       Promote a pawn

    constructor(cbChessboard) {
        this._chessboard = cbChessboard;
        this._turn = PieceColor.White;
        this._action = PlayerAction.Idle;
        this._currentMove = new Move(null, null, PieceType.None);
        this._sPawnRush = null;
        this._gameFinished = null;

        this._timer = new Timer(300);
        this._timer.play();
    }
    
    // Main method
    playerMove(row, column, gui) {
        // get clicked square
        let square = this._chessboard.getSquare(row, column);
        let color = this._turn === PieceColor.White ? "White" : "Black";
        
        if (this._timer.seconds === 0) {
            this._gameFinished = (this._turn === PieceColor.Black ? PieceColor.White : PieceColor.Black);
        }

        if (!this._gameFinished) {
            // Checks if player selected anything before
            if (this._action === PlayerAction.Idle) {
                // Check to see if player selected his own piece
                if (!square.isEmpty() && this._turn === square.piece.color) {
                    console.log(color, " selected a piece");
                    this._action = PlayerAction.Select;
                    
                    // Update current move
                    this._setSelectedPiece(square);
                } else if (square.isEmpty()) {
                    console.log(color + ", stop fooling around.");
                } else {
                    console.log(color, "cannot select a piece of different color");
                }
            } else { // Player is trying to move a piece.
                if (!square.isEmpty() && this._turn === square.piece.color) {
                    console.log(color, "changed his/her mind. Selecting different piece");
                    this._setSelectedPiece(square);
                } else {
                    // Update current move
                    this._currentMove.to = square;
                    // Update player state
                    this._action = PlayerAction.Idle;

                    // TODO: Check if currentPlayer still has time left

                    // Check if the move played is valid
                    if (this._isValidPlay()) {
                        console.log("Valid play");
                        this._sPawnRush = this._getPawnRush();
                        this._currentMove.from.piece.moved = PieceState.Moved;
                        // check if you need to promote a pawn, if yes, promote
                        this._tryPromotion(this._currentMove.from, this._currentMove.to);
                        // update chessboard
                        this._updateBoard(this._currentMove);
                        // draw
                        gui.drawChessboard(this._chessboard);
                        // switch player
                        this._switchPlayer();
                        gui.drawTurn();

                        // See if enemy king is in checkmate
                        let allies = this._getPlayerPositions(this._turn);
                        let enemies = this._getPlayerPositions(this._turn === PieceColor.White ? PieceColor.Black : PieceColor.White);
                        let allyMoves = Rules.NumberOfPossbileMoves(this, allies);
                        let allyKing = this.getKingSquare(allies);
                        if (this.underAttack(allyKing, enemies) && allyMoves === 0) {
                            this._gameFinished = (this._turn === PieceColor.White ? PieceColor.Black : PieceColor.White);
                        } else if (allyMoves === 0) {
                            this._gameFinished = PieceColor.White + PieceColor.Black;
                        }           
                    } else {
                        console.log("Invalid play");
                    }
                }
            }
        } else if (this._gameFinished === PieceColor.White) {
            console.log("White won the game! Press F5 to play again...")
        } else if (this._gameFinished === PieceColor.Black) {
            console.log("Black won the game! Press F5 to play again...")
        } else {
            console.log("It's a draw! Press F5 to play again...")
        }
    }


    underAttack(sSquare, sEnemies) {
        for (let i = 0; i < sEnemies.length; i++) {
            let attacked = Rules.GetLegalMovePositions(this, sEnemies[i].piece.type, sEnemies[i]);
            for (let j = 0; j < attacked.length; j++) {
                if (attacked[j] === sSquare) {
                    return true;
                }
            }
        }
        return false;
    }


    // TODO: bolje je cuvati promenljivu koja ukazuje na kralja
    getKingSquare(sPlayerPositions) {
        // Find the king among the pieces
        for (let i = 0; i < sPlayerPositions.length; i++) {
            if (sPlayerPositions[i].piece.type === PieceType.King) {
                return sPlayerPositions[i];
            }
        }
    }

    // Checks if move made from (fr, fc) to (tr, tc) leaves the king in check
    isKingInCheckSimulation(fr, fc, tr, tc, suppressLog = false) {
        let from = this._chessboard.getSquare(fr, fc);
        let to = this._chessboard.getSquare(tr, tc);
        let simMove = new Move(from, to, from.piece.type);
        let restoreMove = new Move(to, from, from.piece.type);

        // simulate
        // Zapamti figuru koja je bila na tom polju pre simulacije
        let tmp = this._chessboard.getSquare(to.row, to.column).piece;
        let piece = null;
        if (tmp) {
            piece = new Piece(tmp.type, tmp.color, tmp.moved);
        }
        this._updateBoard(simMove);
        
        let allies = this._getPlayerPositions(to.piece.color);
        let enemies = this._getPlayerPositions(to.piece.color === PieceColor.White ? PieceColor.Black : PieceColor.White);
        let king = this.getKingSquare(allies);

        if (this.underAttack(king, enemies)) {
            if (!suppressLog)
                console.log("Your king will not like that move.");

            this._updateBoard(restoreMove);
            if (piece) {
                this.chessboard.placePiece(to.row, to.column, piece);
            }
            return true;
        }

        
        // undo previous update
        this._updateBoard(restoreMove);
        if (piece)  {
            this.chessboard.placePiece(to.row, to.column, piece);
        }
        return false;
    }

    
    canCastleA(color) {
        let r = (color === PieceColor.White ? 7 : 0);
        let enemyColor = (color == PieceColor.White ? PieceColor.Black : PieceColor.White);
        let king = this._chessboard.getSquare(r, 4).piece;
        let rook = this._chessboard.getSquare(r, 0).piece;
        let enemies = this._getPlayerPositions(enemyColor);
        
        if (!king || king.moved !== PieceState.Default ||
                !rook || rook.moved !== PieceState.Default) {
            return false;
        }

        for (let i = 1; i < 4; i++) {
            let square = this._chessboard.getSquare(r, i);
            if (!square.isEmpty() || (i > 1 && this.underAttack(square, enemies)))
                return false;
        }

        return true;
    }


    canCastleH(color) {
        let r = (color === PieceColor.White ? 7 : 0);
        let enemyColor = (color == PieceColor.White ? PieceColor.Black : PieceColor.White);
        let king = this._chessboard.getSquare(r, 4).piece;
        let rook = this._chessboard.getSquare(r, 7).piece;
        let enemies = this._getPlayerPositions(enemyColor);
        
        if (!king || king.moved !== PieceState.Default ||
                !rook || rook.moved !== PieceState.Default) {
            return false;
        }

        for (let i = 5; i < 7; i++) {
            let square = this._chessboard.getSquare(r, i);
            if (!square.isEmpty() || this.underAttack(square, enemies))
                return false;
        }

        return true;
    }

    
    _isValidPlay() {
        let currentPieceType = this._currentMove.pieceType;
        let from = this._currentMove.from;
        let to = this._currentMove.to;
        let positions = Rules.GetLegalMovePositions(this, currentPieceType, this._currentMove.from);
        console.log("Enemy pawn rushed at: ", this._sPawnRush);
        console.log("Possible positions for played piece (without castling):", positions);

        // If player castled, place the rook where it belongs
        if (from.piece.type === PieceType.King && this._tryCastling(this._currentMove.to, this._turn)) {
            return true;
        }
        
        for (let i = 0; i < positions.length; i++) {
            if (positions[i] === this._currentMove.to) {
                // Does the play endanger the king?
                if (this.isKingInCheckSimulation(from.row, from.column, to.row, to.column)) {
                    return false;
                }

                let sign = (this._turn === PieceColor.White ? 1 : -1);
                let tmp = undefined;
                if (this._chessboard.inBounds(positions[i].row + sign, positions[i].column)) {
                    tmp = this._chessboard.getSquare(positions[i].row + sign, positions[i].column);
                }

                // Check for capture
                if (!positions[i].isEmpty()) {
                    console.log("Piece captured");
                } 
                // Check for "en passant" capture
                else if (this._sPawnRush && tmp === this._sPawnRush && currentPieceType === PieceType.Pawn) {
                    console.log("Piece captured in 'en passant'");
                    // remove rushed pawn
                    this._chessboard.removePiece(this._sPawnRush.row, this._sPawnRush.column);
                }
                return true;
            }
        }
        return false;
    }


    _tryCastling(sTo, color) {
        let r = (color === PieceColor.White ? 7 : 0);
        if (this.canCastleA(color) && sTo === this._chessboard.getSquare(r, 2)) {
            let from = this._chessboard.getSquare(r, 0);
            let to = this._chessboard.getSquare(r, 3);
            let rookMove = new Move(from, to, PieceType.Rook);
            this._updateBoard(rookMove);
            return true;
        }

        if (this.canCastleH(color) && sTo === this._chessboard.getSquare(r, 6)) {
            let from = this._chessboard.getSquare(r, 7);
            let to = this._chessboard.getSquare(r, 5);
            let rookMove = new Move(from, to, PieceType.Rook);
            this._updateBoard(rookMove);
            return true;
        }

        return false;
    }


    _tryPromotion(sFrom, sTo) {
        let r = (sFrom.piece.color === PieceColor.White ? 0 : 7);
        if (sFrom.piece.type === PieceType.Pawn && sTo.row === r) {
            sFrom.piece = new Piece(PieceType.Queen, sFrom.piece.color, PieceState.Moved);
        }
    }
    

    _getPlayerPositions(ptColor) {
        let positions = [];

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let square = this._chessboard.getSquare(i, j);
                if (square.piece && square.piece.color === ptColor)
                    positions.push(square);
            }
        }

        return positions
    }
    

    _setSelectedPiece(sSquare) {
        this._currentMove.from = sSquare;
        this._currentMove.pieceType = sSquare.piece.type;
    }
    
    
    _switchPlayer() {
        console.log("====================");
        console.log("   PLAYER SWITCHED  ");
        console.log("====================")
        if (this._turn === PieceColor.White)
            this._turn = PieceColor.Black;
        else
            this._turn = PieceColor.White;

        this._timer.reset();
        this._timer.play();
    }
    
    
    _updateBoard(mMove) {
        let from = mMove.from;
        let to = mMove.to;
        this._chessboard.placePiece(to.row, to.column, from.piece);
        this._chessboard.removePiece(from.row, from.column);
    }


    _getPawnRush() {
        let fs = this._currentMove.from;
        let ts = this._currentMove.to;

        if (fs.piece.type === PieceType.Pawn && Math.abs(fs.row - ts.row) === 2) { 
            return ts;
        }
        
        return null;
    }


    get chessboard() {
        return this._chessboard;
    }


    get turn() {
        return this._turn;
    }


    get lastMove() {
        return this._currentMove;
    }


    get pawnRush() {
        return this._sPawnRush;
    }


    get timer() {
        return this._timer;
    }

    get finished() {
        return this._gameFinished;
    }
}