class Square {
    constructor(row, column, pPiece = null) {
        this._row = row;
        this._column = column;
        this._piece = pPiece;
    }


    isEmpty() {
        return (this._piece === null);
    }


    get row() {
        return this._row;
    }    
    

    get column() {
        return this._column;
    }


    get piece() {
        return this._piece;
    }


    set piece(pPiece) {
        this._piece = pPiece;
    }
}