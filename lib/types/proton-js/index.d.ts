declare class Proton
{
  static USE_CLOCK: boolean;
  static amendChangeTabsBug: boolean;
  static PROTON_UPDATE: string;
  static PROTON_UPDATE_AFTER: string;

  emitters: Proton.Emitter[];
  renderers: Proton.BaseRenderer[];
  time: number;
  oldTime: number;
  elapsed: number;

  constructor(integrationType?: number)

  addEmitter(emitter: Proton.Emitter): void;
  removeEmitter(emitter: Proton.Emitter): void;
  addRenderer(render: Proton.BaseRenderer): void;
  destroy(): void;
  update(): void;

  dispatchEvent(event: string): void;
  getCount(): void;
  amendChangeTabsBug(): void;

  protected emittersUpdate(time: number): void;
}
declare namespace Proton
{
  export class Pool
  {

  }

  export abstract class Behaviour
  {
    abstract name: string;
    life: number;
    easing: EasingFN;
    age: number;
    energy: number;
    dead: boolean;

    constructor(life?: number, easing?: EasingFN | keyof EasingFunctions)

    abstract applyBehaviour(particle: Particle, time: number, particleIndex: number): void
    abstract initialize(particle: Particle): void;

    reset(life: number, easing: EasingFN | keyof EasingFunctions): void;
    calculate(particle: Particle, time: number, particleIndex: number): void;
    destroy(): void;
  }
  export class Alpha extends Behaviour
  {
    name: "Alpha";

    constructor(
      a: number,
      b?: number,
      life?: number,
      easing?: EasingFN | keyof EasingFunctions,
    )

    applyBehaviour(particle: Particle, time: number, particleIndex: number): void
    initialize(particle: Particle): void;
  }
  export class Attraction extends Behaviour
  {
    name: "Attraction";

    applyBehaviour(particle: Particle, time: number, particleIndex: number): void
    initialize(particle: Particle): void;
  }
  export class Collision extends Behaviour
  {
    name: "Collision";

    applyBehaviour(particle: Particle, time: number, particleIndex: number): void
    initialize(particle: Particle): void;
  }
  export class Color extends Behaviour
  {
    name: "Color";

    constructor(
      a: "random" | string | string[] | ArraySpan<string>,
      b: "random" | string | string[] | ArraySpan<string>,
      life?: number,
      easing?: EasingFN | keyof EasingFunctions,
    )

    applyBehaviour(particle: Particle, time: number, particleIndex: number): void
    initialize(particle: Particle): void;
  }
  export class CrossZone extends Behaviour
  {
    name: "CrossZone";

    applyBehaviour(particle: Particle, time: number, particleIndex: number): void
    initialize(particle: Particle): void;
  }
  export class Force extends Behaviour
  {
    name: "Force";

    applyBehaviour(particle: Particle, time: number, particleIndex: number): void
    initialize(particle: Particle): void;
  }
  export class Gravity extends Behaviour
  {
    name: "Gravity";

    applyBehaviour(particle: Particle, time: number, particleIndex: number): void
    initialize(particle: Particle): void;
  }
  export class GravityWell extends Behaviour
  {
    name: "GravityWell";

    applyBehaviour(particle: Particle, time: number, particleIndex: number): void
    initialize(particle: Particle): void;
  }
  export class RandomDrift extends Behaviour
  {
    name: "RandomDrift";

    constructor(
      driftX: number,
      driftY: number,
      delay: number,
      life?: number,
      easing?: EasingFN | keyof EasingFunctions,
    )

    applyBehaviour(particle: Particle, time: number, particleIndex: number): void
    initialize(particle: Particle): void;
  }
  export class Repulsion extends Behaviour
  {
    name: "Repulsion";

    applyBehaviour(particle: Particle, time: number, particleIndex: number): void
    initialize(particle: Particle): void;
  }
  export class Rotate extends Behaviour
  {
    name: "Rotate";

    applyBehaviour(particle: Particle, time: number, particleIndex: number): void
    initialize(particle: Particle): void;
  }
  export class Scale extends Behaviour
  {
    name: "Scale";

    a: Span;
    b: Span;

    constructor(
      from: number | Span,
      to: number | Span,
      life?: number,
      easing?: EasingFN | keyof EasingFunctions,
    )

