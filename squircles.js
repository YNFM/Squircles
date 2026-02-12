/**
 * Squircles - A Mouse Training Game
 * Refactored Class-Based Implementation
 */

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.particles = [];
        this.level = 1;
        this.score = 0;
        this.isPlaying = false;

        // Audio Context (initialized on first interaction)
        this.audioCtx = null;

        // Level State
        this.currentLevel = null;

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
        this.canvas.addEventListener('contextmenu', (e) => this.handleContextMenu(e));
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });

        // Start Loop
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);

        this.startLevel(1);
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playTone(freq, type, duration) {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
    }

    playSuccessSound() {
        this.initAudio();
        this.playTone(660, 'sine', 0.1);
        setTimeout(() => this.playTone(880, 'sine', 0.2), 100);
    }

    playClickSound() {
        this.initAudio();
        this.playTone(400, 'triangle', 0.1);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        if (this.currentLevel) this.currentLevel.resize(this.width, this.height);
    }

    spawnParticles(x, y, color) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                color: color || `hsl(${Math.random() * 360}, 70%, 50%)`
            });
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    }

    drawParticles() {
        this.particles.forEach(p => {
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
        });
    }

    startLevel(levelNum) {
        this.level = levelNum;
        switch (levelNum) {
            case 1: this.currentLevel = new LevelOne(this); break;
            case 2: this.currentLevel = new LevelTwo(this); break;
            case 3: this.currentLevel = new LevelThree(this); break;
            case 4: this.currentLevel = new LevelFour(this); break;
            case 5: this.currentLevel = new LevelFive(this); break;
            case 6: this.currentLevel = new LevelSix(this); break;
            case 7: this.currentLevel = new LevelSeven(this); break;
            case 8: this.currentLevel = new LevelEight(this); break;
            case 9: this.currentLevel = new LevelNine(this); break;
            // Add more levels here
            case 10: this.currentLevel = new LevelTen(this); break;
            case 11: this.currentLevel = new LevelEleven(this); break;
            case 12: this.currentLevel = new LevelTwelve(this); break;
            case 13: this.currentLevel = new LevelThirteen(this); break;
            case 14: this.currentLevel = new LevelFourteen(this); break;
            case 15: this.currentLevel = new LevelFifteen(this); break;
            default:
                this.level = 1;
                this.currentLevel = new LevelOne(this);
        }

        // Play instruction audio if available
        // Note: Browsers block autoplay, so this might need a user interaction trigger first time
        // or be triggered by the first click of the previous level.
    }

    nextLevel() {
        this.playSuccessSound();
        this.startLevel(this.level + 1);
    }

    handleClick(e) {
        this.initAudio(); // Ensure audio context is ready
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.spawnParticles(x, y);
        this.playClickSound();

        if (this.currentLevel) {
            this.currentLevel.handleClick(x, y);
        }
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (this.currentLevel && this.currentLevel.handleMouseMove) {
            this.currentLevel.handleMouseMove(x, y);
        }
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (this.currentLevel && this.currentLevel.handleMouseDown) {
            this.currentLevel.handleMouseDown(x, y);
        }
    }

    handleMouseUp(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (this.currentLevel && this.currentLevel.handleMouseUp) {
            this.currentLevel.handleMouseUp(x, y);
        }
    }

    handleDoubleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (this.currentLevel && this.currentLevel.handleDoubleClick) {
            this.currentLevel.handleDoubleClick(x, y);
        }
    }

    handleContextMenu(e) {
        e.preventDefault(); // Stop default menu
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (this.currentLevel && this.currentLevel.handleContextMenu) {
            this.currentLevel.handleContextMenu(x, y);
        }
    }

    handleWheel(e) {
        e.preventDefault(); // Stop page scroll
        if (this.currentLevel && this.currentLevel.handleWheel) {
            this.currentLevel.handleWheel(e.deltaY);
        }
    }

    loop() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.currentLevel) {
            this.currentLevel.update();
            this.currentLevel.draw(this.ctx);
        }

        this.updateParticles();
        this.drawParticles();

        // Draw Level Indicator
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.font = "20px Arial";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.ctx.fillText("Level: " + this.level, 10, 10);

        requestAnimationFrame(this.loop);
    }
}

