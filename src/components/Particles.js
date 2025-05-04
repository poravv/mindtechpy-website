// Partículas para fondo de la sección CTA
class Particles {
  constructor(elementId, options = {}) {
    this.canvas = document.getElementById(elementId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    
    this.options = {
      particleCount: options.particleCount || 50,
      color: options.color || '#ffffff',
      radius: options.radius || { min: 1, max: 3 },
      speed: options.speed || { min: 0.1, max: 0.5 },
      opacity: options.opacity || { min: 0.1, max: 0.5 },
      connectParticles: options.connectParticles || true,
      lineWidth: options.lineWidth || 0.5,
      lineColor: options.lineColor || 'rgba(255, 255, 255, 0.3)',
      maxDistance: options.maxDistance || 120
    };
    
    this.init();
  }
  
  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    this.createParticles();
    this.animate();
  }
  
  resizeCanvas() {
    if (!this.canvas) return;
    
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = this.canvas.parentElement.clientHeight;
  }
  
  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.options.particleCount; i++) {
      const radius = this.random(this.options.radius.min, this.options.radius.max);
      
      this.particles.push({
        x: this.random(0, this.canvas.width),
        y: this.random(0, this.canvas.height),
        radius: radius,
        originalRadius: radius,
        color: this.options.color,
        opacity: this.random(this.options.opacity.min, this.options.opacity.max),
        speed: {
          x: this.random(-this.options.speed.max, this.options.speed.max),
          y: this.random(-this.options.speed.max, this.options.speed.max)
        }
      });
    }
  }
  
  animate() {
    if (!this.canvas) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateParticles();
    
    if (this.options.connectParticles) {
      this.connectParticles();
    }
    
    requestAnimationFrame(() => this.animate());
  }
  
  updateParticles() {
    this.particles.forEach(particle => {
      // Actualizar posición
      particle.x += particle.speed.x;
      particle.y += particle.speed.y;
      
      // Rebote en los bordes
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.speed.x *= -1;
      }
      
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.speed.y *= -1;
      }
      
      // Dibujar partícula
      this.ctx.fillStyle = this.rgbaColor(particle.color, particle.opacity);
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
  
  connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= this.options.maxDistance) {
          // Calcular opacidad basada en la distancia
          const opacity = 1 - (distance / this.options.maxDistance);
          
          this.ctx.strokeStyle = this.options.lineColor;
          this.ctx.lineWidth = this.options.lineWidth;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
  
  random(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  rgbaColor(color, opacity) {
    if (color.startsWith('rgb')) {
      return color;
    } else {
      // Convert hex to rgba
      let hex = color.replace('#', '');
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }
}

export default Particles;
