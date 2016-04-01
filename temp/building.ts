/// <reference path="templateinterfaces/ibuildingtemplate.d.ts" />
/// <reference path="savedata/ibuildingsavedata.d.ts" />

/// <reference path="star.ts" />
/// <reference path="player.ts" />

namespace Rance
{
  export interface IBuildingUpgradeData
  {
    template: Templates.IBuildingTemplate;
    level: number;
    cost: number;
    parentBuilding: Building;
  }
  export class Building
  {
    template: Templates.IBuildingTemplate;
    id: number;

    location: Star;
    controller: Player;

    upgradeLevel: number;
    totalCost: number;

    constructor(props:
    {
      template: Templates.IBuildingTemplate;

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
    getEffect(effect: Templates.IBuildingEffect = {})
    {
      if (!this.template.effect) return {};

      var multiplier = this.template.effectMultiplierFN ?
        this.template.effectMultiplierFN(this.upgradeLevel) :
        this.upgradeLevel;

      for (var key in this.template.effect)
      {
        var prop = this.template.effect[key];
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
          for (var key2 in prop)
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
      var self = this;
      var upgrades: IBuildingUpgradeData[] = [];

      if (this.upgradeLevel < this.template.maxUpgradeLevel)
      {
        upgrades.push(
        {
          template: this.template,
          level: this.upgradeLevel + 1,
          cost: this.template.buildCost * (this.upgradeLevel + 1),
          parentBuilding: this
        });
      }
      else if (this.template.upgradeInto && this.template.upgradeInto.length > 0)
      {
        var templatedUpgrades = this.template.upgradeInto.map(function(upgradeData)
        {
          var template = app.moduleData.Templates.Buildings[upgradeData.templateType];
          return(
          {
            level: upgradeData.level,
            template: template,
            cost: template.buildCost,
            parentBuilding: self
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
      var oldController = this.controller;
      if (oldController === newController) return;


      this.controller = newController;
      this.location.updateController();
    }
    serialize()
    {
      var data: IBuildingSaveData =
      {
        templateType: this.template.type,
        id: this.id,

        locationId: this.location.id,
        controllerId: this.controller.id,

        upgradeLevel: this.upgradeLevel,
        totalCost: this.totalCost
      };

      return data;
    }
  }
}
