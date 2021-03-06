import {Personality} from "../ai/Personality";
import {TemplateCollection} from "../generic/TemplateCollection";

import {BackgroundDrawingFunction} from "../graphics/BackgroundDrawingFunction";
import {GameModule, ModuleSaveData } from "./GameModule";
import
{
  PartialRuleSetValues,
  RuleSetValues,
} from "./RuleSetValues";
import {AiTemplateConstructor} from "../templateinterfaces/AiTemplateConstructor";
import {AttitudeModifierTemplate} from "../templateinterfaces/AttitudeModifierTemplate";
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
import { CombatActionFetcher } from "../combat/CombatActionFetcher";
import { coreCombatPhases } from "../combat/core/coreCombatPhases";
import { coreCombatActionFetchers } from "../combat/core/coreFetchers";
import { AbilityBase } from "../templateinterfaces/AbilityBase";
import { BattleWideCombatActionListener, SideAttachedCombatActionListener } from "../combat/CombatActionListener";
import { UnitBattleSide } from "../unit/UnitBattleSide";
import { coreGlobalActionListeners } from "../combat/core/coreGlobalActionListeners";


// tslint:disable:no-any
interface Templates
{
  aiTemplateConstructors: TemplateCollection<AiTemplateConstructor<any>>;
  attitudeModifiers: TemplateCollection<AttitudeModifierTemplate>;
  buildings: TemplateCollection<BuildingTemplate>;
  combatAbilities: TemplateCollection<CombatAbilityTemplate>;
  combatActionFetchers: TemplateCollection<CombatActionFetcher<any>>;
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
    buildings: new TemplateCollection<BuildingTemplate>(
      "buildings",
      (copiedTemplates) =>
      {
        this.templatesByImplementation.buildingLike.copyTemplates(copiedTemplates);
        this.onTemplatesAdded();
      },
    ),
    combatAbilities: new TemplateCollection<CombatAbilityTemplate>(
      "combatAbilities",
      (copiedTemplates) =>
      {
        this.templatesByImplementation.abilityLike.copyTemplates(copiedTemplates);
        this.onTemplatesAdded();
      },
    ),
    combatActionFetchers: new TemplateCollection<CombatActionFetcher<any>>(
      "combatActionFetchers",
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
      (copiedTemplates) =>
      {
        this.templatesByImplementation.itemLike.copyTemplates(copiedTemplates);
        this.onTemplatesAdded();
      },
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
      (copiedTemplates) =>
      {
        this.templatesByImplementation.abilityLike.copyTemplates(copiedTemplates);
        this.onTemplatesAdded();
      },
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
      (copiedTemplates) =>
      {
        this.templatesByImplementation.unitLike.copyTemplates(copiedTemplates);
        this.onTemplatesAdded();
      },
    ),
    // tslint:enable:no-any
  };

  public ruleSet: RuleSetValues;
  public readonly scripts = new TriggeredScriptCollection<AllCoreScripts>(allDefaultScripts);
  public defaultMap: MapGenTemplate;
  public defaultLanguage: Language;
  public uiScenes: Partial<CoreUIScenes> & NonCoreUIScenes = {};
  public readonly mapLevelModifierAdjustments: CustomModifierAdjustments = new CustomModifierAdjustments();
  public readonly globalCombatActionListeners:
  {
    battleWide: BattleWideCombatActionListener<any>[];
    bySide:
    {
      [side in UnitBattleSide]: SideAttachedCombatActionListener<any>[];
    };
  } =
  {
    battleWide: [],
    bySide:
    {
      side1: [],
      side2: [],
    },
  };
  public readonly templateCollectionsWithUnlockables:
  {
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
  public templatesByImplementation:
  {
    abilityLike: TemplateCollection<AbilityBase>;
    buildingLike: TemplateCollection<BuildingTemplate>;
    itemLike: TemplateCollection<ItemTemplate>;
    unitLike: TemplateCollection<UnitTemplate>;
  } =
  {
    abilityLike: new TemplateCollection<AbilityBase>("abilityLike"),
    buildingLike: new TemplateCollection<BuildingTemplate>("buildingLike"),
    itemLike: new TemplateCollection<ItemTemplate>("itemLike"),
    unitLike: new TemplateCollection<UnitTemplate>("unitLike"),
  };
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


  constructor()
  {
    this.templates.combatPhases.copyTemplates(coreCombatPhases);
    this.templates.combatActionFetchers.copyTemplates(coreCombatActionFetchers);
    this.globalCombatActionListeners.battleWide.push(...coreGlobalActionListeners);
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
      const templateCollection: TemplateCollection<UnlockableThing> =
        this.templateCollectionsWithUnlockables[unlockableThingKindKey];

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
  }
}
