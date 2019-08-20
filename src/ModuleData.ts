import {Personality} from "../src/Personality";
import {TemplateCollection} from "../src/templateinterfaces/TemplateCollection";

import {BackgroundDrawingFunction} from "./BackgroundDrawingFunction";
import {GameModule, ModuleSaveData } from "./GameModule";
import {ModuleScripts} from "./ModuleScripts";
import
{
  PartialRuleSetValues,
  RuleSetValues,
} from "./RuleSetValues";
import {AiTemplateConstructor} from "./templateinterfaces/AiTemplateConstructor";
import {AbilityTemplate} from "./templateinterfaces/AbilityTemplate";
import {AttitudeModifierTemplate} from "./templateinterfaces/AttitudeModifierTemplate";
import {BattleVfxTemplate} from "./templateinterfaces/BattleVfxTemplate";
import {BuildingTemplate} from "./templateinterfaces/BuildingTemplate";
import {ItemTemplate} from "./templateinterfaces/ItemTemplate";
import {Language} from "./localization/Language";
import {MapGenTemplate} from "./templateinterfaces/MapGenTemplate";
import {MapRendererLayerTemplate} from "./templateinterfaces/MapRendererLayerTemplate";
import {MapRendererMapModeTemplate} from "./templateinterfaces/MapRendererMapModeTemplate";
import {NotificationTemplate} from "./templateinterfaces/NotificationTemplate";
import {PassiveSkillTemplate} from "./templateinterfaces/PassiveSkillTemplate";
import {PortraitTemplate} from "./templateinterfaces/PortraitTemplate";
import {RaceTemplate} from "./templateinterfaces/RaceTemplate";
import {ResourceTemplate} from "./templateinterfaces/ResourceTemplate";
import {SubEmblemTemplate} from "./templateinterfaces/SubEmblemTemplate";
import {TechnologyTemplate} from "./templateinterfaces/TechnologyTemplate";
import {TerrainTemplate} from "./templateinterfaces/TerrainTemplate";
import {UnitArchetype} from "./templateinterfaces/UnitArchetype";
import {UnitEffectTemplate} from "./templateinterfaces/UnitEffectTemplate";
import {UnitTemplate} from "./templateinterfaces/UnitTemplate";
import
{
  deepMerge,
  getRandomProperty,
} from "./utility";
import { UnlockableThing } from "./templateinterfaces/UnlockableThing";

import {UIScenes} from "./UIScenes";


// tslint:disable:no-any
interface Templates
{
  Abilities: TemplateCollection<AbilityTemplate>;
  AiTemplateConstructors: TemplateCollection<AiTemplateConstructor<any>>;
  AttitudeModifiers: TemplateCollection<AttitudeModifierTemplate>;
  BattleVfx: TemplateCollection<BattleVfxTemplate>;
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

export type TechnologyUnlocksByLevel =
{
  [techLevel: number]: UnlockableThing[];
};
type TechnologyUnlocksByLevelByTech =
{
  [technologyKey: string]: TechnologyUnlocksByLevel;
};

export class ModuleData
{
  public gameModules: GameModule[] = [];

  public mapBackgroundDrawingFunction: BackgroundDrawingFunction;
  public starBackgroundDrawingFunction: BackgroundDrawingFunction;

  public templates: Templates =
  {
    Abilities: {},
    AiTemplateConstructors: {},
    AttitudeModifiers: {},
    BattleVfx: {},
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
  public uiScenes: Partial<UIScenes> =
  {

  };

  public get technologyUnlocks(): TechnologyUnlocksByLevelByTech
  {
    if (this.technologyUnlocksAreDirty)
    {
      this.cachedTechnologyUnlocks = this.getAllTechnologyUnlocks();
    }

    return this.cachedTechnologyUnlocks;
  }

  private technologyUnlocksAreDirty: boolean = true;
  private cachedTechnologyUnlocks: TechnologyUnlocksByLevelByTech = {};

  constructor()
  {
    this.scripts = new ModuleScripts();
  }
  public copyTemplates<T extends keyof Templates>(source: Templates[T], category: T): void
  {
    if (!this.templates[category])
    {
      console.warn(`Tried to copy templates in invalid category "${category}". Category must be one of: ${Object.keys(this.templates).join(", ")}`);

      return;
    }

    for (const templateType in source)
    {
      let hasDuplicate = Boolean(this.templates[category][templateType]);

      if (category === "Abilities" || category === "PassiveSkills")
      {
        if (this.templates.Abilities[templateType] || this.templates.PassiveSkills[templateType])
        {
          hasDuplicate = true;
        }
      }

      if (hasDuplicate)
      {
        throw new Error(`Duplicate '${category}' template '${templateType}'`);
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
  public addGameModule(gameModule: GameModule): void
  {
    this.gameModules.push(gameModule);
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
    // TODO 2018.12.09 | kinda weird we can't just call this as the default
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

      console.warn(`Desired language (code '${languageCode}') is not loaded.`);

      return defaultLanguage;
    }
  }
  public getDefaultLanguage(): Language
  {
    let chosenLanguage: Language;

    if (this.defaultLanguage)
    {
      chosenLanguage = this.defaultLanguage;
    }
    else if (this.templates.Languages["en"])
    {
      chosenLanguage = this.templates.Languages["en"];
    }
    else
    {
      throw new Error("Please define a default language for your module configuration if " +
        "it doesn't include English language support.");
    }

    return chosenLanguage;
  }
  public serialize(): ModuleSaveData[]
  {
    return this.gameModules.map(gameModule =>
    {
      return(
      {
        info: gameModule.info,
        moduleSaveData: gameModule.serializeModuleSpecificData ? gameModule.serializeModuleSpecificData : null,
      });
    });
  }

  private getAllTechnologyUnlocks(): TechnologyUnlocksByLevelByTech
  {
    const technologyUnlocks: TechnologyUnlocksByLevelByTech = {};

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
