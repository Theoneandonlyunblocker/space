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
    MapGen:
    {
      [type: string]: Templates.IMapGenTemplate;
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
    metaData: IModuleMetaData;
    constructModule: (ModuleData: ModuleData) => ModuleData;
  }

  export class ModuleData
  {
    private subModuleMetaData: IModuleMetaData[] = [];

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
      MapGen: {},
      PassiveSkills: {},
      Personalities: {},
      Resources: {},
      StatusEffects: {},
      SubEmblems: {},
      UnitArchetypes: {},
      UnitFamilies: {},
      Units: {}
    };

    defaultMap: Templates.IMapGenTemplate;

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
