import * as PIXI from "pixi.js";

import SfxParams from "../../../../src/templateinterfaces/SfxParams";

import Color from "../../../../src/Color";
import {UnitAttribute} from "../../../../src/UnitAttributes";
import
{
  generateTextureWithBounds,
} from "../../../../src/pixiWrapperFunctions";

import FocusingBeam from "./sfxfragments/FocusingBeam";
import ProjectileAttack from "./sfxfragments/ProjectileAttack";
import RampingValue from "./sfxfragments/RampingValue";

import ColorMatrixFilter from "./ColorMatrixFilter";
import ProtonWrapper from "./ProtonWrapper";
import {resources} from "../resources";


const colors =
{
  [UnitAttribute.Attack]: Color.fromHexString("FF4D77"),
  [UnitAttribute.Defence]: Color.fromHexString("0BB1FF"),
  [UnitAttribute.Intelligence]: Color.fromHexString("EB12FE"),
  [UnitAttribute.Speed]: Color.fromHexString("12FE9E"),
};

for (const attribute in colors)
{
  const color: Color = colors[attribute];

  const hsv = color.getHSV();
  hsv[1] = 0.6;

  colors[attribute] = Color.fromHSV(...hsv);
}

export default function snipe(type: UnitAttribute, params: SfxParams)
{
  // ----------INIT
  const mainContainer = new PIXI.Container();

  const offsetUserData = params.user.drawingFunctionData.normalizeForBattleSfx(
    params.userOffset, params.width, "user");
  const offsetTargetData = params.target.drawingFunctionData.normalizeForBattleSfx(
    params.targetOffset, params.width, "target");

  const renderTexture = PIXI.RenderTexture.create(params.width, params.height);
  const renderedSprite = new PIXI.Sprite(renderTexture);
  if (!params.facingRight)
  {
    renderedSprite.x = params.width;
    renderedSprite.scale.x = -1;
  }

  const beamOrigin = offsetUserData.singleAttackOriginPoint;
  const relativeBeamOrigin =
  {
    x: beamOrigin.x / params.width,
    y: beamOrigin.y / params.height,
  };
  const focusDuration = 0.15;
  const projectileLaunchTime = 0.35;
  const impactTime = 0.5;
  const projectileFlightDuration = impactTime - projectileLaunchTime;
  let impactHasOccurred = false;


  // ----------FOCUSING BEAM
  const beamFragment = new FocusingBeam(
  {
    color: colors[type].saturate(-0.1),
    size:
    {
      x: params.width,
      y: params.height,
    },
    focusStartTime: 0,
    focusEndTime: focusDuration,
    decayStartTime: projectileLaunchTime,
    decayEndtime: projectileLaunchTime + projectileFlightDuration / 5,
    focusTimeExponent: 0.33,
    relativeYPosition: relativeBeamOrigin.y,

    beamIntensity: new RampingValue(5.0, 20.0, -25.0),
    beamSharpness: new RampingValue(0.75, 0.24, 0.0),
    beamSize: new RampingValue(0.12, -0.115, -0.005),
  });

  beamFragment.draw();
  mainContainer.addChild(beamFragment.displayObject);

  // ----------PROJECTILE
  const maxSpeedAt1000Duration = params.width * params.duration / 2;
  const maxSpeed = maxSpeedAt1000Duration * (1000 / params.duration);
  const acceleration = maxSpeed / 0.5;

  const projectileColorMatrixFilter = new ColorMatrixFilter();
  projectileColorMatrixFilter.multiplyByColor(colors[type]);
  projectileColorMatrixFilter.multiplyRGB(3.0);

  const projectileFragment = new ProjectileAttack(
  {
    makeProjectileSprite: i =>
    {
      const sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(resources.snipeProjectile));
      sprite.height = 6;
      sprite.width = 32;
      sprite.filters = [projectileColorMatrixFilter];

      return sprite;
    },

    maxSpeed: maxSpeed,
    acceleration: acceleration,

    amountToSpawn: 1,
    useSequentialAttackOriginPoints: false,

    spawnTimeStart: projectileLaunchTime,
    spawnTimeEnd: 1,
    removeAfterImpact: true,
    impactRate: 1,
    onImpact: (projectile, container, time) =>
    {
      if (!impactHasOccurred)
      {
        impactHasOccurred = true;

        params.triggerEffect();

        emitters.forEach(emitter =>
        {
          emitter.p.x = projectile.sprite.position.x + projectile.sprite.width;
          emitter.p.y = projectile.sprite.position.y;

          emitter.emit("once");
        });
      }
    },
    animateImpact: (projectile, container, time) =>
    {
      params.renderer.render(particleBufferSprite, particleRenderTexture, true);
      params.renderer.render(particleContainer, particleRenderTexture, false);

      params.renderer.render(particleRenderSprite, particleBufferTexture, true);


      protonWrapper.update();
    },
    impactPosition:
    {
      min: offsetTargetData.boundingBox.x + offsetTargetData.boundingBox.width / 2,
      max: offsetTargetData.boundingBox.x + offsetTargetData.boundingBox.width / 2,
    },
  });

  projectileFragment.draw(offsetUserData, offsetTargetData);
  mainContainer.addChild(projectileFragment.displayObject);

  // ----------PARTICLES
  const particleContainer = new PIXI.Container();

  const protonWrapper = new ProtonWrapper(particleContainer);
  const particlesAmountScale = params.height / 600;

  const particleRenderTexture = PIXI.RenderTexture.create(params.width, params.height);
  const particleRenderSprite = new PIXI.Sprite(particleRenderTexture);
  mainContainer.addChild(particleRenderSprite);

  const particleBufferTexture = PIXI.RenderTexture.create(params.width, params.height);
  const particleBufferSprite = new PIXI.Sprite(particleBufferTexture);
  particleBufferSprite.alpha *= 0.9;

  const emitters =
  [
    {
      name: "white",
      color: 0xFFFFFF,
      amount: 275,
      size: 6,
    },
    {
      name: "colored",
      color: colors[type].getHex(),
      amount: 25,
      size: 4,
    },
  ].map(emitterData =>
  {
    const emitter = new Proton.BehaviourEmitter();
    emitter.rate = new Proton.Rate(emitterData.amount * particlesAmountScale, 0.02);

    const particleTexture = (() =>
    {
      const particleSize = emitterData.size;

      const gfx = new PIXI.Graphics();
      gfx.beginFill(emitterData.color);
      gfx.drawRect(
        particleSize / 2,
        particleSize / 2,
        particleSize,
        particleSize,
      );
      gfx.endFill();

      return generateTextureWithBounds(
        params.renderer,
        gfx,
        PIXI.settings.SCALE_MODE,
        1,
        new PIXI.Rectangle(0, 0, particleSize, particleSize),
      );
    })();

    emitter.addInitialize(new Proton.ImageTarget(particleTexture));
    emitter.addInitialize(new Proton.Velocity(new Proton.Span(0.5, 5.0),
      new Proton.Span(270, 35, true), "polar"));
    const emitterArea =
    {
      x: Math.min(params.target.drawingFunctionData.boundingBox.width, 70),
      y: Math.min(params.target.drawingFunctionData.boundingBox.height, 70),
    };
    emitter.addInitialize(new Proton.Position(new Proton.RectZone(
      -emitterArea.x / 2,
      -emitterArea.y / 2,
      emitterArea.x,
      emitterArea.y,
    )));
    emitter.addInitialize(new Proton.Life(new Proton.Span(
      params.duration * (1.0 - impactTime) / 3000,
      params.duration * (1.0 - impactTime) / 1500,
    )));

    emitter.addBehaviour(new Proton.Scale(new Proton.Span(0.8, 1), 0));

    protonWrapper.addEmitter(emitter, emitterData.name);
    protonWrapper.onParticleUpdated[emitterData.name] = (particle: Proton.Particle) =>
    {
      const sprite = <PIXI.DisplayObject> particle.sprite;

      sprite.position.x = particle.p.x;
      sprite.position.y = particle.p.y;

      sprite.scale.x = particle.scale;
      sprite.scale.y = particle.scale;
    };

    return emitter;
  });


  // ----------ANIMATE

  function animate()
  {
    const elapsedTime = Date.now() - startTime;
    const relativeElapsedTime = elapsedTime / params.duration;

    beamFragment.animate(relativeElapsedTime);
    projectileFragment.animate(relativeElapsedTime);

    params.renderer.render(mainContainer, renderTexture, true);

    if (elapsedTime < params.duration)
    {
      requestAnimationFrame(animate);
    }
    else
    {
      params.triggerEnd();
    }
  }

  params.triggerStart(renderedSprite);
  const startTime = Date.now();
  animate();
}
