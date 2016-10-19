import ModuleFile from "./ModuleFile";
import BackgroundDrawingFunction from "./BackgroundDrawingFunction";
import Personality from "../src/Personality";
import TemplateCollection from "../src/templateinterfaces/TemplateCollection";
import RuleSetValues from "./RuleSetValues";
import ModuleScripts from "./ModuleScripts";

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
import ItemTemplate from "./templateinterfaces/ItemTemplate";
import MapGenTemplate from "./templateinterfaces/MapGenTemplate";
import MapRendererLayerTemplate from "./templateinterfaces/MapRendererLayerTemplate";
import MapRendererMapModeTemplate from "./templateinterfaces/MapRendererMapModeTemplate";
import NotificationTemplate from "./templateinterfaces/NotificationTemplate";
import PassiveSkillTemplate from "./templateinterfaces/PassiveSkillTemplate";
import PortraitTemplate from "./templateinterfaces/PortraitTemplate";
import {RaceTemplate} from "./templateinterfaces/RaceTemplate";
import ResourceTemplate from "./templateinterfaces/ResourceTemplate";
import StatusEffectTemplate from "./templateinterfaces/StatusEffectTemplate";
import SubEmblemTemplate from "./templateinterfaces/SubEmblemTemplate";
import TechnologyTemplate from "./templateinterfaces/TechnologyTemplate";
import UnitArchetype from "./templateinterfaces/UnitArchetype";
import UnitTemplate from "./templateinterfaces/UnitTemplate";


type TemplateKey =
  "Abilities" |
  "AITemplateConstructors" |
  "AttitudeModifiers" |
  "BattleSFX" |
  "Buildings" |
  "Items" |
  "MapGen" |
  "MapRendererLayers" |
  "MapRendererMapModes" |
  "Notifications" |
  "PassiveSkills" |
  "Personalities" |
  "Portraits" |
  "Races" |
  "Resources" |
  "StatusEffects" |
  "SubEmblems" |
  "Technologies" |
  "UnitArchetypes" |
  "Units";

type TemplateIndex<T> = {[type: string]: T}

interface Templates
{
  Abilities: TemplateIndex<AbilityTemplate>;
  AITemplateConstructors: TemplateIndex<AITemplateConstructor<any>>;
  AttitudeModifiers: TemplateIndex<AttitudeModifierTemplate>;
  BattleSFX: TemplateIndex<BattleSFXTemplate>;
  Buildings: TemplateIndex<BuildingTemplate>;
  Items: TemplateIndex<ItemTemplate>;
  MapGen: TemplateIndex<MapGenTemplate>;
  MapRendererLayers: TemplateIndex<MapRendererLayerTemplate>;
  MapRendererMapModes: TemplateIndex<MapRendererMapModeTemplate>;
  Notifications: TemplateIndex<NotificationTemplate>;
  PassiveSkills: TemplateIndex<PassiveSkillTemplate>;
  Personalities: TemplateIndex<Personality>;
  Portraits: TemplateIndex<PortraitTemplate>;
  Races: TemplateIndex<RaceTemplate>;
  Resources: TemplateIndex<ResourceTemplate>;
  StatusEffects: TemplateIndex<StatusEffectTemplate>;
  SubEmblems: TemplateIndex<SubEmblemTemplate>;
  Technologies: TemplateIndex<TechnologyTemplate>;
  UnitArchetypes: TemplateIndex<UnitArchetype>;
  Units: TemplateIndex<UnitTemplate>;
}

export default class ModuleData
{
  private subModuleFiles: ModuleFile[] = [];

  mapBackgroundDrawingFunction: BackgroundDrawingFunction; 
  starBackgroundDrawingFunction: BackgroundDrawingFunction; 

  public Templates: Templates =
  {
    Abilities: {},
    AITemplateConstructors: {},
    AttitudeModifiers: {},
    BattleSFX: {},
    Buildings: {},
    Items: {},
    MapGen: {},
    MapRendererLayers: {},
    MapRendererMapModes: {},
    Notifications: {},
    PassiveSkills: {},
    Personalities: {},
    Portraits: {},
    Races: {},
    Resources: {},
    StatusEffects: {},
    SubEmblems: {},
    Technologies: {},
    UnitArchetypes: {},
    Units: {}
  };
  
  public ruleSet: RuleSetValues = {};

  public scripts: ModuleScripts;

  defaultMap: MapGenTemplate;

  constructor()
  {
    this.scripts = new ModuleScripts();
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
