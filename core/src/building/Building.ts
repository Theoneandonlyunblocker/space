

import {BuildingUpgradeData} from "./BuildingUpgradeData";
import {idGenerators} from "../app/idGenerators";
import {BuildingSaveData} from "../savedata/BuildingSaveData";
import {BuildingTemplate} from "../templateinterfaces/BuildingTemplate";

import {Player} from "../player/Player";
import {Star} from "../map/Star";
import { TerritoryBuildingTemplate } from "../templateinterfaces/TerritoryBuildingTemplate";
import { BuildingFamily } from "../templateinterfaces/BuildingFamily";
import { Resources } from "../player/PlayerResources";
import { sumObjectValues, flatten2dArray } from "../generic/utility";
import { BuildingModifiersCollection } from "../maplevelmodifiers/BuildingModifiersCollection";
import { PartialMapLevelModifier } from "../maplevelmodifiers/MapLevelModifiers";
import { squashAdjustmentsObjects } from "../generic/FlatAndMultiplierAdjustment";


export type TerritoryBuilding = Building<TerritoryBuildingTemplate>;

export class Building<T extends BuildingTemplate = BuildingTemplate>
{
  public template: T;
  public id: number;

  public location: Star;
  public controller: Player;

  public totalCost: Resources;
  public readonly modifiers: BuildingModifiersCollection = new BuildingModifiersCollection(this);

  constructor(props:
  {
    template: T;

    location: Star;
    controller?: Player;

    totalCost?: Resources;

    id?: number;
  })
  {
    this.template = props.template;
    this.id = (props.id && isFinite(props.id)) ? props.id : idGenerators.building++;
    this.location = props.location;
    this.controller = props.controller || this.location.owner;
    this.totalCost = props.totalCost || this.template.buildCost || {};
  }
  public getStandardUpgrades(): BuildingUpgradeData[]
  {
    const upgrades: BuildingUpgradeData[] = [];

    if (this.template.getStandardUpgradeTargets)
    {
      const possibleUpgradeTargets = this.template.getStandardUpgradeTargets(this.location);
      possibleUpgradeTargets.forEach(upgradeTarget =>
      {
        upgrades.push(
        {
          template: upgradeTarget,
          cost: upgradeTarget.buildCost,
          parentBuilding: this,
        });
      });
    }

    return upgrades;
  }
  public upgrade(upgradeData: BuildingUpgradeData<T>): void
  {
    const oldTemplate = this.template;

    this.template = upgradeData.template;
    this.totalCost = sumObjectValues(this.totalCost, upgradeData.cost);

    this.modifiers.handleUpgrade();

    // TODO 2018.06.13 | better way to do this?
    this.location.buildings.handleBuidlingUpgrade(this, oldTemplate);
  }
  public setController(newController: Player): void
  {
    const oldController = this.controller;
    if (oldController === newController) { return; }

    this.controller = newController;
    if ((<TerritoryBuildingTemplate><unknown>this.template).isTerritoryBuilding)
    {
      this.location.updateController();
    }
    this.modifiers.handleOwnerChange();
  }
  public isOfFamily(familyToCheck: BuildingFamily): boolean
  {
    return this.template.families.some(templateFamily =>
    {
      return templateFamily === familyToCheck;
    });
  }
  // TODO 2019.10.10 | rename or remove altogether
  public getEffect(): PartialMapLevelModifier["adjustments"]
  {
    if (this.template.mapLevelModifiers)
    {
      const ownModifiersAffectingLocalStar = this.template.mapLevelModifiers.filter(modifier => modifier.propagations.localStar);
      const localStarModifiers = flatten2dArray(ownModifiersAffectingLocalStar.map(modifier => modifier.propagations.localStar));
      const localStarAdjustments = localStarModifiers.filter(modifier => modifier.self && modifier.self.adjustments).map(modifier =>
      {
        return modifier.self.adjustments;
      });

      if (localStarAdjustments.length === 0)
      {
        return {};
      }
      else
      {
        const squashedLocalStarAdjustments = squashAdjustmentsObjects(...localStarAdjustments);

        return squashedLocalStarAdjustments;
      }

    }
    else
    {
      return {};
    }
  }
  public handleDestroy(): void
  {
    this.modifiers.handleDestroy();
  }
  public serialize(): BuildingSaveData
  {
    return(
    {
      templateType: this.template.type,
      id: this.id,

      locationId: this.location.id,
      controllerId: this.controller.id,

      totalCost: this.totalCost,
    });
  }
}
