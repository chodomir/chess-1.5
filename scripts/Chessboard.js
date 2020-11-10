class Chessboard {

    constructor() {
        this._squares = [];

        this.reset();
    }

    reset() {
        let white = false;
        for (let i = 0; i < 8; i++) {
            this._squares[i] = [];
            for (let j = 0; j < 8; j++) {
                let pieceColor = PieceColor.None;
                let pieceType = PieceType.None;

                if (i == 0 || i == 7) {
                    if (j == 0 || j == 7)
                        pieceType = PieceType.Rook;
                    else if (j == 1 || j == 6)
                        pieceType = PieceType.Knight;
                    else if (j == 2 || j == 5)
                        pieceType = PieceType.Bishop;
                    else if (j == 3)
                        pieceType = PieceType.Queen;
                    else
                        pieceType = PieceType.King;
                    
                    if (i == 0)
                        pieceColor = PieceColor.Black;
                    else
                        pieceColor = PieceColor.White;

                    this._squares[i][j] = new Square(i, j, new Piece(pieceType, pieceColor));
                } else if (i == 1 || i == 6) {
                    pieceType = PieceType.Pawn;
                    if (i == 1)
                        pieceColor = PieceColor.Black;
                    else
                        pieceColor = PieceColor.White;

                    this._squares[i][j] = new Square(i, j, new Piece(pieceType, pieceColor));
                } else {
                    this._squares[i][j] = new Square(i, j);
                }
            }
        }
    }

    
    getSquare(row, column) {
        return this._squares[row][column];
    }


    placePiece(row, column, pPiece) {
        this._squares[row][column].piece = pPiece;
    }


    removePiece(row, column) {
        this._squares[row][column].piece = null;
    }


    inBounds(row, col) {
        return (row >= 0 && row <= 7 && col >= 0 && col <= 7);
    }
}