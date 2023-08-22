const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
let gameFinished = ''

class Field {
    constructor(field) {
        this._field = field;
    };

    print() {
        let lineCount = this._field.length;
        let displayGame = "";

        for (let i = 0; i < lineCount; i++) {
            displayGame += this._field[i].join(' ') + "\n\n";
        }

        console.log("Current game board");
        console.log(displayGame);
    };

    getCurrentPosition() {
        let rowNum = 0;
        let columnNum = 0;

        for (let i = 0; i < this._field.length; i++) {
            for (let j = 0; j < this._field[0].length; j++) {
                if (this._field[i][j] === "*") {
                    rowNum = i;
                    columnNum = j;
                }
            };
        };

        return [rowNum, columnNum];
    };

    getNewPosition(move) {
        let currentPosition = this.getCurrentPosition();
        let potentialNewPosition = [];

        if (move === "u") {
            potentialNewPosition = [currentPosition[0]-1, currentPosition[1]];
        } else if (move === "d") {
            potentialNewPosition = [currentPosition[0]+1, currentPosition[1]];
        } else if (move === "l") {
            potentialNewPosition = [currentPosition[0], currentPosition[1]-1];
        } else if (move === "r") {
            potentialNewPosition = [currentPosition[0], currentPosition[1]+1];
        };
        
        return potentialNewPosition;
    };

    getPositionCharacter(inputArr) {
        return myField._field[inputArr[0]][inputArr[1]];
    };

    updatePosition(oldPosition, newPosition) {
        this._field[oldPosition[0]][oldPosition[1]] = fieldCharacter;
        this._field[newPosition[0]][newPosition[1]] = pathCharacter;
    };
};

const myField = new Field(
    [
        ['*', '░', 'O'],
        ['░', 'O', '░'],
        ['░', '^', '░'],
    ]
);

while (gameFinished === '') {
    myField.print();
    let validMove = false;

    while (validMove === false) {

        let nextMove = prompt("What is your next move (u,d,l,r) to find the hat? (^)");
        console.log(nextMove);

        if (["u", "d", "l", "r"].includes(nextMove)) {
            validMove = true;
        } else {
            console.log("Please enter a valid move (u,d,l,r)");
        };

        let currentPosition = myField.getCurrentPosition();
        let currentRow = currentPosition[0];
        let currentColumn = currentPosition[1];

        let newPosition = myField.getNewPosition(nextMove);
        let newPositionChar = myField.getPositionCharacter(newPosition);

        if (newPositionChar === "^") {
            console.log("Congratulations, you have won the game!");
            gameFinished = "WIN";
        } else if (newPositionChar === "O") {
            console.log("You fell into a hole and lose!");
            gameFinished = "HOLE";
        } else if (newPosition[0] < 0 ||
            newPosition[0] > myField._field[0].length ||
            newPosition[1] < 0 ||
            newPosition[1] > myField._field.length) {
                console.log("You moved out of bounds, GAME OVER!");
                gameFinished = "OOB";
        };

        if (gameFinished !== "OOB") {
            myField.updatePosition(currentPosition, newPosition);
        }
    };
};