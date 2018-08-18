

import BuildingUpgradeData from "./BuildingUpgradeData";
import {activeModuleData} from "./activeModuleData";
import idGenerators from "./idGenerators";
import BuildingSaveData from "./savedata/BuildingSaveData";
import {BuildingEffect} from "./BuildingEffect";
import {BuildingTemplate} from "./templateinterfaces/BuildingTemplate";

import Player from "./Player";
import Star from "./Star";
import { TerritoryBuildingTemplate } from "./templateinterfaces/TerritoryBuildingTemplate";


export type TerritoryBuilding = Building<TerritoryBuildingTemplate>;

export class Building<T extends BuildingTemplate = BuildingTemplate>
{
  public template: T;
  public id: number;

  public location: Star;
  public controller: Player;

  public upgradeLevel: number;
  public totalCost: number;

  constructor(props:
  {
    template: T;

    location: Star;
    controller?: Player;

    upgradeLevel?: number;
    totalCost?: number;

    id?: number;
  })
  {
    this.template = props.template;
    this.id = (props.id && isFinite(props.id)) ? props.id : idGenerators.building++;
    this.location = props.location;
    this.controller = props.controller || this.location.owner;
    this.upgradeLevel = props.upgradeLevel || 1;
    this.totalCost = props.totalCost || this.template.buildCost || 0;
  }

  public getEffect(): BuildingEffect
  {
    if (!this.template.getEffect)
    {
      return {};
    }

    return this.template.getEffect(this.upgradeLevel);
  }
  public getPossibleUpgrades(): BuildingUpgradeData[]
  {
    const upgrades: BuildingUpgradeData[] = [];

    if (this.upgradeLevel < this.template.maxUpgradeLevel)
    {
      upgrades.push(
      {
        template: this.template,
        level: this.upgradeLevel + 1,
        cost: this.template.buildCost * (this.upgradeLevel + 1),
        parentBuilding: this,
      });
    }
    else if (this.template.upgradeInto && this.template.upgradeInto.length > 0)
    {
      const templatedUpgrades = this.template.upgradeInto.map(upgradeData =>
      {
        const template = activeModuleData.templates.Buildings[upgradeData.templateType];

        return(
        {
          level: upgradeData.level,
          template: template,
          cost: template.buildCost,
          parentBuilding: this,
        });
      });

      upgrades.push(...templatedUpgrades);
    }

    return upgrades;
  }
  public upgrade(upgradeData: BuildingUpgradeData<T>): void
  {
    this.template = upgradeData.template;
    this.upgradeLevel = upgradeData.level;
    this.totalCost += upgradeData.cost;

    // TODO 2018.06.13 | better way to do this?
    this.location.buildings.handleBuidlingUpgrade();
  }
  public setController(newController: Player): void
  {
    const oldController = this.controller;
    if (oldController === newController) { return; }


    this.controller = newController;
    this.location.updateController();
  }
  public serialize(): BuildingSaveData
  {
    return(
    {
      templateType: this.template.type,
      id: this.id,

      locationId: this.location.id,
      controllerId: this.controller.id,

      upgradeLevel: this.upgradeLevel,
      totalCost: this.totalCost,
    });
  }
}
