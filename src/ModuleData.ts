import Personality from "../src/Personality";
import TemplateCollection from "../src/templateinterfaces/TemplateCollection";
import BackgroundDrawingFunction from "./BackgroundDrawingFunction";
import ModuleFile from "./ModuleFile";
import ModuleScripts from "./ModuleScripts";
import RuleSetValues from "./RuleSetValues";

import
{
  deepMerge,
  getRandomProperty,
} from "./utility";

import AITemplateConstructor from "./templateinterfaces/AITemplateConstructor";
import AbilityTemplate from "./templateinterfaces/AbilityTemplate";
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

interface Templates
{
  Abilities: TemplateCollection<AbilityTemplate>;
  AITemplateConstructors: TemplateCollection<AITemplateConstructor<any>>;
  AttitudeModifiers: TemplateCollection<AttitudeModifierTemplate>;
  BattleSFX: TemplateCollection<BattleSFXTemplate>;
  Buildings: TemplateCollection<BuildingTemplate>;
  Items: TemplateCollection<ItemTemplate>;
  MapGen: TemplateCollection<MapGenTemplate>;
  MapRendererLayers: TemplateCollection<MapRendererLayerTemplate>;
  MapRendererMapModes: TemplateCollection<MapRendererMapModeTemplate>;
  Notifications: TemplateCollection<NotificationTemplate>;
  PassiveSkills: TemplateCollection<PassiveSkillTemplate>;
  Personalities: TemplateCollection<Personality>;
  Portraits: TemplateCollection<PortraitTemplate>;
  Races: TemplateCollection<RaceTemplate>;
  Resources: TemplateCollection<ResourceTemplate>;
  StatusEffects: TemplateCollection<StatusEffectTemplate>;
  SubEmblems: TemplateCollection<SubEmblemTemplate>;
  Technologies: TemplateCollection<TechnologyTemplate>;
  UnitArchetypes: TemplateCollection<UnitArchetype>;
  Units: TemplateCollection<UnitTemplate>;
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
    Units: {},
  };

  public ruleSet: RuleSetValues = {};

  public scripts: ModuleScripts;

  defaultMap: MapGenTemplate;

  constructor()
  {
    this.scripts = new ModuleScripts();
  }
  public copyTemplates<T>(source: TemplateCollection<T>, category: keyof Templates): void
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
      // TODO 05.02.2017 | bad typing
      this.Templates[category][templateType] = <any>source[templateType];
    }
  }
  public copyAllTemplates(source: Templates): void
  {
    for (let category in this.Templates)
    {
      if (source[category])
      {
        this.copyTemplates(source[category], <keyof Templates>category);
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
