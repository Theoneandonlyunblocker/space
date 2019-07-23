// TODO
declare class Proton
{
  static getSpan(from: number, to: number, center?: boolean): Proton.Span;

  addEmitter(emitter: Proton.Emitter): void;
  destroy(): void;
  update(): void;
}
declare module Proton
{
  export class Vector2D
  {
    x: number;
    y: number;
  }
  export class Particle
  {
    life: number; // time in seconds. when age >= life, particle is considered dead
    age: number; // time in seconds since creation
    //能量损失
    energy: number;
    dead: boolean;
    sleep: boolean;
    mass: number;
    radius: number;
    alpha: number;
    scale: number;
    rotation: number;

    id: string;

    p: Vector2D; // position
    v: Vector2D; // velocity
    a: Vector2D;

    transform: any; // TODO
    target: any; // used by renderer
    sprite: any; // used by renderer
    parent: Proton | Proton.Emitter; // Emitter for particles, Proton for emitters
    color: Color;

  }

  export class Color
  {

  }

  export class Emitter extends Particle
  {
    particles: Particle[];
    damping: number;
    rate: Rate;
    emitTime: number;

    // doesn't actually count times emitted, just time since emission start
    // like life, but for emitting particles. only difference is, if life expires emitter gets destroyed
    // if this fills it just stops emitting particles. also has a few special values
    //
    // lots of overlap with Emitter.life
    emitTotalTimes: number | "once" | "none";

    addInitialize(...initializesToAdd: Initialize[]): void;
    removeInitialize(initialize: Initialize): void;
    destroy(): void;
    // <'once'> emitTime: only emit 1 partice. <anything else> emitTime: no clue
    // <number> life: how long emitter will live. <anything else> life: no clue
    emit(emitTime?: number | "once", life?: number | boolean | "life" | "destroy"): void;
    removeAllParticles(): void;
    stopEmit(): void;
  }
  export class BehaviourEmitter extends Emitter
  {
    addBehaviour(...behavioursToAdd: Behaviour[]): void;
    addSelfBehaviour(...behavioursToAdd: Behaviour[]): void;
  }
  export class Rate
  {
    constructor(
      actionsPerTick: number | number[] | Span,
      timeBetweenTicks: number | number[] | Span
    );
  }
  export class Span
  {
    // if center == true: from = center point; to = variation from center point;
    // eg. span(0, 5, true) => -5...5
    // span(0, 5, false) => 0...5
    constructor(from: number, to: number, center?: boolean);
    constructor(span: number[]);
  }
  export class Initialize
  {
    initialize(target: Particle): void;
  }
  export class ImageTarget extends Initialize
  {
    constructor(target: any); // used by renderer, consumed by ProtonWrapper
  }
  export class Life extends Initialize
  {
    constructor(from: number, to: number, center?: number);
    constructor(span: Span);
  }
  export class Mass extends Initialize
  {
    constructor(from: number, to: number, center?: number);
    constructor(span: Span);
  }
  export class Position extends Initialize
  {
    constructor(zone: Zone);
  }
  export class Radius extends Initialize
  {
    constructor(from: number, to: number, center?: number);
    constructor(span: Span);
  }
  export class Velocity extends Initialize
  {
    constructor(radiusSpan: Span, thaPan: Span, type: string); // todo
  }
  export class Behaviour
  {

  }
  export class Alpha extends Behaviour
  {
    constructor(a: any, b: any, life?: number, easing?: string); // todo
  }
  export class CrossZone extends Behaviour
  {
    constructor(zone: Zone, crossType?: string, life?: number, easing?: number); // todo
  }
  export class RandomDrift extends Behaviour
  {
    constructor(driftX: number, driftY: number, delay: number, life?: number, easing?: string); // todo
  }
  export class Rotate extends Behaviour
  {
    constructor(a: any, b: any, style?: string, life?: number, easing?: string); // todo
  }
  export class Scale extends Behaviour
  {
    constructor(a: any, b: any, life?: number, easing?: string); // todo
  }
  export class Force
  {

  }
  export class Gravity extends Force
  {
    constructor(gravity: number, life?: number, easing?: any); // todo
  }
  export class Zone
  {

  }
  export class RectZone extends Zone
  {
    constructor(x: number, y: number, width: number, height: number);

    x: number;
    y: number;
    width: number;
    height: number;
  }
  export class CircleZone extends Zone
  {
    constructor(x: number, y: number, radius: number);
  }
  export class Renderer
  {
    constructor(
      // pixi isn't implemented. others might not be either
      type: string, // 'pixi' | 'dom' | 'canvas' | 'webgl' | 'easel' | 'easeljs' | 'pixel'
      proton: Proton,

      element?: any // used by renderer
    );
    start(): void;
    stop(): void;

    onParticleCreated(particle: Particle): void; // set by renderer
    onParticleUpdate(particle: Particle): void; // set by renderer
    onParticleDead(particle: Particle): void; // set by renderer
  }
}
