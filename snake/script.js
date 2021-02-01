const fruitTile = "f";
const snakeTile = "s";
const emptyTile = "e";
let mapSize = 12;
let snake = [[0, 0], [0, 1], [0, 2]];
let direction = "right";
let map = generateMap();
let gameEnd = false;
let timer;
const deltaTimeBase = 300;
let deltaTime;
let gamePaused = false;

function generateMap() {
    let map = []
    for (let y = 0; y < mapSize; y++) {
        map.push([]);
        for (let x = 0; x < mapSize; x++) {
            map[y].push(emptyTile);
        }
    }
    for (var snakePieceId = 0; snakePieceId < snake.length; snakePieceId++) {
        map[snake[snakePieceId][0]][snake[snakePieceId][1]] = snakeTile
    }
    setNextFruit(map);

    return map;
}

function nextState() {
    let snakeHeadY = snake[snake.length - 1][0];
    let snakeHeadX = snake[snake.length - 1][1];
    switch (direction) {
        case "right":
            snakeHeadX += 1;
            break;
        case "left":
            snakeHeadX -= 1;
            break;
        case "up":
            snakeHeadY -= 1;
            break;
        case "down":
            snakeHeadY += 1;
            break;
    }
    
    snakeHeadX = (snakeHeadX + mapSize) % mapSize;
    snakeHeadY = (snakeHeadY + mapSize) % mapSize;
    switch (map[snakeHeadY][snakeHeadX]) {
        case fruitTile:
            map[snakeHeadY][snakeHeadX] = snakeTile;
            snake.push([snakeHeadY, snakeHeadX]);
            map = setNextFruit(map);
            document.getElementById("score").innerText = "score: " + snake.length.toString();
            break;
        case snakeTile:
            gameEnd = true;
            gameEnded();
            break;
        case emptyTile:
            map[snakeHeadY][snakeHeadX] = snakeTile;
            snake.push([snakeHeadY, snakeHeadX]);
            let snakeEnd = snake.shift();
            map[snakeEnd[0]][snakeEnd[1]] = emptyTile;
            break;
    }
}
// possible infinite loop
function setNextFruit(map) {
    while (true) {
        let fruitY = getRandomInt(mapSize);
        let fruitX = getRandomInt(mapSize);
        if (map[fruitY][fruitX] == emptyTile) {
            map[fruitY][fruitX] = fruitTile;
            break;
        }
    }
    return map;
}

function getRandomInt(upperBound) {
    return Math.floor(Math.random() * upperBound);
}

function main() {
    // REFACTOR ASAP
    document.getElementById("size12").addEventListener("click", function () {mapSize = 12;});
    document.getElementById("size18").addEventListener("click", function () {mapSize = 18;});
    document.getElementById("size24").addEventListener("click", function () {mapSize = 24;});
    document.getElementById("size32").addEventListener("click", function () {mapSize = 32;});
    document.getElementById("startNewGame").addEventListener("click", newGame);

    if (!isMobileDevice()) {
        document.getElementById("btnBlock").style.visibility = "hidden";
    }

    enableControls();
    resizeControls();
    deltaTime = deltaTimeBase;
    generateTiles();
    resizeMap()
    update();
}

function update() {
    if (gameEnd) {
        return;
    }
    if (gamePaused) {
        timer = setTimeout(update, 50);
        return;
    }
    nextState();
    drawMap();
    deltaTime = deltaTimeBase * (Math.pow(mapSize, 2) - snake.length) / Math.pow(mapSize, 2);
    timer = setTimeout(update, deltaTime);    
}

function drawMap() {
    for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
            let color = "grey";
            switch (map[y][x]) {
                case fruitTile:
                    color = "white";
                    break;
                case snakeTile:
                    color = "white";
                    break;
                case emptyTile:
                    break;
                default:
                    break;
            }
            document.getElementById("tile_" + y.toString() + "_" + x.toString()).style.backgroundColor = color;
        }
    }
}

