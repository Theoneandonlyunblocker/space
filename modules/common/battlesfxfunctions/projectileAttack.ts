/// <reference path="../../../lib/pixi.d.ts" />

import SFXParams from "../../../src/templateinterfaces/SFXParams";

import
{
  randInt,
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
  // TODO battleSFX | would be nice to draw SFX based on unit scenes
  // eg. height here = unit scene height
  var minY = Math.max(params.height * 0.3, 30); // from top
  var maxY = params.height - 30;

  var maxSpeed = (params.width / params.duration) * props.maxSpeed;
  var acceleration = maxSpeed * props.acceleration;

  var container = new PIXI.Container();
  if (!params.facingRight)
  {
    container.scale.x = -1;
    container.x = params.width;
  }

  var startTime = Date.now();
  var endTime = startTime + params.duration;
  var stopSpawningTime = startTime + params.duration / 2;
  var lastTime = startTime;
  var nextSpawnTime = startTime;

  var amountToSpawn = randInt(props.amountToSpawn.min, props.amountToSpawn.max);
  var spawnRate = (stopSpawningTime - startTime) / amountToSpawn;

  var projectiles:
  {
    sprite: PIXI.Sprite;
    speed: number;
    impactX: number;
    willImpact: boolean;
    hasImpact: boolean;
  }[] = []

  var hasTriggeredEffect = false;

  function animate()
  {
    var currentTime = Date.now();
    var elapsedTime = currentTime - lastTime;
    lastTime = currentTime;

    if (currentTime < stopSpawningTime && currentTime >= nextSpawnTime)
    {
      nextSpawnTime += spawnRate;
      var texture = getRandomArrayItem(props.projectileTextures);
      var sprite = new PIXI.Sprite(texture);
      sprite.x = 20;
      sprite.y = randInt(minY, maxY);
      container.addChild(sprite);

      projectiles.push(
      {
        sprite: sprite,
        speed: 0,
        willImpact: (projectiles.length - 1) % props.impactRate === 0,
        impactX: randInt(params.width - 200, params.width - 50),
        hasImpact: false
      });
    }

    for (var i = 0; i < projectiles.length; i++)
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
