export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rotation: number;
  vrotation: number;
}

export interface ParticleEngineOptions {
  gravity: number;
  drag: number;
}

const defaultOptions: ParticleEngineOptions = { gravity: 420, drag: 0.995 };

/**
 * Minimal canvas particle simulation: advances positions/velocities under
 * gravity + drag, ages particles out, and draws them as rotated squares.
 * Framework-agnostic — driven from a rAF loop owned by the caller (see ParticleCanvas).
 */
export class ParticleEngine {
  particles: Particle[] = [];
  options: ParticleEngineOptions;

  constructor(options: Partial<ParticleEngineOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
  }

  spawn(particle: Particle) {
    this.particles.push(particle);
  }

  spawnBurst(
    count: number,
    origin: { x: number; y: number },
    factory: (i: number) => Omit<Particle, 'x' | 'y' | 'life'>,
  ) {
    for (let i = 0; i < count; i++) {
      const base = factory(i);
      this.spawn({ ...base, x: origin.x, y: origin.y, life: 0 });
    }
  }

  step(dt: number) {
    const { gravity, drag } = this.options;
    this.particles = this.particles.filter((p) => {
      p.life += dt;
      if (p.life >= p.maxLife) return false;

      p.vy += gravity * dt;
      p.vx *= drag;
      p.vy *= drag;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rotation += p.vrotation * dt;
      return true;
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      const lifeRatio = p.life / p.maxLife;
      const alpha = 1 - lifeRatio;

      ctx.save();
      ctx.globalAlpha = Math.max(alpha, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
  }

  get isEmpty() {
    return this.particles.length === 0;
  }
}
