/**
 * BoonBox - Particle & Visual Effects Engine
 * Renders ambient stardust and dramatic reward burst explosions via HTML5 Canvas
 */

class BoonParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.ambientParticles = [];
    this.burstParticles = [];
    this.maxAmbient = 70;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initAmbient();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  initAmbient() {
    this.ambientParticles = [];
    for (let i = 0; i < this.maxAmbient; i++) {
      this.ambientParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.1,
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.4 ? 'rgba(216, 180, 254, ' : 'rgba(147, 197, 253, ' // Purple / Cyan tint
      });
    }
  }

  /**
   * Explode celebratory particles from the box location
   */
  triggerBurst(x, y, rarity = 'common') {
    const count = rarity === 'legendary' ? 160 : rarity === 'epic' ? 120 : 80;
    
    // Color palettes by rarity
    const palettes = {
      common: ['#10b981', '#34d399', '#6ee7b7', '#fef08a'],
      rare: ['#3b82f6', '#60a5fa', '#93c5fd', '#e0f2fe', '#c084fc'],
      epic: ['#a855f7', '#c084fc', '#e879f9', '#f43f5e', '#fef08a'],
      legendary: ['#fbbf24', '#f59e0b', '#f43f5e', '#a855f7', '#38bdf8', '#ffffff']
    };

    const colors = palettes[rarity] || palettes.common;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 3;
      const size = Math.random() * 5 + 2;
      const isStar = Math.random() > 0.6;

      this.burstParticles.push({
        x: x || this.width / 2,
        y: y || this.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 4 + 2), // upward bias
        gravity: 0.18,
        friction: 0.96,
        size: size,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.018 + 0.01,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        isStar: isStar
      });
    }
  }

  drawStar(cx, cy, spikes, outerRadius, innerRadius, color, alpha) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = Math.max(0, alpha);
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = color;
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw & Update Ambient Stardust
    for (let i = 0; i < this.ambientParticles.length; i++) {
      const p = this.ambientParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;

      // Wrap around screen
      if (p.y < 0) p.y = this.height;
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;

      const safeAlpha = Math.min(Math.max(p.alpha, 0.1), 0.85);

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color + safeAlpha + ')';
      this.ctx.shadowBlur = p.radius * 3;
      this.ctx.shadowColor = p.color + '0.5)';
      this.ctx.fill();
    }

    // 2. Draw & Update Burst Particles
    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const bp = this.burstParticles[i];
      bp.vx *= bp.friction;
      bp.vy *= bp.friction;
      bp.vy += bp.gravity;
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.rotation += bp.rotationSpeed;
      bp.alpha -= bp.decay;

      if (bp.alpha <= 0) {
        this.burstParticles.splice(i, 1);
        continue;
      }

      if (bp.isStar) {
        this.drawStar(bp.x, bp.y, 5, bp.size * 1.5, bp.size * 0.6, bp.color, bp.alpha);
      } else {
        this.ctx.save();
        this.ctx.translate(bp.x, bp.y);
        this.ctx.rotate(bp.rotation);
        this.ctx.fillStyle = bp.color;
        this.ctx.globalAlpha = Math.max(0, bp.alpha);
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = bp.color;
        this.ctx.fillRect(-bp.size / 2, -bp.size / 2, bp.size, bp.size);
        this.ctx.restore();
      }
    }

    requestAnimationFrame(this.animate);
  }
}

window.boonParticles = new BoonParticles('particle-canvas');

