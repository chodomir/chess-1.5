class Move {
    constructor(sFrom, sTo, ptType) {
        this._from = sFrom;
        this._to = sTo;
        // TODO: Ova informacija moze da se izvuce iz from.piece.type
        this._type = ptType;
    }


    get from() {
        return this._from;
    }


    set from(sVal) {
        this._from = sVal;
    }


    get to() {
        return this._to;
    }


    set to(sVal) {
        this._to = sVal;
    }


    get pieceType() {
        return this._type;
    }


    set pieceType(ptVal) {
        this._type = ptVal;
    }
}