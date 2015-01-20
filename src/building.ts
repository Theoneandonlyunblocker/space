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

    constructor(props:
    {
      template: Templates.IBuildingTemplate;

      location: Star;
      controller?: Player;

      upgradeLevel?: number;
      id?: number;
    })
    {
      this.template = props.template;
      this.id = (props.id && isFinite(props.id)) ?
        props.id : idGenerators.building++;
      this.location = props.location;
      this.controller = props.controller || this.location.owner;
      this.upgradeLevel = props.upgradeLevel || 1;
    }
    getPossibleUpgrades()
    {
      var upgrades:
      {
        type: string;
        level: number;
      }[] = [];

      if (this.upgradeLevel < this.template.maxUpgradeLevel)
      {
        upgrades.push(
        {
          type: this.template.type,
          level: this.upgradeLevel + 1
        });
      }
      else if (this.template.upgradeInto)
      {
        upgrades = upgrades.concat(this.template.upgradeInto);
      }

      return upgrades;
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

      return data;
    }
  }
}