function resizeMap() {
    let squareSize = Math.min(window.innerHeight, window.innerWidth) * 0.9;
    document.getElementById("field").style.height = squareSize + "px";
    document.getElementById("field").style.width = squareSize + "px";
    for (let rowId = 0; rowId < mapSize; rowId++) {
        document.getElementById("rowContainer_" + rowId.toString()).style.width = Math.floor(squareSize) + "px";
        document.getElementById("rowContainer_" + rowId.toString()).style.height = Math.floor(squareSize / mapSize) + "px";
        document.getElementById("row_" + rowId.toString()).style.width = Math.floor(squareSize) + "px";
        document.getElementById("row_" + rowId.toString()).style.height = Math.floor(squareSize / mapSize) + "px";
        for (let columnId = 0; columnId < mapSize; columnId++) {
            tileId = "tile_" + rowId.toString() + "_" + columnId.toString();
            tile = document.getElementById(tileId);
            tile.style.width = Math.floor(squareSize / mapSize * 0.8) + "px";
            tile.style.height = Math.floor(squareSize / mapSize * 0.8) + "px";
            tile.style.marginLeft = Math.floor(squareSize / mapSize * 0.1) + "px";
            tile.style.marginRight = Math.floor(squareSize / mapSize * 0.1) + "px";
            tile.style.marginTop = Math.floor(squareSize / mapSize * 0.1) + "px";
            tile.style.marginBottom = Math.floor(squareSize / mapSize * 0.1) + "px";
            
        }
    }   
}

function generateTiles() {
    for (let rowId = 0; rowId < mapSize; rowId++) {
        let rowContainer = document.createElement("div");
        rowContainer.className = "rowContainer";
        rowContainer.id = "rowContainer_" + rowId.toString();
        document.getElementById("field").appendChild(rowContainer);

        let row = document.createElement("div");
        row.className = "row";
        row.id = "row_" + rowId.toString();
        rowContainer.appendChild(row);
        for(let columnId = 0; columnId < mapSize; columnId++) {
            let tile = document.createElement("div");
            tile.className = "tile";
            tile.id = "tile_" + rowId.toString() + "_" + columnId.toString();
            row.appendChild(tile);
        }
    }
}

function pauseClicked() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        document.getElementById("pause").style.opacity = 1;
    } else {
        document.getElementById("pause").style.opacity = 0;    
    }
}

function gameEnded() {
    console.log("game lost");
    document.getElementById("gameEnd").style.opacity = 1;

}

function newGame() {
    document.getElementById("gameEnd").style.opacity = 0;
    document.getElementById("field").innerHTML = "";
    gameEnd = false;
    direction = "right";
    snake = [[0, 0], [0, 1], [0, 2]];
    map = generateMap();
    generateTiles();
    resizeMap()
    update();
}

function moveUp() {
    if (direction == "down") {
        return;
    }
    direction = "up";
}

function moveDown() {
    if (direction == "up") {
        return;
    }
    direction = "down";
}

function moveLeft() {
    if (direction == "right") {
        return;
    }
    direction = "left";
}

function moveRight() {
    if (direction == "left") {
        return;
    }
    direction = "right";
}

function enableControls() {
    document.getElementById("btnUp").addEventListener("click", moveUp);
    document.getElementById("btnDown").addEventListener("click", moveDown);
    document.getElementById("btnLeft").addEventListener("click", moveLeft);
    document.getElementById("btnRight").addEventListener("click", moveRight);    
}

function resizeControls() {
    let maxXSize = Math.floor((window.innerWidth - window.innerHeight) / 2);
    let maxYSize = Math.floor(window.innerHeight);
    let controlBlockSize = Math.floor(Math.min(maxXSize, maxYSize) / Math.sqrt(2));
    let buttonSize = Math.floor(controlBlockSize * 0.8 / 2);
    let buttonMargin = Math.floor(controlBlockSize * 0.1 / 2);
    let buttonBlockXPosition = Math.floor(maxXSize / 2);
    let buttonBlockYPosition = Math.floor(maxYSize / 2);
    let buttonBlock = document.getElementById("btnBlock");
    buttonBlock.style.top = buttonBlockYPosition + "px";
    buttonBlock.style.left = buttonBlockXPosition + "px";
    buttonBlock.style.height = controlBlockSize + "px";
    buttonBlock.style.width = controlBlockSize + "px";
    
    let controlButtons = document.getElementsByClassName("controlButton");
    for (let i = 0; i < controlButtons.length; i++) {
        let button = controlButtons[i];
        button.style.width = buttonSize + "px";
        button.style.height = buttonSize + "px";
        button.style.margin = buttonMargin + "px"; 
    }
}

function resizeAll() {
    resizeMap();
    resizeControls();
}

function isMobileDevice() {
    return navigator.maxTouchPoints != 0;
}

document.addEventListener("DOMContentLoaded", main);
window.addEventListener("resize", resizeAll);
document.addEventListener("keydown", function (event) {
    switch (event.code) {
        case "ArrowDown":
            moveDown();
            break;
        case "ArrowUp":
            moveUp();
            break;
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowRight":
            moveRight();
            break;    
        case "KeyP":
            pauseClicked();
            break;
        default:
            break;
        }
});