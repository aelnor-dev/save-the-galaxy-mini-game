class Game {
  constructor() {
    this.container = document.getElementById("game-container");
    this.character = null;
    this.coins = [];
    this.score = 0;
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
    // método predefinido de Js
    setInterval(() => {
      this.coins.forEach((coin, index) => {
        if (this.character.collidesWith(coin)) {
          this.container.removeChild(coin.element);
          this.coins.splice(index, 1);
        }
      });
    }, 100);
  }
}

class Character {
  constructor() {
    this.x = 50;
    this.y = 300;
    this.width = 50;
    this.height = 50;
    this.speed = 10;
    this.jumping = false;
    this.element = document.createElement("div");
    this.element.classList.add("character");
    this.updatePosition();
  }
  moves(event) {
    if (event.key === "ArrowRight") {
      this.x += this.speed;
    } else if (event.key === "ArrowLeft") {
      this.x -= this.speed;
    } else if (event.key === "ArrowUp") {
      this.jumps();
    }
    this.updatePosition();
  }

  jumps() {
    this.jumping = true;
    let heightMax = this.y - 100;
    //cada 20 milisegundos:
    const jump = setInterval(() => {
      if (this.y > heightMax) {
        this.y -= 10;
      } else {
        clearInterval(jump);
        this.falls();
      }
      this.updatePosition();
    }, 20);
  }

  falls() {
    const gravity = setInterval(() => {
      if (this.y < 300) {
        this.y += 10;
      } else {
        clearInterval(gravity);
      }
      this.updatePosition();
    }, 20);
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
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
    this.x = Math.random() * 700 + 50; //px de ancho son 800, ponemos menos (700)
    this.y = Math.random() * 250 + 50;
    this.width = 30;
    this.height = 30;
    this.element = document.createElement("div");
    this.element.classList.add("coin");
    this.updatePosition();
  }
  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}

const gaming = new Game();
