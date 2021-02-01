const fruitTile = "f";
const snakeTile = "s";
const emptyTile = "e";
let mapWidth = 12;
let mapHeight = 12;
let snake = [[0, 0], [0, 1], [0, 2]];
let direction = "right";
let map = generateMap();
let gameEnd = false;
let viewTimer;
let modelTimer;

function generateMap() {
    let map = []
    for (let y = 0; y < mapHeight; y++) {
        map.push([]);
        for (let x = 0; x < mapWidth; x++) {
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
    console.log(snakeHeadX);
    console.log(snakeHeadY);
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
    
    snakeHeadX = (snakeHeadX + mapWidth) % mapWidth;
    snakeHeadY = (snakeHeadY + mapHeight) % mapHeight;
    switch (map[snakeHeadY][snakeHeadX]) {
        case fruitTile:
            map[snakeHeadY][snakeHeadX] = snakeTile;
            snake.push([snakeHeadY, snakeHeadX]);
            map = setNextFruit(map);
            break;
        case snakeTile:
            gameEnd = true;
            alert("FAIL");
            break;
        case emptyTile:
            map[snakeHeadY][snakeHeadX] = snakeTile;
            snake.push([snakeHeadY, snakeHeadX]);
            let snakeEnd = snake.shift();
            map[snakeEnd[0]][snakeEnd[1]] = emptyTile;
            console.log(snake);
            break;
    }
}

// possible infinite loop
function setNextFruit(map) {
    while (true) {
        let fruitY = getRandomInt(mapHeight);
        let fruitX = getRandomInt(mapWidth);
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
    generateTiles();
    update();
}

function update() {
    nextState();
    drawMap();
    if (!gameEnd) {
        viewTimer = setTimeout(update, 50);
    }
}

function drawMap() {
    console.log(map[0][0]);
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            let color = "white";
            switch (map[y][x]) {
                case fruitTile:
                    color = "yellow";
                    break;
                case snakeTile:
                    color = "green";
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
    let width = window.innerWidth;
    let height = window.innerHeight;
    let tileSize = Math.min(window / mapWidth, height / mapHeight);

    document.getElementById("field").style.width = 100;
    document.getElementById("field").style.width = 100;
}

function generateTiles() {
    for (let rowId = 0; rowId < map.length; rowId++) {
        let rowContainer = document.createElement("div");
        rowContainer.className = "rowContainer";
        rowContainer.id = "rowContainer" + rowId.toString();
        document.getElementById("field").appendChild(rowContainer);

        let row = document.createElement("div");
        row.className = "row";
        row.id = "row" + rowId.toString();
        rowContainer.appendChild(row);
        for(let columnId = 0; columnId < map[rowId].length; columnId++) {
            let tile = document.createElement("div");
            tile.className = "tile";
            tile.id = "tile_" + rowId.toString() + "_" + columnId.toString();
            row.appendChild(tile);
        }
    }
}

document.addEventListener("DOMContentLoaded", main);