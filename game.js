const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Ethereum Configuration (Update with your contract address and ABI)
const contractAddress = "YOUR_CONTRACT_ADDRESS";
const contractAbi = // Add your contract ABI here...
[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "GamePlayed",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "play",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "priceToPlay",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const provider = new ethers.providers.Web3Provider(web3.currentProvider);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, contractAbi, signer);

// Game Logic (Pong)
// Implement your Pong game logic here...



// Paddle dimensions and initial positions
const paddleWidth = 10;
const paddleHeight = 60;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

// Ball dimensions and initial position
const ballSize = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

// Paddle movement speed
const paddleSpeed = 8;

// Player and opponent scores
let playerScore = 0;
let opponentScore = 0;

// Function to draw the paddle
function drawPaddle(x, y, width, height) {
    ctx.fillStyle = "#FFF";
    ctx.fillRect(x, y, width, height);
}

// Function to draw the ball
function drawBall(x, y, size) {
    ctx.fillStyle = "#FFF";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

// Function to draw the scores
function drawScores() {
    ctx.fillStyle = "#FFF";
    ctx.font = "20px Arial";
    ctx.fillText(`Player: ${playerScore}`, canvas.width / 4, 30);
    ctx.fillText(`Opponent: ${opponentScore}`, (3 * canvas.width) / 4 - 100, 30);
}

// Function to move the paddle
function movePaddle(direction, y) {
    if (direction === "up" && y > 0) {
        return y - paddleSpeed;
    } else if (direction === "down" && y < canvas.height - paddleHeight) {
        return y + paddleSpeed;
    }
    return y;
}

// Function to reset the ball position
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5;
    ballSpeedY = 5;
}

// Function to handle collisions and game logic
function update() {
    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collisions with walls
    if (ballY - ballSize / 2 < 0 || ballY + ballSize / 2 > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collisions with paddles
    if (
        (ballX - ballSize / 2 < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) ||
        (ballX + ballSize / 2 > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight)
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Scoring points
    if (ballX - ballSize / 2 < 0) {
        opponentScore++;
        resetBall();
    } else if (ballX + ballSize / 2 > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Move the right paddle to follow the ball
    if (rightPaddleY + paddleHeight / 2 < ballY) {
        rightPaddleY += 5;
    } else {
        rightPaddleY -= 5;
    }
}

// Function to draw everything on the canvas
function draw() {
    // Clear the canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    drawPaddle(0, leftPaddleY, paddleWidth, paddleHeight);
    drawPaddle(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    // Draw ball
    drawBall(ballX, ballY, ballSize);

    // Draw scores
    drawScores();
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Event listeners for paddle movement
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        leftPaddleY = movePaddle("up", leftPaddleY);
    } else if (event.key === "ArrowDown") {
        leftPaddleY = movePaddle("down", leftPaddleY);
    }
});

// Start the game loop
gameLoop();















// Ethereum Payment Logic
async function payToPlay() {
    try {
        const priceInWei = ethers.utils.parseEther("0.25");
        const transaction = await contract.play({ value: priceInWei });
        console.log("Transaction Hash:", transaction.hash);
        // Implement game start logic here...
    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Event listener for Metamask wallet connection
window.addEventListener("load", async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.enable();
            console.log("Metamask is connected.");
        } catch (error) {
            console.error("Metamask connection error:", error.message);
        }
    } else {
        console.error("Metamask not detected.");
    }
});
