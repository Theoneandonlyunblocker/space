module Rance
{
  export interface ITemplates
  {
    Abilities:
    {
      [type: string]: Templates.IAbilityTemplate;
    };
    AttitudeModifiers:
    {
      [type: string]: Templates.IAttitudeModifierTemplate;
    };
    BattleSFX:
    {
      [type: string]: Templates.IAbilityTemplate;
    };
    Buildings:
    {
      [type: string]: Templates.IBuildingTemplate;
    };
    Effects:
    {
      [type: string]: Templates.IEffectTemplate;
    };
    Items:
    {
      [type: string]: Templates.IItemTemplate;
    };
    PassiveSkills:
    {
      [type: string]: Templates.IPassiveSkillTemplate;
    };
    Personalities:
    {
      [type: string]: IPersonality;
    };
    Resources:
    {
      [type: string]: Templates.IResourceTemplate;
    };
    StatusEffects:
    {
      [type: string]: Templates.IStatusEffectTemplate;
    };
    SubEmblems:
    {
      [type: string]: Templates.ISubEmblemTemplate;
    };
    UnitFamilies:
    {
      [type: string]: Templates.IUnitFamily;
    };
    Units:
    {
      [type: string]: Templates.IUnitTemplate;
    };
  }

  export interface IModuleMetaData
  {
    name: string;
    version: string;
    author: string;
    description: string;
  }

  export interface IModuleFile
  {
    metaData: IModuleMetaData;
    constructModule: (ModuleData: ModuleData) => ModuleData;
  }

  export class ModuleData
  {
    metaData: IModuleMetaData

    mapBackgroundDrawingFunction: (map: GalaxyMap, renderer: PIXI.SystemRenderer) => PIXI.Container;
    starBackgroundDrawingFunction: (star: Star, renderer: PIXI.SystemRenderer) => PIXI.Container;

    mapRendererLayers: IMapRendererLayer[];
    mapRendererMapModes: IMapRendererMapMode[];

    Templates: ITemplates =
    {
      Abilities: {},
      AttitudeModifiers: {},
      BattleSFX: {},
      Buildings: {},
      Effects: {},
      Items: {},
      PassiveSkills: {},
      Personalities: {},
      Resources: {},
      StatusEffects: {},
      SubEmblems: {},
      UnitFamilies: {},
      Units: {}
    };

    mapGenerators:
    {
      [key: string]: Templates.IMapGenTemplate;
    } = {};

    constructor()
    {
      
    }

    copyTemplates(source: any, category: string)
    {
      if (!this.Templates[category])
      {
        console.warn("Tried to copy templates in invalid category \"" + category +
          "\". Category must be one of: " + Object.keys(this.Templates).join(", "));
        return;
      }

      for (var templateType in source)
      {
        if (this.Templates[category][templateType])
        {
          console.warn("Duplicate template identifier for " + templateType + " in " + category);
          continue;
        }
        this.Templates[category][templateType] = source[templateType];
      }
    }
    copyAllTemplates(source: any)
    {
      for (var category in this.Templates)
      {
        if (source[category])
        {
          this.copyTemplates(source[category], category);
        }
      }
    }
  }
}
