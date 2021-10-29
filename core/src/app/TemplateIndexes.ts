import {activeModuleData} from "./activeModuleData";
import {Distributable} from "../generic/Distributable";
import {ItemTemplate} from "../templateinterfaces/ItemTemplate";
import {RaceTemplate} from "../templateinterfaces/RaceTemplate";
import {ResourceTemplate} from "../templateinterfaces/ResourceTemplate";
import { BattleVfxTemplate } from "../templateinterfaces/BattleVfxTemplate";


interface DistributablesByKey<T extends Distributable>
{
  [key: string]: T;
}
interface DistributablesByDistributionGroup<T extends Distributable>
{
  [groupName: string]: T[];
}

interface DistributablesByTypeAndDistributionGroup
{
  resources: DistributablesByDistributionGroup<ResourceTemplate>;
  races: DistributablesByDistributionGroup<RaceTemplate>;
}
interface ItemsByTechLevel
{
  [techLevel: number]: ItemTemplate[];
}

// TODO 2019.08.29 | rename. not actually indexes
class TemplateIndexes
{
  private builtIndexes:
  {
    distributablesByTypeAndDistributionGroup: DistributablesByTypeAndDistributionGroup;
    itemsByTechLevel: ItemsByTechLevel;
    battleVfx: {[key: string]: BattleVfxTemplate};
  } =
  {
    distributablesByTypeAndDistributionGroup: null,
    itemsByTechLevel: null,
    battleVfx: null,
  };

  public get distributablesByDistributionGroup()
  {
    if (!this.builtIndexes.distributablesByTypeAndDistributionGroup)
    {
      this.builtIndexes.distributablesByTypeAndDistributionGroup =
        TemplateIndexes.getDistributablesByTypeAndDistributionGroup();
    }

    return this.builtIndexes.distributablesByTypeAndDistributionGroup;
  }
  public get itemsByTechLevel()
  {
    if (!this.builtIndexes.itemsByTechLevel)
    {
      this.builtIndexes.itemsByTechLevel = TemplateIndexes.getItemsByTechLevel();
    }

    return this.builtIndexes.itemsByTechLevel;
  }
  public get battleVfx()
  {
    if (!this.builtIndexes.battleVfx)
    {
      this.builtIndexes.battleVfx = TemplateIndexes.getBattleVfx();
    }

    return this.builtIndexes.battleVfx;
  }

  constructor()
  {

  }

  public clear(): void
  {
    for (const key in this.builtIndexes)
    {
      this.builtIndexes[key] = null;
    }
  }

  private static getDistributablesByTypeAndDistributionGroup(): DistributablesByTypeAndDistributionGroup
  {
    return(
    {
      resources: TemplateIndexes.getDistributablesByGroup(activeModuleData.templates.resources.toObject()),
      races: TemplateIndexes.getDistributablesByGroup(activeModuleData.templates.races.toObject()),
    });
  }
  private static getDistributablesByGroup<T extends Distributable>(
    allDistributables: DistributablesByKey<T>,
  ): DistributablesByDistributionGroup<T>
  {
    const byGroup: DistributablesByDistributionGroup<T> = {};

    for (const key in allDistributables)
    {
      const distributable = allDistributables[key];
      distributable.distributionData.distributionGroups.forEach(group =>
      {
        if (!byGroup[group])
        {
          byGroup[group] = [];
        }
        byGroup[group].push(distributable);
      });
    }

    return byGroup;
  }
  // private static getDistributablesByDistributionGroup()
  // {
  //   const result:
  //   {
  //     [groupName: string]:
  //     {
  //       unitFamilies: UnitFamily[];
  //       resources: ResourceTemplate[];
  //     };
  //   } = {};

  //   function putInGroups(
  //     distributables: DistributablesByKey<Distributable>,
  //     distributableType: string
  //   ): void
  //   {
  //     for (const key in distributables)
  //     {
  //       const distributable = distributables[key];
  //       for (let i = 0; i < distributable.distributionGroups.length; i++)
  //       {
  //         const groupName = distributable.distributionGroups[i];
  //         if (!result[groupName])
  //         {
  //           result[groupName] =
  //           {
  //             unitFamilies: [],
  //             resources: []
  //           }
  //         }

  //         result[groupName][distributableType].push(distributable);
  //       }
  //     }
  //   }

  //   putInGroups(activeModuleData.Templates.UnitFamilies, "unitFamilies");
  //   putInGroups(activeModuleData.Templates.Resources, "resources");

  //   return result;
  // }
  private static getItemsByTechLevel()
  {
    const itemsByTechLevel:
    {
      [techLevel: number]: ItemTemplate[];
    } = {};

    activeModuleData.templates.items.forEach(item =>
    {
      if (!itemsByTechLevel[item.techLevel])
      {
        itemsByTechLevel[item.techLevel] = [];
      }

      itemsByTechLevel[item.techLevel].push(item);
    });

    return itemsByTechLevel;
  }
  private static getBattleVfx()
  {
    const allVfx: {[key: string]: BattleVfxTemplate} = {};

    activeModuleData.templates.combatAbilities.forEach(ability =>
    {
      allVfx[ability.vfx.key] = ability.vfx;
    });

    return allVfx;
  }
}

export const templateIndexes = new TemplateIndexes();