// Base Level Class
class Level {
    constructor(game) {
        this.game = game;
        this.width = game.width;
        this.height = game.height;
    }
    resize(w, h) { this.width = w; this.height = h; }
    update() { }
    draw(ctx) { }
    handleClick(x, y) { }
    handleMouseDown(x, y) { }
    handleMouseUp(x, y) { }
    handleMouseMove(x, y) { }
    handleDoubleClick(x, y) { }
    handleContextMenu(x, y) { }
    handleWheel(deltaY) { }
}

class LevelOne extends Level {
    constructor(game) {
        super(game);
        this.message = "CLICK ANYWHERE";
        this.clicked = false;
        try { new Audio('assets/audio/expl01.m4a').play().catch(e => { }); } catch (e) { }
    }

    draw(ctx) {
        ctx.fillStyle = "#333";
        ctx.font = "bold 60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.message, this.width / 2, this.height / 2);

        ctx.font = "20px Arial";
        ctx.fillStyle = "#666";
        ctx.fillText("To start the game", this.width / 2, this.height / 2 + 50);
    }

    handleMouseMove(x, y) {
        // Trail effect for Level 1 to encourage movement
        if (Math.random() > 0.5) {
            this.game.spawnParticles(x, y, `rgba(100, 200, 255, 0.5)`);
        }
    }

    handleClick(x, y) {
        if (!this.clicked) {
            this.clicked = true;
            setTimeout(() => this.game.nextLevel(), 500);
        }
    }
}

class LevelTwo extends Level {
    constructor(game) {
        super(game);
        this.radius = 80;
        this.clicksRemaining = 5;
        this.spawnTarget();
        try { new Audio('assets/audio/expl02.m4a').play().catch(e => { }); } catch (e) { }
    }

    spawnTarget() {
        this.x = Math.random() * (this.width - 200) + 100;
        this.y = Math.random() * (this.height - 200) + 100;
    }

    draw(ctx) {
        // Draw Sphere
        const grad = ctx.createRadialGradient(this.x - 20, this.y - 20, 10, this.x, this.y, this.radius);
        grad.addColorStop(0, '#4facfe');
        grad.addColorStop(1, '#00f2fe');

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.clicksRemaining, this.x, this.y);

        ctx.fillStyle = "#333";
        ctx.font = "20px Arial";
        ctx.fillText("Click the Blue Circle", this.width / 2, 50);
    }

    resize(w, h) {
        super.resize(w, h);
    }

    handleClick(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        if (Math.sqrt(dx * dx + dy * dy) < this.radius) {
            this.clicksRemaining--;
            if (this.clicksRemaining <= 0) {
                this.game.nextLevel();
            } else {
                this.game.playSuccessSound();
                this.spawnTarget();
            }
        }
    }
}

class LevelThree extends Level {
    constructor(game) {
        super(game);
        this.radius = 80;
        this.x = this.width / 2;
        this.y = this.height / 2;
        this.vx = 1.5; // Slower start
        this.vy = 1.5;
        this.clicksNeeded = 5; // Reduced from 10
        this.clicksForScore = 0;
        try { new Audio('assets/audio/expl03.m4a').play().catch(e => { }); } catch (e) { }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce
        if (this.x + this.radius > this.width || this.x - this.radius < 0) this.vx *= -1;
        if (this.y + this.radius > this.height || this.y - this.radius < 0) this.vy *= -1;
    }

    draw(ctx) {
        // Draw Target
        const grad = ctx.createRadialGradient(this.x - 20, this.y - 20, 5, this.x, this.y, this.radius);
        grad.addColorStop(0, '#ff9a9e');
        grad.addColorStop(1, '#fecfef');

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Text
        ctx.fillStyle = "white";
        ctx.font = "bold 40px Arial";
        ctx.fillText(this.clicksNeeded - this.clicksForScore, this.x, this.y);

        ctx.fillStyle = "#333";
        ctx.font = "20px Arial";
        ctx.fillText("Catch me!", this.x, this.y + this.radius + 30);
    }

