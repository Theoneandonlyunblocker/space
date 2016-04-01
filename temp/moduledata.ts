/// <reference path="ruleset.ts" />

export interface ITemplates
{
  Abilities:
  {
    [type: string]: AbilityTemplate;
  };
  AttitudeModifiers:
  {
    [type: string]: AttitudeModifierTemplate;
  };
  BattleSFX:
  {
    [type: string]: BattleSFXTemplate;
  };
  Buildings:
  {
    [type: string]: BuildingTemplate;
  };
  Cultures:
  {
    [key: string]: CultureTemplate;
  };
  EffectActions:
  {
    [type: string]: EffectActionTemplate;
  };
  Items:
  {
    [type: string]: ItemTemplate;
  };
  MapGen:
  {
    [type: string]: MapGenTemplate;
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
    [key: string]: NotificationTemplate;
  };
  // shouldnt probably touch this either
  Objectives:
  {
    [key: string]: ObjectiveTemplate;
  }
  PassiveSkills:
  {
    [type: string]: PassiveSkillTemplate;
  };
  Personalities:
  {
    [type: string]: IPersonality;
  };
  Resources:
  {
    [type: string]: ResourceTemplate;
  };
  StatusEffects:
  {
    [type: string]: StatusEffectTemplate;
  };
  SubEmblems:
  {
    [type: string]: SubEmblemTemplate;
  };
  Technologies:
  {
    [key: string]: TechnologyTemplate;
  };
  UnitArchetypes:
  {
    [type: string]: UnitArchetype;
  };
  UnitFamilies:
  {
    [type: string]: UnitFamily;
  };
  Units:
  {
    [type: string]: UnitTemplate;
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
    EffectActions: {},
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

  defaultMap: MapGenTemplate;
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
  getDefaultMap(): MapGenTemplate
  {
    if (this.defaultMap) return this.defaultMap;
    else if (Object.keys(this.Templates.MapGen).length > 0)
    {
      return getRandomProperty(this.Templates.MapGen);
    }
    else throw new Error("Module has no maps registered");
  }
}
