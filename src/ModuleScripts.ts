import {AllScripts} from "./modulescriptinterfaces/AllScripts";
import {BattleScripts} from "./modulescriptinterfaces/BattleScripts";
import {DiplomacyScripts} from "./modulescriptinterfaces/DiplomacyScripts";
import {GameScripts} from "./modulescriptinterfaces/GameScripts";
import {PlayerScripts} from "./modulescriptinterfaces/PlayerScripts";
import {UnitScripts} from "./modulescriptinterfaces/UnitScripts";


// TODO 2017.06.13 | move non-internal stuff from eventManager to here
export default class ModuleScripts implements AllScripts
{
  public readonly battle: BattleScripts =
  {
    battleFinish: [],
  };
  public readonly diplomacy: DiplomacyScripts =
  {
    onWarDeclaration: [],
  };
  public readonly game: GameScripts =
  {
    afterInit: [],
  };
  public readonly player: PlayerScripts =
  {
    onDeath: [],
  };
  public readonly unit: UnitScripts =
  {
    removeFromPlayer: [],
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

  public add(...toAdd: Partial<AllScripts>[]): void
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
  public remove(toRemove: Partial<AllScripts>): void
  {
    for (let scriptType in toRemove)
    {
      for (let scriptKey in toRemove[scriptType])
      {
        const ownScripts: Function[] = this[scriptType][scriptKey];
        const scriptsToRemove: Function[] = toRemove[scriptType][scriptKey];

        for (let j = 0; j < scriptsToRemove.length; j++)
        {
          for (let i = ownScripts.length - 1; i >= 0; i--)
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