    handleClick(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        if (Math.sqrt(dx * dx + dy * dy) < this.radius) {
            this.clicksForScore++;
            this.vx *= 1.1; // Slower increase
            this.vy *= 1.1;
            this.radius *= 0.98;

            if (this.clicksForScore >= this.clicksNeeded) {
                this.game.nextLevel();
            }
        }
    }
}

// Level 4: Color Match
class LevelFour extends Level {
    constructor(game) {
        super(game);
        this.targets = [];
        this.colors = [
            { name: "RED", hex: "#ff6b6b" },
            { name: "BLUE", hex: "#48dbfb" },
            { name: "GREEN", hex: "#1dd1a1" },
            { name: "YELLOW", hex: "#feca57" }
        ];
        this.targetColor = this.colors[Math.floor(Math.random() * this.colors.length)];

        // Spawn targets
        for (let i = 0; i < 4; i++) {
            this.targets.push({
                x: (this.width / 5) * (i + 1),
                y: this.height / 2,
                radius: 60,
                color: this.colors[i]
            });
        }
    }

    draw(ctx) {
        // Instruction
        ctx.fillStyle = "#333";
        ctx.font = "bold 40px Arial";
        ctx.textAlign = "center";

        ctx.fillText(`Click the`, this.width / 2, 100);
        ctx.fillStyle = this.targetColor.hex;
        ctx.fillText(`${this.targetColor.name} ONE`, this.width / 2, 150);

        // Draw targets
        this.targets.forEach(t => {
            ctx.beginPath();
            ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
            ctx.fillStyle = t.color.hex;
            ctx.fill();
            ctx.lineWidth = 4;
            ctx.strokeStyle = "white";
            ctx.stroke();
        });
    }

    handleClick(x, y) {
        this.targets.forEach(t => {
            const dx = x - t.x;
            const dy = y - t.y;
            if (Math.sqrt(dx * dx + dy * dy) < t.radius) {
                if (t.color.name === this.targetColor.name) {
                    this.game.nextLevel();
                } else {
                    // Wrong choice
                    this.game.playTone(150, 'sawtooth', 0.3); // Wrong buzz
                }
            }
        });
    }
}

// Level 5: Drag and Drop
class LevelFive extends Level {
    constructor(game) {
        super(game);
        this.ball = { x: 100, y: this.height / 2, radius: 50, color: "#ff9ff3", isDragging: false };
        this.target = { x: this.width - 200, y: this.height / 2 - 75, w: 150, h: 150, color: "#54a0ff" };
    }

    resize(w, h) {
        super.resize(w, h);
        if (!this.ball.isDragging) {
            this.ball.y = h / 2;
        }
        this.target.x = w - 200;
        this.target.y = h / 2 - 75;
    }

    draw(ctx) {
        // Instruction
        ctx.fillStyle = "#333";
        ctx.font = "bold 40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Drag the BALL to the BOX", this.width / 2, 80);

        // Draw Target Box
        ctx.fillStyle = this.target.color;
        ctx.fillRect(this.target.x, this.target.y, this.target.w, this.target.h);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 4;
        ctx.strokeRect(this.target.x, this.target.y, this.target.w, this.target.h);

        // Draw Ball
        ctx.beginPath();
        ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.ball.color;
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    handleMouseDown(x, y) {
        const dx = x - this.ball.x;
        const dy = y - this.ball.y;
        if (Math.sqrt(dx * dx + dy * dy) < this.ball.radius) {
            this.ball.isDragging = true;
        }
    }

    handleMouseMove(x, y) {
        if (this.ball.isDragging) {
            this.ball.x = x;
            this.ball.y = y;
            this.game.spawnParticles(x, y, this.ball.color); // Trail
        }
    }

    handleMouseUp(x, y) {
        if (this.ball.isDragging) {
            this.ball.isDragging = false;
            // Check collision with target (AABB vs Circle center)
            if (x > this.target.x && x < this.target.x + this.target.w &&
                y > this.target.y && y < this.target.y + this.target.h) {
                this.game.nextLevel();
            } else {
                // Snap back if missed
                this.ball.x = 100;
                this.ball.y = this.height / 2;
                this.game.playTone(200, 'sawtooth', 0.2);
            }
        }
    }
}