    applyBehaviour(particle: Particle, time: number, particleIndex: number): void
    initialize(particle: Particle): void;
  }

  export abstract class Initialize<T extends Particle | Emitter = Particle | Emitter>
  {
    abstract initialize(target: T): void;
    reset?(): void;

    init(emitter: Emitter, particle: Particle): void;
  }
  export class Body extends Initialize<Particle> // AKA ImageTarget
  {
    constructor(
      image: string | string[] | CanvasImageSource | CanvasImageSource[] | ArraySpan<string | CanvasImageSource>,
      w?: number,
      h?: number,
    )

    reset(): void;
    initialize(target: Particle): void;
  }
  export class Life extends Initialize
  {
    constructor(span: Span)
    constructor(spanValues: number[])
    constructor(a: number, b?: number, center?: boolean)

    reset(): void;
    initialize(target: Particle | Emitter): void;
  }
  export class Mass extends Initialize
  {
    constructor(span: Span)
    constructor(spanValues: number[])
    constructor(a: number, b?: number, center?: boolean)

    reset(): void;
    initialize(target: Particle | Emitter): void;
  }
  export class Position extends Initialize
  {
    constructor(zone: Zone)

    reset(): void;
    initialize(target: Particle | Emitter): void;
  }
  export class Radius extends Initialize
  {
    constructor(span: Span)
    constructor(spanValues: number[])
    constructor(a: number, b?: number, center?: boolean)

    reset(): void;
    initialize(target: Particle | Emitter): void;
  }
  export class Velocity extends Initialize
  {
    constructor(
      rPan: Span | number[],
      thaPan: Span | number[],
      type: "vector" | "polar" | "p" | "P",
    )

    reset(): void;
    initialize(target: Particle | Emitter): void;
  }

  export class Particle
  {
    id: string;

    life: number;
    age: number;

    energy: number;
    dead: boolean;
    sleep: boolean;
    body: any;
    sprite: any;
    parent: any;

    mass: number;
    radius: number;
    alpha: number;
    scale: number;
    rotation: number;
    color: number;

    easing: EasingFN;

    p: Vector2D;
    v: Vector2D;
    a: Vector2D;

    transform:
    {
      [key: string]: any;

      rgb:
      {
        r: number;
        g: number;
        b: number;
      };
    };

    constructor(paramsObj?: {[K in keyof Particle]?: Particle[K]})

    getDirection(): number;
    reset(init?: "init"): void;
    update(time: number, particleIndex: number): void;
    applyBehaviours(time: number, particleIndex: number): void;
    addBehaviour(behaviour: Behaviour): void;
    addBehaviours(behaviours: Behaviour[]): void;
    removeBehaviour(behaviour: Behaviour): void;
    removeAllBehaviours(): void;

    destroy(): void;
  }

  export class Span
  {
    constructor(value: number)
    constructor(values: number[])
    constructor(from: number, to: number)
    constructor(from: number, to: number, useCenterPoint: false)
    constructor(center: number, variation: number, useCenterPoint: true)

    getValue(): number;
  }

  export class Rate
  {
    numPan: number | number[] | Span;
    timePan: number | number[] | Span;

    constructor(
      numPan: number | number[] | Span,
      timePan: number | number[] | Span,
    )
  }

  export class Emitter<P extends Particle = Particle> extends Particle
  {
    initializes: Initialize[];
    particles: P[];
    behaviours: Behaviour[];

    emitSpeed: number;
    emitTime: number;
    totalTime: number | "once" | "none";

    /**
		 * The friction coefficient for all particle emit by This;
     */
    damping: number;

    /**
		 * If bindEmitter the particles can bind this emitter's property;
     */
    bindEmitter: boolean;

    /**
		 * The number of particles per second emit
     */
    rate: Rate;

    name: string;


    constructor(paramsObj?: {[K in keyof Emitter]?: Emitter[K]})

    emit(
      timesToEmit?: number | "once",
      life?: true | "life" | "destroy" | number,
    ): void;
    stop(): void;
    preEmit(time: number): void;
    removeAllParticles(): void;

    /**
	   * add initialize to this emitter
	   * @method addSelfInitialize
	   */
    addSelfInitialize(initialize: Initialize): void;

    /**
	   * add the Initialize to particles;
     */
    addInitialize(...initializes: Initialize<P>[]): void;
    removeInitialize(initialize: Initialize<P>): void;
    removeAllInitializers(): void;

