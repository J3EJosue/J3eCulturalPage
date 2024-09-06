// Array de URLs de imágenes para las cartas (reemplaza con tus propias imágenes)
const imageUrls = [
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    // ... añade más URLs según sea necesario
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let timer;
let seconds = 0;
let currentLevel = 1;
let highScores = JSON.parse(localStorage.getItem('memoryGameHighScores')) || [];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCard(imageUrl, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.innerHTML = `
<div class="card-front">
    <img src="https://cdn-icons-png.flaticon.com/512/12359/12359565.png" alt="Card image" class="w-full h-auto border-4 border-white rounded-lg">
</div>

        <div class="card-back">
            <img src="${imageUrl}" alt="Card image">
        </div>
    `;
    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            attempts++;
            document.getElementById('attempts').textContent = attempts;
            setTimeout(checkMatch, 500);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const image1 = card1.querySelector('.card-back img').src;
    const image2 = card2.querySelector('.card-back img').src;

    if (image1 === image2) {
        matchedPairs++;
        if (matchedPairs === cards.length / 2) {
            clearInterval(timer);
            setTimeout(showWinnerModal, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 500);
    }
    flippedCards = [];
}

function initGame() {
    const numberOfPairs = 4 + currentLevel * 2;
    const gameImages = imageUrls.slice(0, numberOfPairs);
    cards = [...gameImages, ...gameImages];
    shuffleArray(cards);
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(cards.length))}, 1fr)`;
    for (let i = 0; i < cards.length; i++) {
        gameBoard.appendChild(createCard(cards[i], i));
    }
    resetGame();
}

function resetGame() {
    matchedPairs = 0;
    attempts = 0;
    seconds = 0;
    document.getElementById('attempts').textContent = attempts;
    document.getElementById('timer').textContent = '00:00';
    document.getElementById('current-level').textContent = currentLevel;
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    seconds++;
    document.getElementById('timer').textContent = formatTime(seconds);
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function restartGame() {
    currentLevel = 1;
    const gameBoard = document.getElementById('game-board');
    gameBoard.classList.add('shuffling');
    setTimeout(() => {
        initGame();
        gameBoard.classList.remove('shuffling');
    }, 500);
}

function nextLevel() {
    currentLevel++;
    const gameBoard = document.getElementById('game-board');
    gameBoard.classList.add('shuffling');
    setTimeout(() => {
        initGame();
        gameBoard.classList.remove('shuffling');
    }, 500);
}

function showWinnerModal() {
    const modal = document.getElementById('winner-modal');
    const message = document.getElementById('winner-message');
    const playerScore = document.getElementById('player-score');
    const playerRank = document.getElementById('player-rank');
    const score = calculateScore();
    
    message.textContent = `¡Has completado el nivel ${currentLevel} en ${attempts} intentos y ${formatTime(seconds)}!`;
    playerScore.textContent = `Tu puntuación: ${score} puntos`;
    
    const rank = getPlayerRank(score);
    playerRank.textContent = `Tu posición: ${rank}`;
    
    modal.style.display = 'block';
    updatePodium();
    createFireworks();

    if (currentLevel < 5) {
        document.getElementById('next-level-btn').style.display = 'block';
    } else {
        document.getElementById('next-level-btn').style.display = 'none';
    }
}

function createFireworks() {
    const fireworksContainer = document.querySelector('.modal-content');
    for (let i = 0; i < 50; i++) {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        firework.style.left = `${Math.random() * 100}%`;
        firework.style.top = `${Math.random() * 100}%`;
        firework.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        firework.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
        firework.style.setProperty('--ty', `${(Math.random() - 0.5) * 200}px`);
        fireworksContainer.appendChild(firework);
    }
}

function updatePodium() {
    highScores.sort((a, b) => b.score - a.score);
    for (let i = 0; i < 3; i++) {
        if (highScores[i]) {
            document.getElementById(`${getOrdinal(i+1)}-place-name`).textContent = highScores[i].name;
            document.getElementById(`${getOrdinal(i+1)}-place-score`).textContent = `${highScores[i].score} pts`;
        }
    }
}

function getOrdinal(n) {
    return ["first", "second", "third"][n - 1];
}

function saveScore() {
    const playerName = document.getElementById('player-name-input').value.trim();
    if (playerName) {
        const score = calculateScore();
        highScores.push({ name: playerName, score: score, level: currentLevel });
        highScores.sort((a, b) => b.score - a.score);
        highScores = highScores.slice(0, 5);
        localStorage.setItem('memoryGameHighScores', JSON.stringify(highScores));
        updatePodium();
        document.getElementById('winner-modal').style.display = 'none';
    } else {
        alert('Por favor, ingresa tu nombre antes de guardar la puntuación.');
    }
}

function calculateScore() {
    return Math.round((1000 * currentLevel) / (attempts + seconds / 10));
}

function getPlayerRank(score) {
    const allScores = [...highScores.map(hs => hs.score), score];
    allScores.sort((a, b) => b - a);
    const rank = allScores.indexOf(score) + 1;
    return rank;
}

document.getElementById('restart-btn').addEventListener('click', restartGame);
document.getElementById('next-level-btn').addEventListener('click', () => {
    nextLevel();
    document.getElementById('winner-modal').style.display = 'none';
});
document.getElementById('save-score-btn').addEventListener('click', saveScore);

initGame();