/// <reference path="projectileattack.ts" />

import SFXParams from "../../../src/templateinterfaces/SFXParams";

import ProjectileAttack from "./sfxfragments/ProjectileAttack";

const rocketUrl = "modules/common/battlesfxfunctions/img/rocket.png";

function rocketAttack(params: SFXParams)
{
  const offsetTargetData = params.target.drawingFunctionData.normalizeForBattleSFX(
    params.targetOffset, params.target);
  const offsetUserData = params.user.drawingFunctionData.normalizeForBattleSFX(
    params.userOffset, params.user);
  
  const startTime = Date.now();

  let impactHasOccurred = false;



  const projectileAttackFragment = new ProjectileAttack(
  {
    projectileTextures: [PIXI.Texture.fromFrame(rocketUrl)],

    maxSpeed: 3,
    acceleration: 0.05,
    
    amountToSpawn:
    {
      min: 20,
      max: 20
    },

    spawnTimeStart: 0,
    spawnTimeEnd: 0.4,

    removeAfterImpact: true,
    impactRate: 0.8,
    onImpact: (projectile, container, time) =>
    {
      if (!impactHasOccurred)
      {
        params.triggerEffect();
        impactHasOccurred = true;
      }
    }
  });

  projectileAttackFragment.draw(offsetUserData, offsetTargetData);


  
  function animate()
  {
    const elapsedTime = Date.now() - startTime;
    const relativeTime = elapsedTime / params.duration;

    console.log(relativeTime);

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

  params.triggerStart(projectileAttackFragment.displayObject);

  animate();

  // var explosionTextures: PIXI.Texture[] = [];
  // for (let i = 0; i < 26; i++)
  // {
  //    var explosionTexture = PIXI.Texture.fromFrame("Explosion_Sequence_A " + (i+1) + '.png');
  //    explosionTextures.push(explosionTexture);
  // }
}

export default function preLoadedRocketAttack(params: SFXParams)
{
  const loader = new PIXI.loaders.Loader();
  
  loader.add("explosion", "modules/common/battlesfxfunctions/img/explosion.json");
  loader.add(rocketUrl);
  
  loader.load(loader =>
  {
    rocketAttack(params);
  });
}

