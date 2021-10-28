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
import {UnitTemplate} from "../templateinterfaces/UnitTemplate";
import
{
  deepMerge,
} from "../generic/utility";
import { UnlockableThing, UnlockableThingWithKind } from "../templateinterfaces/UnlockableThing";

import {CoreUIScenes, NonCoreUIScenes} from "../ui/CoreUIScenes";
import { CustomModifierAdjustments } from "../maplevelmodifiers/CustomModifierAdjustments";

import { TriggeredScriptCollection } from "../triggeredscripts/TriggeredScriptCollection";
import { allDefaultScripts } from "../triggeredscripts/defaultScripts/allDefaultScripts";
import { AllCoreScripts } from "../triggeredscripts/AllCoreScriptsWithData";
import { ManufacturableThingKind } from "../templateinterfaces/ManufacturableThing";
import { coreManufacturableThingKinds } from "../production/coreManufacturableThingKinds";
import { CombatPhaseInfo } from "../combat/CombatPhaseInfo";
import { CombatEffectTemplate } from "../combat/CombatEffectTemplate";
import { CombatAbilityTemplate } from "../templateinterfaces/CombatAbilityTemplate";
import { CombatActionListenerFetcher, CombatActionFetcher } from "../combat/CombatActionFetcher";
import { coreCombatPhases } from "../combat/core/coreCombatPhases";
import { coreCombatActionListenerFetchers } from "../combat/core/coreCombatActionListenerFetchers";


// tslint:disable:no-any
interface Templates
{
  aiTemplateConstructors: TemplateCollection<AiTemplateConstructor<any>>;
  attitudeModifiers: TemplateCollection<AttitudeModifierTemplate>;
  // TODO 2020.07.27 | only used for debugging. store somewhere else
  battleVfx: TemplateCollection<BattleVfxTemplate>;
  buildings: TemplateCollection<BuildingTemplate>;
  combatAbilities: TemplateCollection<CombatAbilityTemplate>;
  combatActionFetchers: TemplateCollection<CombatActionFetcher<any>>;
  combatActionListenerFetchers: TemplateCollection<CombatActionListenerFetcher<any>>;
  combatEffects: TemplateCollection<CombatEffectTemplate>;
  combatPhases: TemplateCollection<CombatPhaseInfo<any>>;
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

  // laziness. not all template types need to trigger onTemplatesAdded()
  public templates: Templates =
  {
    // tslint:disable:no-any
    aiTemplateConstructors: new TemplateCollection<AiTemplateConstructor<any>>(
      "aiTemplateConstructors",
      () => this.onTemplatesAdded(),
    ),
    attitudeModifiers: new TemplateCollection<AttitudeModifierTemplate>(
      "attitudeModifiers",
      () => this.onTemplatesAdded(),
    ),
    battleVfx: new TemplateCollection<BattleVfxTemplate>(
      "battleVfx",
      () => this.onTemplatesAdded(),
    ),
    buildings: new TemplateCollection<BuildingTemplate>(
      "buildings",
      () => this.onTemplatesAdded(),
    ),
    combatAbilities: new TemplateCollection<CombatAbilityTemplate>(
      "combatAbilities",
      () => this.onTemplatesAdded(),
    ),
    combatActionFetchers: new TemplateCollection<CombatActionFetcher<any>>(
      "combatActionFetchers",
      () => this.onTemplatesAdded(),
    ),
    combatActionListenerFetchers: new TemplateCollection<CombatActionListenerFetcher<any>>(
      "combatActionListenerFetchers",
      () => this.onTemplatesAdded(),
    ),
    combatEffects: new TemplateCollection<CombatEffectTemplate>(
      "combatEffects",
      () => this.onTemplatesAdded(),
    ),
    combatPhases: new TemplateCollection<CombatPhaseInfo<any>>(
      "combatPhases",
      () => this.onTemplatesAdded(),
    ),
    items: new TemplateCollection<ItemTemplate>(
      "items",
      () => this.onTemplatesAdded(),
    ),
    languages: new TemplateCollection<Language>(
      "languages",
      () => this.onTemplatesAdded(),
    ),
    mapGen: new TemplateCollection<MapGenTemplate>(
      "mapGen",
      () => this.onTemplatesAdded(),
    ),
    mapRendererLayers: new TemplateCollection<MapRendererLayerTemplate>(
      "mapRendererLayers",
      () => this.onTemplatesAdded(),
    ),
    mapRendererMapModes: new TemplateCollection<MapRendererMapModeTemplate>(
      "mapRendererMapModes",
      () => this.onTemplatesAdded(),
    ),
    notifications: new TemplateCollection<NotificationTemplate<any, any>>(
      "notifications",
      () => this.onTemplatesAdded(),
    ),
    passiveSkills: new TemplateCollection<PassiveSkillTemplate>(
      "passiveSkills",
      () => this.onTemplatesAdded(),
    ),
    personalities: new TemplateCollection<Personality>(
      "personalities",
      () => this.onTemplatesAdded(),
    ),
    portraits: new TemplateCollection<PortraitTemplate>(
      "portraits",
      () => this.onTemplatesAdded(),
    ),
    races: new TemplateCollection<RaceTemplate>(
      "races",
      () => this.onTemplatesAdded(),
    ),
    resources: new TemplateCollection<ResourceTemplate>(
      "resources",
      () => this.onTemplatesAdded(),
    ),
    subEmblems: new TemplateCollection<SubEmblemTemplate>(
      "subEmblems",
      () => this.onTemplatesAdded(),
    ),
    technologies: new TemplateCollection<TechnologyTemplate>(
      "technologies",
      () => this.onTemplatesAdded(),
    ),
    terrains: new TemplateCollection<TerrainTemplate>(
      "terrains",
      () => this.onTemplatesAdded(),
    ),
    unitArchetypes: new TemplateCollection<UnitArchetype>(
      "unitArchetypes",
      () => this.onTemplatesAdded(),
    ),
    units: new TemplateCollection<UnitTemplate>(
      "units",
      () => this.onTemplatesAdded(),
    ),
    // tslint:enable:no-any
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
  // TODO 2021.10.28 | wouldn't using flags be better?
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
  // for content not used by the core game, but used across modules
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
    buildingLike: new TemplateCollection<BuildingTemplate>("buildingLike"),
    itemLike: new TemplateCollection<ItemTemplate>("itemLike"),
    unitLike: new TemplateCollection<UnitTemplate>("unitLike"),
  };

  constructor()
  {
    this.templates.combatPhases.copyTemplates(coreCombatPhases);
    this.templates.combatActionListenerFetchers.copyTemplates(coreCombatActionListenerFetchers);
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
      return this.templates.mapGen.getRandom();
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
    const language = this.templates.languages.get(languageCode);

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
    else
    {
      const englishLanguage = this.templates.languages.get("en");
      if (englishLanguage)
      {
        chosenLanguage = englishLanguage;
      }
      else
      {
        throw new Error("Please define a default language for your module configuration if " +
          "it doesn't include English language support.");
      }
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

      return templateCollection.map(template =>
      {
        return {
          unlockableThingKind: unlockableThingKindKey,
          unlockableThing: template,
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
  private onTemplatesAdded(): void
  {
    this.technologyUnlocksAreDirty = true;
    this.templatesByImplementationAreDirty = true;
  }
}
