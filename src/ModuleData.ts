/// <reference path="RuleSet.ts" />
import ModuleFile from "./ModuleFile.d.ts";
import Personality from "../src/Personality.d.ts";
import TemplateCollection from "../src/templateinterfaces/TemplateCollection.d.ts";
import
{
  default as RuleSet,
  defaultRuleSet
} from "./RuleSet.ts";

import
{
  extendObject,
  getRandomProperty
} from "./utility.ts";

import AbilityTemplate from "./templateinterfaces/AbilityTemplate.d.ts";
import AttitudeModifierTemplate from "./templateinterfaces/AttitudeModifierTemplate.d.ts";
import BattleSFXTemplate from "./templateinterfaces/BattleSFXTemplate.d.ts";
import BuildingTemplate from "./templateinterfaces/BuildingTemplate.d.ts";
import EffectActionTemplate from "./templateinterfaces/EffectActionTemplate.d.ts";
import ItemTemplate from "./templateinterfaces/ItemTemplate.d.ts";
import MapGenTemplate from "./templateinterfaces/MapGenTemplate.d.ts";
import CultureTemplate from "./templateinterfaces/CultureTemplate.d.ts";
import MapRendererLayerTemplate from "./templateinterfaces/MapRendererLayerTemplate.d.ts";
import MapRendererMapModeTemplate from "./templateinterfaces/MapRendererMapModeTemplate.d.ts"
import NotificationTemplate from "./templateinterfaces/NotificationTemplate.d.ts"
import ObjectiveTemplate from "./templateinterfaces/ObjectiveTemplate.d.ts"
import PassiveSkillTemplate from "./templateinterfaces/PassiveSkillTemplate.d.ts"
import ResourceTemplate from "./templateinterfaces/ResourceTemplate.d.ts"
import StatusEffectTemplate from "./templateinterfaces/StatusEffectTemplate.d.ts"
import SubEmblemTemplate from "./templateinterfaces/SubEmblemTemplate.d.ts"
import TechnologyTemplate from "./templateinterfaces/TechnologyTemplate.d.ts"
import UnitArchetype from "./templateinterfaces/UnitArchetype.d.ts"
import UnitFamily from "./templateinterfaces/UnitFamily.d.ts"
import UnitTemplate from "./templateinterfaces/UnitTemplate.d.ts"


interface Templates
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
    [layerKey: string]: MapRendererLayerTemplate;
  };
  MapRendererMapModes:
  {
    [mapModeKey: string]: MapRendererMapModeTemplate;
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
    [type: string]: Personality;
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

export default class ModuleData
{
  private subModuleFiles: ModuleFile[] = [];

  mapBackgroundDrawingFunction: (seed: string,
    renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer) => PIXI.DisplayObject;
  starBackgroundDrawingFunction: (seed: string,
    renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer) => PIXI.DisplayObject;

  // TODO refactor | unused?
  // mapRendererLayers:
  // {
  //   [layerKey: string]: MapRendererLayerTemplate;
  // } = {};
  // mapRendererMapModes:
  // {
  //   [mapModeKey: string]: MapRendererMapModeTemplate;
  // } = {};

  Templates: Templates =
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
  ruleSet: RuleSet = extendObject(defaultRuleSet);

  constructor()
  {
    
  }
  public copyTemplates<T>(source: TemplateCollection<T>, category: string): void
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
  public copyAllTemplates(source: Templates): void
  {
    for (var category in this.Templates)
    {
      if (source[category])
      {
        this.copyTemplates(source[category], category);
      }
    }
  }
  public addSubModule(moduleFile: ModuleFile): void
  {
    this.subModuleFiles.push(moduleFile);
  }
  public getDefaultMap(): MapGenTemplate
  {
    if (this.defaultMap) return this.defaultMap;
    else if (Object.keys(this.Templates.MapGen).length > 0)
    {
      return getRandomProperty(this.Templates.MapGen);
    }
    else throw new Error("Module has no maps registered");
  }
}
