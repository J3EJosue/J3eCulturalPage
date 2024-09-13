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

const funFacts = {
    '/img/1.jpg': "¿Sabías que Tecún Umán fue el último líder maya-quiché en resistir la conquista española? ¡Dicen que luchó hasta el final contra Pedro de Alvarado, y su espíritu sigue inspirando a Guatemala hasta hoy!",
    '/img/2.jpg': "¡El Gran Jaguar de Tikal es uno de los templos más impresionantes del mundo maya! Con 44 metros de altura, parece que vigila la selva como un verdadero guardián. ¿Te imaginas lo que sería vivir en esa época?",
    '/img/3.jpg': "El Arco de Santa Catalina no solo es un ícono de Antigua Guatemala, ¡también tiene un toque misterioso! Este arco servía para que las monjas cruzaran sin ser vistas. ¡Imagina lo que debe haber pasado bajo ese arco hace siglos!",
    '/img/4.jpg': "El Palacio Nacional de la Cultura es una joya arquitectónica. ¡Cuidado, en sus pasillos podrían esconderse secretos históricos!",
    '/img/5.jpg': "¡Nada como un buen tamal guatemalteco para celebrar! Esta delicia tiene más de 500 años de historia, y si lo comes en Nochebuena, se dice que trae buena suerte para el próximo año. ¡No lo dejes pasar!",
    '/img/6.jpg': "¿Postre o comida? Los rellenitos de plátano con frijol son lo mejor de ambos mundos. Aunque suene raro, ¡una vez que los pruebas no puedes parar de comerlos!",
    '/img/7.jpg': "El pepián es un platillo con tanta historia como sabor. ¡Cada cucharada es una mezcla de culturas! Se dice que hay tantas recetas de pepián como familias en Guatemala, cada una con su toque secreto.",
    '/img/8.jpg': "El quetzal, ave nacional de Guatemala, es un símbolo de libertad. ¡Su plumaje verde y rojo es tan increíble que parece salido de un cuento! En tiempos antiguos, se creía que si lo capturabas, perdía su brillo.",
    '/img/9.jpg': "La Monja Blanca es la flor más elegante de Guatemala. Tan rara y delicada que fue declarada flor nacional en 1934. ¡Y ojo, es una orquídea que solo crece en tierras guatemaltecas!"
};


let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let timer;
let seconds = 0;
let currentLevel = 1;
const maxLevel = 2;
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
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    const frontImg = document.createElement('img');
    frontImg.src = "https://cdn-icons-png.flaticon.com/512/12359/12359565.png";
    frontImg.alt = "Card front";
    cardFront.appendChild(frontImg);
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    const backImg = document.createElement('img');
    backImg.src = imageUrl;
    backImg.alt = "Card back";
    cardBack.appendChild(backImg);
    
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    
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

function showFunFact(fact) {
    const factBox = document.createElement('div');
    factBox.className = 'fun-fact-box';
    factBox.textContent = fact;
    document.body.appendChild(factBox);
    
    setTimeout(() => {
        factBox.classList.add('show');
    }, 50);

    setTimeout(() => {
        factBox.classList.remove('show');
        setTimeout(() => {
            factBox.remove();
        }, 500);
    }, 7000);
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const image1 = card1.querySelector('.card-back img').src;
    const image2 = card2.querySelector('.card-back img').src;

    if (image1 === image2) {
        matchedPairs++;
        const funFact = funFacts[new URL(image1).pathname] || "¡Interesante coincidencia!";
        showFunFact(funFact);
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

function initGame(level) {
    currentLevel = level;
    const numberOfPairs = level === 1 ? 6 : 8; // 6 pares para nivel 1, 8 para nivel 2
    const gameImages = imageUrls.slice(0, numberOfPairs);
    cards = [...gameImages, ...gameImages];
    shuffleArray(cards);
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    const columns = Math.min(6, Math.ceil(Math.sqrt(cards.length)));
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    for (let i = 0; i < cards.length; i++) {
        gameBoard.appendChild(createCard(cards[i], i));
    }
    resetGame();
    updateLevelSelector();
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

function updateLevelSelector() {
    const levelSelector = document.getElementById('level-selector');
    levelSelector.innerHTML = '';
    for (let i = 1; i <= maxLevel; i++) {
        const button = document.createElement('button');
        button.textContent = `Nivel ${i}`;
        button.addEventListener('click', () => initGame(i));
        if (i === currentLevel) {
            button.classList.add('active');
        }
        levelSelector.appendChild(button);
    }
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

    if (currentLevel < maxLevel) {
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

document.getElementById('restart-btn').addEventListener('click', () => initGame(currentLevel));
document.getElementById('next-level-btn').addEventListener('click', () => {
    if (currentLevel < maxLevel) {
        currentLevel++;
        initGame(currentLevel);
    }
    document.getElementById('winner-modal').style.display = 'none';
});
document.getElementById('save-score-btn').addEventListener('click', saveScore);

// Añadir event listener para manejar cambios en el tamaño de la ventana
window.addEventListener('resize', () => {
    const gameBoard = document.getElementById('game-board');
    const columns = Math.min(6, Math.ceil(Math.sqrt(cards.length)));
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
});

// Inicializa el juego con el nivel 1
initGame(1);