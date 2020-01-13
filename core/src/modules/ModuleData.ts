import {Personality} from "../ai/Personality";
import {TemplateCollection} from "../templateinterfaces/TemplateCollection";

import {BackgroundDrawingFunction} from "../graphics/BackgroundDrawingFunction";
import {GameModule, ModuleSaveData } from "./GameModule";
import
{
  PartialRuleSetValues,
  RuleSetValues,
} from "./RuleSetValues";
import {AiTemplateConstructor} from "../templateinterfaces/AiTemplateConstructor";
import {AbilityTemplate} from "../templateinterfaces/AbilityTemplate";
import {AttitudeModifierTemplate} from "../templateinterfaces/AttitudeModifierTemplate";
import {BattleVfxTemplate} from "../templateinterfaces/BattleVfxTemplate";
import {BuildingTemplate} from "../templateinterfaces/BuildingTemplate";
import {ItemTemplate} from "../templateinterfaces/ItemTemplate";
import {Language} from "../localization/Language";
import {MapGenTemplate} from "../templateinterfaces/MapGenTemplate";
import {MapRendererLayerTemplate} from "../templateinterfaces/MapRendererLayerTemplate";
import {MapRendererMapModeTemplate} from "../templateinterfaces/MapRendererMapModeTemplate";
import {NotificationTemplate} from "../templateinterfaces/NotificationTemplate";
import {PassiveSkillTemplate} from "../templateinterfaces/PassiveSkillTemplate";
import {PortraitTemplate} from "../templateinterfaces/PortraitTemplate";
import {RaceTemplate} from "../templateinterfaces/RaceTemplate";
import {ResourceTemplate} from "../templateinterfaces/ResourceTemplate";
import {SubEmblemTemplate} from "../templateinterfaces/SubEmblemTemplate";
import {TechnologyTemplate} from "../templateinterfaces/TechnologyTemplate";
import {TerrainTemplate} from "../templateinterfaces/TerrainTemplate";
import {UnitArchetype} from "../templateinterfaces/UnitArchetype";
import {UnitEffectTemplate} from "../templateinterfaces/UnitEffectTemplate";
import {UnitTemplate} from "../templateinterfaces/UnitTemplate";
import
{
  deepMerge,
  getRandomProperty,
} from "../generic/utility";
import { UnlockableThing, UnlockableThingWithKind } from "../templateinterfaces/UnlockableThing";

import {CoreUIScenes, NonCoreUIScenes} from "../ui/CoreUIScenes";
import { CustomModifierAdjustments } from "../maplevelmodifiers/CustomModifierAdjustments";

import { TriggeredScriptCollection } from "../triggeredscripts/TriggeredScriptCollection";
import { allDefaultScripts } from "../triggeredscripts/defaultScripts/allDefaultScripts";
import { AllCoreScripts } from "../triggeredscripts/AllCoreScriptsWithData";
import { ManufacturableThingKind } from "../templateinterfaces/ManufacturableThing";
import { coreManufacturableThingKinds } from "../production/coreManufacturableThingKinds";

// tslint:disable:no-any
interface Templates
{
  abilities: TemplateCollection<AbilityTemplate>;
  aiTemplateConstructors: TemplateCollection<AiTemplateConstructor<any>>;
  attitudeModifiers: TemplateCollection<AttitudeModifierTemplate>;
  battleVfx: TemplateCollection<BattleVfxTemplate<any, any>>;
  buildings: TemplateCollection<BuildingTemplate>;
  items: TemplateCollection<ItemTemplate>;
  languages: TemplateCollection<Language>;
  mapGen: TemplateCollection<MapGenTemplate>;
  mapRendererLayers: TemplateCollection<MapRendererLayerTemplate>;
  mapRendererMapModes: TemplateCollection<MapRendererMapModeTemplate>;
  notifications: TemplateCollection<NotificationTemplate<any, any>>;
  passiveSkills: TemplateCollection<PassiveSkillTemplate>;
  personalities: TemplateCollection<Personality>;
  portraits: TemplateCollection<PortraitTemplate>;
  races: TemplateCollection<RaceTemplate>;
  resources: TemplateCollection<ResourceTemplate>;
  subEmblems: TemplateCollection<SubEmblemTemplate>;
  technologies: TemplateCollection<TechnologyTemplate>;
  terrains: TemplateCollection<TerrainTemplate>;
  unitArchetypes: TemplateCollection<UnitArchetype>;
  unitEffects: TemplateCollection<UnitEffectTemplate>;
  units: TemplateCollection<UnitTemplate>;
}
// tslint:enable:no-any

