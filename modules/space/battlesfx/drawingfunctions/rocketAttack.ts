import * as PIXI from "pixi.js";

import SfxParams from "../../../../src/templateinterfaces/SfxParams";

import ProjectileAttack from "./sfxfragments/ProjectileAttack";


let hasLoaded: boolean = false;
export default function rocketAttack(params: SfxParams): void
{
  if (hasLoaded)
  {
    playRocketAttack(params);
  }
  else
  {
    loadRocketAttack(() =>
    {
      hasLoaded = true;
      playRocketAttack(params);
    });
  }
}

const rocketUrl = "modules/space/battlesfx/img/rocket.png";

function playRocketAttack(params: SfxParams)
{
  const offsetTargetData = params.target.drawingFunctionData.normalizeForBattleSfx(
    params.targetOffset, params.width, "target");
  const offsetUserData = params.user.drawingFunctionData.normalizeForBattleSfx(
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
     const explosionTexture = PIXI.Texture.fromFrame("Explosion_Sequence_A " + (i+1) + ".png");
     explosionTextures.push(explosionTexture);
  }
  const explosionsById:
  {
    [id: number]:
    {
      clip: PIXI.extras.AnimatedSprite;
      startTime: number;
      relativeTimePerFrame: number;
    };
  } = {};

  const relativeTimePerSecond = 1000 / params.duration;
  const relativeTimePerExplosionFrame = relativeTimePerSecond / 60;

  const projectileAttackFragment = new ProjectileAttack(
  {
    makeProjectileSprite: i =>
    {
      return new PIXI.Sprite(PIXI.Texture.fromFrame(rocketUrl));
    },

    maxSpeed: maxSpeed,
    acceleration: acceleration,

    amountToSpawn: offsetUserData.sequentialAttackOriginPoints.length > 1 ?
      offsetUserData.sequentialAttackOriginPoints.length :
      8,

    spawnTimeStart: 0,
    spawnTimeEnd: 0.4,

    removeAfterImpact: true,
    impactRate: 0.8,
    onImpact: (projectile, impactContainer, time) =>
    {
      if (!impactHasOccurred)
      {
        params.triggerEffect();
        impactHasOccurred = true;
      }

      const remainingTime = 1 - time;
      const remainingTimePerFrame = remainingTime / explosionTextures.length;

      explosionsById[projectile.id] =
      {
        clip: new PIXI.extras.AnimatedSprite(explosionTextures),
        startTime: time,
        relativeTimePerFrame: Math.min(relativeTimePerExplosionFrame, remainingTimePerFrame),
      };

      const explosionClip = explosionsById[projectile.id].clip;
      explosionClip.anchor.set(0.5, 0.5);
      explosionClip.loop = false;
      explosionClip.position.copy(projectile.sprite.position);
      explosionClip.position.x += projectile.sprite.width;
      impactContainer.addChild(explosionClip);
    },
    animateImpact: (projectile, impactContainer, time) =>
    {
      const explosion = explosionsById[projectile.id];
      const relativeTimePlayed = time - explosion.startTime;
      const targetFrame = Math.round(relativeTimePlayed / explosion.relativeTimePerFrame);

      if (targetFrame >= 0 &&
        targetFrame < explosion.clip.totalFrames)
      {
        explosion.clip.gotoAndStop(targetFrame);
        explosion.clip.visible = true;
      }
      else
      {
        explosion.clip.visible = false;
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
      params.triggerEnd();
    }
  }


  params.triggerStart(container);

  animate();
}

function loadRocketAttack(callback: () => void)
{
  const loader = new PIXI.loaders.Loader();

  loader.add("explosion", "modules/space/battlesfx/img/explosion.json");
  loader.add(rocketUrl);

  loader.load(callback);
}

