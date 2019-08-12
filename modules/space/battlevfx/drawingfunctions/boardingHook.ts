import * as PIXI from "pixi.js";

import {VfxParams} from "../../../../src/templateinterfaces/VfxParams";
import { WavyLine } from "./vfxfragments/WavyLine";
import { ProjectileWithImpact } from "./vfxfragments/ProjectileWithImpact";
import { Projectile } from "./vfxfragments/Projectile";
import { solveInitialVelocity, solveAcceleration } from "../../../../src/kinematics";
import { smoothStep } from "../../../../src/utility";
import { resources } from "../resources";


export function boardingHook(params: VfxParams)
{
  const impactTime = 0.4;
  const tauteningTime = 0.6;
  const yankTime = 0.7;
  const launchDecelerationFactor = 4;
  const ropeTimeScale = 40;

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

  const startPosition = offsetUserData.singleAttackOriginPoint;
  const impactX = offsetTargetData.boundingBox.x + offsetTargetData.boundingBox.width / 2;
  const projectileDistance = impactX - startPosition.x;
  const acceleration = projectileDistance * -launchDecelerationFactor;


  const makeHookSprite = () =>
  {
    const hookSprite = PIXI.Sprite.from("placeHolder");
    hookSprite.scale.set(2);

    return hookSprite;
  };

  const launchProjectile = new Projectile(
  {
    getDisplayObject: makeHookSprite,
    spawnPosition: startPosition,

    acceleration: acceleration,
    initialVelocity: solveInitialVelocity(
    {
      duration: impactTime,
      displacement: projectileDistance,
      acceleration: acceleration,
    }),
  });

  let visibleProjectile: Projectile = launchProjectile;


  const yankProjectile = new Projectile(
  {
    getDisplayObject: makeHookSprite,
    spawnPosition: startPosition,

    acceleration: solveAcceleration(
    {
      initialVelocity: 0,
      duration: 1,
      displacement: -projectileDistance
    }),
  });


  const projectileWithImpact = new ProjectileWithImpact(
  {
    impactPosition: impactX,
    removeAfterImpact: true,
    impactDuration: 1 - impactTime,
    getProjectileFragment: () => launchProjectile,
    onImpact: (x, y, time) =>
    {
      visibleProjectile = yankProjectile;

      yankProjectile.props.spawnPosition.x = launchProjectile.position.x;
      yankProjectile.draw();
      container.addChild(yankProjectile.displayObject);
    },
    animateImpact: (time) =>
    {

    },
  });
  projectileWithImpact.draw();
  container.addChild(projectileWithImpact.displayObject);


  const ropeFragment = new WavyLine(
  {
    getTexture: () => PIXI.Texture.from(resources.rope),
    getLineEndRelativePosition: (time, ropeLength) =>
    {
      return (visibleProjectile.position.x - startPosition.x) / ropeLength;
    },
    getSwayFactor: (time, relativePositionInLine) =>
    {
      const relativeDistanceFromCenter = Math.abs(0.5 - relativePositionInLine) * 2;
      const closenessToCenter = 1 - relativeDistanceFromCenter;

      const slacknessFromLaunch = Math.min(time, 0.5) * 2;
      const slacknessFromTautening = smoothStep(time, impactTime, tauteningTime) * -1;
      const slacknessFromYank = smoothStep(time, yankTime, 1) * 1;
      const slackness = slacknessFromLaunch + slacknessFromTautening + slacknessFromYank;

      return closenessToCenter * slackness;
    },
    originPoint: startPosition,
    endPositionX: impactX,
    timeScale: ropeTimeScale,
  });
  ropeFragment.draw();
  container.addChild(ropeFragment.displayObject);


  function animate(currentTime: number): void
  {
    const elapsedTime = currentTime - startTime;
    const relativeTime = elapsedTime / params.duration;

    if (elapsedTime < params.duration)
    {
      projectileWithImpact.animate(relativeTime);

      if (relativeTime > yankTime)
      {
        yankProjectile.animateWithinTimeSpan(relativeTime, yankTime, 1);
      }

      ropeFragment.animate(relativeTime);

      requestAnimationFrame(animate);
    }
    else
    {
      params.triggerEnd();
    }
  }

  params.triggerStart(container);

  const startTime = performance.now();
  animate(startTime);
}
