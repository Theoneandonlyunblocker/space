

import app from "./App"; // TODO global
import BuildingUpgradeData from "./BuildingUpgradeData";
import idGenerators from "./idGenerators";
import BuildingSaveData from "./savedata/BuildingSaveData";
import BuildingEffect from "./templateinterfaces/BuildingEffect";
import BuildingTemplate from "./templateinterfaces/BuildingTemplate";

import Player from "./Player";
import Star from "./Star";

export default class Building
{
  template: BuildingTemplate;
  id: number;

  location: Star;
  controller: Player;

  upgradeLevel: number;
  totalCost: number;

  constructor(props:
  {
    template: BuildingTemplate;

    location: Star;
    controller?: Player;

    upgradeLevel?: number;
    totalCost?: number;

    id?: number;
  })
  {
    this.template = props.template;
    this.id = (props.id && isFinite(props.id)) ?
      props.id : idGenerators.building++;
    this.location = props.location;
    this.controller = props.controller || this.location.owner;
    this.upgradeLevel = props.upgradeLevel || 1;
    this.totalCost = props.totalCost || this.template.buildCost || 0;
  }
  getEffect(effect: BuildingEffect = {})
  {
    if (!this.template.effect) return {};

    const multiplier = this.template.effectMultiplierFN ?
      this.template.effectMultiplierFN(this.upgradeLevel) :
      this.upgradeLevel;

    for (let key in this.template.effect)
    {
      const prop = this.template.effect[key];
      if (isFinite(prop))
      {
        if (!effect[key])
        {
          effect[key] = 0;
        }
        effect[key] += prop * multiplier;
      }
      else
      {
        if (!effect[key])
        {
          effect[key] = {};
        }
        for (let key2 in prop)
        {
          if (!effect[key][key2])
          {
            effect[key][key2] = 0;
          }
          effect[key][key2] += prop[key2] * multiplier;
        }
      }
    }

    return effect;
  }
  getPossibleUpgrades()
  {
    const self = this;
    let upgrades: BuildingUpgradeData[] = [];

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
      const templatedUpgrades = this.template.upgradeInto.map(function(upgradeData)
      {
        const template = activeModuleData.Templates.Buildings[upgradeData.templateType];
        return(
        {
          level: upgradeData.level,
          template: template,
          cost: template.buildCost,
          parentBuilding: self,
        });
      });

      upgrades = upgrades.concat(templatedUpgrades);
    }

    return upgrades;
  }
  upgrade()
  {

  }
  setController(newController: Player)
  {
    const oldController = this.controller;
    if (oldController === newController) return;


    this.controller = newController;
    this.location.updateController();
  }
  serialize()
  {
    const data: BuildingSaveData =
    {
      templateType: this.template.type,
      id: this.id,

      locationId: this.location.id,
      controllerId: this.controller.id,

      upgradeLevel: this.upgradeLevel,
      totalCost: this.totalCost,
    };

    return data;
  }
}
