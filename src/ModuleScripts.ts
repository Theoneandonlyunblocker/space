import UnitScripts from "./modulescriptinterfaces/UnitScripts";
import GameScripts from "./modulescriptinterfaces/GameScripts";
import PartialAllScripts from "./modulescriptinterfaces/PartialAllScripts";


export default class ModuleScripts implements PartialAllScripts
{
  public readonly unit: UnitScripts =
  {
    removeFromPlayer: []
  };
  public readonly game: GameScripts =
  {
    afterInit: []
  };

  constructor()
  {

  }
  public static merge(...toMerge: ModuleScripts[]): ModuleScripts
  {
    const merged = new ModuleScripts();

    merged.add(...toMerge);

    return merged;
  }

  public add(...toAdd: PartialAllScripts[]): void
  {
    toAdd.forEach(scripts =>
    {
      for (let scriptType in scripts)
      {
        for (let scriptKey in scripts[scriptType])
        {
          this[scriptType][scriptKey].push(...scripts[scriptType][scriptKey]);
        }
      }
    });
  }
  public remove(toRemove: PartialAllScripts): void
  {
    for (let scriptType in toRemove)
    {
      for (let scriptKey in toRemove[scriptType])
      {
        const ownScripts: Function[] = this[scriptType][scriptKey];
        const scriptsToRemove: Function[] = toRemove[scriptType][scriptKey];

        for (let j = 0; j < scriptsToRemove.length; j++)
        {
          for (var i = ownScripts.length - 1; i >= 0; i--)
          {
            if (ownScripts[i] === scriptsToRemove[j])
            {
              ownScripts.splice(i, 1);
              
              break;
            }
          }
        }
      }
    }
  }
}
