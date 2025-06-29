 // Snake game logic
document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('gameCanvas');
    let ctx;
    if (canvas) {
        ctx = canvas.getContext('2d');
    } else {
        console.error("Canvas element not found.");
        return;
    }

    if (!ctx) {
        console.error("Failed to get canvas context.");
        return;
    }

    // Game variables
    let snake;
    let food;

    class Snake {
        constructor() {
            this.body = [{ x: 100, y: 100 }];
            this.direction = 'Right';
            this.size = 20;
            this.growing = false;
        }

        changeDirection(newDirection) {
            const oppositeDirections = {
                'Up': 'Down',
                'Down': 'Up',
                'Left': 'Right',
                'Right': 'Left'
            };

            if (oppositeDirections[this.direction] !== newDirection) {
                this.direction = newDirection;
            }
        }

        update() {
            const head = { ...this.body[0] };

            switch(this.direction) {
                case 'Up':
                    head.y -= this.size;
                    break;
                case 'Down':
                    head.y += this.size;
                    break;
                case 'Left':
                    head.x -= this.size;
                    break;
                case 'Right':
                    head.x += this.size;
                    break;
            }

            if (this.growing) {
                this.body.unshift(head);
                this.growing = false;
            } else {
                this.body.unshift(head);
                this.body.pop();
            }
        }

        draw(ctx) {
            ctx.fillStyle = 'green';
            this.body.forEach(segment => {
                ctx.fillRect(segment.x, segment.y, this.size, this.size);
            });
        }

        eat(food) {
            const head = this.body[0];
            return head.x === food.x && head.y === food.y;
        }

        checkCollision() {
            const head = this.body[0];

            // Check collision with walls
            if (head.x < 0 || head.x >= canvas.width ||
                head.y < 0 || head.y >= canvas.height) {
                return true;
            }

            // Check collision with self
            for (let i = 1; i < this.body.length; i++) {
                if (this.body[i].x === head.x && this.body[i].y === head.y) {
                    return true;
                }
            }

            return false;
        }

        reset() {
            this.body = [{ x: 100, y: 100 }];
            this.direction = 'Right';
        }
    }

    class Food {
        constructor(canvas) {
            this.size = 20;
            this.canvas = canvas;
            this.positionFood();
        }

        positionFood() {
            this.x = Math.floor(Math.random() * (this.canvas.width / this.size)) * this.size;
            this.y = Math.floor(Math.random() * (this.canvas.height / this.size)) * this.size;
        }

        draw(ctx) {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    // Initialize game
    snake = new Snake();
    food = new Food(canvas);

    // Handle keyboard input
    window.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
                snake.changeDirection('Up');
                break;
            case 'ArrowDown':
                snake.changeDirection('Down');
                break;
            case 'ArrowLeft':
                snake.changeDirection('Left');
                break;
            case 'ArrowRight':
                snake.changeDirection('Right');
                break;
        }
    });

    // Game loop
    setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        food.draw(ctx);
        snake.update();

        if (snake.eat(food)) {
            snake.growing = true;
            food.positionFood();
        }

        snake.draw(ctx);

        // Check for collision with walls or self
        if (snake.checkCollision()) {
            alert('Game Over');
            snake.reset();
            food.positionFood();
        }
    }, 250);
});
