/**
 * CoDecision Interactive Canvas Animations
 * Renders iridescent fluid waves, contour fields, and audio waveform
 */

class HeroFluidCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width = this.canvas.offsetWidth;
    this.height = this.canvas.height = this.canvas.offsetHeight;
    this.time = 0;
    this.mouse = { x: this.width * 0.5, y: this.height * 0.5, targetX: this.width * 0.5, targetY: this.height * 0.5 };
    
    this.init();
  }

  init() {
    window.addEventListener('resize', () => {
      if (!this.canvas) return;
      this.width = this.canvas.width = this.canvas.offsetWidth;
      this.height = this.canvas.height = this.canvas.offsetHeight;
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        this.mouse.targetX = e.clientX - rect.left;
        this.mouse.targetY = e.clientY - rect.top;
      }
    });

    this.animate();
  }

  animate() {
    this.time += 0.015;
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Iridescent Liquid Wave Ribbon
    const lines = 24;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    for (let i = 0; i < lines; i++) {
      const progress = i / lines;
      this.ctx.beginPath();

      const alpha = isDark ? (0.15 + (1 - progress) * 0.45) : (0.2 + (1 - progress) * 0.5);
      const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
      
      gradient.addColorStop(0, `rgba(255, 154, 60, ${alpha * 0.8})`);
      gradient.addColorStop(0.45, `rgba(255, 92, 240, ${alpha})`);
      gradient.addColorStop(0.85, `rgba(138, 87, 255, ${alpha})`);
      gradient.addColorStop(1, `rgba(56, 189, 248, ${alpha * 0.7})`);

      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 1.4 + (1 - progress) * 1.5;

      const points = 50;
      for (let p = 0; p <= points; p++) {
        const px = (p / points) * this.width;
        const wave1 = Math.sin(this.time * 1.2 + p * 0.15 + i * 0.2) * (35 - i * 0.8);
        const wave2 = Math.cos(this.time * 0.8 + p * 0.1 + i * 0.15) * 25;
        
        // Mouse reaction warp
        const dx = px - this.mouse.x;
        const dist = Math.abs(dx);
        const mouseFactor = Math.max(0, 1 - dist / 220);
        const mouseWarp = Math.sin(this.time * 2 + p * 0.2) * mouseFactor * 30;

        const py = this.height * 0.5 + wave1 + wave2 + (i - lines / 2) * 9 + mouseWarp;

        if (p === 0) {
          this.ctx.moveTo(px, py);
        } else {
          this.ctx.lineTo(px, py);
        }
      }
      this.ctx.stroke();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Mini Interactive Visualizers for Patterns & Motion Section
class PatternVisualizers {
  static initContour(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let time = 0;
    
    function draw() {
      time += 0.02;
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      
      for (let r = 10; r < 90; r += 12) {
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.1) {
          const rad = r + Math.sin(a * 4 + time + r * 0.05) * 6;
          const x = w / 2 + Math.cos(a) * rad;
          const y = h / 2 + Math.sin(a) * (rad * 0.6);
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(138, 87, 255, ${0.25 + (r / 90) * 0.6})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  static initWaveform(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let time = 0;

    function draw() {
      time += 0.04;
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const bars = 36;
      const barWidth = 3;
      const gap = (w - (bars * barWidth)) / (bars - 1);

      for (let i = 0; i < bars; i++) {
        const x = i * (barWidth + gap);
        const norm = Math.sin((i / bars) * Math.PI);
        const freq = Math.sin(time * 1.5 + i * 0.3) * 0.5 + 0.5;
        const barHeight = Math.max(6, norm * freq * (h * 0.8));
        const y = (h - barHeight) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#FF5CF0');
        grad.addColorStop(1, '#8A57FF');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  static initFlowField(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let time = 0;

    function draw() {
      time += 0.025;
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const lines = 12;
      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const angle = Math.sin(x * 0.02 + time + i * 0.3) * 1.2;
          const y = (i / lines) * h + Math.sin(x * 0.04 + time) * 12 + angle * 8;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.2 + (i / lines) * 0.6})`;
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
}

// Export initialization
document.addEventListener('DOMContentLoaded', () => {
  new HeroFluidCanvas('heroFluidCanvas');
  PatternVisualizers.initContour('contourCanvas');
  PatternVisualizers.initWaveform('waveformCanvas');
  PatternVisualizers.initFlowField('flowFieldCanvas');
});
