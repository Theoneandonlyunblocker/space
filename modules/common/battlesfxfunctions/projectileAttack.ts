/// <reference path="../../../lib/pixi.d.ts" />

import SFXParams from "../../../src/templateinterfaces/SFXParams";

import
{
  randInt,
  randRange,
  getRandomArrayItem
} from "../../../src/utility";

export default function projectileAttack(props:
{
  projectileTextures: PIXI.Texture[];
  impactTextures?: PIXI.Texture[][];

  maxSpeed: number;
  acceleration: number;

  amountToSpawn:
  {
    min: number;
    max: number;
  }
  impactRate?: number;
},
params: SFXParams)
{
  const offsetTargetData = params.target.drawingFunctionData.normalizeForBattleSFX(
    params.targetOffset, params.target);
  const offsetUserData = params.user.drawingFunctionData.normalizeForBattleSFX(
    params.userOffset, params.user);
  
  const minY = offsetTargetData.boundingBox.y;
  const maxY = minY + offsetTargetData.boundingBox.height;

  const maxSpeed = (params.width / params.duration) * props.maxSpeed;
  const acceleration = maxSpeed * props.acceleration;

  const container = new PIXI.Container();
  if (!params.facingRight)
  {
    container.scale.x = -1;
    container.x = params.width;
  }

  const startTime = Date.now();
  const endTime = startTime + params.duration;
  const stopSpawningTime = startTime + params.duration / 2;
  let lastTime = startTime;
  let nextSpawnTime = startTime;

  const spawnLocationsCount = params.user.drawingFunctionData.sequentialAttackOriginPoints.length; 
  const amountToSpawn = Math.max(
    Math.min(
      randInt(props.amountToSpawn.min, props.amountToSpawn.max),
      spawnLocationsCount
    ),
    10
  );
  const spawnRate = (stopSpawningTime - startTime) / amountToSpawn;

  const impactRate = props.impactRate || 0;

  const projectiles:
  {
    sprite: PIXI.Sprite;
    speed: number;
    impactX: number;
    willImpact: boolean;
    hasImpact: boolean;
  }[] = []

  let hasTriggeredEffect = false;

  function animate()
  {
    var currentTime = Date.now();
    var elapsedTime = currentTime - lastTime;
    lastTime = currentTime;

    if (currentTime < stopSpawningTime && currentTime >= nextSpawnTime)
    {
      nextSpawnTime += spawnRate;
      const texture = getRandomArrayItem(props.projectileTextures);
      const sprite = new PIXI.Sprite(texture);
      container.addChild(sprite);

      const spawnPointIndex = projectiles.length % spawnLocationsCount;
      const spawnPoint = offsetUserData.sequentialAttackOriginPoints[spawnPointIndex];
      sprite.x = spawnPoint.x;
      sprite.y = spawnPoint.y;

      const willImpact = Math.random() < impactRate;

      projectiles.push(
      {
        sprite: sprite,
        speed: 0,
        willImpact: willImpact,
        impactX: randInt(params.width - 200, params.width - 50),
        hasImpact: false
      });
    }

    for (let i = 0; i < projectiles.length; i++)
    {
      var projectile = projectiles[i];
      if (!projectile.hasImpact)
      {
        if (projectile.speed < maxSpeed)
        {
          projectile.speed += acceleration;
        }
        projectile.sprite.x += projectile.speed * elapsedTime;
      }

      if (!projectile.hasImpact && projectile.willImpact &&
        projectile.sprite.x >= projectile.impactX)
      {
        if (params.triggerEffect && !hasTriggeredEffect)
        {
          hasTriggeredEffect = true;
          params.triggerEffect();
        }

        projectile.hasImpact = true;
        var impactTextures = getRandomArrayItem(props.impactTextures);
        var impactClip = new PIXI.extras.MovieClip(impactTextures);
        impactClip.anchor = new PIXI.Point(0.5, 0.5);
        impactClip.loop = false;
        impactClip.position = projectile.sprite.position;
        container.removeChild(projectile.sprite);
        container.addChild(impactClip);
        impactClip.play();
      }
    }

    if (currentTime < endTime)
    {
      requestAnimationFrame(animate)
    }
    else
    {
      params.triggerEnd();
    }
  }

  params.triggerStart(container);

  animate();
}
