import Personality from "../src/Personality";
import TemplateCollection from "../src/templateinterfaces/TemplateCollection";
import BackgroundDrawingFunction from "./BackgroundDrawingFunction";
import ModuleFile from "./ModuleFile";
import ModuleScripts from "./ModuleScripts";
import
{
  PartialRuleSetValues,
  RuleSetValues,
} from "./RuleSetValues";

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
import SubEmblemTemplate from "./templateinterfaces/SubEmblemTemplate";
import TechnologyTemplate from "./templateinterfaces/TechnologyTemplate";
import {TerrainTemplate} from "./templateinterfaces/TerrainTemplate";
import UnitArchetype from "./templateinterfaces/UnitArchetype";
import UnitEffectTemplate from "./templateinterfaces/UnitEffectTemplate";
import UnitTemplate from "./templateinterfaces/UnitTemplate";

// tslint:disable:no-any
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
  Notifications: TemplateCollection<NotificationTemplate<any, any>>;
  PassiveSkills: TemplateCollection<PassiveSkillTemplate>;
  Personalities: TemplateCollection<Personality>;
  Portraits: TemplateCollection<PortraitTemplate>;
  Races: TemplateCollection<RaceTemplate>;
  Resources: TemplateCollection<ResourceTemplate>;
  SubEmblems: TemplateCollection<SubEmblemTemplate>;
  Technologies: TemplateCollection<TechnologyTemplate>;
  Terrains: TemplateCollection<TerrainTemplate>;
  UnitArchetypes: TemplateCollection<UnitArchetype>;
  UnitEffects: TemplateCollection<UnitEffectTemplate>;
  Units: TemplateCollection<UnitTemplate>;
}
// tslint:enable:no-any

export default class ModuleData
{
  public moduleFiles: ModuleFile[] = [];

  public mapBackgroundDrawingFunction: BackgroundDrawingFunction;
  public starBackgroundDrawingFunction: BackgroundDrawingFunction;

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
    SubEmblems: {},
    Technologies: {},
    Terrains: {},
    UnitArchetypes: {},
    UnitEffects: {},
    Units: {},
  };

  public ruleSet: RuleSetValues;

  public scripts: ModuleScripts;

  public defaultMap: MapGenTemplate;

  constructor()
  {
    this.scripts = new ModuleScripts();
  }
  public copyTemplates<T>(source: TemplateCollection<T>, category: keyof Templates): void
  {
    if (!this.Templates[category])
    {
      console.warn(`Tried to copy templates in invalid category "${category}". Category must be one of: ${Object.keys(this.Templates).join(", ")}`);

      return;
    }

    for (let templateType in source)
    {
      if (this.Templates[category][templateType])
      {
        console.warn(`Duplicate template identifier for ${templateType} in ${category}`);
        continue;
      }
      // TODO 2017.02.05 | bad typing
      this.Templates[category][templateType] = <any> source[templateType];
    }
  }
  public copyAllTemplates(source: Templates): void
  {
    for (let category in this.Templates)
    {
      if (source[category])
      {
        this.copyTemplates(source[category], <keyof Templates> category);
      }
    }
  }
  public addSubModule(moduleFile: ModuleFile): void
  {
    this.moduleFiles.push(moduleFile);
  }
  public getDefaultMap(): MapGenTemplate
  {
    if (this.defaultMap)
    {
      return this.defaultMap;
    }
    else if (Object.keys(this.Templates.MapGen).length > 0)
    {
      return getRandomProperty(this.Templates.MapGen);
    }
    else
    {
      throw new Error("No modules have map generators registered.");
    }
  }
  public appendRuleSet(valuesToAppend: PartialRuleSetValues): void
  {
    if (!this.ruleSet)
    {
      throw new Error("Set ModuleData.ruleSet first");
    }

    this.ruleSet = deepMerge(this.ruleSet, valuesToAppend);
  }
}
