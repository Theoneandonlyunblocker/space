import Personality from "../src/Personality";
import TemplateCollection from "../src/templateinterfaces/TemplateCollection";

import BackgroundDrawingFunction from "./BackgroundDrawingFunction";
import ModuleFile, { ModuleFileSaveData } from "./ModuleFile";
import ModuleScripts from "./ModuleScripts";
import
{
  PartialRuleSetValues,
  RuleSetValues,
} from "./RuleSetValues";
import AiTemplateConstructor from "./templateinterfaces/AITemplateConstructor";
import AbilityTemplate from "./templateinterfaces/AbilityTemplate";
import AttitudeModifierTemplate from "./templateinterfaces/AttitudeModifierTemplate";
import BattleSfxTemplate from "./templateinterfaces/BattleSfxTemplate";
import {BuildingTemplate} from "./templateinterfaces/BuildingTemplate";
import ItemTemplate from "./templateinterfaces/ItemTemplate";
import {Language} from "./localization/Language";
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
import
{
  deepMerge,
  getRandomProperty,
} from "./utility";
import { UnlockableThing } from "./templateinterfaces/UnlockableThing";


// tslint:disable:no-any
interface Templates
{
  Abilities: TemplateCollection<AbilityTemplate>;
  AiTemplateConstructors: TemplateCollection<AiTemplateConstructor<any>>;
  AttitudeModifiers: TemplateCollection<AttitudeModifierTemplate>;
  BattleSfx: TemplateCollection<BattleSfxTemplate>;
  Buildings: TemplateCollection<BuildingTemplate>;
  Items: TemplateCollection<ItemTemplate>;
  Languages: TemplateCollection<Language>;
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

type TechnologyUnlocks =
{
  [technologyKey: string]:
  {
    [techLevel: number]: UnlockableThing[];
  };
};

export default class ModuleData
{
  public moduleFiles: ModuleFile[] = [];

  public mapBackgroundDrawingFunction: BackgroundDrawingFunction;
  public starBackgroundDrawingFunction: BackgroundDrawingFunction;

  public templates: Templates =
  {
    Abilities: {},
    AiTemplateConstructors: {},
    AttitudeModifiers: {},
    BattleSfx: {},
    Buildings: {},
    Items: {},
    Languages: {},
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
  public defaultLanguage: Language;

  public get technologyUnlocks(): TechnologyUnlocks
  {
    if (this.technologyUnlocksAreDirty)
    {
      this.cachedTechnologyUnlocks = this.getAllTechnologyUnlocks();
    }

    return this.cachedTechnologyUnlocks;
  }

  private technologyUnlocksAreDirty: boolean = true;
  private cachedTechnologyUnlocks: TechnologyUnlocks = {};

  constructor()
  {
    this.scripts = new ModuleScripts();
  }
  public copyTemplates<T>(source: TemplateCollection<T>, category: keyof Templates): void
  {
    if (!this.templates[category])
    {
      console.warn(`Tried to copy templates in invalid category "${category}". Category must be one of: ${Object.keys(this.templates).join(", ")}`);

      return;
    }

    for (const templateType in source)
    {
      if (this.templates[category][templateType])
      {
        console.warn(`Duplicate template identifier for ${templateType} in ${category}`);
        continue;
      }
      // TODO 2017.02.05 | bad typing
      this.templates[category][templateType] = <any> source[templateType];
    }

    this.technologyUnlocksAreDirty = true;
  }
  public copyAllTemplates(source: Templates): void
  {
    for (const category in this.templates)
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
    else if (Object.keys(this.templates.MapGen).length > 0)
    {
      return getRandomProperty(this.templates.MapGen);
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
  public fetchLanguageForCode(languageCode: string): Language
  {
    const language = this.templates.Languages[languageCode];

    if (language)
    {
      return language;
    }
    else
    {
      const defaultLanguage = this.getDefaultLanguage();

      console.warn(`Desired language (code '${languageCode}') is not loaded. ` +
      `Falling back on default language '${defaultLanguage.code}'`);

      return defaultLanguage;
    }
  }
  public getDefaultLanguage(): Language
  {
    if (this.defaultLanguage)
    {
      return this.defaultLanguage;
    }
    else if (this.templates.Languages["en"])
    {
      return this.templates.Languages["en"];
    }
    else
    {
      throw new Error("Please define a default language for your module configuration if " +
        "it doesn't load the English language support module.");
    }
  }
  public serialize(): ModuleFileSaveData[]
  {
    return this.moduleFiles.map(moduleFile =>
    {
      return(
      {
        metaData: moduleFile.metaData,
        moduleSaveData: moduleFile.serialize ? moduleFile.serialize : null,
      });
    });
  }

  private getAllTechnologyUnlocks(): TechnologyUnlocks
  {
    const technologyUnlocks: TechnologyUnlocks = {};

    const allUnlockableTemplateCollections =
    [
      this.templates.Buildings,
      this.templates.Items,
      this.templates.Units,
    ];

    const allUnlockableThings = allUnlockableTemplateCollections.map(templateCollection =>
    {
      return Object.keys(templateCollection).map(key =>
      {
        return templateCollection[key];
      });
    }).reduce((allUnlockables, unlockablesOfType) =>
    {
      return allUnlockables.concat(unlockablesOfType);
    }, []);

    const unlockableThingsWithTechRequirements = allUnlockableThings.filter(unlockableThing =>
    {
      return Boolean(unlockableThing.techRequirements);
    });

    unlockableThingsWithTechRequirements.forEach(unlockableThing =>
    {
      unlockableThing.techRequirements.forEach(techRequirement =>
      {
        const tech = techRequirement.technology;
        if (!technologyUnlocks[tech.key])
        {
          technologyUnlocks[tech.key] = {};
        }

        if (!technologyUnlocks[tech.key][techRequirement.level])
        {
          technologyUnlocks[tech.key][techRequirement.level] = [];
        }

        technologyUnlocks[tech.key][techRequirement.level].push(unlockableThing);
      });
    });

    return technologyUnlocks;
  }
}
