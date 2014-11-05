/// <reference path="../data/templates/typetemplates.ts" />

module Rance
{
  export class Unit
  {
    name: string;
    maxStrength: number;
    currentStrength: number;
    isSquadron: boolean;
    template: Templates.TypeTemplate;
    constructor(template: Templates.TypeTemplate)
    {
      this.template = template;
      this.name = template.typeName;
      this.isSquadron = template.isSquadron;
      this.setValues();
    }
    setValues()
    {
      var template = this.template;

      this.maxStrength = template.maxStrength * 1000;
      this.currentStrength = this.maxStrength;
    }
  }
}
