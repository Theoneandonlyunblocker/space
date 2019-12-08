import { Manufactory } from "core/src/production/Manufactory";
import { TitanPrototype } from "./TitanPrototype";
import { activeModuleData } from "core/src/app/activeModuleData";
import { NonCoreModuleData } from "./nonCoreModuleData";


export function getBuildablePrototypes(manufactory: Manufactory): TitanPrototype[]
{
  const titansModuleData = (activeModuleData.nonCoreData.titans as NonCoreModuleData);
  const player = manufactory.owner;
  const playerTitanPrototypes = titansModuleData.titanPrototypesPerPlayer[player.id];

  if (!playerTitanPrototypes)
  {
    return [];
  }

  return Object.keys(playerTitanPrototypes).map(prototypeKey => playerTitanPrototypes[prototypeKey]);
}
