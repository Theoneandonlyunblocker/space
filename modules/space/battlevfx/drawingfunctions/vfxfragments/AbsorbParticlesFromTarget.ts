// TODO 2019.08.19 | worth converting absorbParticles so that this could utilize it?
import * as PIXI from "pixi.js";
import * as Proton from "proton-js";

import {UnitDrawingFunctionData} from "../../../../../src/unit/UnitDrawingFunctionData";
import {solveAcceleration} from "../../../../../src/math/kinematics";
import { extractImageData } from "../../../../../src/graphics/pixiWrapperFunctions";
import { Color } from "../../../../../src/color/Color";
import { randInt } from "../../../../../src/generic/utility";

import {VfxFragment} from "./VfxFragment";
import * as PropInfo from "./props/PropInfoClasses";
import { PixiRenderer } from "../proton/PixiRenderer";
import { ProtonEmitter } from "../proton/ProtonEmitter";
import { FunctionInitialize } from "../proton/FunctionInitialize";
import { FunctionBehaviour } from "../proton/FunctionBehaviour";
import {ProtonWithTimeScale} from "../proton/ProtonWithTimeScale";
import { PixiParticle } from "../proton/PixiParticle";


interface AbsorbParticlesFromTargetProps
{
  getParticleDisplayObject: (particle: PixiParticle, colorAtTarget: Color) => PIXI.DisplayObject;
  duration: number;

  onFirstParticleImpact?: () => void;
  onEnd?: () => void;
  particleCount?: number;
  baseInitialBurstVelocity?: number; // px/s
}

const baseDuration = 2500;

export class AbsorbParticlesFromTarget extends VfxFragment<AbsorbParticlesFromTargetProps>
{
  public displayName = "AbsorbParticlesFromTarget";
  public key = "absorbParticlesFromTarget";
  public readonly propInfo =
  {
    getParticleDisplayObject: new PropInfo.Function(undefined),
    duration: new PropInfo.Number(baseDuration),

    onFirstParticleImpact: new PropInfo.Function(undefined),
    onEnd: new PropInfo.Function(undefined),
    particleCount: new PropInfo.Number(150),
    baseInitialBurstVelocity: new PropInfo.Number(150),
  };

  private isAnimating: boolean = false;
  private hasHadFirstImpact: boolean = false;

  private readonly container: PIXI.Container;
  private readonly proton: Proton;
  private readonly emitters: ProtonEmitter[] = [];
  private readonly timeScale: number;

  constructor(props: AbsorbParticlesFromTargetProps)
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
    this.hasHadFirstImpact = false;

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
  public draw(userData: UnitDrawingFunctionData, targetData: UnitDrawingFunctionData, renderer: PIXI.Renderer): void
  {
    const targets = targetData.individualUnitBoundingBoxes.length;

    const particlesPerEmitter = this.props.particleCount / targets;
    const particleKillAreaStart = userData.boundingBox.x + userData.boundingBox.width;
    const particleKillAreaEnd = userData.boundingBox.x + userData.boundingBox.width / 2;

    // todo
    const initialBurstVelocity = this.props.baseInitialBurstVelocity / (1 + Math.log(targets) / 8) * this.timeScale; // px/s

    const damping =
    {
      x: 1 - 0.002 * this.timeScale,
      y: 1 - 0.008 * this.timeScale,
    };

    // idk how to actually calculate acceleration with damping so just do this
    const accelerationMultiplierToCompensateForDamping = 1 + (1 - damping.x) * 50;

    let deadEmitters: number = 0;

    targetData.individualUnitBoundingBoxes.forEach((target, i) =>
    {
      const targetDisplayObject = targetData.individualUnitDisplayObjects[i];
      const imageData = extractImageData(targetDisplayObject, renderer.plugins.extract);

      const desiredAcceleration = Math.abs(solveAcceleration( // px/s/s
      {
        initialVelocity: initialBurstVelocity,
        duration: this.props.duration / 1000,
        displacement: -Math.abs(particleKillAreaStart - (target.x + target.width)),
      })) * accelerationMultiplierToCompensateForDamping;

      const emitter = new ProtonEmitter<PixiParticle & {killLine: number}>();
      emitter.p.copy(target);
      emitter.damping = 0.0; // we do damping in a custom behaviour
      emitter.rate = new Proton.Rate(particlesPerEmitter);

      const imageZone = new Proton.ImageZone(imageData);
      emitter.addInitialize(new Proton.Position(imageZone));

      emitter.addInitialize(new FunctionInitialize("createDisplayObject", ((particle) =>
      {
        const color = imageZone.getColor(particle.p.x, particle.p.y);
        particle.displayObject = this.props.getParticleDisplayObject(particle, new Color(
          color.r / 255,
          color.g / 255,
          color.b / 255,
        ));
      })));

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Velocity(
        new Proton.Span(initialBurstVelocity / 200, initialBurstVelocity / 100), // proton multiplies this by 100
        new Proton.Span(0, 360),
        "polar",
      ));


      emitter.addBehaviour(new Proton.Attraction(
        new Proton.Vector2D(userData.singleAttackOriginPoint.x, userData.singleAttackOriginPoint.y),
        desiredAcceleration / 100, // proton multiplies this by 100
        Infinity,
      ));

      emitter.addInitialize(new FunctionInitialize("killLineInitialize", (particle =>
      {
        particle.killLine = randInt(particleKillAreaEnd, particleKillAreaStart);
      })));

      emitter.addBehaviour(new FunctionBehaviour("killBehaviour", (particle, deltaTime) =>
      {
        const v2 = particle.v.x * deltaTime / 2;
        const x = particle.p.x + v2;

        if (x < particle.killLine)
        {
          particle.dead = true;

          if (!this.hasHadFirstImpact && this.props.onFirstParticleImpact)
          {
            this.hasHadFirstImpact = true;
            this.props.onFirstParticleImpact();
          }

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
      }));

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

