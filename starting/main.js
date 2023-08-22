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
        return this._field[inputArr[0]][inputArr[1]];
    };

    updatePosition(oldPosition, newPosition) {
        this._field[oldPosition[0]][oldPosition[1]] = fieldCharacter;
        this._field[newPosition[0]][newPosition[1]] = pathCharacter;
    };

    static generateField(rowTotal, columnTotal, holePct) {
        let rows = [];

        for (let i = 0; i < rowTotal; i++) {
            let columns = [];

            for (let j = 0; j < columnTotal; j++) {
                columns.push(fieldCharacter);
            };

            rows.push(columns);
        };

        let hatPosition = [Math.floor(Math.random() * (rowTotal-1))+1, Math.floor(Math.random() * (columnTotal-1))+1];
        rows[hatPosition[0]][hatPosition[1]] = hat;

        rows[0][0] = pathCharacter;

        let possibleFieldCount = (rowTotal * columnTotal) - 2;

        let holeCount = Math.floor(possibleFieldCount * Math.min(holePct, 0.33));

        for (let k = 0; k < holeCount; k++) {
            let holePosition = [0,0];

            while (holePosition[0] === 0 && holePosition[1] === 0) {
                holePosition = [Math.floor(Math.random() * rowTotal), Math.floor(Math.random() * columnTotal)];
            };
            
            rows[holePosition[0]][holePosition[1]] = hole;
        };

        return rows;
    };
};

/*const myField = new Field(
    [
        ['*', '░', 'O'],
        ['░', 'O', '░'],
        ['░', '^', '░'],
    ]
);*/

const playGame = () => {
    const gameClass = new Field(Field.generateField(5, 5, 0.2));

    while (gameFinished === '') {
        gameClass.print();
        let validMove = false;
    
        while (validMove === false) {
    
            let nextMove = prompt("What is your next move (u,d,l,r) to find the hat? (^)");
            console.log(nextMove);
    
            if (["u", "d", "l", "r"].includes(nextMove)) {
                validMove = true;
            } else {
                console.log("Please enter a valid move (u,d,l,r)");
            };
    
            let currentPosition = gameClass.getCurrentPosition();
    
            let newPosition = gameClass.getNewPosition(nextMove);
            let newPositionChar = gameClass.getPositionCharacter(newPosition);
    
            if (newPositionChar === "^") {
                console.log("Congratulations, you have won the game!");
                gameFinished = "WIN";
            } else if (newPositionChar === "O") {
                console.log("You fell into a hole and lose!");
                gameFinished = "HOLE";
            } else if (newPosition[0] < 0 ||
                newPosition[0] > gameClass._field[0].length ||
                newPosition[1] < 0 ||
                newPosition[1] > gameClass._field.length) {
                    console.log("You moved out of bounds, GAME OVER!");
                    gameFinished = "OOB";
            };
    
            if (gameFinished !== "OOB") {
                gameClass.updatePosition(currentPosition, newPosition);
            }
        };
    };
};

playGame();