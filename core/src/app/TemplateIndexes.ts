import {activeModuleData} from "./activeModuleData";
import {Distributable} from "../generic/Distributable";
import {ItemTemplate} from "../templateinterfaces/ItemTemplate";
import {RaceTemplate} from "../templateinterfaces/RaceTemplate";
import {ResourceTemplate} from "../templateinterfaces/ResourceTemplate";


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
  } =
  {
    distributablesByTypeAndDistributionGroup: null,
    itemsByTechLevel: null,
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
      resources: TemplateIndexes.getDistributablesByGroup(activeModuleData.templates.Resources),
      races: TemplateIndexes.getDistributablesByGroup(activeModuleData.templates.Races),
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
    for (const itemName in activeModuleData.templates.Items)
    {
      const item = activeModuleData.templates.Items[itemName];

      if (!itemsByTechLevel[item.techLevel])
      {
        itemsByTechLevel[item.techLevel] = [];
      }

      itemsByTechLevel[item.techLevel].push(item);
    }

    return itemsByTechLevel;
  }
}

export const templateIndexes = new TemplateIndexes();

