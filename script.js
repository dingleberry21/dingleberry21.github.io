// Particle system with interactive cosmic vibes
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let particles = [];
let connections = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
  constructor(x, y, type = 'electron') {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.type = type;
    this.size = Math.random() * 2 + 1;
    this.life = 1.0;
    this.decay = Math.random() * 0.004 + 0.002;

    switch(type) {
      case 'electron': this.color = '#64ffda'; break;
      case 'photon': this.color = '#ffd166'; this.size *= 1.5; break;
      case 'muon': this.color = '#bb86fc'; break;
      case 'neutrino': this.color = '#ff6b6b'; this.size *= 0.5; break;
      default: this.color = '#ffffff';
    }
  }

  update() {
    this.x += this.vx + (Math.random() - 0.5) * 0.1;
    this.y += this.vy + (Math.random() - 0.5) * 0.1;
    this.life -= this.decay;

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;

    this.vx *= 0.99;
    this.vy *= 0.99;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.life * 0.8;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = this.life * 0.3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Connection class
class Connection {
  constructor(p1, p2, type = 'electromagnetic') {
    this.p1 = p1;
    this.p2 = p2;
    this.type = type;
    this.strength = Math.random() * 0.5 + 0.2;
    this.life = 1.0;
    this.decay = 0.01;

    switch(type) {
      case 'electromagnetic': this.color = '#ffd166'; this.width = 1; break;
      case 'weak': this.color = '#ff6b6b'; this.width = 2; break;
      case 'strong': this.color = '#06d6a0'; this.width = 3; break;
    }
  }

  update() {
    this.life -= this.decay;

    const dx = this.p2.x - this.p1.x;
    const dy = this.p2.y - this.p1.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (dist > 0) {
      const force = this.strength * 0.001 / (dist * dist);
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      this.p1.vx += fx;
      this.p1.vy += fy;
      this.p2.vx -= fx;
      this.p2.vy -= fy;
    }
  }

  draw() {
    if (this.life <= 0) return;

    ctx.save();
    ctx.globalAlpha = this.life * 0.6;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);

    const midX = (this.p1.x + this.p2.x) / 2;
    const midY = (this.p1.y + this.p2.y) / 2;
    const offset = Math.sin(Date.now() * 0.01) * 5;

    ctx.quadraticCurveTo(midX + offset, midY + offset, this.p2.x, this.p2.y);
    ctx.stroke();
    ctx.restore();
  }
}

// Init particles
function initParticles() {
  particles = [];
  const types = ['electron', 'photon', 'muon', 'neutrino'];
  for (let i = 0; i < 60; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height, type));
  }
}

// Update connections
function updateConnections() {
  connections = connections.filter(c => c.life > 0);
  if (Math.random() < 0.08 && connections.length < 12) {
    const p1 = particles[Math.floor(Math.random() * particles.length)];
    const p2 = particles[Math.floor(Math.random() * particles.length)];
    if (p1 !== p2) {
      const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
      if (dist < 220) {
        const types = ['electromagnetic', 'weak', 'strong'];
        connections.push(new Connection(p1, p2, types[Math.floor(Math.random() * types.length)]));
      }
    }
  }
}

// Animation loop
function animate() {
  ctx.fillStyle = 'rgba(15, 15, 25, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  connections.forEach(c => { c.update(); c.draw(); });
  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.life <= 0) {
      const types = ['electron', 'photon', 'muon', 'neutrino'];
      particles[i] = new Particle(Math.random() * canvas.width, Math.random() * canvas.height, types[Math.floor(Math.random() * types.length)]);
    }
  });

  updateConnections();
  requestAnimationFrame(animate);
}

// Start
initParticles();
animate();