// Initialize Game
window.onload = () => {
    const game = new Game('myCanvas-el');
};

// Level 6: Double Click 
class LevelSix extends Level {
    constructor(game) {
        super(game);
        this.radius = 80;
        this.x = this.width / 2;
        this.y = this.height / 2;
        this.clicks = 0;
        this.targetColor = '#ff9f43';
    }

    draw(ctx) {
        // Instruction 
        ctx.fillStyle = '#333';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('DOUBLE CLICK ME', this.x, this.y - 120);

        // Draw Sphere 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.targetColor;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    handleDoubleClick(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        if (Math.sqrt(dx * dx + dy * dy) < this.radius) {
            this.game.nextLevel();
        }
    }
}

// Level 7: Right Click 
class LevelSeven extends Level {
    constructor(game) {
        super(game);
        this.w = 150;
        this.h = 150;
        this.x = this.width / 2 - this.w / 2;
        this.y = this.height / 2 - this.h / 2;
    }

    draw(ctx) {
        ctx.fillStyle = '#333';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('RIGHT CLICK the Box', this.width / 2, this.y - 50);

        ctx.fillStyle = '#54a0ff';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }

    handleContextMenu(x, y) {
        if (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h) {
            this.game.nextLevel();
        }
    }
}

// Level 8: Hover (Patience) 
class LevelEight extends Level {
    constructor(game) {
        super(game);
        this.radius = 100;
        this.x = this.width / 2;
        this.y = this.height / 2;
        this.hoverTime = 0;
        this.requiredTime = 3000; // 3 seconds 
        this.isHovering = false;
        this.lastTime = performance.now();
    }

    update() {
        const now = performance.now();
        const dt = now - this.lastTime;
        this.lastTime = now;

        if (this.isHovering) {
            this.hoverTime += dt;
            if (this.hoverTime >= this.requiredTime) {
                this.game.nextLevel();
            }
        } else {
            this.hoverTime = Math.max(0, this.hoverTime - dt * 0.5); // Decay slowly 
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#333';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('HOVER over the Circle', this.width / 2, this.y - 120);

        // Draw Base Circle 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#c8d6e5';
        ctx.fill();

        // Draw Progress 
        const progress = Math.min(1, this.hoverTime / this.requiredTime);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, this.radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * progress));
        ctx.fillStyle = '#1dd1a1';
        ctx.fill();

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    handleMouseMove(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        this.isHovering = (Math.sqrt(dx * dx + dy * dy) < this.radius);
    }
}

// Level 9: Sorting 
class LevelNine extends Level {
    constructor(game) {
        super(game);
        this.colors = ['#ff6b6b', '#1dd1a1', '#54a0ff']; // Red, Green, Blue 
        this.bins = this.colors.map((c, i) => ({
            x: 50 + i * 200,
            y: this.height - 150,
            w: 150,
            h: 100,
            color: c
        }));

        this.balls = this.colors.map((c, i) => ({
            x: 100 + i * 150,
            y: 150,
            radius: 40,
            color: c,
            isDragging: false,
            sorted: false,
            originalX: 100 + i * 150,
            originalY: 150
        }));

        // Shuffle balls 
        this.balls.sort(() => Math.random() - 0.5);
        this.balls.forEach((b, i) => {
            b.x = 100 + i * 150;
            b.originalX = b.x;
        });
    }

    resize(w, h) {
        super.resize(w, h);
        this.bins.forEach((b, i) => {
            b.x = w / 2 - 225 + i * 160; // Center bins 
            b.y = h - 150;
        });
        this.balls.forEach(b => {
            if (!b.sorted && !b.isDragging) {
                b.y = 150;
            }
        });
    }

    draw(ctx) {
        // Draw Bins 
        this.bins.forEach(b => {
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x, b.y, b.w, b.h);
            ctx.strokeStyle = 'white';
            ctx.strokeRect(b.x, b.y, b.w, b.h);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 20px Arial';
            ctx.fillText('DROP HERE', b.x + b.w / 2, b.y + b.h / 2);
        });

        // Draw Balls 
        this.balls.forEach(b => {
            if (b.sorted) return;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.fill();
            ctx.stroke();
        });