export type TechnologyUnlocksByLevel =
{
  [techLevel: number]: UnlockableThingWithKind[];
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
    abilities: {},
    aiTemplateConstructors: {},
    attitudeModifiers: {},
    battleVfx: {},
    buildings: {},
    items: {},
    languages: {},
    mapGen: {},
    mapRendererLayers: {},
    mapRendererMapModes: {},
    notifications: {},
    passiveSkills: {},
    personalities: {},
    portraits: {},
    races: {},
    resources: {},
    subEmblems: {},
    technologies: {},
    terrains: {},
    unitArchetypes: {},
    unitEffects: {},
    units: {},
  };

  public ruleSet: RuleSetValues;
  public readonly scripts = new TriggeredScriptCollection<AllCoreScripts>(allDefaultScripts);
  public defaultMap: MapGenTemplate;
  public defaultLanguage: Language;
  public uiScenes: Partial<CoreUIScenes> & NonCoreUIScenes = {};
  public readonly mapLevelModifierAdjustments: CustomModifierAdjustments = new CustomModifierAdjustments();
  public readonly templateCollectionsWithUnlockables:
  {
    [key: string]: TemplateCollection<UnlockableThing>;
    buildings: TemplateCollection<BuildingTemplate>;
    items: TemplateCollection<ItemTemplate>;
    units: TemplateCollection<UnitTemplate>;
  } =
  {
    buildings: this.templates.buildings,
    items: this.templates.items,
    units: this.templates.units,
  };
  // separated from templates to keep this.templates as a source of truth, but still allowing implementations to be reused
  // f.ex. titans from the titans module are implemented as units, but just adding them to this.templates.units means they become buildable as regular units, which they shouldn't be
  public readonly templateCollectionsByImplementation:
  {
    buildingLike: {[key: string]: TemplateCollection<BuildingTemplate>};
    itemLike: {[key: string]: TemplateCollection<ItemTemplate>};
    unitLike: {[key: string]: TemplateCollection<UnitTemplate>};
  } =
  {
    buildingLike: {buildings: this.templates.buildings},
    itemLike: {items: this.templates.items},
    unitLike: {units: this.templates.units},
  };
  public get templatesByImplementation()
  {
    if (this.templatesByImplementationAreDirty)
    {
      for (const buildableType in this.templateCollectionsByImplementation)
      {
        this.cachedTemplatesByImplementation[buildableType] = {};

        // just for error messages
        const categoryTemplateWasAlreadyFoundIn:
        {
          [key: string]: string;
        } = {};

        for (const buildableCollectionKey in this.templateCollectionsByImplementation[buildableType])
        {
          const buildableTemplates = this.templateCollectionsByImplementation[buildableType][buildableCollectionKey];

          for (const key in buildableTemplates)
          {
            if (categoryTemplateWasAlreadyFoundIn[key])
            {
              const a = categoryTemplateWasAlreadyFoundIn[key];
              const b = buildableCollectionKey;

              throw new Error(`Template with key '${key}' was found in both '${a}' and '${b}'.` +
                `Both '${a}' and '${b}' implement templates buildable as '${buildableType}' and as such cannot have duplicate keys.`);
            }

            this.cachedTemplatesByImplementation[buildableType][key] = buildableTemplates[key];
          }
        }
      }

      this.templatesByImplementationAreDirty = false;
    }

    return this.cachedTemplatesByImplementation;
  }
  public readonly manufacturableThingKinds:
  {
    [key: string]: ManufacturableThingKind<any, any, any>;
  } =
  {
    ...coreManufacturableThingKinds,
  };
  // for content not used by the core game, but used modularly across modules
  // f.ex. modular ui components
  public readonly nonCoreData:
  {
    [moduleKey: string]:
    {
      [key: string]: any;
    };
  } = {};
  public get technologyUnlocks(): TechnologyUnlocksByLevelByTech
  {
    if (this.technologyUnlocksAreDirty)
    {
      this.cachedTechnologyUnlocks = this.getAllTechnologyUnlocks();
      this.technologyUnlocksAreDirty = false;
    }

    return this.cachedTechnologyUnlocks;
  }

  private technologyUnlocksAreDirty: boolean = true;
  private cachedTechnologyUnlocks: TechnologyUnlocksByLevelByTech = {};
  private templatesByImplementationAreDirty: boolean = true;
  private readonly cachedTemplatesByImplementation:
  {
    buildingLike: TemplateCollection<BuildingTemplate>;
    itemLike: TemplateCollection<ItemTemplate>;
    unitLike: TemplateCollection<UnitTemplate>;
  } =
  {
    buildingLike: {},
    itemLike: {},
    unitLike: {},
  };

  constructor()
  {
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

      if (category === "abilities" || category === "passiveSkills")
      {
        if (this.templates.abilities[templateType] || this.templates.passiveSkills[templateType])
        {
          hasDuplicate = true;
        }
      }

      if (hasDuplicate)
      {
        throw new Error(`Duplicate '${category}' template '${templateType}'`);
      }

      this.templates[category][templateType] = source[templateType];
    }

    this.technologyUnlocksAreDirty = true;
    this.templatesByImplementationAreDirty = true;
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
  public addGameModule(gameModule: GameModule): Promise<void>
  {
    this.gameModules.push(gameModule);
    if (gameModule.addToModuleData)
    {
      const loadingPromise = gameModule.addToModuleData(this);
      if (loadingPromise)
      {
        return loadingPromise;
      }
    }

    return Promise.resolve();
  }
  public getDefaultMap(): MapGenTemplate
  {
    if (this.defaultMap)
    {
      return this.defaultMap;
    }
    else if (Object.keys(this.templates.mapGen).length > 0)
    {
      return getRandomProperty(this.templates.mapGen);
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
    const language = this.templates.languages[languageCode];

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
    else if (this.templates.languages["en"])
    {
      chosenLanguage = this.templates.languages["en"];
    }
    else
    {
      throw new Error("Please define a default language for your module configuration if " +
        "it doesn't include English language support.");
    }

    return chosenLanguage;
  }
  public serialize(): {[moduleKey: string]: ModuleSaveData}
  {
    return this.gameModules.reduce((allModuleSaveData, gameModule) =>
    {
      const key = gameModule.info.key;

      allModuleSaveData[key] =
      {
        info: gameModule.info,
        moduleSaveData: gameModule.serializeModuleSpecificData ?
          gameModule.serializeModuleSpecificData(this) :
          null,
      };

      return allModuleSaveData;
    }, <{[moduleKey: string]: ModuleSaveData}>{});
  }

  private getAllTechnologyUnlocks(): TechnologyUnlocksByLevelByTech
  {
    const technologyUnlocks: TechnologyUnlocksByLevelByTech = {};

    const allUnlockableThings = Object.keys(this.templateCollectionsWithUnlockables).map(unlockableThingKindKey =>
    {
      const templateCollection = this.templateCollectionsWithUnlockables[unlockableThingKindKey];

      return Object.keys(templateCollection).map(templateKey =>
      {
        return {
          unlockableThingKind: unlockableThingKindKey,
          unlockableThing: templateCollection[templateKey],
        };
      });
    }).reduce((allUnlockables, unlockablesOfType) =>
    {
      return allUnlockables.concat(unlockablesOfType);
    }, []);

    const unlockableThingsWithTechRequirements = allUnlockableThings.filter(unlockableThingWithKind =>
    {
      return Boolean(unlockableThingWithKind.unlockableThing.techRequirements);
    });

    unlockableThingsWithTechRequirements.forEach(unlockableThingWithKind =>
    {
      unlockableThingWithKind.unlockableThing.techRequirements.forEach(techRequirement =>
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

        technologyUnlocks[tech.key][techRequirement.level].push(unlockableThingWithKind);
      });
    });

    return technologyUnlocks;
  }
}
