/// <reference path="ruleset.ts" />

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
      [type: string]: Templates.IBattleSFXTemplate;
    };
    Buildings:
    {
      [type: string]: Templates.IBuildingTemplate;
    };
    Cultures:
    {
      [key: string]: Templates.ICultureTemplate;
    };
    Effects:
    {
      [type: string]: Templates.IEffectTemplate;
    };
    Items:
    {
      [type: string]: Templates.IItemTemplate;
    };
    MapGen:
    {
      [type: string]: Templates.IMapGenTemplate;
    };
    // recommend not touching these 2 too much as they are likely to change and stupid anyway
    MapRendererLayers:
    {
      [layerKey: string]: IMapRendererLayerTemplate;
    };
    MapRendererMapModes:
    {
      [mapModeKey: string]: IMapRendererMapModeTemplate;
    };
    // can touch again
    Notifications:
    {
      [key: string]: Templates.INotificationTemplate;
    };
    // shouldnt probably touch this either
    Objectives:
    {
      [key: string]: Templates.IObjectiveTemplate;
    }
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
    Technologies:
    {
      [key: string]: Templates.ITechnologyTemplate;
    };
    UnitArchetypes:
    {
      [type: string]: Templates.IUnitArchetype;
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
    key: string;
    metaData: IModuleMetaData;
    loadAssets: (callback: Function) => void;
    constructModule: (ModuleData: ModuleData) => ModuleData;
    ruleSet?: IModuleRuleSet;
  }

  export class ModuleData
  {
    private subModuleMetaData: IModuleMetaData[] = [];

    mapBackgroundDrawingFunction: (seed: string,
      renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer) => PIXI.DisplayObject;
    starBackgroundDrawingFunction: (seed: string,
      renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer) => PIXI.DisplayObject;

    mapRendererLayers:
    {
      [layerKey: string]: IMapRendererLayerTemplate;
    } = {};
    mapRendererMapModes:
    {
      [mapModeKey: string]: IMapRendererMapModeTemplate;
    } = {};

    Templates: ITemplates =
    {
      Abilities: {},
      AttitudeModifiers: {},
      BattleSFX: {},
      Buildings: {},
      Cultures: {},
      Effects: {},
      Items: {},
      MapGen: {},
      MapRendererLayers: {},
      MapRendererMapModes: {},
      Notifications: {},
      Objectives: {},
      PassiveSkills: {},
      Personalities: {},
      Resources: {},
      StatusEffects: {},
      SubEmblems: {},
      Technologies: {},
      UnitArchetypes: {},
      UnitFamilies: {},
      Units: {}
    };

    defaultMap: Templates.IMapGenTemplate;
    ruleSet: IModuleRuleSet = extendObject(defaultRuleSet);

    constructor()
    {
      
    }
    copyTemplates(source: any, category: string): void
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
    copyAllTemplates(source: any): void
    {
      for (var category in this.Templates)
      {
        if (source[category])
        {
          this.copyTemplates(source[category], category);
        }
      }
    }
    addSubModule(moduleFile: IModuleFile): void
    {
      this.subModuleMetaData.push(moduleFile.metaData);
    }
    getDefaultMap(): Templates.IMapGenTemplate
    {
      if (this.defaultMap) return this.defaultMap;
      else if (Object.keys(this.Templates.MapGen).length > 0)
      {
        return getRandomProperty(this.Templates.MapGen);
      }
      else throw new Error("Module has no maps registered");
    }
  }
}
