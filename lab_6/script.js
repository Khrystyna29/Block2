    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const heartImage = new Image();
    heartImage.src = "heart.png"; // Шлях до зображення серця

    const player = {
        x: canvas.width / 2,
        y: canvas.height - 60,
        width: 60,
        height: 60,
        speed: 5
    };


    let currentGame = 1; // Номер поточної гри
    let gameScores = JSON.parse(localStorage.getItem('gameScores')) || []; // Масив для збереження рахунків кожної гри

    // Малюємо векторний корабель на canvas
    function drawPlayer() {
        // Очищаємо попередній малюнок корабля
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Малюємо корабель з новими координатами
        ctx.fillStyle = "gray";
        ctx.beginPath();
        ctx.moveTo(player.x + 30, player.y + 60);
        ctx.lineTo(player.x + 70, player.y + 60);
        ctx.lineTo(player.x + 50, player.y + 20);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(player.x + 35, player.y + 50);
        ctx.lineTo(player.x + 65, player.y + 50);
        ctx.lineTo(player.x + 50, player.y + 30);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(player.x + 45, player.y + 45, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(player.x + 55, player.y + 45, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Отримуємо клавіші руху корабля
    function movePlayer(e) {
        if (e.key === "ArrowLeft" && player.x > 0) {
            player.x -= player.speed;
        } else if (e.key === "ArrowRight" && player.x < canvas.width - player.width) {
            player.x += player.speed;
        }
    }

    document.addEventListener("keydown", movePlayer);

    const alienImage = new Image();
    alienImage.src = "alien.png"; // Шлях до зображення інопланетянина

    let aliens = [];
    const alienWidth = 20;
    const alienHeight = 20;
    const alienSpeed = 2;

    const meteorsImage = new Image();
    meteorsImage.src = "meteor.png";

    let meteors = [];
    const meteorWidth = 20;
    const meteorHeight = 20;
    const meteorSpeed = 3;

    let score = 0;
    let lives = 3;

    let topScores = [];
    let bottomScores = [];

    // Генерація інопланетян
    function generateAlien() {
        const alien = {
            x: Math.random() * (canvas.width - alienWidth),
            y: 0,
            width: alienWidth,
            height: alienHeight
        };
        aliens.push(alien);
    }

    function drawAliens() {
        aliens.forEach((alien) => {
            ctx.drawImage(alienImage, alien.x, alien.y, alien.width, alien.height);
        });
    }

    // Генерація метеоритів
    function generateMeteor() {
        const meteor = {
            x: Math.random() * (canvas.width - meteorWidth),
            y: 0,
            width: meteorWidth,
            height: meteorHeight
        };
        meteors.push(meteor);
    }

    function drawMeteors() {
        meteors.forEach((meteor) => {
            ctx.drawImage(meteorsImage, meteor.x, meteor.y, meteor.width, meteor.height);
        });
    }

    // Основний цикл гри
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawAliens();
        drawMeteors();
        updateAliens();
        updateMeteors();
        checkCollisions();
        drawScore();
        drawLives();
        updateScoreboard();

        if (lives <= 0) {
            endGame();
        } else {
            requestAnimationFrame(draw);
        }
    }

    function updateAliens() {
        aliens.forEach(alien => {
            alien.y += alienSpeed;
        });
    }

    function updateMeteors() {
        meteors.forEach((meteor) => {
            meteor.y += meteorSpeed;
        });
    }

    function checkCollisions() {
        aliens.forEach((alien, alienIndex) => {
            if (isCollision(alien, player)) {
                score += 10;
                aliens.splice(alienIndex, 1);
            }
        });

        meteors.forEach((meteor, meteorIndex) => {
            if (isCollision(meteor, player)) {
                lives--; // Зменшуємо кількість життів
                meteors.splice(meteorIndex, 1);
            }
        });
    }

    function isCollision(object1, object2) {
        return object1.x < object2.x + object2.width &&
            object1.x + object1.width > object2.x &&
            object1.y < object2.y + object2.height &&
            object1.y + object1.height > object2.y;
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Score: " + score, 8, 20);
    }

    function drawLives() {
        const heartSize = 20;
        const padding = 10;
        for (let i = 0; i < lives; i++) {
            ctx.drawImage(heartImage, canvas.width - (i + 1) * (heartSize + padding), padding, heartSize, heartSize);
        }
    }


    document.addEventListener("keydown", movePlayer);

    setInterval(generateAlien, 1000);
    setInterval(generateMeteor, 1500);

    requestAnimationFrame(draw);

    function endGame() {
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = "30px Arial";
            ctx.fillStyle = "#FF0000";
            ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
            updateScoreboard(); // Оновлюємо топ-результати
            const playAgainButton = document.getElementById("playAgainButton");
            playAgainButton.style.display = "block";
            document.getElementById("stopButton").style.display = "none"; // Приховуємо кнопку "Зупинити гру"
            currentGame++;
            gameScores.push(score);
            localStorage.setItem('gameScores', JSON.stringify(gameScores)); // Збереження результатів у локальне сховище
            score = 0;
            lives = 3;
        }, 1000); // Затримка в 1 секунду перед виведенням повідомлення про кінець гри
    }

    function startNewGame() {
        // Скидуємо значення для початку нової гри
        currentGame++;
        gameScores.push(score);
        localStorage.setItem('gameScores', JSON.stringify(gameScores)); // Збереження результатів у локальне сховище
        updateScoreboard(); // Оновлюємо топ-результати
        score = 0;
        lives = 3;
        aliens = [];
        meteors = [];
        // Починаємо нову гру
        requestAnimationFrame(draw);
    }
    function drawScore() {
        const scoreElement = document.getElementById("scoreText");
        scoreElement.textContent = "Score: " + score;
    }

    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            startNewGame();
        }
    });

    function updateScoreboard() {
        gameScores.sort((a, b) => b - a); // Сортуємо рахунки за спаданням
        const topScoresList = document.getElementById("topScores");
        topScoresList.innerHTML = "";
        for (let i = 0; i < 3 && i < gameScores.length; i++) {
            const listItem = document.createElement("li");
            listItem.textContent = "Game " + currentGame + ", Score " + (i + 1) + ": " + gameScores[i];
            topScoresList.appendChild(listItem);
        }

        const bottomScoresList = document.getElementById("bottomScores");
        bottomScoresList.innerHTML = "";
        for (let i = gameScores.length - 3; i < gameScores.length; i++) {
            if (i >= 0) {
                const listItem = document.createElement("li");
                listItem.textContent = "Game " + currentGame + ", Score " + (gameScores.length - i) + ": " + gameScores[i];
                bottomScoresList.appendChild(listItem);
            }
        }
    }
