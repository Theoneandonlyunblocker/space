/// <reference path="../data/templates/buildingtemplates.ts" />

/// <reference path="star.ts" />
/// <reference path="player.ts" />

module Rance
{
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
    getPossibleUpgrades()
    {
      var upgrades:
      {
        template: Templates.IBuildingTemplate;
        level: number;
        cost: number;
      }[] = [];

      if (this.upgradeLevel < this.template.maxUpgradeLevel)
      {
        upgrades.push(
        {
          template: this.template,
          level: this.upgradeLevel + 1,
          cost: this.template.buildCost * (this.upgradeLevel + 1)
        });
      }
      else if (this.template.upgradeInto && this.template.upgradeInto.length > 0)
      {
        var templatedUpgrades = this.template.upgradeInto.map(function(upgradeData)
        {
          var template = Templates.Buildings[upgradeData.type];
          return(
          {
            level: upgradeData.level,
            template: template,
            cost: template.buildCost
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
      var data: any = {};

      data.templateType = this.template.type;
      data.id = this.id;

      data.locationId = this.location.id;
      data.controllerId = this.controller.id;

      data.upgradeLevel = this.upgradeLevel;
      data.totalCost = this.totalCost;

      return data;
    }
  }
}
