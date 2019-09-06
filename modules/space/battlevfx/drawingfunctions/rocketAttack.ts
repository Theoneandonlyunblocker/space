import * as PIXI from "pixi.js";

import {VfxDrawingFunction} from "src/templateinterfaces/VfxDrawingFunction";

import {ProjectileAttack} from "./vfxfragments/ProjectileAttack";
import {resources} from "../resources";


export const rocketAttack: VfxDrawingFunction = params =>
{
  const offsetTargetData = params.target.drawingFunctionData.normalizeForBattleVfx(
    params.targetOffset, params.width, "target");
  const offsetUserData = params.user.drawingFunctionData.normalizeForBattleVfx(
    params.userOffset, params.width, "user");

  const container = new PIXI.Container();
  if (!params.facingRight)
  {
    container.x = params.width;
    container.scale.x = -1;
  }

  const startTime = Date.now();
  let impactHasOccurred = false;

  const maxSpeedAt1000Duration = params.width * params.duration / 30;
  const maxSpeed = maxSpeedAt1000Duration * (1000 / params.duration);
  const acceleration = maxSpeed / 6;

  const explosionTextures: PIXI.Texture[] = [];
  for (let i = 0; i < 26; i++)
  {
    const explosionTexture = PIXI.Texture.from("Explosion_Sequence_A " + (i+1) + ".png");
    explosionTextures.push(explosionTexture);
  }
  const explosions: PIXI.AnimatedSprite[] = [];

  const projectileAttackFragment = new ProjectileAttack(
  {
    makeProjectileSprite: i =>
    {
      const sprite = new PIXI.Sprite(PIXI.Texture.from(resources.rocketProjectile));
      sprite.scale.set(0.5);

      return sprite;
    },

    maxSpeed: maxSpeed,
    acceleration: acceleration,

    amountToSpawn: offsetUserData.sequentialAttackOriginPoints.length > 1 ?
      offsetUserData.sequentialAttackOriginPoints.length :
      8,

    spawnTimeStart: 0,
    spawnTimeEnd: 0.35,
    impactDuration: 0.2,

    removeAfterImpact: true,
    impactRate: 0.8,
    onImpact: (projectileIndex, x, y, time) =>
    {
      if (!impactHasOccurred)
      {
        params.abilityUseEffects.triggerAllEffects();
        impactHasOccurred = true;
      }

      const explosion = explosions[projectileIndex] = new PIXI.AnimatedSprite(explosionTextures);
      explosion.scale.set(0.5);
      explosion.anchor.set(0.5, 0.5);
      explosion.loop = false;
      explosion.position.set(x, y);
      container.addChild(explosion);
    },
    animateImpact: (projectileIndex, relativeExplosionTime) =>
    {
      const explosion = explosions[projectileIndex];
      const targetFrame = Math.round(relativeExplosionTime * explosion.totalFrames);

      if (targetFrame >= 0 &&
        targetFrame < explosion.totalFrames)
      {
        explosion.visible = true;
        explosion.gotoAndStop(targetFrame);
      }
      else
      {
        explosion.visible = false;
      }
    },
    impactPosition:
    {
      min: offsetTargetData.boundingBox.x,
      max: offsetTargetData.boundingBox.x + offsetTargetData.boundingBox.width,
    },
  });

  projectileAttackFragment.draw(offsetUserData, offsetTargetData);
  container.addChild(projectileAttackFragment.displayObject);

  function animate()
  {
    const elapsedTime = Date.now() - startTime;
    const relativeTime = elapsedTime / params.duration;

    projectileAttackFragment.animate(relativeTime);

    if (elapsedTime < params.duration)
    {
      requestAnimationFrame(animate);
    }
    else
    {
      container.removeChildren();

      params.triggerEnd();
    }
  }


  params.triggerStart(container);

  animate();
}

