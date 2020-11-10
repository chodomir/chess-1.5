// Make PieceType and PieceColor enums
var PieceType;
(function (PieceType) {
    PieceType[PieceType["None"] = 0] = "None";
    PieceType[PieceType["Pawn"] = 1] = "Pawn";
    PieceType[PieceType["Rook"] = 2] = "Rook";
    PieceType[PieceType["Knight"] = 3] = "Knight";
    PieceType[PieceType["Bishop"] = 4] = "Bishop";
    PieceType[PieceType["Queen"] = 5] = "Queen";
    PieceType[PieceType["King"] = 6] = "King";
})(PieceType || (PieceType = {}));


var PieceColor;
(function (PieceColor) {
    PieceColor[PieceColor["None"] = 0] = "None";
    PieceColor[PieceColor["White"] = 1] = "White";
    PieceColor[PieceColor["Black"] = 2] = "Black";
})(PieceColor || (PieceColor = {}));


var PlayerAction;
(function (PlayerAction) {
    PlayerAction[PlayerAction["Idle"] = 0] = "Idle";
    PlayerAction[PlayerAction["Select"] = 1] = "Select";

})(PlayerAction || (PlayerAction = {}));


// TOOD: No need for piece state, bool in enough
var PieceState;
(function (PieceState) {
    PieceState[PieceState["Default"] = 0] = "Default";
    PieceState[PieceState["Moved"] = 1] = "Moved";
    PieceState[PieceState["Special"] = 2] = "Special";

})(PieceState || (PieceState = {}));


// Matrix containing unicode symbols for chess pieces
const PieceSymbol = [];
PieceSymbol[PieceColor.White] = [];
PieceSymbol[PieceColor.Black] = [];
PieceSymbol[PieceColor.White][PieceType.Pawn] = "\u2659";
PieceSymbol[PieceColor.White][PieceType.Rook] = "\u2656";
PieceSymbol[PieceColor.White][PieceType.Knight] = "\u2658";
PieceSymbol[PieceColor.White][PieceType.Bishop] = "\u2657";
PieceSymbol[PieceColor.White][PieceType.Queen] = "\u2655";
PieceSymbol[PieceColor.White][PieceType.King] = "\u2654";
PieceSymbol[PieceColor.Black][PieceType.Pawn] = "\u265F";
PieceSymbol[PieceColor.Black][PieceType.Rook] = "\u265C";
PieceSymbol[PieceColor.Black][PieceType.Knight] = "\u265E";
PieceSymbol[PieceColor.Black][PieceType.Bishop] = "\u265D";
PieceSymbol[PieceColor.Black][PieceType.Queen] = "\u265B";
PieceSymbol[PieceColor.Black][PieceType.King] = "\u265A";
