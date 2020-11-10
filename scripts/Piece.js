class Piece {
    constructor(type, color, moved = PieceState.Default) {
        this._type = type;
        this._color = color;
        this._moved = moved;
    }


    get moved() {
        return this._moved;
    }


    set moved(psValue) {
        this._moved = psValue;
    }


    get type() {
        return this._type;
    }


    get color() {
        return this._color;
    }


    set type(ptVal) {
        this._value = ptVal;
    }
}
