class Rules {

    static GetLegalMovePositions(gGame, ptPieceType, sSquare) {
        switch(ptPieceType) {
            case PieceType.Pawn: return Rules._PawnPositions(gGame, sSquare);
            case PieceType.Rook: return Rules._RookPositions(gGame, sSquare);
            case PieceType.Knight: return Rules._KnightPositions(gGame, sSquare);
            case PieceType.Bishop: return Rules._BishopPositions(gGame, sSquare);
            case PieceType.Queen: return Rules._QueenPositions(gGame, sSquare); 
            case PieceType.King: return Rules._KingPositions(gGame, sSquare);
            default: return [];
        }
    }


    static _CanEnPassant(gGame, sFrom, sTo) {
        // Pawns that are able to capture "en passant"
        // are either on row 4 (black turn) or row 5 (white turn)
        // In our notation, top row is 0 and bottom one is 7
        let r = (gGame.turn === PieceColor.White ? 3 : 4);
        let sign = (gGame.turn === PieceColor.White ? 1 : -1);
        let sRushed = gGame.pawnRush;

        if (sFrom.row === r && sRushed &&
                gGame.chessboard.getSquare(sTo.row + sign, sTo.column) === sRushed) {
            return true;
        }

        return false;
    }


    static NumberOfPossbileMoves(gGame, sAllies) {
        let moveCount = 0;
        for (let i = 0; i < sAllies.length; i++) {
            moveCount += Rules._FilterPositions(gGame, sAllies[i]);
        }
        return moveCount;
    }


    static _FilterPositions(gGame, sAlly) {
        let positions = Rules.GetLegalMovePositions(gGame, sAlly.piece.type, sAlly);
        let posCount = 0;
        for (let i = 0; i < positions.length; i++) {
            if (!gGame.isKingInCheckSimulation(sAlly.row, sAlly.column, positions[i].row, positions[i].column)) {
                posCount++;
            }
        }
        return posCount;
    }


    // TODO: Add pawn promotion (probably better in Game.js)
    static _PawnPositions(gGame, sSquare) {
        let fr = sSquare.row;
        let fc = sSquare.column;
        let board = gGame.chessboard;
        let piece = sSquare.piece; // TODO: Remove this
        let sign = (piece.color === PieceColor.White ? -1 : 1);
        let positions = [];

        let r = fr + sign; 
        let c = fc;
        // Napred
        if (board.inBounds(r, c) && board.getSquare(r, c).isEmpty()) {
            positions.push(board.getSquare(r, c));

            // "Dvokorak"
            if (board.inBounds(r + sign, c) && board.getSquare(r + sign, c).isEmpty() && piece.moved === PieceState.Default) {
                positions.push(board.getSquare(r + sign, c));
            }
        }
        // Leva dijagonala + provera za "en passant"
        c = fc - 1;
        if (board.inBounds(r, c) && 
                ((!board.getSquare(r, c).isEmpty() && board.getSquare(r, c).piece.color !== piece.color) ||
                Rules._CanEnPassant(gGame, sSquare, board.getSquare(r, c)))) {
            positions.push(board.getSquare(r, c));
        }
        // Desna dijagonala + provera za "en passant"
        c = fc + 1;
        if (board.inBounds(r, c) &&
                ((!board.getSquare(r, c).isEmpty() && board.getSquare(r, c).piece.color !== piece.color) ||
                Rules._CanEnPassant(gGame, sSquare, board.getSquare(r, c)))) {
            positions.push(board.getSquare(r, c));
        }

        return positions;
    }


    static _RookPositions(gGame, sSquare) {
        let fr = sSquare.row;
        let fc = sSquare.column;
        let positions = [];

        let dr = [1, -1, 0, 0];
        let dc = [0, 0, -1, 1];

        for (let d = 0; d < dr.length; d++) {
            for (let i = 1; i <= 7; i++) {
                let r = fr + i*dr[d];
                let c = fc + i*dc[d];
                if (!gGame.chessboard.inBounds(r, c)) {
                    break;
                }
    
                let square = gGame.chessboard.getSquare(r, c);
                if (!square.isEmpty()) {
                    if (square.piece.color !== sSquare.piece.color) {
                        positions.push(square);
                    }
                    break;
                }

                positions.push(square);
            }
        }

        return positions;
    }


    static _KnightPositions(gGame, sSquare) {
        let fr = sSquare.row;
        let fc = sSquare.column;

        // pocinjemo od gore levo
        let dc = [-1, 1, 2, 2, 1, -1, -2, -2];
        let dr = [-2, -2, -1, 1, 2, 2, 1, -1];

        // calculate every possible position
        let positions = [];
        for (let i = 0; i < dc.length; i++) {
            let r = fr + dr[i];
            let c = fc + dc[i];
            // skip unreachable squares
            if (gGame.chessboard.inBounds(r, c)) {
                // Pushing REFERENCES to squares on the board
                let square = gGame.chessboard.getSquare(r, c);
                if (square.isEmpty() || (!square.isEmpty() && square.piece.color !== sSquare.piece.color)) {
                    positions.push(square);
                }
            }
        }

        return positions;
    }


    static _BishopPositions(gGame, sSquare) {
        let fr = sSquare.row;
        let fc = sSquare.column;
        let positions = [];

        let dr = [1, 1, -1, -1];
        let dc = [-1, 1, -1, 1];

        for (let d = 0; d < dr.length; d++) {
            for (let i = 1; i <= 7; i++) {
                let r = fr + i*dr[d];
                let c = fc + i*dc[d];
                if (!gGame.chessboard.inBounds(r, c)) {
                    break;
                }
    
                let square = gGame.chessboard.getSquare(r, c);
                if (!square.isEmpty()) {
                    if (square.piece.color !== sSquare.piece.color) {
                        positions.push(square);
                    }
                    break;
                }
    
                positions.push(square);
            }
        }

        return positions;
    }


    static _QueenPositions(gGame, sSquare) {
        return Rules._BishopPositions(gGame, sSquare).concat(Rules._RookPositions(gGame, sSquare));
    }


    // TODO: Not really like this
    static _KingPositions(gGame, sSquare) {
        let fr = sSquare.row;
        let fc = sSquare.column;
        let positions = [];

        let dr = [-1, -1, -1, 0, 1, 1, 1, 0];
        let dc = [-1, 0, 1, 1, 1, 0, -1, -1];

        for (let d = 0; d < dr.length; d++) {
            let r = fr + dr[d];
            let c = fc + dc[d];

            if (gGame.chessboard.inBounds(r, c)) {
                let square = gGame.chessboard.getSquare(r, c);
                if (square.isEmpty() || (!square.isEmpty() && square.piece.color !== sSquare.piece.color)) {
                    positions.push(square);
                }
            }
        }

        
        // let r = (sSquare.piece.color === PieceColor.White ? 7 : 0);
        // if (gGame.canCastleA(sSquare.piece.color)) {
        //     positions.push(gGame.chessboard.getSquare(r, 2));
        // }

        // if (gGame.canCastleH(sSquare.piece.color)) {
        //     positions.push(gGame.chessboard.getSquare(r, 6))
        // }

        return positions;
    }
}