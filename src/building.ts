/// <reference path="../data/templates/buildingtemplates.ts" />

/// <reference path="star.ts" />
/// <reference path="player.ts" />

module Rance
{
  export class Building
  {
    template: Templates.IBuildingTemplate;

    location: Star;
    controller: Player;

    upgradeLevel: number;

    constructor(props:
    {
      template: Templates.IBuildingTemplate;

      location: Star;
      controller?: Player;

      upgradeLevel?: number;
    })
    {
      this.template = props.template;
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
      if (this.template.upgradeInto)
      {
        upgrades = upgrades.concat(this.template.upgradeInto);
      }

      if (this.upgradeLevel < this.template.maxUpgradeLevel)
      {
        upgrades.push(
        {
          type: this.template.type,
          level: this.upgradeLevel + 1
        });
      }

      return upgrades;
    }
  }
}
