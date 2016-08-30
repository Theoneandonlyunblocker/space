import ModuleFile from "./ModuleFile";
import BackgroundDrawingFunction from "./BackgroundDrawingFunction";
import Personality from "../src/Personality";
import TemplateCollection from "../src/templateinterfaces/TemplateCollection";
import RuleSetValues from "./RuleSetValues";

import
{
  getRandomProperty,
  deepMerge
} from "./utility";

import AbilityTemplate from "./templateinterfaces/AbilityTemplate";
import AITemplateConstructor from "./templateinterfaces/AITemplateConstructor";
import AttitudeModifierTemplate from "./templateinterfaces/AttitudeModifierTemplate";
import BattleSFXTemplate from "./templateinterfaces/BattleSFXTemplate";
import BuildingTemplate from "./templateinterfaces/BuildingTemplate";
import EffectActionTemplate from "./templateinterfaces/EffectActionTemplate";
import ItemTemplate from "./templateinterfaces/ItemTemplate";
import MapGenTemplate from "./templateinterfaces/MapGenTemplate";
import CultureTemplate from "./templateinterfaces/CultureTemplate";
import MapRendererLayerTemplate from "./templateinterfaces/MapRendererLayerTemplate";
import MapRendererMapModeTemplate from "./templateinterfaces/MapRendererMapModeTemplate";
import NotificationTemplate from "./templateinterfaces/NotificationTemplate";
import PassiveSkillTemplate from "./templateinterfaces/PassiveSkillTemplate";
import RaceTemplate from "./templateinterfaces/RaceTemplate";
import ResourceTemplate from "./templateinterfaces/ResourceTemplate";
import StatusEffectTemplate from "./templateinterfaces/StatusEffectTemplate";
import SubEmblemTemplate from "./templateinterfaces/SubEmblemTemplate";
import TechnologyTemplate from "./templateinterfaces/TechnologyTemplate";
import UnitArchetype from "./templateinterfaces/UnitArchetype";
import UnitFamily from "./templateinterfaces/UnitFamily";
import UnitTemplate from "./templateinterfaces/UnitTemplate";

type TemplateKey =
  "Abilities" |
  "AITemplateConstructors" |
  "AttitudeModifiers" |
  "BattleSFX" |
  "Buildings" |
  "Cultures" |
  "EffectActions" |
  "Items" |
  "MapGen" |
  "MapRendererLayers" |
  "MapRendererMapModes" |
  "Notifications" |
  "PassiveSkills" |
  "Personalities" |
  "Races" |
  "Resources" |
  "StatusEffects" |
  "SubEmblems" |
  "Technologies" |
  "UnitArchetypes" |
  "UnitFamilies" |
  "Units";


interface Templates
{
  Abilities:
  {
    [type: string]: AbilityTemplate;
  };
  AITemplateConstructors:
  {
    [type: string]: AITemplateConstructor<any>;
  }
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
  MapRendererLayers:
  {
    [layerKey: string]: MapRendererLayerTemplate;
  };
  MapRendererMapModes:
  {
    [mapModeKey: string]: MapRendererMapModeTemplate;
  };
  Notifications:
  {
    [key: string]: NotificationTemplate;
  };
  PassiveSkills:
  {
    [type: string]: PassiveSkillTemplate;
  };
  Personalities:
  {
    [type: string]: Personality;
  };
  Races:
  {
    [key: string]: RaceTemplate;
  }
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

  mapBackgroundDrawingFunction: BackgroundDrawingFunction; 
  starBackgroundDrawingFunction: BackgroundDrawingFunction; 

  Templates: Templates =
  {
    Abilities: {},
    AITemplateConstructors: {},
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
    PassiveSkills: {},
    Personalities: {},
    Races: {},
    Resources: {},
    StatusEffects: {},
    SubEmblems: {},
    Technologies: {},
    UnitArchetypes: {},
    UnitFamilies: {},
    Units: {}
  };
  
  public ruleSet: RuleSetValues = {};

  defaultMap: MapGenTemplate;

  constructor()
  {
    
  }
  public copyTemplates<T>(source: TemplateCollection<T>, category: TemplateKey): void
  {
    if (!this.Templates[category])
    {
      console.warn("Tried to copy templates in invalid category \"" + category +
        "\". Category must be one of: " + Object.keys(this.Templates).join(", "));
      return;
    }

    for (let templateType in source)
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
    for (let category in this.Templates)
    {
      if (source[category])
      {
        this.copyTemplates(source[category], <TemplateKey>category);
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
  public applyRuleSet(ruleSetValuesToCopy: RuleSetValues): void
  {
    this.ruleSet = deepMerge(this.ruleSet, ruleSetValuesToCopy);
  }
}