        // Instruction 
        ctx.fillStyle = '#333';
        ctx.font = 'bold 30px Arial';
        ctx.fillText('Sort the balls by COLOR', this.width / 2, 50);
    }

    handleMouseDown(x, y) {
        this.balls.forEach(b => {
            if (b.sorted) return;
            const dx = x - b.x;
            const dy = y - b.y;
            if (Math.sqrt(dx * dx + dy * dy) < b.radius) {
                b.isDragging = true;
            }
        });
    }

    handleMouseMove(x, y) {
        this.balls.forEach(b => {
            if (b.isDragging) {
                b.x = x;
                b.y = y;
            }
        });
    }

    handleMouseUp(x, y) {

        if (b.isDragging) {
            b.isDragging = false;
            // Check collision with correct bin 
            let dropped = false;
            this.bins.forEach(bin => {
                if (x > bin.x && x < bin.x + bin.w && y > bin.y && y < bin.y + bin.h) {
                    if (bin.color === b.color) {
                        b.sorted = true;
                        dropped = true;
                        this.game.playSuccessSound();
                    }
                }
            });

            if (!dropped) {
                b.x = b.originalX;
                b.y = b.originalY;
                this.game.playTone(200, 'sawtooth', 0.2);
            }
        }
    });

    if(this.balls.every(b => b.sorted)) {
    this.game.nextLevel();
} 
    } 
}

// Level 10: Trace Path 
class LevelTen extends Level {
    constructor(game) {
        super(game);
        this.pathHeight = 100;
        this.padding = 100;
        this.startX = this.padding;
        this.startY = this.height / 2;
        this.endX = this.width - this.padding;
        this.endY = this.height / 2;
        this.inPath = false;
    }

    draw(ctx) {
        // Draw Path 
        ctx.fillStyle = '#dfe6e9';
        ctx.fillRect(this.startX, this.startY - this.pathHeight / 2, this.endX - this.startX, this.pathHeight);

        // Start Zone 
        ctx.fillStyle = '#badc58';
        ctx.fillRect(this.startX, this.startY - this.pathHeight / 2, 50, this.pathHeight);
        ctx.fillStyle = 'black';
        ctx.fillText('START', this.startX + 25, this.startY);

        // End Zone 
        ctx.fillStyle = '#ffbe76';
        ctx.fillRect(this.endX - 50, this.startY - this.pathHeight / 2, 50, this.pathHeight);
        ctx.fillStyle = 'black';
        ctx.fillText('FINISH', this.endX - 25, this.startY);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.startX, this.startY - this.pathHeight / 2, this.endX - this.startX, this.pathHeight);

        // Instruction 
        ctx.fillStyle = '#333';
        ctx.font = 'bold 30px Arial';
        ctx.fillText('Trace the Path from START to FINISH', this.width / 2, 50);

        // Status 
        if (!this.inPath) {
            ctx.fillStyle = '#ff6b6b';
            ctx.fillText('Go to Start', this.width / 2, this.height - 50);
        }
    }

    handleMouseMove(x, y) {
        // Check if inside path bounds 
        const halfH = this.pathHeight / 2;
        const insideRect = (x >= this.startX && x <= this.endX && y >= this.startY - halfH && y <= this.startY + halfH);

        if (insideRect) {
            if (x < this.startX + 50) {
                this.inPath = true;
            }

            if (this.inPath) {
                // Trail 
                this.game.spawnParticles(x, y, '#6c5ce7');

                // Check finish 
                if (x > this.endX - 50) {
                    this.game.nextLevel();
                }
            }
        } else {
            if (this.inPath) {
                this.inPath = false;
                this.game.playTone(200, 'sawtooth', 0.2); // Fail sound 
            }
        }
    }
}

