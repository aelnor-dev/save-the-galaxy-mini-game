class Game {
  constructor() {
    this.container = document.getElementById("game-container");
    this.character = null;
    this.coins = [];
    this.score = 0;
    this.aliens = [];
    this.scoreElement = document.getElementById("score");
    this.createScene();
    this.addEvent();
    this.alienGenerator();
    this.over = false;
    this.keysPressed = new Set();
    this.startTime = Date.now;
    this.timerElement = document.getElementById("timer");
    this.timeInterval = null;
    this.timer();
  }
  createScene() {
    this.character = new Character();
    this.container.appendChild(this.character.element);
    for (let i = 0; i < 12; i++) {
      const coin = new Coin();
      this.coins.push(coin);
      this.container.appendChild(coin.element);
    }
  }
  addEvent() {
    window.addEventListener("keydown", (e) => this.processKeyDown(e));
    window.addEventListener("keyup", (e) => this.processKeyUp(e));
    this.checkMovements();
    this.checkCollisions();
  }

  processKeyDown(event) {
    console.log("keydown");
    const allowedKeys = ["ArrowRight", "ArrowLeft", "ArrowUp"];
    if (allowedKeys.includes(event.key)) {
      this.keysPressed.add(event.key);
    }
  }

  processKeyUp(event) {
    if (this.keysPressed.has(event.key)) {
      this.keysPressed.delete(event.key);
    }
  }

  checkMovements() {
    setInterval(() => {
      this.character.moves(this.keysPressed);
    }, 100);
  }

  checkCollisions() {
    setInterval(() => {
      this.coins.forEach((coin, index) => {
        if (this.character.collidesWith(coin)) {
          if (this.container.contains(coin.element)) {
            coinSound.currentTime = 0;
            coinSound.play();
            this.container.removeChild(coin.element);
            this.coins.splice(index, 1);
            this.updateScore(1);
          }
        }
      });

      this.aliens.forEach((alien) => {
        if (this.character.collidesWith(alien)) {
          this.gameOver();
        }
      });
    }, 100);
  }

  timer() {
    this.startTime = Date.now(); 
    this.timeInterval = setInterval(() => {
      let elapsedTime = (Date.now() - this.startTime) / 1000; 
      this.timerElement.textContent = `Tiempo transcurrido:  ${Math.floor(elapsedTime)} segundos`; // Fix formatting
    }, 10); // Update every 10ms
  }

  updateScore(score) {
    this.score += score;
    this.scoreElement.textContent = `Estrellas recolectadas: ${this.score}/12`;
    if (this.score === 12) {
      this.win();
    }
  }

  alienGenerator() {
    setInterval(() => {
      if (this.aliens.length < 3) {
        this.spawnAlien();
      }
    }, 500);
  }

  spawnAlien() {
    const side = Math.random() < 0.5 ? "left" : "right";

    let alien;
    const type = Math.random();
    if (type < 0.5) {
      alien = new CrawlingAlien(side);
    } else {
      alien = new FlyingAlien(side);
    }

    this.aliens.push(alien);
    this.container.appendChild(alien.element);

    const moveInterval = setInterval(() => {
      if (!alien.offScreen()) {
        alien.moves();
      } else {
        clearInterval(moveInterval);
        if (this.container.contains(alien.element)) {
          this.container.removeChild(alien.element);
        }
        this.aliens = this.aliens.filter((a) => a !== alien);
      }
    }, 20);
  }

  win() {
    if (!this.over) {
      this.over = true;
      let endTime = Date.now ()
      let elapsedTime = (endTime - this.startTime) / 1000;
      clearInterval(this.timeInterval);
      setTimeout(() => {
        alert(`¡Victoria! Has limpiado este planeta en ${Math.floor(elapsedTime)} segundos.`);
        this.container.innerHTML = "";
        new Game();
      }, 100);
    }
  }

  gameOver() {
    if (!this.over) {
      this.over = true;
      loseSound.currentTime = 0;
      loseSound.play();
      setTimeout(() => {
        alert("¡Que no te pillen los aliens!");
        this.container.innerHTML = "";
        clearInterval(this.timeInterval);
        new Game();
      }, 100);
    }
  }
}

class Character {
  constructor() {
    this.x = 250;
    this.y = 215;
    this.width = 60; //no coinciden tamaños con el CSS porque sino chocaba con el espacio de la imagen
    this.height = 60;
    this.speed = 10;
    this.jumping = false;
    this.element = document.createElement("div");
    this.element.classList.add("character");
    this.facingRight = true;
    this.updatePosition();
    this.canJumpInTheAir = true;
    this.jumpInterval = null;
    this.gravityInterval = null;
    this.falling = false;
  }

