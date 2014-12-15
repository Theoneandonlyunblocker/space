/// <reference path="unit.ts"/>

module Rance
{
  export class UnitState
  {
    id: number;

    maxStrength: number;
    currentStrength: number;

    maxActionPoints: number;
    currentActionPoints: number;

    attack: number;
    defence: number;
    intelligence: number;
    speed: number;

    moveDelay: number;
    side: string;
    position: number[];

    guardValue: number;
    guardCoverage: string;

    abilities: Templates.AbilityTemplate[] = [];


    getAllAbilities: () => Templates.AbilityTemplate[];

    constructor(unit: Unit)
    {
      this.id = unit.id;

      this.maxStrength = unit.maxStrength;
      this.currentStrength = unit.currentStrength;

      this.maxActionPoints = unit.maxActionPoints;
      this.currentActionPoints = unit.battleStats.currentActionPoints;

      this.attack = unit.attributes.attack;
      this.defence = unit.attributes.defence;
      this.intelligence = unit.attributes.intelligence;
      this.speed = unit.attributes.speed;

      this.moveDelay = unit.battleStats.moveDelay;
      this.side = unit.battleStats.side;
      this.position = unit.battleStats.position;

      this.guardValue = unit.battleStats.guard.value;
      this.guardCoverage = unit.battleStats.guard.coverage;

      this.getAllAbilities = unit.getAllAbilities.bind(unit);
    }
  }
}