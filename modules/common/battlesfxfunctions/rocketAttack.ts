/// <reference path="projectileattack.ts" />

import SFXParams from "../../../src/templateinterfaces/SFXParams";

import projectileAttack from "./projectileAttack";

const rocketUrl = "modules/common/battlesfxfunctions/img/rocket.png";

function rocketAttack(params: SFXParams)
{
  var explosionTextures: PIXI.Texture[] = [];

  for (let i = 0; i < 26; i++)
  {
     var explosionTexture = PIXI.Texture.fromFrame("Explosion_Sequence_A " + (i+1) + '.png');
     explosionTextures.push(explosionTexture);
  }

  var props =
  {
    projectileTextures: [PIXI.Texture.fromFrame(rocketUrl)],
    impactTextures: [explosionTextures],

    maxSpeed: 3,
    acceleration: 0.05,

    amountToSpawn:
    {
      min: 20,
      max: 20
    },
    impactRate: 5
  };

  projectileAttack(props, params);
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

