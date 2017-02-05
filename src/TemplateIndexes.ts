
import app from "./App"; // TODO global
import {RaceTemplate} from "./templateinterfaces/RaceTemplate";
import ResourceTemplate from "./templateinterfaces/ResourceTemplate";
import ItemTemplate from "./templateinterfaces/ItemTemplate";
import {Distributable} from "./templateinterfaces/Distributable";

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
  }
  
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
      resources: TemplateIndexes.getDistributablesByGroup(app.moduleData.Templates.Resources),
      races: TemplateIndexes.getDistributablesByGroup(app.moduleData.Templates.Races),
    });
  }
  private static getDistributablesByGroup<T extends Distributable>(
    allDistributables: DistributablesByKey<T>
  ): DistributablesByDistributionGroup<T>
  {
    const byGroup: DistributablesByDistributionGroup<T> = {};
    
    for (let key in allDistributables)
    {
      const distributable = allDistributables[key];
      distributable.distributionData.distributionGroups.forEach((group) =>
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
  //   var result:
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
  //       var distributable = distributables[key];
  //       for (let i = 0; i < distributable.distributionGroups.length; i++)
  //       {
  //         var groupName = distributable.distributionGroups[i];
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

  //   putInGroups(app.moduleData.Templates.UnitFamilies, "unitFamilies");
  //   putInGroups(app.moduleData.Templates.Resources, "resources");

  //   return result;
  // }
  private static getItemsByTechLevel()
  {
    var itemsByTechLevel:
    {
      [techLevel: number]: ItemTemplate[];
    } = {};
    for (let itemName in app.moduleData.Templates.Items)
    {
      var item = app.moduleData.Templates.Items[itemName];

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

