/// <reference path="projectileattack.ts" />

import SFXParams from "../../../src/templateinterfaces/SFXParams";

import projectileAttack from "./projectileAttack";

export default function rocketAttack(params: SFXParams)
{
  var explosionTextures: PIXI.Texture[] = [];

  for (var i = 0; i < 26; i++)
  {
     var explosionTexture = PIXI.Texture.fromFrame("Explosion_Sequence_A " + (i+1) + '.png');
     explosionTextures.push(explosionTexture);
  }

  var props =
  {
    projectileTextures: [PIXI.Texture.fromFrame("modules\/default\/img\/battleEffects\/rocket.png")],
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

  return projectileAttack(props, params);
}
