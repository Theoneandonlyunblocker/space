// TODO
declare class Proton
{
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

    p: Vector2D; // position
    v: Vector2D; // velocity
    a: Vector2D;

    transform: any; // TODO
    target: any; // used by renderer
    sprite: any; // used by renderer
    parent: Proton | Proton.Emitter;
    color: Color;

  }
  export class Color
  {

  }
  export class Initialize
  {

  }
  export class Emitter extends Particle
  {
    rate: Rate;
    emitTimes: number;
    emitTotalTimes: number | "once" | "none"; 

    addInitialize(...initializesToAdd: Initialize[]): void;
    destroy(): void;
    emit(emitTime?: any, life?: any): void; // todo
    removeAllParticles(): void;
    stopEmit(): void;
  }
  export class BehaviourEmitter extends Emitter
  {

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
    constructor(from: number, to: number, center?: number);
    constructor(span: number[]);
  }
  export class Life extends Initialize
  {
    constructor(from: number, to: number, center?: number);
    constructor(span: Span);
  }
  export class Renderer
  {
    constructor(
      // pixi isn't implemented. others might not be either
      type: string, // 'pixi' | 'dom' | 'canvas' | 'webgl' | 'easel' | 'easeljs' | 'pixel'
      proton: Proton,

      // element dom/div canvas/canvas easeljs/cantainer(or stage)
      element?: any // used by renderer
    );
    start(): void;
    stop(): void;

    onParticleCreated(particle: Particle): void; // set by renderer
    onParticleUpdate(particle: Particle): void; // set by renderer
    onParticleDead(particle: Particle): void; // set by renderer
  }
}
