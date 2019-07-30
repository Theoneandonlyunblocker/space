import * as PIXI from "pixi.js";
import * as Proton from "proton-js";

import {UnitDrawingFunctionData} from "../../../../../src/UnitDrawingFunctionData";
import {solveAcceleration} from "../../../../../src/kinematics";

import {VfxFragment} from "./VfxFragment";
import * as PropInfo from "./props/PropInfoClasses";
import { PixiRenderer } from "../proton/PixiRenderer";
import { ProtonEmitter } from "../proton/ProtonEmitter";
import { FunctionInitialize } from "../proton/FunctionInitialize";
import { FunctionBehaviour } from "../proton/FunctionBehaviour";
import {ProtonWithTimeScale} from "../proton/ProtonWithTimeScale";


interface AbsorbProps
{
  getParticleDisplayObject: () => PIXI.DisplayObject;
  duration: number;

  onEnd?: () => void;
  baseParticleCount?: number;
  baseInitialBurstVelocity?: number; // px/s
}

const baseDuration = 2500;

export class Absorb extends VfxFragment<AbsorbProps>
{
  public displayName = "Absorb";
  public key = "absorb";
  public readonly propInfo =
  {
    getParticleDisplayObject: new PropInfo.Function(undefined),
    duration: new PropInfo.Number(baseDuration),

    onEnd: new PropInfo.Function(undefined),
    baseParticleCount: new PropInfo.Number(150),
    baseInitialBurstVelocity: new PropInfo.Number(200),
  }

  private isAnimating: boolean = false;

  private readonly container: PIXI.Container;
  private readonly proton: Proton;
  private readonly emitters: ProtonEmitter[] = [];
  private readonly timeScale: number;

  constructor(props: AbsorbProps)
  {
    super();

    this.initializeProps(props);

    this.container = new PIXI.Container();

    this.timeScale = baseDuration / props.duration;
    this.proton = new ProtonWithTimeScale(1);
    this.proton.addRenderer(new PixiRenderer(this.container));
  }

  public startAnimation(): void
  {
    this.isAnimating = true;

    this.emitters.forEach(emitter => emitter.emit("once"));
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
  public draw(userData: UnitDrawingFunctionData, targetData: UnitDrawingFunctionData): void
  {
    const targets = targetData.individualUnitBoundingBoxes.length;

    const particlesPerEmitter = this.props.baseParticleCount / targets;
    const particleKillAreaStart = userData.boundingBox.x + userData.boundingBox.width;
    const particleKillAreaEnd = userData.boundingBox.x;

    // todo
    const initialBurstVelocity = this.props.baseInitialBurstVelocity / (1 + Math.log(targets) / 8) * this.timeScale; // px/s

    const damping =
    {
      x: 1 - 0.004 * this.timeScale,
      y: 1 - 0.008 * this.timeScale,
    };

    // idk how to actually calculate acceleration with damping so just do this
    const accelerationMultiplierToCompensateForDamping = 1 + (1 - damping.x) * 50;

    let deadEmitters: number = 0;

    targetData.individualUnitBoundingBoxes.forEach(target =>
    {
      const desiredAcceleration = Math.abs(solveAcceleration( // px/s/s
      {
        initialVelocity: initialBurstVelocity,
        duration: this.props.duration / 1000,
        displacement: particleKillAreaStart - (target.x + target.width),
      })) * accelerationMultiplierToCompensateForDamping;

      const emitter = new ProtonEmitter();
      emitter.p.copy(target);
      emitter.damping = 0.0;
      emitter.rate = new Proton.Rate(particlesPerEmitter);

      emitter.addInitialize(new FunctionInitialize("createDisplayObject", (particle =>
      {
        particle.displayObject = this.props.getParticleDisplayObject();
      })));

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Velocity(
        new Proton.Span(initialBurstVelocity / 100), // proton multiplies this by 100
        new Proton.Span(0, 360),
        "polar",
      ));
      emitter.addInitialize(new Proton.Position(new Proton.RectZone(
        0,
        0,
        target.width,
        target.height,
      )));

      emitter.addBehaviour(new Proton.Attraction(
        new Proton.Vector2D(userData.singleAttackOriginPoint.x, userData.singleAttackOriginPoint.y),
        desiredAcceleration / 100, // proton multiplies this by 100
        Infinity,
      ));

      const killBehaviour = new FunctionBehaviour("killBehaviour", (particle, deltaTime, i) =>
      {
        const v = particle.v.x * deltaTime;
        const x = particle.p.x + v;

        if (x < particleKillAreaStart)
        {
          const relativePositionInKillArea = (x - particleKillAreaStart) / (particleKillAreaEnd - particleKillAreaStart);
          const killChance = 0.2 + 0.8 * relativePositionInKillArea * this.timeScale;

          if (Math.random() <= killChance)
          {
            particle.dead = true;

            if (emitter.particles.length <= 1)
            {
              deadEmitters += 1;
              if (deadEmitters === this.emitters.length)
              {
                if (this.props.onEnd)
                {

                  this.props.onEnd();
                }
              }
            }
          }
        }
      });
      emitter.addBehaviour(killBehaviour);

      const customDampingBehaviour = new FunctionBehaviour("customDampingBehaviour", (particle, deltaTime) =>
      {
        particle.v.x *= damping.x;
        particle.v.y *= damping.y;
      });
      emitter.addBehaviour(customDampingBehaviour);

      this.emitters.push(emitter);
      this.proton.addEmitter(emitter);
    });

    this.setDisplayObject(this.container);
  }
}

