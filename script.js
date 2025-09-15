// Particle system with parallax & fade-in
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
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.size = Math.random() * 2 + 1;
    this.color = ['#64ffda','#bb86fc','#ff6b6b','#ffd166'][Math.floor(Math.random()*4)];
    this.life = 1.0;
    this.decay = Math.random() * 0.003 + 0.002;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.life -= this.decay;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}

// Init particles
function initParticles() {
  particles = [];
  for (let i = 0; i < 70; i++) {
    particles.push(new Particle(Math.random()*canvas.width, Math.random()*canvas.height));
  }
}

// Animation loop
function animate() {
  ctx.fillStyle = 'rgba(15, 15, 25, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p,i) => {
    p.update(); p.draw();
    if (p.life <= 0) particles[i] = new Particle(Math.random()*canvas.width, Math.random()*canvas.height);
  });

  requestAnimationFrame(animate);
}
initParticles();
animate();

/* ---- Parallax ---- */
document.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  document.querySelectorAll('.parallax').forEach((el, i) => {
    el.style.transform = `translateY(${scrolled * 0.1 * (i+1)}px)`;
  });
});

/* ---- Fade-in on scroll ---- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('fade-in');
  });
}, { threshold: 0.2 });

document.querySelectorAll('.project-card, .socials').forEach(el => observer.observe(el));