// Level 11: Sequence 
class LevelEleven extends Level {
    constructor(game) {
        super(game);
        this.targets = [];
        this.currentNumber = 1;
        this.maxNumber = 5;

        for (let i = 1; i <= this.maxNumber; i++) {
            this.targets.push({
                id: i,
                x: Math.random() * (this.width - 200) + 100,
                y: Math.random() * (this.height - 200) + 100,
                radius: 40,
                visible: true
            });
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#333';
        ctx.font = 'bold 30px Arial';
        ctx.fillText('Click 1, 2, 3, 4, 5 in Order', this.width / 2, 50);

        this.targets.forEach(t => {
            if (!t.visible) return;
            ctx.beginPath();
            ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#a29bfe';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.stroke();

            ctx.fillStyle = 'white';
            ctx.font = 'bold 30px Arial';
            ctx.fillText(t.id, t.x, t.y);
        });
    }

    handleClick(x, y) {
        this.targets.forEach(t => {
            if (!t.visible) return;
            const dx = x - t.x;
            const dy = y - t.y;
            if (Math.sqrt(dx * dx + dy * dy) < t.radius) {
                if (t.id === this.currentNumber) {
                    t.visible = false;
                    this.currentNumber++;
                    this.game.playClickSound();
                    if (this.currentNumber > this.maxNumber) {
                        this.game.nextLevel();
                    }
                } else {
                    this.game.playTone(150, 'sawtooth', 0.2);
                }
            }
        });
    }
}

// Level 12: Shrinking Targets 
class LevelTwelve extends Level {
    constructor(game) {
        super(game);
        this.targets = [];
        this.spawnTarget();
        this.targetsClicked = 0;
        this.targetsNeeded = 5;
    }

    spawnTarget() {
        this.targets.push({
            x: Math.random() * (this.width - 200) + 100,
            y: Math.random() * (this.height - 200) + 100,
            radius: 80,
            maxRadius: 80
        });
    }

    update() {
        for (let i = this.targets.length - 1; i >= 0; i--) {
            let t = this.targets[i];
            t.radius -= 0.5;
            if (t.radius <= 0) {
                this.targets.splice(i, 1);
                this.spawnTarget(); // Missed, spawn new 
                this.game.playTone(150, 'sawtooth', 0.2);
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#333';
        ctx.font = 'bold 30px Arial';
        ctx.fillText('Click before they disappear! (' + this.targetsClicked + '/' + this.targetsNeeded + ')', this.width / 2, 50);

        this.targets.forEach(t => {
            ctx.beginPath();
            ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#fd79a8';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.stroke();
        });
    }

    handleClick(x, y) {
        for (let i = this.targets.length - 1; i >= 0; i--) {
            let t = this.targets[i];
            const dx = x - t.x;
            const dy = y - t.y;
            if (Math.sqrt(dx * dx + dy * dy) < t.radius) {
                this.targets.splice(i, 1);
                this.targetsClicked++;
                this.game.playClickSound();

                if (this.targetsClicked >= this.targetsNeeded) {
                    this.game.nextLevel();
                } else {
                    this.spawnTarget();
                }
            }
        }
    }
}

// Level 13: Reaction Time 
class LevelThirteen extends Level {
    constructor(game) {
        super(game);
        this.state = 'WAIT'; // WAIT, READY, GO 
        this.message = 'WAIT...';
        this.color = '#ff7675';
        this.startTime = 0;
        this.timeoutId = null;

        this.startSequence();
    }

    startSequence() {
        this.state = 'WAIT';
        this.message = 'WAIT...';
        this.color = '#ff7675'; // Red 

        this.timeoutId = setTimeout(() => {
            this.state = 'READY';
            this.message = 'READY...';
            this.color = '#fdcb6e'; // Yellow 
            this.game.playTone(400, 'square', 0.1);

            this.timeoutId = setTimeout(() => {
                this.state = 'GO';
                this.message = 'CLICK NOW!';
                this.color = '#00b894'; // Green 
                this.startTime = performance.now();
                this.game.playTone(800, 'square', 0.2);
            }, Math.random() * 2000 + 1000); // 1-3s 
        }, 2000);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.message, this.width / 2, this.height / 2);
    }

    handleClick(x, y) {
        if (this.state === 'GO') {
            const reactionTime = performance.now() - this.startTime;
            // Any reaction under 1s is good for a mouse game 
            this.game.nextLevel();
        } else {
            // False start 
            clearTimeout(this.timeoutId);
            this.message = 'TOO EARLY!';
            this.game.playTone(150, 'sawtooth', 0.5);
            setTimeout(() => this.startSequence(), 1000);
        }
    }
}

// Level 14: Scroll Wheel 
class LevelFourteen extends Level {
    constructor(game) {
        super(game);
        this.balloonRadius = 50;
        this.targetRadius = 200;
        this.tolerance = 20;
    }

