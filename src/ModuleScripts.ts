import
{
  UnitScripts,
  PartialUnitScripts
} from "./modulescriptinterfaces/UnitScripts";

interface AllPartialScripts
{
  unit?: PartialUnitScripts;
}

export default class ModuleScripts implements AllPartialScripts
{
  public readonly unit: UnitScripts =
  {
    removeFromPlayer: []
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

  public add(...toAdd: AllPartialScripts[]): void
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
  public remove(toRemove: AllPartialScripts): void
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
