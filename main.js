class Game {
  constructor() {
    this.container = document.getElementById("game-container");
    this.character = null;
    this.coins = [];
    this.score = 0;
    this.aliens = []
    this.scoreElement = document.getElementById("score");
    this.createScene();
    this.addEvent();
  }
  createScene() {
    this.character = new Character();
    this.container.appendChild(this.character.element);
    for (let i = 0; i < 5; i++) {
      const coin = new Coin();
      this.coins.push(coin);
      this.container.appendChild(coin.element);
    }
  }
  addEvent() {
    window.addEventListener("keydown", (e) => this.character.moves(e));
    this.checkCollisions();
  }
  checkCollisions() {
    setInterval(() => {
      this.coins.forEach((coin, index) => {
        if (this.character.collidesWith(coin)) {
          coinSound.currentTime = 0; // Restart sound if played multiple times quickly
          coinSound.play();
          this.container.removeChild(coin.element);
          this.coins.splice(index, 1);

          this.updateScore(1);
        }
      });
    },{
      this.aliens.forEach((alien, index) => )
    }, 100);
  }

  updateScore(score) {
    this.score += score;
    this.scoreElement.textContent = `Collected stars: ${this.score}/5`;
}
}

class Character {
  constructor() {
    this.x = 50;
    this.y = 215;
    this.width = 90;
    this.height = 90;
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

  moves(event) {
    if (event.key === "ArrowRight") {
      this.x += this.speed;
      this.facingRight = true; 
    } else if (event.key === "ArrowLeft") {
      this.x -= this.speed;
      this.facingRight = false;
    } else if (event.key === "ArrowUp") {
      this.jumps();
    }
    this.updatePosition();
  }

  jumps() {
    if (!this.jumping && (this.canJumpInTheAir || !this.falls)) {
      if (this.falling) {
          this.canJumpInTheAir = false;  // Ya usó el salto en el aire
          clearInterval(this.gravityInterval); // Interrumpe la caida
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
            this.canJumpInTheAir = true; // Resetea el flag al tocar el suelo
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
    this.element.style.transform = this.facingRight ? "scaleX(1)" : "scaleX(-1)";
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
  constructor() {
    this.x = Math.random() * 500 + 50;
    this.y = Math.random() * 200 + 50;
    this.width = 50;
    this.height = 50;
    this.element = document.createElement("div");
    this.element.classList.add("alien");
    this.updatePosition();
  }
  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}

const bgMusic = new Audio("background-music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.1; // Adjust volume (0.0 - 1.0)
bgMusic.play();
const coinSound = new Audio("coin-sound.mp3");
coinSound.volume = 0.5
const jumpSound = new Audio("jump-sound.mp3")
jumpSound.volume = 0.5

const gaming = new Game();
