import * as PIXI from "pixi.js";
import * as Proton from "proton-js";

import {VfxFragment} from "./VfxFragment";
import * as PropInfo from "./props/PropInfoClasses";
import { PixiParticle } from "../proton/PixiParticle";
import {ProtonWithTimeScale} from "../proton/ProtonWithTimeScale";
import { ProtonEmitter } from "../proton/ProtonEmitter";
import { PixiRenderer } from "../proton/PixiRenderer";
import { FunctionInitialize } from "../proton/FunctionInitialize";
import { PolarVelocityInitialize } from "../proton/PolarVelocityInitialize";
import { Point } from "../../../../../src/math/Point";


export interface ParticleBurstProps<D extends PIXI.DisplayObject>
{
  particleCount: number;
  velocity?: number;
  acceleration?: number;
  forceOrigin?: Point;
  getParticleDisplayObject: (particle: PixiParticle) => D;
  getEmitZone: () => Proton.Zone<PixiParticle>;

  getKillZone?: () => Proton.Zone<PixiParticle>;
  onEnd?: () => void;
}

export class ParticleBurst<D extends PIXI.DisplayObject> extends VfxFragment<ParticleBurstProps<D>>
{
  public displayName = "ParticleBurst";
  public key = "particleBurst";

  public readonly propInfo =
  {
    particleCount: new PropInfo.Number(100),
    velocity: new PropInfo.Number(300),
    acceleration: new PropInfo.Number(-5),
    forceOrigin: new PropInfo.Point({x: 0, y: 0}),
    getParticleDisplayObject: new PropInfo.Function(({}) => <D><any>PIXI.Sprite.from("placeHolder")),
    getEmitZone: new PropInfo.Function(() => new Proton.CircleZone(0, 0, 100)),

    getKillZone: new PropInfo.Function(undefined),
    onEnd: new PropInfo.Function(undefined),
  };

  private isAnimating: boolean = false;
  private readonly container: PIXI.Container;
  private readonly proton: Proton;
  private readonly emitter: ProtonEmitter;

  constructor(props: ParticleBurstProps<D>)
  {
    super();

    this.initializeProps(props);

    this.container = new PIXI.Container();

    this.proton = new ProtonWithTimeScale(1);
    this.proton.addRenderer(new PixiRenderer(this.container));

    this.emitter = new ProtonEmitter<PixiParticle>();
  }

  public startAnimation(): void
  {
    this.isAnimating = true;

    this.emitter.emit("once");
  }
  public stopAnimation(): void
  {
    this.isAnimating = false;
  }
  // doesn't actually do determinstic animation due to proton
  public animate(time: number): void
  {
    if (!this.isAnimating && time < 0.1)
    {
      this.startAnimation();
    }
    else if (this.isAnimating && time > 0.9)
    {
      this.stopAnimation();
    }

    this.proton.update();
  }
  public draw(): void
  {
    const emitter = this.emitter;
    emitter.damping = 0.0;
    emitter.rate = new Proton.Rate(this.props.particleCount);

    emitter.addInitialize(new Proton.Position(this.props.getEmitZone()));
    emitter.addInitialize(new Proton.Mass(1));

    if (this.props.velocity)
    {
      emitter.addInitialize(new PolarVelocityInitialize(
        this.props.velocity,
        this.props.forceOrigin,
      ));
    }

    if (this.props.acceleration)
    {
      emitter.addBehaviour(new Proton.Repulsion(
        new Proton.Vector2D(this.props.forceOrigin.x, this.props.forceOrigin.y),
        this.props.acceleration / 100, // proton multiplies this by 100
        Infinity,
      ));
    }

    if (this.props.getKillZone)
    {
      emitter.addBehaviour(new Proton.CrossZone(this.props.getKillZone(), "dead"));
    }

    emitter.addInitialize(new FunctionInitialize("createDisplayObject", ((particle) =>
    {
      particle.displayObject = this.props.getParticleDisplayObject(particle);
    })));

    this.proton.addEmitter(emitter);

    if (this.props.onEnd)
    {
      this.proton.addEventListener("PARTICLE_DEAD", (particle: PixiParticle) =>
      {
        if (particle.parent.particles.length <= 1)
        {
          this.props.onEnd();
        }
      });
    }

    this.setDisplayObject(this.container);
  }
}