    /**
     * add the Behaviour to particles;
     */
    addBehaviour(...behaviours: Behaviour[]): void;
    removeBehaviour(behaviour: Behaviour): void;
    removeAllBehaviourrs(): void;

    update(time: number): void;
    emitting(time: number): void;
    integrate(time: number): void;

    /**
     * create single particle;
     */
    createParticle(initialize: Initialize, behaviour: Behaviour): P;

    destroy(): void;
  }
  export class BehaviourEmitter<P extends Particle = Particle> extends Emitter<P>
  {
    addSelfBehaviour(...behaviours: Behaviour[]): void;
    removeSelfBehaviour(behaviour: Behaviour): void;
  }

  // the stroke stuff for this shouldn't be in base class
  export abstract class BaseRenderer<E = any, P extends Particle = any, S = any>
  {
    element: E;

    constructor(element: E, stroke?: S);

    setStroke(color: string, thickness: number): void;
    destroy(): void;

    resize?(width: number, height: number): void;

    protected abstract onProtonUpdate(): void;
    protected abstract onProtonUpdateAfter(): void;
    protected abstract onEmitterAdded(emitter: Emitter): void;
    protected abstract onEmitterRemoved(emitter: Emitter): void;
    protected abstract onParticleCreated(particle: P): void;
    protected abstract onParticleUpdate(particle: P): void;
    protected abstract onParticleDead(particle: P): void;
  }
  // useless wrapper class. proton doesnt expose baserenderer but this is identical anyway
  export abstract class CustomRenderer<E = any, P extends Particle = any, S = any> extends BaseRenderer<E, P, S>
  {

  }

  export abstract class Zone
  {
    vector: Vector2D;
    random: number;
    crossType: "dead" | "bound" | "cross";
    alert: boolean;

    abstract getPosition(): Vector2D;
    abstract crossing(particle: Particle): void
  }
  export class CircleZone extends Zone
  {
    constructor(x: number, y: number, radius: number)

    setCenter(x: number, y: number): void

    getPosition(): Vector2D;
    crossing(particle: Particle): void
  }
  export class ImageZone extends Zone
  {
    constructor(
      imageData: ImageData,
      x: number,
      y: number,
      d: number,
    )

    getPosition(): Vector2D;
    crossing(particle: Particle): void
  }
  export class LineZone extends Zone
  {
    constructor(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      direction: ">" | "R" | "right" | "down" | "<" | "L" | "left" | "up",
    )

    getPosition(): Vector2D;
    crossing(particle: Particle): void
  }
  export class PointZone extends Zone
  {
    constructor(x: number, y: number)

    getPosition(): Vector2D;
    crossing(particle: Particle): void
  }
  export class RectZone extends Zone
  {
    constructor(
      x: number,
      y: number,
      width: number,
      height: number,
    )

    getPosition(): Vector2D;
    crossing(particle: Particle): void
  }

  export interface Stroke
  {
    color: string;
    thinkness: number; // sic
  }

  export class ArraySpan<T>
  {
    constructor(values: T | T[])

    getValue(): T;
  }
  export class Vector2D
  {
    x: number;
    y: number;
  }


  export type EasingFN = (value: number) => number;
  export type EasingFunctions =
  {
    easeLinear: EasingFN,
    easeInQuad: EasingFN,
    easeOutQuad: EasingFN,
    easeInOutQuad: EasingFN,
    easeInCubic: EasingFN,
    easeOutCubic: EasingFN,
    easeInOutCubic: EasingFN,
    easeInQuart: EasingFN,
    easeOutQuart: EasingFN,
    easeInOutQuart: EasingFN,
    easeInSine: EasingFN,
    easeOutSine: EasingFN,
    easeInOutSine: EasingFN,
    easeInExpo: EasingFN,
    easeOutExpo: EasingFN,
    easeInOutExpo: EasingFN,
    easeInCirc: EasingFN,
    easeOutCirc: EasingFN,
    easeInOutCirc: EasingFN,
    easeInBack: EasingFN,
    easeOutBack: EasingFN,
    easeInOutBack: EasingFN,
  }
  export const ease: EasingFunctions &
  {
    getEasing: (ease: EasingFN | keyof EasingFunctions) => EasingFN,
  }
}

declare module "proton-js"
{
  export = Proton;
}