    draw(ctx) {
        // Target Outline 
        ctx.beginPath();
        ctx.arc(this.width / 2, this.height / 2, this.targetRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 10;
        ctx.stroke();

        ctx.setLineDash([10, 10]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Balloon 
        ctx.beginPath();
        ctx.arc(this.width / 2, this.height / 2, this.balloonRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff7675';
        ctx.fill();

        // Instruction 
        ctx.fillStyle = '#333';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SCROLL UP to Inflate to the Dotted Line', this.width / 2, 100);

        // Check win 
        if (Math.abs(this.balloonRadius - this.targetRadius) < this.tolerance) {
            ctx.fillStyle = '#00b894';
            ctx.fillText('CLICK TO POP!', this.width / 2, this.height - 100);
        }
    }

    handleWheel(deltaY) {
        if (deltaY < 0) {
            this.balloonRadius += 5; // Scroll Up 
        } else {
            this.balloonRadius = Math.max(10, this.balloonRadius - 5); // Scroll Down 
        }
    }

    handleClick(x, y) {
        if (Math.abs(this.balloonRadius - this.targetRadius) < this.tolerance) {
            // Pop effect 
            this.game.spawnParticles(this.width / 2, this.height / 2, '#ff7675');
            this.game.nextLevel();
        }
    }
}

// Level 15: Precision Maze 
class LevelFifteen extends Level {
    constructor(game) {
        super(game);
        this.pathRadius = 30; // Narrow! 
        this.points = [];
        this.generatePath();
        this.inPath = false;
    }

    generatePath() {
        let x = 50;
        let y = this.height / 2;
        this.points.push({ x, y });

        // Zig Zag 
        while (x < this.width - 50) {
            x += 50;
            y = this.height / 2 + Math.sin(x / 100) * 200;
            this.points.push({ x, y });
        }
    }

    draw(ctx) {
        // Draw Path 
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        this.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = this.pathRadius * 2;
        ctx.strokeStyle = '#dfe6e9';
        ctx.stroke();

        // Start 
        ctx.beginPath();
        ctx.arc(this.points[0].x, this.points[0].y, this.pathRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#badc58';
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText('START', this.points[0].x, this.points[0].y);

        // End 
        const last = this.points[this.points.length - 1];
        ctx.beginPath();
        ctx.arc(last.x, last.y, this.pathRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffbe76';
        ctx.fill();
        ctx.fillText('FINISH', last.x, last.y);

        // Instruction 
        ctx.fillStyle = '#333';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Precise Mouse Movement', this.width / 2, 50);
    }

    handleMouseMove(x, y) {
        // Check distance to any segment 
        let onTrack = false;

        if (x < 100) onTrack = true; // Grace period at start 

        // Simple check: distance to polyline 
        // For simplicity, checking distance to points, but should check segments. 
        // Let's check distance to the curve function we used 
        const idealY = this.height / 2 + Math.sin(x / 100) * 200;

        if (Math.abs(y - idealY) < this.pathRadius) {
            onTrack = true;
        }

        if (onTrack) {
            if (x > this.width - 100) {
                this.game.nextLevel(); // Win 
            }
        } else {
            // Reset 
            this.game.playTone(150, 'sawtooth', 0.2);
        }
    }
}

// Level 13: Reaction Time 
class LevelThirteen extends Level {
    constructor(game) {
        super(game);
        this.state = 'WAIT'; // WAIT, READY, GO 
        this.message = 'WAIT...';
        this.color = '#ff7675';
        this.startTime = 0;
        this.timeoutId = null;

        this.startSequence();
    }

    startSequence() {
        this.state = 'WAIT';
        this.message = 'WAIT...';
        this.color = '#ff7675'; // Red 

        this.timeoutId = setTimeout(() => {
            this.state = 'READY';
            this.message = 'READY...';
            this.color = '#fdcb6e'; // Yellow 
            this.game.playTone(400, 'square', 0.1);

            this.timeoutId = setTimeout(() => {
                this.state = 'GO';
                this.message = 'CLICK NOW!';
                this.color = '#00b894'; // Green 
                this.startTime = performance.now();
                this.game.playTone(800, 'square', 0.2);
            }, Math.random() * 2000 + 1000); // 1-3s 
        }, 2000);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.message, this.width / 2, this.height / 2);
    }

    handleClick(x, y) {
        if (this.state === 'GO') {
            const reactionTime = performance.now() - this.startTime;
            // Any reaction under 1s is good for a mouse game 
            this.game.nextLevel();
        } else {
            // False start 
            clearTimeout(this.timeoutId);
            this.message = 'TOO EARLY!';
            this.game.playTone(150, 'sawtooth', 0.5);
            setTimeout(() => this.startSequence(), 1000);
        }
    }
}

// Level 14: Scroll Wheel 
class LevelFourteen extends Level {
    constructor(game) {
        super(game);
        this.balloonRadius = 50;
        this.targetRadius = 200;
        this.tolerance = 20;
    }

    draw(ctx) {
        // Target Outline 
        ctx.beginPath();
        ctx.arc(this.width / 2, this.height / 2, this.targetRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 10;
        ctx.stroke();

        ctx.setLineDash([10, 10]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Balloon 
        ctx.beginPath();
        ctx.arc(this.width / 2, this.height / 2, this.balloonRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff7675';
        ctx.fill();

        // Instruction 
        ctx.fillStyle = '#333';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SCROLL UP to Inflate to the Dotted Line', this.width / 2, 100);

        // Check win 
        if (Math.abs(this.balloonRadius - this.targetRadius) < this.tolerance) {
            ctx.fillStyle = '#00b894';
            ctx.fillText('CLICK TO POP!', this.width / 2, this.height - 100);
        }
    }

    handleWheel(deltaY) {
        if (deltaY < 0) {
            this.balloonRadius += 5; // Scroll Up 
        } else {
            this.balloonRadius = Math.max(10, this.balloonRadius - 5); // Scroll Down 
        }
    }

    handleClick(x, y) {
        if (Math.abs(this.balloonRadius - this.targetRadius) < this.tolerance) {
            // Pop effect 
            this.game.spawnParticles(this.width / 2, this.height / 2, '#ff7675');
            this.game.nextLevel();
        }
    }
}

// Level 15: Precision Maze 
class LevelFifteen extends Level {
    constructor(game) {
        super(game);
        this.pathRadius = 30; // Narrow! 
        this.points = [];
        this.generatePath();
        this.inPath = false;
    }

    generatePath() {
        let x = 50;
        let y = this.height / 2;
        this.points.push({ x, y });

        // Zig Zag 
        while (x < this.width - 50) {
            x += 50;
            y = this.height / 2 + Math.sin(x / 100) * 200;
            this.points.push({ x, y });
        }
    }

    draw(ctx) {
        // Draw Path 
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        this.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = this.pathRadius * 2;
        ctx.strokeStyle = '#dfe6e9';
        ctx.stroke();

        // Start 
        ctx.beginPath();
        ctx.arc(this.points[0].x, this.points[0].y, this.pathRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#badc58';
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText('START', this.points[0].x, this.points[0].y);

        // End 
        const last = this.points[this.points.length - 1];
        ctx.beginPath();
        ctx.arc(last.x, last.y, this.pathRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffbe76';
        ctx.fill();
        ctx.fillText('FINISH', last.x, last.y);

        // Instruction 
        ctx.fillStyle = '#333';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Precise Mouse Movement', this.width / 2, 50);
    }

    handleMouseMove(x, y) {
        // Check distance to any segment 
        let onTrack = false;

        const idealY = this.height / 2 + Math.sin(x / 100) * 200;

        if (Math.abs(y - idealY) < this.pathRadius) {
            onTrack = true;
        }

        if (onTrack) {
            if (x > this.width - 100) {
                this.game.nextLevel(); // Win 
            }
        } else {
            // Reset 
            this.game.playTone(150, 'sawtooth', 0.2);
        }
    }
} 
