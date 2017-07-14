
import {activeModuleData} from "./activeModuleData";
import {Distributable} from "./templateinterfaces/Distributable";
import ItemTemplate from "./templateinterfaces/ItemTemplate";
import {RaceTemplate} from "./templateinterfaces/RaceTemplate";
import ResourceTemplate from "./templateinterfaces/ResourceTemplate";

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
    for (let key in this.builtIndexes)
    {
      this.builtIndexes[key] = null;
    }
  }

  private static getDistributablesByTypeAndDistributionGroup(): DistributablesByTypeAndDistributionGroup
  {
    return(
    {
      resources: TemplateIndexes.getDistributablesByGroup(activeModuleData.Templates.Resources),
      races: TemplateIndexes.getDistributablesByGroup(activeModuleData.Templates.Races),
    });
  }
  private static getDistributablesByGroup<T extends Distributable>(
    allDistributables: DistributablesByKey<T>,
  ): DistributablesByDistributionGroup<T>
  {
    const byGroup: DistributablesByDistributionGroup<T> = {};

    for (let key in allDistributables)
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
  //     for (let key in distributables)
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
    for (let itemName in activeModuleData.Templates.Items)
    {
      const item = activeModuleData.Templates.Items[itemName];

      if (!itemsByTechLevel[item.techLevel])
      {
        itemsByTechLevel[item.techLevel] = [];
      }

      itemsByTechLevel[item.techLevel].push(item);
    }

    return itemsByTechLevel;
  }
}

const indexes = new TemplateIndexes();
export default indexes;