  moves(keysPressed) {
    const container = document.getElementById("game-container");
    const containerWidth = container.offsetWidth;

    console.log("keys pressed", keysPressed);
    for (const key of keysPressed.values()) {
      if (key === "ArrowRight") {
        if (this.x + this.width + this.speed <= containerWidth) {
          // Límite dcha
          this.x += this.speed;
          this.facingRight = true;
        }
      } else if (key === "ArrowLeft") {
        if (this.x - this.speed >= 0) {
          // Límite izq
          this.x -= this.speed;
          this.facingRight = false;
        }
      } else if (key === "ArrowUp") {
        this.jumps();
      }
    }

    this.updatePosition();
  }

  jumps() {
    if (!this.jumping && (this.canJumpInTheAir || !this.falls)) {
      if (this.falling) {
        this.canJumpInTheAir = false; // Ya usó el salto en el aire
        clearInterval(this.gravityInterval); // Interrumpe la caída
        this.gravityInterval = null;
        this.falling = false;
      }
      jumpSound.currentTime = 0;
      jumpSound.play();
      this.jumping = true;
      let maxHeight = this.y - 100;

      this.jumpInterval = setInterval(() => {
        if (this.y > maxHeight) {
          this.y -= 10;
        } else {
          clearInterval(this.jumpInterval);
          this.jumpInterval = null;
          this.jumping = false;
          this.falls();
        }
        this.updatePosition();
      }, 20);
    }
  }

  falls() {
    this.falling = true;
    this.gravityInterval = setInterval(() => {
      if (this.y < 215) {
        this.y += 10;
      } else {
        clearInterval(this.gravityInterval);
        this.gravityInterval = null;
        this.falling = false;
        this.canJumpInTheAir = true;
        this.y = 215;
        this.updatePosition();
        return;
      }
      this.updatePosition();
    }, 20);
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.transform = this.facingRight
      ? "scaleX(1)"
      : "scaleX(-1)";
  }

  collidesWith(object) {
    return (
      this.x < object.x + object.width &&
      this.x + this.width > object.x &&
      this.y < object.y + object.height &&
      this.y + this.height > object.y
    );
  }
}

class Coin {
  constructor() {
    this.x = Math.random() * 500 + 50;
    this.y = Math.random() * 200 + 50;
    this.width = 50;
    this.height = 50;
    this.element = document.createElement("div");
    this.element.classList.add("coin");
    this.updatePosition();
  }
  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}

class Alien {
  constructor(side) {
    this.width = 10;
    this.height = 10;
    this.speed = Math.random() * 2 + 1;
    this.side = side; // "left" o "right"
    this.element = document.createElement("div");
    this.element.classList.add("alien");

    if (side === "left") {
      this.x = -this.width; // Comienza fuera de la pantalla por la izquierda
      this.dx = this.speed; // Mover hacia la derecha
    } else {
      this.x = 900; // Comienza fuera de la pantalla por la derecha
      this.dx = -this.speed; // Mover hacia la izquierda
    }
    this.y = 0;
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  moves() {
    this.x += this.dx;
    this.updatePosition();
  }

  offScreen() {
    return this.side === "left" ? this.x > 1000 : this.x + this.width < 0;
  }
}

class CrawlingAlien extends Alien {
  constructor(side) {
    super(side); //Solo necesita side como parámetro, las demas propiedades ya están cogidas del padre
    this.element.classList.add("crawling-alien");
    this.y = 250;
    this.updatePosition();
  }
}

class FlyingAlien extends Alien {
  constructor(side) {
    super(side);
    this.element.classList.add("flying-alien");
    this.y = 90;
    this.updatePosition();
  }
}

window.showGame = showGame;
function showGame() {
  document.getElementById("showGame");
  document.getElementById("description").style.display = "none";
  document.getElementById("game").style.display = "flex";
  new Game();
}

const bgMusic = new Audio("background-music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.1;
bgMusic.play();
const coinSound = new Audio("coin-sound.mp3");
coinSound.volume = 0.5;
const jumpSound = new Audio("jump-sound.mp3");
jumpSound.volume = 0.5;
const loseSound = new Audio("lose-sound.mp3");
loseSound.volume = 0.5;

