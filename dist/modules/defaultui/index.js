define("modules/defaultui/defaultUi", ["require", "exports", "pixi.js", "modules/englishlanguage/englishLanguage", "src/GameModuleInitializationPhase", "src/svgCache", "modules/defaultui/uicomponents/BattleSceneTester", "modules/defaultui/uicomponents/FlagMaker", "modules/defaultui/uicomponents/battle/Battle", "modules/defaultui/uicomponents/battleprep/BattlePrep", "modules/defaultui/uicomponents/galaxymap/GalaxyMap", "modules/defaultui/uicomponents/setupgame/SetupGame", "modules/defaultui/uicomponents/errors/SaveRecoveryWithDetails", "modules/defaultui/uicomponents/errors/TopLevelErrorBoundary", "modules/defaultui/uicomponents/vfxeditor/VfxEditor", "json!modules/defaultui/moduleInfo.json"], function (require, exports, PIXI, englishLanguage_1, GameModuleInitializationPhase_1, svgCache_1, BattleSceneTester_1, FlagMaker_1, Battle_1, BattlePrep_1, GalaxyMap_1, SetupGame_1, SaveRecoveryWithDetails_1, TopLevelErrorBoundary_1, VfxEditor_1, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function loadCss(url, baseUrl) {
        var link = document.createElement("link");
        link.href = new URL(url, baseUrl).toString();
        link.type = "text/css";
        link.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link);
    }
    exports.defaultUi = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.AppInit,
        supportedLanguages: [englishLanguage_1.englishLanguage],
        initialize: function (baseUrl) {
            loadCss("./css/main.css", baseUrl);
            var loader = new PIXI.Loader(baseUrl);
            var battleSceneFlagFadeUrl = "./img/battleSceneFlagFade.svg";
            loader.add({
                url: battleSceneFlagFadeUrl,
                loadType: 1,
            });
            return new Promise(function (resolve) {
                loader.load(function () {
                    var response = loader.resources[battleSceneFlagFadeUrl].data;
                    var svgDoc = response.children[0];
                    svgCache_1.svgCache.battleSceneFlagFade = svgDoc;
                    resolve();
                });
            });
        },
        addToModuleData: function (moduleData) {
            moduleData.uiScenes.battle = Battle_1.Battle;
            moduleData.uiScenes.battlePrep = BattlePrep_1.BattlePrep;
            moduleData.uiScenes.galaxyMap = GalaxyMap_1.GalaxyMap;
            moduleData.uiScenes.setupGame = SetupGame_1.SetupGame;
            moduleData.uiScenes.errorRecovery = SaveRecoveryWithDetails_1.SaveRecoveryWithDetails;
            moduleData.uiScenes.topLevelErrorBoundary = TopLevelErrorBoundary_1.TopLevelErrorBoundary;
            moduleData.uiScenes.flagMaker = FlagMaker_1.FlagMaker;
            moduleData.uiScenes.vfxEditor = VfxEditor_1.VfxEditor;
            moduleData.uiScenes.battleSceneTester = BattleSceneTester_1.BattleSceneTester;
            return moduleData;
        },
    };
});
define("modules/defaultui/localization/en/battle", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.battle = {
        preparing_statusText: "Preparing",
        preparing_tooltip: "Unit is preparing to use ability",
        guard_statusText: "Guard",
        guard_chanceToProtect: "{protChance}% chance to protect " +
            "{guardCoverage, select," +
            (0 + " {units in same row.}") +
            (1 + " {all units.}") +
            "other {INVALID_VALUE guardCoverage {guardCoverage}}" +
            "}",
        reducedPhysicalDamage: "This unit takes {damageReduction}% reduced damage from physical attacks.",
        destroyed_statusText: "Destroyed",
        captured_statusText: "Captured",
        unitAnnihilated: "Unit annihilated",
        delay_tooltip: "Delay: {0}",
        turnsLeft_tooltip: "Turns left: {0}",
        battleFinish_victory: "You win",
        battleFinish_loss: "You lose",
        battleFinish_clickAnywhereToContinue: "Click anywhere to continue",
        simulateBattle: "Simulate battle",
        startBattle: "Start battle",
        autoFormation: "Auto formation",
        enemy: "Enemy",
        cantInspectEnemyFormationAsStarIsNotInDetectionRadius: "Can't inspect enemy formation as star is not in detection radius",
        ownFormation: "Own",
        attacking: "Attacking",
        defending: "Defending",
        notEnoughUnitsPlaced: "Must place at least {minUnits} " +
            "{minUnits, plural," +
            "  one {unit}" +
            "other {units}" +
            "}.",
        battlePrepValidityModifierEffect_minUnits: "Minimum units placed {minUnits, signedNumber}",
        battlePrepValidityModifierSource_offensiveBattle: "due to fighting offensive battle.",
        battlePrepValidityModifierSource_attackedInEnemyTerritory: "due to being attacked in hostile territory.",
        battlePrepValidityModifierSource_attackedInNeutralTerritory: "due to being attacked in neutral territory.",
        battlePrepValidityModifierSource_passiveAbility_unknown: "due to an unknown enemy ability.",
        battlePrepValidityModifierSource_passiveAbility_known: "due to ability {abilityName} on unit {unitName}.",
    };
});
define("modules/defaultui/localization/en/diplomacy", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.diplomacy = {
        opinion: "Opinion",
        diplomaticStatus: "Status",
        makePeace: "Make peace",
        declareWar: "Declare war",
        endsOn: "Ends on",
        attitudeModifierEffect: "Effect",
        aiPersonality: "AI Personality",
    };
});
define("modules/defaultui/localization/en/errors", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.errors = {
        UIErrorPanicDespiteUserPreference: "This was an uncaught exception while rendering the UI. The entire UI has been forced to unmount despite error handling preference being set to '{0}'.",
        genericError: "Error",
        genericErrorDescription: "An error has occurred in the game.",
        genericErrorCauseDescription: "This is probably due to a programming oversight in the game and shouldn't cause any damage that can't be fixed by reloading this page. The error may keep happening though.",
        checkConsolePrompt: "Open the developer console on your browser for more information.",
        openConsoleInstructions: "Cmd/Ctrl+Shift+J or F12 on most desktop browsers.",
        canTryToRecoverGame: "You can try to save the current game or load a previous save. (Depending on how bad the first error was, neither of these may work)",
        errorWithGameRecovery: "An additional error occurred trying to render the UI for save game recovery. This was probably caused by the same thing as the first error.",
    };
});
define("modules/defaultui/localization/en/fleet", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fleet = {
        unidentifiedShip: "Unidentified ship",
        unidentifiedFleet: "Unidentified fleet",
        merge: "merge",
        reorganize: "reorganize",
        reorganizeFleets: "Reorganize fleets",
        fleet_movesRemaining: "Moves: {0}/{1}",
        select_fleet: "select",
        deselect_fleet: "deselect",
        split_fleet: "split",
    };
});
define("modules/defaultui/localization/en/galaxyMapUI", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.galaxyMapUI = {
        technology: "Technology",
        diplomacy: "Diplomacy",
        economy: "Economy",
        production: "Production",
        equip: "Equip",
        turnCounter: "Turn",
        income: "Income",
        endTurn: "End turn",
        mapMode: "Map mode",
        constructBuilding: "construct",
        upgradeBuilding: "upgrade",
        buildingCost: "Cost",
        buildingTypeName: "Name",
        attackTarget_action: "attack",
        attackTargetTooltip: "Attack {enemyName} {targetType}",
    };
});
define("modules/defaultui/localization/en/gameOver", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.gameOver = {
        newGame: "New game",
        gameOver: "Game over",
        areYouSureYouWantToStartANewGame: "Are you sure you want to start a new game?",
    };
});
define("modules/defaultui/localization/en/general", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.general = {
        ok: "Ok",
        cancel: "Cancel",
        dontShowAgain: "Don't show again",
        reset: "Reset",
        perTurn: "per turn",
        randomize: "Randomize",
        remove: "Remove",
        clear: "Clear",
        auto: "Auto",
        date: "Date",
        del: "Del",
        delete: "Delete",
        confirmDeletion: "Confirm deletion",
        close: "Close",
        show: "Show",
        id: "Id",
        displayName: "Name",
        ability: "Ability",
        type: "Type",
        listItemSeparator: ", ",
    };
});
define("modules/defaultui/localization/en/items", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.items = {
        itemSlot: "Item slot: {0}",
        slot: "Slot",
    };
});
define("modules/defaultui/localization/en/notifications", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.notifications = {
        notificationFilterButton: "Filter",
        markAsRead: "Mark as read",
        messageSettings: "Message settings",
        alwaysShow_short: "Always",
        showIfInvolved_short: "Involved",
        neverShow_short: "Never",
        notificationToolTip: "Left click to show details. Right click to mark as read.",
    };
});
define("modules/defaultui/localization/en/options", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.options = {
        options: "Options",
        language: "Language",
        debug: "Debug",
        logging: "Logging",
        ui: "UI",
        system: "System",
        fullLanguageSupport: "Full language support",
        partialLanguageSupport: "Partial language support",
        battleAnimationTiming: "Battle animation timing",
        beforeAbility: "Before ability (ms)",
        abilityEffectDuration: "Ability effect duration (*)",
        afterAbility: "After ability (ms)",
        unitEnter: "Unit enter (ms)",
        unitExit: "Unit exit (ms)",
        turnTransition: "Turn transition (ms)",
        debugMode: "Debug mode",
        aiVsPlayerBattleSimulationDepth: "AI vs. Player battle simulation depth",
        aiVsAiBattleSimulationDepth: "AI vs. AI battle simulation depth",
        aiLogging: "AI",
        graphicsLogging: "Graphics",
        savesLogging: "Saves",
        modulesLogging: "Modules",
        initLogging: "Init",
        alwaysExpandTopRightMenuOnLowResolution: "Always expand top right menu on low resolution",
        messageSettings: "Message settings",
        resetTutorials: "Reset tutorials",
        resetAllOptions: "Reset all options",
        areYouSureYouWantToResetAllOptions: "Are you sure you want to reset all options?",
        errorReportingMode: "Error reporting",
        errorReportingMode_ignore: "ignore",
        errorReportingModeDescription_ignore: "Silently ignore warnings",
        errorReportingMode_alert: "alert",
        errorReportingModeDescription_alert: "Alert the user of an error occurring with a popup",
        errorReportingMode_panic: "panic",
        errorReportingModeDescription_panic: "Shut down the game and enter save recovery mode (Also possible from alert popup)",
    };
});
define("modules/defaultui/localization/en/player", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.player = {
        money: "Money",
        technologyLevel: "Level {0}",
        technologyUnlocks: "{technologyName} unlocks",
        techUnlock_buildings: "Buildings",
        techUnlock_items: "Items",
        techUnlock_units: "Units",
        researchSpeed: "Research speed",
        flag: "Flag",
        color_1: "Color 1",
        color_2: "Color 2",
        race: "Race",
        playerName: "Name",
        deadPlayer: "Dead",
    };
});
define("modules/defaultui/localization/en/production", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.production = {
        increaseBaseStatsOfUnitsBuiltHere: "Increase base stats of units built here",
        upgradeStats: "Upgrade stats",
        increaseBaseHealthOfUnitsBuiltHere: "Increase base health of units built here",
        upgradeHealth: "Upgrade health",
        upgradeItems: "Upgrade items",
        constructManufactory: "Construct manufactory",
        upgradeManufactoryCapacity: "Upgrade capacity",
        upgradeManufactoryCapacityTooltip: "Increase amount of things this manufactory can build per turn",
        manufactureUnitsButton: "Units",
        manufactureItemsButton: "Items",
    };
});
define("modules/defaultui/localization/en/saves", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.saves = {
        saveName: "Name",
        save_action: "Save",
        promptOverwrite: "Are you sure you want to overwrite '{toOverWrite}'?",
        confirmOverwrite: "Confirm overwrite",
        load_action: "Load",
        confirmSaveDeletion: "Are you sure you want to delete the following {count, plural," +
            "  one {save}" +
            "other {saves}" +
            "}?",
        loadGame: "Load game",
        saveSuccessful: "Succesfully saved game as '{saveName}'",
        saveFailure: "Couldn't save game",
        saveData: "Save data",
        saveDataCopyPrompt: "You can copy the save data for the active game below. This data can be loaded back into the game by manually editing indexedDB.",
        activeGameUnserializable: "The active game is corrupt and can't be serialized. Try loading an earlier save.",
    };
});
define("modules/defaultui/localization/en/setupGame", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setupGame = {
        addNewPlayer: "Add new player",
        startGame: "Start game",
        defaultOptions: "Default Options",
        basicOptions: "Basic Options",
        advancedOptions: "Advanced Options",
        confirmUseLargeImage: "Are you sure you want to use an image that is {fileSize} MB in size?\n" +
            "(The image won't be uploaded anywhere, but processing it might take a while)",
        editFlag: "Edit flag",
        hotLinkedImageLoadingFailed: "Linked image failed to load. Try saving it and using a local copy.",
        noValidImageFile: "The attached file wasn't recognized as an image.",
        addNewEmblem: "Add new emblem",
        emblemSetterTooltip: "Left click to edit. Right click to remove",
        emblems: "Emblems",
        emblemColor: "Emblem color",
        allowedPlayerCount: "Players: {min}-{max}",
        setAsHumanPlayer: "Set as human player",
    };
});
define("modules/defaultui/localization/en/trade", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.trade = {
        propose: "Propose",
        accept: "Accept",
        reject: "Reject",
        tradeableItems: "tradeable items",
        tradeWindowTitle: "Trade",
        trade_action: "Trade",
    };
});
define("modules/defaultui/localization/en/unit", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unit = {
        unit: "unit",
        maxActionPoints: "Max action points",
        attack: "Attack",
        defence: "Defence",
        intelligence: "Intelligence",
        speed: "Speed",
        type: "Type",
        strength: "Strength",
        act: "Act",
        atk: "Atk",
        def: "Def",
        int: "Int",
        spd: "Spd",
        unitName: "Name",
    };
});
define("modules/defaultui/localization/en/unitUpgrade", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unitUpgrade = {
        unitUpgradeHeader: "{unitName} level {currentLevel} -> {nextLevel}",
        upgradeAttribute: "{attribute}: {currentLevel} -> {nextLevel}",
        upgradeAbilitiesHeader: "Upgrade abilities",
        newAbility: "** New ability **",
        learnAbility: "Learn ability",
        upgradeSpecificAbility: "Upgrade ability {0}",
        upgradeStats: "Upgrade stats",
        upgradeUnit: "Upgrade unit",
        clickToLevelUp: "Click to level up",
        clickToLearnNewAbility: "Click to learn new ability",
        EXPReadOut: "{currentEXP} / {EXPToNextLevel} EXP",
    };
});
define("modules/defaultui/localization/localize", ["require", "exports", "src/localization/Localizer", "src/utility", "modules/englishlanguage/englishLanguage", "modules/defaultui/localization/en/battle", "modules/defaultui/localization/en/diplomacy", "modules/defaultui/localization/en/errors", "modules/defaultui/localization/en/fleet", "modules/defaultui/localization/en/galaxyMapUI", "modules/defaultui/localization/en/gameOver", "modules/defaultui/localization/en/general", "modules/defaultui/localization/en/items", "modules/defaultui/localization/en/notifications", "modules/defaultui/localization/en/options", "modules/defaultui/localization/en/player", "modules/defaultui/localization/en/production", "modules/defaultui/localization/en/saves", "modules/defaultui/localization/en/setupGame", "modules/defaultui/localization/en/trade", "modules/defaultui/localization/en/unit", "modules/defaultui/localization/en/unitUpgrade"], function (require, exports, Localizer_1, utility_1, englishLanguage_1, battle_1, diplomacy_1, errors_1, fleet_1, galaxyMapUI_1, gameOver_1, general_1, items_1, notifications_1, options_1, player_1, production_1, saves_1, setupGame_1, trade_1, unit_1, unitUpgrade_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.localizer = new Localizer_1.Localizer("ui");
    var mergedMessages = utility_1.shallowExtend(battle_1.battle, diplomacy_1.diplomacy, errors_1.errors, fleet_1.fleet, galaxyMapUI_1.galaxyMapUI, gameOver_1.gameOver, general_1.general, items_1.items, notifications_1.notifications, options_1.options, player_1.player, production_1.production, saves_1.saves, setupGame_1.setupGame, trade_1.trade, unit_1.unit, unitUpgrade_1.unitUpgrade);
    exports.localizer.setAllMessages(mergedMessages, englishLanguage_1.englishLanguage);
    exports.localize = exports.localizer.localize.bind(exports.localizer);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/battle/AbilityTooltip", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AbilityTooltipComponent = (function (_super) {
        __extends(AbilityTooltipComponent, _super);
        function AbilityTooltipComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "AbilityTooltip";
            _this.ownDOMNode = React.createRef();
            return _this;
        }
        AbilityTooltipComponent.prototype.shouldComponentUpdate = function (newProps) {
            for (var prop in newProps) {
                if (prop !== "activeTargets") {
                    if (this.props[prop] !== newProps[prop]) {
                        return true;
                    }
                }
            }
            return false;
        };
        AbilityTooltipComponent.prototype.render = function () {
            var abilities = this.props.activeTargets[this.props.targetUnit.id];
            var abilityElements = [];
            var containerProps = {
                className: "ability-tooltip",
                onMouseLeave: this.props.handleMouseLeave,
                ref: this.ownDOMNode,
            };
            var parentRect = this.props.parentElement.getBoundingClientRect();
            containerProps.style =
                {
                    position: "fixed",
                    top: parentRect.top,
                };
            if (this.props.facesLeft) {
                containerProps.className += " ability-tooltip-faces-left";
                containerProps.style.left = parentRect.left;
            }
            else {
                containerProps.className += " ability-tooltip-faces-right";
                containerProps.style.left = parentRect.right - 128;
            }
            for (var i = 0; i < abilities.length; i++) {
                var ability = abilities[i];
                var data = {};
                data.className = "ability-tooltip-ability";
                data.key = ability.type;
                data.onClick = this.props.handleAbilityUse.bind(null, ability, this.props.targetUnit);
                data.onMouseEnter = this.props.handleMouseEnterAbility.bind(null, ability);
                data.onMouseLeave = this.props.handleMouseLeaveAbility;
                if (ability.description) {
                    data.title = ability.description;
                }
                abilityElements.push(ReactDOMElements.div(data, ability.displayName));
            }
            return (ReactDOMElements.div(containerProps, abilityElements));
        };
        return AbilityTooltipComponent;
    }(React.Component));
    exports.AbilityTooltipComponent = AbilityTooltipComponent;
    exports.AbilityTooltip = React.createFactory(AbilityTooltipComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/battle/Battle", ["require", "exports", "react", "react-dom-factories", "src/AbilityUseEffectQueue", "src/BattleScene", "src/MCTree", "src/Options", "src/activeModuleData", "src/battleAbilityDisplay", "src/battleAbilityUsage", "src/utility", "modules/defaultui/uicomponents/battle/AbilityTooltip", "modules/defaultui/uicomponents/battle/BattleBackground", "modules/defaultui/uicomponents/battle/BattleDisplayStrength", "modules/defaultui/uicomponents/battle/BattleScene", "modules/defaultui/uicomponents/battle/BattleScore", "modules/defaultui/uicomponents/battle/BattleUIState", "modules/defaultui/uicomponents/battle/Formation", "modules/defaultui/uicomponents/battle/TurnCounterList", "modules/defaultui/uicomponents/battle/TurnOrder"], function (require, exports, React, ReactDOMElements, AbilityUseEffectQueue_1, BattleScene_1, MCTree_1, Options_1, activeModuleData_1, battleAbilityDisplay_1, battleAbilityUsage_1, utility_1, AbilityTooltip_1, BattleBackground_1, BattleDisplayStrength_1, BattleScene_2, BattleScore_1, BattleUIState_1, Formation_1, TurnCounterList_1, TurnOrder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattleComponent = (function (_super) {
        __extends(BattleComponent, _super);
        function BattleComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "Battle";
            _this.formationsContainer = React.createRef();
            _this.abilityTooltip = React.createRef();
            _this.background = React.createRef();
            _this.tempHoveredUnit = null;
            _this.mcTree = null;
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            _this.battleScene = new BattleScene_1.BattleScene();
            _this.abilityUseEffectQueue = new AbilityUseEffectQueue_1.AbilityUseEffectQueue(_this.battleScene, {
                onEffectStart: _this.setStateForBattleEffect,
                onVfxStart: function () {
                    _this.vfxStartTime = Date.now();
                },
                onEffectTrigger: _this.onBattleEffectTrigger,
                onCurrentFinished: _this.playQueuedBattleEffects,
                onAllFinished: _this.finishPlayingQueuedBattleEffects,
            });
            return _this;
        }
        BattleComponent.prototype.bindMethods = function () {
            this.clearHoveredUnit = this.clearHoveredUnit.bind(this);
            this.getBlurArea = this.getBlurArea.bind(this);
            this.handleMouseEnterUnit = this.handleMouseEnterUnit.bind(this);
            this.handleMouseEnterAbility = this.handleMouseEnterAbility.bind(this);
            this.usePreparedAbility = this.usePreparedAbility.bind(this);
            this.useAiAbility = this.useAiAbility.bind(this);
            this.handleMouseLeaveAbility = this.handleMouseLeaveAbility.bind(this);
            this.endTurn = this.endTurn.bind(this);
            this.startTurn = this.startTurn.bind(this);
            this.handleTurnStart = this.handleTurnStart.bind(this);
            this.handleMouseLeaveUnit = this.handleMouseLeaveUnit.bind(this);
            this.usePlayerAbility = this.usePlayerAbility.bind(this);
            this.endBattleStart = this.endBattleStart.bind(this);
            this.getUnitElement = this.getUnitElement.bind(this);
            this.handleAbilityUse = this.handleAbilityUse.bind(this);
            this.finishBattle = this.finishBattle.bind(this);
            this.setStateForBattleEffect = this.setStateForBattleEffect.bind(this);
            this.playQueuedBattleEffects = this.playQueuedBattleEffects.bind(this);
            this.finishPlayingQueuedBattleEffects = this.finishPlayingQueuedBattleEffects.bind(this);
            this.onBattleEffectTrigger = this.onBattleEffectTrigger.bind(this);
        };
        BattleComponent.prototype.getInitialStateTODO = function () {
            var initialDisplayData = {};
            this.props.battle.forEachUnit(function (unit) {
                initialDisplayData[unit.id] = unit.getDisplayData("battle");
            });
            return ({
                UIState: BattleUIState_1.BattleUIState.BattleStarting,
                highlightedUnit: null,
                hoveredUnit: null,
                hoveredAbility: null,
                abilityTargetDisplayDataById: {},
                potentialDelayId: undefined,
                potentialDelayAmount: undefined,
                abilityTooltip: {
                    parentElement: null,
                    facesLeft: null,
                },
                battleSceneUnit1: null,
                battleSceneUnit2: null,
                playingBattleEffect: false,
                battleEffectDuration: null,
                battleEffectDurationAfterTrigger: undefined,
                battleEvaluation: this.props.battle.getEvaluation(),
                unitDisplayDataById: initialDisplayData,
                previousUnitDisplayDataById: initialDisplayData,
            });
        };
        BattleComponent.prototype.componentDidMount = function () {
            this.battleStartStartTime = Date.now();
            this.background.current.handleResize();
        };
        BattleComponent.prototype.endBattleStart = function () {
            var _this = this;
            if (Date.now() < this.battleStartStartTime + 1000) {
                return;
            }
            else if (this.props.battle.ended) {
                this.setState({
                    UIState: BattleUIState_1.BattleUIState.BattleEnding,
                });
            }
            else {
                this.setState({
                    UIState: BattleUIState_1.BattleUIState.Idle,
                }, function () {
                    _this.battleScene.activeUnit = _this.props.battle.activeUnit;
                    _this.battleScene.updateUnits();
                    if (_this.tempHoveredUnit) {
                        _this.handleMouseEnterUnit(_this.tempHoveredUnit);
                    }
                    if (_this.props.battle.getActivePlayer() !== _this.props.humanPlayer) {
                        _this.useAiAbility();
                    }
                });
            }
        };
        BattleComponent.prototype.getBlurArea = function () {
            return this.formationsContainer.current.getBoundingClientRect();
        };
        BattleComponent.prototype.clearHoveredUnit = function () {
            this.tempHoveredUnit = null;
            this.setState({
                hoveredUnit: null,
                highlightedUnit: null,
                abilityTooltip: {
                    parentElement: null,
                },
                hoveredAbility: null,
                potentialDelayId: undefined,
                potentialDelayAmount: undefined,
                abilityTargetDisplayDataById: {},
            });
            this.battleScene.hoveredUnit = null;
            if (this.state.UIState === BattleUIState_1.BattleUIState.Idle) {
                this.battleScene.updateUnits();
            }
        };
        BattleComponent.prototype.handleMouseLeaveUnit = function (e) {
            if (!this.state.hoveredUnit || this.state.playingBattleEffect) {
                this.tempHoveredUnit = null;
                return;
            }
            var nativeEvent = e.nativeEvent;
            var toElement = nativeEvent.toElement || nativeEvent.relatedTarget;
            if (!toElement) {
                this.clearHoveredUnit();
                return;
            }
            if (!this.abilityTooltip.current) {
                this.clearHoveredUnit();
                return;
            }
            var tooltipElement = this.abilityTooltip.current.ownDOMNode.current;
            if (toElement !== this.state.abilityTooltip.parentElement &&
                (this.abilityTooltip && toElement !== tooltipElement) &&
                toElement.parentElement !== tooltipElement) {
                this.clearHoveredUnit();
            }
        };
        BattleComponent.prototype.handleMouseEnterUnit = function (unit) {
            this.tempHoveredUnit = unit;
            if (this.state.UIState !== BattleUIState_1.BattleUIState.Idle) {
                return;
            }
            var facesLeft = unit.battleStats.side === "side2";
            var parentElement = this.getUnitElement(unit);
            this.setState({
                abilityTooltip: {
                    parentElement: parentElement,
                    facesLeft: facesLeft,
                },
                hoveredUnit: unit,
                highlightedUnit: unit,
            });
            this.battleScene.hoveredUnit = unit;
            this.battleScene.updateUnits();
        };
        BattleComponent.prototype.handleMouseEnterAbility = function (ability) {
            var targetDisplayDataForAbility = battleAbilityDisplay_1.getAbilityTargetDisplayData(this.props.battle, ability, this.props.battle.activeUnit, this.state.hoveredUnit);
            var abilityUseDelay = ability.preparation ?
                ability.preparation.prepDelay * ability.preparation.turnsToPrep :
                ability.moveDelay;
            this.setState({
                hoveredAbility: ability,
                potentialDelayId: this.props.battle.activeUnit.id,
                potentialDelayAmount: this.props.battle.activeUnit.battleStats.moveDelay + abilityUseDelay,
                abilityTargetDisplayDataById: targetDisplayDataForAbility,
            });
        };
        BattleComponent.prototype.handleMouseLeaveAbility = function () {
            this.setState({
                hoveredAbility: null,
                potentialDelayId: undefined,
                potentialDelayAmount: undefined,
                abilityTargetDisplayDataById: {},
            });
        };
        BattleComponent.prototype.getUnitElement = function (unit) {
            return document.getElementById("unit-id_" + unit.id);
        };
        BattleComponent.prototype.handleAbilityUse = function (ability, target, wasByPlayer) {
            var user = this.props.battle.activeUnit;
            var abilityUseEffects = battleAbilityUsage_1.useAbilityAndGetUseEffects(this.props.battle, ability, this.props.battle.activeUnit, target);
            this.abilityUseEffectQueue.addEffects(abilityUseEffects);
            if (wasByPlayer && this.mcTree) {
                this.mcTree.advanceMove({
                    ability: ability,
                    userId: user.id,
                    targetId: target.id,
                }, 0.25);
            }
            this.playQueuedBattleEffects();
        };
        BattleComponent.getUnitsBySideFromEffect = function (effect) {
            var userSide = effect.vfxUser.battleStats.side;
            var targetSide = effect.vfxTarget.battleStats.side;
            return ({
                side1: (targetSide === "side1" ? effect.vfxTarget :
                    (userSide === "side1" ? effect.vfxUser : null)),
                side2: (targetSide === "side2" ? effect.vfxTarget :
                    (userSide === "side2" ? effect.vfxUser : null)),
            });
        };
        BattleComponent.prototype.setStateForBattleEffect = function (effect) {
            var units = BattleComponent.getUnitsBySideFromEffect(effect);
            this.setState({
                battleSceneUnit1: units.side1,
                battleSceneUnit2: units.side2,
                playingBattleEffect: true,
                UIState: BattleUIState_1.BattleUIState.PlayingVfx,
                battleEffectDuration: effect.vfx.duration * Options_1.options.battle.animationTiming.effectDuration,
            }, this.clearHoveredUnit);
        };
        BattleComponent.prototype.playQueuedBattleEffects = function () {
            this.abilityUseEffectQueue.playOnce();
        };
        BattleComponent.prototype.onBattleEffectTrigger = function (effect) {
            this.setState({
                previousUnitDisplayDataById: utility_1.shallowCopy(this.state.unitDisplayDataById),
                unitDisplayDataById: utility_1.shallowExtend(this.state.unitDisplayDataById, effect.changedUnitDisplayData),
                battleEvaluation: effect.newEvaluation,
                battleEffectDurationAfterTrigger: this.state.battleEffectDuration -
                    (Date.now() - this.vfxStartTime),
            });
        };
        BattleComponent.prototype.finishPlayingQueuedBattleEffects = function () {
            var _this = this;
            this.setState({
                battleSceneUnit1: null,
                battleSceneUnit2: null,
                playingBattleEffect: false,
                battleEffectDuration: undefined,
                battleEffectDurationAfterTrigger: undefined,
            }, function () {
                _this.endTurn(_this.startTurn);
            });
        };
        BattleComponent.prototype.endTurn = function (cb) {
            var _this = this;
            if (!this.state.hoveredUnit || !this.state.hoveredUnit.isTargetable()) {
                this.clearHoveredUnit();
            }
            this.props.battle.endTurn();
            this.battleScene.activeUnit = null;
            this.battleScene.updateUnits(function () {
                window.setTimeout(cb, Options_1.options.battle.animationTiming.turnTransition);
                _this.setState({
                    UIState: BattleUIState_1.BattleUIState.TransitioningTurn,
                });
            });
        };
        BattleComponent.prototype.startTurn = function () {
            var _this = this;
            this.battleScene.activeUnit = this.props.battle.activeUnit;
            this.battleScene.updateUnits(function () {
                _this.handleTurnStart();
            });
        };
        BattleComponent.prototype.handleTurnStart = function () {
            if (this.props.battle.ended) {
                this.setState({
                    UIState: BattleUIState_1.BattleUIState.BattleEnding,
                });
            }
            else if (this.props.battle.activeUnit && this.props.battle.activeUnit.battleStats.queuedAction) {
                this.usePreparedAbility();
            }
            else if (this.props.battle.getActivePlayer() !== this.props.humanPlayer) {
                this.useAiAbility();
            }
            else {
                this.battleScene.activeUnit = this.props.battle.activeUnit;
                this.battleScene.updateUnits();
                this.setState({
                    UIState: BattleUIState_1.BattleUIState.Idle,
                });
            }
        };
        BattleComponent.prototype.usePreparedAbility = function () {
            var unit = this.props.battle.activeUnit;
            var action = unit.battleStats.queuedAction;
            var target = this.props.battle.unitsById[action.targetId];
            var userIsHuman = this.props.battle.getActivePlayer() === this.props.humanPlayer;
            this.handleAbilityUse(action.ability, target, userIsHuman);
        };
        BattleComponent.prototype.usePlayerAbility = function (ability, target) {
            this.handleAbilityUse(ability, target, true);
        };
        BattleComponent.prototype.useAiAbility = function () {
            if (!this.props.battle.activeUnit || this.props.battle.ended) {
                return;
            }
            if (!this.mcTree) {
                this.mcTree = new MCTree_1.MCTree(this.props.battle, this.props.battle.activeUnit.battleStats.side);
            }
            var iterations = Math.max(Options_1.options.debug.aiVsPlayerBattleSimulationDepth, this.mcTree.rootNode.getPossibleMoves(this.props.battle).length * Math.sqrt(Options_1.options.debug.aiVsPlayerBattleSimulationDepth));
            var move = this.mcTree.getBestMoveAndAdvance(iterations, 0.25);
            var target = this.props.battle.unitsById[move.targetId];
            this.handleAbilityUse(move.ability, target, false);
        };
        BattleComponent.prototype.finishBattle = function () {
            if (Date.now() < this.battleEndStartTime + 1000) {
                return;
            }
            this.props.battle.finishBattle();
        };
        BattleComponent.prototype.render = function () {
            var battle = this.props.battle;
            var playerCanAct = this.state.UIState === BattleUIState_1.BattleUIState.Idle;
            var activeTargets = playerCanAct ? battleAbilityDisplay_1.getTargetsForAllAbilities(battle, battle.activeUnit) : undefined;
            var abilityTooltip = null;
            if (playerCanAct &&
                this.state.hoveredUnit &&
                activeTargets[this.state.hoveredUnit.id]) {
                abilityTooltip = AbilityTooltip_1.AbilityTooltip({
                    handleAbilityUse: this.usePlayerAbility,
                    handleMouseLeave: this.handleMouseLeaveUnit,
                    handleMouseEnterAbility: this.handleMouseEnterAbility,
                    handleMouseLeaveAbility: this.handleMouseLeaveAbility,
                    targetUnit: this.state.hoveredUnit,
                    parentElement: this.state.abilityTooltip.parentElement,
                    facesLeft: this.state.abilityTooltip.facesLeft,
                    activeTargets: activeTargets,
                    ref: this.abilityTooltip,
                    key: this.state.hoveredUnit.id,
                });
            }
            var activeEffectUnits = [];
            if (this.state.playingBattleEffect) {
                activeEffectUnits = [this.state.battleSceneUnit1, this.state.battleSceneUnit2];
            }
            var upperFooterElement;
            if (this.state.UIState === BattleUIState_1.BattleUIState.BattleStarting) {
                upperFooterElement = null;
            }
            else if (!this.state.playingBattleEffect) {
                upperFooterElement = TurnOrder_1.TurnOrder({
                    key: "turnOrder",
                    unitsBySide: battle.unitsBySide,
                    turnOrderDisplayData: battle.turnOrder.getDisplayData(),
                    hoveredUnit: this.state.highlightedUnit,
                    hoveredGhostIndex: isFinite(this.state.potentialDelayAmount) ?
                        battle.turnOrder.getGhostIndex(this.state.potentialDelayAmount, this.state.potentialDelayId) :
                        undefined,
                    onMouseEnterUnit: this.handleMouseEnterUnit,
                    onMouseLeaveUnit: this.handleMouseLeaveUnit,
                    turnIsTransitioning: this.state.UIState === BattleUIState_1.BattleUIState.TransitioningTurn,
                    transitionDuration: Options_1.options.battle.animationTiming.turnTransition / 2,
                });
            }
            else {
                upperFooterElement = ReactDOMElements.div({
                    key: "battleDisplayStrength",
                    className: "battle-display-strength-container",
                }, ReactDOMElements.div({
                    className: "battle-display-strength battle-display-strength-side1",
                }, this.state.battleSceneUnit1 ? BattleDisplayStrength_1.BattleDisplayStrength({
                    key: "battleDisplayStrength" + this.state.battleSceneUnit1.id,
                    animationDuration: this.state.battleEffectDurationAfterTrigger,
                    from: this.state.previousUnitDisplayDataById[this.state.battleSceneUnit1.id].currentHealth,
                    to: this.state.unitDisplayDataById[this.state.battleSceneUnit1.id].currentHealth,
                }) : null), ReactDOMElements.div({
                    className: "battle-display-strength battle-display-strength-side2",
                }, this.state.battleSceneUnit2 ? BattleDisplayStrength_1.BattleDisplayStrength({
                    key: "battleDisplayStrength" + this.state.battleSceneUnit2.id,
                    animationDuration: this.state.battleEffectDurationAfterTrigger,
                    from: this.state.previousUnitDisplayDataById[this.state.battleSceneUnit2.id].currentHealth,
                    to: this.state.unitDisplayDataById[this.state.battleSceneUnit2.id].currentHealth,
                }) : null));
            }
            var upperFooter = upperFooterElement;
            var containerProps = {
                className: "battle-container",
            };
            var playerWonBattle = null;
            if (this.state.UIState === BattleUIState_1.BattleUIState.BattleStarting) {
                containerProps.className += " battle-start-overlay";
                containerProps.onClick = this.endBattleStart;
            }
            else if (battle.ended) {
                if (!this.battleEndStartTime) {
                    this.battleEndStartTime = Date.now();
                }
                containerProps.className += " battle-start-overlay";
                containerProps.onClick = this.finishBattle;
                playerWonBattle = this.props.humanPlayer === battle.getVictor();
            }
            var battleState;
            if (this.state.UIState === BattleUIState_1.BattleUIState.BattleStarting) {
                battleState = "start";
            }
            else if (this.state.UIState === BattleUIState_1.BattleUIState.BattleEnding) {
                battleState = "finish";
            }
            else {
                battleState = "active";
            }
            return (BattleBackground_1.BattleBackground({
                backgroundSeed: this.props.battle.battleData.location.seed,
                backgroundDrawingFunction: activeModuleData_1.activeModuleData.starBackgroundDrawingFunction,
                getBlurArea: this.getBlurArea,
                ref: this.background,
            }, ReactDOMElements.div(containerProps, ReactDOMElements.div({
                className: "battle-upper",
            }, BattleScore_1.BattleScore({
                evaluation: this.state.battleEvaluation,
                player1: battle.side1Player,
                player2: battle.side2Player,
                animationDuration: this.state.battleEffectDurationAfterTrigger,
            }), upperFooter, BattleScene_2.BattleScene({
                battleState: battleState,
                battleScene: this.battleScene,
                humanPlayerWonBattle: playerWonBattle,
                flag1: battle.side1Player.flag,
                flag2: battle.side2Player.flag,
            })), ReactDOMElements.div({
                className: "formations-container",
                ref: this.formationsContainer,
            }, Formation_1.Formation({
                unitDisplayDataById: this.state.unitDisplayDataById,
                formation: battle.side1,
                facesLeft: false,
                handleMouseEnterUnit: this.handleMouseEnterUnit,
                handleMouseLeaveUnit: this.handleMouseLeaveUnit,
                isInBattlePrep: false,
                hoveredUnit: this.state.highlightedUnit,
                activeUnit: battle.activeUnit,
                abilityTargetDisplayDataById: this.state.abilityTargetDisplayDataById,
                activeEffectUnits: activeEffectUnits,
                hoveredAbility: this.state.hoveredAbility,
                capturedUnits: this.props.battle.capturedUnits,
                destroyedUnits: this.props.battle.deadUnits,
                unitStrengthAnimateDuration: this.state.battleEffectDurationAfterTrigger,
            }), TurnCounterList_1.TurnCounterList({
                turnsLeft: battle.turnsLeft,
                maxTurns: battle.maxTurns,
                animationDuration: 100,
            }), Formation_1.Formation({
                unitDisplayDataById: this.state.unitDisplayDataById,
                formation: battle.side2,
                facesLeft: true,
                handleMouseEnterUnit: this.handleMouseEnterUnit,
                handleMouseLeaveUnit: this.handleMouseLeaveUnit,
                isInBattlePrep: false,
                hoveredUnit: this.state.highlightedUnit,
                activeUnit: battle.activeUnit,
                abilityTargetDisplayDataById: this.state.abilityTargetDisplayDataById,
                activeEffectUnits: activeEffectUnits,
                hoveredAbility: this.state.hoveredAbility,
                capturedUnits: this.props.battle.capturedUnits,
                destroyedUnits: this.props.battle.deadUnits,
                unitStrengthAnimateDuration: this.state.battleEffectDurationAfterTrigger,
            }), abilityTooltip, this.state.playingBattleEffect ?
                ReactDOMElements.div({ className: "battle-formations-darken" }, null) :
                null))));
        };
        return BattleComponent;
    }(React.Component));
    exports.BattleComponent = BattleComponent;
    exports.Battle = React.createFactory(BattleComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/battle/BattleBackground", ["require", "exports", "react", "react-dom-factories", "src/BackgroundDrawer", "src/pixiWrapperFunctions"], function (require, exports, React, ReactDOMElements, BackgroundDrawer_1, pixiWrapperFunctions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattleBackgroundComponent = (function (_super) {
        __extends(BattleBackgroundComponent, _super);
        function BattleBackgroundComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "BattleBackground";
            _this.pixiContainer = React.createRef();
            _this.bindMethods();
            _this.backgroundDrawer = new BackgroundDrawer_1.BackgroundDrawer({
                seed: _this.props.backgroundSeed,
                drawBackgroundFN: _this.props.backgroundDrawingFunction,
            });
            return _this;
        }
        BattleBackgroundComponent.prototype.bindMethods = function () {
            this.handleResize = this.handleResize.bind(this);
        };
        BattleBackgroundComponent.prototype.componentDidUpdate = function (prevProps) {
            var propsToCheck = ["getBlurArea", "backgroundSeed", "backgroundDrawingFunction"];
            for (var _i = 0, propsToCheck_1 = propsToCheck; _i < propsToCheck_1.length; _i++) {
                var prop = propsToCheck_1[_i];
                if (this.props[prop] !== prevProps[prop]) {
                    this.handleResize();
                    break;
                }
            }
        };
        BattleBackgroundComponent.prototype.handleResize = function () {
            var blurarea = this.props.getBlurArea();
            this.backgroundDrawer.blurArea = pixiWrapperFunctions_1.convertClientRectToPixiRect(blurarea);
            this.backgroundDrawer.handleResize();
        };
        BattleBackgroundComponent.prototype.componentDidMount = function () {
            this.backgroundDrawer.bindRendererView(this.pixiContainer.current);
            window.addEventListener("resize", this.handleResize, false);
        };
        BattleBackgroundComponent.prototype.componentWillUnmount = function () {
            window.removeEventListener("resize", this.handleResize);
            this.backgroundDrawer.destroy();
        };
        BattleBackgroundComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "battle-pixi-container",
                ref: this.pixiContainer,
            }, this.props.children));
        };
        return BattleBackgroundComponent;
    }(React.Component));
    exports.BattleBackgroundComponent = BattleBackgroundComponent;
    exports.BattleBackground = React.createFactory(BattleBackgroundComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/battle/BattleDisplayStrength", ["require", "exports", "react", "react-dom-factories", "react-motion", "src/utility"], function (require, exports, React, ReactDOMElements, ReactMotion, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattleDisplayStrengthComponent = (function (_super) {
        __extends(BattleDisplayStrengthComponent, _super);
        function BattleDisplayStrengthComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "BattleDisplayStrength";
            return _this;
        }
        BattleDisplayStrengthComponent.prototype.render = function () {
            return (React.createElement(ReactMotion.Motion, {
                style: {
                    health: this.props.animationDuration ?
                        utility_1.fixedDurationSpring(this.props.to, this.props.animationDuration) :
                        this.props.to,
                },
                defaultStyle: { health: this.props.from },
            }, function (interpolatedStyle) {
                return ReactDOMElements.div({ className: "unit-strength-battle-display" }, Math.ceil(interpolatedStyle.health));
            }));
        };
        return BattleDisplayStrengthComponent;
    }(React.PureComponent));
    exports.BattleDisplayStrengthComponent = BattleDisplayStrengthComponent;
    exports.BattleDisplayStrength = React.createFactory(BattleDisplayStrengthComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/battle/BattleFinish", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattleFinishComponent = (function (_super) {
        __extends(BattleFinishComponent, _super);
        function BattleFinishComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "BattleFinish";
            return _this;
        }
        BattleFinishComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "battle-scene-finish-container",
            }, ReactDOMElements.h1({
                className: "battle-scene-finish-header",
            }, this.props.humanPlayerWonBattle ?
                localize_1.localize("battleFinish_victory")() :
                localize_1.localize("battleFinish_loss")()), ReactDOMElements.h3({
                className: "battle-scene-finish-subheader",
            }, localize_1.localize("battleFinish_clickAnywhereToContinue")())));
        };
        return BattleFinishComponent;
    }(React.PureComponent));
    exports.BattleFinishComponent = BattleFinishComponent;
    exports.BattleFinish = React.createFactory(BattleFinishComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/battle/BattleScene", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/battle/BattleFinish", "modules/defaultui/uicomponents/battle/BattleSceneFlag"], function (require, exports, React, ReactDOMElements, BattleFinish_1, BattleSceneFlag_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattleSceneComponent = (function (_super) {
        __extends(BattleSceneComponent, _super);
        function BattleSceneComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "BattleScene";
            _this.ownDOMNode = React.createRef();
            return _this;
        }
        BattleSceneComponent.prototype.shouldComponentUpdate = function (newProps) {
            var propsThatShouldTriggerUpdate = {
                battleState: true,
            };
            for (var key in newProps) {
                if (propsThatShouldTriggerUpdate[key] && newProps[key] !== this.props[key]) {
                    return true;
                }
            }
            return false;
        };
        BattleSceneComponent.prototype.componentDidUpdate = function (prevProps) {
            if (prevProps.battleState === "start" && this.props.battleState === "active") {
                this.props.battleScene.bindRendererView(this.ownDOMNode.current);
                this.props.battleScene.resume();
            }
            else if (prevProps.battleState === "active" && this.props.battleState === "finish") {
                this.props.battleScene.destroy();
            }
        };
        BattleSceneComponent.prototype.render = function () {
            var componentToRender;
            switch (this.props.battleState) {
                case "start":
                    {
                        componentToRender = ReactDOMElements.div({
                            className: "battle-scene-flags-container",
                        }, BattleSceneFlag_1.BattleSceneFlag({
                            flag: this.props.flag1,
                            facingRight: true,
                        }), BattleSceneFlag_1.BattleSceneFlag({
                            flag: this.props.flag2,
                            facingRight: false,
                        }));
                        break;
                    }
                case "active":
                    {
                        componentToRender = null;
                        break;
                    }
                case "finish":
                    {
                        componentToRender = BattleFinish_1.BattleFinish({
                            humanPlayerWonBattle: this.props.humanPlayerWonBattle,
                        });
                        break;
                    }
            }
            return (ReactDOMElements.div({
                className: "battle-scene",
                ref: this.ownDOMNode,
            }, componentToRender));
        };
        return BattleSceneComponent;
    }(React.Component));
    exports.BattleSceneComponent = BattleSceneComponent;
    exports.BattleScene = React.createFactory(BattleSceneComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/battle/BattleSceneFlag", ["require", "exports", "react", "react-dom-factories", "src/svgCache", "modules/defaultui/uicomponents/PlayerFlag"], function (require, exports, React, ReactDOMElements, svgCache_1, PlayerFlag_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattleSceneFlagComponent = (function (_super) {
        __extends(BattleSceneFlagComponent, _super);
        function BattleSceneFlagComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "BattleSceneFlag";
            _this.applyMask = _this.applyMask.bind(_this);
            return _this;
        }
        BattleSceneFlagComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "battle-scene-flag-container" + (this.props.facingRight ? " facing-right" : " facing-left"),
            }, PlayerFlag_1.PlayerFlag({
                props: {
                    className: "battle-scene-flag",
                },
                flag: this.props.flag,
                onUpdate: this.applyMask,
            })));
        };
        BattleSceneFlagComponent.prototype.applyMask = function (flagElement) {
            var maskId = this.props.facingRight ? "battle-scene-flag-fade-right" : "battle-scene-flag-fade-left";
            var gradientString = this.createBackgroundGradient();
            flagElement.style.backgroundColor = undefined;
            flagElement.style.background = gradientString;
            var fadeDocument = svgCache_1.svgCache.battleSceneFlagFade;
            flagElement.insertBefore(fadeDocument, flagElement.firstChild);
            flagElement.classList.add(maskId);
        };
        BattleSceneFlagComponent.prototype.createBackgroundGradient = function () {
            var bgColor = this.props.flag.backgroundColor;
            var stops = [
                { stop: 0.0, alpha: 0.7 },
                { stop: 0.6, alpha: 0.5 },
                { stop: 0.8, alpha: 0.2 },
                { stop: 1.0, alpha: 0.0 },
            ];
            return "linear-gradient(" + (this.props.facingRight ? "to right" : "to left") + ", " +
                stops.map(function (stopData) {
                    var colorString = "rgba(" + bgColor.get8BitRGB().join(", ") + ", " + stopData.alpha + ")";
                    return colorString + " " + Math.round(stopData.stop * 100) + "%";
                }).join(", ") +
                ")";
        };
        return BattleSceneFlagComponent;
    }(React.Component));
    exports.BattleSceneFlagComponent = BattleSceneFlagComponent;
    exports.BattleSceneFlag = React.createFactory(BattleSceneFlagComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/battle/BattleScore", ["require", "exports", "react", "react-dom-factories", "react-motion", "modules/defaultui/uicomponents/PlayerFlag", "src/utility"], function (require, exports, React, ReactDOMElements, ReactMotion, PlayerFlag_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattleScoreComponent = (function (_super) {
        __extends(BattleScoreComponent, _super);
        function BattleScoreComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "BattleScore";
            return _this;
        }
        BattleScoreComponent.prototype.render = function () {
            var evaluationPercentage = 50 + this.props.evaluation * 50;
            var p1MainColorString = "#" + this.props.player1.color.getHexString();
            var p1SubColorString = "#" + this.props.player1.secondaryColor.getHexString();
            var p2MainColorString = "#" + this.props.player2.color.getHexString();
            var p2SubColorString = "#" + this.props.player2.secondaryColor.getHexString();
            return (ReactDOMElements.div({
                className: "battle-score-wrapper",
            }, ReactDOMElements.div({
                className: "battle-score-container",
            }, ReactDOMElements.img({
                className: "battle-score-mid-point",
                src: "img/icons/battleScoreMidPoint.png",
            }, null), PlayerFlag_1.PlayerFlag({
                props: {
                    className: "battle-score-flag",
                },
                flag: this.props.player1.flag,
            }), React.createElement(ReactMotion.Motion, {
                style: {
                    evaluationPercentage: this.props.animationDuration ?
                        utility_1.fixedDurationSpring(evaluationPercentage, this.props.animationDuration) :
                        evaluationPercentage,
                },
                defaultStyle: { evaluationPercentage: evaluationPercentage },
            }, function (interpolatedStyle) {
                return ReactDOMElements.div({
                    className: "battle-score-bar-container",
                }, ReactDOMElements.div({
                    className: "battle-score-bar-value battle-score-bar-side1",
                    style: {
                        width: interpolatedStyle.evaluationPercentage + "%",
                        backgroundColor: p1MainColorString,
                        borderColor: p1SubColorString,
                    },
                }), ReactDOMElements.div({
                    className: "battle-score-bar-value battle-score-bar-side2",
                    style: {
                        width: 100 - interpolatedStyle.evaluationPercentage + "%",
                        backgroundColor: p2MainColorString,
                        borderColor: p2SubColorString,
                    },
                }));
            }), PlayerFlag_1.PlayerFlag({
                props: {
                    className: "battle-score-flag",
                },
                flag: this.props.player2.flag,
            }))));
        };
        return BattleScoreComponent;
    }(React.PureComponent));
    exports.BattleScoreComponent = BattleScoreComponent;
    exports.BattleScore = React.createFactory(BattleScoreComponent);
});
define("modules/defaultui/uicomponents/battle/BattleUIState", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattleUIState;
    (function (BattleUIState) {
        BattleUIState[BattleUIState["BattleStarting"] = 0] = "BattleStarting";
        BattleUIState[BattleUIState["Idle"] = 1] = "Idle";
        BattleUIState[BattleUIState["FocusingUnit"] = 2] = "FocusingUnit";
        BattleUIState[BattleUIState["PlayingVfx"] = 3] = "PlayingVfx";
        BattleUIState[BattleUIState["TransitioningTurn"] = 4] = "TransitioningTurn";
        BattleUIState[BattleUIState["BattleEnding"] = 5] = "BattleEnding";
    })(BattleUIState = exports.BattleUIState || (exports.BattleUIState = {}));
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/battle/Formation", ["require", "exports", "react", "react-dom-factories", "src/activeModuleData", "src/utility", "modules/defaultui/uicomponents/unit/EmptyUnit", "modules/defaultui/uicomponents/unit/Unit", "modules/defaultui/uicomponents/unit/UnitWrapper"], function (require, exports, React, ReactDOMElements, activeModuleData_1, utility_1, EmptyUnit_1, Unit_1, UnitWrapper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function bindFunctionIfExists(functionToBind, valueToBind) {
        if (!functionToBind) {
            return null;
        }
        else {
            return (function () { functionToBind(valueToBind); });
        }
    }
    var FormationComponent = (function (_super) {
        __extends(FormationComponent, _super);
        function FormationComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "Formation";
            return _this;
        }
        FormationComponent.prototype.render = function () {
            var formationRowElements = [];
            for (var i = 0; i < this.props.formation.length; i++) {
                var absoluteRowIndex = this.props.facesLeft ?
                    i + activeModuleData_1.activeModuleData.ruleSet.battle.rowsPerFormation :
                    i;
                var unitElements = [];
                var _loop_1 = function (j) {
                    var unit = this_1.props.formation[i][j];
                    var absolutePosition = [absoluteRowIndex, j];
                    var onMouseUp = this_1.props.onMouseUp ?
                        this_1.props.onMouseUp.bind(null, absolutePosition) :
                        null;
                    var unitProps = void 0;
                    if (unit) {
                        var unitDisplayData = this_1.props.unitDisplayDataById[unit.id];
                        var componentProps = {
                            id: unit.id,
                            onUnitClick: bindFunctionIfExists(this_1.props.onUnitClick, unit),
                            handleMouseEnterUnit: bindFunctionIfExists(this_1.props.handleMouseEnterUnit, unit),
                            handleMouseLeaveUnit: this_1.props.handleMouseLeaveUnit,
                            isDraggable: this_1.props.isDraggable,
                            onDragStart: bindFunctionIfExists(this_1.props.onDragStart, unit),
                            onDragEnd: this_1.props.onDragEnd,
                            onMouseUp: onMouseUp,
                            animateDuration: this_1.props.unitStrengthAnimateDuration,
                        };
                        var displayProps = {
                            wasDestroyed: this_1.props.destroyedUnits ? this_1.props.destroyedUnits.some(function (toCheck) { return toCheck === unit; }) : false,
                            wasCaptured: this_1.props.capturedUnits ? this_1.props.capturedUnits.some(function (toCheck) { return toCheck === unit; }) : false,
                            isInBattlePrep: this_1.props.isInBattlePrep,
                            isActiveUnit: this_1.props.activeUnit === unit,
                            isHovered: this_1.props.hoveredUnit === unit,
                            isInPotentialTargetArea: this_1.props.abilityTargetDisplayDataById[unit.id] && Boolean(this_1.props.abilityTargetDisplayDataById[unit.id].targetType),
                            isTargetOfActiveEffect: this_1.props.activeEffectUnits ? this_1.props.activeEffectUnits.some(function (toCheck) { return toCheck === unit; }) : false,
                            hoveredActionPointExpenditure: this_1.props.hoveredAbility &&
                                this_1.props.activeUnit === unit ? this_1.props.hoveredAbility.actionsUse : null,
                        };
                        unitProps = utility_1.shallowExtend(unitDisplayData, componentProps, displayProps);
                        if (this_1.props.facesLeft && this_1.props.isInBattlePrep) {
                            unitProps.facesLeft = true;
                        }
                    }
                    unitElements.push(UnitWrapper_1.UnitWrapper({
                        key: "unit_wrapper_" + i + j,
                    }, EmptyUnit_1.EmptyUnit({
                        facesLeft: this_1.props.facesLeft,
                        onMouseUp: onMouseUp,
                    }), !unit ? null : Unit_1.Unit(unitProps)));
                };
                var this_1 = this;
                for (var j = 0; j < this.props.formation[i].length; j++) {
                    _loop_1(j);
                }
                formationRowElements.push(ReactDOMElements.div({
                    className: "battle-formation-row",
                    key: "row_" + i,
                }, unitElements));
            }
            return (ReactDOMElements.div({ className: "battle-formation" }, formationRowElements));
        };
        return FormationComponent;
    }(React.Component));
    exports.FormationComponent = FormationComponent;
    exports.Formation = React.createFactory(FormationComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/battle/TurnCounter", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TurnCounterComponent = (function (_super) {
        __extends(TurnCounterComponent, _super);
        function TurnCounterComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TurnCounter";
            _this.state =
                {
                    isExiting: false,
                };
            _this.finishFadeOutAnimation = _this.finishFadeOutAnimation.bind(_this);
            return _this;
        }
        TurnCounterComponent.prototype.componentDidMount = function () {
            if (this.inner) {
                this.inner.style.animationDuration = "" + this.props.animationDuration + "ms";
            }
        };
        TurnCounterComponent.prototype.componentDidUpdate = function (prevProps) {
            var _this = this;
            if (!prevProps.isEmpty && this.props.isEmpty) {
                this.setState({
                    isExiting: true,
                }, function () {
                    window.setTimeout(_this.finishFadeOutAnimation, _this.props.animationDuration);
                });
            }
        };
        TurnCounterComponent.prototype.componentWillUnmount = function () {
            if (this.animationTimeoutHandle) {
                window.clearTimeout(this.animationTimeoutHandle);
            }
        };
        TurnCounterComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "turn-counter" +
                    (!this.props.isEmpty ? " turn-counter-available-border" : ""),
            }, this.props.isEmpty && !this.state.isExiting ? null : ReactDOMElements.div({
                key: "inner",
                className: "available-turn" + (this.state.isExiting ? " available-turn-leave-active" : ""),
                ref: function (element) {
                    _this.inner = element;
                },
            })));
        };
        TurnCounterComponent.prototype.finishFadeOutAnimation = function () {
            window.clearTimeout(this.animationTimeoutHandle);
            this.setState({
                isExiting: false,
            });
        };
        return TurnCounterComponent;
    }(React.PureComponent));
    exports.TurnCounterComponent = TurnCounterComponent;
    exports.TurnCounter = React.createFactory(TurnCounterComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/battle/TurnCounterList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/battle/TurnCounter"], function (require, exports, React, ReactDOMElements, localize_1, TurnCounter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TurnCounterListComponent = (function (_super) {
        __extends(TurnCounterListComponent, _super);
        function TurnCounterListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TurnCounterList";
            return _this;
        }
        TurnCounterListComponent.prototype.render = function () {
            var turnElements = [];
            var usedTurns = this.props.maxTurns - this.props.turnsLeft;
            for (var i = 0; i < this.props.maxTurns; i++) {
                turnElements.push(TurnCounter_1.TurnCounter({
                    key: i,
                    isEmpty: i < usedTurns,
                    animationDuration: this.props.animationDuration,
                }));
            }
            return (ReactDOMElements.div({
                className: "turns-container",
                title: localize_1.localize("turnsLeft_tooltip")(this.props.turnsLeft),
            }, turnElements));
        };
        return TurnCounterListComponent;
    }(React.PureComponent));
    exports.TurnCounterListComponent = TurnCounterListComponent;
    exports.TurnCounterList = React.createFactory(TurnCounterListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/battle/TurnOrder", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/battle/TurnOrderUnit"], function (require, exports, React, ReactDOMElements, TurnOrderUnit_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TurnOrderComponent = (function (_super) {
        __extends(TurnOrderComponent, _super);
        function TurnOrderComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TurnOrder";
            _this.ownDOMNode = React.createRef();
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        TurnOrderComponent.prototype.bindMethods = function () {
            this.setMaxUnits = this.setMaxUnits.bind(this);
        };
        TurnOrderComponent.prototype.getInitialStateTODO = function () {
            return ({
                maxUnits: 7,
                currentDisplayData: this.props.turnOrderDisplayData,
                pendingDisplayData: [],
                pendingDeadUnitsById: {},
                pendingDeadUnitIndices: {},
                insertIndex: undefined,
                animationState: TurnOrderUnit_1.AnimationState.Idle,
            });
        };
        TurnOrderComponent.prototype.componentDidMount = function () {
            this.setMaxUnits();
            window.addEventListener("resize", this.setMaxUnits);
        };
        TurnOrderComponent.prototype.componentWillUnmount = function () {
            window.removeEventListener("resize", this.setMaxUnits);
            if (isFinite(this.timeoutHandle)) {
                window.clearTimeout(this.timeoutHandle);
            }
        };
        TurnOrderComponent.prototype.componentDidUpdate = function (prevProps, prevState) {
            var _this = this;
            if (this.props.turnIsTransitioning && !prevProps.turnIsTransitioning) {
                var removedUnit = prevState.currentDisplayData[0].unit;
                var removedUnitNewIndex = void 0;
                for (var i = 0; i < this.props.turnOrderDisplayData.length; i++) {
                    if (this.props.turnOrderDisplayData[i].unit === removedUnit) {
                        removedUnitNewIndex = i;
                        break;
                    }
                }
                var pendingDeadUnitsById_1 = {};
                prevProps.turnOrderDisplayData.forEach(function (currentDisplayData) {
                    var unit = currentDisplayData.unit;
                    if (!_this.props.turnOrderDisplayData.some(function (newDisplayData) {
                        return newDisplayData.unit === unit;
                    })) {
                        pendingDeadUnitsById_1[unit.id] = true;
                    }
                });
                var unitsToRender = Math.min(this.props.turnOrderDisplayData.length, prevState.maxUnits);
                var shouldInsertRemovedUnit = removedUnitNewIndex < unitsToRender - 1;
                this.setState({
                    pendingDisplayData: this.props.turnOrderDisplayData,
                    pendingDeadUnitsById: pendingDeadUnitsById_1,
                    insertIndex: shouldInsertRemovedUnit ? removedUnitNewIndex : undefined,
                }, function () {
                    _this.removeDeadUnits();
                });
            }
        };
        TurnOrderComponent.prototype.setFinishAnimatingTimeout = function () {
            var _this = this;
            this.timeoutHandle = window.setTimeout(function () {
                _this.setState({
                    animationState: TurnOrderUnit_1.AnimationState.Idle,
                });
            }, this.props.transitionDuration);
        };
        TurnOrderComponent.prototype.removeDeadUnits = function () {
            var _this = this;
            if (Object.keys(this.state.pendingDeadUnitsById).length > 0) {
                var deadUnitIndices_1 = {};
                this.state.currentDisplayData.forEach(function (displayData, i) {
                    if (_this.state.pendingDeadUnitsById[displayData.unit.id]) {
                        deadUnitIndices_1[i] = true;
                    }
                });
                this.setState({
                    animationState: TurnOrderUnit_1.AnimationState.RemoveDeadUnit,
                    pendingDeadUnitIndices: deadUnitIndices_1,
                }, function () {
                    _this.timeoutHandle = window.setTimeout(function () {
                        _this.fillSpaceLeftByDeadUnits();
                    }, _this.props.transitionDuration);
                });
            }
            else {
                this.removeUnit();
            }
        };
        TurnOrderComponent.prototype.fillSpaceLeftByDeadUnits = function () {
            var _this = this;
            this.setState({
                animationState: TurnOrderUnit_1.AnimationState.FillSpaceLeftByDeadUnits,
            }, function () {
                _this.timeoutHandle = window.setTimeout(function () {
                    _this.setState({
                        currentDisplayData: _this.state.currentDisplayData.filter(function (d) {
                            return !_this.state.pendingDeadUnitsById[d.unit.id];
                        }),
                    }, function () {
                        _this.removeUnit();
                    });
                }, _this.props.transitionDuration);
            });
        };
        TurnOrderComponent.prototype.removeUnit = function () {
            var _this = this;
            this.setState({
                animationState: TurnOrderUnit_1.AnimationState.RemoveUnit,
            }, function () {
                _this.timeoutHandle = window.setTimeout(function () {
                    _this.setState({
                        currentDisplayData: _this.state.currentDisplayData.slice(1),
                    });
                    if (_this.state.insertIndex !== undefined) {
                        _this.clearSpaceForUnit();
                    }
                    else {
                        _this.pushUnit();
                    }
                }, _this.props.transitionDuration);
            });
        };
        TurnOrderComponent.prototype.clearSpaceForUnit = function () {
            var _this = this;
            this.setState({
                animationState: TurnOrderUnit_1.AnimationState.ClearSpaceForUnit,
            }, function () {
                _this.timeoutHandle = window.setTimeout(function () {
                    _this.insertUnit();
                }, _this.props.transitionDuration);
            });
        };
        TurnOrderComponent.prototype.insertUnit = function () {
            var _this = this;
            this.setState({
                currentDisplayData: this.state.pendingDisplayData,
                pendingDisplayData: [],
                animationState: TurnOrderUnit_1.AnimationState.InsertUnit,
            }, function () {
                _this.setFinishAnimatingTimeout();
            });
        };
        TurnOrderComponent.prototype.pushUnit = function () {
            var _this = this;
            this.setState({
                currentDisplayData: this.state.pendingDisplayData,
                pendingDisplayData: [],
                animationState: TurnOrderUnit_1.AnimationState.PushUnit,
            }, function () {
                _this.setFinishAnimatingTimeout();
            });
        };
        TurnOrderComponent.prototype.setMaxUnits = function () {
            var minUnits = 7;
            var containerElement = this.ownDOMNode.current;
            var containerWidth = containerElement.getBoundingClientRect().width - 30;
            var unitElementWidth = 160;
            var ceil = Math.ceil(containerWidth / unitElementWidth);
            this.setState({
                maxUnits: Math.max(ceil, minUnits),
            });
        };
        TurnOrderComponent.prototype.render = function () {
            var toRender = [];
            var unitsToRender = Math.min(this.state.currentDisplayData.length, this.state.maxUnits);
            var transitionDuration = this.props.transitionDuration;
            for (var i = 0; i < unitsToRender; i++) {
                var displayData = this.state.currentDisplayData[i];
                var unitAnimationState = TurnOrderUnit_1.AnimationState.Idle;
                switch (this.state.animationState) {
                    case TurnOrderUnit_1.AnimationState.RemoveDeadUnit:
                        {
                            if (this.state.pendingDeadUnitsById[displayData.unit.id]) {
                                unitAnimationState = TurnOrderUnit_1.AnimationState.RemoveDeadUnit;
                            }
                            break;
                        }
                    case TurnOrderUnit_1.AnimationState.FillSpaceLeftByDeadUnits:
                        {
                            if (this.state.pendingDeadUnitIndices[i]) {
                                unitAnimationState = TurnOrderUnit_1.AnimationState.FillSpaceLeftByDeadUnits;
                            }
                            break;
                        }
                    case TurnOrderUnit_1.AnimationState.RemoveUnit:
                        {
                            if (i === 0) {
                                unitAnimationState = TurnOrderUnit_1.AnimationState.RemoveUnit;
                            }
                            break;
                        }
                    case TurnOrderUnit_1.AnimationState.ClearSpaceForUnit:
                        {
                            if (i === this.state.insertIndex) {
                                unitAnimationState = TurnOrderUnit_1.AnimationState.ClearSpaceForUnit;
                            }
                            break;
                        }
                    case TurnOrderUnit_1.AnimationState.InsertUnit:
                        {
                            if (i === this.state.insertIndex) {
                                unitAnimationState = TurnOrderUnit_1.AnimationState.InsertUnit;
                            }
                            break;
                        }
                    case TurnOrderUnit_1.AnimationState.PushUnit:
                        {
                            if (i === unitsToRender - 1) {
                                unitAnimationState = TurnOrderUnit_1.AnimationState.PushUnit;
                            }
                            break;
                        }
                }
                toRender.push(TurnOrderUnit_1.TurnOrderUnit({
                    key: displayData.unit.id,
                    unitName: displayData.unit.name,
                    delay: displayData.moveDelay,
                    isFriendly: this.props.unitsBySide.side1.indexOf(displayData.unit) > -1,
                    isHovered: this.props.hoveredUnit && displayData.unit === this.props.hoveredUnit,
                    animationState: unitAnimationState,
                    transitionDuration: transitionDuration,
                    onMouseEnter: this.props.onMouseEnterUnit.bind(null, displayData.unit),
                    onMouseLeave: this.props.onMouseLeaveUnit,
                }));
            }
            if (isFinite(this.props.hoveredGhostIndex)) {
                toRender.splice(this.props.hoveredGhostIndex, 0, ReactDOMElements.div({
                    className: "turn-order-arrow",
                    key: "ghost",
                }));
            }
            return (ReactDOMElements.div({ className: "turn-order-container", ref: this.ownDOMNode }, toRender));
        };
        return TurnOrderComponent;
    }(React.Component));
    exports.TurnOrderComponent = TurnOrderComponent;
    exports.TurnOrder = React.createFactory(TurnOrderComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/battle/TurnOrderUnit", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, localize_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    var AnimationState;
    (function (AnimationState) {
        AnimationState[AnimationState["RemoveDeadUnit"] = 0] = "RemoveDeadUnit";
        AnimationState[AnimationState["FillSpaceLeftByDeadUnits"] = 1] = "FillSpaceLeftByDeadUnits";
        AnimationState[AnimationState["RemoveUnit"] = 2] = "RemoveUnit";
        AnimationState[AnimationState["ClearSpaceForUnit"] = 3] = "ClearSpaceForUnit";
        AnimationState[AnimationState["InsertUnit"] = 4] = "InsertUnit";
        AnimationState[AnimationState["PushUnit"] = 5] = "PushUnit";
        AnimationState[AnimationState["Idle"] = 6] = "Idle";
    })(AnimationState = exports.AnimationState || (exports.AnimationState = {}));
    var containerClassForAnimationState = (_a = {},
        _a[AnimationState.RemoveDeadUnit] = "remove-dead-unit",
        _a[AnimationState.FillSpaceLeftByDeadUnits] = "fill-space-left-by-dead-unit",
        _a[AnimationState.RemoveUnit] = "remove-unit",
        _a[AnimationState.ClearSpaceForUnit] = "clear-space-for-unit",
        _a[AnimationState.InsertUnit] = "insert-unit",
        _a[AnimationState.PushUnit] = "push-unit",
        _a[AnimationState.Idle] = "",
        _a);
    var TurnOrderUnitComponent = (function (_super) {
        __extends(TurnOrderUnitComponent, _super);
        function TurnOrderUnitComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TurnOrderUnit";
            return _this;
        }
        TurnOrderUnitComponent.prototype.render = function () {
            var additionalUnitClasses = "";
            if (this.props.isFriendly) {
                additionalUnitClasses += " turn-order-unit-friendly";
            }
            else {
                additionalUnitClasses += " turn-order-unit-enemy";
            }
            if (this.props.isHovered) {
                additionalUnitClasses += " turn-order-unit-hover";
            }
            return (ReactDOMElements.div({
                className: "turn-order-unit-container" + " " +
                    containerClassForAnimationState[this.props.animationState],
                style: {
                    animationDuration: "" + this.props.transitionDuration + "ms",
                },
            }, ReactDOMElements.div({
                className: "turn-order-unit" + additionalUnitClasses,
                style: {
                    animationDuration: "" + this.props.transitionDuration + "ms",
                },
                title: localize_1.localize("delay_tooltip")(this.props.delay),
                onMouseEnter: this.props.onMouseEnter,
                onMouseLeave: this.props.onMouseLeave,
            }, this.props.unitName)));
        };
        return TurnOrderUnitComponent;
    }(React.PureComponent));
    exports.TurnOrderUnitComponent = TurnOrderUnitComponent;
    exports.TurnOrderUnit = React.createFactory(TurnOrderUnitComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/battleprep/BattleInfo", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/PlayerFlag", "modules/defaultui/uicomponents/galaxymap/TerritoryBuildingList", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, PlayerFlag_1, TerritoryBuildingList_1, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattleInfoComponent = (function (_super) {
        __extends(BattleInfoComponent, _super);
        function BattleInfoComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "BattleInfo";
            return _this;
        }
        BattleInfoComponent.prototype.render = function () {
            var battlePrep = this.props.battlePrep;
            var star = battlePrep.battleData.location;
            var isAttacker = battlePrep.humanPlayer === battlePrep.attacker;
            return (ReactDOMElements.div({
                className: "battle-info",
            }, ReactDOMElements.div({
                className: "battle-info-opponent",
            }, PlayerFlag_1.PlayerFlag({
                flag: battlePrep.enemyPlayer.flag,
                props: {
                    className: "battle-info-opponent-icon",
                },
            }), ReactDOMElements.div({
                className: "battle-info-opponent-name",
            }, battlePrep.enemyPlayer.name.fullName)), ReactDOMElements.div({
                className: "battle-info-summary",
            }, star.name + ": " + (isAttacker ? localize_1.localize("attacking")() : localize_1.localize("defending")())), TerritoryBuildingList_1.TerritoryBuildingList({
                buildings: star.territoryBuildings,
                reverse: isAttacker,
            })));
        };
        return BattleInfoComponent;
    }(React.Component));
    exports.BattleInfoComponent = BattleInfoComponent;
    exports.BattleInfo = React.createFactory(BattleInfoComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/battleprep/BattlePrep", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/App", "src/BattlePrepFormationValidity", "src/BattleSimulator", "src/Options", "src/activeModuleData", "src/utility", "modules/defaultui/uicomponents/battle/BattleBackground", "modules/defaultui/uicomponents/battle/Formation", "modules/defaultui/uicomponents/unitlist/ItemList", "modules/defaultui/uicomponents/unitlist/MenuUnitInfo", "modules/defaultui/uicomponents/unitlist/UnitList", "modules/defaultui/uicomponents/battleprep/BattleInfo"], function (require, exports, React, ReactDOMElements, localize_1, App_1, BattlePrepFormationValidity_1, BattleSimulator_1, Options_1, activeModuleData_1, utility_1, BattleBackground_1, Formation_1, ItemList_1, MenuUnitInfo_1, UnitList_1, BattleInfo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattlePrepComponent = (function (_super) {
        __extends(BattlePrepComponent, _super);
        function BattlePrepComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "BattlePrep";
            _this.backgroundComponent = React.createRef();
            _this.state =
                {
                    currentDragUnit: null,
                    hoveredUnit: null,
                    selectedUnit: null,
                    currentDragItem: null,
                    leftLowerElement: "playerFormation",
                };
            _this.handleMouseEnterUnit = _this.handleMouseEnterUnit.bind(_this);
            _this.handleDragEnd = _this.handleDragEnd.bind(_this);
            _this.handleItemDragStart = _this.handleItemDragStart.bind(_this);
            _this.setLeftLowerElement = _this.setLeftLowerElement.bind(_this);
            _this.handleItemDragEnd = _this.handleItemDragEnd.bind(_this);
            _this.handleItemDrop = _this.handleItemDrop.bind(_this);
            _this.setSelectedUnit = _this.setSelectedUnit.bind(_this);
            _this.handleMouseLeaveUnit = _this.handleMouseLeaveUnit.bind(_this);
            _this.clearSelectedUnit = _this.clearSelectedUnit.bind(_this);
            _this.autoMakeFormation = _this.autoMakeFormation.bind(_this);
            _this.handleSelectUnitListRow = _this.handleSelectUnitListRow.bind(_this);
            _this.handleSelectItemListRow = _this.handleSelectItemListRow.bind(_this);
            _this.handleDragStart = _this.handleDragStart.bind(_this);
            _this.handleDrop = _this.handleDrop.bind(_this);
            _this.getBackgroundBlurArea = _this.getBackgroundBlurArea.bind(_this);
            return _this;
        }
        BattlePrepComponent.prototype.componentDidMount = function () {
            this.backgroundComponent.current.handleResize();
        };
        BattlePrepComponent.prototype.render = function () {
            var _this = this;
            var battlePrep = this.props.battlePrep;
            var player = battlePrep.humanPlayer;
            var leftUpperElement;
            var hoveredUnit = this.state.currentDragUnit || this.state.hoveredUnit;
            if (hoveredUnit) {
                leftUpperElement = MenuUnitInfo_1.MenuUnitInfo({
                    unit: hoveredUnit,
                });
            }
            else if (this.state.selectedUnit) {
                var selectedUnitIsFriendly = battlePrep.humanUnits.some(function (unit) { return unit === _this.state.selectedUnit; });
                leftUpperElement = MenuUnitInfo_1.MenuUnitInfo({
                    unit: this.state.selectedUnit,
                    onMouseUp: this.handleItemDrop,
                    isDraggable: selectedUnitIsFriendly,
                    onDragStart: this.handleItemDragStart,
                    onDragEnd: this.handleItemDragEnd,
                    currentDragItem: this.state.currentDragItem,
                });
            }
            else {
                leftUpperElement = BattleInfo_1.BattleInfo({
                    battlePrep: battlePrep,
                });
            }
            var leftLowerElement;
            switch (this.state.leftLowerElement) {
                case "playerFormation":
                    {
                        leftLowerElement = Formation_1.Formation({
                            key: "playerFormation",
                            formation: battlePrep.humanFormation.formation,
                            facesLeft: false,
                            unitDisplayDataById: battlePrep.humanFormation.getDisplayData(),
                            isInBattlePrep: true,
                            hoveredUnit: this.state.hoveredUnit,
                            activeUnit: this.state.selectedUnit,
                            abilityTargetDisplayDataById: {},
                            onMouseUp: this.handleDrop,
                            onUnitClick: this.setSelectedUnit,
                            handleMouseEnterUnit: this.handleMouseEnterUnit,
                            handleMouseLeaveUnit: this.handleMouseLeaveUnit,
                            unitStrengthAnimateDuration: undefined,
                            isDraggable: true,
                            onDragStart: this.handleDragStart.bind(null, false),
                            onDragEnd: this.handleDragEnd,
                        });
                        break;
                    }
                case "enemyFormation":
                    {
                        leftLowerElement = Formation_1.Formation({
                            key: "enemyFormation",
                            formation: battlePrep.enemyFormation.formation,
                            facesLeft: true,
                            unitDisplayDataById: battlePrep.enemyFormation.getDisplayData(),
                            isInBattlePrep: true,
                            hoveredUnit: this.state.hoveredUnit,
                            activeUnit: this.state.selectedUnit,
                            abilityTargetDisplayDataById: {},
                            onUnitClick: this.setSelectedUnit,
                            handleMouseEnterUnit: this.handleMouseEnterUnit,
                            handleMouseLeaveUnit: this.handleMouseLeaveUnit,
                            unitStrengthAnimateDuration: undefined,
                            isDraggable: false,
                        });
                        break;
                    }
                case "itemEquip":
                    {
                        leftLowerElement = ItemList_1.ItemList({
                            key: "itemEquip",
                            items: player.items,
                            isDraggable: true,
                            onDragStart: this.handleItemDragStart,
                            onDragEnd: this.handleItemDragEnd,
                            onRowChange: this.handleSelectItemListRow,
                        });
                        break;
                    }
            }
            var playerIsDefending = player === battlePrep.defender;
            var humanFormationValidity = battlePrep.humanFormation.getFormationValidity();
            var canInspectEnemyFormation = this.canInspectEnemyFormation();
            return (ReactDOMElements.div({ className: "battle-prep" }, ReactDOMElements.div({ className: "battle-prep-left" }, ReactDOMElements.div({ className: "battle-prep-left-upper-wrapper" }, BattleBackground_1.BattleBackground({
                getBlurArea: this.getBackgroundBlurArea,
                backgroundSeed: battlePrep.battleData.location.seed,
                backgroundDrawingFunction: activeModuleData_1.activeModuleData.starBackgroundDrawingFunction,
                ref: this.backgroundComponent,
            }, ReactDOMElements.div({ className: "battle-prep-left-upper-inner" }, leftUpperElement))), ReactDOMElements.div({ className: "battle-prep-left-controls" }, ReactDOMElements.button({
                className: "battle-prep-controls-button",
                onClick: this.setLeftLowerElement.bind(this, "itemEquip"),
                disabled: this.state.leftLowerElement === "itemEquip",
            }, localize_1.localize("equip")()), ReactDOMElements.button({
                className: "battle-prep-controls-button",
                onClick: this.setLeftLowerElement.bind(this, "playerFormation"),
                disabled: this.state.leftLowerElement === "playerFormation",
            }, localize_1.localize("ownFormation")()), ReactDOMElements.button({
                className: "battle-prep-controls-button",
                onClick: this.setLeftLowerElement.bind(this, "enemyFormation"),
                disabled: this.state.leftLowerElement === "enemyFormation" || !canInspectEnemyFormation,
                title: canInspectEnemyFormation ?
                    undefined :
                    localize_1.localize("cantInspectEnemyFormationAsStarIsNotInDetectionRadius")(),
            }, localize_1.localize("enemy")()), ReactDOMElements.button({
                onClick: this.autoMakeFormation,
            }, localize_1.localize("autoFormation")()), ReactDOMElements.button({
                onClick: function () {
                    App_1.app.reactUI.switchScene("galaxyMap");
                },
                disabled: playerIsDefending,
            }, localize_1.localize("cancel")()), ReactDOMElements.button({
                className: "battle-prep-controls-button",
                disabled: !humanFormationValidity.isValid,
                title: humanFormationValidity.isValid ? "" : this.localizeInvalidFormationExplanation(battlePrep.humanFormation, humanFormationValidity),
                onClick: function () {
                    var battle = battlePrep.makeBattle();
                    App_1.app.reactUI.battle = battle;
                    App_1.app.reactUI.switchScene("battle");
                },
            }, localize_1.localize("startBattle")()), !Options_1.options.debug.enabled ? null : ReactDOMElements.button({
                className: "battle-prep-controls-button",
                onClick: function () {
                    var battle = battlePrep.makeBattle();
                    var simulator = new BattleSimulator_1.BattleSimulator(battle);
                    simulator.simulateBattle();
                    battle.isSimulated = false;
                    simulator.finishBattle();
                },
            }, localize_1.localize("simulateBattle")())), ReactDOMElements.div({ className: "battle-prep-left-lower" }, leftLowerElement)), UnitList_1.UnitList({
                units: battlePrep.humanFormation.units,
                selectedUnit: this.state.selectedUnit,
                reservedUnits: battlePrep.humanFormation.getPlacedUnits(),
                unavailableUnits: battlePrep.humanPlayer === battlePrep.attacker ?
                    battlePrep.humanUnits.filter(function (unit) { return !unit.canFightOffensiveBattle(); }) :
                    [],
                hoveredUnit: this.state.hoveredUnit,
                isDraggable: this.state.leftLowerElement === "playerFormation",
                onDragStart: this.handleDragStart.bind(null, true),
                onDragEnd: this.handleDragEnd,
                onRowChange: this.handleSelectUnitListRow,
                onMouseEnterUnit: this.handleMouseEnterUnit,
                onMouseLeaveUnit: this.handleMouseLeaveUnit,
            })));
        };
        BattlePrepComponent.prototype.canInspectEnemyFormation = function () {
            var player = this.props.battlePrep.humanPlayer;
            return player.starIsDetected(this.props.battlePrep.battleData.location);
        };
        BattlePrepComponent.prototype.autoMakeFormation = function () {
            this.props.battlePrep.humanFormation.clearFormation();
            this.props.battlePrep.humanFormation.setAutoFormation(this.props.battlePrep.enemyUnits, this.props.battlePrep.enemyFormation.formation);
            this.setLeftLowerElement("playerFormation");
            this.forceUpdate();
        };
        BattlePrepComponent.prototype.handleSelectUnitListRow = function (row) {
            this.setSelectedUnit(row.content.props.unit);
        };
        BattlePrepComponent.prototype.handleSelectItemListRow = function (row) {
            if (row.content.props.unit) {
                this.setSelectedUnit(row.content.props.unit);
            }
        };
        BattlePrepComponent.prototype.clearSelectedUnit = function () {
            this.setState({
                selectedUnit: null,
            });
        };
        BattlePrepComponent.prototype.setSelectedUnit = function (unit) {
            if (unit === this.state.selectedUnit) {
                this.clearSelectedUnit();
                return;
            }
            this.setState({
                selectedUnit: unit,
                hoveredUnit: null,
            });
        };
        BattlePrepComponent.prototype.handleMouseEnterUnit = function (unit) {
            this.setState({
                hoveredUnit: unit,
            });
        };
        BattlePrepComponent.prototype.handleMouseLeaveUnit = function () {
            this.setState({
                hoveredUnit: null,
            });
        };
        BattlePrepComponent.prototype.handleDragStart = function (cameFromUnitList, unit) {
            if (cameFromUnitList && this.props.battlePrep.humanFormation.hasUnit(unit)) {
                this.props.battlePrep.humanFormation.removeUnit(unit);
            }
            this.setState({
                currentDragUnit: unit,
            });
        };
        BattlePrepComponent.prototype.handleDragEnd = function (dropSuccessful) {
            if (dropSuccessful === void 0) { dropSuccessful = false; }
            if (!dropSuccessful && this.state.currentDragUnit) {
                if (this.props.battlePrep.humanFormation.hasUnit(this.state.currentDragUnit)) {
                    this.props.battlePrep.humanFormation.removeUnit(this.state.currentDragUnit);
                }
            }
            this.setState({
                currentDragUnit: null,
                hoveredUnit: null,
            });
            return dropSuccessful;
        };
        BattlePrepComponent.prototype.handleDrop = function (position) {
            var battlePrep = this.props.battlePrep;
            if (this.state.currentDragUnit) {
                battlePrep.humanFormation.assignUnit(this.state.currentDragUnit, position);
            }
            this.handleDragEnd(true);
        };
        BattlePrepComponent.prototype.handleItemDragStart = function (item) {
            this.setState({
                currentDragItem: item,
            });
        };
        BattlePrepComponent.prototype.setLeftLowerElement = function (newElement) {
            var oldElement = this.state.leftLowerElement;
            var newState = {
                leftLowerElement: newElement,
            };
            if (oldElement === "enemyFormation" || newElement === "enemyFormation") {
                newState.selectedUnit = null;
            }
            this.setState(newState);
        };
        BattlePrepComponent.prototype.handleItemDragEnd = function (dropSuccessful) {
            if (dropSuccessful === void 0) { dropSuccessful = false; }
            if (!dropSuccessful && this.state.currentDragItem && this.state.selectedUnit) {
                var item = this.state.currentDragItem;
                if (this.state.selectedUnit.items.hasItem(item)) {
                    this.state.selectedUnit.items.removeItem(item);
                }
            }
            this.setState({
                currentDragItem: null,
            });
        };
        BattlePrepComponent.prototype.handleItemDrop = function (index) {
            var item = this.state.currentDragItem;
            var unit = this.state.selectedUnit;
            if (unit && item) {
                unit.items.addItemAtPosition(item, index);
            }
            this.handleItemDragEnd(true);
        };
        BattlePrepComponent.prototype.getBackgroundBlurArea = function () {
            if (!this.backgroundComponent.current) {
                throw new Error("Battle prep background element hasn't mounted yet");
            }
            return this.backgroundComponent.current.pixiContainer.current.getBoundingClientRect();
        };
        BattlePrepComponent.prototype.localizeFormationInvalidityReason = function (formation, reason) {
            switch (reason) {
                case BattlePrepFormationValidity_1.FormationInvalidityReason.Valid:
                    {
                        throw new Error("Tried to display reason for formation invalidity when formation wasn't invalid.");
                    }
                case BattlePrepFormationValidity_1.FormationInvalidityReason.NotEnoughUnits:
                    {
                        return localize_1.localize("notEnoughUnitsPlaced")({
                            minUnits: formation.getValidityRestriction().minUnits,
                        });
                    }
            }
        };
        BattlePrepComponent.prototype.localizeModifierEffect = function (effect) {
            var sortOrder = {
                minUnits: 0,
            };
            var allKeys = Object.keys(effect);
            return allKeys.sort(function (a, b) {
                return sortOrder[a] - sortOrder[b];
            }).map(function (prop) {
                switch (prop) {
                    case "minUnits":
                        {
                            return localize_1.localize("battlePrepValidityModifierEffect_minUnits")({ minUnits: effect.minUnits });
                        }
                }
            }).join(localize_1.localize("listItemSeparator")());
        };
        BattlePrepComponent.prototype.localizeFormationValidityModifierSource = function (formation, modifier) {
            switch (modifier.sourceType) {
                case BattlePrepFormationValidity_1.FormationValidityModifierSourceType.OffensiveBattle:
                    {
                        return localize_1.localize("battlePrepValidityModifierSource_offensiveBattle")();
                    }
                case BattlePrepFormationValidity_1.FormationValidityModifierSourceType.AttackedInEnemyTerritory:
                    {
                        return localize_1.localize("battlePrepValidityModifierSource_attackedInEnemyTerritory")();
                    }
                case BattlePrepFormationValidity_1.FormationValidityModifierSourceType.AttackedInNeutralTerritory:
                    {
                        return localize_1.localize("battlePrepValidityModifierSource_attackedInNeutralTerritory")();
                    }
                case BattlePrepFormationValidity_1.FormationValidityModifierSourceType.PassiveAbility:
                    {
                        var humanPlayer = this.props.battlePrep.humanPlayer;
                        var sourceAbility = modifier.sourcePassiveAbility.abilityTemplate;
                        var sourceUnit = modifier.sourcePassiveAbility.unit;
                        var sourceUnitIsKnown = sourceUnit.fleet.player === humanPlayer || this.canInspectEnemyFormation();
                        if (sourceUnitIsKnown) {
                            return localize_1.localize("battlePrepValidityModifierSource_passiveAbility_known")({
                                abilityName: sourceAbility.displayName,
                                unitName: sourceUnit.name,
                            });
                        }
                        else {
                            return localize_1.localize("battlePrepValidityModifierSource_passiveAbility_unknown")();
                        }
                    }
            }
        };
        BattlePrepComponent.prototype.localizeInvalidFormationExplanation = function (formation, validity) {
            var _this = this;
            var allReasons = utility_1.extractFlagsFromFlagWord(validity.reasons, BattlePrepFormationValidity_1.FormationInvalidityReason);
            var reasonString = allReasons.sort().map(function (reason) {
                return _this.localizeFormationInvalidityReason(formation, reason);
            }).join("\n");
            var modifiersString = validity.modifiers.map(function (modifier) {
                var modifierEffectString = _this.localizeModifierEffect(modifier.effect);
                var modifierSourceString = _this.localizeFormationValidityModifierSource(formation, modifier);
                return modifierEffectString + " " + modifierSourceString;
            }).join("\n");
            return reasonString + "\n\n" + modifiersString;
        };
        return BattlePrepComponent;
    }(React.Component));
    exports.BattlePrepComponent = BattlePrepComponent;
    exports.BattlePrep = React.createFactory(BattlePrepComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/BattleSceneTester", ["require", "exports", "react", "react-dom-factories", "src/Battle", "src/BattleScene", "src/Player", "src/Star", "src/Unit", "src/utility", "src/activeModuleData"], function (require, exports, React, ReactDOMElements, Battle_1, BattleScene_1, Player_1, Star_1, Unit_1, utility_1, activeModuleData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattleSceneTesterComponent = (function (_super) {
        __extends(BattleSceneTesterComponent, _super);
        function BattleSceneTesterComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "BattleSceneTester";
            _this.battle = null;
            _this.battleScene = null;
            _this.battleSceneContainer = React.createRef();
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        BattleSceneTesterComponent.prototype.bindMethods = function () {
            this.useSelectedAbility = this.useSelectedAbility.bind(this);
            this.makeBattle = this.makeBattle.bind(this);
            this.selectUnit = this.selectUnit.bind(this);
            this.makeUnitElements = this.makeUnitElements.bind(this);
            this.makeFormation = this.makeFormation.bind(this);
            this.makeUnit = this.makeUnit.bind(this);
            this.handleUnitHover = this.handleUnitHover.bind(this);
            this.handleClearHover = this.handleClearHover.bind(this);
            this.handleChangeDuration = this.handleChangeDuration.bind(this);
            this.handleSelectVfxTemplate = this.handleSelectVfxTemplate.bind(this);
        };
        BattleSceneTesterComponent.prototype.getInitialStateTODO = function () {
            var side1Units = [];
            var side2Units = [];
            for (var i = 0; i < 5; i++) {
                side1Units.push(this.makeUnit());
                side2Units.push(this.makeUnit());
            }
            var side1Player = Player_1.Player.createDummyPlayer();
            var side2Player = Player_1.Player.createDummyPlayer();
            var battle = this.battle = this.makeBattle({
                side1Units: side1Units,
                side2Units: side2Units,
                side1Player: side1Player,
                side2Player: side2Player,
            });
            battle.init();
            var initialVfxTemplateKey = "assimilate";
            var initialVfxTemplate = activeModuleData_1.activeModuleData.templates.BattleVfx[initialVfxTemplateKey];
            return ({
                activeUnit: side1Units[0],
                selectedSide1Unit: side1Units[0],
                selectedSide2Unit: side2Units[0],
                selectedVfxTemplateKey: initialVfxTemplateKey,
                duration: initialVfxTemplate.duration,
            });
        };
        BattleSceneTesterComponent.prototype.componentDidMount = function () {
            var battleScene = this.battleScene = new BattleScene_1.BattleScene(this.battleSceneContainer.current);
            battleScene.resume();
            battleScene.activeUnit = this.state.selectedSide1Unit;
            battleScene.updateUnits();
        };
        BattleSceneTesterComponent.prototype.makeUnit = function () {
            var template = utility_1.getRandomProperty(activeModuleData_1.activeModuleData.templates.Units);
            return Unit_1.Unit.fromTemplate({
                template: template,
                race: utility_1.getRandomProperty(activeModuleData_1.activeModuleData.templates.Races),
            });
        };
        BattleSceneTesterComponent.prototype.makeFormation = function (units) {
            var formation = [];
            var unitsIndex = 0;
            for (var i = 0; i < 2; i++) {
                formation.push([]);
                for (var j = 0; j < 3; j++) {
                    var unitToAdd = units[unitsIndex] ? units[unitsIndex] : null;
                    formation[i].push(unitToAdd);
                    unitsIndex++;
                }
            }
            return formation;
        };
        BattleSceneTesterComponent.prototype.makeBattle = function (props) {
            return new Battle_1.Battle({
                battleData: {
                    location: new Star_1.Star({
                        x: 69,
                        y: 420,
                    }),
                    building: null,
                    attacker: {
                        player: props.side1Player,
                        units: props.side1Units,
                    },
                    defender: {
                        player: props.side2Player,
                        units: props.side2Units,
                    },
                },
                side1: this.makeFormation(props.side1Units),
                side2: this.makeFormation(props.side2Units),
                side1Player: props.side1Player,
                side2Player: props.side2Player,
            });
        };
        BattleSceneTesterComponent.prototype.handleUnitHover = function (unit) {
            this.battleScene.hoveredUnit = unit;
            this.battleScene.updateUnits();
        };
        BattleSceneTesterComponent.prototype.handleClearHover = function () {
            this.battleScene.hoveredUnit = null;
            this.battleScene.updateUnits();
        };
        BattleSceneTesterComponent.prototype.selectUnit = function (unit) {
            var statePropForSide = unit.battleStats.side === "side1" ? "selectedSide1Unit" : "selectedSide2Unit";
            var statePropForOtherSide = unit.battleStats.side === "side1" ? "selectedSide2Unit" : "selectedSide1Unit";
            var previousSelectedUnit = this.state[statePropForSide];
            var newSelectedUnit = (previousSelectedUnit === unit) ? null : unit;
            var newStateObj = {};
            newStateObj[statePropForSide] = newSelectedUnit;
            var newActiveUnit = newSelectedUnit || this.state[statePropForOtherSide] || null;
            newStateObj.activeUnit = newActiveUnit;
            this.setState(newStateObj);
            this.battleScene.activeUnit = newActiveUnit;
            this.battleScene.updateUnits();
        };
        BattleSceneTesterComponent.prototype.handleSelectVfxTemplate = function (e) {
            var target = e.currentTarget;
            var vfxTemplate = activeModuleData_1.activeModuleData.templates.BattleVfx[target.value];
            this.setState({
                selectedVfxTemplateKey: target.value,
                duration: vfxTemplate.duration,
            });
        };
        BattleSceneTesterComponent.prototype.handleChangeDuration = function (e) {
            var target = e.currentTarget;
            this.setState({
                duration: parseInt(target.value),
            });
        };
        BattleSceneTesterComponent.prototype.useSelectedAbility = function () {
            var user = this.state.activeUnit;
            var target = user === this.state.selectedSide1Unit ? this.state.selectedSide2Unit : this.state.selectedSide1Unit;
            var bs = this.battleScene;
            var vfxTemplate = utility_1.extendObject(activeModuleData_1.activeModuleData.templates.BattleVfx[this.state.selectedVfxTemplateKey]);
            if (this.state.duration) {
                vfxTemplate.duration = this.state.duration;
            }
            bs.handleAbilityUse({
                user: user,
                target: target,
                vfxTemplate: vfxTemplate,
                abilityUseEffect: null,
                triggerEffectCallback: function () { console.log("triggerEffect"); },
                onVfxStartCallback: function () { console.log("onVfxStart"); },
                afterFinishedCallback: function () { console.log("afterFinishedCallback"); },
            });
        };
        BattleSceneTesterComponent.prototype.makeUnitElements = function (units) {
            var unitElements = [];
            for (var i = 0; i < units.length; i++) {
                var unit = units[i];
                var style = {};
                if (unit === this.state.activeUnit) {
                    style.border = "1px solid red";
                }
                if (unit === this.state.selectedSide1Unit || unit === this.state.selectedSide2Unit) {
                    style.backgroundColor = "yellow";
                }
                unitElements.push(ReactDOMElements.div({
                    className: "battle-scene-test-controls-units-unit",
                    onMouseEnter: this.handleUnitHover.bind(this, unit),
                    onMouseLeave: this.handleClearHover.bind(this, unit),
                    onClick: this.selectUnit.bind(this, unit),
                    key: "" + unit.id,
                    style: style,
                }, unit.name));
            }
            return unitElements;
        };
        BattleSceneTesterComponent.prototype.render = function () {
            var battle = this.battle;
            var side1UnitElements = this.makeUnitElements(battle.getUnitsForSide("side1"));
            var side2UnitElements = this.makeUnitElements(battle.getUnitsForSide("side2"));
            var vfxTemplateSelectOptions = [];
            for (var key in activeModuleData_1.activeModuleData.templates.BattleVfx) {
                vfxTemplateSelectOptions.push(ReactDOMElements.option({
                    value: key,
                    key: key,
                }, key));
            }
            return (ReactDOMElements.div({
                className: "battle-scene-test",
            }, ReactDOMElements.div({
                className: "battle-scene-test-pixi-container",
                ref: this.battleSceneContainer,
            }, null), ReactDOMElements.div({
                className: "battle-scene-test-controls",
            }, ReactDOMElements.div({
                className: "battle-scene-test-controls-units",
            }, ReactDOMElements.div({
                className: "battle-scene-test-controls-units-side1",
            }, side1UnitElements), ReactDOMElements.div({
                className: "battle-scene-test-controls-units-side2",
            }, side2UnitElements)), ReactDOMElements.select({
                value: this.state.selectedVfxTemplateKey,
                onChange: this.handleSelectVfxTemplate,
            }, vfxTemplateSelectOptions), ReactDOMElements.button({
                className: "battle-scene-test-ability2",
                onClick: this.useSelectedAbility,
                disabled: !this.state.selectedVfxTemplateKey || !(this.state.selectedSide1Unit && this.state.selectedSide2Unit),
            }, "use ability"), ReactDOMElements.input({
                type: "number",
                step: 100,
                min: 100,
                max: 20000,
                value: "" + this.state.duration,
                onChange: this.handleChangeDuration,
                placeholder: "duration",
            }, null))));
        };
        return BattleSceneTesterComponent;
    }(React.Component));
    exports.BattleSceneTesterComponent = BattleSceneTesterComponent;
    exports.BattleSceneTester = React.createFactory(BattleSceneTesterComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/diplomacy/AttitudeModifierInfo", ["require", "exports", "react", "react-dom-factories", "src/utility"], function (require, exports, React, ReactDOMElements, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AttitudeModifierInfoComponent = (function (_super) {
        __extends(AttitudeModifierInfoComponent, _super);
        function AttitudeModifierInfoComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "AttitudeModifierInfo";
            _this.bindMethods();
            return _this;
        }
        AttitudeModifierInfoComponent.prototype.bindMethods = function () {
            this.makeCell = this.makeCell.bind(this);
        };
        AttitudeModifierInfoComponent.prototype.makeCell = function (type) {
            var cellProps = {
                key: type,
                className: "attitude-modifier-info-cell" + " attitude-modifier-info-" + type,
            };
            var cellContent;
            switch (type) {
                case "name":
                    {
                        cellContent = this.props.name;
                        break;
                    }
                case "endTurn":
                    {
                        if (this.props.endTurn < 0) {
                            cellContent = null;
                        }
                        break;
                    }
                case "strength":
                    {
                        var relativeValue = utility_1.getRelativeValue(this.props.strength, -20, 20);
                        relativeValue = utility_1.clamp(relativeValue, 0, 1);
                        var deviation = Math.abs(0.5 - relativeValue) * 2;
                        var hue = 110 * relativeValue;
                        var saturation = 0 + 50 * deviation;
                        if (deviation > 0.3) {
                            saturation += 40;
                        }
                        var lightness = 70 - 20 * deviation;
                        cellProps.style =
                            {
                                color: "hsl(" +
                                    hue + "," +
                                    saturation + "%," +
                                    lightness + "%)",
                            };
                        cellContent = this.props.strength;
                        break;
                    }
            }
            return (ReactDOMElements.td(cellProps, cellContent));
        };
        AttitudeModifierInfoComponent.prototype.render = function () {
            var columns = this.props.activeColumns;
            var cells = [];
            for (var i = 0; i < columns.length; i++) {
                var cell = this.makeCell(columns[i].key);
                cells.push(cell);
            }
            return (ReactDOMElements.tr({
                className: "attitude-modifier-info",
                onClick: this.props.handleClick,
            }, cells));
        };
        return AttitudeModifierInfoComponent;
    }(React.Component));
    exports.AttitudeModifierInfoComponent = AttitudeModifierInfoComponent;
    exports.AttitudeModifierInfo = React.createFactory(AttitudeModifierInfoComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/diplomacy/AttitudeModifierList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/list/List", "modules/defaultui/uicomponents/mixins/AutoPositioner", "modules/defaultui/uicomponents/mixins/applyMixins", "modules/defaultui/uicomponents/diplomacy/AttitudeModifierInfo"], function (require, exports, React, ReactDOMElements, localize_1, List_1, AutoPositioner_1, applyMixins_1, AttitudeModifierInfo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AttitudeModifierListComponent = (function (_super) {
        __extends(AttitudeModifierListComponent, _super);
        function AttitudeModifierListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "AttitudeModifierList";
            _this.ownDOMNode = React.createRef();
            if (_this.props.autoPositionerProps) {
                applyMixins_1.applyMixins(_this, new AutoPositioner_1.AutoPositioner(_this, _this.ownDOMNode));
            }
            return _this;
        }
        AttitudeModifierListComponent.prototype.render = function () {
            var modifiers = this.props.attitudeModifiers;
            var rows = [];
            for (var i = 0; i < modifiers.length; i++) {
                var modifier = modifiers[i];
                if (modifier.isOverRidden) {
                    continue;
                }
                rows.push({
                    key: modifier.template.type,
                    content: AttitudeModifierInfo_1.AttitudeModifierInfo({
                        name: modifier.template.displayName,
                        strength: modifier.getAdjustedStrength(),
                        endTurn: modifier.endTurn,
                    }),
                });
            }
            var columns = [
                {
                    label: localize_1.localize("displayName")(),
                    key: "name",
                    defaultOrder: "asc",
                    sortingFunction: function (a, b) {
                        var alphabeticSortOrder = 0;
                        if (b.content.props.name > a.content.props.name) {
                            alphabeticSortOrder -= 1;
                        }
                        else if (b.content.props.name < a.content.props.name) {
                            alphabeticSortOrder += 1;
                        }
                        return alphabeticSortOrder;
                    },
                },
                {
                    label: localize_1.localize("attitudeModifierEffect")(),
                    key: "strength",
                    defaultOrder: "desc",
                },
                {
                    label: localize_1.localize("endsOn")(),
                    key: "endTurn",
                    defaultOrder: "asc",
                },
            ];
            return (ReactDOMElements.div({
                className: "attitude-modifier-list auto-position fixed-table-parent",
                ref: this.ownDOMNode,
            }, List_1.List({
                listItems: rows,
                initialColumns: columns,
                initialSortOrder: [columns[1], columns[0], columns[2]],
            })));
        };
        return AttitudeModifierListComponent;
    }(React.Component));
    exports.AttitudeModifierListComponent = AttitudeModifierListComponent;
    exports.AttitudeModifierList = React.createFactory(AttitudeModifierListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/diplomacy/DiplomacyActions", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/trade/TradeOverview", "modules/defaultui/uicomponents/windows/DefaultWindow", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, TradeOverview_1, DefaultWindow_1, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DiplomacyActionsComponent = (function (_super) {
        __extends(DiplomacyActionsComponent, _super);
        function DiplomacyActionsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "DiplomacyActions";
            _this.state =
                {
                    hasTradePopup: false,
                };
            _this.bindMethods();
            return _this;
        }
        DiplomacyActionsComponent.prototype.render = function () {
            var player = this.props.player;
            var targetPlayer = this.props.targetPlayer;
            var declareWarProps = {
                className: "diplomacy-action-button",
            };
            if (player.diplomacy.canDeclareWarOn(targetPlayer)) {
                declareWarProps.onClick = this.handleDeclareWar;
            }
            else {
                declareWarProps.disabled = true;
                declareWarProps.className += " disabled";
            }
            var makePeaceProps = {
                className: "diplomacy-action-button",
            };
            if (player.diplomacy.canMakePeaceWith(targetPlayer)) {
                makePeaceProps.onClick = this.handleMakePeace;
            }
            else {
                makePeaceProps.disabled = true;
                makePeaceProps.className += " disabled";
            }
            return (ReactDOMElements.div({
                className: "diplomacy-actions",
            }, ReactDOMElements.button(declareWarProps, localize_1.localize("declareWar")()), ReactDOMElements.button(makePeaceProps, localize_1.localize("makePeace")()), ReactDOMElements.button({
                className: "diplomacy-action-button",
                onClick: this.toggleTradePopup,
            }, localize_1.localize("trade_action")()), !this.state.hasTradePopup ? null :
                DefaultWindow_1.DefaultWindow({
                    handleClose: this.closeTradePopup,
                    title: localize_1.localize("tradeWindowTitle")(),
                }, TradeOverview_1.TradeOverview({
                    selfPlayer: this.props.player,
                    otherPlayer: this.props.targetPlayer,
                    handleClose: this.closeTradePopup,
                }))));
        };
        DiplomacyActionsComponent.prototype.bindMethods = function () {
            this.openTradePopup = this.openTradePopup.bind(this);
            this.closeTradePopup = this.closeTradePopup.bind(this);
            this.toggleTradePopup = this.toggleTradePopup.bind(this);
            this.handleMakePeace = this.handleMakePeace.bind(this);
            this.handleDeclareWar = this.handleDeclareWar.bind(this);
        };
        DiplomacyActionsComponent.prototype.openTradePopup = function () {
            this.setState({ hasTradePopup: true });
        };
        DiplomacyActionsComponent.prototype.closeTradePopup = function () {
            this.setState({ hasTradePopup: false });
        };
        DiplomacyActionsComponent.prototype.toggleTradePopup = function () {
            if (this.state.hasTradePopup) {
                this.closeTradePopup();
            }
            else {
                this.openTradePopup();
            }
        };
        DiplomacyActionsComponent.prototype.handleDeclareWar = function () {
            this.props.player.diplomacy.declareWarOn(this.props.targetPlayer);
            this.props.onUpdate();
        };
        DiplomacyActionsComponent.prototype.handleMakePeace = function () {
            this.props.player.diplomacy.makePeaceWith(this.props.targetPlayer);
            this.props.onUpdate();
        };
        return DiplomacyActionsComponent;
    }(React.Component));
    exports.DiplomacyActionsComponent = DiplomacyActionsComponent;
    exports.DiplomacyActions = React.createFactory(DiplomacyActionsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/diplomacy/DiplomacyOverview", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/DiplomacyState", "modules/defaultui/uicomponents/list/List", "modules/defaultui/uicomponents/windows/DefaultWindow", "modules/defaultui/uicomponents/diplomacy/DiplomacyActions", "modules/defaultui/uicomponents/diplomacy/DiplomaticStatusPlayer"], function (require, exports, React, ReactDOMElements, localize_1, DiplomacyState_1, List_1, DefaultWindow_1, DiplomacyActions_1, DiplomaticStatusPlayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DiplomacyOverviewComponent = (function (_super) {
        __extends(DiplomacyOverviewComponent, _super);
        function DiplomacyOverviewComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "DiplomacyOverview";
            _this.state =
                {
                    playersWithOpenedDiplomacyActionsPopup: [],
                };
            _this.bindMethods();
            return _this;
        }
        DiplomacyOverviewComponent.prototype.render = function () {
            var _this = this;
            var metPlayers = this.props.player.diplomacy.getMetPlayers();
            var alivePlayers = metPlayers.filter(function (player) { return !player.isDead; });
            var deadPlayers = metPlayers.filter(function (player) { return player.isDead; });
            var rows = alivePlayers.map(function (player) {
                var status = _this.props.player.diplomacy.getStatusWithPlayer(player);
                return ({
                    key: "" + player.id,
                    content: DiplomaticStatusPlayer_1.DiplomaticStatusPlayer({
                        player: player,
                        name: player.name.fullName,
                        status: DiplomacyState_1.DiplomacyState[status],
                        opinion: player.diplomacy.getOpinionOf(_this.props.player),
                        flag: player.flag,
                        canInteractWith: _this.props.player.diplomacy.canDoDiplomacyWithPlayer(player),
                        statusSortingNumber: status,
                        attitudeModifiers: player.diplomacy.getAttitudeModifiersForPlayer(_this.props.player),
                    }),
                });
            }).concat(deadPlayers.map(function (player) {
                return ({
                    key: "" + player.id,
                    content: DiplomaticStatusPlayer_1.DiplomaticStatusPlayer({
                        player: player,
                        name: player.name.fullName,
                        status: localize_1.localize("deadPlayer")(),
                        opinion: null,
                        flag: player.flag,
                        canInteractWith: _this.props.player.diplomacy.canDoDiplomacyWithPlayer(player),
                        statusSortingNumber: -99999,
                    }),
                });
            }));
            var columns = [
                {
                    label: "",
                    key: "flag",
                    defaultOrder: "asc",
                    notSortable: true,
                },
                {
                    label: localize_1.localize("displayName")(),
                    key: "name",
                    defaultOrder: "asc",
                },
                {
                    label: localize_1.localize("diplomaticStatus")(),
                    key: "status",
                    defaultOrder: "desc",
                    propToSortBy: "statusSortingNumber",
                },
                {
                    label: localize_1.localize("opinion")(),
                    key: "opinion",
                    defaultOrder: "desc",
                },
            ];
            return (ReactDOMElements.div({ className: "diplomacy-overview" }, this.state.playersWithOpenedDiplomacyActionsPopup.map(function (targetPlayer) {
                return DefaultWindow_1.DefaultWindow({
                    key: targetPlayer.id,
                    handleClose: _this.closeDiplomacyActionsPopup.bind(null, targetPlayer),
                    title: "" + targetPlayer.name,
                    isResizable: false,
                }, DiplomacyActions_1.DiplomacyActions({
                    player: _this.props.player,
                    targetPlayer: targetPlayer,
                    onUpdate: _this.forceUpdate.bind(_this),
                }));
            }), ReactDOMElements.div({ className: "diplomacy-status-list fixed-table-parent" }, List_1.List({
                listItems: rows,
                initialColumns: columns,
                initialSortOrder: [columns[2], columns[1]],
                onRowChange: this.toggleDiplomacyActionsPopup,
                addSpacer: true,
            }))));
        };
        DiplomacyOverviewComponent.prototype.bindMethods = function () {
            this.hasDiplomacyActionsPopup = this.hasDiplomacyActionsPopup.bind(this);
            this.openDiplomacyActionsPopup = this.openDiplomacyActionsPopup.bind(this);
            this.closeDiplomacyActionsPopup = this.closeDiplomacyActionsPopup.bind(this);
            this.toggleDiplomacyActionsPopup = this.toggleDiplomacyActionsPopup.bind(this);
        };
        DiplomacyOverviewComponent.prototype.hasDiplomacyActionsPopup = function (player) {
            return this.state.playersWithOpenedDiplomacyActionsPopup.indexOf(player) !== -1;
        };
        DiplomacyOverviewComponent.prototype.openDiplomacyActionsPopup = function (player) {
            this.setState({
                playersWithOpenedDiplomacyActionsPopup: this.state.playersWithOpenedDiplomacyActionsPopup.concat(player),
            });
        };
        DiplomacyOverviewComponent.prototype.closeDiplomacyActionsPopup = function (playerToCloseFor) {
            this.setState({
                playersWithOpenedDiplomacyActionsPopup: this.state.playersWithOpenedDiplomacyActionsPopup.filter(function (player) {
                    return player !== playerToCloseFor;
                }),
            });
        };
        DiplomacyOverviewComponent.prototype.toggleDiplomacyActionsPopup = function (rowItem) {
            var player = rowItem.content.props.player;
            if (this.hasDiplomacyActionsPopup(player)) {
                this.closeDiplomacyActionsPopup(player);
            }
            else {
                this.openDiplomacyActionsPopup(player);
            }
        };
        return DiplomacyOverviewComponent;
    }(React.Component));
    exports.DiplomacyOverviewComponent = DiplomacyOverviewComponent;
    exports.DiplomacyOverview = React.createFactory(DiplomacyOverviewComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/diplomacy/DiplomaticStatusPlayer", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/PlayerFlag", "modules/defaultui/uicomponents/diplomacy/Opinion"], function (require, exports, React, ReactDOMElements, PlayerFlag_1, Opinion_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DiplomaticStatusPlayerComponent = (function (_super) {
        __extends(DiplomaticStatusPlayerComponent, _super);
        function DiplomaticStatusPlayerComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "DiplomaticStatusPlayer";
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        DiplomaticStatusPlayerComponent.prototype.bindMethods = function () {
            this.makeCell = this.makeCell.bind(this);
        };
        DiplomaticStatusPlayerComponent.prototype.getInitialStateTODO = function () {
            return ({
                hasAttitudeModifierTootlip: false,
            });
        };
        DiplomaticStatusPlayerComponent.prototype.makeCell = function (type) {
            var className = "diplomatic-status-player-cell" + " diplomatic-status-" + type;
            var cellContent = this.props[type];
            if (type === "player") {
                className += " player-name";
            }
            if (type === "flag" && this.props.flag) {
                cellContent = PlayerFlag_1.PlayerFlag({
                    flag: this.props.flag,
                    props: {
                        className: "diplomacy-status-player-icon",
                    },
                });
            }
            if (type === "opinion") {
                cellContent = Opinion_1.Opinion({
                    attitudeModifiers: this.props.attitudeModifiers,
                    opinion: this.props.opinion,
                });
            }
            return (ReactDOMElements.td({
                key: type,
                className: className,
            }, cellContent));
        };
        DiplomaticStatusPlayerComponent.prototype.render = function () {
            var columns = this.props.activeColumns;
            var cells = [];
            for (var i = 0; i < columns.length; i++) {
                var cell = this.makeCell(columns[i].key);
                cells.push(cell);
            }
            var rowProps = {
                className: "diplomatic-status-player",
                onClick: this.props.canInteractWith ?
                    this.props.handleClick :
                    null,
            };
            if (!this.props.canInteractWith) {
                rowProps.className += " disabled";
            }
            return (ReactDOMElements.tr(rowProps, cells));
        };
        return DiplomaticStatusPlayerComponent;
    }(React.Component));
    exports.DiplomaticStatusPlayerComponent = DiplomaticStatusPlayerComponent;
    exports.DiplomaticStatusPlayer = React.createFactory(DiplomaticStatusPlayerComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/diplomacy/Opinion", ["require", "exports", "react", "react-dom-factories", "src/utility", "modules/defaultui/uicomponents/diplomacy/AttitudeModifierList"], function (require, exports, React, ReactDOMElements, utility_1, AttitudeModifierList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OpinionComponent = (function (_super) {
        __extends(OpinionComponent, _super);
        function OpinionComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "Opinion";
            _this.opinionTextNode = React.createRef();
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        OpinionComponent.prototype.bindMethods = function () {
            this.getColor = this.getColor.bind(this);
            this.getOpinionTextNodeRect = this.getOpinionTextNodeRect.bind(this);
            this.setTooltip = this.setTooltip.bind(this);
            this.clearTooltip = this.clearTooltip.bind(this);
        };
        OpinionComponent.prototype.getInitialStateTODO = function () {
            return ({
                hasAttitudeModifierTootlip: false,
            });
        };
        OpinionComponent.prototype.setTooltip = function () {
            this.setState({ hasAttitudeModifierTootlip: true });
        };
        OpinionComponent.prototype.clearTooltip = function () {
            this.setState({ hasAttitudeModifierTootlip: false });
        };
        OpinionComponent.prototype.getOpinionTextNodeRect = function () {
            return this.opinionTextNode.current.getBoundingClientRect();
        };
        OpinionComponent.prototype.getColor = function () {
            var relativeValue = utility_1.getRelativeValue(this.props.opinion, -30, 30);
            relativeValue = utility_1.clamp(relativeValue, 0, 1);
            var deviation = Math.abs(0.5 - relativeValue) * 2;
            var hue = 110 * relativeValue;
            var saturation = 0 + 50 * deviation;
            if (deviation > 0.3) {
                saturation += 40;
            }
            var lightness = 70 - 20 * deviation;
            return ("hsl(" +
                hue + "," +
                saturation + "%," +
                lightness + "%)");
        };
        OpinionComponent.prototype.render = function () {
            var tooltip = null;
            if (this.state.hasAttitudeModifierTootlip) {
                tooltip = AttitudeModifierList_1.AttitudeModifierList({
                    attitudeModifiers: this.props.attitudeModifiers,
                    autoPositionerProps: {
                        getParentClientRect: this.getOpinionTextNodeRect,
                        positionOnUpdate: true,
                        ySide: "outerTop",
                        xSide: "outerRight",
                        yMargin: 10,
                    },
                });
            }
            return (ReactDOMElements.div({
                className: "player-opinion",
                onMouseEnter: this.setTooltip,
                onMouseLeave: this.clearTooltip,
            }, ReactDOMElements.span({
                ref: this.opinionTextNode,
                style: {
                    color: this.getColor(),
                },
            }, this.props.opinion), tooltip));
        };
        return OpinionComponent;
    }(React.Component));
    exports.OpinionComponent = OpinionComponent;
    exports.Opinion = React.createFactory(OpinionComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("modules/defaultui/uicomponents/Emblem", ["require", "exports", "react", "react-dom-factories", "src/Emblem"], function (require, exports, React, ReactDOMElements, Emblem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EmblemComponent = (function (_super) {
        __extends(EmblemComponent, _super);
        function EmblemComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "Emblem";
            _this.container = React.createRef();
            return _this;
        }
        EmblemComponent.prototype.renderEmblemCanvas = function () {
            var emblem = new Emblem_1.Emblem(this.props.colors, this.props.template);
            if (this.container.current.firstChild) {
                this.container.current.removeChild(this.container.current.firstChild);
            }
            this.container.current.appendChild(emblem.draw());
        };
        EmblemComponent.prototype.componentDidMount = function () {
            this.renderEmblemCanvas();
        };
        EmblemComponent.prototype.componentDidUpdate = function () {
            this.renderEmblemCanvas();
        };
        EmblemComponent.prototype.render = function () {
            var baseClassName = "standalone-emblem";
            var hasSpecifiedTitle = this.props.containerProps && this.props.containerProps.title;
            var containerProps = __assign({}, this.props.containerProps, { className: baseClassName + (this.props.containerProps && this.props.containerProps.className ?
                    " " + this.props.containerProps.className :
                    ""), ref: this.container, title: hasSpecifiedTitle ?
                    this.props.containerProps.title :
                    this.props.template.key });
            return (ReactDOMElements.div(containerProps, null));
        };
        return EmblemComponent;
    }(React.PureComponent));
    exports.EmblemComponent = EmblemComponent;
    exports.Emblem = React.createFactory(EmblemComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/errors/ErrorBoundary", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ErrorBoundaryComponent = (function (_super) {
        __extends(ErrorBoundaryComponent, _super);
        function ErrorBoundaryComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ErrorBoundary";
            _this.state =
                {
                    error: null,
                    errorInfo: null,
                };
            return _this;
        }
        ErrorBoundaryComponent.prototype.clearError = function () {
            this.setState({
                error: null,
                errorInfo: null,
            });
        };
        ErrorBoundaryComponent.prototype.componentDidCatch = function (error, info) {
            this.setState({
                error: error,
                errorInfo: info,
            });
        };
        ErrorBoundaryComponent.prototype.render = function () {
            if (this.state.error) {
                return this.props.renderError(this.state.error, this.state.errorInfo);
            }
            else {
                return this.props.children;
            }
        };
        return ErrorBoundaryComponent;
    }(React.Component));
    exports.ErrorBoundaryComponent = ErrorBoundaryComponent;
    exports.ErrorBoundary = React.createFactory(ErrorBoundaryComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/errors/ErrorDetails", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ErrorDetailsComponent = (function (_super) {
        __extends(ErrorDetailsComponent, _super);
        function ErrorDetailsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ErrorDetails";
            return _this;
        }
        ErrorDetailsComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "error-details",
            }, ReactDOMElements.h1({
                className: "error-header"
            }, localize_1.localize("genericError")()), ReactDOMElements.h2({
                className: "error-description",
            }, localize_1.localize("genericErrorDescription")()), ReactDOMElements.h3({
                className: "error-cause-description",
            }, localize_1.localize("genericErrorCauseDescription")()), !this.props.customMessage ? null :
                ReactDOMElements.h3({
                    className: "error-custom-message"
                }, this.props.customMessage), ReactDOMElements.p({
                className: "error-instructions",
            }, localize_1.localize("checkConsolePrompt")() + " (" + localize_1.localize("openConsoleInstructions")() + ")")));
        };
        return ErrorDetailsComponent;
    }(React.Component));
    exports.ErrorDetailsComponent = ErrorDetailsComponent;
    exports.ErrorDetails = React.createFactory(ErrorDetailsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/errors/SaveRecovery", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/saves/EmergencySaveGame", "modules/defaultui/uicomponents/errors/ErrorBoundary", "modules/defaultui/uicomponents/saves/LoadGame", "modules/defaultui/uicomponents/saves/SaveGame"], function (require, exports, React, ReactDOMElements, localize_1, EmergencySaveGame_1, ErrorBoundary_1, LoadGame_1, SaveGame_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SaveRecoveryComponent = (function (_super) {
        __extends(SaveRecoveryComponent, _super);
        function SaveRecoveryComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "SaveRecovery";
            _this.saveRecoveryErrorBoundary = React.createRef();
            _this.state =
                {
                    expandedElementType: null,
                };
            _this.handleExpandButtonClick = _this.handleExpandButtonClick.bind(_this);
            return _this;
        }
        SaveRecoveryComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "save-recovery"
            }, ReactDOMElements.p({
                className: "save-recovery-possible-message",
            }, localize_1.localize("canTryToRecoverGame")()), ReactDOMElements.div({
                className: "save-recovery-buttons"
            }, ReactDOMElements.button({
                className: "save-recovery-button",
                onClick: function () { return _this.handleExpandButtonClick("save"); },
            }, localize_1.localize("save_action")()), ReactDOMElements.button({
                className: "save-recovery-button",
                onClick: function () { return _this.handleExpandButtonClick("load"); },
            }, localize_1.localize("load_action")())), ErrorBoundary_1.ErrorBoundary({
                ref: this.saveRecoveryErrorBoundary,
                renderError: function () {
                    return (ReactDOMElements.div({
                        className: "error-in-save-recovery",
                    }, ReactDOMElements.h3({
                        className: "error-in-save-recovery-title",
                    }, localize_1.localize("errorWithGameRecovery")()), EmergencySaveGame_1.EmergencySaveGame()));
                },
            }, this.state.expandedElementType ? this.renderExpandedElement() : null)));
        };
        SaveRecoveryComponent.prototype.renderExpandedElement = function () {
            switch (this.state.expandedElementType) {
                case "save":
                    return SaveGame_1.SaveGame({ handleClose: this.handleExpandButtonClick.bind(this, "save") });
                case "load":
                    return LoadGame_1.LoadGame({ handleClose: this.handleExpandButtonClick.bind(this, "load") });
                case null:
                    return null;
            }
        };
        SaveRecoveryComponent.prototype.handleExpandButtonClick = function (buttonType) {
            this.saveRecoveryErrorBoundary.current.clearError();
            if (this.state.expandedElementType === buttonType) {
                this.setState({ expandedElementType: null });
            }
            else {
                this.setState({ expandedElementType: buttonType });
            }
        };
        return SaveRecoveryComponent;
    }(React.Component));
    exports.SaveRecoveryComponent = SaveRecoveryComponent;
    exports.SaveRecovery = React.createFactory(SaveRecoveryComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/errors/SaveRecoveryWithDetails", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/errors/ErrorDetails", "modules/defaultui/uicomponents/errors/SaveRecovery"], function (require, exports, React, ReactDOMElements, ErrorDetails_1, SaveRecovery_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SaveRecoveryWithDetailsComponent = (function (_super) {
        __extends(SaveRecoveryWithDetailsComponent, _super);
        function SaveRecoveryWithDetailsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "SaveRecoveryWithDetails";
            return _this;
        }
        SaveRecoveryWithDetailsComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "error-plus-save-recovery",
            }, ErrorDetails_1.ErrorDetails({
                error: this.props.error,
                customMessage: this.props.customMessage,
            }), this.props.game ? SaveRecovery_1.SaveRecovery() : null));
        };
        return SaveRecoveryWithDetailsComponent;
    }(React.Component));
    exports.SaveRecoveryWithDetailsComponent = SaveRecoveryWithDetailsComponent;
    exports.SaveRecoveryWithDetails = React.createFactory(SaveRecoveryWithDetailsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/errors/TopLevelErrorBoundary", ["require", "exports", "react", "modules/defaultui/uicomponents/errors/ErrorBoundary", "modules/defaultui/uicomponents/errors/SaveRecoveryWithDetails", "modules/defaultui/localization/localize"], function (require, exports, React, ErrorBoundary_1, SaveRecoveryWithDetails_1, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TopLevelErrorBoundaryComponent = (function (_super) {
        __extends(TopLevelErrorBoundaryComponent, _super);
        function TopLevelErrorBoundaryComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TopLevelErrorBoundary";
            return _this;
        }
        TopLevelErrorBoundaryComponent.prototype.render = function () {
            var _this = this;
            return (ErrorBoundary_1.ErrorBoundary({
                renderError: function (error, info) {
                    var customErrorMessage = _this.props.errorReportingMode !== "panic" ?
                        localize_1.localize("UIErrorPanicDespiteUserPreference")(_this.props.errorReportingMode) :
                        null;
                    return SaveRecoveryWithDetails_1.SaveRecoveryWithDetails({
                        game: _this.props.game,
                        error: error,
                        customMessage: customErrorMessage,
                    });
                },
            }, this.props.children));
        };
        return TopLevelErrorBoundaryComponent;
    }(React.Component));
    exports.TopLevelErrorBoundaryComponent = TopLevelErrorBoundaryComponent;
    exports.TopLevelErrorBoundary = React.createFactory(TopLevelErrorBoundaryComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/FlagMaker", ["require", "exports", "react", "react-dom-factories", "src/Flag", "src/colorGeneration", "modules/defaultui/uicomponents/PlayerFlag"], function (require, exports, React, ReactDOMElements, Flag_1, colorGeneration_1, PlayerFlag_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FlagMakerComponent = (function (_super) {
        __extends(FlagMakerComponent, _super);
        function FlagMakerComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.setStateTimeoutHandle = undefined;
            _this.sizeValue = 46;
            _this.flagsElement = React.createRef();
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        FlagMakerComponent.prototype.bindMethods = function () {
            this.handleSizeChange = this.handleSizeChange.bind(this);
            this.makeFlags = this.makeFlags.bind(this);
        };
        FlagMakerComponent.prototype.getInitialStateTODO = function () {
            return ({
                size: 46,
            });
        };
        FlagMakerComponent.prototype.handleSizeChange = function (e) {
            if (this.setStateTimeoutHandle) {
                window.clearTimeout(this.setStateTimeoutHandle);
            }
            var target = e.currentTarget;
            var value = parseInt(target.value);
            if (isFinite(value)) {
                this.sizeValue = value;
                this.setStateTimeoutHandle = window.setTimeout(this.setState.bind(this, { size: value }), 500);
            }
        };
        FlagMakerComponent.prototype.makeFlags = function () {
            this.forceUpdate();
        };
        FlagMakerComponent.prototype.render = function () {
            var flagElements = [];
            for (var i = 0; i < 100; i++) {
                var colorScheme = colorGeneration_1.generateColorScheme();
                var flag = new Flag_1.Flag(colorScheme.main);
                flag.addRandomEmblem(colorScheme.secondary);
                flagElements.push(PlayerFlag_1.PlayerFlag({
                    key: i,
                    flag: flag,
                    props: {
                        width: this.state.size,
                        height: this.state.size,
                        style: {
                            width: this.state.size,
                            height: this.state.size,
                        },
                    },
                }));
            }
            return (ReactDOMElements.div(null, ReactDOMElements.div({
                className: "flag-maker-flags",
                ref: this.flagsElement,
            }, flagElements), ReactDOMElements.button({
                onClick: this.makeFlags,
            }, "make flags"), ReactDOMElements.input({
                onChange: this.handleSizeChange,
                defaultValue: "" + this.sizeValue,
                type: "number",
            })));
        };
        return FlagMakerComponent;
    }(React.Component));
    exports.FlagMakerComponent = FlagMakerComponent;
    exports.FlagMaker = React.createFactory(FlagMakerComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/EconomySummary", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/list/List", "modules/defaultui/uicomponents/galaxymap/EconomySummaryItem"], function (require, exports, React, ReactDOMElements, localize_1, List_1, EconomySummaryItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EconomySummaryComponent = (function (_super) {
        __extends(EconomySummaryComponent, _super);
        function EconomySummaryComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "EconomySummary";
            return _this;
        }
        EconomySummaryComponent.prototype.render = function () {
            var rows = [];
            var player = this.props.player;
            for (var i = 0; i < player.controlledLocations.length; i++) {
                var star = player.controlledLocations[i];
                rows.push({
                    key: "" + star.id,
                    content: EconomySummaryItem_1.EconomySummaryItem({
                        star: star,
                        id: star.id,
                        name: star.name,
                        income: star.getIncome(),
                    }),
                });
            }
            var columns = [
                {
                    label: localize_1.localize("id")(),
                    key: "id",
                    defaultOrder: "asc",
                },
                {
                    label: localize_1.localize("displayName")(),
                    key: "name",
                    defaultOrder: "asc",
                },
                {
                    label: localize_1.localize("income")(),
                    key: "income",
                    defaultOrder: "desc",
                },
            ];
            return (ReactDOMElements.div({ className: "economy-summary-list fixed-table-parent" }, List_1.List({
                listItems: rows,
                initialColumns: columns,
                initialSortOrder: [columns[2]],
            })));
        };
        return EconomySummaryComponent;
    }(React.Component));
    exports.EconomySummaryComponent = EconomySummaryComponent;
    exports.EconomySummary = React.createFactory(EconomySummaryComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/EconomySummaryItem", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EconomySummaryItemComponent = (function (_super) {
        __extends(EconomySummaryItemComponent, _super);
        function EconomySummaryItemComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "EconomySummaryItem";
            _this.bindMethods();
            return _this;
        }
        EconomySummaryItemComponent.prototype.bindMethods = function () {
            this.makeCell = this.makeCell.bind(this);
        };
        EconomySummaryItemComponent.prototype.makeCell = function (type) {
            var cellProps = {
                key: type,
                className: "economy-summary-item-cell" + " economy-summary-" + type,
            };
            var cellContent;
            switch (type) {
                case "id":
                    {
                        cellContent = this.props.id;
                        break;
                    }
                case "name":
                    {
                        cellContent = this.props.name;
                        break;
                    }
                case "income":
                    {
                        cellContent = this.props.income;
                        break;
                    }
            }
            return (ReactDOMElements.td(cellProps, cellContent));
        };
        EconomySummaryItemComponent.prototype.render = function () {
            var columns = this.props.activeColumns;
            var cells = [];
            for (var i = 0; i < columns.length; i++) {
                var cell = this.makeCell(columns[i].key);
                cells.push(cell);
            }
            var rowProps = {
                className: "economy-summary-item",
                onClick: this.props.handleClick,
            };
            return (ReactDOMElements.tr(rowProps, cells));
        };
        return EconomySummaryItemComponent;
    }(React.Component));
    exports.EconomySummaryItemComponent = EconomySummaryItemComponent;
    exports.EconomySummaryItem = React.createFactory(EconomySummaryItemComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/FleetContents", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/galaxymap/FleetUnitInfo"], function (require, exports, React, ReactDOMElements, FleetUnitInfo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FleetContentsComponent = (function (_super) {
        __extends(FleetContentsComponent, _super);
        function FleetContentsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "FleetContents";
            _this.bindMethods();
            return _this;
        }
        FleetContentsComponent.prototype.bindMethods = function () {
            this.handleMouseUp = this.handleMouseUp.bind(this);
        };
        FleetContentsComponent.prototype.handleMouseUp = function () {
            if (!this.props.onMouseUp) {
                return;
            }
            this.props.onMouseUp(this.props.fleet);
        };
        FleetContentsComponent.prototype.render = function () {
            var fleetUnitInfos = [];
            var fleet = this.props.fleet;
            var hasDraggableContent = Boolean(this.props.onDragStart ||
                this.props.onDragEnd);
            for (var i = 0; i < fleet.units.length; i++) {
                var unit = fleet.units[i];
                fleetUnitInfos.push(FleetUnitInfo_1.FleetUnitInfo({
                    key: unit.id,
                    unit: unit,
                    isDraggable: hasDraggableContent,
                    onDragStart: this.props.onDragStart,
                    onDragEnd: this.props.onDragEnd,
                    isIdentified: this.props.player.unitIsIdentified(unit),
                }));
            }
            if (hasDraggableContent) {
                fleetUnitInfos.push(ReactDOMElements.div({
                    className: "fleet-contents-dummy-unit",
                    key: "dummy",
                }));
            }
            return (ReactDOMElements.div({
                className: "fleet-contents",
                onMouseUp: this.handleMouseUp,
            }, fleetUnitInfos));
        };
        return FleetContentsComponent;
    }(React.Component));
    exports.FleetContentsComponent = FleetContentsComponent;
    exports.FleetContents = React.createFactory(FleetContentsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/FleetControls", ["require", "exports", "react", "react-dom-factories", "src/eventManager", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, eventManager_1, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FleetControlsComponent = (function (_super) {
        __extends(FleetControlsComponent, _super);
        function FleetControlsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "FleetControls";
            _this.bindMethods();
            return _this;
        }
        FleetControlsComponent.prototype.bindMethods = function () {
            this.deselectFleet = this.deselectFleet.bind(this);
            this.selectFleet = this.selectFleet.bind(this);
            this.splitFleet = this.splitFleet.bind(this);
        };
        FleetControlsComponent.prototype.deselectFleet = function () {
            eventManager_1.eventManager.dispatchEvent("deselectFleet", this.props.fleet);
        };
        FleetControlsComponent.prototype.selectFleet = function () {
            eventManager_1.eventManager.dispatchEvent("selectFleets", [this.props.fleet]);
        };
        FleetControlsComponent.prototype.splitFleet = function () {
            eventManager_1.eventManager.dispatchEvent("splitFleet", this.props.fleet);
        };
        FleetControlsComponent.prototype.render = function () {
            var fleet = this.props.fleet;
            var splitButtonProps = {
                className: "fleet-controls-split",
            };
            if (fleet.units.length > 1 && !this.props.isInspecting) {
                splitButtonProps.onClick = this.splitFleet;
            }
            else {
                splitButtonProps.className += " disabled";
                splitButtonProps.disabled = true;
            }
            return (ReactDOMElements.div({
                className: "fleet-controls",
            }, ReactDOMElements.button(splitButtonProps, localize_1.localize("split_fleet")()), ReactDOMElements.button({
                className: "fleet-controls-deselect",
                onClick: this.deselectFleet,
            }, localize_1.localize("deselect_fleet")()), !this.props.hasMultipleSelected ? null : ReactDOMElements.button({
                className: "fleet-controls-select",
                onClick: this.selectFleet,
            }, localize_1.localize("select_fleet")())));
        };
        return FleetControlsComponent;
    }(React.Component));
    exports.FleetControlsComponent = FleetControlsComponent;
    exports.FleetControls = React.createFactory(FleetControlsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/FleetInfo", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/galaxymap/FleetControls"], function (require, exports, React, ReactDOMElements, localize_1, FleetControls_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FleetInfoComponent = (function (_super) {
        __extends(FleetInfoComponent, _super);
        function FleetInfoComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "FleetInfo";
            _this.bindMethods();
            return _this;
        }
        FleetInfoComponent.prototype.setFleetName = function (e) {
            var target = e.currentTarget;
            this.props.fleet.name.customizeName(target.value);
            this.forceUpdate();
        };
        FleetInfoComponent.prototype.bindMethods = function () {
            this.setFleetName = this.setFleetName.bind(this);
        };
        FleetInfoComponent.prototype.render = function () {
            var fleet = this.props.fleet;
            var isNotDetected = this.props.isNotDetected;
            if (!fleet) {
                return null;
            }
            var totalCurrentHealth = fleet.getTotalCurrentHealth();
            var totalMaxHealth = fleet.getTotalMaxHealth();
            var healthRatio = totalCurrentHealth / totalMaxHealth;
            var critThreshhold = 0.3;
            var healthStatus = "";
            if (!isNotDetected && healthRatio <= critThreshhold) {
                healthStatus += " critical";
            }
            else if (!isNotDetected && totalCurrentHealth < totalMaxHealth) {
                healthStatus += " wounded";
            }
            return (ReactDOMElements.div({
                className: "fleet-info" + (fleet.isStealthy ? " stealthy" : ""),
            }, ReactDOMElements.div({
                className: "fleet-info-header",
            }, ReactDOMElements.input({
                className: "fleet-info-name",
                value: isNotDetected ? localize_1.localize("unidentifiedFleet")() : fleet.name.fullName,
                title: isNotDetected ? localize_1.localize("unidentifiedFleet")() : fleet.name.fullName,
                onChange: isNotDetected ? null : this.setFleetName,
                readOnly: isNotDetected,
            }), ReactDOMElements.div({
                className: "fleet-info-strength",
            }, ReactDOMElements.span({
                className: "fleet-info-strength-current" + healthStatus,
            }, isNotDetected ? "???" : totalCurrentHealth), ReactDOMElements.span({
                className: "fleet-info-strength-max",
            }, "/" + (isNotDetected ? "???" : totalMaxHealth))), FleetControls_1.FleetControls({
                fleet: fleet,
                hasMultipleSelected: this.props.hasMultipleSelected,
                isInspecting: this.props.isInspecting,
            })), ReactDOMElements.div({
                className: "fleet-info-move-points",
            }, isNotDetected ?
                localize_1.localize("fleet_movesRemaining")("?", "?") :
                localize_1.localize("fleet_movesRemaining")(fleet.getMinCurrentMovePoints(), fleet.getMinMaxMovePoints()))));
        };
        return FleetInfoComponent;
    }(React.Component));
    exports.FleetInfoComponent = FleetInfoComponent;
    exports.FleetInfo = React.createFactory(FleetInfoComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/FleetReorganization", ["require", "exports", "react", "react-dom-factories", "src/eventManager", "modules/defaultui/uicomponents/galaxymap/FleetContents"], function (require, exports, React, ReactDOMElements, eventManager_1, FleetContents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FleetReorganizationComponent = (function (_super) {
        __extends(FleetReorganizationComponent, _super);
        function FleetReorganizationComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "FleetReorganization";
            _this.hasClosed = false;
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        FleetReorganizationComponent.prototype.bindMethods = function () {
            this.handleDrop = this.handleDrop.bind(this);
            this.handleDragEnd = this.handleDragEnd.bind(this);
            this.handleClose = this.handleClose.bind(this);
            this.handleDragStart = this.handleDragStart.bind(this);
        };
        FleetReorganizationComponent.prototype.getInitialStateTODO = function () {
            return ({
                currentDragUnit: null,
            });
        };
        FleetReorganizationComponent.prototype.handleDragStart = function (unit) {
            this.setState({
                currentDragUnit: unit,
            });
        };
        FleetReorganizationComponent.prototype.handleDragEnd = function () {
            this.setState({
                currentDragUnit: null,
            });
        };
        FleetReorganizationComponent.prototype.handleDrop = function (fleet) {
            var draggingUnit = this.state.currentDragUnit;
            if (draggingUnit) {
                var oldFleet = draggingUnit.fleet;
                if (oldFleet !== fleet) {
                    oldFleet.transferUnit(fleet, draggingUnit);
                    eventManager_1.eventManager.dispatchEvent("playerControlUpdated", null);
                }
            }
            this.handleDragEnd();
        };
        FleetReorganizationComponent.prototype.handleClose = function () {
            this.hasClosed = true;
            this.props.closeReorganization();
        };
        FleetReorganizationComponent.prototype.componentWillUnmount = function () {
            if (this.hasClosed) {
                return;
            }
            eventManager_1.eventManager.dispatchEvent("endReorganizingFleets");
        };
        FleetReorganizationComponent.prototype.render = function () {
            var selectedFleets = this.props.fleets;
            if (!selectedFleets || selectedFleets.length < 1) {
                return null;
            }
            return (ReactDOMElements.div({
                className: "fleet-reorganization",
            }, ReactDOMElements.div({
                className: "fleet-reorganization-subheader",
            }, ReactDOMElements.div({
                className: "fleet-reorganization-subheader-fleet-name" +
                    " fleet-reorganization-subheader-fleet-name-left",
            }, selectedFleets[0].name.fullName), ReactDOMElements.div({
                className: "fleet-reorganization-subheader-center",
            }, null), ReactDOMElements.div({
                className: "fleet-reorganization-subheader-fleet-name" +
                    " fleet-reorganization-subheader-fleet-name-right",
            }, selectedFleets[1].name.fullName)), ReactDOMElements.div({
                className: "fleet-reorganization-contents",
            }, FleetContents_1.FleetContents({
                fleet: selectedFleets[0],
                onMouseUp: this.handleDrop,
                onDragStart: this.handleDragStart,
                onDragEnd: this.handleDragEnd,
                player: selectedFleets[0].player,
            }), ReactDOMElements.div({
                className: "fleet-reorganization-contents-divider",
            }, null), FleetContents_1.FleetContents({
                fleet: selectedFleets[1],
                onMouseUp: this.handleDrop,
                onDragStart: this.handleDragStart,
                onDragEnd: this.handleDragEnd,
                player: selectedFleets[0].player,
            }))));
        };
        return FleetReorganizationComponent;
    }(React.Component));
    exports.FleetReorganizationComponent = FleetReorganizationComponent;
    exports.FleetReorganization = React.createFactory(FleetReorganizationComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/FleetSelection", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/eventManager", "modules/defaultui/uicomponents/galaxymap/FleetContents", "modules/defaultui/uicomponents/galaxymap/FleetInfo", "modules/defaultui/uicomponents/galaxymap/FleetReorganization", "modules/defaultui/uicomponents/windows/DefaultWindow"], function (require, exports, React, ReactDOMElements, localize_1, eventManager_1, FleetContents_1, FleetInfo_1, FleetReorganization_1, DefaultWindow_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FleetSelectionComponent = (function (_super) {
        __extends(FleetSelectionComponent, _super);
        function FleetSelectionComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "FleetSelection";
            _this.contentsElement = React.createRef();
            _this.bindMethods();
            _this.state =
                {
                    isCompacted: false,
                    compactionIsOverridden: false,
                };
            return _this;
        }
        FleetSelectionComponent.prototype.bindMethods = function () {
            this.reorganizeFleets = this.reorganizeFleets.bind(this);
            this.mergeFleets = this.mergeFleets.bind(this);
        };
        FleetSelectionComponent.prototype.render = function () {
            var selectedFleets = this.props.selectedFleets;
            if (!selectedFleets || selectedFleets.length <= 0) {
                return null;
            }
            var allFleetsInSameLocation = true;
            var hasMultipleSelected = selectedFleets.length >= 2;
            for (var i = 1; i < selectedFleets.length; i++) {
                if (selectedFleets[i].location !== selectedFleets[i - 1].location) {
                    allFleetsInSameLocation = false;
                    break;
                }
            }
            var fleetInfos = [];
            for (var i = 0; i < selectedFleets.length; i++) {
                var fleet = selectedFleets[i];
                fleetInfos.push(FleetInfo_1.FleetInfo({
                    key: fleet.id,
                    fleet: fleet,
                    hasMultipleSelected: hasMultipleSelected,
                    isInspecting: this.props.isInspecting,
                    isNotDetected: this.props.isInspecting && !this.props.player.fleetIsFullyIdentified(fleet),
                }));
            }
            var fleetSelectionControls = null;
            if (hasMultipleSelected) {
                var fleetStealthsAreClashing = selectedFleets.length === 2 && selectedFleets[0].isStealthy !== selectedFleets[1].isStealthy;
                var mergeProps = {
                    className: "fleet-selection-controls-merge",
                };
                if (allFleetsInSameLocation && !this.props.isInspecting && !fleetStealthsAreClashing) {
                    mergeProps.onClick = this.mergeFleets;
                }
                else {
                    mergeProps.disabled = true;
                    mergeProps.className += " disabled";
                }
                var reorganizeProps = {
                    className: "fleet-selection-controls-reorganize",
                };
                if (allFleetsInSameLocation && selectedFleets.length === 2 && !this.props.isInspecting &&
                    !fleetStealthsAreClashing) {
                    reorganizeProps.onClick = this.reorganizeFleets;
                }
                else {
                    reorganizeProps.disabled = true;
                    reorganizeProps.className += " disabled";
                }
                fleetSelectionControls = ReactDOMElements.div({
                    className: "fleet-selection-controls",
                }, ReactDOMElements.button(reorganizeProps, localize_1.localize("reorganize")()), ReactDOMElements.button(mergeProps, localize_1.localize("merge")()));
            }
            var fleetContents = null;
            if (!hasMultipleSelected) {
                fleetContents = FleetContents_1.FleetContents({
                    fleet: selectedFleets[0],
                    player: this.props.player,
                });
            }
            var isReorganizing = this.props.currentlyReorganizing.length > 0;
            return (ReactDOMElements.div({
                className: "fleet-selection",
            }, fleetSelectionControls, hasMultipleSelected ? null : fleetInfos, ReactDOMElements.div({
                className: "fleet-selection-selected",
                ref: this.contentsElement,
            }, hasMultipleSelected ? fleetInfos : null, fleetContents), !isReorganizing ? null :
                DefaultWindow_1.DefaultWindow({
                    title: localize_1.localize("reorganizeFleets")(),
                    handleClose: this.props.closeReorganization,
                    isResizable: false,
                }, FleetReorganization_1.FleetReorganization({
                    fleets: this.props.currentlyReorganizing,
                    closeReorganization: this.props.closeReorganization,
                }))));
        };
        FleetSelectionComponent.prototype.mergeFleets = function () {
            eventManager_1.eventManager.dispatchEvent("endReorganizingFleets");
            eventManager_1.eventManager.dispatchEvent("mergeFleets", null);
        };
        FleetSelectionComponent.prototype.reorganizeFleets = function () {
            eventManager_1.eventManager.dispatchEvent("startReorganizingFleets", this.props.selectedFleets);
        };
        return FleetSelectionComponent;
    }(React.Component));
    exports.FleetSelectionComponent = FleetSelectionComponent;
    exports.FleetSelection = React.createFactory(FleetSelectionComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/FleetUnitInfo", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/mixins/DragPositioner", "modules/defaultui/uicomponents/mixins/applyMixins", "modules/defaultui/uicomponents/unit/UnitStrength", "modules/defaultui/uicomponents/galaxymap/FleetUnitInfoName"], function (require, exports, React, ReactDOMElements, DragPositioner_1, applyMixins_1, UnitStrength_1, FleetUnitInfoName_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FleetUnitInfoComponent = (function (_super) {
        __extends(FleetUnitInfoComponent, _super);
        function FleetUnitInfoComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "FleetUnitInfo";
            _this.ownDOMNode = React.createRef();
            _this.bindMethods();
            if (_this.props.isDraggable) {
                _this.dragPositioner = new DragPositioner_1.DragPositioner(_this, _this.ownDOMNode);
                _this.dragPositioner.onDragStart = _this.onDragStart;
                _this.dragPositioner.onDragEnd = _this.onDragEnd;
                applyMixins_1.applyMixins(_this, _this.dragPositioner);
            }
            return _this;
        }
        FleetUnitInfoComponent.prototype.bindMethods = function () {
            this.onDragEnd = this.onDragEnd.bind(this);
            this.onDragStart = this.onDragStart.bind(this);
        };
        FleetUnitInfoComponent.prototype.onDragStart = function () {
            this.props.onDragStart(this.props.unit);
        };
        FleetUnitInfoComponent.prototype.onDragEnd = function () {
            this.props.onDragEnd();
        };
        FleetUnitInfoComponent.prototype.render = function () {
            var unit = this.props.unit;
            var isNotDetected = !this.props.isIdentified;
            var divProps = {
                className: "fleet-unit-info",
                ref: this.ownDOMNode,
            };
            if (this.props.isDraggable) {
                divProps.className += " draggable";
                divProps.onTouchStart = divProps.onMouseDown =
                    this.dragPositioner.handleReactDownEvent;
                if (this.dragPositioner.isDragging) {
                    divProps.style = this.dragPositioner.getStyleAttributes();
                    divProps.className += " dragging";
                }
            }
            return (ReactDOMElements.div(divProps, ReactDOMElements.div({
                className: "fleet-unit-info-icon-container",
            }, ReactDOMElements.img({
                className: "fleet-unit-info-icon",
                src: isNotDetected ? "img/icons/unDetected.png" : unit.template.getIconSrc(),
            })), ReactDOMElements.div({
                className: "fleet-unit-info-info",
            }, FleetUnitInfoName_1.FleetUnitInfoName({
                unit: unit,
                isNotDetected: isNotDetected,
            }), ReactDOMElements.div({
                className: "fleet-unit-info-type",
            }, isNotDetected ? "???" : unit.template.displayName)), UnitStrength_1.UnitStrength({
                maxHealth: unit.maxHealth,
                currentHealth: unit.currentHealth,
                isSquadron: true,
                isNotDetected: isNotDetected,
            })));
        };
        return FleetUnitInfoComponent;
    }(React.Component));
    exports.FleetUnitInfoComponent = FleetUnitInfoComponent;
    exports.FleetUnitInfo = React.createFactory(FleetUnitInfoComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/FleetUnitInfoName", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FleetUnitInfoNameComponent = (function (_super) {
        __extends(FleetUnitInfoNameComponent, _super);
        function FleetUnitInfoNameComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "FleetUnitInfoName";
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        FleetUnitInfoNameComponent.prototype.bindMethods = function () {
            this.onChange = this.onChange.bind(this);
        };
        FleetUnitInfoNameComponent.prototype.getInitialStateTODO = function () {
            return ({
                inputElementValue: this.props.unit.name,
            });
        };
        FleetUnitInfoNameComponent.prototype.onChange = function (e) {
            var target = e.currentTarget;
            this.setState({ inputElementValue: target.value });
            this.props.unit.name = target.value;
        };
        FleetUnitInfoNameComponent.prototype.render = function () {
            return (ReactDOMElements.input({
                className: "fleet-unit-info-name",
                value: this.props.isNotDetected ? localize_1.localize("unidentifiedShip")() : this.state.inputElementValue,
                onChange: this.props.isNotDetected ? null : this.onChange,
                readOnly: this.props.isNotDetected,
            }));
        };
        return FleetUnitInfoNameComponent;
    }(React.Component));
    exports.FleetUnitInfoNameComponent = FleetUnitInfoNameComponent;
    exports.FleetUnitInfoName = React.createFactory(FleetUnitInfoNameComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/GalaxyMap", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/galaxymap/GalaxyMapUI", "modules/defaultui/uicomponents/galaxymap/GameOverScreen"], function (require, exports, React, ReactDOMElements, GalaxyMapUI_1, GameOverScreen_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GalaxyMapComponent = (function (_super) {
        __extends(GalaxyMapComponent, _super);
        function GalaxyMapComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "GalaxyMap";
            _this.pixiContainer = React.createRef();
            return _this;
        }
        GalaxyMapComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "galaxy-map",
            }, ReactDOMElements.div({
                id: "pixi-container",
                ref: this.pixiContainer,
            }, this.props.game.hasEnded ?
                GameOverScreen_1.GameOverScreen() :
                GalaxyMapUI_1.GalaxyMapUI({
                    key: "galaxyMapUI",
                    playerControl: this.props.playerControl,
                    player: this.props.player,
                    game: this.props.game,
                    mapRenderer: this.props.mapRenderer,
                    activeLanguage: this.props.activeLanguage,
                    notifications: this.props.notifications,
                    notificationLog: this.props.notificationLog,
                }))));
        };
        GalaxyMapComponent.prototype.componentDidMount = function () {
            this.props.renderer.bindRendererView(this.pixiContainer.current);
            this.props.mapRenderer.setMapModeByKey("defaultMapMode");
            this.props.renderer.camera.getBoundsObjectBoundsFN = this.props.mapRenderer.getMapBoundsForCamera.bind(this.props.mapRenderer);
            this.props.renderer.resume();
            this.props.mapRenderer.setAllLayersAsDirty();
        };
        GalaxyMapComponent.prototype.componentWillUnmount = function () {
            this.props.renderer.pause();
            this.props.renderer.removeRendererView();
        };
        return GalaxyMapComponent;
    }(React.Component));
    exports.GalaxyMapComponent = GalaxyMapComponent;
    exports.GalaxyMap = React.createFactory(GalaxyMapComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/GalaxyMapUI", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/activePlayer", "src/eventManager", "modules/defaultui/uicomponents/mapmodes/MapModeSettings", "modules/defaultui/uicomponents/notifications/NotificationLog", "modules/defaultui/uicomponents/tutorials/IntroTutorial", "modules/defaultui/uicomponents/galaxymap/GalaxyMapUILeft", "modules/defaultui/uicomponents/galaxymap/TopBar", "modules/defaultui/uicomponents/galaxymap/TopMenu"], function (require, exports, React, ReactDOMElements, localize_1, activePlayer_1, eventManager_1, MapModeSettings_1, NotificationLog_1, IntroTutorial_1, GalaxyMapUILeft_1, TopBar_1, TopMenu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GalaxyMapUIComponent = (function (_super) {
        __extends(GalaxyMapUIComponent, _super);
        function GalaxyMapUIComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "GalaxyMapUI";
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        GalaxyMapUIComponent.prototype.bindMethods = function () {
            this.closeReorganization = this.closeReorganization.bind(this);
            this.endTurn = this.endTurn.bind(this);
            this.toggleMapModeSettingsExpanded = this.toggleMapModeSettingsExpanded.bind(this);
            this.updateSelection = this.updateSelection.bind(this);
            this.setPlayerTurn = this.setPlayerTurn.bind(this);
            this.setSelectedStar = this.setSelectedStar.bind(this);
        };
        GalaxyMapUIComponent.prototype.getInitialStateTODO = function () {
            var pc = this.props.playerControl;
            return ({
                selectedFleets: pc.selectedFleets,
                inspectedFleets: pc.inspectedFleets,
                currentlyReorganizing: pc.currentlyReorganizing,
                selectedStar: pc.selectedStar,
                attackTargets: pc.currentAttackTargets,
                isPlayerTurn: this.props.game.playerToAct === activePlayer_1.activePlayer,
                hasMapModeSettingsExpanded: false,
            });
        };
        GalaxyMapUIComponent.prototype.componentDidMount = function () {
            eventManager_1.eventManager.addEventListener("playerControlUpdated", this.updateSelection);
            eventManager_1.eventManager.addEventListener("endTurn", this.setPlayerTurn);
        };
        GalaxyMapUIComponent.prototype.componentWillUnmount = function () {
            eventManager_1.eventManager.removeEventListener("playerControlUpdated", this.updateSelection);
            eventManager_1.eventManager.removeEventListener("endTurn", this.setPlayerTurn);
        };
        GalaxyMapUIComponent.prototype.endTurn = function () {
            this.props.game.endTurn();
        };
        GalaxyMapUIComponent.prototype.setPlayerTurn = function () {
            this.setState({
                isPlayerTurn: !this.props.game.playerToAct.isAi,
            });
        };
        GalaxyMapUIComponent.prototype.toggleMapModeSettingsExpanded = function () {
            this.setState({ hasMapModeSettingsExpanded: !this.state.hasMapModeSettingsExpanded });
        };
        GalaxyMapUIComponent.prototype.updateSelection = function () {
            var pc = this.props.playerControl;
            var star = null;
            if (pc.selectedStar) {
                star = pc.selectedStar;
            }
            else if (pc.areAllFleetsInSameLocation()) {
                star = pc.selectedFleets[0].location;
            }
            this.setState({
                selectedFleets: pc.selectedFleets,
                inspectedFleets: pc.inspectedFleets,
                currentlyReorganizing: pc.currentlyReorganizing,
                selectedStar: star,
                attackTargets: pc.currentAttackTargets,
            });
        };
        GalaxyMapUIComponent.prototype.closeReorganization = function () {
            eventManager_1.eventManager.dispatchEvent("endReorganizingFleets");
            this.updateSelection();
        };
        GalaxyMapUIComponent.prototype.render = function () {
            var endTurnButtonProps = {
                className: "end-turn-button",
                onClick: this.endTurn,
                tabIndex: -1,
            };
            if (!this.state.isPlayerTurn) {
                endTurnButtonProps.className += " disabled";
                endTurnButtonProps.disabled = true;
            }
            var isInspecting = this.state.inspectedFleets.length > 0;
            return (ReactDOMElements.div({
                className: "galaxy-map-ui hide-when-user-interacts-with-map",
            }, IntroTutorial_1.IntroTutorial(), ReactDOMElements.div({
                className: "galaxy-map-ui-top",
            }, TopBar_1.TopBar({
                player: this.props.player,
                game: this.props.game,
            }), TopMenu_1.TopMenu({
                player: this.props.player,
                game: this.props.game,
                activeLanguage: this.props.activeLanguage,
                selectedStar: this.state.selectedStar,
                setSelectedStar: this.setSelectedStar,
            })), GalaxyMapUILeft_1.GalaxyMapUILeft({
                isInspecting: isInspecting,
                selectedFleets: (isInspecting ?
                    this.state.inspectedFleets :
                    this.state.selectedFleets),
                selectedStar: this.state.selectedStar,
                currentlyReorganizing: this.state.currentlyReorganizing,
                closeReorganization: this.closeReorganization,
                player: this.props.player,
                attackTargets: this.state.attackTargets,
            }), ReactDOMElements.div({
                className: "galaxy-map-ui-bottom-right",
                key: "bottomRight",
            }, !this.state.hasMapModeSettingsExpanded ? null : MapModeSettings_1.MapModeSettings({
                mapRenderer: this.props.mapRenderer,
                key: "mapRendererLayersList",
            }), ReactDOMElements.button({
                className: "toggle-map-mode-settings-button",
                tabIndex: -1,
                onClick: this.toggleMapModeSettingsExpanded,
            }, localize_1.localize("mapMode")()), NotificationLog_1.NotificationLog({
                key: "notifications",
                currentTurn: this.props.game.turnNumber,
                notifications: this.props.notifications,
                notificationLog: this.props.notificationLog,
            }), ReactDOMElements.button(endTurnButtonProps, localize_1.localize("endTurn")()))));
        };
        GalaxyMapUIComponent.prototype.setSelectedStar = function (star) {
            this.props.playerControl.selectStar(star);
        };
        return GalaxyMapUIComponent;
    }(React.Component));
    exports.GalaxyMapUIComponent = GalaxyMapUIComponent;
    exports.GalaxyMapUI = React.createFactory(GalaxyMapUIComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/GalaxyMapUILeft", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/galaxymap/FleetSelection", "modules/defaultui/uicomponents/galaxymap/StarInfo", "modules/defaultui/uicomponents/possibleactions/PossibleActions", "modules/defaultui/uicomponents/possibleactions/ExpandedAction", "src/eventManager"], function (require, exports, React, ReactDOMElements, FleetSelection_1, StarInfo_1, PossibleActions_1, ExpandedAction_1, eventManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GalaxyMapUILeftComponent = (function (_super) {
        __extends(GalaxyMapUILeftComponent, _super);
        function GalaxyMapUILeftComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "GalaxyMapUILeft";
            _this.fleetSelectionComponent = React.createRef();
            _this.state =
                {
                    topAndBottomShouldOverlap: false,
                    expandedAction: ExpandedAction_1.ExpandedActionKind.None,
                };
            _this.handleExpandedActionToggle = _this.handleExpandedActionToggle.bind(_this);
            _this.clearExpandedAction = _this.clearExpandedAction.bind(_this);
            _this.handlePlayerBuiltBuilding = _this.handlePlayerBuiltBuilding.bind(_this);
            return _this;
        }
        GalaxyMapUILeftComponent.prototype.componentDidMount = function () {
            eventManager_1.eventManager.addEventListener("humanPlayerBuiltBuilding", this.handlePlayerBuiltBuilding);
        };
        GalaxyMapUILeftComponent.prototype.componentWillUnmount = function () {
            eventManager_1.eventManager.removeEventListener("humanPlayerBuiltBuilding", this.handlePlayerBuiltBuilding);
        };
        GalaxyMapUILeftComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "galaxy-map-ui-left" +
                    (this.state.topAndBottomShouldOverlap ? " no-docking" : ""),
            }, ReactDOMElements.div({
                className: "galaxy-map-ui-top-left" +
                    (this.state.topAndBottomShouldOverlap ? " no-docking" : ""),
                onClick: function () {
                    var isCollapsed = _this.topElementIsCollapsed();
                    if (isCollapsed) {
                        console.log("force overlap");
                        _this.setState({ topAndBottomShouldOverlap: true });
                    }
                },
            }, FleetSelection_1.FleetSelection({
                selectedFleets: this.props.selectedFleets,
                isInspecting: this.props.isInspecting,
                selectedStar: this.props.selectedStar,
                currentlyReorganizing: this.props.currentlyReorganizing,
                closeReorganization: this.props.closeReorganization,
                player: this.props.player,
                ref: this.fleetSelectionComponent,
            })), ReactDOMElements.div({
                className: "galaxy-map-ui-bottom-left" +
                    (this.state.topAndBottomShouldOverlap ? " no-docking" : ""),
                onClick: function () {
                },
            }, ReactDOMElements.div({
                className: "galaxy-map-ui-bottom-left-column align-bottom",
                onClick: function () {
                    _this.setState({ topAndBottomShouldOverlap: false });
                }
            }, PossibleActions_1.PossibleActions({
                player: this.props.player,
                selectedStar: this.props.selectedStar,
                attackTargets: this.props.attackTargets,
                handleExpandActionToggle: this.handleExpandedActionToggle,
            }), StarInfo_1.StarInfo({
                selectedStar: this.props.selectedStar,
            })), ExpandedAction_1.ExpandedAction({
                action: this.state.expandedAction,
                player: this.props.player,
                selectedStar: this.props.selectedStar,
                buildableBuildings: this.getBuildableBuildings(),
                buildingUpgrades: this.getBuildingUpgrades(),
            }))));
        };
        GalaxyMapUILeftComponent.prototype.handleExpandedActionToggle = function (action) {
            if (this.state.expandedAction === action) {
                this.clearExpandedAction();
            }
            else {
                this.setState({ expandedAction: action });
            }
        };
        GalaxyMapUILeftComponent.prototype.clearExpandedAction = function () {
            this.setState({ expandedAction: ExpandedAction_1.ExpandedActionKind.None });
        };
        GalaxyMapUILeftComponent.prototype.topElementIsCollapsed = function () {
            if (!this.fleetSelectionComponent) {
                return false;
            }
            var contentsElement = this.fleetSelectionComponent.current.contentsElement.current;
            return contentsElement.scrollHeight !== contentsElement.offsetHeight;
        };
        GalaxyMapUILeftComponent.prototype.handlePlayerBuiltBuilding = function () {
            this.forceUpdate();
        };
        GalaxyMapUILeftComponent.prototype.getBuildableBuildings = function () {
            return this.props.selectedStar && this.props.selectedStar.owner === this.props.player ?
                this.props.selectedStar.getBuildableBuildings() :
                [];
        };
        GalaxyMapUILeftComponent.prototype.getBuildingUpgrades = function () {
            return this.props.selectedStar && this.props.selectedStar.owner === this.props.player ?
                this.props.selectedStar.getBuildingUpgrades() :
                {};
        };
        return GalaxyMapUILeftComponent;
    }(React.Component));
    exports.GalaxyMapUILeftComponent = GalaxyMapUILeftComponent;
    exports.GalaxyMapUILeft = React.createFactory(GalaxyMapUILeftComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/GameOverScreen", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/windows/DefaultWindow", "modules/defaultui/uicomponents/windows/DialogBox", "modules/defaultui/uicomponents/saves/LoadGame", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, DefaultWindow_1, DialogBox_1, LoadGame_1, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameOverScreenComponent = (function (_super) {
        __extends(GameOverScreenComponent, _super);
        function GameOverScreenComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "GameOverScreen";
            _this.state =
                {
                    hasLoadPopup: false,
                    hasConfirmNewGamePopup: false,
                };
            _this.toggleLoadPopup = _this.toggleLoadPopup.bind(_this);
            _this.closeLoadPopup = _this.closeLoadPopup.bind(_this);
            _this.toggleNewGamePopup = _this.toggleNewGamePopup.bind(_this);
            _this.closeNewGamePopup = _this.closeNewGamePopup.bind(_this);
            return _this;
        }
        GameOverScreenComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "game-over-screen",
            }, ReactDOMElements.div({
                className: "game-over-screen-inner",
            }, ReactDOMElements.h1({
                className: "game-over-header",
            }, localize_1.localize("gameOver")()), ReactDOMElements.div({
                className: "game-over-buttons",
            }, ReactDOMElements.button({
                className: "game-over-buttons-button",
                onClick: this.toggleLoadPopup,
            }, localize_1.localize("load_action")()), ReactDOMElements.button({
                className: "game-over-buttons-button",
                onClick: this.toggleNewGamePopup,
            }, localize_1.localize("newGame")()))), !this.state.hasConfirmNewGamePopup ? null :
                DialogBox_1.DialogBox({
                    title: localize_1.localize("newGame")(),
                    handleOk: function () {
                        window.location.reload(false);
                    },
                    handleCancel: this.closeNewGamePopup,
                }, localize_1.localize("areYouSureYouWantToStartANewGame")()), !this.state.hasLoadPopup ? null :
                DefaultWindow_1.DefaultWindow({
                    title: localize_1.localize("loadGame")(),
                    handleClose: this.closeLoadPopup,
                }, LoadGame_1.LoadGame({
                    handleClose: this.closeLoadPopup,
                }))));
        };
        GameOverScreenComponent.prototype.closeLoadPopup = function () {
            this.setState({ hasLoadPopup: false });
        };
        GameOverScreenComponent.prototype.closeNewGamePopup = function () {
            this.setState({ hasConfirmNewGamePopup: false });
        };
        GameOverScreenComponent.prototype.toggleLoadPopup = function () {
            if (this.state.hasLoadPopup) {
                this.closeLoadPopup();
            }
            else {
                this.setState({ hasLoadPopup: true });
            }
        };
        GameOverScreenComponent.prototype.toggleNewGamePopup = function () {
            if (this.state.hasConfirmNewGamePopup) {
                this.closeNewGamePopup();
            }
            else {
                this.setState({ hasConfirmNewGamePopup: true });
            }
        };
        return GameOverScreenComponent;
    }(React.Component));
    exports.GameOverScreenComponent = GameOverScreenComponent;
    exports.GameOverScreen = React.createFactory(GameOverScreenComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/PlayerMoney", ["require", "exports", "react", "react-dom-factories", "src/eventManager", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, eventManager_1, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlayerMoneyComponent = (function (_super) {
        __extends(PlayerMoneyComponent, _super);
        function PlayerMoneyComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "PlayerMoney";
            _this.lastAmountRendered = undefined;
            _this.bindMethods();
            return _this;
        }
        PlayerMoneyComponent.prototype.bindMethods = function () {
            this.handlePlayerMoneyUpdated = this.handlePlayerMoneyUpdated.bind(this);
        };
        PlayerMoneyComponent.prototype.componentDidMount = function () {
            eventManager_1.eventManager.addEventListener("playerMoneyUpdated", this.handlePlayerMoneyUpdated);
        };
        PlayerMoneyComponent.prototype.componentWillUnmount = function () {
            eventManager_1.eventManager.removeEventListener("playerMoneyUpdated", this.handlePlayerMoneyUpdated);
        };
        PlayerMoneyComponent.prototype.handlePlayerMoneyUpdated = function () {
            if (this.props.player.money !== this.lastAmountRendered) {
                this.forceUpdate();
            }
        };
        PlayerMoneyComponent.prototype.render = function () {
            this.lastAmountRendered = this.props.player.money;
            return (ReactDOMElements.div({
                className: "player-money",
            }, localize_1.localize("money")() + " " + this.props.player.money));
        };
        return PlayerMoneyComponent;
    }(React.Component));
    exports.PlayerMoneyComponent = PlayerMoneyComponent;
    exports.PlayerMoney = React.createFactory(PlayerMoneyComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/Resource", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ResourceComponent = (function (_super) {
        __extends(ResourceComponent, _super);
        function ResourceComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "Resource";
            return _this;
        }
        ResourceComponent.prototype.render = function () {
            var sign = this.props.income < 0 ? "" : "+";
            return (ReactDOMElements.div({
                className: "resource",
                title: this.props.resource.displayName + "",
            }, ReactDOMElements.img({
                className: "resource-icon",
                src: this.props.resource.getIconSrc(),
            }, null), ReactDOMElements.div({
                className: "resource-amount",
            }, "" + this.props.amount), ReactDOMElements.div({
                className: "resource-income",
            }, "(" + sign + this.props.income + ")")));
        };
        return ResourceComponent;
    }(React.Component));
    exports.ResourceComponent = ResourceComponent;
    exports.Resource = React.createFactory(ResourceComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/StarInfo", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/galaxymap/TerritoryBuildingList", "src/eventManager"], function (require, exports, React, ReactDOMElements, localize_1, TerritoryBuildingList_1, eventManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StarInfoComponent = (function (_super) {
        __extends(StarInfoComponent, _super);
        function StarInfoComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "StarInfo";
            _this.handlePlayerBuiltBuilding = _this.handlePlayerBuiltBuilding.bind(_this);
            return _this;
        }
        StarInfoComponent.prototype.shouldComponentUpdate = function (newProps) {
            return this.props.selectedStar !== newProps.selectedStar;
        };
        StarInfoComponent.prototype.componentDidMount = function () {
            eventManager_1.eventManager.addEventListener("humanPlayerBuiltBuilding", this.handlePlayerBuiltBuilding);
        };
        StarInfoComponent.prototype.componentWillUnmount = function () {
            eventManager_1.eventManager.removeEventListener("humanPlayerBuiltBuilding", this.handlePlayerBuiltBuilding);
        };
        StarInfoComponent.prototype.render = function () {
            var star = this.props.selectedStar;
            if (!star) {
                return null;
            }
            return (ReactDOMElements.div({
                className: "star-info",
            }, ReactDOMElements.div({
                className: "star-info-name",
            }, star.name), ReactDOMElements.div({
                className: "star-info-owner",
            }, star.owner ? star.owner.name.fullName : null), ReactDOMElements.div({
                className: "star-info-location",
            }, "x: " + star.x.toFixed() + " y: " + star.y.toFixed()), ReactDOMElements.div({
                className: "star-info-terrain",
            }, "Terrain: " + star.terrain.displayName), ReactDOMElements.div({
                className: "star-info-income",
            }, localize_1.localize("income")() + ": " + star.getIncome()), TerritoryBuildingList_1.TerritoryBuildingList({
                buildings: star.territoryBuildings,
            })));
        };
        StarInfoComponent.prototype.handlePlayerBuiltBuilding = function () {
            this.forceUpdate();
        };
        return StarInfoComponent;
    }(React.Component));
    exports.StarInfoComponent = StarInfoComponent;
    exports.StarInfo = React.createFactory(StarInfoComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/TerritoryBuilding", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/PlayerFlag"], function (require, exports, React, ReactDOMElements, PlayerFlag_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TerritoryBuildingComponent = (function (_super) {
        __extends(TerritoryBuildingComponent, _super);
        function TerritoryBuildingComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TerritoryBuilding";
            _this.iconContainer = React.createRef();
            return _this;
        }
        TerritoryBuildingComponent.prototype.componentDidMount = function () {
            this.setIconContent();
        };
        TerritoryBuildingComponent.prototype.componentDidUpdate = function () {
            this.setIconContent();
        };
        TerritoryBuildingComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "territory-building",
            }, ReactDOMElements.div({
                className: "territory-building-icon",
                ref: this.iconContainer,
                title: this.props.building.template.displayName,
            }), PlayerFlag_1.PlayerFlag({
                props: {
                    className: "territory-building-controller",
                    title: this.props.building.controller.name.fullName,
                },
                key: "flag",
                flag: this.props.building.controller.flag,
            })));
        };
        TerritoryBuildingComponent.prototype.setIconContent = function () {
            var container = this.iconContainer.current;
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            container.appendChild(this.props.building.template.getIconElement(this.props.building.controller.color));
        };
        return TerritoryBuildingComponent;
    }(React.PureComponent));
    exports.TerritoryBuildingComponent = TerritoryBuildingComponent;
    exports.TerritoryBuilding = React.createFactory(TerritoryBuildingComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/TerritoryBuildingList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/galaxymap/TerritoryBuilding"], function (require, exports, React, ReactDOMElements, TerritoryBuilding_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TerritoryBuildingListComponent = (function (_super) {
        __extends(TerritoryBuildingListComponent, _super);
        function TerritoryBuildingListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TerritoryBuildingList";
            return _this;
        }
        TerritoryBuildingListComponent.prototype.shouldComponentUpdate = function (newProps) {
            var newBuildings = newProps.buildings;
            var oldBuildings = this.props.buildings;
            if (newBuildings.length !== oldBuildings.length) {
                return true;
            }
            else {
                for (var i = 0; i < newBuildings.length; i++) {
                    if (oldBuildings.indexOf(newBuildings[i]) === -1) {
                        return true;
                    }
                }
            }
            return false;
        };
        TerritoryBuildingListComponent.prototype.render = function () {
            if (!this.props.buildings) {
                return null;
            }
            var buildings = this.props.buildings.map(function (building) {
                return TerritoryBuilding_1.TerritoryBuilding({
                    key: building.id,
                    building: building,
                });
            });
            if (this.props.reverse) {
                buildings.reverse();
            }
            return (ReactDOMElements.div({
                className: "territory-building-list",
            }, buildings));
        };
        return TerritoryBuildingListComponent;
    }(React.Component));
    exports.TerritoryBuildingListComponent = TerritoryBuildingListComponent;
    exports.TerritoryBuildingList = React.createFactory(TerritoryBuildingListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/TopBar", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/eventManager", "modules/defaultui/uicomponents/PlayerFlag", "modules/defaultui/uicomponents/galaxymap/PlayerMoney", "modules/defaultui/uicomponents/galaxymap/TopBarResources"], function (require, exports, React, ReactDOMElements, localize_1, eventManager_1, PlayerFlag_1, PlayerMoney_1, TopBarResources_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TopBarComponent = (function (_super) {
        __extends(TopBarComponent, _super);
        function TopBarComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TopBar";
            return _this;
        }
        TopBarComponent.prototype.componentDidMount = function () {
            this.updateListener = eventManager_1.eventManager.addEventListener("builtBuildingWithEffect_income", this.forceUpdate.bind(this));
        };
        TopBarComponent.prototype.componentWillUnmount = function () {
            eventManager_1.eventManager.removeEventListener("builtBuildingWithEffect_income", this.updateListener);
        };
        TopBarComponent.prototype.render = function () {
            var player = this.props.player;
            var income = player.getIncome();
            var incomeClass = "top-bar-money-income";
            if (income < 0) {
                incomeClass += " negative";
            }
            var incomeSign = income < 0 ? "" : "+";
            return (ReactDOMElements.div({
                className: "top-bar",
            }, ReactDOMElements.div({
                className: "top-bar-info",
            }, ReactDOMElements.div({
                className: "top-bar-player",
            }, PlayerFlag_1.PlayerFlag({
                props: {
                    className: "top-bar-player-icon",
                },
                flag: player.flag,
            }), ReactDOMElements.div({
                className: "top-bar-turn-number",
            }, localize_1.localize("turnCounter")() + " " + this.props.game.turnNumber)), ReactDOMElements.div({
                className: "top-bar-money",
            }, PlayerMoney_1.PlayerMoney({
                player: player,
            }), ReactDOMElements.div({
                className: incomeClass,
            }, "(" + incomeSign + player.getIncome() + ")")), TopBarResources_1.TopBarResources({
                player: player,
            }))));
        };
        return TopBarComponent;
    }(React.Component));
    exports.TopBarComponent = TopBarComponent;
    exports.TopBar = React.createFactory(TopBarComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/TopBarResources", ["require", "exports", "react", "react-dom-factories", "src/activeModuleData", "src/eventManager", "modules/defaultui/uicomponents/galaxymap/Resource"], function (require, exports, React, ReactDOMElements, activeModuleData_1, eventManager_1, Resource_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TopBarResourcesComponent = (function (_super) {
        __extends(TopBarResourcesComponent, _super);
        function TopBarResourcesComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TopBarResources";
            return _this;
        }
        TopBarResourcesComponent.prototype.componentDidMount = function () {
            this.updateListener = eventManager_1.eventManager.addEventListener("builtBuildingWithEffect_resourceIncome", this.forceUpdate.bind(this));
        };
        TopBarResourcesComponent.prototype.componentWillUnmount = function () {
            eventManager_1.eventManager.removeEventListener("builtBuildingWithEffect_resourceIncome", this.updateListener);
        };
        TopBarResourcesComponent.prototype.render = function () {
            var player = this.props.player;
            var resourceElements = [];
            var resourceIncome = player.getResourceIncome();
            var resourceTypes = Object.keys(player.resources);
            for (var resourceType in resourceIncome) {
                if (resourceTypes.indexOf(resourceType) === -1) {
                    resourceTypes.push(resourceType);
                }
            }
            for (var i = 0; i < resourceTypes.length; i++) {
                var resourceType = resourceTypes[i];
                var amount = player.resources[resourceType] || 0;
                var income = resourceIncome[resourceType].amount || 0;
                if (amount === 0 && income === 0) {
                    continue;
                }
                var resourceData = {
                    resource: activeModuleData_1.activeModuleData.templates.Resources[resourceType],
                    amount: amount,
                    income: income,
                    key: resourceType,
                };
                resourceElements.push(Resource_1.Resource(resourceData));
            }
            return (ReactDOMElements.div({
                className: "top-bar-resources",
            }, resourceElements));
        };
        return TopBarResourcesComponent;
    }(React.Component));
    exports.TopBarResourcesComponent = TopBarResourcesComponent;
    exports.TopBarResources = React.createFactory(TopBarResourcesComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/TopMenu", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/Options", "src/eventManager", "modules/defaultui/uicomponents/galaxymap/TopMenuPopups"], function (require, exports, React, ReactDOMElements, localize_1, Options_1, eventManager_1, TopMenuPopups_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TopMenuComponent = (function (_super) {
        __extends(TopMenuComponent, _super);
        function TopMenuComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TopMenu";
            _this.cachedTopMenuWidth = undefined;
            _this.cachedButtonWidths = [];
            _this.cachedMenuButtonWidth = 37;
            _this.topMenuElement = React.createRef();
            _this.popupsComponent = React.createRef();
            _this.topMenuItemsElement = React.createRef();
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        TopMenuComponent.prototype.componentDidMount = function () {
            window.addEventListener("resize", this.handleResize, false);
            eventManager_1.eventManager.addEventListener("playerControlUpdated", this.delayedResize);
            eventManager_1.eventManager.addEventListener("updateHamburgerMenu", this.handleToggleHamburger);
            this.handleResize();
        };
        TopMenuComponent.prototype.componentWillUnmount = function () {
            window.removeEventListener("resize", this.handleResize);
            eventManager_1.eventManager.removeEventListener("playerControlUpdated", this.delayedResize);
            eventManager_1.eventManager.removeEventListener("updateHamburgerMenu", this.handleToggleHamburger);
        };
        TopMenuComponent.prototype.render = function () {
            var _this = this;
            var menuItemTabIndex = this.state.opened ? -1 : 0;
            var menuItemTitle = "Left click to open. Right click to close";
            var topMenuButtons = [
                ReactDOMElements.button({
                    className: "top-menu-items-button top-menu-items-button-production",
                    key: "production",
                    title: menuItemTitle,
                    onClick: this.toggleOrBringPopupToTop.bind(this, "production"),
                    onContextMenu: this.closePopup.bind(this, "production"),
                    tabIndex: menuItemTabIndex,
                }, localize_1.localize("production")()),
                ReactDOMElements.button({
                    className: "top-menu-items-button top-menu-items-button-equip",
                    key: "equipItems",
                    title: menuItemTitle,
                    onClick: this.toggleOrBringPopupToTop.bind(this, "equipItems"),
                    onContextMenu: this.closePopup.bind(this, "equipItems"),
                    tabIndex: menuItemTabIndex,
                }, localize_1.localize("equip")()),
                ReactDOMElements.button({
                    className: "top-menu-items-button top-menu-items-button-diplomacy",
                    key: "diplomacy",
                    title: menuItemTitle,
                    onClick: this.toggleOrBringPopupToTop.bind(this, "diplomacy"),
                    onContextMenu: this.closePopup.bind(this, "diplomacy"),
                    tabIndex: menuItemTabIndex,
                }, localize_1.localize("diplomacy")()),
                ReactDOMElements.button({
                    className: "top-menu-items-button top-menu-items-button-technology",
                    key: "technologies",
                    title: menuItemTitle,
                    onClick: this.toggleOrBringPopupToTop.bind(this, "technologies"),
                    onContextMenu: this.closePopup.bind(this, "technologies"),
                    tabIndex: menuItemTabIndex,
                }, localize_1.localize("technology")()),
                ReactDOMElements.button({
                    className: "top-menu-items-button top-menu-items-button-load",
                    key: "loadGame",
                    title: menuItemTitle,
                    onClick: this.toggleOrBringPopupToTop.bind(this, "loadGame"),
                    onContextMenu: this.closePopup.bind(this, "loadGame"),
                    tabIndex: menuItemTabIndex,
                }, localize_1.localize("load_action")()),
                ReactDOMElements.button({
                    className: "top-menu-items-button top-menu-items-button-save",
                    key: "saveGame",
                    title: menuItemTitle,
                    onClick: this.toggleOrBringPopupToTop.bind(this, "saveGame"),
                    onContextMenu: this.closePopup.bind(this, "saveGame"),
                    tabIndex: menuItemTabIndex,
                }, localize_1.localize("save_action")()),
                ReactDOMElements.button({
                    className: "top-menu-items-button top-menu-items-button-options",
                    key: "options",
                    title: menuItemTitle,
                    onClick: this.toggleOrBringPopupToTop.bind(this, "options"),
                    onContextMenu: this.closePopup.bind(this, "options"),
                    tabIndex: menuItemTabIndex,
                }, localize_1.localize("options")()),
            ];
            var topMenuItems = topMenuButtons.slice(0, this.state.buttonsToPlace);
            var leftoverButtons = topMenuButtons.slice(this.state.buttonsToPlace);
            if (this.state.hasCondensedMenu && !Options_1.options.display.noHamburger) {
                topMenuItems.push(ReactDOMElements.button({
                    className: "top-menu-items-button top-menu-open-condensed-button",
                    key: "openCondensedMenu",
                    title: menuItemTitle,
                    onClick: this.toggleCondensedMenu,
                    onContextMenu: function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (_this.state.condensedMenuOpened) {
                            _this.toggleCondensedMenu();
                        }
                    },
                    tabIndex: menuItemTabIndex,
                }));
            }
            var openedCondensedMenu = null;
            if ((this.state.condensedMenuOpened || Options_1.options.display.noHamburger) && leftoverButtons.length > 0) {
                openedCondensedMenu = ReactDOMElements.div({
                    className: "top-menu-opened-condensed-menu",
                }, leftoverButtons);
            }
            return (ReactDOMElements.div({
                className: "top-menu-wrapper",
            }, ReactDOMElements.div({
                className: "top-menu",
                ref: this.topMenuElement,
            }, ReactDOMElements.div({
                className: "top-menu-items",
                ref: this.topMenuItemsElement,
            }, topMenuItems)), openedCondensedMenu, TopMenuPopups_1.TopMenuPopups({
                ref: this.popupsComponent,
                player: this.props.player,
                game: this.props.game,
                activeLanguage: this.props.activeLanguage,
                selectedStar: this.props.selectedStar,
                setSelectedStar: this.props.setSelectedStar,
            })));
        };
        TopMenuComponent.prototype.bindMethods = function () {
            this.handleResize = this.handleResize.bind(this);
            this.toggleOrBringPopupToTop = this.toggleOrBringPopupToTop.bind(this);
            this.closePopup = this.closePopup.bind(this);
            this.toggleCondensedMenu = this.toggleCondensedMenu.bind(this);
            this.handleToggleHamburger = this.handleToggleHamburger.bind(this);
            this.delayedResize = this.delayedResize.bind(this);
        };
        TopMenuComponent.prototype.getInitialStateTODO = function () {
            return ({
                hasCondensedMenu: false,
                opened: false,
                buttonsToPlace: 999,
                condensedMenuOpened: Options_1.options.display.noHamburger,
            });
        };
        TopMenuComponent.prototype.handleToggleHamburger = function () {
            this.handleResize();
            this.forceUpdate();
        };
        TopMenuComponent.prototype.delayedResize = function () {
            window.setTimeout(this.handleResize, 0);
        };
        TopMenuComponent.prototype.handleResize = function () {
            if (!this.cachedTopMenuWidth) {
                this.cachedTopMenuWidth = this.topMenuItemsElement.current.getBoundingClientRect().width;
                var buttons = this.topMenuItemsElement.current.children;
                var margin = parseInt(window.getComputedStyle(buttons[0]).margin) * 2;
                for (var i = 0; i < buttons.length; i++) {
                    var buttonWidth = buttons[i].getBoundingClientRect().width + margin;
                    this.cachedButtonWidths.push(buttonWidth);
                }
            }
            var topMenuHeight = window.innerHeight > 600 ? 50 : 32;
            var topBar = document.getElementsByClassName("top-bar-info")[0];
            var topBarRect = topBar.getBoundingClientRect();
            var rightmostRect = topBarRect;
            var fleetContainer = document.getElementsByClassName("fleet-selection")[0];
            if (fleetContainer) {
                var fleetElementToCheckAgainst = void 0;
                var firstChild = fleetContainer.firstChild;
                if (firstChild.classList.contains("fleet-selection-controls")) {
                    fleetElementToCheckAgainst = document.getElementsByClassName("fleet-selection-selected-wrapper")[0];
                }
                else {
                    fleetElementToCheckAgainst = firstChild;
                }
                if (fleetElementToCheckAgainst) {
                    var fleetRect = fleetElementToCheckAgainst.getBoundingClientRect();
                    if (fleetRect.top < topMenuHeight && fleetRect.right > topBarRect.right) {
                        rightmostRect = fleetRect;
                    }
                }
            }
            var spaceAvailable = window.innerWidth - rightmostRect.right;
            var hasCondensedMenu = spaceAvailable < this.cachedTopMenuWidth;
            var amountOfButtonsToPlace = 0;
            if (hasCondensedMenu) {
                if (!Options_1.options.display.noHamburger) {
                    spaceAvailable -= this.cachedMenuButtonWidth;
                }
                var padding = window.innerHeight > 600 ? 25 : 0;
                for (var i = 0; i < this.cachedButtonWidths.length; i++) {
                    var buttonWidthToCheck = this.cachedButtonWidths[i];
                    if (spaceAvailable > buttonWidthToCheck + padding) {
                        amountOfButtonsToPlace++;
                        spaceAvailable -= buttonWidthToCheck;
                    }
                    else {
                        break;
                    }
                }
            }
            else {
                amountOfButtonsToPlace = this.cachedButtonWidths.length;
            }
            this.setState({
                hasCondensedMenu: hasCondensedMenu,
                buttonsToPlace: amountOfButtonsToPlace,
            });
        };
        TopMenuComponent.prototype.toggleOrBringPopupToTop = function (popupType) {
            this.popupsComponent.current.toggleOrBringPopupToFront(popupType);
        };
        TopMenuComponent.prototype.closePopup = function (popupType, e) {
            e.preventDefault();
            e.stopPropagation();
            if (this.popupsComponent.current.state[popupType]) {
                this.popupsComponent.current.togglePopup(popupType);
            }
        };
        TopMenuComponent.prototype.toggleCondensedMenu = function () {
            this.setState({
                condensedMenuOpened: !this.state.condensedMenuOpened,
            });
        };
        return TopMenuComponent;
    }(React.PureComponent));
    exports.TopMenuComponent = TopMenuComponent;
    exports.TopMenu = React.createFactory(TopMenuComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/galaxymap/TopMenuPopups", ["require", "exports", "react", "react-dom-factories", "localforage", "modules/defaultui/localization/localize", "src/Options", "modules/defaultui/uicomponents/diplomacy/DiplomacyOverview", "modules/defaultui/uicomponents/production/ProductionOverview", "modules/defaultui/uicomponents/saves/LoadGame", "modules/defaultui/uicomponents/saves/SaveGame", "modules/defaultui/uicomponents/technologies/TechnologiesList", "modules/defaultui/uicomponents/unitlist/ItemEquip", "modules/defaultui/uicomponents/windows/DefaultWindow", "modules/defaultui/uicomponents/galaxymap/EconomySummary", "modules/defaultui/uicomponents/options/FullOptionsList", "src/storageStrings"], function (require, exports, React, ReactDOMElements, localForage, localize_1, Options_1, DiplomacyOverview_1, ProductionOverview_1, LoadGame_1, SaveGame_1, TechnologiesList_1, ItemEquip_1, DefaultWindow_1, EconomySummary_1, FullOptionsList_1, storageStrings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TopMenuPopupsComponent = (function (_super) {
        __extends(TopMenuPopupsComponent, _super);
        function TopMenuPopupsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TopMenuPopups";
            _this.popupComponents = {};
            _this.cachedPopupPositions = {};
            _this.popupConstructData = {
                production: {
                    makeContent: function () { return ProductionOverview_1.ProductionOverview({
                        player: _this.props.player,
                        globalSelectedStar: _this.props.selectedStar,
                        setSelectedStar: _this.props.setSelectedStar,
                    }); },
                    title: localize_1.localize("production")(),
                },
                equipItems: {
                    makeContent: function () { return ItemEquip_1.ItemEquip({
                        player: _this.props.player,
                    }); },
                    title: localize_1.localize("equip")(),
                },
                economySummary: {
                    makeContent: function () { return EconomySummary_1.EconomySummary({
                        player: _this.props.player,
                    }); },
                    title: localize_1.localize("economy")(),
                },
                saveGame: {
                    makeContent: function () { return SaveGame_1.SaveGame({
                        handleClose: _this.closePopup.bind(_this, "saveGame"),
                    }); },
                    title: localize_1.localize("save_action")(),
                },
                loadGame: {
                    makeContent: function () { return LoadGame_1.LoadGame({
                        handleClose: _this.closePopup.bind(_this, "loadGame"),
                    }); },
                    title: localize_1.localize("load_action")(),
                },
                options: {
                    makeContent: function () { return FullOptionsList_1.FullOptionsList({
                        activeLanguage: _this.props.activeLanguage,
                    }); },
                    title: localize_1.localize("options")(),
                },
                diplomacy: {
                    makeContent: function () { return DiplomacyOverview_1.DiplomacyOverview({
                        player: _this.props.player,
                    }); },
                    title: localize_1.localize("diplomacy")(),
                },
                technologies: {
                    makeContent: function () { return TechnologiesList_1.TechnologiesList({
                        playerTechnology: _this.props.player.playerTechnology,
                    }); },
                    title: localize_1.localize("technology")(),
                },
            };
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            localForage.getItem(storageStrings_1.storageStrings.windowPositions).then(function (storedWindowPositions) {
                if (storedWindowPositions) {
                    var parsed = JSON.parse(storedWindowPositions);
                    for (var key in parsed) {
                        _this.cachedPopupPositions[key] = parsed[key];
                    }
                }
            });
            return _this;
        }
        TopMenuPopupsComponent.prototype.togglePopup = function (popupType) {
            if (this.state[popupType]) {
                this.closePopup(popupType);
            }
            else {
                this.openPopup(popupType);
            }
        };
        TopMenuPopupsComponent.prototype.bringPopupToFront = function (popupType) {
            this.popupComponents[popupType].current.windowContainerComponent.current.bringToTop();
        };
        TopMenuPopupsComponent.prototype.toggleOrBringPopupToFront = function (popupType) {
            if (this.state[popupType]) {
                var isTopMost = this.popupComponents[popupType].current.windowContainerComponent.current.isTopMostWindow();
                if (isTopMost) {
                    this.closePopup(popupType);
                }
                else {
                    this.bringPopupToFront(popupType);
                }
            }
            else {
                this.openPopup(popupType);
            }
        };
        TopMenuPopupsComponent.prototype.componentWillUnmount = function () {
            this.cacheAllWindowPositions();
            this.storeWindowPositions();
        };
        TopMenuPopupsComponent.prototype.render = function () {
            var popups = [];
            for (var popupType in this.state) {
                if (this.state[popupType]) {
                    popups.push(this.makePopup(popupType));
                }
            }
            return (ReactDOMElements.div({
                className: "top-menu-popups-wrapper",
            }, popups));
        };
        TopMenuPopupsComponent.prototype.bindMethods = function () {
            this.openPopup = this.openPopup.bind(this);
            this.closePopup = this.closePopup.bind(this);
            this.togglePopup = this.togglePopup.bind(this);
            this.bringPopupToFront = this.bringPopupToFront.bind(this);
            this.toggleOrBringPopupToFront = this.toggleOrBringPopupToFront.bind(this);
            this.cacheWindowPosition = this.cacheWindowPosition.bind(this);
            this.cacheAllWindowPositions = this.cacheAllWindowPositions.bind(this);
            this.storeWindowPositions = this.storeWindowPositions.bind(this);
        };
        TopMenuPopupsComponent.prototype.getInitialStateTODO = function () {
            return ({
                production: false,
                equipItems: false,
                economySummary: false,
                saveGame: false,
                loadGame: false,
                options: false,
                diplomacy: false,
                technologies: false,
            });
        };
        TopMenuPopupsComponent.prototype.closePopup = function (popupType) {
            this.cacheWindowPosition(popupType);
            this.storeWindowPositions();
            if (popupType === "options") {
                Options_1.options.save();
            }
            this.popupComponents[popupType] = null;
            var stateObj = {};
            stateObj[popupType] = false;
            this.setState(stateObj);
        };
        TopMenuPopupsComponent.prototype.openPopup = function (popupType) {
            var stateObj = {};
            stateObj[popupType] = true;
            this.setState(stateObj);
        };
        TopMenuPopupsComponent.prototype.makePopup = function (popupType) {
            var _this = this;
            var constructData = this.popupConstructData[popupType];
            if (!this.popupComponents[popupType]) {
                this.popupComponents[popupType] = React.createRef();
            }
            return DefaultWindow_1.DefaultWindow({
                key: popupType,
                ref: this.popupComponents[popupType],
                title: constructData.title,
                handleClose: function () {
                    _this.closePopup(popupType);
                },
                getInitialPosition: !this.cachedPopupPositions[popupType] ?
                    undefined :
                    function () {
                        return _this.cachedPopupPositions[popupType];
                    },
            }, constructData.makeContent());
        };
        TopMenuPopupsComponent.prototype.cacheWindowPosition = function (key) {
            if (this.popupComponents[key]) {
                var popupComponent = this.popupComponents[key].current;
                this.cachedPopupPositions[key] = popupComponent.windowContainerComponent.current.getPosition();
            }
        };
        TopMenuPopupsComponent.prototype.cacheAllWindowPositions = function () {
            for (var key in this.popupComponents) {
                this.cacheWindowPosition(key);
            }
        };
        TopMenuPopupsComponent.prototype.storeWindowPositions = function () {
            localForage.setItem(storageStrings_1.storageStrings.windowPositions, JSON.stringify(this.cachedPopupPositions));
        };
        return TopMenuPopupsComponent;
    }(React.Component));
    exports.TopMenuPopupsComponent = TopMenuPopupsComponent;
    exports.TopMenuPopups = React.createFactory(TopMenuPopupsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/generic/Collapsible", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CollapsibleComponent = (function (_super) {
        __extends(CollapsibleComponent, _super);
        function CollapsibleComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "Collapsible";
            _this.state =
                {
                    isCollapsed: props.isCollapsedInitially || false,
                };
            _this.toggleCollapse = _this.toggleCollapse.bind(_this);
            return _this;
        }
        CollapsibleComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "" + (this.state.isCollapsed ? "collapsed" : "collapsible"),
            }, ReactDOMElements.div({
                className: "collapsible-header",
            }, ReactDOMElements.div({
                className: "collapsible-header-title",
                onClick: this.toggleCollapse,
            }, this.props.title), this.props.additionalHeaderContent || null), this.state.isCollapsed ? null : this.props.children));
        };
        CollapsibleComponent.prototype.toggleCollapse = function () {
            this.setState({
                isCollapsed: !this.state.isCollapsed,
            });
        };
        return CollapsibleComponent;
    }(React.Component));
    exports.CollapsibleComponent = CollapsibleComponent;
    exports.Collapsible = React.createFactory(CollapsibleComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/generic/NumberInput", ["require", "exports", "react", "react-dom-factories", "src/utility", "modules/defaultui/uicomponents/generic/Spinner"], function (require, exports, React, ReactDOMElements, utility_1, Spinner_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NumberInputComponent = (function (_super) {
        __extends(NumberInputComponent, _super);
        function NumberInputComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "NumberInput";
            var value = NumberInputComponent.roundValue(props.value, props.step);
            _this.state =
                {
                    displayedValue: NumberInputComponent.getValueString(value, props),
                    lastValidValue: value,
                };
            _this.handleValueInput = _this.handleValueInput.bind(_this);
            _this.setValue = _this.setValue.bind(_this);
            _this.handleBlur = _this.handleBlur.bind(_this);
            return _this;
        }
        NumberInputComponent.prototype.componentDidUpdate = function (prevProps, prevState) {
            var value = NumberInputComponent.roundValue(this.props.value, this.props.step);
            var thereWasExternalChange = value !== prevState.lastValidValue;
            if (thereWasExternalChange) {
                this.setState({
                    displayedValue: NumberInputComponent.getValueString(value, this.props),
                    lastValidValue: this.props.value,
                });
            }
        };
        NumberInputComponent.prototype.componentWillUnmount = function () {
            this.handleBlur();
        };
        NumberInputComponent.prototype.render = function () {
            var valueStringIsValid = NumberInputComponent.valueStringIsValid(this.state.displayedValue, this.props);
            var defaultAttributes = {
                className: "number-input-container",
            };
            var customAttributes = this.props.attributes || {};
            var attributes = utility_1.mergeReactAttributes(defaultAttributes, customAttributes);
            return (ReactDOMElements.div(attributes, ReactDOMElements.input({
                className: "number-input" + (valueStringIsValid ? "" : " invalid-value"),
                type: "text",
                value: this.state.displayedValue,
                spellCheck: false,
                onChange: this.handleValueInput,
                onBlur: this.handleBlur,
            }), this.props.noSpinner ? null : Spinner_1.Spinner({
                value: this.props.value,
                step: this.props.step,
                onChange: this.setValue,
                min: this.props.canWrap ? -Infinity : this.props.min,
                max: this.props.canWrap ? Infinity : this.props.max,
            })));
        };
        NumberInputComponent.prototype.handleBlur = function () {
            var isValid = NumberInputComponent.valueStringIsValid(this.state.displayedValue, this.props);
            if (isValid) {
                var value = NumberInputComponent.getValueFromValueString(this.state.displayedValue, this.props);
                if (value !== this.state.lastValidValue) {
                    this.setValue(value);
                }
            }
            else {
                this.setState({
                    displayedValue: NumberInputComponent.getValueString(this.props.value, this.props),
                });
            }
        };
        NumberInputComponent.prototype.handleValueInput = function (e) {
            var _this = this;
            e.stopPropagation();
            e.preventDefault();
            var target = e.currentTarget;
            var valueString = target.value;
            var value = NumberInputComponent.getValueFromValueString(valueString, this.props);
            var isValid = NumberInputComponent.valueStringIsValid(valueString, this.props);
            this.setState({
                displayedValue: valueString,
                lastValidValue: isValid ? value : this.state.lastValidValue,
            }, function () {
                if (isValid) {
                    _this.setValue(value);
                }
            });
        };
        NumberInputComponent.prototype.setValue = function (rawValue) {
            var value = NumberInputComponent.roundValue(rawValue, this.props.step);
            if (this.props.canWrap) {
                value = NumberInputComponent.getValueWithWrap(value, this.props.min, this.props.max);
            }
            this.props.onChange(value);
        };
        NumberInputComponent.getValueString = function (value, props) {
            if (props.stylizeValue) {
                return props.stylizeValue(value);
            }
            else {
                return "" + value;
            }
        };
        NumberInputComponent.getValueFromValueString = function (valueString, props) {
            if (props.getValueFromValueString) {
                return props.getValueFromValueString(valueString);
            }
            else {
                return parseFloat(valueString);
            }
        };
        NumberInputComponent.roundValue = function (value, step) {
            if (!step) {
                return value;
            }
            else {
                var precision = NumberInputComponent.getDecimalPlacesInStep(step);
                return parseFloat(value.toFixed(precision));
            }
        };
        NumberInputComponent.valueStringIsValid = function (valueString, props) {
            if (props.valueStringIsValid) {
                if (!props.valueStringIsValid(valueString)) {
                    return false;
                }
            }
            else {
                if (!utility_1.stringIsSignedFloat(valueString)) {
                    return false;
                }
            }
            var value = NumberInputComponent.getValueFromValueString(valueString, props);
            return NumberInputComponent.valueIsWithinBounds(value, props);
        };
        NumberInputComponent.valueIsWithinBounds = function (value, props) {
            var min = isFinite(props.min) ? props.min : -Infinity;
            var max = isFinite(props.max) ? props.max : Infinity;
            return value >= min && value <= max;
        };
        NumberInputComponent.getDecimalPlacesInStep = function (step) {
            var split = ("" + step).split(".");
            return split[1] ? split[1].length : 0;
        };
        NumberInputComponent.getValueWithWrap = function (value, min, max) {
            if (!isFinite(min) || !isFinite(max)) {
                throw new Error("NumberInput component with wrapping enabled must specify min and max values.");
            }
            if (value < min) {
                var underMin = min - (value % max);
                return max - underMin;
            }
            else {
                return value % max;
            }
        };
        return NumberInputComponent;
    }(React.Component));
    exports.NumberInputComponent = NumberInputComponent;
    exports.NumberInput = React.createFactory(NumberInputComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/generic/NumericTextInput", ["require", "exports", "react", "react-dom-factories", "src/utility"], function (require, exports, React, ReactDOMElements, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NumericTextInputComponent = (function (_super) {
        __extends(NumericTextInputComponent, _super);
        function NumericTextInputComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "NumericTextInput";
            _this.state =
                {
                    valueString: NumericTextInputComponent.getValueString(props.value, props.stylizeValue),
                    lastValidValue: props.value,
                };
            _this.handleValueChange = _this.handleValueChange.bind(_this);
            return _this;
        }
        NumericTextInputComponent.getDerivedStateFromProps = function (props, state) {
            var thereWasExternalChange = props.value !== state.lastValidValue;
            console.log(thereWasExternalChange, props.value, state.lastValidValue, state.valueString);
            if (thereWasExternalChange) {
                return ({
                    valueString: NumericTextInputComponent.getValueString(props.value, props.stylizeValue),
                    lastValidValue: props.value,
                });
            }
            else {
                return null;
            }
        };
        NumericTextInputComponent.getValueString = function (value, stylizeFN) {
            if (stylizeFN) {
                return stylizeFN(value);
            }
            else {
                return "" + value;
            }
        };
        NumericTextInputComponent.prototype.render = function () {
            var valueStringIsValid = this.props.valueStringIsValid(this.state.valueString);
            var defaultAttributes = {
                className: "numeric-text-input" +
                    (valueStringIsValid ? "" : " invalid-value"),
                onChange: this.handleValueChange,
                value: this.state.valueString,
                spellCheck: false,
                key: "asdafs",
            };
            var customAttributes = this.props.attributes || {};
            var attributes = utility_1.mergeReactAttributes(defaultAttributes, customAttributes);
            return (ReactDOMElements.input(attributes));
        };
        NumericTextInputComponent.prototype.handleValueChange = function (e) {
            var _this = this;
            e.stopPropagation();
            e.preventDefault();
            var target = e.currentTarget;
            var valueString = target.value;
            var isValid = this.props.valueStringIsValid(valueString);
            var value = this.props.getValueFromValueString(valueString);
            this.setState({
                valueString: valueString,
                lastValidValue: isValid ? value : this.state.lastValidValue,
            }, function () {
                if (isValid) {
                    _this.props.onValueChange(value);
                }
            });
        };
        return NumericTextInputComponent;
    }(React.Component));
    exports.NumericTextInputComponent = NumericTextInputComponent;
    exports.NumericTextInput = React.createFactory(NumericTextInputComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/generic/Spinner", ["require", "exports", "react", "react-dom-factories", "src/FixedRateTicker", "src/utility"], function (require, exports, React, ReactDOMElements, FixedRateTicker_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpinnerComponent = (function (_super) {
        __extends(SpinnerComponent, _super);
        function SpinnerComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "Spinner";
            _this.timeBetweenSpins = 50;
            _this.spinStartDelay = 300;
            _this.stepUp = _this.stepUp.bind(_this);
            _this.stepDown = _this.stepDown.bind(_this);
            _this.startSpinUp = _this.startSpinUp.bind(_this);
            _this.startSpinDown = _this.startSpinDown.bind(_this);
            _this.stopSpin = _this.stopSpin.bind(_this);
            _this.onSpinTick = _this.onSpinTick.bind(_this);
            _this.ticker = new FixedRateTicker_1.FixedRateTicker(_this.onSpinTick, _this.timeBetweenSpins);
            return _this;
        }
        SpinnerComponent.prototype.componentWillUnmount = function () {
            this.stopSpin();
        };
        SpinnerComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "spinner",
            }, ReactDOMElements.button({
                className: "spinner-arrow spinner-arrow-up",
                onClick: this.stepUp,
                onMouseDown: this.startSpinUp,
                onTouchStart: this.startSpinUp,
            }), ReactDOMElements.button({
                className: "spinner-arrow spinner-arrow-down",
                onClick: this.stepDown,
                onMouseDown: this.startSpinDown,
                onTouchStart: this.startSpinDown,
            })));
        };
        SpinnerComponent.prototype.adjust = function (delta) {
            var min = isFinite(this.props.min) ? this.props.min : -Infinity;
            var max = isFinite(this.props.max) ? this.props.max : Infinity;
            var newValue = utility_1.clamp(utility_1.roundToNearestMultiple(this.props.value + delta, this.props.step), min, max);
            this.props.onChange(newValue);
        };
        SpinnerComponent.prototype.stepUp = function () {
            this.adjust(this.props.step);
        };
        SpinnerComponent.prototype.stepDown = function () {
            this.adjust(-this.props.step);
        };
        SpinnerComponent.prototype.startSpinUp = function () {
            this.spinDirection = 1;
            this.startSpin();
        };
        SpinnerComponent.prototype.startSpinDown = function () {
            this.spinDirection = -1;
            this.startSpin();
        };
        SpinnerComponent.prototype.startSpin = function () {
            var _this = this;
            document.addEventListener("mouseup", this.stopSpin);
            document.addEventListener("touchend", this.stopSpin);
            this.startSpinTimeoutHandle = window.setTimeout(function () {
                _this.ticker.start();
            }, this.spinStartDelay);
        };
        SpinnerComponent.prototype.stopSpin = function () {
            this.ticker.stop();
            if (isFinite(this.startSpinTimeoutHandle)) {
                window.clearTimeout(this.startSpinTimeoutHandle);
            }
            this.startSpinTimeoutHandle = undefined;
            document.removeEventListener("mouseup", this.stopSpin);
            document.removeEventListener("touchend", this.stopSpin);
        };
        SpinnerComponent.prototype.onSpinTick = function (ticks) {
            this.adjust(this.spinDirection * this.props.step * ticks);
        };
        return SpinnerComponent;
    }(React.Component));
    exports.SpinnerComponent = SpinnerComponent;
    exports.Spinner = React.createFactory(SpinnerComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/language/AppLanguageSelect", ["require", "exports", "react", "src/App", "src/activeModuleData", "src/Options", "src/localization/languageSupport", "modules/defaultui/uicomponents/language/LanguageSelect"], function (require, exports, React, App_1, activeModuleData_1, Options_1, languageSupport_1, LanguageSelect_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppLanguageSelectComponent = (function (_super) {
        __extends(AppLanguageSelectComponent, _super);
        function AppLanguageSelectComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "AppLanguageSelect";
            _this.handleLanguageChange = _this.handleLanguageChange.bind(_this);
            return _this;
        }
        AppLanguageSelectComponent.prototype.render = function () {
            return (LanguageSelect_1.LanguageSelect({
                activeLanguage: this.props.activeLanguage,
                availableLanguagesByCode: languageSupport_1.getLanguagesByCodeFromGameModules.apply(void 0, activeModuleData_1.activeModuleData.gameModules),
                languageSupportLevelByCode: languageSupport_1.getLanguageSupportLevelForGameModules.apply(void 0, activeModuleData_1.activeModuleData.gameModules),
                onChange: this.handleLanguageChange,
            }));
        };
        AppLanguageSelectComponent.prototype.handleLanguageChange = function (newLanguage) {
            Options_1.options.display.language = newLanguage;
            Options_1.options.save();
            if (this.props.onChange) {
                this.props.onChange();
            }
            App_1.app.reactUI.render();
        };
        return AppLanguageSelectComponent;
    }(React.Component));
    exports.AppLanguageSelectComponent = AppLanguageSelectComponent;
    exports.AppLanguageSelect = React.createFactory(AppLanguageSelectComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/language/LanguageSelect", ["require", "exports", "react", "react-dom-factories", "src/localization/languageSupport", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, languageSupport_1, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LanguageSelectComponent = (function (_super) {
        __extends(LanguageSelectComponent, _super);
        function LanguageSelectComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "LanguageSelect";
            _this.handleLanguageChange = _this.handleLanguageChange.bind(_this);
            return _this;
        }
        LanguageSelectComponent.prototype.render = function () {
            var _this = this;
            var sortedLanguages = Object.keys(this.props.availableLanguagesByCode).map(function (code) {
                return _this.props.availableLanguagesByCode[code];
            }).sort(function (a, b) {
                var aSupportLevel = _this.props.languageSupportLevelByCode[a.code];
                var bSupportLevel = _this.props.languageSupportLevelByCode[b.code];
                var supportLevelSort = bSupportLevel - aSupportLevel;
                if (supportLevelSort) {
                    return supportLevelSort;
                }
                else {
                    return a.displayName.localeCompare(b.displayName);
                }
            });
            var languageOptionElements = sortedLanguages.map(function (language) {
                var supportLevel = _this.props.languageSupportLevelByCode[language.code];
                return ReactDOMElements.option({
                    className: "language-select-option" + (supportLevel === languageSupport_1.LanguageSupportLevel.Full ?
                        " full-language-support" :
                        " partial-language-support"),
                    value: language.code,
                    key: language.code,
                    title: supportLevel === languageSupport_1.LanguageSupportLevel.Full ?
                        localize_1.localize("fullLanguageSupport")() :
                        localize_1.localize("partialLanguageSupport")(),
                }, language.displayName);
            });
            return (ReactDOMElements.select({
                className: "language-select",
                value: this.props.activeLanguage.code,
                onChange: this.handleLanguageChange,
            }, languageOptionElements));
        };
        LanguageSelectComponent.prototype.handleLanguageChange = function (e) {
            var target = e.currentTarget;
            var selectedLanguageCode = target.value;
            var newLanguage = this.props.availableLanguagesByCode[selectedLanguageCode];
            if (!newLanguage) {
                throw new Error("Couldn't select language with code " + selectedLanguageCode + ".\n        Valid languages: " + Object.keys(this.props.availableLanguagesByCode));
            }
            this.props.onChange(newLanguage);
        };
        return LanguageSelectComponent;
    }(React.Component));
    exports.LanguageSelectComponent = LanguageSelectComponent;
    exports.LanguageSelect = React.createFactory(LanguageSelectComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/list/List", ["require", "exports", "react", "react-dom-factories", "src/eventManager", "src/utility"], function (require, exports, React, ReactDOMElements, eventManager_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ListComponent = (function (_super) {
        __extends(ListComponent, _super);
        function ListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.ownDOMNode = React.createRef();
            _this.headerElement = React.createRef();
            _this.innerElement = React.createRef();
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        ListComponent.prototype.bindMethods = function () {
            this.getNewSortingOrder = this.getNewSortingOrder.bind(this);
            this.handleScroll = this.handleScroll.bind(this);
            this.makeInitialSortingOrder = this.makeInitialSortingOrder.bind(this);
            this.shiftSelection = this.shiftSelection.bind(this);
            this.handleSelectRow = this.handleSelectRow.bind(this);
            this.setDesiredHeight = this.setDesiredHeight.bind(this);
            this.handleSelectColumn = this.handleSelectColumn.bind(this);
            this.getSortedItems = this.getSortedItems.bind(this);
        };
        ListComponent.prototype.getInitialStateTODO = function () {
            var initialColumn = this.props.initialSortOrder ?
                this.props.initialSortOrder[0] :
                this.props.initialColumns[0];
            var sortingOrderForColumnKey = {};
            this.props.initialColumns.forEach(function (column) {
                sortingOrderForColumnKey[column.key] = column.defaultOrder;
            });
            return ({
                columns: this.props.initialColumns,
                selected: null,
                selectedColumn: initialColumn,
                columnSortingOrder: this.makeInitialSortingOrder(this.props.initialColumns, initialColumn),
                sortingOrderForColumnKey: sortingOrderForColumnKey,
            });
        };
        ListComponent.prototype.componentDidMount = function () {
            var _this = this;
            window.addEventListener("resize", this.setDesiredHeight, false);
            eventManager_1.eventManager.addEventListener("popupResized", this.setDesiredHeight);
            if (this.props.keyboardSelect) {
                this.ownDOMNode.current.addEventListener("keydown", function (event) {
                    switch (event.keyCode) {
                        case 40:
                            {
                                _this.shiftSelection(1);
                                break;
                            }
                        case 38:
                            {
                                _this.shiftSelection(-1);
                                break;
                            }
                        default:
                            {
                                return;
                            }
                    }
                });
            }
            if (this.props.initialSelected) {
                this.handleSelectRow(this.props.initialSelected);
            }
            else if (this.props.autoSelect) {
                this.handleSelectRow(this.sortedItems[0]);
                this.ownDOMNode.current.focus();
            }
            else {
                this.setState({ selected: this.sortedItems[0] });
            }
        };
        ListComponent.prototype.componentWillUnmount = function () {
            window.removeEventListener("resize", this.setDesiredHeight);
            eventManager_1.eventManager.removeEventListener("popupResized", this.setDesiredHeight);
        };
        ListComponent.prototype.componentDidUpdate = function () {
            this.setDesiredHeight();
        };
        ListComponent.prototype.setDesiredHeight = function () {
            var ownNode = this.ownDOMNode.current;
            var innerNode = this.innerElement.current;
            ownNode.style.height = "auto";
            innerNode.style.height = "auto";
            var parentHeight = ownNode.parentElement.getBoundingClientRect().height;
            var ownRect = ownNode.getBoundingClientRect();
            var ownHeight = ownRect.height;
            var strippedOwnHeight = parseInt(getComputedStyle(ownNode).height);
            var extraHeight = ownHeight - strippedOwnHeight;
            var desiredHeight = parentHeight - extraHeight;
            var maxHeight = window.innerHeight - ownRect.top - extraHeight;
            desiredHeight = Math.min(desiredHeight, maxHeight);
            ownNode.style.height = "" + desiredHeight + "px";
            innerNode.style.height = "" + desiredHeight + "px";
        };
        ListComponent.prototype.handleScroll = function (e) {
            var target = e.currentTarget;
            var header = this.headerElement.current;
            var titles = header.getElementsByClassName("fixed-table-th-inner");
            var marginString = "-" + target.scrollLeft + "px";
            for (var i = 0; i < titles.length; i++) {
                titles[i].style.marginLeft = marginString;
            }
        };
        ListComponent.prototype.makeInitialSortingOrder = function (columns, initialColumn) {
            var initialSortOrder = this.props.initialSortOrder;
            if (!initialSortOrder || initialSortOrder.length < 1) {
                initialSortOrder = [initialColumn];
            }
            var order = initialSortOrder;
            for (var i = 0; i < columns.length; i++) {
                if (initialSortOrder.indexOf(columns[i]) === -1) {
                    order.push(columns[i]);
                }
            }
            return order;
        };
        ListComponent.prototype.getNewSortingOrder = function (newColumn) {
            var order = this.state.columnSortingOrder.slice(0);
            var current = order.indexOf(newColumn);
            if (current >= 0) {
                order.splice(current);
            }
            order.unshift(newColumn);
            return order;
        };
        ListComponent.reverseListOrder = function (order) {
            if (order === "asc") {
                return "desc";
            }
            else if (order === "desc") {
                return "asc";
            }
            else {
                throw new Error("Invalid list order: " + order);
            }
        };
        ListComponent.prototype.getSortingOrderForColumnKeyWithColumnReversed = function (columnToReverse) {
            var copied = utility_1.shallowCopy(this.state.sortingOrderForColumnKey);
            copied[columnToReverse.key] = ListComponent.reverseListOrder(copied[columnToReverse.key]);
            return copied;
        };
        ListComponent.prototype.handleSelectColumn = function (column) {
            if (column.notSortable) {
                return;
            }
            this.setState({
                selectedColumn: column,
                columnSortingOrder: this.getNewSortingOrder(column),
                sortingOrderForColumnKey: this.state.selectedColumn.key === column.key ?
                    this.getSortingOrderForColumnKeyWithColumnReversed(column) :
                    this.state.sortingOrderForColumnKey,
            });
        };
        ListComponent.prototype.handleSelectRow = function (row) {
            if (this.props.onRowChange && row) {
                this.props.onRowChange.call(null, row);
            }
            this.setState({
                selected: row,
            });
        };
        ListComponent.prototype.getSortedItems = function () {
            var _this = this;
            var sortingFunctions = {};
            function makeSortingFunction(column) {
                if (column.sortingFunction) {
                    return column.sortingFunction;
                }
                else {
                    return (function (a, b) {
                        var propToSortBy = column.propToSortBy || column.key;
                        var vA = a.content.props[propToSortBy];
                        var vB = b.content.props[propToSortBy];
                        if (vA > vB) {
                            return 1;
                        }
                        else if (vA < vB) {
                            return -1;
                        }
                        else {
                            if (a.key > b.key) {
                                return 1;
                            }
                            else if (a.key < b.key) {
                                return 0;
                            }
                            else {
                                throw new Error("Duplicate key " + a.key + " for list items.");
                            }
                        }
                    });
                }
            }
            function getSortingFunction(column) {
                if (!sortingFunctions[column.key]) {
                    sortingFunctions[column.key] = makeSortingFunction(column);
                }
                return sortingFunctions[column.key];
            }
            var sortedItems = this.props.listItems.slice(0).sort(function (a, b) {
                for (var i = 0; i < _this.state.columnSortingOrder.length; i++) {
                    var columnToSortBy = _this.state.columnSortingOrder[i];
                    var sortingFunction = getSortingFunction(columnToSortBy);
                    var sortingResult = sortingFunction(a, b);
                    if (sortingResult) {
                        if (_this.state.sortingOrderForColumnKey[columnToSortBy.key] === "desc") {
                            return -1 * sortingResult;
                        }
                        else {
                            return sortingResult;
                        }
                    }
                }
                var keySortingResult = a.key > b.key ? 1 : -1;
                if (_this.state.sortingOrderForColumnKey[_this.state.selectedColumn.key] === "desc") {
                    return -1 * keySortingResult;
                }
                else {
                    return keySortingResult;
                }
            });
            return sortedItems;
        };
        ListComponent.prototype.shiftSelection = function (amountToShift) {
            var reverseIndexes = {};
            for (var i = 0; i < this.sortedItems.length; i++) {
                reverseIndexes[this.sortedItems[i].key] = i;
            }
            var currSelectedIndex = reverseIndexes[this.state.selected.key];
            var nextIndex = (currSelectedIndex + amountToShift) % this.sortedItems.length;
            if (nextIndex < 0) {
                nextIndex += this.sortedItems.length;
            }
            this.handleSelectRow(this.sortedItems[nextIndex]);
        };
        ListComponent.prototype.render = function () {
            var _this = this;
            var columns = [];
            var headerLabels = [];
            this.state.columns.forEach(function (column) {
                var colProps = {
                    key: column.key,
                };
                if (_this.props.colStylingFN) {
                    colProps = _this.props.colStylingFN(column, colProps);
                }
                columns.push(ReactDOMElements.col(colProps));
                var sortStatus = "";
                if (!column.notSortable) {
                    sortStatus = " sortable";
                }
                if (_this.state.selectedColumn.key === column.key) {
                    sortStatus += " sorted-" + _this.state.sortingOrderForColumnKey[column.key];
                }
                else if (!column.notSortable) {
                    sortStatus += " unsorted";
                }
                headerLabels.push(ReactDOMElements.th({
                    key: column.key,
                }, ReactDOMElements.div({
                    className: "fixed-table-th-inner",
                }, ReactDOMElements.div({
                    className: "fixed-table-th-content" + sortStatus,
                    title: column.title || colProps.title || null,
                    onMouseDown: _this.handleSelectColumn.bind(null, column),
                    onTouchStart: _this.handleSelectColumn.bind(null, column),
                }, column.label))));
            });
            this.sortedItems = this.getSortedItems();
            var rows = [];
            this.sortedItems.forEach(function (item, i) {
                rows.push(React.cloneElement(item.content, {
                    key: item.key,
                    activeColumns: _this.state.columns,
                    handleClick: _this.handleSelectRow.bind(null, item),
                }));
                if (_this.props.addSpacer && i < _this.sortedItems.length - 1) {
                    rows.push(ReactDOMElements.tr({
                        className: "list-spacer",
                        key: "spacer" + i,
                    }, ReactDOMElements.td({
                        colSpan: 20,
                    }, null)));
                }
            });
            return (ReactDOMElements.div({
                className: "fixed-table-container" + (this.props.noHeader ? " no-header" : ""),
                tabIndex: isFinite(this.props.tabIndex) ? this.props.tabIndex : 1,
                ref: this.ownDOMNode,
            }, ReactDOMElements.div({ className: "fixed-table-header-background" }), ReactDOMElements.div({
                className: "fixed-table-container-inner",
                ref: this.innerElement,
                onScroll: this.handleScroll,
            }, ReactDOMElements.table({
                className: "react-list",
            }, ReactDOMElements.colgroup(null, columns), ReactDOMElements.thead({
                className: "fixed-table-actual-header",
                ref: this.headerElement,
            }, ReactDOMElements.tr(null, headerLabels)), ReactDOMElements.thead({ className: "fixed-table-hidden-header" }, ReactDOMElements.tr(null, headerLabels)), ReactDOMElements.tbody(null, rows)))));
        };
        return ListComponent;
    }(React.Component));
    exports.ListComponent = ListComponent;
    var factory = React.createFactory(ListComponent);
    function List(props) {
        var children = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            children[_i - 1] = arguments[_i];
        }
        return factory.apply(void 0, [props].concat(children));
    }
    exports.List = List;
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/mapmodes/MapModeSelector", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapModeSelectorComponent = (function (_super) {
        __extends(MapModeSelectorComponent, _super);
        function MapModeSelectorComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "MapModeSelector";
            _this.bindMethods();
            return _this;
        }
        MapModeSelectorComponent.prototype.handleChange = function (e) {
            var target = e.currentTarget;
            var value = target.value;
            this.props.mapRenderer.setMapModeByKey(value);
            if (this.props.onUpdate) {
                this.props.onUpdate();
            }
        };
        MapModeSelectorComponent.prototype.bindMethods = function () {
            this.makeOptions = this.makeOptions.bind(this);
            this.handleChange = this.handleChange.bind(this);
        };
        MapModeSelectorComponent.prototype.makeOptions = function () {
            var mapRenderer = this.props.mapRenderer;
            var options = [];
            for (var key in mapRenderer.mapModes) {
                var mapMode = mapRenderer.mapModes[key];
                options.push(ReactDOMElements.option({
                    value: key,
                    key: key,
                }, mapMode.displayName));
            }
            return options;
        };
        MapModeSelectorComponent.prototype.render = function () {
            var mapRenderer = this.props.mapRenderer;
            return (ReactDOMElements.select({
                className: "map-mode-selector",
                value: mapRenderer.currentMapMode.template.key,
                onChange: this.handleChange,
            }, this.makeOptions()));
        };
        return MapModeSelectorComponent;
    }(React.Component));
    exports.MapModeSelectorComponent = MapModeSelectorComponent;
    exports.MapModeSelector = React.createFactory(MapModeSelectorComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/mapmodes/MapModeSettings", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/mapmodes/MapModeSelector", "modules/defaultui/uicomponents/mapmodes/MapRendererLayersList"], function (require, exports, React, ReactDOMElements, localize_1, MapModeSelector_1, MapRendererLayersList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapModeSettingsComponent = (function (_super) {
        __extends(MapModeSettingsComponent, _super);
        function MapModeSettingsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "MapModeSettings";
            _this.layersListComponent = React.createRef();
            _this.bindMethods();
            return _this;
        }
        MapModeSettingsComponent.prototype.bindMethods = function () {
            this.handleReset = this.handleReset.bind(this);
        };
        MapModeSettingsComponent.prototype.handleReset = function () {
            var mapRenderer = this.props.mapRenderer;
            mapRenderer.currentMapMode.resetLayers();
            mapRenderer.resetMapModeLayersPosition();
            mapRenderer.setAllLayersAsDirty();
            this.layersListComponent.current.forceUpdate();
        };
        MapModeSettingsComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "map-mode-settings",
            }, MapRendererLayersList_1.MapRendererLayersList({
                mapRenderer: this.props.mapRenderer,
                currentMapMode: this.props.mapRenderer.currentMapMode,
                ref: this.layersListComponent,
            }), MapModeSelector_1.MapModeSelector({
                mapRenderer: this.props.mapRenderer,
                onUpdate: this.forceUpdate.bind(this),
            }), ReactDOMElements.button({
                className: "reset-map-mode-button",
                onClick: this.handleReset,
            }, localize_1.localize("reset")())));
        };
        return MapModeSettingsComponent;
    }(React.Component));
    exports.MapModeSettingsComponent = MapModeSettingsComponent;
    exports.MapModeSettings = React.createFactory(MapModeSettingsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/mapmodes/MapRendererLayersList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/mapmodes/MapRendererLayersListItem"], function (require, exports, React, ReactDOMElements, MapRendererLayersListItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapRendererLayersListComponent = (function (_super) {
        __extends(MapRendererLayersListComponent, _super);
        function MapRendererLayersListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "MapRendererLayersList";
            _this.ownDOMNode = React.createRef();
            _this.state =
                {
                    currentDraggingLayer: null,
                    layerToInsertNextTo: null,
                    insertPosition: null,
                };
            _this.handleDragEnd = _this.handleDragEnd.bind(_this);
            _this.handleToggleActive = _this.handleToggleActive.bind(_this);
            _this.updateLayer = _this.updateLayer.bind(_this);
            _this.handleSetHoverPosition = _this.handleSetHoverPosition.bind(_this);
            _this.handleDragStart = _this.handleDragStart.bind(_this);
            return _this;
        }
        MapRendererLayersListComponent.prototype.handleDragStart = function (layer) {
            this.setState({
                currentDraggingLayer: layer,
            });
        };
        MapRendererLayersListComponent.prototype.handleDragEnd = function () {
            this.props.mapRenderer.currentMapMode.moveLayer(this.state.currentDraggingLayer, this.state.layerToInsertNextTo, this.state.insertPosition);
            this.props.mapRenderer.resetMapModeLayersPosition();
            this.setState({
                currentDraggingLayer: null,
                layerToInsertNextTo: null,
                insertPosition: null,
            });
        };
        MapRendererLayersListComponent.prototype.render = function () {
            var _this = this;
            var mapMode = this.props.currentMapMode;
            if (!mapMode) {
                return null;
            }
            var layersData = mapMode.layers;
            var listItems = [];
            for (var i = 0; i < layersData.length; i++) {
                var layer = layersData[i];
                var layerKey = layer.template.key;
                listItems.push(MapRendererLayersListItem_1.MapRendererLayersListItem({
                    layer: layer,
                    layerName: layer.template.displayName,
                    isActive: mapMode.activeLayers[layerKey],
                    key: layerKey,
                    toggleActive: this.handleToggleActive.bind(this, layer),
                    listItemIsDragging: Boolean(this.state.currentDraggingLayer),
                    onDragStart: this.handleDragStart,
                    onDragEnd: this.handleDragEnd,
                    setHoverPosition: this.handleSetHoverPosition,
                    hoverSide: (layer === this.state.layerToInsertNextTo ? this.state.insertPosition : null),
                    updateLayer: this.updateLayer,
                    dragPositionerProps: {
                        getContainingElement: function () { return _this.ownDOMNode.current; },
                        startOnHandleElementOnly: true,
                    },
                }));
            }
            return (ReactDOMElements.ol({
                className: "map-renderer-layers-list",
                ref: this.ownDOMNode,
            }, listItems));
        };
        MapRendererLayersListComponent.prototype.handleToggleActive = function (layer) {
            var mapRenderer = this.props.mapRenderer;
            mapRenderer.currentMapMode.toggleLayer(layer);
            mapRenderer.updateMapModeLayers([layer]);
            this.forceUpdate();
        };
        MapRendererLayersListComponent.prototype.handleSetHoverPosition = function (layer, position) {
            this.setState({
                layerToInsertNextTo: layer,
                insertPosition: position,
            });
        };
        MapRendererLayersListComponent.prototype.updateLayer = function (layer) {
            var mapRenderer = this.props.mapRenderer;
            mapRenderer.setLayerAsDirty(layer.template.key);
        };
        return MapRendererLayersListComponent;
    }(React.PureComponent));
    exports.MapRendererLayersListComponent = MapRendererLayersListComponent;
    exports.MapRendererLayersList = React.createFactory(MapRendererLayersListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/mapmodes/MapRendererLayersListItem", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/mixins/DragPositioner", "modules/defaultui/uicomponents/mixins/applyMixins"], function (require, exports, React, ReactDOMElements, DragPositioner_1, applyMixins_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapRendererLayersListItemComponent = (function (_super) {
        __extends(MapRendererLayersListItemComponent, _super);
        function MapRendererLayersListItemComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "MapRendererLayersListItem";
            _this.ownDOMNode = React.createRef();
            _this.onDragEnd = _this.onDragEnd.bind(_this);
            _this.handleHover = _this.handleHover.bind(_this);
            _this.onDragStart = _this.onDragStart.bind(_this);
            _this.onDragMove = _this.onDragMove.bind(_this);
            _this.clearHover = _this.clearHover.bind(_this);
            _this.setLayerAlpha = _this.setLayerAlpha.bind(_this);
            _this.dragPositioner = new DragPositioner_1.DragPositioner(_this, _this.ownDOMNode, _this.props.dragPositionerProps);
            _this.dragPositioner.onDragStart = _this.onDragStart;
            _this.dragPositioner.onDragMove = _this.onDragMove;
            _this.dragPositioner.onDragEnd = _this.onDragEnd;
            applyMixins_1.applyMixins(_this, _this.dragPositioner);
            return _this;
        }
        MapRendererLayersListItemComponent.prototype.componentDidUpdate = function (prevProps) {
            if (prevProps.listItemIsDragging !== this.props.listItemIsDragging) {
                this.clearHover();
            }
        };
        MapRendererLayersListItemComponent.prototype.render = function () {
            var liProps = {
                className: "map-renderer-layers-list-item draggable",
                onMouseDown: this.dragPositioner.handleReactDownEvent,
                onTouchStart: this.dragPositioner.handleReactDownEvent,
                ref: this.ownDOMNode,
            };
            if (this.dragPositioner.isDragging) {
                liProps.style = this.dragPositioner.getStyleAttributes();
                liProps.className += " dragging";
            }
            if (this.props.listItemIsDragging) {
                liProps.onMouseMove = this.handleHover;
                liProps.onMouseLeave = this.clearHover;
                if (this.props.hoverSide) {
                    liProps.className += " insert-" + this.props.hoverSide;
                }
            }
            return (ReactDOMElements.li(liProps, ReactDOMElements.input({
                type: "checkbox",
                className: "map-renderer-layers-list-item-checkbox",
                checked: this.props.isActive,
                onChange: this.props.toggleActive,
            }), ReactDOMElements.span({
                className: "map-renderer-layers-list-item-name draggable",
            }, this.props.layerName), ReactDOMElements.input({
                className: "map-renderer-layers-list-item-alpha",
                type: "number",
                min: 0,
                max: 1,
                step: 0.05,
                value: "" + this.props.layer.alpha,
                onChange: this.setLayerAlpha,
            })));
        };
        MapRendererLayersListItemComponent.prototype.onDragStart = function () {
            this.props.onDragStart(this.props.layer);
        };
        MapRendererLayersListItemComponent.prototype.onDragMove = function (x, y) {
            this.dragPositioner.position.top = y;
            this.dragPositioner.updateDOMNodeStyle();
        };
        MapRendererLayersListItemComponent.prototype.onDragEnd = function () {
            this.props.onDragEnd();
        };
        MapRendererLayersListItemComponent.prototype.handleHover = function (e) {
            var rect = this.ownDOMNode.current.getBoundingClientRect();
            var midPoint = rect.top + rect.height / 2;
            var isAbove = e.clientY < midPoint;
            var hoverSide = isAbove ? "top" : "bottom";
            this.setState({
                hoverSide: hoverSide,
            });
            this.props.setHoverPosition(this.props.layer, hoverSide);
        };
        MapRendererLayersListItemComponent.prototype.clearHover = function () {
            this.setState({
                hoverSide: null,
            });
        };
        MapRendererLayersListItemComponent.prototype.setLayerAlpha = function (e) {
            var target = e.currentTarget;
            var value = parseFloat(target.value);
            if (isFinite(value)) {
                this.props.updateLayer(this.props.layer);
                this.props.layer.alpha = value;
            }
            this.forceUpdate();
        };
        return MapRendererLayersListItemComponent;
    }(React.PureComponent));
    exports.MapRendererLayersListItemComponent = MapRendererLayersListItemComponent;
    exports.MapRendererLayersListItem = React.createFactory(MapRendererLayersListItemComponent);
});
define("modules/defaultui/uicomponents/mixins/applyMixins", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var lifeCycleFunctions = [
        "componentDidMount",
        "componentDidUpdate", "componentWillUnmount",
    ];
    function wrapLifeCycleFunction(base, functionName, mixins) {
        var originalFunction = base[functionName];
        var mixinsWithFunction = mixins.filter(function (mixin) { return Boolean(mixin[functionName]); });
        base[functionName] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            mixinsWithFunction.forEach(function (mixin) {
                mixin[functionName].apply(mixin, args);
            });
            if (originalFunction) {
                originalFunction.apply(base, args);
            }
        };
    }
    function wrapRenderFunction(base, mixins) {
        var originalFunction = base.render;
        var mixinsWithFunction = mixins.filter(function (mixin) { return Boolean(mixin.onRender); });
        base.render = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            mixinsWithFunction.forEach(function (mixin) {
                mixin.onRender.call(mixin);
            });
            return originalFunction.apply(base, args);
        };
    }
    function applyMixins(base) {
        var mixins = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            mixins[_i - 1] = arguments[_i];
        }
        lifeCycleFunctions.forEach(function (functionName) {
            wrapLifeCycleFunction(base, functionName, mixins);
        });
        wrapRenderFunction(base, mixins);
    }
    exports.applyMixins = applyMixins;
});
define("modules/defaultui/uicomponents/mixins/AutoPositioner", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AutoPositioner = (function () {
        function AutoPositioner(owner, ownerRef) {
            this.hasResizeListener = false;
            this.owner = owner;
            this.ownerElementRef = ownerRef;
            this.setAutoPosition = this.setAutoPosition.bind(this);
        }
        Object.defineProperty(AutoPositioner.prototype, "props", {
            get: function () {
                return this.owner.props.autoPositionerProps;
            },
            enumerable: true,
            configurable: true
        });
        AutoPositioner.prototype.componentDidMount = function () {
            this.setAutoPosition();
            if (this.props.positionOnResize) {
                window.addEventListener("resize", this.setAutoPosition, false);
                this.hasResizeListener = true;
            }
        };
        AutoPositioner.prototype.componentWillUnmount = function () {
            if (this.hasResizeListener) {
                window.removeEventListener("resize", this.setAutoPosition);
            }
        };
        AutoPositioner.prototype.componentDidUpdate = function () {
            if (this.props.positionOnUpdate) {
                this.setAutoPosition();
            }
        };
        AutoPositioner.prototype.setAutoPosition = function () {
            var parentRect = this.props.getParentClientRect();
            var ownNode = this.ownerElementRef.current;
            var ownRect = ownNode.getBoundingClientRect();
            var ySide = this.props.ySide;
            var xSide = this.props.xSide;
            var yMargin = this.props.yMargin || 0;
            var xMargin = this.props.xMargin || 0;
            var top;
            var left;
            switch (ySide) {
                case "outerTop":
                    {
                        top = parentRect.top - ownRect.height - yMargin;
                        break;
                    }
                case "outerBottom":
                    {
                        top = parentRect.bottom + yMargin;
                        break;
                    }
                case "innerTop":
                    {
                        top = parentRect.top + yMargin;
                        break;
                    }
                case "innerBottom":
                    {
                        top = parentRect.bottom - ownRect.height - yMargin;
                        break;
                    }
            }
            switch (xSide) {
                case "outerLeft":
                    {
                        left = parentRect.left - ownRect.width - xMargin;
                        break;
                    }
                case "outerRight":
                    {
                        left = parentRect.right + xMargin;
                        break;
                    }
                case "innerLeft":
                    {
                        left = parentRect.left + xMargin;
                        break;
                    }
                case "innerRight":
                    {
                        left = parentRect.right - ownRect.width - xMargin;
                        break;
                    }
            }
            if (left < 0) {
                left = 0;
            }
            else if (left + ownRect.width > window.innerWidth) {
                left = left - (left + ownRect.width - window.innerWidth);
            }
            if (top < 0) {
                top = 0;
            }
            else if (top + ownRect.height > window.innerHeight) {
                top = top - (top + ownRect.height - window.innerHeight);
            }
            ownNode.style.left = "" + left + "px";
            ownNode.style.top = "" + top + "px";
        };
        return AutoPositioner;
    }());
    exports.AutoPositioner = AutoPositioner;
});
define("modules/defaultui/uicomponents/mixins/DragPositioner", ["require", "exports", "src/utility", "modules/defaultui/uicomponents/mixins/normalizeEvent"], function (require, exports, utility_1, normalizeEvent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DragPositioner = (function () {
        function DragPositioner(owner, ownerElementRef, props) {
            this.isDragging = false;
            this.getContainingElement = function () { return document.body; };
            this.startOnHandleElementOnly = false;
            this.dragThreshhold = 5;
            this.preventAutoResize = false;
            this.shouldMakeClone = false;
            this.position = {
                left: undefined,
                top: undefined,
                width: undefined,
                height: undefined,
            };
            this.originPosition = { x: 0, y: 0 };
            this.dragOffset = { x: 0, y: 0 };
            this.mouseDownPosition = { x: 0, y: 0 };
            this.cloneElement = null;
            this.ownerIsMounted = false;
            this.owner = owner;
            this.ownerElementRef = ownerElementRef;
            if (props) {
                for (var key in props) {
                    this[key] = props[key];
                }
            }
            this.handleNativeMoveEvent = this.handleNativeMoveEvent.bind(this);
            this.handleNativeUpEvent = this.handleNativeUpEvent.bind(this);
            this.handleReactDownEvent = this.handleReactDownEvent.bind(this);
        }
        DragPositioner.prototype.componentDidMount = function () {
            this.ownerIsMounted = true;
            this.ownerDOMNode = this.ownerElementRef.current;
        };
        DragPositioner.prototype.componentWillUnmount = function () {
            this.ownerIsMounted = false;
            this.removeEventListeners();
        };
        DragPositioner.prototype.getStyleAttributes = function () {
            return utility_1.shallowCopy(this.position);
        };
        DragPositioner.prototype.handleReactDownEvent = function (e) {
            this.handleMouseDown(normalizeEvent_1.normalizeEvent(e));
        };
        DragPositioner.prototype.updateDOMNodeStyle = function () {
            var s;
            if (this.cloneElement) {
                s = this.cloneElement.style;
            }
            else {
                s = this.ownerDOMNode.style;
                s.width = "" + this.position.width + "px";
                s.height = "" + this.position.height + "px";
            }
            s.left = "" + this.position.left + "px";
            s.top = "" + this.position.top + "px";
        };
        DragPositioner.prototype.handleMouseDown = function (e) {
            if (e.button) {
                return;
            }
            if (this.startOnHandleElementOnly) {
                if (!e.target.classList.contains("draggable")) {
                    e.stopPropagation();
                    return;
                }
            }
            e.preventDefault();
            e.stopPropagation();
            if (this.isDragging) {
                return;
            }
            var clientRect = this.ownerDOMNode.getBoundingClientRect();
            if (e.wasTouchEvent) {
                this.touchEventTarget = e.target;
            }
            this.addEventListeners();
            this.dragOffset = this.forcedDragOffset ||
                {
                    x: e.clientX - clientRect.left,
                    y: e.clientY - clientRect.top,
                };
            this.mouseDownPosition =
                {
                    x: e.pageX,
                    y: e.pageY,
                };
            this.originPosition =
                {
                    x: clientRect.left + document.body.scrollLeft,
                    y: clientRect.top + document.body.scrollTop,
                };
            if (this.dragThreshhold <= 0) {
                this.handleMouseMove(e);
            }
        };
        DragPositioner.prototype.handleMouseMove = function (e) {
            e.preventDefault();
            if (e.clientX === 0 && e.clientY === 0) {
                return;
            }
            if (!this.isDragging) {
                var deltaX = Math.abs(e.pageX - this.mouseDownPosition.x);
                var deltaY = Math.abs(e.pageY - this.mouseDownPosition.y);
                var delta = deltaX + deltaY;
                if (delta >= this.dragThreshhold) {
                    this.isDragging = true;
                    if (!this.preventAutoResize) {
                        this.position.width = this.ownerDOMNode.offsetWidth;
                        this.position.height = this.ownerDOMNode.offsetHeight;
                    }
                    if (this.shouldMakeClone || this.makeDragClone) {
                        if (!this.makeDragClone) {
                            var nextSibling = this.ownerDOMNode.nextSibling;
                            var clone = this.ownerDOMNode.cloneNode(true);
                            utility_1.recursiveRemoveAttribute(clone, "data-reactid");
                            if (!this.ownerDOMNode.parentNode) {
                                throw new Error("DragPositioner owner node has no parent.");
                            }
                            this.ownerDOMNode.parentNode.insertBefore(clone, nextSibling);
                            this.cloneElement = clone;
                        }
                        else {
                            var clone = this.makeDragClone();
                            utility_1.recursiveRemoveAttribute(clone, "data-reactid");
                            document.body.appendChild(clone);
                            this.cloneElement = clone;
                        }
                    }
                    var x = e.pageX - this.dragOffset.x;
                    var y = e.pageY - this.dragOffset.y;
                    this.owner.forceUpdate();
                    if (this.onDragStart) {
                        this.onDragStart(x, y);
                    }
                }
            }
            if (this.isDragging) {
                this.handleDrag(e);
            }
        };
        DragPositioner.prototype.handleDrag = function (e) {
            var domWidth;
            var domHeight;
            if (this.cloneElement) {
                domWidth = this.cloneElement.offsetWidth;
                domHeight = this.cloneElement.offsetHeight;
            }
            else {
                domWidth = this.ownerDOMNode.offsetWidth;
                domHeight = this.ownerDOMNode.offsetHeight;
            }
            var containerRect = this.getContainerRect();
            var minX = containerRect.left;
            var maxX = containerRect.right;
            var minY = containerRect.top;
            var maxY = containerRect.bottom;
            var x = e.pageX - this.dragOffset.x;
            var y = e.pageY - this.dragOffset.y;
            var x2 = x + domWidth;
            var y2 = y + domHeight;
            if (x < minX) {
                x = minX;
            }
            else if (x2 > maxX) {
                x = maxX - domWidth;
            }
            if (y < minY) {
                y = minY;
            }
            else if (y2 > maxY) {
                y = maxY - domHeight;
            }
            if (this.onDragMove) {
                this.onDragMove(x, y);
            }
            else {
                this.position.left = x;
                this.position.top = y;
                this.updateDOMNodeStyle();
            }
        };
        DragPositioner.prototype.handleMouseUp = function (e) {
            e.stopPropagation();
            e.preventDefault();
            this.mouseDownPosition =
                {
                    x: 0,
                    y: 0,
                };
            if (this.isDragging) {
                this.handleDragEnd();
            }
            this.removeEventListeners();
        };
        DragPositioner.prototype.handleDragEnd = function () {
            if (this.cloneElement) {
                if (this.cloneElement.parentNode) {
                    this.cloneElement.parentNode.removeChild(this.cloneElement);
                }
                this.cloneElement = null;
            }
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            this.originPosition = { x: 0, y: 0 };
            if (this.onDragEnd) {
                this.onDragEnd();
            }
            if (this.ownerIsMounted) {
                this.owner.forceUpdate();
            }
        };
        DragPositioner.prototype.getContainerRect = function () {
            return this.getContainingElement().getBoundingClientRect();
        };
        DragPositioner.prototype.handleNativeMoveEvent = function (e) {
            this.handleMouseMove(normalizeEvent_1.normalizeEvent(e));
        };
        DragPositioner.prototype.handleNativeUpEvent = function (e) {
            this.handleMouseUp(normalizeEvent_1.normalizeEvent(e));
        };
        DragPositioner.prototype.addEventListeners = function () {
            document.addEventListener("mousemove", this.handleNativeMoveEvent);
            document.addEventListener("mouseup", this.handleNativeUpEvent);
            if (this.touchEventTarget) {
                this.touchEventTarget.addEventListener("touchmove", this.handleNativeMoveEvent);
                this.touchEventTarget.addEventListener("touchend", this.handleNativeUpEvent);
            }
        };
        DragPositioner.prototype.removeEventListeners = function () {
            document.removeEventListener("mousemove", this.handleNativeMoveEvent);
            document.removeEventListener("mouseup", this.handleNativeUpEvent);
            if (this.touchEventTarget) {
                this.touchEventTarget.removeEventListener("touchmove", this.handleNativeMoveEvent);
                this.touchEventTarget.removeEventListener("touchend", this.handleNativeUpEvent);
                this.touchEventTarget = null;
            }
        };
        return DragPositioner;
    }());
    exports.DragPositioner = DragPositioner;
});
define("modules/defaultui/uicomponents/mixins/normalizeEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function normalizeMouseEvent(nativeEvent, reactEvent) {
        return ({
            wasTouchEvent: false,
            clientX: nativeEvent.clientX,
            clientY: nativeEvent.clientY,
            pageX: nativeEvent.pageX,
            pageY: nativeEvent.pageY,
            target: nativeEvent.target,
            button: nativeEvent.button,
            preventDefault: (reactEvent ?
                reactEvent.preventDefault.bind(reactEvent) :
                nativeEvent.preventDefault.bind(nativeEvent)),
            stopPropagation: (reactEvent ?
                reactEvent.stopPropagation.bind(reactEvent) :
                nativeEvent.stopPropagation.bind(nativeEvent)),
        });
    }
    function normalizeTouchEvent(nativeEvent, reactEvent) {
        var touch = nativeEvent.touches[0];
        return ({
            wasTouchEvent: true,
            clientX: touch.clientX,
            clientY: touch.clientY,
            pageX: touch.pageX,
            pageY: touch.pageY,
            target: touch.target,
            button: -1,
            preventDefault: (reactEvent ?
                reactEvent.preventDefault.bind(reactEvent) :
                nativeEvent.preventDefault.bind(nativeEvent)),
            stopPropagation: (reactEvent ?
                reactEvent.stopPropagation.bind(reactEvent) :
                nativeEvent.stopPropagation.bind(nativeEvent)),
        });
    }
    function normalizeEvent(sourceEvent) {
        var castedEvent = sourceEvent;
        var isReactEvent = Boolean(castedEvent.nativeEvent);
        var isTouchEvent = Boolean(castedEvent.touches);
        if (isTouchEvent) {
            if (isReactEvent) {
                return normalizeTouchEvent(castedEvent.nativeEvent, castedEvent);
            }
            else {
                return normalizeTouchEvent(sourceEvent);
            }
        }
        else {
            if (isReactEvent) {
                return normalizeMouseEvent(castedEvent.nativeEvent, castedEvent);
            }
            else {
                return normalizeMouseEvent(sourceEvent);
            }
        }
    }
    exports.normalizeEvent = normalizeEvent;
});
define("modules/defaultui/uicomponents/mixins/UpdateWhenMoneyChanges", ["require", "exports", "src/eventManager"], function (require, exports, eventManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UpdateWhenMoneyChanges = (function () {
        function UpdateWhenMoneyChanges(owner, onMoneyChange) {
            this.owner = owner;
            this.onMoneyChange = onMoneyChange;
            this.handleMoneyChange = this.handleMoneyChange.bind(this);
        }
        UpdateWhenMoneyChanges.prototype.componentDidMount = function () {
            eventManager_1.eventManager.addEventListener("playerMoneyUpdated", this.handleMoneyChange);
        };
        UpdateWhenMoneyChanges.prototype.componentWillUnmount = function () {
            eventManager_1.eventManager.removeEventListener("playerMoneyUpdated", this.handleMoneyChange);
        };
        UpdateWhenMoneyChanges.prototype.handleMoneyChange = function () {
            if (this.onMoneyChange) {
                this.onMoneyChange();
            }
            else {
                this.owner.setState({ money: this.owner.props.player.money });
            }
        };
        return UpdateWhenMoneyChanges;
    }());
    exports.UpdateWhenMoneyChanges = UpdateWhenMoneyChanges;
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/notifications/Notification", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NotificationComponent = (function (_super) {
        __extends(NotificationComponent, _super);
        function NotificationComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "Notification";
            _this.bindMethods();
            return _this;
        }
        NotificationComponent.prototype.bindMethods = function () {
            this.handleClick = this.handleClick.bind(this);
            this.handleClose = this.handleClose.bind(this);
            this.handleRightClick = this.handleRightClick.bind(this);
        };
        NotificationComponent.prototype.handleClose = function () {
            this.props.markAsRead(this.props.notification);
        };
        NotificationComponent.prototype.handleClick = function () {
            this.props.togglePopup(this.props.notification);
        };
        NotificationComponent.prototype.handleRightClick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.handleClose();
        };
        NotificationComponent.prototype.render = function () {
            var notification = this.props.notification;
            return (ReactDOMElements.li({
                className: "notification",
                onClick: this.handleClick,
                onContextMenu: this.handleRightClick,
                title: localize_1.localize("notificationToolTip")(),
            }, ReactDOMElements.img({
                className: "notification-image",
                src: notification.template.getIconSrc(),
            }), ReactDOMElements.span({
                className: "notification-message",
            }, notification.makeMessage())));
        };
        return NotificationComponent;
    }(React.Component));
    exports.NotificationComponent = NotificationComponent;
    exports.Notification = React.createFactory(NotificationComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/notifications/NotificationFilterButton", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/windows/DefaultWindow", "modules/defaultui/uicomponents/notifications/NotificationFilterList"], function (require, exports, React, ReactDOMElements, localize_1, DefaultWindow_1, NotificationFilterList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NotificationFilterButtonComponent = (function (_super) {
        __extends(NotificationFilterButtonComponent, _super);
        function NotificationFilterButtonComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "NotificationFilterButton";
            _this.state =
                {
                    hasNotificationFilterPopup: false,
                };
            _this.bindMethods();
            return _this;
        }
        NotificationFilterButtonComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "notification-filter-button-container",
            }, ReactDOMElements.button({
                className: "notification-filter-button",
                onClick: this.togglePopup,
            }, this.props.text), !this.state.hasNotificationFilterPopup ? null :
                DefaultWindow_1.DefaultWindow({
                    title: localize_1.localize("messageSettings")(),
                    handleClose: this.closePopup,
                }, NotificationFilterList_1.NotificationFilterList({
                    highlightedOptionKey: this.props.highlightedOptionKey,
                }))));
        };
        NotificationFilterButtonComponent.prototype.bindMethods = function () {
            this.openPopup = this.openPopup.bind(this);
            this.closePopup = this.closePopup.bind(this);
            this.togglePopup = this.togglePopup.bind(this);
        };
        NotificationFilterButtonComponent.prototype.openPopup = function () {
            this.setState({
                hasNotificationFilterPopup: true,
            });
        };
        NotificationFilterButtonComponent.prototype.closePopup = function () {
            this.setState({
                hasNotificationFilterPopup: false,
            });
        };
        NotificationFilterButtonComponent.prototype.togglePopup = function () {
            if (this.state.hasNotificationFilterPopup) {
                this.closePopup();
            }
            else {
                this.openPopup();
            }
        };
        return NotificationFilterButtonComponent;
    }(React.Component));
    exports.NotificationFilterButtonComponent = NotificationFilterButtonComponent;
    exports.NotificationFilterButton = React.createFactory(NotificationFilterButtonComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/notifications/NotificationFilterList", ["require", "exports", "react", "react-dom-factories", "src/notifications/NotificationFilter", "modules/defaultui/localization/localize", "src/eventManager", "modules/defaultui/uicomponents/options/OptionsGroup", "modules/defaultui/uicomponents/notifications/NotificationFilterListItem"], function (require, exports, React, ReactDOMElements, NotificationFilter_1, localize_1, eventManager_1, OptionsGroup_1, NotificationFilterListItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NotificationFilterListComponent = (function (_super) {
        __extends(NotificationFilterListComponent, _super);
        function NotificationFilterListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "NotificationFilterList";
            _this.bodyElement = React.createRef();
            _this.bindMethods();
            return _this;
        }
        Object.defineProperty(NotificationFilterListComponent, "defaultProps", {
            get: function () {
                return ({
                    filter: NotificationFilter_1.activeNotificationFilter,
                });
            },
            enumerable: true,
            configurable: true
        });
        NotificationFilterListComponent.prototype.bindMethods = function () {
            this.scrollToHighlighted = this.scrollToHighlighted.bind(this);
            this.handleResetCategory = this.handleResetCategory.bind(this);
        };
        NotificationFilterListComponent.prototype.handleResetCategory = function (category) {
            var filter = this.props.filter;
            filter.setDefaultFilterStatesForCategory(category);
            filter.save();
            this.forceUpdate();
            eventManager_1.eventManager.dispatchEvent("updateNotificationLog");
        };
        NotificationFilterListComponent.prototype.scrollToHighlighted = function () {
            if (this.props.highlightedOptionKey) {
                var highlightedNode = this.bodyElement.current.getElementsByClassName("highlighted")[0];
                this.bodyElement.current.scrollTop = highlightedNode.offsetTop - this.bodyElement.current.offsetHeight / 3;
            }
        };
        NotificationFilterListComponent.prototype.parentPopupDidMount = function () {
            this.scrollToHighlighted();
        };
        NotificationFilterListComponent.prototype.render = function () {
            var filter = this.props.filter;
            var filtersByCategory = filter.getFiltersByCategory();
            var filterGroupElements = [];
            for (var category in filtersByCategory) {
                var filtersForCategory = filtersByCategory[category];
                var filterElementsForCategory = [];
                for (var i = 0; i < filtersForCategory.length; i++) {
                    var notificationTemplate = filtersForCategory[i].notificationTemplate;
                    var isHighlighted = Boolean(this.props.highlightedOptionKey &&
                        this.props.highlightedOptionKey === notificationTemplate.key);
                    filterElementsForCategory.push({
                        key: notificationTemplate.key,
                        content: NotificationFilterListItem_1.NotificationFilterListItem({
                            displayName: notificationTemplate.displayName,
                            filter: filter,
                            initialFilterState: filtersForCategory[i].filterState,
                            keyTODO: notificationTemplate.key,
                            isHighlighted: isHighlighted,
                        }),
                    });
                }
                filterGroupElements.push(OptionsGroup_1.OptionsGroup({
                    headerTitle: category,
                    options: filterElementsForCategory,
                    key: category,
                    resetFN: this.handleResetCategory.bind(this, category),
                }));
            }
            return (ReactDOMElements.div({
                className: "notification-filter-list",
            }, ReactDOMElements.div({
                className: "notification-filter-list-header",
            }, ReactDOMElements.div({
                className: "notification-filter-list-item-label",
            }, localize_1.localize("show")()), ReactDOMElements.div({
                className: "notification-filter-list-item-filters",
            }, localize_1.localize("alwaysShow_short")(), localize_1.localize("showIfInvolved_short")(), localize_1.localize("neverShow_short")())), ReactDOMElements.div({
                className: "notification-filter-list-body",
                ref: this.bodyElement,
            }, filterGroupElements)));
        };
        return NotificationFilterListComponent;
    }(React.Component));
    exports.NotificationFilterListComponent = NotificationFilterListComponent;
    exports.NotificationFilterList = React.createFactory(NotificationFilterListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/notifications/NotificationFilterListItem", ["require", "exports", "react", "react-dom-factories", "src/notifications/NotificationFilterState", "src/eventManager"], function (require, exports, React, ReactDOMElements, NotificationFilterState_1, eventManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NotificationFilterListItemComponent = (function (_super) {
        __extends(NotificationFilterListItemComponent, _super);
        function NotificationFilterListItemComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "NotificationFilterListItem";
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        NotificationFilterListItemComponent.prototype.bindMethods = function () {
            this.handleChangeState = this.handleChangeState.bind(this);
        };
        NotificationFilterListItemComponent.prototype.getInitialStateTODO = function () {
            return ({
                filterState: this.props.initialFilterState,
            });
        };
        NotificationFilterListItemComponent.prototype.handleChangeState = function (state) {
            var filter = this.props.filter;
            filter.handleFilterStateChange(this.props.keyTODO, state);
            filter.save();
            this.setState({
                filterState: filter.filters[this.props.keyTODO],
            });
            eventManager_1.eventManager.dispatchEvent("updateNotificationLog");
        };
        NotificationFilterListItemComponent.prototype.render = function () {
            var inputElements = [];
            var filterState = this.state.filterState;
            for (var state in NotificationFilterState_1.NotificationFilterState) {
                var numericState = parseInt(state);
                if (!isFinite(numericState)) {
                    continue;
                }
                var stateIsActive = filterState.indexOf(numericState) !== -1;
                inputElements.push(ReactDOMElements.input({
                    className: "notification-filter-list-item-filter",
                    type: "checkbox",
                    id: this.props.keyTODO,
                    key: state,
                    checked: stateIsActive,
                    onChange: this.handleChangeState.bind(this, numericState),
                    title: NotificationFilterState_1.NotificationFilterState[numericState],
                }));
            }
            return (ReactDOMElements.div({
                className: "notification-filter-list-item" + (this.props.isHighlighted ? " highlighted" : ""),
            }, ReactDOMElements.label({
                className: "notification-filter-list-item-label",
                htmlFor: this.props.keyTODO,
            }, this.props.displayName), ReactDOMElements.div({
                className: "notification-filter-list-item-filters",
            }, inputElements)));
        };
        return NotificationFilterListItemComponent;
    }(React.Component));
    exports.NotificationFilterListItemComponent = NotificationFilterListItemComponent;
    exports.NotificationFilterListItem = React.createFactory(NotificationFilterListItemComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/notifications/NotificationLog", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/eventManager", "src/notifications/NotificationFilter", "modules/defaultui/uicomponents/windows/DialogBox", "modules/defaultui/uicomponents/notifications/Notification", "modules/defaultui/uicomponents/notifications/NotificationFilterButton"], function (require, exports, React, ReactDOMElements, localize_1, eventManager_1, NotificationFilter_1, DialogBox_1, Notification_1, NotificationFilterButton_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NotificationLogComponent = (function (_super) {
        __extends(NotificationLogComponent, _super);
        function NotificationLogComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "NotificationLog";
            _this.ownDOMNode = React.createRef();
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        Object.defineProperty(NotificationLogComponent, "defaultProps", {
            get: function () {
                return ({
                    notificationFilter: NotificationFilter_1.activeNotificationFilter,
                });
            },
            enumerable: true,
            configurable: true
        });
        NotificationLogComponent.prototype.componentDidMount = function () {
            this.updateListener = eventManager_1.eventManager.addEventListener("updateNotificationLog", this.forceUpdate.bind(this));
        };
        NotificationLogComponent.prototype.componentWillUnmount = function () {
            eventManager_1.eventManager.removeEventListener("updateNotificationLog", this.updateListener);
        };
        NotificationLogComponent.prototype.componentDidUpdate = function () {
            var domNode = this.ownDOMNode.current;
            domNode.scrollTop = domNode.scrollHeight;
        };
        NotificationLogComponent.prototype.render = function () {
            var _this = this;
            var log = this.props.notificationLog;
            var notifications = log.unreadNotifications.filter(function (notification) {
                return _this.props.notificationFilter.shouldDisplayNotification(notification);
            });
            var items = [];
            for (var i = 0; i < notifications.length; i++) {
                items.push(Notification_1.Notification({
                    notification: notifications[i],
                    key: this.getNotificationKey(notifications[i]),
                    markAsRead: this.handleMarkAsRead,
                    togglePopup: this.togglePopup,
                }));
            }
            return (ReactDOMElements.div({
                className: "notification-log-container",
                ref: this.ownDOMNode,
            }, ReactDOMElements.ol({
                className: "notification-log",
            }, items.reverse()), this.state.notificationsWithActivePopup.map(function (notification) {
                return DialogBox_1.DialogBox({
                    key: _this.getNotificationKey(notification),
                    title: notification.getTitle(),
                    handleOk: function () {
                        _this.handleMarkAsRead(notification);
                        _this.closePopup(notification);
                    },
                    handleCancel: function () {
                        _this.closePopup(notification);
                    },
                    okText: localize_1.localize("markAsRead")(),
                    cancelText: localize_1.localize("close")(),
                    extraButtons: [
                        NotificationFilterButton_1.NotificationFilterButton({
                            key: "notificationFilter",
                            text: localize_1.localize("notificationFilterButton")(),
                            highlightedOptionKey: notification.template.key,
                        }),
                    ],
                }, notification.template.contentConstructor({
                    notification: notification,
                }));
            })));
        };
        NotificationLogComponent.prototype.bindMethods = function () {
            this.closePopup = this.closePopup.bind(this);
            this.getNotificationKey = this.getNotificationKey.bind(this);
            this.handleMarkAsRead = this.handleMarkAsRead.bind(this);
            this.togglePopup = this.togglePopup.bind(this);
        };
        NotificationLogComponent.prototype.getInitialStateTODO = function () {
            return ({
                notificationsWithActivePopup: [],
            });
        };
        NotificationLogComponent.prototype.getNotificationKey = function (notification) {
            return "" + notification.id;
        };
        NotificationLogComponent.prototype.handleMarkAsRead = function (notification) {
            this.props.notificationLog.markNotificationAsRead(notification);
            if (this.hasPopup(notification)) {
                this.closePopup(notification);
            }
            else {
                this.forceUpdate();
            }
        };
        NotificationLogComponent.prototype.openPopup = function (notification) {
            this.setState({
                notificationsWithActivePopup: this.state.notificationsWithActivePopup.concat(notification),
            });
        };
        NotificationLogComponent.prototype.closePopup = function (notificationToRemove) {
            this.setState({
                notificationsWithActivePopup: this.state.notificationsWithActivePopup.filter(function (notification) {
                    return notification !== notificationToRemove;
                }),
            });
        };
        NotificationLogComponent.prototype.hasPopup = function (notification) {
            return this.state.notificationsWithActivePopup.indexOf(notification) >= 0;
        };
        NotificationLogComponent.prototype.togglePopup = function (notification) {
            if (this.hasPopup(notification)) {
                this.closePopup(notification);
            }
            else {
                this.openPopup(notification);
            }
        };
        return NotificationLogComponent;
    }(React.PureComponent));
    exports.NotificationLogComponent = NotificationLogComponent;
    exports.NotificationLog = React.createFactory(NotificationLogComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/options/BattleOptions", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/Options", "modules/defaultui/uicomponents/options/OptionsGroup", "modules/defaultui/uicomponents/options/OptionsNumericField"], function (require, exports, React, ReactDOMElements, localize_1, Options_1, OptionsGroup_1, OptionsNumericField_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getBattleAnimationStages() {
        return ([
            {
                key: "before",
                displayName: localize_1.localize("beforeAbility")(),
                min: 0,
                max: 5000,
                step: 100,
            },
            {
                key: "effectDuration",
                displayName: localize_1.localize("abilityEffectDuration")(),
                min: 0,
                max: 10,
                step: 0.1,
            },
            {
                key: "after",
                displayName: localize_1.localize("afterAbility")(),
                min: 0,
                max: 5000,
                step: 100,
            },
            {
                key: "unitEnter",
                displayName: localize_1.localize("unitEnter")(),
                min: 0,
                max: 1000,
                step: 50,
            },
            {
                key: "unitExit",
                displayName: localize_1.localize("unitExit")(),
                min: 0,
                max: 1000,
                step: 50,
            },
            {
                key: "turnTransition",
                displayName: localize_1.localize("turnTransition")(),
                min: 0,
                max: 2000,
                step: 100,
            },
        ]);
    }
    var BattleOptionsComponent = (function (_super) {
        __extends(BattleOptionsComponent, _super);
        function BattleOptionsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "BattleOptions";
            return _this;
        }
        BattleOptionsComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "battle-options",
            }, OptionsGroup_1.OptionsGroup({
                headerTitle: localize_1.localize("battleAnimationTiming")(),
                options: getBattleAnimationStages().map(function (stage) {
                    var key = stage.key;
                    return ({
                        key: stage.key,
                        content: OptionsNumericField_1.OptionsNumericField({
                            label: stage.displayName,
                            id: "options-battle-animation-" + key,
                            value: Options_1.options.battle.animationTiming[key],
                            min: stage.min,
                            max: stage.max,
                            step: stage.step,
                            onChange: function (value) {
                                Options_1.options.battle.animationTiming[key] = value;
                                _this.forceUpdate();
                            },
                        }),
                    });
                }),
                resetFN: function () {
                    Options_1.options.setDefaultForCategory("battle.animationTiming");
                    _this.forceUpdate();
                },
            })));
        };
        return BattleOptionsComponent;
    }(React.Component));
    exports.BattleOptionsComponent = BattleOptionsComponent;
    exports.BattleOptions = React.createFactory(BattleOptionsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/options/DebugOptions", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/eventManager", "src/Options", "modules/defaultui/uicomponents/options/OptionsGroup", "modules/defaultui/uicomponents/options/OptionsNumericField", "modules/defaultui/uicomponents/options/OptionsCheckbox"], function (require, exports, React, ReactDOMElements, localize_1, eventManager_1, Options_1, OptionsGroup_1, OptionsNumericField_1, OptionsCheckbox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DebugOptionsComponent = (function (_super) {
        __extends(DebugOptionsComponent, _super);
        function DebugOptionsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "DebugOptions";
            return _this;
        }
        DebugOptionsComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "debug-options"
            }, OptionsGroup_1.OptionsGroup({
                headerTitle: localize_1.localize("debug")(),
                options: this.getDebugOptions(),
                resetFN: function () {
                    Options_1.options.setDefaultForCategory("debug");
                    _this.forceUpdate();
                },
            }), !Options_1.options.debug.enabled ? null : OptionsGroup_1.OptionsGroup({
                key: "loggingOptions",
                headerTitle: localize_1.localize("logging")(),
                options: this.getLoggingOptions(),
                resetFN: function () {
                    Options_1.options.setDefaultForCategory("debug.logging");
                    _this.forceUpdate();
                },
            })));
        };
        DebugOptionsComponent.prototype.getDebugOptions = function () {
            var allOptions = this.getAlwaysVisibleDebugOptions();
            if (Options_1.options.debug.enabled) {
                allOptions.push.apply(allOptions, this.getDebugModeOnlyDebugOptions());
            }
            return allOptions;
        };
        DebugOptionsComponent.prototype.getAlwaysVisibleDebugOptions = function () {
            var _this = this;
            return ([
                {
                    key: "debugMode",
                    content: OptionsCheckbox_1.OptionsCheckbox({
                        isChecked: Options_1.options.debug.enabled,
                        label: localize_1.localize("debugMode")(),
                        onChangeFN: function () {
                            Options_1.options.debug.enabled = !Options_1.options.debug.enabled;
                            _this.forceUpdate();
                            eventManager_1.eventManager.dispatchEvent("renderUI");
                        },
                    }),
                }
            ]);
        };
        DebugOptionsComponent.prototype.getDebugModeOnlyDebugOptions = function () {
            var _this = this;
            return ([
                {
                    key: "aiVsAiBattleSimulationDepth",
                    content: OptionsNumericField_1.OptionsNumericField({
                        label: localize_1.localize("aiVsAiBattleSimulationDepth")(),
                        id: "ai-battle-simulation-depth-input",
                        value: Options_1.options.debug.aiVsAiBattleSimulationDepth,
                        min: 1,
                        max: 500,
                        step: 1,
                        onChange: function (value) {
                            Options_1.options.debug.aiVsAiBattleSimulationDepth = value;
                            _this.forceUpdate();
                        },
                    }),
                },
                {
                    key: "aiVsPlayerBattleSimulationDepth",
                    content: OptionsNumericField_1.OptionsNumericField({
                        label: localize_1.localize("aiVsPlayerBattleSimulationDepth")(),
                        id: "player-battle-simulation-depth-input",
                        value: Options_1.options.debug.aiVsPlayerBattleSimulationDepth,
                        min: 1,
                        max: 10000,
                        step: 1,
                        onChange: function (value) {
                            Options_1.options.debug.aiVsPlayerBattleSimulationDepth = value;
                            _this.forceUpdate();
                        },
                    }),
                },
            ]);
        };
        DebugOptionsComponent.prototype.getLoggingOptions = function () {
            var _this = this;
            return Object.keys(Options_1.options.debug.logging).map(function (category) {
                var keyForCategory = {
                    ai: "aiLogging",
                    graphics: "graphicsLogging",
                    saves: "savesLogging",
                    modules: "modulesLogging",
                    init: "initLogging",
                };
                var key = keyForCategory[category];
                return ({
                    key: key,
                    content: OptionsCheckbox_1.OptionsCheckbox({
                        isChecked: Options_1.options.debug.logging[category],
                        label: localize_1.localize(key)(),
                        onChangeFN: function () {
                            Options_1.options.debug.logging[category] = !Options_1.options.debug.logging[category];
                            _this.forceUpdate();
                        },
                    }),
                });
            });
        };
        return DebugOptionsComponent;
    }(React.Component));
    exports.DebugOptionsComponent = DebugOptionsComponent;
    exports.DebugOptions = React.createFactory(DebugOptionsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/options/DisplayOptions", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/eventManager", "src/Options", "modules/defaultui/uicomponents/options/OptionsGroup", "modules/defaultui/uicomponents/options/OptionsCheckbox", "modules/defaultui/uicomponents/notifications/NotificationFilterButton", "src/tutorials/TutorialStatus", "modules/defaultui/uicomponents/language/AppLanguageSelect"], function (require, exports, React, ReactDOMElements, localize_1, eventManager_1, Options_1, OptionsGroup_1, OptionsCheckbox_1, NotificationFilterButton_1, TutorialStatus_1, AppLanguageSelect_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DisplayOptionsComponent = (function (_super) {
        __extends(DisplayOptionsComponent, _super);
        function DisplayOptionsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "DisplayOptions";
            return _this;
        }
        DisplayOptionsComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "display-options",
            }, OptionsGroup_1.OptionsGroup({
                key: "language",
                headerTitle: localize_1.localize("language")(),
                options: [
                    {
                        key: "selectAppLanguage",
                        content: AppLanguageSelect_1.AppLanguageSelect({
                            activeLanguage: this.props.activeLanguage,
                        }),
                    }
                ],
            }), OptionsGroup_1.OptionsGroup({
                key: "ui",
                headerTitle: localize_1.localize("ui")(),
                options: this.getUIOptions(),
                resetFN: function () {
                    Options_1.options.setDefaultForCategory("display");
                    _this.forceUpdate();
                },
            })));
        };
        DisplayOptionsComponent.prototype.getUIOptions = function () {
            var _this = this;
            return ([
                {
                    key: "noHamburger",
                    content: OptionsCheckbox_1.OptionsCheckbox({
                        isChecked: Options_1.options.display.noHamburger,
                        label: localize_1.localize("alwaysExpandTopRightMenuOnLowResolution")(),
                        onChangeFN: function () {
                            Options_1.options.display.noHamburger = !Options_1.options.display.noHamburger;
                            eventManager_1.eventManager.dispatchEvent("updateHamburgerMenu");
                            _this.forceUpdate();
                        },
                    }),
                },
                {
                    key: "notificationLogFilter",
                    content: NotificationFilterButton_1.NotificationFilterButton({
                        text: localize_1.localize("messageSettings")(),
                        highlightedOptionKey: null,
                    }),
                },
                {
                    key: "resetTutorials",
                    content: ReactDOMElements.button({
                        className: "reset-tutorials-button",
                        onClick: TutorialStatus_1.tutorialStatus.reset,
                    }, localize_1.localize("resetTutorials")()),
                }
            ]);
        };
        return DisplayOptionsComponent;
    }(React.Component));
    exports.DisplayOptionsComponent = DisplayOptionsComponent;
    exports.DisplayOptions = React.createFactory(DisplayOptionsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/options/FullOptionsList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/Options", "modules/defaultui/uicomponents/windows/DialogBox", "modules/defaultui/uicomponents/options/BattleOptions", "modules/defaultui/uicomponents/options/DebugOptions", "modules/defaultui/uicomponents/options/DisplayOptions", "modules/defaultui/uicomponents/options/SystemOptions"], function (require, exports, React, ReactDOMElements, localize_1, Options_1, DialogBox_1, BattleOptions_1, DebugOptions_1, DisplayOptions_1, SystemOptions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FullOptionsListComponent = (function (_super) {
        __extends(FullOptionsListComponent, _super);
        function FullOptionsListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "FullOptionsList";
            _this.state =
                {
                    hasConfirmResetAllDialog: false,
                };
            _this.bindMethods();
            return _this;
        }
        FullOptionsListComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({ className: "options" }, !this.state.hasConfirmResetAllDialog ? null :
                DialogBox_1.DialogBox({
                    title: localize_1.localize("resetAllOptions")(),
                    handleOk: function () {
                        Options_1.options.setDefaults();
                        _this.closeResetAllOptionsDialog();
                    },
                    handleCancel: function () {
                        _this.closeResetAllOptionsDialog();
                    },
                }, localize_1.localize("areYouSureYouWantToResetAllOptions")()), ReactDOMElements.div({ className: "options-header" }, ReactDOMElements.button({
                className: "reset-options-button reset-all-options-button",
                onClick: this.openResetAllOptionsDialog,
            }, localize_1.localize("resetAllOptions")())), DisplayOptions_1.DisplayOptions({ activeLanguage: this.props.activeLanguage }), BattleOptions_1.BattleOptions(), SystemOptions_1.SystemOptions(), DebugOptions_1.DebugOptions()));
        };
        FullOptionsListComponent.prototype.bindMethods = function () {
            this.openResetAllOptionsDialog = this.openResetAllOptionsDialog.bind(this);
            this.closeResetAllOptionsDialog = this.closeResetAllOptionsDialog.bind(this);
        };
        FullOptionsListComponent.prototype.openResetAllOptionsDialog = function () {
            this.setState({
                hasConfirmResetAllDialog: true,
            });
        };
        FullOptionsListComponent.prototype.closeResetAllOptionsDialog = function () {
            this.setState({
                hasConfirmResetAllDialog: false,
            });
        };
        return FullOptionsListComponent;
    }(React.Component));
    exports.FullOptionsListComponent = FullOptionsListComponent;
    exports.FullOptionsList = React.createFactory(FullOptionsListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/options/OptionsCheckbox", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OptionsCheckboxComponent = (function (_super) {
        __extends(OptionsCheckboxComponent, _super);
        function OptionsCheckboxComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "OptionsCheckbox";
            return _this;
        }
        OptionsCheckboxComponent.prototype.render = function () {
            var checkboxId = "options-checkbox-" + this.props.label;
            return (ReactDOMElements.div({
                className: "options-checkbox-container",
            }, ReactDOMElements.input({
                type: "checkbox",
                id: checkboxId,
                checked: this.props.isChecked,
                onChange: this.props.onChangeFN,
            }), ReactDOMElements.label({
                htmlFor: checkboxId,
            }, this.props.label)));
        };
        return OptionsCheckboxComponent;
    }(React.Component));
    exports.OptionsCheckboxComponent = OptionsCheckboxComponent;
    exports.OptionsCheckbox = React.createFactory(OptionsCheckboxComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/options/OptionsGroup", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/generic/Collapsible"], function (require, exports, React, ReactDOMElements, localize_1, Collapsible_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OptionsGroupComponent = (function (_super) {
        __extends(OptionsGroupComponent, _super);
        function OptionsGroupComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "OptionsGroup";
            return _this;
        }
        OptionsGroupComponent.prototype.render = function () {
            var resetButton = !this.props.resetFN ?
                null :
                ReactDOMElements.button({
                    className: "reset-options-button",
                    onClick: this.props.resetFN,
                }, localize_1.localize("reset")());
            return (ReactDOMElements.div({
                className: "option-group",
            }, Collapsible_1.Collapsible({
                isCollapsedInitially: this.props.isCollapsedInitially,
                title: this.props.headerTitle,
                additionalHeaderContent: resetButton,
            }, this.props.options.map(function (option) {
                return ReactDOMElements.div({
                    className: "option-container",
                    key: option.key,
                }, option.content);
            }))));
        };
        return OptionsGroupComponent;
    }(React.Component));
    exports.OptionsGroupComponent = OptionsGroupComponent;
    exports.OptionsGroup = React.createFactory(OptionsGroupComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/options/OptionsNumericField", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/generic/NumberInput"], function (require, exports, React, ReactDOMElements, NumberInput_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OptionsNumericFieldComponent = (function (_super) {
        __extends(OptionsNumericFieldComponent, _super);
        function OptionsNumericFieldComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "OptionsNumericField";
            return _this;
        }
        OptionsNumericFieldComponent.prototype.render = function () {
            var inputId = "" + this.props.id + "-input";
            return (ReactDOMElements.div({
                className: "options-numeric-field-container",
                id: this.props.id,
            }, NumberInput_1.NumberInput({
                attributes: {
                    className: "options-numeric-field-input",
                    id: inputId,
                },
                value: this.props.value,
                onChange: this.props.onChange,
                min: this.props.min,
                max: this.props.max,
                step: this.props.step,
            }), ReactDOMElements.label({
                className: "options-numeric-field-label",
                htmlFor: inputId,
            }, this.props.label)));
        };
        return OptionsNumericFieldComponent;
    }(React.Component));
    exports.OptionsNumericFieldComponent = OptionsNumericFieldComponent;
    exports.OptionsNumericField = React.createFactory(OptionsNumericFieldComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/options/SystemOptions", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/Options", "modules/defaultui/uicomponents/options/OptionsGroup", "src/handleError"], function (require, exports, React, ReactDOMElements, localize_1, Options_1, OptionsGroup_1, handleError_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var localizationKeyForErrorReportingMode = {
        ignore: "errorReportingMode_ignore",
        panic: "errorReportingMode_panic",
        alertOnce: "errorReportingMode_alert",
    };
    var localizationKeyForErrorReportingModeDescription = {
        ignore: "errorReportingModeDescription_ignore",
        panic: "errorReportingModeDescription_panic",
        alertOnce: "errorReportingModeDescription_alert",
    };
    var SystemOptionsComponent = (function (_super) {
        __extends(SystemOptionsComponent, _super);
        function SystemOptionsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "SystemOptions";
            return _this;
        }
        SystemOptionsComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "system-options"
            }, OptionsGroup_1.OptionsGroup({
                headerTitle: localize_1.localize("system")(),
                options: this.getOptions(),
                resetFN: function () {
                    Options_1.options.setDefaultForCategory("system");
                    _this.forceUpdate();
                },
            })));
        };
        SystemOptionsComponent.prototype.getOptions = function () {
            var _this = this;
            return ([
                {
                    key: "errorReporting",
                    content: ReactDOMElements.div({
                        className: "error-reporting-mode",
                    }, ReactDOMElements.select({
                        className: "error-reporting-mode-select",
                        id: "system-options-error-reporting-mode-select",
                        value: Options_1.options.system.errorReporting,
                        title: localize_1.localize(localizationKeyForErrorReportingModeDescription[Options_1.options.system.errorReporting])(),
                        onChange: function (e) {
                            var target = e.currentTarget;
                            var selectedMode = target.value;
                            Options_1.options.system.errorReporting = selectedMode;
                            _this.forceUpdate();
                        }
                    }, handleError_1.errorReportingModes.map(function (mode) { return ReactDOMElements.option({
                        className: "error-reporting-mode-select-item",
                        value: mode,
                        key: mode,
                        title: localize_1.localize(localizationKeyForErrorReportingModeDescription[mode])(),
                    }, localize_1.localize(localizationKeyForErrorReportingMode[mode])()); })), ReactDOMElements.label({
                        className: "error-reporting-mode-select-label",
                        htmlFor: "system-options-error-reporting-mode-select",
                    }, localize_1.localize("errorReportingMode")())),
                },
            ]);
        };
        return SystemOptionsComponent;
    }(React.Component));
    exports.SystemOptionsComponent = SystemOptionsComponent;
    exports.SystemOptions = React.createFactory(SystemOptionsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/PlayerFlag", ["require", "exports", "react", "react-dom-factories", "src/utility"], function (require, exports, React, ReactDOMElements, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlayerFlagComponent = (function (_super) {
        __extends(PlayerFlagComponent, _super);
        function PlayerFlagComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "PlayerFlag";
            _this.containerElement = React.createRef();
            return _this;
        }
        PlayerFlagComponent.prototype.componentDidMount = function () {
            this.renderFlagElement();
        };
        PlayerFlagComponent.prototype.componentDidUpdate = function () {
            this.renderFlagElement();
        };
        PlayerFlagComponent.prototype.render = function () {
            var props = utility_1.shallowExtend(this.props.props, {
                ref: this.containerElement,
            });
            return (ReactDOMElements.div(props, null));
        };
        PlayerFlagComponent.prototype.renderFlagElement = function () {
            var containerNode = this.containerElement.current;
            if (containerNode.firstChild) {
                containerNode.removeChild(containerNode.firstChild);
            }
            var flagElement = this.props.flag.draw();
            flagElement.classList.add("player-flag");
            containerNode.appendChild(flagElement);
            if (this.props.onUpdate) {
                this.props.onUpdate(flagElement);
            }
        };
        return PlayerFlagComponent;
    }(React.PureComponent));
    exports.PlayerFlagComponent = PlayerFlagComponent;
    exports.PlayerFlag = React.createFactory(PlayerFlagComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/possibleactions/AttackTarget", ["require", "exports", "react", "react-dom-factories", "src/eventManager", "modules/defaultui/uicomponents/PlayerFlag", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, eventManager_1, PlayerFlag_1, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AttackTargetComponent = (function (_super) {
        __extends(AttackTargetComponent, _super);
        function AttackTargetComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "AttackTarget";
            _this.bindMethods();
            return _this;
        }
        AttackTargetComponent.prototype.bindMethods = function () {
            this.handleAttack = this.handleAttack.bind(this);
        };
        AttackTargetComponent.prototype.handleAttack = function () {
            eventManager_1.eventManager.dispatchEvent("attackTarget", this.props.attackTarget);
        };
        AttackTargetComponent.prototype.render = function () {
            var target = this.props.attackTarget;
            return (ReactDOMElements.button({
                className: "attack-target-button possible-action",
                onClick: this.handleAttack,
                title: localize_1.localize("attackTargetTooltip")({
                    enemyName: target.enemy.name.getPossessive(),
                    targetType: target.type,
                }),
            }, ReactDOMElements.span({
                className: "possible-action-title",
            }, localize_1.localize("attackTarget_action")()), PlayerFlag_1.PlayerFlag({
                flag: target.enemy.flag,
                props: {
                    className: "attack-target-player-flag",
                },
            })));
        };
        return AttackTargetComponent;
    }(React.Component));
    exports.AttackTargetComponent = AttackTargetComponent;
    exports.AttackTarget = React.createFactory(AttackTargetComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/possibleactions/BuildableBuilding", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/mixins/UpdateWhenMoneyChanges", "modules/defaultui/uicomponents/mixins/applyMixins"], function (require, exports, React, ReactDOMElements, UpdateWhenMoneyChanges_1, applyMixins_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BuildableBuildingComponent = (function (_super) {
        __extends(BuildableBuildingComponent, _super);
        function BuildableBuildingComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "BuildableBuilding";
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            applyMixins_1.applyMixins(_this, new UpdateWhenMoneyChanges_1.UpdateWhenMoneyChanges(_this, _this.overrideHandleMoneyChange));
            return _this;
        }
        BuildableBuildingComponent.prototype.bindMethods = function () {
            this.overrideHandleMoneyChange = this.overrideHandleMoneyChange.bind(this);
            this.makeCell = this.makeCell.bind(this);
        };
        BuildableBuildingComponent.prototype.getInitialStateTODO = function () {
            return ({
                canAfford: this.props.player.money >= this.props.buildCost,
            });
        };
        BuildableBuildingComponent.prototype.overrideHandleMoneyChange = function () {
            this.setState({
                canAfford: this.props.player.money >= this.props.buildCost,
            });
        };
        BuildableBuildingComponent.prototype.makeCell = function (type) {
            var cellProps = {};
            cellProps.key = type;
            cellProps.className = "buildable-building-list-item-cell " + type;
            var cellContent;
            switch (type) {
                case "buildCost":
                    {
                        cellContent = this.props.buildCost;
                        if (!this.state.canAfford) {
                            cellProps.className += " negative";
                        }
                        break;
                    }
                case "typeName":
                    {
                        cellContent = this.props.typeName;
                        break;
                    }
            }
            return (ReactDOMElements.td(cellProps, cellContent));
        };
        BuildableBuildingComponent.prototype.render = function () {
            var template = this.props.template;
            var cells = [];
            var columns = this.props.activeColumns;
            for (var i = 0; i < columns.length; i++) {
                cells.push(this.makeCell(columns[i].key));
            }
            var props = {
                className: "buildable-item buildable-building",
                onClick: this.props.handleClick,
                title: template.description,
            };
            if (!this.state.canAfford) {
                props.onClick = undefined;
                props.className += " disabled";
            }
            return (ReactDOMElements.tr(props, cells));
        };
        return BuildableBuildingComponent;
    }(React.Component));
    exports.BuildableBuildingComponent = BuildableBuildingComponent;
    exports.BuildableBuilding = React.createFactory(BuildableBuildingComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/possibleactions/BuildableBuildingList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/list/List", "modules/defaultui/uicomponents/possibleactions/BuildableBuilding"], function (require, exports, React, ReactDOMElements, localize_1, List_1, BuildableBuilding_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BuildableBuildingListComponent = (function (_super) {
        __extends(BuildableBuildingListComponent, _super);
        function BuildableBuildingListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "BuildableBuildingList";
            _this.state = {};
            _this.bindMethods();
            return _this;
        }
        BuildableBuildingListComponent.prototype.bindMethods = function () {
            this.buildBuilding = this.buildBuilding.bind(this);
        };
        BuildableBuildingListComponent.prototype.buildBuilding = function (rowItem) {
            var template = rowItem.content.props.template;
            this.props.player.buildBuilding(template, this.props.star);
            this.forceUpdate();
        };
        BuildableBuildingListComponent.prototype.render = function () {
            var buildableBuildings = this.props.buildableBuildings;
            var rows = [];
            for (var i = 0; i < buildableBuildings.length; i++) {
                var template = buildableBuildings[i];
                rows.push({
                    key: template.type,
                    content: BuildableBuilding_1.BuildableBuilding({
                        template: template,
                        typeName: template.displayName,
                        buildCost: template.buildCost,
                        player: this.props.player,
                    }),
                });
            }
            var columns = [
                {
                    label: localize_1.localize("buildingTypeName")(),
                    key: "typeName",
                    defaultOrder: "asc",
                },
                {
                    label: localize_1.localize("buildingCost")(),
                    key: "buildCost",
                    defaultOrder: "desc",
                },
            ];
            return (ReactDOMElements.div({ className: "buildable-item-list buildable-building-list fixed-table-parent" }, List_1.List({
                listItems: rows,
                initialColumns: columns,
                onRowChange: this.buildBuilding,
                addSpacer: true,
            })));
        };
        return BuildableBuildingListComponent;
    }(React.Component));
    exports.BuildableBuildingListComponent = BuildableBuildingListComponent;
    exports.BuildableBuildingList = React.createFactory(BuildableBuildingListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/possibleactions/BuildingUpgradeList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/possibleactions/BuildingUpgradeListItem"], function (require, exports, React, ReactDOMElements, BuildingUpgradeListItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BuildingUpgradeListComponent = (function (_super) {
        __extends(BuildingUpgradeListComponent, _super);
        function BuildingUpgradeListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "BuildingUpgradeList";
            _this.bindMethods();
            return _this;
        }
        BuildingUpgradeListComponent.prototype.bindMethods = function () {
            this.hasAvailableUpgrades = this.hasAvailableUpgrades.bind(this);
            this.upgradeBuilding = this.upgradeBuilding.bind(this);
        };
        BuildingUpgradeListComponent.prototype.hasAvailableUpgrades = function () {
            var possibleUpgrades = this.props.star.getBuildingUpgrades();
            return Object.keys(possibleUpgrades).length > 0;
        };
        BuildingUpgradeListComponent.prototype.upgradeBuilding = function (upgradeData) {
            this.props.player.upgradeBuilding(upgradeData);
            this.forceUpdate();
        };
        BuildingUpgradeListComponent.prototype.render = function () {
            var _this = this;
            var upgradeGroups = [];
            var sortedParentBuildings = Object.keys(this.props.buildingUpgrades).sort(function (aId, bId) {
                var a = _this.props.buildingUpgrades[aId][0].parentBuilding.template.displayName;
                var b = _this.props.buildingUpgrades[bId][0].parentBuilding.template.displayName;
                if (a < b) {
                    return -1;
                }
                else if (a > b) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            for (var i = 0; i < sortedParentBuildings.length; i++) {
                var parentBuildingId = sortedParentBuildings[i];
                var upgrades = this.props.buildingUpgrades[parentBuildingId];
                var parentBuilding = upgrades[0].parentBuilding;
                var upgradeElements = [];
                for (var j = 0; j < upgrades.length; j++) {
                    if (j > 0) {
                        upgradeElements.push(ReactDOMElements.tr({
                            className: "list-spacer",
                            key: "spacer" + i + j,
                        }, ReactDOMElements.td({
                            colSpan: 20,
                        }, null)));
                    }
                    upgradeElements.push(BuildingUpgradeListItem_1.BuildingUpgradeListItem({
                        key: upgrades[j].template.type,
                        player: this.props.player,
                        handleUpgrade: this.upgradeBuilding,
                        upgradeData: upgrades[j],
                    }));
                }
                var parentElement = ReactDOMElements.div({
                    key: "" + parentBuilding.id,
                    className: "building-upgrade-group",
                }, ReactDOMElements.div({
                    className: "building-upgrade-group-header",
                }, parentBuilding.template.displayName), ReactDOMElements.table({
                    className: "buildable-item-list",
                }, ReactDOMElements.tbody({}, upgradeElements)));
                upgradeGroups.push(parentElement);
            }
            return (ReactDOMElements.ul({
                className: "building-upgrade-list",
            }, upgradeGroups));
        };
        return BuildingUpgradeListComponent;
    }(React.Component));
    exports.BuildingUpgradeListComponent = BuildingUpgradeListComponent;
    exports.BuildingUpgradeList = React.createFactory(BuildingUpgradeListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/possibleactions/BuildingUpgradeListItem", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/mixins/UpdateWhenMoneyChanges", "modules/defaultui/uicomponents/mixins/applyMixins"], function (require, exports, React, ReactDOMElements, UpdateWhenMoneyChanges_1, applyMixins_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BuildingUpgradeListItemComponent = (function (_super) {
        __extends(BuildingUpgradeListItemComponent, _super);
        function BuildingUpgradeListItemComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "BuildingUpgradeListItem";
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            applyMixins_1.applyMixins(_this, new UpdateWhenMoneyChanges_1.UpdateWhenMoneyChanges(_this, _this.overrideHandleMoneyChange));
            return _this;
        }
        BuildingUpgradeListItemComponent.prototype.bindMethods = function () {
            this.handleClick = this.handleClick.bind(this);
            this.overrideHandleMoneyChange = this.overrideHandleMoneyChange.bind(this);
        };
        BuildingUpgradeListItemComponent.prototype.getInitialStateTODO = function () {
            return ({
                canAfford: this.props.player.money >= this.props.upgradeData.cost,
            });
        };
        BuildingUpgradeListItemComponent.prototype.overrideHandleMoneyChange = function () {
            this.setState({
                canAfford: this.props.player.money >= this.props.upgradeData.cost,
            });
        };
        BuildingUpgradeListItemComponent.prototype.handleClick = function () {
            this.props.handleUpgrade(this.props.upgradeData);
        };
        BuildingUpgradeListItemComponent.prototype.render = function () {
            var upgradeData = this.props.upgradeData;
            var rowProps = {
                key: upgradeData.template.type,
                className: "building-upgrade-list-item",
                onClick: this.handleClick,
                title: upgradeData.template.description,
            };
            var costProps = {
                key: "cost",
                className: "building-upgrade-list-item-cost",
            };
            if (!this.state.canAfford) {
                rowProps.onClick = undefined;
                rowProps.disabled = true;
                rowProps.className += " disabled";
                costProps.className += " negative";
            }
            return (ReactDOMElements.tr(rowProps, ReactDOMElements.td({
                key: "name",
                className: "building-upgrade-list-item-name",
            }, upgradeData.template.displayName), ReactDOMElements.td(costProps, upgradeData.cost)));
        };
        return BuildingUpgradeListItemComponent;
    }(React.Component));
    exports.BuildingUpgradeListItemComponent = BuildingUpgradeListItemComponent;
    exports.BuildingUpgradeListItem = React.createFactory(BuildingUpgradeListItemComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/possibleactions/ExpandedAction", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/possibleactions/BuildableBuildingList", "modules/defaultui/uicomponents/possibleactions/BuildingUpgradeList"], function (require, exports, React, ReactDOMElements, BuildableBuildingList_1, BuildingUpgradeList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExpandedActionKind;
    (function (ExpandedActionKind) {
        ExpandedActionKind[ExpandedActionKind["None"] = 0] = "None";
        ExpandedActionKind[ExpandedActionKind["BuildBuildings"] = 1] = "BuildBuildings";
        ExpandedActionKind[ExpandedActionKind["UpgradeBuildings"] = 2] = "UpgradeBuildings";
    })(ExpandedActionKind = exports.ExpandedActionKind || (exports.ExpandedActionKind = {}));
    var ExpandedActionComponent = (function (_super) {
        __extends(ExpandedActionComponent, _super);
        function ExpandedActionComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ExpandedAction";
            return _this;
        }
        ExpandedActionComponent.prototype.render = function () {
            var innerElement;
            switch (this.props.action) {
                case ExpandedActionKind.None:
                    {
                        return null;
                    }
                case ExpandedActionKind.BuildBuildings:
                    {
                        if (this.props.buildableBuildings.length > 0) {
                            innerElement = BuildableBuildingList_1.BuildableBuildingList({
                                player: this.props.player,
                                star: this.props.selectedStar,
                                buildableBuildings: this.props.buildableBuildings,
                            });
                            break;
                        }
                        else {
                            return null;
                        }
                    }
                case ExpandedActionKind.UpgradeBuildings:
                    {
                        if (Object.keys(this.props.buildingUpgrades).length > 0) {
                            innerElement = BuildingUpgradeList_1.BuildingUpgradeList({
                                player: this.props.player,
                                star: this.props.selectedStar,
                                buildingUpgrades: this.props.buildingUpgrades,
                            });
                            break;
                        }
                        else {
                            return null;
                        }
                    }
                default:
                    {
                        throw new Error("Invalid expanded action kind: " + this.props.action);
                    }
            }
            return (ReactDOMElements.div({
                className: "expanded-action"
            }, innerElement));
        };
        return ExpandedActionComponent;
    }(React.Component));
    exports.ExpandedActionComponent = ExpandedActionComponent;
    exports.ExpandedAction = React.createFactory(ExpandedActionComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/possibleactions/PossibleActions", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/possibleactions/AttackTarget", "modules/defaultui/uicomponents/possibleactions/ExpandedAction"], function (require, exports, React, ReactDOMElements, localize_1, AttackTarget_1, ExpandedAction_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PossibleActionsComponent = (function (_super) {
        __extends(PossibleActionsComponent, _super);
        function PossibleActionsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "PossibleActions";
            return _this;
        }
        PossibleActionsComponent.prototype.render = function () {
            var _this = this;
            var star = this.props.selectedStar;
            var hasPlayerStarSelected = star && star.owner === this.props.player;
            var canUpgradeBuildings = hasPlayerStarSelected && Object.keys(star.getBuildingUpgrades()).length > 0;
            var canBuildBuildings = hasPlayerStarSelected && star.getBuildableBuildings().length > 0;
            var hasAnyPossibleAction = [
                canUpgradeBuildings,
                canBuildBuildings,
                this.props.attackTargets.length > 0,
            ].some(function (check) { return check === true; });
            if (!hasAnyPossibleAction) {
                return null;
            }
            return (ReactDOMElements.div({
                className: "possible-actions-container",
            }, this.props.attackTargets.map(function (attackTarget) {
                return AttackTarget_1.AttackTarget({
                    key: attackTarget.enemy.id,
                    attackTarget: attackTarget,
                });
            }), !canBuildBuildings ? null :
                ReactDOMElements.button({
                    className: "possible-action",
                    onClick: function () {
                        _this.props.handleExpandActionToggle(ExpandedAction_1.ExpandedActionKind.BuildBuildings);
                    },
                    key: "buildActions",
                }, localize_1.localize("constructBuilding")()), !canUpgradeBuildings ? null :
                ReactDOMElements.button({
                    className: "possible-action",
                    onClick: function () {
                        _this.props.handleExpandActionToggle(ExpandedAction_1.ExpandedActionKind.UpgradeBuildings);
                    },
                    key: "upgradeActions",
                }, localize_1.localize("upgradeBuilding")())));
        };
        return PossibleActionsComponent;
    }(React.Component));
    exports.PossibleActionsComponent = PossibleActionsComponent;
    exports.PossibleActions = React.createFactory(PossibleActionsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/production/BuildQueue", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/production/ManufactoryUpgradeButton", "modules/defaultui/uicomponents/production/ManufacturableThingsList"], function (require, exports, React, ReactDOMElements, localize_1, ManufactoryUpgradeButton_1, ManufacturableThingsList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BuildQueueComponent = (function (_super) {
        __extends(BuildQueueComponent, _super);
        function BuildQueueComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "BuildQueue";
            _this.bindMethods();
            return _this;
        }
        BuildQueueComponent.prototype.bindMethods = function () {
            this.removeItem = this.removeItem.bind(this);
            this.upgradeCapacity = this.upgradeCapacity.bind(this);
        };
        BuildQueueComponent.prototype.upgradeCapacity = function () {
            var manufactory = this.props.manufactory;
            manufactory.upgradeCapacity(1);
            this.props.triggerUpdate();
        };
        BuildQueueComponent.prototype.render = function () {
            var manufactory = this.props.manufactory;
            var convertedBuildQueue = [];
            for (var i = 0; i < manufactory.buildQueue.length; i++) {
                convertedBuildQueue.push(manufactory.buildQueue[i].template);
            }
            return (ReactDOMElements.div({
                className: "build-queue",
            }, ReactDOMElements.div({
                className: "manufactory-upgrade-buttons-container",
            }, ManufactoryUpgradeButton_1.ManufactoryUpgradeButton({
                money: this.props.money,
                upgradeCost: manufactory.getCapacityUpgradeCost(),
                onClick: this.upgradeCapacity,
                actionString: localize_1.localize("upgradeManufactoryCapacity")(),
                currentLevel: manufactory.capacity,
                maxLevel: manufactory.maxCapacity,
                levelDecimalPoints: 0,
                title: localize_1.localize("upgradeManufactoryCapacityTooltip")(),
            })), ManufacturableThingsList_1.ManufacturableThingsList({
                manufacturableThings: convertedBuildQueue,
                onClick: this.removeItem,
                showCost: false,
                money: this.props.money,
            })));
        };
        BuildQueueComponent.prototype.removeItem = function (template, parentIndex) {
            var manufactory = this.props.manufactory;
            manufactory.removeThingAtIndex(parentIndex);
            this.props.triggerUpdate();
        };
        return BuildQueueComponent;
    }(React.Component));
    exports.BuildQueueComponent = BuildQueueComponent;
    exports.BuildQueue = React.createFactory(BuildQueueComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/production/ConstructManufactory", ["require", "exports", "react", "react-dom-factories", "src/activeModuleData", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, activeModuleData_1, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConstructManufactoryComponent = (function (_super) {
        __extends(ConstructManufactoryComponent, _super);
        function ConstructManufactoryComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ConstructManufactory";
            _this.state = {};
            _this.bindMethods();
            return _this;
        }
        ConstructManufactoryComponent.prototype.bindMethods = function () {
            this.handleConstruct = this.handleConstruct.bind(this);
        };
        ConstructManufactoryComponent.prototype.handleConstruct = function () {
            var star = this.props.star;
            var player = this.props.player;
            star.buildManufactory();
            player.money -= activeModuleData_1.activeModuleData.ruleSet.manufactory.buildCost;
            this.props.triggerUpdate();
        };
        ConstructManufactoryComponent.prototype.render = function () {
            var canAfford = this.props.money >= activeModuleData_1.activeModuleData.ruleSet.manufactory.buildCost;
            return (ReactDOMElements.div({
                className: "construct-manufactory-container",
            }, ReactDOMElements.button({
                className: "construct-manufactory-button" + (canAfford ? "" : " disabled"),
                onClick: canAfford ? this.handleConstruct : null,
                disabled: !canAfford,
            }, ReactDOMElements.span({
                className: "construct-manufactory-action",
            }, localize_1.localize("constructManufactory")()), ReactDOMElements.span({
                className: "construct-manufactory-cost money-style" +
                    (canAfford ? "" : " negative"),
            }, activeModuleData_1.activeModuleData.ruleSet.manufactory.buildCost))));
        };
        return ConstructManufactoryComponent;
    }(React.PureComponent));
    exports.ConstructManufactoryComponent = ConstructManufactoryComponent;
    exports.ConstructManufactory = React.createFactory(ConstructManufactoryComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/production/ManufactoryStarsList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/production/ManufactoryStarsListItem"], function (require, exports, React, ReactDOMElements, ManufactoryStarsListItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function sortByManufactoryCapacityFN(a, b) {
        var aCapacity = (a.manufactory ? a.manufactory.capacity : -1);
        var bCapacity = (b.manufactory ? b.manufactory.capacity : -1);
        var capacitySort = bCapacity - aCapacity;
        if (capacitySort) {
            return capacitySort;
        }
        var nameSort = a.name.localeCompare(b.name);
        if (nameSort) {
            return nameSort;
        }
        var idSort = a.id - b.id;
        return idSort;
    }
    exports.sortByManufactoryCapacityFN = sortByManufactoryCapacityFN;
    var ManufactoryStarsListComponent = (function (_super) {
        __extends(ManufactoryStarsListComponent, _super);
        function ManufactoryStarsListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ManufactoryStarsList";
            return _this;
        }
        ManufactoryStarsListComponent.prototype.render = function () {
            var rows = [];
            this.props.starsWithManufactories.sort(sortByManufactoryCapacityFN);
            this.props.starsWithoutManufactories.sort(sortByManufactoryCapacityFN);
            for (var i = 0; i < this.props.starsWithManufactories.length; i++) {
                var star = this.props.starsWithManufactories[i];
                var manufactory = star.manufactory;
                var isHighlighted = this.props.highlightedStars.indexOf(star) !== -1;
                rows.push(ManufactoryStarsListItem_1.ManufactoryStarsListItem({
                    key: star.id,
                    star: star,
                    isHighlighted: isHighlighted,
                    usedCapacity: manufactory.buildQueue.length,
                    totalCapacity: manufactory.capacity,
                    onClick: this.props.setSelectedStar,
                }));
            }
            for (var i = 0; i < this.props.starsWithoutManufactories.length; i++) {
                var star = this.props.starsWithoutManufactories[i];
                var isHighlighted = this.props.highlightedStars.indexOf(star) !== -1;
                rows.push(ManufactoryStarsListItem_1.ManufactoryStarsListItem({
                    key: star.id,
                    star: star,
                    isHighlighted: isHighlighted,
                    usedCapacity: 0,
                    totalCapacity: 0,
                    onClick: this.props.setSelectedStar,
                }));
            }
            return (ReactDOMElements.div({
                className: "manufactory-stars-list",
            }, rows));
        };
        return ManufactoryStarsListComponent;
    }(React.Component));
    exports.ManufactoryStarsListComponent = ManufactoryStarsListComponent;
    exports.ManufactoryStarsList = React.createFactory(ManufactoryStarsListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/production/ManufactoryStarsListItem", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ManufactoryStarsListItemComponent = (function (_super) {
        __extends(ManufactoryStarsListItemComponent, _super);
        function ManufactoryStarsListItemComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ManufactoryStarsListItem";
            _this.bindMethods();
            return _this;
        }
        ManufactoryStarsListItemComponent.prototype.bindMethods = function () {
            this.handleClick = this.handleClick.bind(this);
        };
        ManufactoryStarsListItemComponent.prototype.handleClick = function () {
            var star = this.props.star;
            this.props.onClick(star);
        };
        ManufactoryStarsListItemComponent.prototype.render = function () {
            var hasManufactory = Boolean(this.props.totalCapacity);
            var hasCapacity = hasManufactory && this.props.usedCapacity < this.props.totalCapacity;
            return (ReactDOMElements.div({
                className: "manufactory-stars-list-item" +
                    (!hasManufactory ? " no-manufactory" : "") +
                    (this.props.isHighlighted ? " highlighted" : ""),
                onClick: this.handleClick,
            }, ReactDOMElements.div({
                className: "manufactory-stars-list-item-star-name",
            }, this.props.star.name), !hasManufactory ? null : ReactDOMElements.div({
                className: "manufactory-stars-list-item-capacity" + (!hasCapacity ? " no-capacity" : ""),
            }, this.props.usedCapacity + "/" + this.props.totalCapacity)));
        };
        return ManufactoryStarsListItemComponent;
    }(React.Component));
    exports.ManufactoryStarsListItemComponent = ManufactoryStarsListItemComponent;
    exports.ManufactoryStarsListItem = React.createFactory(ManufactoryStarsListItemComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/production/ManufactoryUpgradeButton", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ManufactoryUpgradeButtonComponent = (function (_super) {
        __extends(ManufactoryUpgradeButtonComponent, _super);
        function ManufactoryUpgradeButtonComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ManufactoryUpgradeButton";
            return _this;
        }
        ManufactoryUpgradeButtonComponent.prototype.render = function () {
            var unitUpgradeButtonBaseClassName = "manufactory-upgrade-button";
            var unitUpgradeCostBaseClassName = "manufactory-upgrade-button-cost";
            var isAtMaxLevel = this.props.currentLevel >= this.props.maxLevel;
            var canAffordUpgrade = this.props.money >= this.props.upgradeCost;
            var isDisabled = isAtMaxLevel || !canAffordUpgrade;
            if (isDisabled) {
                unitUpgradeButtonBaseClassName += " disabled";
            }
            if (!canAffordUpgrade) {
                unitUpgradeCostBaseClassName += " negative";
            }
            return (ReactDOMElements.button({
                className: unitUpgradeButtonBaseClassName + " manufactory-units-upgrade-health-button",
                onClick: (isDisabled ? null : this.props.onClick),
                disabled: isDisabled,
                title: this.props.title,
            }, ReactDOMElements.span({
                className: "manufactory-upgrade-button-action",
            }, this.props.actionString), ReactDOMElements.br(), ReactDOMElements.span({
                className: "manufactory-upgrade-button-level",
            }, this.props.currentLevel.toFixed(this.props.levelDecimalPoints) + " / " + this.props.maxLevel.toFixed(this.props.levelDecimalPoints)), ReactDOMElements.span({
                className: unitUpgradeCostBaseClassName,
            }, this.props.upgradeCost)));
        };
        return ManufactoryUpgradeButtonComponent;
    }(React.Component));
    exports.ManufactoryUpgradeButtonComponent = ManufactoryUpgradeButtonComponent;
    exports.ManufactoryUpgradeButton = React.createFactory(ManufactoryUpgradeButtonComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/production/ManufacturableItems", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/production/ManufactoryUpgradeButton", "modules/defaultui/uicomponents/production/ManufacturableThingsList"], function (require, exports, React, ReactDOMElements, localize_1, ManufactoryUpgradeButton_1, ManufacturableThingsList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ManufacturableItemsComponent = (function (_super) {
        __extends(ManufacturableItemsComponent, _super);
        function ManufacturableItemsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ManufacturableItems";
            _this.bindMethods();
            return _this;
        }
        ManufacturableItemsComponent.prototype.shouldComponentUpdate = function (newProps) {
            if (this.props.selectedStar !== newProps.selectedStar) {
                return true;
            }
            if (this.props.manufacturableThings.length !== newProps.manufacturableThings.length) {
                return true;
            }
            else {
            }
            if (this.props.canBuild !== newProps.canBuild) {
                return true;
            }
            if (this.props.money !== newProps.money) {
                return true;
            }
            return false;
        };
        ManufacturableItemsComponent.prototype.addItemToBuildQueue = function (template) {
            var manufactory = this.props.selectedStar.manufactory;
            manufactory.addThingToQueue(template, "item");
            this.props.triggerUpdate();
        };
        ManufacturableItemsComponent.prototype.bindMethods = function () {
            this.upgradeItems = this.upgradeItems.bind(this);
            this.addItemToBuildQueue = this.addItemToBuildQueue.bind(this);
        };
        ManufacturableItemsComponent.prototype.upgradeItems = function () {
        };
        ManufacturableItemsComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "manufacturable-items",
            }, (!this.props.selectedStar || !this.props.selectedStar.manufactory) ? null : ReactDOMElements.div({
                className: "manufactory-upgrade-buttons-container",
            }, ManufactoryUpgradeButton_1.ManufactoryUpgradeButton({
                money: this.props.money,
                upgradeCost: 0,
                actionString: localize_1.localize("upgradeItems")(),
                currentLevel: 0,
                maxLevel: 0,
                levelDecimalPoints: 0,
                onClick: this.upgradeItems,
            })), ManufacturableThingsList_1.ManufacturableThingsList({
                manufacturableThings: this.props.manufacturableThings,
                onClick: (this.props.canBuild ? this.addItemToBuildQueue : undefined),
                showCost: true,
                money: this.props.money,
            })));
        };
        return ManufacturableItemsComponent;
    }(React.Component));
    exports.ManufacturableItemsComponent = ManufacturableItemsComponent;
    exports.ManufacturableItems = React.createFactory(ManufacturableItemsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/production/ManufacturableThings", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/production/ManufacturableItems", "modules/defaultui/uicomponents/production/ManufacturableUnits"], function (require, exports, React, ReactDOMElements, localize_1, ManufacturableItems_1, ManufacturableUnits_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ManufacturableThingsComponent = (function (_super) {
        __extends(ManufacturableThingsComponent, _super);
        function ManufacturableThingsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ManufacturableThings";
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        ManufacturableThingsComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "manufacturable-things",
            }, ReactDOMElements.div({
                className: "manufacturable-things-tab-buttons",
            }, this.makeTabButton("units"), this.makeTabButton("items")), ReactDOMElements.div({
                className: "manufacturable-things-active-tab",
            }, this.makeTab(this.state.activeTab))));
        };
        ManufacturableThingsComponent.prototype.bindMethods = function () {
            this.makeTabButton = this.makeTabButton.bind(this);
            this.selectTab = this.selectTab.bind(this);
            this.makeTab = this.makeTab.bind(this);
        };
        ManufacturableThingsComponent.prototype.getInitialStateTODO = function () {
            return ({
                activeTab: "units",
            });
        };
        ManufacturableThingsComponent.prototype.selectTab = function (key) {
            if (this.state.activeTab === key) {
                return;
            }
            this.setState({
                activeTab: key,
            });
        };
        ManufacturableThingsComponent.prototype.makeTabButton = function (key) {
            var displayString;
            switch (key) {
                case "units":
                    {
                        displayString = localize_1.localize("manufactureUnitsButton")();
                        break;
                    }
                case "items":
                    {
                        displayString = localize_1.localize("manufactureItemsButton")();
                        break;
                    }
            }
            return (ReactDOMElements.button({
                key: key,
                className: "manufacturable-things-tab-button" +
                    (this.state.activeTab === key ? " active-tab" : ""),
                onClick: this.selectTab.bind(this, key),
            }, displayString));
        };
        ManufacturableThingsComponent.prototype.getManufacturableThings = function (key) {
            if (!this.props.selectedStar || !this.props.selectedStar.manufactory) {
                return [];
            }
            if (key === "items") {
                return this.props.selectedStar.manufactory.getManufacturableItems();
            }
            else {
                return this.props.selectedStar.manufactory.getManufacturableUnits();
            }
        };
        ManufacturableThingsComponent.prototype.makeTab = function (key) {
            var props = {
                key: key,
                selectedStar: this.props.selectedStar,
                manufacturableThings: this.getManufacturableThings(key),
                consolidateLocations: false,
                triggerUpdate: this.props.triggerUpdate,
                canBuild: Boolean(this.props.selectedStar && this.props.selectedStar.manufactory),
                money: this.props.money,
            };
            switch (key) {
                case "units":
                    {
                        return (ManufacturableUnits_1.ManufacturableUnits(props));
                    }
                case "items":
                    {
                        props.consolidateLocations = true;
                        return (ManufacturableItems_1.ManufacturableItems(props));
                    }
            }
        };
        return ManufacturableThingsComponent;
    }(React.Component));
    exports.ManufacturableThingsComponent = ManufacturableThingsComponent;
    exports.ManufacturableThings = React.createFactory(ManufacturableThingsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/production/ManufacturableThingsList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/production/ManufacturableThingsListItem"], function (require, exports, React, ReactDOMElements, ManufacturableThingsListItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ManufacturableThingsListComponent = (function (_super) {
        __extends(ManufacturableThingsListComponent, _super);
        function ManufacturableThingsListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ManufacturableThingsList";
            return _this;
        }
        ManufacturableThingsListComponent.prototype.render = function () {
            var _this = this;
            var manufacturableThings = this.props.manufacturableThings;
            var keyByTemplateType = {};
            var items = manufacturableThings.sort(function (a, b) {
                return a.displayName.localeCompare(b.displayName);
            }).map(function (template, i) {
                if (!keyByTemplateType[template.type]) {
                    keyByTemplateType[template.type] = 0;
                }
                return ManufacturableThingsListItem_1.ManufacturableThingsListItem({
                    key: template.type + keyByTemplateType[template.type]++,
                    template: manufacturableThings[i],
                    parentIndex: i,
                    onClick: _this.props.onClick,
                    money: _this.props.money,
                    showCost: _this.props.showCost,
                });
            });
            return (ReactDOMElements.ol({
                className: "manufacturable-things-list",
            }, items));
        };
        return ManufacturableThingsListComponent;
    }(React.PureComponent));
    exports.ManufacturableThingsListComponent = ManufacturableThingsListComponent;
    exports.ManufacturableThingsList = React.createFactory(ManufacturableThingsListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/production/ManufacturableThingsListItem", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ManufacturableThingsListItemComponent = (function (_super) {
        __extends(ManufacturableThingsListItemComponent, _super);
        function ManufacturableThingsListItemComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ManufacturableThingsListItem";
            _this.state = {};
            _this.bindMethods();
            return _this;
        }
        ManufacturableThingsListItemComponent.prototype.bindMethods = function () {
            this.handleClick = this.handleClick.bind(this);
        };
        ManufacturableThingsListItemComponent.prototype.handleClick = function () {
            if (this.props.onClick) {
                this.props.onClick(this.props.template, this.props.parentIndex);
            }
        };
        ManufacturableThingsListItemComponent.prototype.render = function () {
            var canAfford = this.props.money >= this.props.template.buildCost;
            var isDisabled = !Boolean(this.props.onClick) || (this.props.showCost && !canAfford);
            return (ReactDOMElements.li({
                className: "manufacturable-things-list-item" + (isDisabled ? " disabled" : ""),
                onClick: (isDisabled ? null : this.handleClick),
                title: this.props.template.description,
            }, ReactDOMElements.div({
                className: "manufacturable-things-list-item-name",
            }, this.props.template.displayName), !this.props.showCost ? null : ReactDOMElements.div({
                className: "manufacturable-things-list-item-cost money-style" +
                    (canAfford ? "" : " negative"),
            }, this.props.template.buildCost)));
        };
        return ManufacturableThingsListItemComponent;
    }(React.Component));
    exports.ManufacturableThingsListItemComponent = ManufacturableThingsListItemComponent;
    exports.ManufacturableThingsListItem = React.createFactory(ManufacturableThingsListItemComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/production/ManufacturableUnits", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/production/ManufactoryUpgradeButton", "modules/defaultui/uicomponents/production/ManufacturableThingsList"], function (require, exports, React, ReactDOMElements, localize_1, ManufactoryUpgradeButton_1, ManufacturableThingsList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ManufacturableUnitsComponent = (function (_super) {
        __extends(ManufacturableUnitsComponent, _super);
        function ManufacturableUnitsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ManufacturableUnits";
            _this.bindMethods();
            return _this;
        }
        ManufacturableUnitsComponent.prototype.shouldComponentUpdate = function (newProps) {
            if (this.props.selectedStar !== newProps.selectedStar) {
                return true;
            }
            if (this.props.manufacturableThings.length !== newProps.manufacturableThings.length) {
                return true;
            }
            else {
            }
            if (this.props.canBuild !== newProps.canBuild) {
                return true;
            }
            if (this.props.money !== newProps.money) {
                return true;
            }
            return false;
        };
        ManufacturableUnitsComponent.prototype.addUnitToBuildQueue = function (template) {
            var manufactory = this.props.selectedStar.manufactory;
            manufactory.addThingToQueue(template, "unit");
            this.props.triggerUpdate();
        };
        ManufacturableUnitsComponent.prototype.bindMethods = function () {
            this.addUnitToBuildQueue = this.addUnitToBuildQueue.bind(this);
            this.upgradeStats = this.upgradeStats.bind(this);
            this.upgradeHealth = this.upgradeHealth.bind(this);
        };
        ManufacturableUnitsComponent.prototype.upgradeHealth = function () {
            var manufactory = this.props.selectedStar.manufactory;
            manufactory.upgradeUnitHealthModifier(0.1);
            this.props.triggerUpdate();
        };
        ManufacturableUnitsComponent.prototype.upgradeStats = function () {
            var manufactory = this.props.selectedStar.manufactory;
            manufactory.upgradeUnitStatsModifier(0.1);
            this.props.triggerUpdate();
        };
        ManufacturableUnitsComponent.prototype.render = function () {
            var selectedStarHasManufactory = this.props.selectedStar && this.props.selectedStar.manufactory;
            var manufactoryUpgradeButtons = null;
            if (selectedStarHasManufactory) {
                var manufactory = this.props.selectedStar.manufactory;
                var unitUpgradeCost = manufactory.getUnitModifierUpgradeCost();
                manufactoryUpgradeButtons = ReactDOMElements.div({
                    className: "manufactory-upgrade-buttons-container",
                }, ManufactoryUpgradeButton_1.ManufactoryUpgradeButton({
                    money: this.props.money,
                    upgradeCost: unitUpgradeCost,
                    actionString: localize_1.localize("upgradeHealth")(),
                    currentLevel: manufactory.unitHealthModifier,
                    maxLevel: 5.0,
                    levelDecimalPoints: 1,
                    onClick: this.upgradeHealth,
                    title: localize_1.localize("increaseBaseHealthOfUnitsBuiltHere")(),
                }), ManufactoryUpgradeButton_1.ManufactoryUpgradeButton({
                    money: this.props.money,
                    upgradeCost: unitUpgradeCost,
                    actionString: localize_1.localize("upgradeStats")(),
                    currentLevel: manufactory.unitStatsModifier,
                    maxLevel: 5.0,
                    levelDecimalPoints: 1,
                    onClick: this.upgradeStats,
                    title: localize_1.localize("increaseBaseStatsOfUnitsBuiltHere")(),
                }));
            }
            return (ReactDOMElements.div({
                className: "manufacturable-units",
            }, manufactoryUpgradeButtons, ManufacturableThingsList_1.ManufacturableThingsList({
                manufacturableThings: this.props.manufacturableThings,
                onClick: (this.props.canBuild ? this.addUnitToBuildQueue : null),
                showCost: true,
                money: this.props.money,
            })));
        };
        return ManufacturableUnitsComponent;
    }(React.Component));
    exports.ManufacturableUnitsComponent = ManufacturableUnitsComponent;
    exports.ManufacturableUnits = React.createFactory(ManufacturableUnitsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/production/ProductionOverview", ["require", "exports", "react", "react-dom-factories", "src/eventManager", "modules/defaultui/uicomponents/mixins/UpdateWhenMoneyChanges", "modules/defaultui/uicomponents/mixins/applyMixins", "modules/defaultui/uicomponents/production/BuildQueue", "modules/defaultui/uicomponents/production/ConstructManufactory", "modules/defaultui/uicomponents/production/ManufactoryStarsList", "modules/defaultui/uicomponents/production/ManufacturableThings"], function (require, exports, React, ReactDOMElements, eventManager_1, UpdateWhenMoneyChanges_1, applyMixins_1, BuildQueue_1, ConstructManufactory_1, ManufactoryStarsList_1, ManufacturableThings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ProductionOverviewComponent = (function (_super) {
        __extends(ProductionOverviewComponent, _super);
        function ProductionOverviewComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ProductionOverview";
            _this.state = {
                selectedStar: _this.getInitialSelectedStar(),
                money: _this.props.player.money,
            };
            _this.getStarsWithAndWithoutManufactories = _this.getStarsWithAndWithoutManufactories.bind(_this);
            _this.triggerUpdate = _this.triggerUpdate.bind(_this);
            applyMixins_1.applyMixins(_this, new UpdateWhenMoneyChanges_1.UpdateWhenMoneyChanges(_this));
            return _this;
        }
        ProductionOverviewComponent.getDerivedStateFromProps = function (props) {
            if (props.globalSelectedStar && props.player.canAccessManufactoringAtLocation(props.globalSelectedStar)) {
                return ({
                    selectedStar: props.globalSelectedStar,
                });
            }
            else {
                return null;
            }
        };
        ProductionOverviewComponent.prototype.componentDidMount = function () {
            eventManager_1.eventManager.addEventListener("playerManufactoryBuiltThings", this.triggerUpdate);
        };
        ProductionOverviewComponent.prototype.componentWillUnmount = function () {
            eventManager_1.eventManager.removeEventListener("playerManufactoryBuiltThings", this.triggerUpdate);
        };
        ProductionOverviewComponent.prototype.render = function () {
            var player = this.props.player;
            var selectedStar = this.state.selectedStar;
            var starsByManufactoryPresence = this.getStarsWithAndWithoutManufactories();
            var queueElement = null;
            if (selectedStar && this.props.player.canAccessManufactoringAtLocation(selectedStar)) {
                if (selectedStar.manufactory) {
                    queueElement = BuildQueue_1.BuildQueue({
                        manufactory: selectedStar.manufactory,
                        triggerUpdate: this.triggerUpdate,
                        money: this.state.money,
                    });
                }
                else {
                    queueElement = ConstructManufactory_1.ConstructManufactory({
                        star: selectedStar,
                        player: player,
                        money: this.state.money,
                        triggerUpdate: this.triggerUpdate,
                    });
                }
            }
            return (ReactDOMElements.div({
                className: "production-overview",
            }, ManufactoryStarsList_1.ManufactoryStarsList({
                starsWithManufactories: starsByManufactoryPresence.withManufactories,
                starsWithoutManufactories: starsByManufactoryPresence.withoutManufactories,
                highlightedStars: [selectedStar],
                setSelectedStar: this.props.setSelectedStar,
            }), ReactDOMElements.div({
                className: "production-overview-contents",
            }, queueElement, selectedStar && this.props.player.canAccessManufactoringAtLocation ? ManufacturableThings_1.ManufacturableThings({
                selectedStar: selectedStar,
                player: player,
                money: this.state.money,
                triggerUpdate: this.triggerUpdate,
            }) : null)));
        };
        ProductionOverviewComponent.prototype.getInitialSelectedStar = function () {
            if (this.props.globalSelectedStar && this.props.player.canAccessManufactoringAtLocation(this.props.globalSelectedStar)) {
                return this.props.globalSelectedStar;
            }
            else if (this.props.player.controlledLocations.length === 1) {
                return this.props.player.controlledLocations[0];
            }
            else {
                return null;
            }
        };
        ProductionOverviewComponent.prototype.triggerUpdate = function () {
            this.forceUpdate();
        };
        ProductionOverviewComponent.prototype.getStarsWithAndWithoutManufactories = function () {
            var player = this.props.player;
            var starsWithManufactories = [];
            var starsWithoutManufactories = [];
            for (var i = 0; i < player.controlledLocations.length; i++) {
                var star = player.controlledLocations[i];
                if (star.manufactory) {
                    starsWithManufactories.push(star);
                }
                else {
                    starsWithoutManufactories.push(star);
                }
            }
            return ({
                withManufactories: starsWithManufactories,
                withoutManufactories: starsWithoutManufactories,
            });
        };
        return ProductionOverviewComponent;
    }(React.Component));
    exports.ProductionOverviewComponent = ProductionOverviewComponent;
    exports.ProductionOverview = React.createFactory(ProductionOverviewComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/saves/ConfirmDeleteSavesContent", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConfirmDeleteSavesContentComponent = (function (_super) {
        __extends(ConfirmDeleteSavesContentComponent, _super);
        function ConfirmDeleteSavesContentComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ConfirmDeleteSavesContent";
            return _this;
        }
        ConfirmDeleteSavesContentComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "confirm-delete-saves-content",
            }, ReactDOMElements.span({
                className: "confirm-delete-saves-content-title",
            }, localize_1.localize("confirmSaveDeletion")({
                count: this.props.saveNames.length
            })), ReactDOMElements.ol({
                className: "confirm-delete-saves-content-saves-list",
            }, this.props.saveNames.map(function (saveName) {
                return (ReactDOMElements.li({
                    className: "confirm-delete-saves-content-save-name",
                    key: saveName,
                }, saveName));
            }))));
        };
        return ConfirmDeleteSavesContentComponent;
    }(React.PureComponent));
    exports.ConfirmDeleteSavesContentComponent = ConfirmDeleteSavesContentComponent;
    exports.ConfirmDeleteSavesContent = React.createFactory(ConfirmDeleteSavesContentComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/saves/EmergencySaveGame", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/App", "src/storageStrings"], function (require, exports, React, ReactDOMElements, localize_1, App_1, storageStrings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EmergencySaveGameComponent = (function (_super) {
        __extends(EmergencySaveGameComponent, _super);
        function EmergencySaveGameComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "EmergencySaveGame";
            _this.saveNameElement = React.createRef();
            _this.state =
                {
                    saveName: "",
                    actionStatusMessage: null,
                    saveData: null,
                    saveDataStatusMessage: null,
                };
            try {
                _this.state.saveData = App_1.app.game.getSaveData(storageStrings_1.storageStrings.panicSave);
                _this.state.saveDataStatusMessage = localize_1.localize("saveDataCopyPrompt")();
            }
            catch (e) {
                _this.state.saveDataStatusMessage = localize_1.localize("activeGameUnserializable")();
            }
            _this.handleSave = _this.handleSave.bind(_this);
            return _this;
        }
        EmergencySaveGameComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "emergency-save-game",
            }, ReactDOMElements.div({
                className: "emergency-save-game-action"
            }, ReactDOMElements.form({
                className: "emergency-save-game-form",
                onSubmit: this.handleSave,
                action: "javascript:void(0);",
            }, ReactDOMElements.input({
                className: "emergency-save-game-name",
                ref: this.saveNameElement,
                type: "text",
                value: this.state.saveName,
                onChange: function (e) { _this.setState({ saveName: e.currentTarget.value }); },
                maxLength: 64,
            }), ReactDOMElements.input({
                className: "emergency-save-game-button",
                type: "submit",
                value: localize_1.localize("save_action")(),
            })), !this.state.actionStatusMessage ? null :
                ReactDOMElements.div({
                    className: "emergency-save-game-action-message",
                }, this.state.actionStatusMessage)), ReactDOMElements.div({
                className: "emergency-save-game-data",
            }, ReactDOMElements.div({
                className: "emergency-save-game-data-status",
            }, this.state.saveDataStatusMessage), ReactDOMElements.label({
                className: "import-data-label",
                htmlFor: "emergency-save-game-textarea",
            }, localize_1.localize("saveData")()), ReactDOMElements.textarea({
                className: "import-data-textarea",
                id: "emergency-save-game-textarea",
                value: this.state.saveData,
                readOnly: true,
            }))));
        };
        EmergencySaveGameComponent.prototype.handleSave = function () {
            try {
                App_1.app.game.save(this.state.saveName);
                this.setState({
                    actionStatusMessage: localize_1.localize("saveSuccessful")(),
                });
            }
            catch (e) {
                this.setState({
                    actionStatusMessage: localize_1.localize("saveFailure")(),
                });
            }
        };
        return EmergencySaveGameComponent;
    }(React.Component));
    exports.EmergencySaveGameComponent = EmergencySaveGameComponent;
    exports.EmergencySaveGame = React.createFactory(EmergencySaveGameComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/saves/LoadGame", ["require", "exports", "react", "react-dom-factories", "localforage", "modules/defaultui/localization/localize", "src/App", "modules/defaultui/uicomponents/windows/DialogBox", "modules/defaultui/uicomponents/saves/ConfirmDeleteSavesContent", "modules/defaultui/uicomponents/saves/SaveList", "src/storageStrings"], function (require, exports, React, ReactDOMElements, localForage, localize_1, App_1, DialogBox_1, ConfirmDeleteSavesContent_1, SaveList_1, storageStrings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoadGameComponent = (function (_super) {
        __extends(LoadGameComponent, _super);
        function LoadGameComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "LoadGame";
            _this.saveList = React.createRef();
            _this.loadButtonElement = React.createRef();
            _this.state =
                {
                    saveKeysToDelete: [],
                    selectedSaveKey: App_1.app.game.gameStorageKey,
                    hasConfirmDeleteSavePopup: false,
                };
            _this.bindMethods();
            return _this;
        }
        LoadGameComponent.prototype.componentDidMount = function () {
            this.loadButtonElement.current.focus();
        };
        LoadGameComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "save-game",
            }, !this.state.hasConfirmDeleteSavePopup ? null :
                DialogBox_1.DialogBox({
                    title: localize_1.localize("confirmDeletion")(),
                    handleOk: function () {
                        _this.deleteSelectedKeys();
                        _this.closeConfirmDeleteSavesPopup();
                        _this.saveList.current.updateAvailableSaves();
                    },
                    handleCancel: this.closeConfirmDeleteSavesPopup,
                }, ConfirmDeleteSavesContent_1.ConfirmDeleteSavesContent({
                    saveNames: this.state.saveKeysToDelete.map(function (key) { return key.replace(storageStrings_1.storageStrings.savePrefix, ""); }),
                })), SaveList_1.SaveList({
                ref: this.saveList,
                onRowChange: function (row) {
                    _this.setState({ selectedSaveKey: row.content.props.storageKey });
                    _this.handleUndoMarkForDeletion(row.content.props.storageKey);
                },
                autoSelect: !Boolean(App_1.app.game.gameStorageKey),
                selectedKey: App_1.app.game.gameStorageKey,
                allowDeletion: true,
                onMarkForDeletion: this.handleMarkForDeletion,
                onUndoMarkForDeletion: this.handleUndoMarkForDeletion,
                saveKeysMarkedForDeletion: this.state.saveKeysToDelete,
                onDoubleClick: this.handleLoad,
            }), ReactDOMElements.form({
                className: "save-game-form",
                onSubmit: this.handleLoad,
                action: "javascript:void(0);",
            }, ReactDOMElements.input({
                className: "save-game-name",
                type: "text",
                value: this.state.selectedSaveKey ? this.state.selectedSaveKey.replace(storageStrings_1.storageStrings.savePrefix, "") : "",
                readOnly: true,
            })), ReactDOMElements.div({
                className: "save-game-buttons-container",
            }, ReactDOMElements.button({
                className: "save-game-button",
                onClick: this.handleLoad,
                disabled: !this.state.selectedSaveKey,
                ref: this.loadButtonElement,
            }, localize_1.localize("load_action")()), ReactDOMElements.button({
                className: "save-game-button",
                onClick: this.handleClose.bind(this, true, null),
            }, localize_1.localize("cancel")()), ReactDOMElements.button({
                className: "save-game-button",
                onClick: this.openConfirmDeleteSavesPopup,
                disabled: this.state.saveKeysToDelete.length < 1,
            }, localize_1.localize("delete")()))));
        };
        LoadGameComponent.prototype.openConfirmDeleteSavesPopup = function () {
            this.setState({ hasConfirmDeleteSavePopup: true });
        };
        LoadGameComponent.prototype.bindMethods = function () {
            this.handleLoad = this.handleLoad.bind(this);
            this.deleteSelectedKeys = this.deleteSelectedKeys.bind(this);
            this.handleMarkForDeletion = this.handleMarkForDeletion.bind(this);
            this.handleUndoMarkForDeletion = this.handleUndoMarkForDeletion.bind(this);
            this.openConfirmDeleteSavesPopup = this.openConfirmDeleteSavesPopup.bind(this);
            this.closeConfirmDeleteSavesPopup = this.closeConfirmDeleteSavesPopup.bind(this);
            this.handleClose = this.handleClose.bind(this);
        };
        LoadGameComponent.prototype.handleLoad = function () {
            App_1.app.load(this.state.selectedSaveKey);
        };
        LoadGameComponent.prototype.deleteSelectedKeys = function () {
            var _this = this;
            this.state.saveKeysToDelete.forEach(function (key) {
                localForage.removeItem(key);
            });
            this.setState({
                selectedSaveKey: this.state.saveKeysToDelete.indexOf(this.state.selectedSaveKey) !== -1 ?
                    null :
                    this.state.selectedSaveKey,
                saveKeysToDelete: [],
            }, function () {
                if (_this.afterConfirmDeleteCallback) {
                    var afterConfirmDeleteCallback = _this.afterConfirmDeleteCallback;
                    _this.afterConfirmDeleteCallback = undefined;
                    afterConfirmDeleteCallback();
                }
            });
        };
        LoadGameComponent.prototype.handleMarkForDeletion = function (saveKey) {
            this.setState({
                saveKeysToDelete: this.state.saveKeysToDelete.concat(saveKey),
            });
        };
        LoadGameComponent.prototype.handleUndoMarkForDeletion = function (saveKey) {
            this.setState({
                saveKeysToDelete: this.state.saveKeysToDelete.filter(function (currentKey) {
                    return currentKey !== saveKey;
                }),
            });
        };
        LoadGameComponent.prototype.closeConfirmDeleteSavesPopup = function () {
            this.setState({ hasConfirmDeleteSavePopup: false });
        };
        LoadGameComponent.prototype.handleClose = function () {
            this.props.handleClose();
        };
        return LoadGameComponent;
    }(React.Component));
    exports.LoadGameComponent = LoadGameComponent;
    exports.LoadGame = React.createFactory(LoadGameComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/saves/SaveGame", ["require", "exports", "react", "react-dom-factories", "localforage", "modules/defaultui/localization/localize", "src/App", "src/storageStrings", "modules/defaultui/uicomponents/windows/DialogBox", "modules/defaultui/uicomponents/saves/SaveList"], function (require, exports, React, ReactDOMElements, localForage, localize_1, App_1, storageStrings_1, DialogBox_1, SaveList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SaveGameComponent = (function (_super) {
        __extends(SaveGameComponent, _super);
        function SaveGameComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "SaveGame";
            _this.state = {
                saveName: App_1.app.game.gameStorageKey ?
                    App_1.app.game.gameStorageKey.replace(storageStrings_1.storageStrings.savePrefix, "") :
                    "",
                hasConfirmOverwritePopup: false,
            };
            _this.okButtonElement = React.createRef();
            _this.saveNameElement = React.createRef();
            _this.bindMethods();
            return _this;
        }
        SaveGameComponent.prototype.componentDidMount = function () {
            if (this.state.saveName) {
                this.okButtonElement.current.focus();
            }
            else {
                this.saveNameElement.current.focus();
            }
        };
        SaveGameComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "save-game",
            }, !this.state.hasConfirmOverwritePopup ? null :
                DialogBox_1.DialogBox({
                    title: localize_1.localize("confirmOverwrite")(),
                    handleOk: this.saveGame,
                    handleCancel: this.closeConfirmOverwritePopup,
                }, localize_1.localize("promptOverwrite")({
                    toOverWrite: this.state.saveName,
                })), SaveList_1.SaveList({
                onRowChange: this.handleRowChange,
                selectedKey: App_1.app.game.gameStorageKey,
                autoSelect: false,
                onDoubleClick: this.saveGame,
            }), ReactDOMElements.form({
                className: "save-game-form",
                onSubmit: this.handleSave,
                action: "javascript:void(0);",
            }, ReactDOMElements.input({
                className: "save-game-name",
                ref: this.saveNameElement,
                type: "text",
                value: this.state.saveName,
                onChange: this.handleSaveNameInput,
                maxLength: 64,
            })), ReactDOMElements.div({
                className: "save-game-buttons-container",
            }, ReactDOMElements.button({
                className: "save-game-button",
                onClick: this.handleSave,
                disabled: !this.state.saveName,
                ref: this.okButtonElement,
            }, localize_1.localize("save_action")()), ReactDOMElements.button({
                className: "save-game-button",
                onClick: this.handleClose,
            }, localize_1.localize("cancel")()))));
        };
        SaveGameComponent.prototype.bindMethods = function () {
            this.handleClose = this.handleClose.bind(this);
            this.setSaveName = this.setSaveName.bind(this);
            this.saveGame = this.saveGame.bind(this);
            this.handleSave = this.handleSave.bind(this);
            this.handleRowChange = this.handleRowChange.bind(this);
            this.handleSaveNameInput = this.handleSaveNameInput.bind(this);
            this.closeConfirmOverwritePopup = this.closeConfirmOverwritePopup.bind(this);
        };
        SaveGameComponent.prototype.setSaveName = function (newText) {
            this.setState({
                saveName: newText,
            });
        };
        SaveGameComponent.prototype.handleSaveNameInput = function (e) {
            var target = e.currentTarget;
            this.setSaveName(target.value);
        };
        SaveGameComponent.prototype.handleRowChange = function (row) {
            this.setSaveName(row.content.props.name);
        };
        SaveGameComponent.prototype.handleSave = function () {
            var _this = this;
            var saveName = this.state.saveName;
            var saveKey = storageStrings_1.storageStrings.savePrefix + saveName;
            localForage.getItem(saveKey).then(function (item) {
                if (item) {
                    _this.setState({ hasConfirmOverwritePopup: true });
                }
                else {
                    _this.saveGame();
                }
            });
        };
        SaveGameComponent.prototype.closeConfirmOverwritePopup = function () {
            this.setState({ hasConfirmOverwritePopup: false });
        };
        SaveGameComponent.prototype.saveGame = function () {
            App_1.app.game.save(this.state.saveName);
            this.handleClose();
        };
        SaveGameComponent.prototype.handleClose = function () {
            this.props.handleClose();
        };
        return SaveGameComponent;
    }(React.Component));
    exports.SaveGameComponent = SaveGameComponent;
    exports.SaveGame = React.createFactory(SaveGameComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/saves/SaveList", ["require", "exports", "react", "react-dom-factories", "localforage", "modules/defaultui/localization/localize", "src/utility", "modules/defaultui/uicomponents/list/List", "modules/defaultui/uicomponents/saves/SaveListItem", "src/storageStrings"], function (require, exports, React, ReactDOMElements, localForage, localize_1, utility_1, List_1, SaveListItem_1, storageStrings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SaveListComponent = (function (_super) {
        __extends(SaveListComponent, _super);
        function SaveListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "SaveList";
            _this.state =
                {
                    saveKeys: [],
                };
            return _this;
        }
        SaveListComponent.prototype.updateAvailableSaves = function () {
            var _this = this;
            var allSaveDataForDisplay = [];
            localForage.iterate(function (value, key) {
                if (key.indexOf(storageStrings_1.storageStrings.savePrefix) !== -1) {
                    var parsed = JSON.parse(value);
                    allSaveDataForDisplay.push({
                        key: key,
                        name: parsed.name,
                        date: new Date(parsed.date),
                    });
                }
            }).then(function () {
                _this.setState({ saveKeys: allSaveDataForDisplay });
            });
        };
        SaveListComponent.prototype.componentDidMount = function () {
            this.updateAvailableSaves();
        };
        SaveListComponent.prototype.render = function () {
            var _this = this;
            var rows = [];
            var selected = null;
            this.state.saveKeys.forEach(function (parsedData) {
                var isMarkedForDeletion = _this.props.saveKeysMarkedForDeletion &&
                    _this.props.saveKeysMarkedForDeletion.indexOf(parsedData.key) !== -1;
                var row = {
                    key: parsedData.key,
                    content: SaveListItem_1.SaveListItem({
                        storageKey: parsedData.key,
                        name: parsedData.name,
                        date: utility_1.prettifyDate(parsedData.date),
                        accurateDate: parsedData.date.toISOString(),
                        isMarkedForDeletion: isMarkedForDeletion,
                        onMarkForDeletion: _this.props.onMarkForDeletion ?
                            _this.props.onMarkForDeletion.bind(null, parsedData.key) :
                            null,
                        onUndoMarkForDeletion: _this.props.onUndoMarkForDeletion ?
                            _this.props.onUndoMarkForDeletion.bind(null, parsedData.key) :
                            null,
                        onDoubleClick: _this.props.onDoubleClick,
                    }),
                };
                rows.push(row);
                if (_this.props.selectedKey === parsedData.key) {
                    selected = row;
                }
            });
            var columns = [
                {
                    label: localize_1.localize("saveName")(),
                    key: "name",
                    defaultOrder: "asc",
                },
                {
                    label: localize_1.localize("date")(),
                    key: "date",
                    defaultOrder: "desc",
                    propToSortBy: "accurateDate",
                },
            ];
            if (this.props.allowDeletion) {
                columns.push({
                    label: localize_1.localize("del")(),
                    key: "delete",
                    defaultOrder: "asc",
                    notSortable: true,
                });
            }
            return (ReactDOMElements.div({ className: "save-list fixed-table-parent" }, List_1.List({
                listItems: rows,
                initialColumns: columns,
                initialSortOrder: [columns[1], columns[0]],
                onRowChange: this.props.onRowChange,
                autoSelect: selected ? false : this.props.autoSelect,
                initialSelected: selected,
                keyboardSelect: true,
                addSpacer: true,
            })));
        };
        return SaveListComponent;
    }(React.Component));
    exports.SaveListComponent = SaveListComponent;
    exports.SaveList = React.createFactory(SaveListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/saves/SaveListItem", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SaveListItemComponent = (function (_super) {
        __extends(SaveListItemComponent, _super);
        function SaveListItemComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "SaveListItem";
            _this.bindMethods();
            return _this;
        }
        SaveListItemComponent.prototype.bindMethods = function () {
            this.handleUndoMarkForDeletion = this.handleUndoMarkForDeletion.bind(this);
            this.handleMarkForDeletion = this.handleMarkForDeletion.bind(this);
            this.makeCell = this.makeCell.bind(this);
        };
        SaveListItemComponent.prototype.handleMarkForDeletion = function (e) {
            e.stopPropagation();
            this.props.onMarkForDeletion();
        };
        SaveListItemComponent.prototype.handleUndoMarkForDeletion = function (e) {
            e.stopPropagation();
            this.props.onUndoMarkForDeletion();
        };
        SaveListItemComponent.preventDefault = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        SaveListItemComponent.prototype.makeCell = function (type) {
            var cellProps = {};
            cellProps.key = type;
            cellProps.className = "save-list-item-cell" + " save-list-" + type;
            var cellContent;
            switch (type) {
                case "delete":
                    {
                        cellContent = "";
                        cellProps.onDoubleClick = SaveListItemComponent.preventDefault;
                        if (this.props.isMarkedForDeletion) {
                            cellProps.className += " undo-delete-button";
                            cellProps.onClick = this.handleUndoMarkForDeletion;
                        }
                        else {
                            cellProps.onClick = this.handleMarkForDeletion;
                        }
                        break;
                    }
                default:
                    {
                        cellContent = this.props[type];
                        break;
                    }
            }
            return (ReactDOMElements.td(cellProps, cellContent));
        };
        SaveListItemComponent.prototype.render = function () {
            var columns = this.props.activeColumns;
            var cells = [];
            for (var i = 0; i < columns.length; i++) {
                var cell = this.makeCell(columns[i].key);
                cells.push(cell);
            }
            var rowProps = {
                className: "save-list-item",
                onClick: this.props.handleClick,
                onDoubleClick: this.props.onDoubleClick,
            };
            if (this.props.isMarkedForDeletion) {
                rowProps.className += " marked-for-deletion";
            }
            return (ReactDOMElements.tr(rowProps, cells));
        };
        return SaveListItemComponent;
    }(React.Component));
    exports.SaveListItemComponent = SaveListItemComponent;
    exports.SaveListItem = React.createFactory(SaveListItemComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/setupgame/ColorPicker", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/Color", "modules/defaultui/uicomponents/generic/NumberInput", "modules/defaultui/uicomponents/mixins/AutoPositioner", "modules/defaultui/uicomponents/mixins/applyMixins", "modules/defaultui/uicomponents/setupgame/ColorPickerSlider"], function (require, exports, React, ReactDOMElements, localize_1, Color_1, NumberInput_1, AutoPositioner_1, applyMixins_1, ColorPickerSlider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ColorPickerComponent = (function (_super) {
        __extends(ColorPickerComponent, _super);
        function ColorPickerComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ColorPicker";
            _this.onChangeTimeoutHandle = null;
            _this.ownDOMNode = React.createRef();
            if (_this.props.autoPositionerProps) {
                applyMixins_1.applyMixins(_this, new AutoPositioner_1.AutoPositioner(_this, _this.ownDOMNode));
            }
            var initialColor = _this.props.initialColor || new Color_1.Color(1, 1, 1);
            _this.state = _this.getStateFromColor(initialColor);
            _this.bindMethods();
            return _this;
        }
        ColorPickerComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({ className: "color-picker", ref: this.ownDOMNode }, ReactDOMElements.div({ className: "color-picker-hsv" }, this.makeHsvInputs("hue"), this.makeHsvInputs("sat"), this.makeHsvInputs("val")), ReactDOMElements.div({ className: "color-picker-input-container", key: "hex" }, ReactDOMElements.label({ className: "color-picker-label" }, "Hex:"), !this.props.generateColor ? null :
                ReactDOMElements.button({
                    className: "color-picker-button",
                    onClick: this.autoGenerateColor,
                }, localize_1.localize("auto")()), !this.props.isNullable ? null :
                ReactDOMElements.button({
                    className: "color-picker-button",
                    onClick: this.nullifyColor,
                }, localize_1.localize("clear")()), NumberInput_1.NumberInput({
                noSpinner: true,
                attributes: {
                    className: "color-picker-input",
                },
                value: this.state.hexColor,
                valueStringIsValid: function (valueString) {
                    return /^#*[0-9A-F]{6}$/i.test(valueString);
                },
                stylizeValue: function (value) {
                    return "#" + Color_1.Color.fromHex(value).getHexString();
                },
                getValueFromValueString: function (valueString) {
                    return Color_1.Color.fromHexString(valueString).getHex();
                },
                onChange: function (value) {
                    _this.setState({
                        hexColor: value,
                    });
                    _this.updateFromHex(value);
                },
            }))));
        };
        ColorPickerComponent.prototype.bindMethods = function () {
            this.setHue = this.setHue.bind(this);
            this.setSat = this.setSat.bind(this);
            this.makeHsvInputs = this.makeHsvInputs.bind(this);
            this.autoGenerateColor = this.autoGenerateColor.bind(this);
            this.updateFromHex = this.updateFromHex.bind(this);
            this.updateFromHsv = this.updateFromHsv.bind(this);
            this.makeGradientStyle = this.makeGradientStyle.bind(this);
            this.triggerParentOnChange = this.triggerParentOnChange.bind(this);
            this.setVal = this.setVal.bind(this);
            this.makeGradientString = this.makeGradientString.bind(this);
            this.nullifyColor = this.nullifyColor.bind(this);
        };
        ColorPickerComponent.prototype.getStateFromColor = function (color) {
            var hsvColor = Color_1.Color.convertScalarsToDegrees(color.getHSV());
            return ({
                hexColor: color.getHex(),
                hue: hsvColor[0],
                sat: hsvColor[1],
                val: hsvColor[2],
            });
        };
        ColorPickerComponent.prototype.triggerParentOnChange = function (color, isNull) {
            if (this.onChangeTimeoutHandle) {
                window.clearTimeout(this.onChangeTimeoutHandle);
                this.onChangeTimeoutHandle = null;
            }
            if (this.props.minUpdateBuffer) {
                this.onChangeTimeoutHandle = window.setTimeout(function () {
                }, this.props.minUpdateBuffer || 0);
            }
            else {
                this.props.onChange(color, isNull);
            }
        };
        ColorPickerComponent.prototype.updateFromHsv = function (hue, sat, val, e) {
            if (e && e.type !== "change") {
                return;
            }
            var color = Color_1.Color.fromHSV.apply(Color_1.Color, Color_1.Color.convertDegreesToScalars([hue, sat, val]));
            this.setState({
                hexColor: color.getHex(),
            });
            if (this.props.onChange) {
                this.triggerParentOnChange(color, false);
            }
        };
        ColorPickerComponent.prototype.updateFromHex = function (hexColor) {
            var color = Color_1.Color.fromHex(hexColor);
            var hsvColor = Color_1.Color.convertScalarsToDegrees(color.getHSV());
            this.setState({
                hue: Math.round(hsvColor[0]),
                sat: Math.round(hsvColor[1]),
                val: Math.round(hsvColor[2]),
            });
            if (this.props.onChange) {
                this.triggerParentOnChange(color, false);
            }
        };
        ColorPickerComponent.prototype.setHue = function (hue) {
            this.setState({ hue: hue });
            this.updateFromHsv(hue, this.state.sat, this.state.val);
        };
        ColorPickerComponent.prototype.setSat = function (sat) {
            this.setState({ sat: sat });
            this.updateFromHsv(this.state.hue, sat, this.state.val);
        };
        ColorPickerComponent.prototype.setVal = function (val) {
            this.setState({ val: val });
            this.updateFromHsv(this.state.hue, this.state.sat, val);
        };
        ColorPickerComponent.prototype.autoGenerateColor = function () {
            var color = this.props.generateColor();
            var hexColor = color.getHex();
            this.setState({
                hexColor: hexColor,
            });
            this.updateFromHex(hexColor);
        };
        ColorPickerComponent.prototype.nullifyColor = function () {
            if (this.props.onChange) {
                this.triggerParentOnChange(Color_1.Color.fromHex(this.state.hexColor), true);
            }
        };
        ColorPickerComponent.prototype.makeGradientString = function (min, max) {
            return ("linear-gradient(to right, " +
                min + " 0%, " +
                max + " 100%)");
        };
        ColorPickerComponent.prototype.makeHexStringFromHSVDegreeArray = function (hsv) {
            var color = Color_1.Color.fromHSV.apply(Color_1.Color, Color_1.Color.convertDegreesToScalars(hsv));
            return color.getHexString();
        };
        ColorPickerComponent.prototype.makeGradientStyle = function (type) {
            var hue = this.state.hue;
            var sat = this.state.sat;
            var val = this.state.val;
            switch (type) {
                case "hue":
                    {
                        return "linear-gradient(to right, #FF0000 0%, #FFFF00 17%, #00FF00 33%, #00FFFF 50%, #0000FF 67%, #FF00FF 83%, #FF0000 100%)";
                    }
                case "sat":
                    {
                        var min = "#" + this.makeHexStringFromHSVDegreeArray([hue, 0, val]);
                        var max = "#" + this.makeHexStringFromHSVDegreeArray([hue, 100, val]);
                        return this.makeGradientString(min, max);
                    }
                case "val":
                    {
                        var min = "#" + this.makeHexStringFromHSVDegreeArray([hue, sat, 0]);
                        var max = "#" + this.makeHexStringFromHSVDegreeArray([hue, sat, 100]);
                        return this.makeGradientString(min, max);
                    }
            }
        };
        ColorPickerComponent.prototype.makeHsvInputs = function (type) {
            var label = type[0].toUpperCase() + ":";
            var max = type === "hue" ? 360 : 100;
            var updateFunctions = {
                hue: this.setHue,
                sat: this.setSat,
                val: this.setVal,
            };
            return (ReactDOMElements.div({ className: "color-picker-input-container", key: type }, ReactDOMElements.label({ className: "color-picker-label" }, label), ColorPickerSlider_1.ColorPickerSlider({
                value: this.state[type],
                max: max,
                onChange: updateFunctions[type],
                backgroundStyle: this.makeGradientStyle(type),
            }), NumberInput_1.NumberInput({
                attributes: {
                    className: "color-picker-input",
                },
                value: this.state[type],
                onChange: updateFunctions[type],
                min: 0,
                max: max,
                step: 1,
                canWrap: type === "hue",
            })));
        };
        return ColorPickerComponent;
    }(React.Component));
    exports.ColorPickerComponent = ColorPickerComponent;
    exports.ColorPicker = React.createFactory(ColorPickerComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/setupgame/ColorPickerSlider", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ColorPickerSliderComponent = (function (_super) {
        __extends(ColorPickerSliderComponent, _super);
        function ColorPickerSliderComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ColorPickerSlider";
            _this.handleChangeEvent = _this.handleChangeEvent.bind(_this);
            return _this;
        }
        ColorPickerSliderComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "color-picker-slider-background",
                style: {
                    background: this.props.backgroundStyle,
                },
            }, ReactDOMElements.input({
                className: "color-picker-slider",
                type: "range",
                min: 0,
                max: this.props.max,
                step: 1,
                value: "" + this.props.value,
                onChange: this.handleChangeEvent,
                onMouseUp: this.handleChangeEvent,
                onTouchEnd: this.handleChangeEvent,
            })));
        };
        ColorPickerSliderComponent.prototype.handleChangeEvent = function (e) {
            var target = e.currentTarget;
            var value = parseInt(target.value);
            this.props.onChange(value);
        };
        return ColorPickerSliderComponent;
    }(React.Component));
    exports.ColorPickerSliderComponent = ColorPickerSliderComponent;
    exports.ColorPickerSlider = React.createFactory(ColorPickerSliderComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/setupgame/ColorSetter", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/setupgame/ColorPicker"], function (require, exports, React, ReactDOMElements, ColorPicker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ColorSetterComponent = (function (_super) {
        __extends(ColorSetterComponent, _super);
        function ColorSetterComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ColorSetter";
            _this.ownNode = React.createRef();
            _this.state =
                {
                    isActive: false,
                };
            _this.handleClick = _this.handleClick.bind(_this);
            _this.toggleActive = _this.toggleActive.bind(_this);
            _this.setAsInactive = _this.setAsInactive.bind(_this);
            _this.getClientRect = _this.getClientRect.bind(_this);
            return _this;
        }
        ColorSetterComponent.prototype.componentWillUnmount = function () {
            document.removeEventListener("click", this.handleClick);
        };
        ColorSetterComponent.prototype.render = function () {
            var displayElement = !this.props.color ?
                ReactDOMElements.img({
                    className: "color-setter-display",
                    src: "img/icons/nullcolor.png",
                    onClick: this.toggleActive,
                }) :
                ReactDOMElements.div({
                    className: "color-setter-display",
                    style: {
                        backgroundColor: "#" + this.props.color.getHexString(),
                    },
                    onClick: this.toggleActive,
                });
            return (ReactDOMElements.div({
                className: "color-setter",
                ref: this.ownNode,
            }, displayElement, this.state.isActive ?
                ColorPicker_1.ColorPicker({
                    initialColor: this.props.color,
                    generateColor: this.props.generateColor,
                    onChange: this.props.onChange,
                    minUpdateBuffer: this.props.minUpdateBuffer,
                    isNullable: true,
                    autoPositionerProps: {
                        getParentClientRect: this.getClientRect,
                        positionOnUpdate: true,
                        ySide: this.props.position ? this.props.position.ySide : "outerBottom",
                        xSide: this.props.position ? this.props.position.xSide : "innerLeft",
                        positionOnResize: true,
                    },
                }) : null));
        };
        ColorSetterComponent.prototype.setAsInactive = function () {
            if (this.state.isActive) {
                this.setState({ isActive: false });
                document.removeEventListener("click", this.handleClick);
            }
        };
        ColorSetterComponent.prototype.handleClick = function (e) {
            var node = this.ownNode.current;
            var target = e.target;
            if (target === node || node.contains(target)) {
                return;
            }
            else {
                this.setAsInactive();
            }
        };
        ColorSetterComponent.prototype.toggleActive = function () {
            if (this.state.isActive) {
                this.setAsInactive();
            }
            else {
                if (this.props.setAsActive) {
                    this.props.setAsActive(this);
                }
                this.setState({ isActive: true });
                document.addEventListener("click", this.handleClick, false);
            }
        };
        ColorSetterComponent.prototype.getClientRect = function () {
            var firstChild = this.ownNode.current.firstChild;
            return firstChild.getBoundingClientRect();
        };
        return ColorSetterComponent;
    }(React.Component));
    exports.ColorSetterComponent = ColorSetterComponent;
    exports.ColorSetter = React.createFactory(ColorSetterComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/setupgame/EmblemColorPicker", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/setupgame/ColorSetter"], function (require, exports, React, ReactDOMElements, ColorSetter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EmblemColorPickerComponent = (function (_super) {
        __extends(EmblemColorPickerComponent, _super);
        function EmblemColorPickerComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "EmblemColorPicker";
            _this.handleColorChange = _this.handleColorChange.bind(_this);
            return _this;
        }
        EmblemColorPickerComponent.prototype.render = function () {
            var colorMappingData = this.props.emblemTemplate.colorMappings[this.props.colorIndex];
            return (ReactDOMElements.div({
                className: "emblem-color-picker",
            }, ReactDOMElements.div({
                className: "emblem-color-picker-title",
            }, colorMappingData.displayName), ColorSetter_1.ColorSetter({
                color: this.props.colors[this.props.colorIndex],
                onChange: this.handleColorChange,
                position: {
                    xSide: "outerLeft",
                    ySide: "innerTop",
                },
            })));
        };
        EmblemColorPickerComponent.prototype.handleColorChange = function (color, isNull) {
            this.props.colors[this.props.colorIndex] = isNull ? null : color;
            this.props.onColorChange(this.props.colors);
        };
        return EmblemColorPickerComponent;
    }(React.Component));
    exports.EmblemColorPickerComponent = EmblemColorPickerComponent;
    exports.EmblemColorPicker = React.createFactory(EmblemColorPickerComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/setupgame/EmblemEditor", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/setupgame/EmblemColorPicker", "modules/defaultui/uicomponents/setupgame/EmblemPicker"], function (require, exports, React, ReactDOMElements, localize_1, EmblemColorPicker_1, EmblemPicker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EmblemEditorComponent = (function (_super) {
        __extends(EmblemEditorComponent, _super);
        function EmblemEditorComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "EmblemEditor";
            _this.state =
                {
                    colorPickerIsCollapsed: false,
                    emblemPickerIsCollapsed: false,
                };
            _this.handleEmblemColorChange = _this.handleEmblemColorChange.bind(_this);
            _this.toggleColorPickerCollapse = _this.toggleColorPickerCollapse.bind(_this);
            _this.toggleEmblemPickerCollapse = _this.toggleEmblemPickerCollapse.bind(_this);
            return _this;
        }
        EmblemEditorComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "emblem-editor",
            }, ReactDOMElements.div({
                className: "flag-picker-title" + (this.state.colorPickerIsCollapsed ? " collapsed" : " collapsible"),
                onClick: this.toggleColorPickerCollapse,
            }, localize_1.localize("emblemColor")()), this.state.colorPickerIsCollapsed ?
                null :
                ReactDOMElements.div({
                    className: "emblem-color-pickers-container",
                }, this.props.selectedEmblemTemplate.colorMappings.map(function (colorMappingData, i) {
                    return EmblemColorPicker_1.EmblemColorPicker({
                        key: i,
                        colors: _this.props.colors,
                        colorIndex: i,
                        emblemTemplate: _this.props.selectedEmblemTemplate,
                        onColorChange: _this.handleEmblemColorChange,
                    });
                })), ReactDOMElements.div({
                className: "flag-picker-title" + (this.state.emblemPickerIsCollapsed ? " collapsed" : " collapsible"),
                onClick: this.toggleEmblemPickerCollapse,
            }, localize_1.localize("emblems")()), this.state.emblemPickerIsCollapsed ?
                null :
                EmblemPicker_1.EmblemPicker({
                    colors: this.props.colors,
                    backgroundColor: this.props.backgroundColor,
                    selectedEmblemTemplate: this.props.selectedEmblemTemplate,
                    setEmblemTemplate: this.props.setEmblemTemplate,
                })));
        };
        EmblemEditorComponent.prototype.handleEmblemColorChange = function (colors) {
            this.props.setEmblemColors(colors);
        };
        EmblemEditorComponent.prototype.toggleColorPickerCollapse = function () {
            this.setState({ colorPickerIsCollapsed: !this.state.colorPickerIsCollapsed });
        };
        EmblemEditorComponent.prototype.toggleEmblemPickerCollapse = function () {
            this.setState({ emblemPickerIsCollapsed: !this.state.emblemPickerIsCollapsed });
        };
        return EmblemEditorComponent;
    }(React.PureComponent));
    exports.EmblemEditorComponent = EmblemEditorComponent;
    exports.EmblemEditor = React.createFactory(EmblemEditorComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/setupgame/EmblemPicker", ["require", "exports", "react", "react-dom-factories", "src/activeModuleData", "modules/defaultui/uicomponents/Emblem"], function (require, exports, React, ReactDOMElements, activeModuleData_1, Emblem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EmblemPickerComponent = (function (_super) {
        __extends(EmblemPickerComponent, _super);
        function EmblemPickerComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "EmblemPicker";
            return _this;
        }
        EmblemPickerComponent.prototype.render = function () {
            var emblemElements = [];
            for (var emblemType in activeModuleData_1.activeModuleData.templates.SubEmblems) {
                var template = activeModuleData_1.activeModuleData.templates.SubEmblems[emblemType];
                var className = "emblem-picker-image";
                var templateIsSelected = this.props.selectedEmblemTemplate && this.props.selectedEmblemTemplate.key === template.key;
                if (templateIsSelected) {
                    className += " selected-emblem";
                }
                emblemElements.push(ReactDOMElements.div({
                    className: "emblem-picker-container",
                    key: template.key,
                    onClick: this.handleSelectEmblem.bind(this, template),
                    style: !this.props.backgroundColor ? null :
                        {
                            backgroundColor: "#" + this.props.backgroundColor.getHexString(),
                        },
                }, Emblem_1.Emblem({
                    template: template,
                    colors: this.props.colors,
                    containerProps: {
                        className: className,
                    },
                })));
            }
            return (ReactDOMElements.div({
                className: "emblem-picker",
            }, ReactDOMElements.div({ className: "emblem-picker-emblem-list" }, emblemElements)));
        };
        EmblemPickerComponent.prototype.handleSelectEmblem = function (emblem) {
            if (this.props.selectedEmblemTemplate === emblem) {
                this.props.setEmblemTemplate(null, this.props.colors);
            }
            else {
                this.props.setEmblemTemplate(emblem, this.props.colors);
            }
        };
        return EmblemPickerComponent;
    }(React.PureComponent));
    exports.EmblemPickerComponent = EmblemPickerComponent;
    exports.EmblemPicker = React.createFactory(EmblemPickerComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/setupgame/EmblemSetter", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/Emblem", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, Emblem_1, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EmblemSetterComponent = (function (_super) {
        __extends(EmblemSetterComponent, _super);
        function EmblemSetterComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "EmblemSetter";
            return _this;
        }
        EmblemSetterComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "emblem-setter",
            }, Emblem_1.Emblem({
                key: "emblem",
                template: this.props.emblem.template,
                colors: this.props.emblem.colors,
                containerProps: {
                    style: !this.props.backgroundColor ? null :
                        {
                            backgroundColor: "#" + this.props.backgroundColor.getHexString(),
                        },
                    title: this.props.emblem.template.key + "\n\n" + localize_1.localize("emblemSetterTooltip")(),
                    onClick: this.props.toggleActive,
                    onContextMenu: function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        _this.props.remove();
                    },
                },
            })));
        };
        return EmblemSetterComponent;
    }(React.PureComponent));
    exports.EmblemSetterComponent = EmblemSetterComponent;
    exports.EmblemSetter = React.createFactory(EmblemSetterComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/setupgame/EmblemSetterList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/setupgame/EmblemSetter"], function (require, exports, React, ReactDOMElements, localize_1, EmblemSetter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EmblemSetterListComponent = (function (_super) {
        __extends(EmblemSetterListComponent, _super);
        function EmblemSetterListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "EmblemSetterList";
            return _this;
        }
        EmblemSetterListComponent.prototype.render = function () {
            var _this = this;
            var canAddNewEmblem = this.props.emblems.length < this.props.maxEmblems;
            return (ReactDOMElements.ol({
                className: "emblem-setter-list",
            }, this.props.emblems.map(function (emblemProps) {
                var id = emblemProps.id;
                return EmblemSetter_1.EmblemSetter({
                    key: id,
                    toggleActive: _this.props.toggleActiveEmblem.bind(null, id),
                    remove: _this.props.removeEmblem.bind(null, id),
                    emblem: emblemProps,
                    backgroundColor: _this.props.backgroundColor,
                });
            }), ReactDOMElements.button({
                className: "add-new-emblem-button",
                onClick: this.props.addEmblem,
                title: localize_1.localize("addNewEmblem")(),
                disabled: !canAddNewEmblem,
            })));
        };
        return EmblemSetterListComponent;
    }(React.Component));
    exports.EmblemSetterListComponent = EmblemSetterListComponent;
    exports.EmblemSetterList = React.createFactory(EmblemSetterListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/setupgame/FlagEditor", ["require", "exports", "react", "react-dom-factories", "src/Emblem", "src/Flag", "modules/defaultui/uicomponents/mixins/AutoPositioner", "modules/defaultui/uicomponents/mixins/applyMixins", "modules/defaultui/uicomponents/setupgame/EmblemEditor", "modules/defaultui/uicomponents/setupgame/EmblemSetterList"], function (require, exports, React, ReactDOMElements, Emblem_1, Flag_1, AutoPositioner_1, applyMixins_1, EmblemEditor_1, EmblemSetterList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var maxEmblems = 4;
    var FlagEditorComponent = (function (_super) {
        __extends(FlagEditorComponent, _super);
        function FlagEditorComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "FlagEditor";
            _this.idGenerator = 0;
            _this.ownDOMNode = React.createRef();
            _this.state =
                {
                    emblems: _this.getEmblemDataFromFlag(props.parentFlag),
                    activeEmblemSetterId: null,
                };
            if (_this.props.autoPositionerProps) {
                applyMixins_1.applyMixins(_this, new AutoPositioner_1.AutoPositioner(_this, _this.ownDOMNode));
            }
            _this.randomize = _this.randomize.bind(_this);
            _this.generateFlag = _this.generateFlag.bind(_this);
            _this.getEmblemDataFromFlag = _this.getEmblemDataFromFlag.bind(_this);
            _this.addEmblem = _this.addEmblem.bind(_this);
            _this.getEmblemProps = _this.getEmblemProps.bind(_this);
            _this.removeEmblem = _this.removeEmblem.bind(_this);
            _this.setEmblemTemplate = _this.setEmblemTemplate.bind(_this);
            _this.setEmblemColors = _this.setEmblemColors.bind(_this);
            _this.toggleActiveEmblemSetter = _this.toggleActiveEmblemSetter.bind(_this);
            return _this;
        }
        FlagEditorComponent.emblemDataToEmblem = function (emblemData) {
            return new Emblem_1.Emblem(emblemData.colors, emblemData.template);
        };
        FlagEditorComponent.emblemToEmblemData = function (emblem, id) {
            return ({
                colors: emblem.colors.slice(0),
                template: emblem.template,
                id: id,
            });
        };
        FlagEditorComponent.prototype.randomize = function () {
            var flag = Flag_1.Flag.generateRandom(this.props.backgroundColor, this.props.playerSecondaryColor);
            this.setState({
                emblems: this.getEmblemDataFromFlag(flag),
            });
        };
        FlagEditorComponent.prototype.generateFlag = function () {
            var emblems = this.state.emblems.map(function (emblemData) { return FlagEditorComponent.emblemDataToEmblem(emblemData); });
            var flag = new Flag_1.Flag(this.props.backgroundColor, emblems);
            return flag;
        };
        FlagEditorComponent.prototype.render = function () {
            var activeEmblemData = this.getActiveEmblemData();
            return (ReactDOMElements.div({
                className: "flag-editor",
                ref: this.ownDOMNode,
            }, EmblemSetterList_1.EmblemSetterList({
                backgroundColor: this.props.backgroundColor,
                emblems: this.state.emblems,
                maxEmblems: maxEmblems,
                toggleActiveEmblem: this.toggleActiveEmblemSetter,
                addEmblem: this.addEmblem,
                removeEmblem: this.removeEmblem,
            }), !activeEmblemData ? null :
                EmblemEditor_1.EmblemEditor({
                    key: "emblemEditor",
                    colors: activeEmblemData.template.getColors ?
                        activeEmblemData.template.getColors(this.props.backgroundColor, activeEmblemData.colors) :
                        activeEmblemData.colors,
                    backgroundColor: this.props.backgroundColor,
                    selectedEmblemTemplate: activeEmblemData.template,
                    setEmblemTemplate: this.setEmblemTemplate.bind(this, this.state.activeEmblemSetterId),
                    setEmblemColors: this.setEmblemColors.bind(this, this.state.activeEmblemSetterId),
                })));
        };
        FlagEditorComponent.prototype.triggerParentFlagUpdate = function () {
            this.props.updateParentFlag(this.generateFlag());
        };
        FlagEditorComponent.prototype.getEmblemDataFromFlag = function (flag) {
            var _this = this;
            if (!flag) {
                return [];
            }
            else {
                return flag.emblems.map(function (emblem) { return FlagEditorComponent.emblemToEmblemData(emblem, _this.idGenerator++); });
            }
        };
        FlagEditorComponent.prototype.toggleActiveEmblemSetter = function (id) {
            if (this.state.activeEmblemSetterId === id) {
                this.setState({ activeEmblemSetterId: null });
            }
            else {
                this.setState({ activeEmblemSetterId: id });
            }
        };
        FlagEditorComponent.prototype.addEmblem = function () {
            var _this = this;
            var emblem = Emblem_1.Emblem.generateRandom(this.props.backgroundColor);
            var emblemData = FlagEditorComponent.emblemToEmblemData(emblem, this.idGenerator++);
            this.setState({
                emblems: this.state.emblems.concat([emblemData]),
            }, function () {
                _this.triggerParentFlagUpdate();
            });
        };
        FlagEditorComponent.prototype.getEmblemProps = function (id) {
            for (var i = 0; i < this.state.emblems.length; i++) {
                if (this.state.emblems[i].id === id) {
                    return this.state.emblems[i];
                }
            }
            return null;
        };
        FlagEditorComponent.prototype.removeEmblem = function (idToFilter) {
            var _this = this;
            this.setState({
                emblems: this.state.emblems.filter(function (emblemProps) {
                    return emblemProps.id !== idToFilter;
                }),
            }, function () {
                _this.triggerParentFlagUpdate();
            });
        };
        FlagEditorComponent.prototype.setEmblemTemplate = function (id, template) {
            var emblem = this.getEmblemProps(id);
            emblem.template = template;
            this.triggerParentFlagUpdate();
        };
        FlagEditorComponent.prototype.setEmblemColors = function (id, colors) {
            var emblem = this.getEmblemProps(id);
            emblem.colors = colors;
            this.triggerParentFlagUpdate();
        };
        FlagEditorComponent.prototype.getActiveEmblemData = function () {
            var id = this.state.activeEmblemSetterId;
            if (isFinite(id) && !isNaN(id)) {
                for (var i = 0; i < this.state.emblems.length; i++) {
                    if (this.state.emblems[i].id === id) {
                        return this.state.emblems[i];
                    }
                }
            }
            return null;
        };
        return FlagEditorComponent;
    }(React.PureComponent));
    exports.FlagEditorComponent = FlagEditorComponent;
    exports.FlagEditor = React.createFactory(FlagEditorComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/setupgame/FlagSetter", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/PlayerFlag", "modules/defaultui/uicomponents/windows/DefaultWindow", "modules/defaultui/uicomponents/setupgame/FlagEditor"], function (require, exports, React, ReactDOMElements, localize_1, PlayerFlag_1, DefaultWindow_1, FlagEditor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FlagSetterComponent = (function (_super) {
        __extends(FlagSetterComponent, _super);
        function FlagSetterComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "FlagSetter";
            _this.playerFlagContainer = React.createRef();
            _this.state =
                {
                    isActive: false,
                };
            _this.setAsInactive = _this.setAsInactive.bind(_this);
            _this.toggleActive = _this.toggleActive.bind(_this);
            _this.getClientRect = _this.getClientRect.bind(_this);
            return _this;
        }
        FlagSetterComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "flag-setter",
            }, PlayerFlag_1.PlayerFlag({
                flag: this.props.flag,
                props: {
                    className: "flag-setter-display",
                    onClick: this.toggleActive,
                },
                ref: this.playerFlagContainer,
            }), !this.state.isActive ? null :
                ReactDOMElements.div({
                    className: "popup-container",
                }, DefaultWindow_1.DefaultWindow({
                    title: localize_1.localize("editFlag")(),
                    handleClose: this.setAsInactive,
                    isResizable: false,
                    attributes: { className: "force-auto-dimensions" },
                    getInitialPosition: function (popupRect) {
                        var parentRect = _this.getClientRect();
                        return ({
                            left: parentRect.right,
                            top: parentRect.top - popupRect.height / 3,
                            width: popupRect.width,
                            height: popupRect.height,
                        });
                    },
                }, FlagEditor_1.FlagEditor({
                    parentFlag: this.props.flag,
                    backgroundColor: this.props.mainColor,
                    playerSecondaryColor: this.props.secondaryColor,
                    updateParentFlag: this.props.updateParentFlag,
                })))));
        };
        FlagSetterComponent.prototype.toggleActive = function () {
            if (this.state.isActive) {
                this.setAsInactive();
            }
            else {
                if (this.props.setAsActive) {
                    this.props.setAsActive(this);
                }
                this.setState({ isActive: true });
            }
        };
        FlagSetterComponent.prototype.setAsInactive = function () {
            if (this.state.isActive) {
                this.setState({ isActive: false });
            }
        };
        FlagSetterComponent.prototype.getClientRect = function () {
            var flagDisplayElement = this.playerFlagContainer.current.containerElement.current;
            return flagDisplayElement.getBoundingClientRect();
        };
        return FlagSetterComponent;
    }(React.Component));
    exports.FlagSetterComponent = FlagSetterComponent;
    exports.FlagSetter = React.createFactory(FlagSetterComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/setupgame/MapGenOption", ["require", "exports", "react", "react-dom-factories", "src/utility", "modules/defaultui/uicomponents/generic/NumberInput"], function (require, exports, React, ReactDOMElements, utility_1, NumberInput_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapGenOptionComponent = (function (_super) {
        __extends(MapGenOptionComponent, _super);
        function MapGenOptionComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "MapGenOption";
            _this.bindMethods();
            return _this;
        }
        MapGenOptionComponent.prototype.handleChange = function (e) {
            var target = e.currentTarget;
            var option = this.props.option;
            var newValue = utility_1.clamp(parseFloat(target.value), option.range.min, option.range.max);
            this.props.onChange(this.props.id, newValue);
        };
        MapGenOptionComponent.prototype.shouldComponentUpdate = function (newProps) {
            return newProps.value !== this.props.value;
        };
        MapGenOptionComponent.prototype.bindMethods = function () {
            this.handleChange = this.handleChange.bind(this);
        };
        MapGenOptionComponent.prototype.render = function () {
            var _this = this;
            var option = this.props.option;
            var range = option.range;
            var id = "mapGenOption_" + this.props.id;
            ["min", "max", "step"].forEach(function (prop) {
                if (!range[prop]) {
                    throw new Error("No property " + prop + " specified on map gen option " + _this.props.id);
                }
            });
            return (ReactDOMElements.div({
                className: "map-gen-option",
            }, ReactDOMElements.label({
                className: "map-gen-option-label",
                title: option.displayName,
                htmlFor: id,
            }, option.displayName), ReactDOMElements.input({
                className: "map-gen-option-slider",
                id: id,
                type: "range",
                min: range.min,
                max: range.max,
                step: range.step,
                value: "" + this.props.value,
                onChange: this.handleChange,
            }), NumberInput_1.NumberInput({
                attributes: {
                    className: "map-gen-option-value",
                    title: option.displayName,
                },
                value: this.props.value,
                min: range.min,
                max: range.max,
                step: range.step,
                canWrap: false,
                onChange: function (newValue) { return _this.props.onChange(_this.props.id, newValue); },
            })));
        };
        return MapGenOptionComponent;
    }(React.Component));
    exports.MapGenOptionComponent = MapGenOptionComponent;
    exports.MapGenOption = React.createFactory(MapGenOptionComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/setupgame/MapGenOptions", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/utility", "modules/defaultui/uicomponents/options/OptionsGroup", "modules/defaultui/uicomponents/setupgame/MapGenOption"], function (require, exports, React, ReactDOMElements, localize_1, utility_1, OptionsGroup_1, MapGenOption_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapGenOptionsComponent = (function (_super) {
        __extends(MapGenOptionsComponent, _super);
        function MapGenOptionsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "MapGenOptions";
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        MapGenOptionsComponent.prototype.bindMethods = function () {
            this.resetValuesToDefault = this.resetValuesToDefault.bind(this);
            this.handleOptionChange = this.handleOptionChange.bind(this);
            this.getDefaultValues = this.getDefaultValues.bind(this);
            this.getOptionValue = this.getOptionValue.bind(this);
            this.randomizeOptions = this.randomizeOptions.bind(this);
            this.getOptionValuesForTemplate = this.getOptionValuesForTemplate.bind(this);
        };
        MapGenOptionsComponent.prototype.getInitialStateTODO = function () {
            return this.getDefaultValues(this.props.mapGenTemplate);
        };
        MapGenOptionsComponent.prototype.componentDidUpdate = function (prevProps) {
            if (prevProps.mapGenTemplate.key !== this.props.mapGenTemplate.key) {
                this.setState(this.getDefaultValues(this.props.mapGenTemplate));
            }
        };
        MapGenOptionsComponent.prototype.getDefaultValues = function (mapGenTemplate, unsetOnly) {
            var _this = this;
            if (unsetOnly === void 0) { unsetOnly = true; }
            var defaultValues = {};
            ["defaultOptions", "basicOptions", "advancedOptions"].forEach(function (optionGroup) {
                var options = mapGenTemplate.options[optionGroup];
                if (!options) {
                    return;
                }
                for (var optionName in options) {
                    var option = options[optionName].range;
                    var value = void 0;
                    if (unsetOnly && _this.state && isFinite(_this.getOptionValue(optionName))) {
                        if (!_this.props.mapGenTemplate.options[optionGroup]) {
                            continue;
                        }
                        var oldOption = _this.props.mapGenTemplate.options[optionGroup][optionName];
                        if (!oldOption) {
                            continue;
                        }
                        var oldValuePercentage = utility_1.getRelativeValue(_this.getOptionValue(optionName), oldOption.range.min, oldOption.range.max);
                        value = option.min + (option.max - option.min) * oldValuePercentage;
                    }
                    else {
                        value = isFinite(option.defaultValue) ? option.defaultValue : (option.min + option.max) / 2;
                    }
                    value = utility_1.clamp(utility_1.roundToNearestMultiple(value, option.step), option.min, option.max);
                    defaultValues["optionValue_" + optionName] = value;
                }
            });
            return defaultValues;
        };
        MapGenOptionsComponent.prototype.resetValuesToDefault = function () {
            this.setState(this.getDefaultValues(this.props.mapGenTemplate, false));
        };
        MapGenOptionsComponent.prototype.handleOptionChange = function (optionName, newValue) {
            var changedState = {};
            changedState["optionValue_" + optionName] = newValue;
            this.setState(changedState);
        };
        MapGenOptionsComponent.prototype.getOptionValue = function (optionName) {
            return this.state["optionValue_" + optionName];
        };
        MapGenOptionsComponent.prototype.randomizeOptions = function () {
            var _this = this;
            var newValues = {};
            var optionGroups = this.props.mapGenTemplate.options;
            for (var optionGroupName in optionGroups) {
                var optionGroup = optionGroups[optionGroupName];
                for (var optionName in optionGroup) {
                    var option = optionGroup[optionName].range;
                    var optionValue = utility_1.clamp(utility_1.roundToNearestMultiple(utility_1.randInt(option.min, option.max), option.step), option.min, option.max);
                    newValues["optionValue_" + optionName] = optionValue;
                }
            }
            return new Promise(function (resolve) {
                _this.setState(newValues, resolve);
            });
        };
        MapGenOptionsComponent.prototype.getOptionValuesForTemplate = function () {
            var optionValues = utility_1.extendObject(this.props.mapGenTemplate.options);
            for (var groupName in optionValues) {
                var optionsGroup = optionValues[groupName];
                for (var optionName in optionsGroup) {
                    var optionValue = this.getOptionValue(optionName);
                    if (!isFinite(optionValue)) {
                        throw new Error("Value " + optionValue + " for option " + optionName + " is invalid.");
                    }
                    optionValues[groupName][optionName] = optionValue;
                }
            }
            return optionValues;
        };
        MapGenOptionsComponent.prototype.render = function () {
            var optionGroups = [];
            var optionGroupsInfo = {
                defaultOptions: {
                    title: localize_1.localize("defaultOptions")(),
                    isCollapsedInitially: false,
                },
                basicOptions: {
                    title: localize_1.localize("basicOptions")(),
                    isCollapsedInitially: false,
                },
                advancedOptions: {
                    title: localize_1.localize("advancedOptions")(),
                    isCollapsedInitially: true,
                },
            };
            for (var groupName in optionGroupsInfo) {
                if (!this.props.mapGenTemplate.options[groupName]) {
                    continue;
                }
                var options = [];
                for (var optionName in this.props.mapGenTemplate.options[groupName]) {
                    var option = this.props.mapGenTemplate.options[groupName][optionName];
                    options.push({
                        key: optionName,
                        content: MapGenOption_1.MapGenOption({
                            key: optionName,
                            id: optionName,
                            option: option,
                            value: this.getOptionValue(optionName),
                            onChange: this.handleOptionChange,
                        }),
                    });
                }
                optionGroups.push(OptionsGroup_1.OptionsGroup({
                    key: groupName,
                    headerTitle: optionGroupsInfo[groupName].title,
                    options: options,
                    isCollapsedInitially: optionGroupsInfo[groupName].isCollapsedInitially,
                }));
            }
            return (ReactDOMElements.div({
                className: "map-gen-options",
            }, ReactDOMElements.div({
                className: "map-gen-options-option-groups",
            }, optionGroups), ReactDOMElements.div({
                className: "map-gen-options-buttons",
            }, ReactDOMElements.button({
                className: "map-gen-options-button",
                onClick: this.randomizeOptions,
            }, localize_1.localize("randomize")()), ReactDOMElements.button({
                className: "map-gen-options-button",
                onClick: this.resetValuesToDefault,
            }, localize_1.localize("reset")()))));
        };
        return MapGenOptionsComponent;
    }(React.Component));
    exports.MapGenOptionsComponent = MapGenOptionsComponent;
    exports.MapGenOptions = React.createFactory(MapGenOptionsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("modules/defaultui/uicomponents/setupgame/MapSetup", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/activeModuleData", "src/utility", "modules/defaultui/uicomponents/setupgame/MapGenOptions"], function (require, exports, React, ReactDOMElements, localize_1, activeModuleData_1, utility_1, MapGenOptions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapSetupComponent = (function (_super) {
        __extends(MapSetupComponent, _super);
        function MapSetupComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "MapSetup";
            _this.mapGenOptionsComponent = React.createRef();
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        MapSetupComponent.prototype.bindMethods = function () {
            this.handleSelectTemplate = this.handleSelectTemplate.bind(this);
            this.getMapSetupInfo = this.getMapSetupInfo.bind(this);
            this.updatePlayerLimits = this.updatePlayerLimits.bind(this);
        };
        MapSetupComponent.prototype.getInitialStateTODO = function () {
            var mapGenTemplates = [];
            for (var template in activeModuleData_1.activeModuleData.templates.MapGen) {
                if (activeModuleData_1.activeModuleData.templates.MapGen[template].key) {
                    mapGenTemplates.push(activeModuleData_1.activeModuleData.templates.MapGen[template]);
                }
            }
            return ({
                templates: mapGenTemplates,
                selectedTemplate: mapGenTemplates[0],
            });
        };
        MapSetupComponent.prototype.componentDidMount = function () {
            this.updatePlayerLimits();
        };
        MapSetupComponent.prototype.updatePlayerLimits = function () {
            this.props.setPlayerLimits({
                min: this.state.selectedTemplate.minPlayers,
                max: this.state.selectedTemplate.maxPlayers,
            });
        };
        MapSetupComponent.prototype.randomize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var template;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            template = utility_1.getRandomProperty(activeModuleData_1.activeModuleData.templates.MapGen);
                            return [4, this.setTemplate(template)];
                        case 1:
                            _a.sent();
                            return [4, this.mapGenOptionsComponent.current.randomizeOptions()];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        MapSetupComponent.prototype.setTemplate = function (template) {
            var _this = this;
            return new Promise(function (resolve) {
                _this.setState({
                    selectedTemplate: template,
                }, function () {
                    _this.updatePlayerLimits();
                    resolve();
                });
            });
        };
        MapSetupComponent.prototype.handleSelectTemplate = function (e) {
            var target = e.currentTarget;
            var selectedTemplate = activeModuleData_1.activeModuleData.templates.MapGen[target.value];
            this.setTemplate(selectedTemplate);
        };
        MapSetupComponent.prototype.getMapSetupInfo = function () {
            return ({
                template: this.state.selectedTemplate,
                optionValues: this.mapGenOptionsComponent.current.getOptionValuesForTemplate(),
            });
        };
        MapSetupComponent.prototype.render = function () {
            var mapGenTemplateOptions = [];
            for (var i = 0; i < this.state.templates.length; i++) {
                var template = this.state.templates[i];
                mapGenTemplateOptions.push(ReactDOMElements.option({
                    value: template.key,
                    key: template.key,
                    title: template.description,
                }, template.displayName));
            }
            return (ReactDOMElements.div({
                className: "map-setup",
            }, ReactDOMElements.select({
                className: "map-setup-template-selector",
                value: this.state.selectedTemplate.key,
                onChange: this.handleSelectTemplate,
            }, mapGenTemplateOptions), ReactDOMElements.div({
                className: "map-setup-player-limit",
            }, localize_1.localize("allowedPlayerCount")({
                min: this.state.selectedTemplate.minPlayers,
                max: this.state.selectedTemplate.maxPlayers,
            })), ReactDOMElements.div({
                className: "map-setup-description",
            }, this.state.selectedTemplate.description), MapGenOptions_1.MapGenOptions({
                mapGenTemplate: this.state.selectedTemplate,
                ref: this.mapGenOptionsComponent,
            })));
        };
        return MapSetupComponent;
    }(React.Component));
    exports.MapSetupComponent = MapSetupComponent;
    exports.MapSetup = React.createFactory(MapSetupComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/setupgame/PlayerSetup", ["require", "exports", "react", "react-dom-factories", "src/Flag", "src/Player", "src/activeModuleData", "src/colorGeneration", "src/utility", "modules/defaultui/uicomponents/setupgame/ColorSetter", "modules/defaultui/uicomponents/setupgame/FlagSetter", "modules/defaultui/uicomponents/setupgame/RacePicker", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, Flag_1, Player_1, activeModuleData_1, colorGeneration_1, utility_1, ColorSetter_1, FlagSetter_1, RacePicker_1, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getRandomPlayerRaceTemplate() {
        var candidateRaces = Object.keys(activeModuleData_1.activeModuleData.templates.Races).map(function (raceKey) {
            return activeModuleData_1.activeModuleData.templates.Races[raceKey];
        }).filter(function (raceTemplate) {
            return !raceTemplate.isNotPlayable;
        });
        return utility_1.getRandomArrayItem(candidateRaces);
    }
    var PlayerSetupComponent = (function (_super) {
        __extends(PlayerSetupComponent, _super);
        function PlayerSetupComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "PlayerSetup";
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            _this.flag = new Flag_1.Flag(null);
            return _this;
        }
        PlayerSetupComponent.prototype.bindMethods = function () {
            this.randomize = this.randomize.bind(this);
            this.setSubColor = this.setSubColor.bind(this);
            this.generateSubColor = this.generateSubColor.bind(this);
            this.setMainColor = this.setMainColor.bind(this);
            this.generateMainColor = this.generateMainColor.bind(this);
            this.handleRemove = this.handleRemove.bind(this);
            this.handleNameChange = this.handleNameChange.bind(this);
            this.makePlayer = this.makePlayer.bind(this);
            this.handleSetHuman = this.handleSetHuman.bind(this);
            this.setRace = this.setRace.bind(this);
        };
        PlayerSetupComponent.prototype.getInitialStateTODO = function () {
            return ({
                name: this.props.initialName,
                mainColor: null,
                secondaryColor: null,
                race: getRandomPlayerRaceTemplate(),
            });
        };
        PlayerSetupComponent.prototype.getSnapshotBeforeUpdate = function (prevProps, prevState) {
            this.flag.backgroundColor = this.state.mainColor;
            return null;
        };
        PlayerSetupComponent.prototype.componentDidUpdate = function () {
        };
        PlayerSetupComponent.prototype.generateMainColor = function (subColor) {
            if (subColor === void 0) { subColor = this.state.secondaryColor; }
            if (subColor === null) {
                return colorGeneration_1.generateMainColor();
            }
            else {
                return colorGeneration_1.generateSecondaryColor(subColor);
            }
        };
        PlayerSetupComponent.prototype.generateSubColor = function (mainColor) {
            if (mainColor === void 0) { mainColor = this.state.mainColor; }
            if (mainColor === null) {
                return colorGeneration_1.generateMainColor();
            }
            else {
                return colorGeneration_1.generateSecondaryColor(mainColor);
            }
        };
        PlayerSetupComponent.prototype.handleSetHuman = function () {
            this.props.setHuman(this.props.keyTODO);
        };
        PlayerSetupComponent.prototype.handleNameChange = function (e) {
            var target = e.currentTarget;
            this.setState({ name: target.value });
        };
        PlayerSetupComponent.prototype.setMainColor = function (color, isNull) {
            this.setState({ mainColor: isNull ? null : color });
        };
        PlayerSetupComponent.prototype.setSubColor = function (color, isNull) {
            this.setState({ secondaryColor: isNull ? null : color });
        };
        PlayerSetupComponent.prototype.handleRemove = function () {
            this.props.removePlayers([this.props.keyTODO]);
        };
        PlayerSetupComponent.prototype.setRace = function (race) {
            this.setState({
                race: race,
            });
        };
        PlayerSetupComponent.prototype.randomize = function () {
            var _this = this;
            var mainColor = colorGeneration_1.generateMainColor();
            var secondaryColor = colorGeneration_1.generateSecondaryColor(mainColor);
            this.flag = Flag_1.Flag.generateRandom(mainColor, secondaryColor);
            return new Promise(function (resolve) {
                _this.setState({
                    mainColor: mainColor,
                    secondaryColor: secondaryColor,
                    race: getRandomPlayerRaceTemplate(),
                }, resolve);
            });
        };
        PlayerSetupComponent.prototype.makePlayer = function () {
            var mainColor = this.state.mainColor || this.generateMainColor();
            var secondaryColor = this.state.secondaryColor || this.generateSubColor(mainColor);
            if (!this.flag.backgroundColor) {
                this.flag = Flag_1.Flag.generateRandom(mainColor, secondaryColor);
            }
            var player = new Player_1.Player({
                isAi: !this.props.isHuman,
                isIndependent: false,
                race: this.state.race,
                money: 1000,
                name: this.state.name,
                color: {
                    main: mainColor,
                    secondary: secondaryColor,
                    alpha: 1,
                },
                flag: this.flag,
            });
            this.setState({
                mainColor: player.color,
                secondaryColor: player.secondaryColor,
            });
            return player;
        };
        PlayerSetupComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "player-setup" + (this.props.isHuman ? " human-player-setup" : ""),
            }, ReactDOMElements.input({
                className: "player-setup-is-human",
                title: localize_1.localize("setAsHumanPlayer")(),
                type: "checkbox",
                checked: this.props.isHuman,
                onChange: this.handleSetHuman,
            }), ReactDOMElements.input({
                className: "player-setup-name",
                value: this.state.name,
                onChange: this.handleNameChange,
            }), RacePicker_1.RacePicker({
                availableRaces: Object.keys(activeModuleData_1.activeModuleData.templates.Races).map(function (raceKey) {
                    return activeModuleData_1.activeModuleData.templates.Races[raceKey];
                }).filter(function (race) {
                    return !race.isNotPlayable;
                }),
                selectedRace: this.state.race,
                changeRace: this.setRace,
            }), ColorSetter_1.ColorSetter({
                onChange: this.setMainColor,
                setAsActive: this.props.setActiveSetterComponent,
                generateColor: this.generateMainColor,
                color: this.state.mainColor,
            }), ColorSetter_1.ColorSetter({
                onChange: this.setSubColor,
                setAsActive: this.props.setActiveSetterComponent,
                generateColor: this.generateSubColor,
                color: this.state.secondaryColor,
            }), FlagSetter_1.FlagSetter({
                flag: this.flag,
                mainColor: this.state.mainColor,
                secondaryColor: this.state.secondaryColor,
                setAsActive: this.props.setActiveSetterComponent,
                updateParentFlag: function (flag) {
                    _this.flag = flag;
                    _this.forceUpdate();
                },
            }), ReactDOMElements.button({
                className: "player-setup-remove-player",
                onClick: this.handleRemove,
            })));
        };
        return PlayerSetupComponent;
    }(React.Component));
    exports.PlayerSetupComponent = PlayerSetupComponent;
    exports.PlayerSetup = React.createFactory(PlayerSetupComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/setupgame/RacePicker", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RacePickerComponent = (function (_super) {
        __extends(RacePickerComponent, _super);
        function RacePickerComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "RacePicker";
            _this.handleChangeRace = _this.handleChangeRace.bind(_this);
            return _this;
        }
        RacePickerComponent.prototype.handleChangeRace = function (e) {
            var target = e.currentTarget;
            var newRace = this.props.availableRaces.filter(function (raceTemplate) {
                return raceTemplate.type === target.value;
            })[0];
            this.props.changeRace(newRace);
        };
        RacePickerComponent.prototype.render = function () {
            return (ReactDOMElements.select({
                className: "race-picker",
                value: this.props.selectedRace.type,
                onChange: this.handleChangeRace,
                title: this.props.selectedRace.description,
            }, this.props.availableRaces.map(function (race) {
                return ReactDOMElements.option({
                    key: race.type,
                    value: race.type,
                    title: race.description,
                }, race.displayName.toString());
            })));
        };
        return RacePickerComponent;
    }(React.PureComponent));
    exports.RacePickerComponent = RacePickerComponent;
    exports.RacePicker = React.createFactory(RacePickerComponent);
});
define("modules/defaultui/uicomponents/setupgame/SetterComponentBase", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("modules/defaultui/uicomponents/setupgame/SetupGame", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/App", "src/GameModuleInitializationPhase", "modules/defaultui/uicomponents/setupgame/MapSetup", "modules/defaultui/uicomponents/setupgame/SetupGamePlayers"], function (require, exports, React, ReactDOMElements, localize_1, App_1, GameModuleInitializationPhase_1, MapSetup_1, SetupGamePlayers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SetupGameComponent = (function (_super) {
        __extends(SetupGameComponent, _super);
        function SetupGameComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "SetupGame";
            _this.setupPlayersComponent = React.createRef();
            _this.mapSetupComponent = React.createRef();
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        SetupGameComponent.prototype.bindMethods = function () {
            this.startGame = this.startGame.bind(this);
            this.randomize = this.randomize.bind(this);
            this.setPlayerLimits = this.setPlayerLimits.bind(this);
        };
        SetupGameComponent.prototype.getInitialStateTODO = function () {
            return ({
                minPlayers: 1,
                maxPlayers: 5,
            });
        };
        SetupGameComponent.prototype.setPlayerLimits = function (props) {
            this.setState({
                minPlayers: props.min,
                maxPlayers: props.max,
            });
        };
        SetupGameComponent.prototype.startGame = function () {
            var _this = this;
            App_1.app.moduleInitializer.initModulesNeededForPhase(GameModuleInitializationPhase_1.GameModuleInitializationPhase.MapGen).then(function () {
                var players = _this.setupPlayersComponent.current.makeAllPlayers();
                var mapSetupInfo = _this.mapSetupComponent.current.getMapSetupInfo();
                var mapGenFunction = mapSetupInfo.template.mapGenFunction;
                var mapGenResult = mapGenFunction(mapSetupInfo.optionValues, players);
                var map = mapGenResult.makeMap();
                App_1.app.makeGameFromSetup(map, players);
            });
        };
        SetupGameComponent.prototype.randomize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.mapSetupComponent.current.randomize()];
                        case 1:
                            _a.sent();
                            return [4, this.setupPlayersComponent.current.randomizeAllPlayers()];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        SetupGameComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "setup-game-wrapper",
            }, ReactDOMElements.div({
                className: "setup-game",
            }, ReactDOMElements.div({
                className: "setup-game-options",
            }, SetupGamePlayers_1.SetupGamePlayers({
                ref: this.setupPlayersComponent,
                minPlayers: this.state.minPlayers,
                maxPlayers: this.state.maxPlayers,
            }), MapSetup_1.MapSetup({
                setPlayerLimits: this.setPlayerLimits,
                ref: this.mapSetupComponent,
            })), ReactDOMElements.div({
                className: "setup-game-buttons",
            }, ReactDOMElements.button({
                className: "setup-game-button setup-game-button-randomize",
                onClick: this.randomize,
            }, localize_1.localize("randomize")()), ReactDOMElements.button({
                className: "setup-game-button setup-game-button-start",
                onClick: this.startGame,
            }, localize_1.localize("startGame")())))));
        };
        return SetupGameComponent;
    }(React.Component));
    exports.SetupGameComponent = SetupGameComponent;
    exports.SetupGame = React.createFactory(SetupGameComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/setupgame/SetupGamePlayers", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/setupgame/PlayerSetup"], function (require, exports, React, ReactDOMElements, localize_1, PlayerSetup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SetupGamePlayersComponent = (function (_super) {
        __extends(SetupGamePlayersComponent, _super);
        function SetupGamePlayersComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "SetupGamePlayers";
            _this.newPlayerId = 0;
            _this.desiredPlayerCountFromMax = 0;
            _this.ownDOMNode = React.createRef();
            _this.playerSetupComponentsById = {};
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        SetupGamePlayersComponent.prototype.bindMethods = function () {
            this.makeNewPlayers = this.makeNewPlayers.bind(this);
            this.makeAllPlayers = this.makeAllPlayers.bind(this);
            this.setActiveSetterComponent = this.setActiveSetterComponent.bind(this);
            this.setHumanPlayer = this.setHumanPlayer.bind(this);
            this.randomizeAllPlayers = this.randomizeAllPlayers.bind(this);
            this.removePlayers = this.removePlayers.bind(this);
        };
        SetupGamePlayersComponent.prototype.getInitialStateTODO = function () {
            var players = [];
            for (var i = 0; i < this.props.maxPlayers; i++) {
                players.push(this.newPlayerId++);
            }
            return ({
                playerKeys: players,
                activeSetterComponent: null,
            });
        };
        SetupGamePlayersComponent.prototype.componentDidUpdate = function (prevProps, prevState) {
            if (this.props.maxPlayers !== prevProps.maxPlayers) {
                var desiredPlayerCount = this.props.maxPlayers + this.desiredPlayerCountFromMax;
                if (this.state.playerKeys.length < desiredPlayerCount) {
                    this.makeNewPlayers(desiredPlayerCount - this.state.playerKeys.length, false);
                }
                else if (this.state.playerKeys.length > desiredPlayerCount) {
                    var overflowCount = this.state.playerKeys.length - desiredPlayerCount;
                    this.removePlayers(this.state.playerKeys.slice(-overflowCount), false);
                }
            }
            else if (this.props.minPlayers > prevState.playerKeys.length) {
                this.makeNewPlayers(this.props.minPlayers - prevState.playerKeys.length, false);
            }
        };
        SetupGamePlayersComponent.prototype.makeNewPlayers = function (amount, wasManual) {
            var _this = this;
            if (wasManual === void 0) { wasManual = true; }
            var amountToMake = Math.min(this.props.maxPlayers - this.state.playerKeys.length, amount);
            if (this.state.playerKeys.length + amountToMake > this.props.maxPlayers) {
                return;
            }
            if (wasManual) {
                this.desiredPlayerCountFromMax += amountToMake;
            }
            var newIds = [];
            for (var i = 0; i < amountToMake; i++) {
                newIds.push(this.newPlayerId++);
            }
            this.setState({
                playerKeys: this.state.playerKeys.concat(newIds),
            }, function () {
                var ownDOMNode = _this.ownDOMNode.current;
                ownDOMNode.scrollTop = ownDOMNode.scrollHeight;
            });
        };
        SetupGamePlayersComponent.prototype.removePlayers = function (toRemove, wasManual) {
            var _this = this;
            if (wasManual === void 0) { wasManual = true; }
            if (this.state.playerKeys.length <= this.props.minPlayers) {
                return;
            }
            if (wasManual) {
                this.desiredPlayerCountFromMax -= toRemove.length;
            }
            this.setState({
                playerKeys: this.state.playerKeys.filter(function (playerId) { return toRemove.indexOf(playerId) === -1; }),
            }, function () {
                _this.cleanSetupComponentsById();
            });
        };
        SetupGamePlayersComponent.prototype.setHumanPlayer = function (playerId) {
            var index = this.state.playerKeys.indexOf(playerId);
            var newPlayerOrder = this.state.playerKeys.slice(0);
            newPlayerOrder.unshift(newPlayerOrder.splice(index, 1)[0]);
            this.setState({ playerKeys: newPlayerOrder });
        };
        SetupGamePlayersComponent.prototype.cleanSetupComponentsById = function () {
            for (var playerId in this.playerSetupComponentsById) {
                if (!this.playerSetupComponentsById[playerId].current) {
                    delete this.playerSetupComponentsById[playerId];
                }
            }
        };
        SetupGamePlayersComponent.prototype.setActiveSetterComponent = function (setter) {
            if (this.state.activeSetterComponent) {
                this.state.activeSetterComponent.setAsInactive();
            }
            this.setState({ activeSetterComponent: setter });
        };
        SetupGamePlayersComponent.prototype.randomizeAllPlayers = function () {
            var _this = this;
            return Promise.all(Object.keys(this.playerSetupComponentsById).map(function (id) {
                var playerSetupComponent = _this.playerSetupComponentsById[id].current;
                return playerSetupComponent.randomize();
            }));
        };
        SetupGamePlayersComponent.prototype.makeAllPlayers = function () {
            var _this = this;
            return this.state.playerKeys.map(function (id) {
                return _this.playerSetupComponentsById[id].current.makePlayer();
            });
        };
        SetupGamePlayersComponent.prototype.render = function () {
            var _this = this;
            var playerSetups = [];
            this.state.playerKeys.forEach(function (playerId, i) {
                if (!_this.playerSetupComponentsById[playerId]) {
                    _this.playerSetupComponentsById[playerId] = React.createRef();
                }
                playerSetups.push(PlayerSetup_1.PlayerSetup({
                    key: playerId,
                    keyTODO: playerId,
                    ref: _this.playerSetupComponentsById[playerId],
                    removePlayers: _this.removePlayers,
                    setActiveSetterComponent: _this.setActiveSetterComponent,
                    initialName: "Player " + playerId,
                    isHuman: i === 0,
                    setHuman: _this.setHumanPlayer,
                }));
            });
            var canAddPlayers = this.state.playerKeys.length < this.props.maxPlayers;
            return (ReactDOMElements.div({ className: "setup-game-players", ref: this.ownDOMNode }, ReactDOMElements.div({
                className: "player-setup setup-game-players-header",
            }, ReactDOMElements.div({
                className: "player-setup-is-human",
                title: localize_1.localize("setAsHumanPlayer")(),
            }), ReactDOMElements.div({
                className: "player-setup-name",
            }, localize_1.localize("playerName")()), ReactDOMElements.div({
                className: "player-setup-race-picker",
            }, localize_1.localize("race")()), ReactDOMElements.div({
                className: "color-setter",
            }, localize_1.localize("color_1")()), ReactDOMElements.div({
                className: "color-setter",
            }, localize_1.localize("color_2")()), ReactDOMElements.div({
                className: "flag-setter",
            }, localize_1.localize("flag")()), ReactDOMElements.div({
                className: "player-setup-remove-player",
            }, localize_1.localize("remove")())), ReactDOMElements.div({
                className: "player-setup-players-list",
            }, playerSetups), ReactDOMElements.div({
                className: "setup-game-players-buttons",
            }, ReactDOMElements.button({
                className: "setup-game-button",
                onClick: this.randomizeAllPlayers,
            }, localize_1.localize("randomize")()), ReactDOMElements.button({
                className: "setup-game-players-add-new" + (canAddPlayers ? "" : " disabled"),
                onClick: this.makeNewPlayers.bind(this, 1, true),
                disabled: !canAddPlayers,
            }, localize_1.localize("addNewPlayer")()))));
        };
        return SetupGamePlayersComponent;
    }(React.Component));
    exports.SetupGamePlayersComponent = SetupGamePlayersComponent;
    exports.SetupGamePlayers = React.createFactory(SetupGamePlayersComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/technologies/TechnologiesList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/eventManager", "modules/defaultui/uicomponents/technologies/Technology"], function (require, exports, React, ReactDOMElements, localize_1, eventManager_1, Technology_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TechnologiesListComponent = (function (_super) {
        __extends(TechnologiesListComponent, _super);
        function TechnologiesListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TechnologiesList";
            return _this;
        }
        TechnologiesListComponent.prototype.componentDidMount = function () {
            this.updateListener = eventManager_1.eventManager.addEventListener("builtBuildingWithEffect_research", this.forceUpdate.bind(this));
        };
        TechnologiesListComponent.prototype.componentWillUnmount = function () {
            eventManager_1.eventManager.removeEventListener("builtBuildingWithEffect_research", this.updateListener);
        };
        TechnologiesListComponent.prototype.render = function () {
            var playerTechnology = this.props.playerTechnology;
            var researchSpeed = playerTechnology.getResearchSpeed();
            var rows = [];
            for (var key in playerTechnology.technologies) {
                rows.push(Technology_1.Technology({
                    playerTechnology: playerTechnology,
                    technology: playerTechnology.technologies[key].technology,
                    researchPoints: researchSpeed,
                    key: key,
                }));
            }
            return (ReactDOMElements.div({
                className: "technologies-list-container",
            }, ReactDOMElements.div({
                className: "technologies-list",
            }, rows), ReactDOMElements.div({
                className: "technologies-list-research-speed",
            }, localize_1.localize("researchSpeed")() + ": " + researchSpeed + " " + localize_1.localize("perTurn")())));
        };
        return TechnologiesListComponent;
    }(React.Component));
    exports.TechnologiesListComponent = TechnologiesListComponent;
    exports.TechnologiesList = React.createFactory(TechnologiesListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/technologies/Technology", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/windows/DefaultWindow", "modules/defaultui/uicomponents/technologies/TechnologyUnlocks", "modules/defaultui/uicomponents/technologies/technologyPrioritySlider", "src/activeModuleData"], function (require, exports, React, ReactDOMElements, localize_1, DefaultWindow_1, TechnologyUnlocks_1, technologyPrioritySlider_1, activeModuleData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TechnologyComponent = (function (_super) {
        __extends(TechnologyComponent, _super);
        function TechnologyComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "Technology";
            _this.state =
                {
                    hasUnlocksPopup: false,
                };
            _this.togglePriorityLock = _this.togglePriorityLock.bind(_this);
            _this.toggleUnlocksPopup = _this.toggleUnlocksPopup.bind(_this);
            _this.openUnlocksPopup = _this.openUnlocksPopup.bind(_this);
            _this.closeUnlocksPopup = _this.closeUnlocksPopup.bind(_this);
            return _this;
        }
        TechnologyComponent.prototype.render = function () {
            var technology = this.props.technology;
            var isAtMaxLevel = false;
            var playerTechnology = this.props.playerTechnology;
            var techData = playerTechnology.technologies[technology.key];
            var forCurrentLevel = playerTechnology.getResearchNeededForTechnologyLevel(techData.level);
            var forNextLevel = playerTechnology.getResearchNeededForTechnologyLevel(techData.level + 1);
            var progressForLevel = techData.totalResearch - forCurrentLevel;
            var neededToProgressLevel = forNextLevel - forCurrentLevel;
            var relativeProgress;
            if (techData.level === techData.maxLevel) {
                relativeProgress = 1;
                progressForLevel =
                    techData.totalResearch - playerTechnology.getResearchNeededForTechnologyLevel(techData.level - 1);
                neededToProgressLevel = progressForLevel;
                isAtMaxLevel = true;
            }
            else {
                relativeProgress = progressForLevel / neededToProgressLevel;
            }
            return (ReactDOMElements.div({
                className: "technology-listing",
            }, ReactDOMElements.div({
                className: "technology-listing-label",
                onClick: this.toggleUnlocksPopup,
            }, ReactDOMElements.div({
                className: "technology-name",
                title: technology.displayName,
            }, technology.displayName), ReactDOMElements.div({
                className: "technology-level",
            }, localize_1.localize("technologyLevel")(techData.level))), ReactDOMElements.div({
                className: "technology-progress-bar-container",
            }, ReactDOMElements.div({
                className: "technology-progress-bar" +
                    (isAtMaxLevel ? " technology-progress-bar-max-level" : ""),
                style: {
                    width: "" + (relativeProgress * 100) + "%",
                },
            }), ReactDOMElements.div({
                className: "technology-progress-bar-value",
            }, progressForLevel.toFixed(1) + " / " + Math.ceil(neededToProgressLevel)), technologyPrioritySlider_1.TechnologyPrioritySlider({
                playerTechnology: this.props.playerTechnology,
                technology: this.props.technology,
                researchPoints: this.props.researchPoints,
            })), ReactDOMElements.button({
                className: "technology-toggle-priority-lock" + (techData.priorityIsLocked ? " locked" : " unlocked"),
                onClick: this.togglePriorityLock,
                disabled: isAtMaxLevel,
            }, null), !this.state.hasUnlocksPopup ? null :
                DefaultWindow_1.DefaultWindow({
                    key: "technologyUnlocks " + this.props.technology.key,
                    title: localize_1.localize("technologyUnlocks")({
                        technologyName: this.props.technology.displayName,
                    }),
                    handleClose: this.closeUnlocksPopup,
                    isResizable: false,
                }, TechnologyUnlocks_1.TechnologyUnlocks({
                    technologyDisplayName: this.props.technology.displayName,
                    unlocksPerLevel: activeModuleData_1.activeModuleData.technologyUnlocks[this.props.technology.key],
                }))));
        };
        TechnologyComponent.prototype.togglePriorityLock = function () {
            var pt = this.props.playerTechnology;
            var technology = this.props.technology;
            pt.technologies[technology.key].priorityIsLocked = !pt.technologies[technology.key].priorityIsLocked;
            this.forceUpdate();
        };
        TechnologyComponent.prototype.toggleUnlocksPopup = function () {
            if (this.state.hasUnlocksPopup) {
                this.closeUnlocksPopup();
            }
            else {
                this.openUnlocksPopup();
            }
        };
        TechnologyComponent.prototype.openUnlocksPopup = function () {
            this.setState({ hasUnlocksPopup: true });
        };
        TechnologyComponent.prototype.closeUnlocksPopup = function () {
            this.setState({ hasUnlocksPopup: false });
        };
        return TechnologyComponent;
    }(React.Component));
    exports.TechnologyComponent = TechnologyComponent;
    exports.Technology = React.createFactory(TechnologyComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/technologies/technologyPrioritySlider", ["require", "exports", "react", "react-dom-factories", "src/eventManager"], function (require, exports, React, ReactDOMElements, eventManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TechnologyPrioritySliderComponent = (function (_super) {
        __extends(TechnologyPrioritySliderComponent, _super);
        function TechnologyPrioritySliderComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TechnologyPrioritySlider";
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        TechnologyPrioritySliderComponent.prototype.bindMethods = function () {
            this.getPlayerPriority = this.getPlayerPriority.bind(this);
            this.updatePriority = this.updatePriority.bind(this);
            this.handlePriorityChange = this.handlePriorityChange.bind(this);
        };
        TechnologyPrioritySliderComponent.prototype.getInitialStateTODO = function () {
            return ({
                priority: this.getPlayerPriority(),
            });
        };
        TechnologyPrioritySliderComponent.prototype.componentDidMount = function () {
            eventManager_1.eventManager.addEventListener("technologyPrioritiesUpdated", this.updatePriority);
        };
        TechnologyPrioritySliderComponent.prototype.componentWillUnmount = function () {
            eventManager_1.eventManager.removeEventListener("technologyPrioritiesUpdated", this.updatePriority);
        };
        TechnologyPrioritySliderComponent.prototype.isTechnologyLocked = function () {
            return this.props.playerTechnology.technologies[this.props.technology.key].priorityIsLocked;
        };
        TechnologyPrioritySliderComponent.prototype.getPlayerPriority = function () {
            return this.props.playerTechnology.technologies[this.props.technology.key].priority;
        };
        TechnologyPrioritySliderComponent.prototype.updatePriority = function () {
            this.setState({
                priority: this.getPlayerPriority(),
            });
        };
        TechnologyPrioritySliderComponent.prototype.handlePriorityChange = function (e) {
            if (this.isTechnologyLocked()) {
                return;
            }
            var target = e.currentTarget;
            this.props.playerTechnology.setTechnologyPriority(this.props.technology, parseFloat(target.value));
        };
        TechnologyPrioritySliderComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "technology-progress-bar-priority-container",
            }, ReactDOMElements.span({
                className: "technology-progress-bar-predicted-research",
            }, "+" + (this.props.researchPoints * this.state.priority).toFixed(1)), ReactDOMElements.input({
                className: "technology-progress-bar-priority",
                type: "range",
                min: 0,
                max: 1,
                step: 0.01,
                value: "" + this.state.priority,
                onChange: this.handlePriorityChange,
                disabled: this.isTechnologyLocked(),
            })));
        };
        return TechnologyPrioritySliderComponent;
    }(React.Component));
    exports.TechnologyPrioritySliderComponent = TechnologyPrioritySliderComponent;
    exports.TechnologyPrioritySlider = React.createFactory(TechnologyPrioritySliderComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/technologies/TechnologyUnlock", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TechnologyUnlockComponent = (function (_super) {
        __extends(TechnologyUnlockComponent, _super);
        function TechnologyUnlockComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TechnologyUnlock";
            return _this;
        }
        TechnologyUnlockComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "technology-unlock",
                title: this.props.description,
            }, this.props.displayName));
        };
        return TechnologyUnlockComponent;
    }(React.Component));
    exports.TechnologyUnlockComponent = TechnologyUnlockComponent;
    exports.TechnologyUnlock = React.createFactory(TechnologyUnlockComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/technologies/TechnologyUnlocks", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/technologies/TechnologyUnlocksForLevel"], function (require, exports, React, ReactDOMElements, TechnologyUnlocksForLevel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TechnologyUnlocksComponent = (function (_super) {
        __extends(TechnologyUnlocksComponent, _super);
        function TechnologyUnlocksComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TechnologyUnlocks";
            return _this;
        }
        TechnologyUnlocksComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.ol({
                className: "technology-unlocks",
            }, Object.keys(this.props.unlocksPerLevel).map(function (levelString) {
                return parseInt(levelString);
            }).sort(function (a, b) {
                return a - b;
            }).map(function (level) {
                return ReactDOMElements.li({
                    key: level,
                    className: "technology-unlocks-list-item",
                }, TechnologyUnlocksForLevel_1.TechnologyUnlocksForLevel({
                    level: level,
                    unlocks: _this.props.unlocksPerLevel[level],
                }));
            })));
        };
        return TechnologyUnlocksComponent;
    }(React.Component));
    exports.TechnologyUnlocksComponent = TechnologyUnlocksComponent;
    exports.TechnologyUnlocks = React.createFactory(TechnologyUnlocksComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/technologies/TechnologyUnlocksForLevel", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/technologies/TechnologyUnlocksForType"], function (require, exports, React, ReactDOMElements, localize_1, TechnologyUnlocksForType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TechnologyUnlocksForLevelComponent = (function (_super) {
        __extends(TechnologyUnlocksForLevelComponent, _super);
        function TechnologyUnlocksForLevelComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TechnologyUnlocksForLevel";
            return _this;
        }
        TechnologyUnlocksForLevelComponent.prototype.render = function () {
            var unlockableThingsByType = {};
            this.props.unlocks.forEach(function (unlockableThing) {
                if (!unlockableThingsByType[unlockableThing.kind]) {
                    unlockableThingsByType[unlockableThing.kind] = [];
                }
                unlockableThingsByType[unlockableThing.kind].push(unlockableThing);
            });
            return (ReactDOMElements.div({
                className: "technology-unlocks-for-level",
            }, ReactDOMElements.div({
                className: "technology-unlocks-for-level-header",
            }, localize_1.localize("technologyLevel")(this.props.level)), ReactDOMElements.ol({
                className: "technology-unlocks-for-level-list",
            }, Object.keys(unlockableThingsByType).sort().map(function (kind) {
                return ReactDOMElements.li({
                    key: kind,
                    className: "technology-unlocks-for-level-list-item",
                }, TechnologyUnlocksForType_1.TechnologyUnlocksForType({
                    kind: kind,
                    unlocks: unlockableThingsByType[kind],
                }));
            }))));
        };
        return TechnologyUnlocksForLevelComponent;
    }(React.Component));
    exports.TechnologyUnlocksForLevelComponent = TechnologyUnlocksForLevelComponent;
    exports.TechnologyUnlocksForLevel = React.createFactory(TechnologyUnlocksForLevelComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/technologies/TechnologyUnlocksForType", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/technologies/TechnologyUnlock"], function (require, exports, React, ReactDOMElements, localize_1, TechnologyUnlock_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var localizationKeyForUnlockableThingKind = {
        building: "techUnlock_buildings",
        item: "techUnlock_items",
        unit: "techUnlock_units",
    };
    var TechnologyUnlocksForTypeComponent = (function (_super) {
        __extends(TechnologyUnlocksForTypeComponent, _super);
        function TechnologyUnlocksForTypeComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TechnologyUnlocksForType";
            return _this;
        }
        TechnologyUnlocksForTypeComponent.prototype.render = function () {
            var localizationKey = localizationKeyForUnlockableThingKind[this.props.kind];
            return ReactDOMElements.div({
                className: "technology-unlocks-for-type",
            }, ReactDOMElements.div({
                className: "technology-unlocks-for-type-header",
            }, localize_1.localize(localizationKey)()), ReactDOMElements.ol({
                className: "technology-unlocks-for-type-list",
            }, this.props.unlocks.map(function (unlockableThing) {
                return ReactDOMElements.li({
                    key: unlockableThing.type,
                    className: "technology-unlocks-for-type-list-item",
                }, TechnologyUnlock_1.TechnologyUnlock({
                    displayName: unlockableThing.displayName,
                    description: unlockableThing.description,
                }));
            })));
        };
        return TechnologyUnlocksForTypeComponent;
    }(React.Component));
    exports.TechnologyUnlocksForTypeComponent = TechnologyUnlocksForTypeComponent;
    exports.TechnologyUnlocksForType = React.createFactory(TechnologyUnlocksForTypeComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/trade/TradeableItems", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/trade/TradeableItemsList"], function (require, exports, React, ReactDOMElements, TradeableItemsList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TradeableItemsComponent = (function (_super) {
        __extends(TradeableItemsComponent, _super);
        function TradeableItemsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TradeableItems";
            _this.bindMethods();
            return _this;
        }
        TradeableItemsComponent.prototype.bindMethods = function () {
            this.handleMouseUp = this.handleMouseUp.bind(this);
        };
        TradeableItemsComponent.prototype.handleMouseUp = function () {
            this.props.onMouseUp();
        };
        TradeableItemsComponent.prototype.render = function () {
            var divProps = {
                className: "tradeable-items",
            };
            if (this.props.isInvalidDropTarget) {
                divProps.className += " invalid-drop-target";
            }
            else if (this.props.onMouseUp) {
                divProps.onMouseUp = this.handleMouseUp;
            }
            return (ReactDOMElements.div(divProps, !this.props.header ? null : ReactDOMElements.div({
                className: "tradeable-items-header",
            }, this.props.header), TradeableItemsList_1.TradeableItemsList({
                tradeableItems: this.props.tradeableItems,
                availableItems: this.props.availableItems,
                onDragStart: this.props.onDragStart,
                onDragEnd: this.props.onDragEnd,
                onItemClick: this.props.onItemClick,
                adjustItemAmount: this.props.adjustItemAmount,
            })));
        };
        return TradeableItemsComponent;
    }(React.Component));
    exports.TradeableItemsComponent = TradeableItemsComponent;
    exports.TradeableItems = React.createFactory(TradeableItemsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/trade/TradeableItemsList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/list/List", "modules/defaultui/uicomponents/trade/TradeMoney"], function (require, exports, React, ReactDOMElements, localize_1, List_1, TradeMoney_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TradeableItemsListComponent = (function (_super) {
        __extends(TradeableItemsListComponent, _super);
        function TradeableItemsListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TradeableItemsList";
            _this.bindMethods();
            return _this;
        }
        TradeableItemsListComponent.prototype.bindMethods = function () {
            this.makeRowForTradeableItem = this.makeRowForTradeableItem.bind(this);
        };
        TradeableItemsListComponent.prototype.makeRowForTradeableItem = function (item) {
            switch (item.key) {
                case "money":
                    {
                        return ({
                            key: "money",
                            content: TradeMoney_1.TradeMoney({
                                keyTODO: "money",
                                title: localize_1.localize("money")(),
                                moneyAmount: item.amount,
                                onDragStart: this.props.onDragStart,
                                onDragEnd: this.props.onDragEnd,
                                onClick: this.props.onItemClick,
                                adjustItemAmount: this.props.adjustItemAmount,
                                maxMoneyAvailable: (this.props.availableItems && this.props.availableItems["money"]) ?
                                    this.props.availableItems["money"].amount : undefined,
                            }),
                        });
                    }
                default:
                    {
                        throw new Error("Unrecognized tradeable item key " + item.key);
                    }
            }
        };
        TradeableItemsListComponent.prototype.render = function () {
            var tradeableItems = this.props.tradeableItems;
            var rows = [];
            for (var key in tradeableItems) {
                rows.push(this.makeRowForTradeableItem(tradeableItems[key]));
            }
            var columns = [
                {
                    label: "Item",
                    key: "item",
                    defaultOrder: "asc",
                    sortingFunction: function (a, b) {
                        return (TradeableItemsListComponent.listItemSortOrder[a.content.props.keyTODO] -
                            TradeableItemsListComponent.listItemSortOrder[b.content.props.keyTODO]);
                    },
                },
            ];
            return (ReactDOMElements.div({
                className: "tradeable-items-list fixed-table-parent",
            }, List_1.List({
                listItems: rows,
                initialColumns: columns,
                initialSortOrder: [columns[0]],
                noHeader: true,
            })));
        };
        TradeableItemsListComponent.listItemSortOrder = {
            money: 0,
        };
        return TradeableItemsListComponent;
    }(React.Component));
    exports.TradeableItemsListComponent = TradeableItemsListComponent;
    exports.TradeableItemsList = React.createFactory(TradeableItemsListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/trade/TradeMoney", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/mixins/DragPositioner", "modules/defaultui/uicomponents/mixins/applyMixins"], function (require, exports, React, ReactDOMElements, DragPositioner_1, applyMixins_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TradeMoneyComponent = (function (_super) {
        __extends(TradeMoneyComponent, _super);
        function TradeMoneyComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TradeMoney";
            _this.ownDOMNode = React.createRef();
            _this.bindMethods();
            _this.dragPositioner = new DragPositioner_1.DragPositioner(_this, _this.ownDOMNode, _this.props.dragPositionerProps);
            _this.dragPositioner.onDragStart = _this.onDragStart;
            _this.dragPositioner.onDragEnd = _this.onDragEnd;
            applyMixins_1.applyMixins(_this, _this.dragPositioner);
            return _this;
        }
        TradeMoneyComponent.prototype.bindMethods = function () {
            this.handleClick = this.handleClick.bind(this);
            this.onDragEnd = this.onDragEnd.bind(this);
            this.captureEvent = this.captureEvent.bind(this);
            this.onDragStart = this.onDragStart.bind(this);
            this.handleMoneyAmountChange = this.handleMoneyAmountChange.bind(this);
        };
        TradeMoneyComponent.prototype.onDragStart = function () {
            this.props.onDragStart(this.props.keyTODO);
        };
        TradeMoneyComponent.prototype.onDragEnd = function () {
            this.props.onDragEnd();
        };
        TradeMoneyComponent.prototype.handleClick = function () {
            this.props.onClick(this.props.keyTODO);
        };
        TradeMoneyComponent.prototype.handleMoneyAmountChange = function (e) {
            var target = e.currentTarget;
            var value = parseInt(target.value);
            this.props.adjustItemAmount(this.props.keyTODO, value);
        };
        TradeMoneyComponent.prototype.captureEvent = function (e) {
            e.stopPropagation();
        };
        TradeMoneyComponent.prototype.render = function () {
            var rowProps = {
                className: "tradeable-items-list-item",
                ref: this.ownDOMNode,
            };
            if (this.props.onDragStart) {
                rowProps.className += " draggable";
                rowProps.onMouseDown = rowProps.onTouchStart = this.dragPositioner.handleReactDownEvent;
                if (this.dragPositioner.isDragging) {
                    rowProps.style = this.dragPositioner.getStyleAttributes();
                    rowProps.className += " dragging";
                }
            }
            if (this.props.onClick) {
                rowProps.onClick = this.handleClick;
            }
            var moneyElement;
            if (this.props.adjustItemAmount) {
                var moneyProps = {
                    className: "trade-money-money-available trade-item-adjust",
                    type: "number",
                    min: 0,
                    max: this.props.maxMoneyAvailable,
                    step: 1,
                    value: "" + this.props.moneyAmount,
                    onChange: this.handleMoneyAmountChange,
                    onClick: this.captureEvent,
                    onMouseDown: this.captureEvent,
                    onTouchStart: this.captureEvent,
                };
                moneyElement = ReactDOMElements.input(moneyProps);
            }
            else {
                moneyElement = ReactDOMElements.span({
                    className: "trade-money-money-available",
                }, this.props.moneyAmount);
            }
            return (ReactDOMElements.tr(rowProps, ReactDOMElements.td(null, ReactDOMElements.span({
                className: "trade-money-title",
            }, this.props.title), moneyElement)));
        };
        return TradeMoneyComponent;
    }(React.Component));
    exports.TradeMoneyComponent = TradeMoneyComponent;
    exports.TradeMoney = React.createFactory(TradeMoneyComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/trade/TradeOverview", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/Trade", "src/TradeOffer", "modules/defaultui/uicomponents/trade/TradeableItems"], function (require, exports, React, ReactDOMElements, localize_1, Trade_1, TradeOffer_1, TradeableItems_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TradeOverviewComponent = (function (_super) {
        __extends(TradeOverviewComponent, _super);
        function TradeOverviewComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "TradeOverview";
            var activeOffer;
            if (_this.props.initialReceivedOffer) {
                activeOffer = _this.props.initialReceivedOffer;
            }
            else {
                var initialHumanOffer = TradeOverviewComponent.makeInitialHumanTradeOffer(props.selfPlayer, props.otherPlayer);
                var initialResponse = _this.props.otherPlayer.aiController.respondToTradeOffer(initialHumanOffer);
                activeOffer = initialResponse;
            }
            TradeOffer_1.flipTradeOffer(activeOffer);
            _this.state =
                {
                    currentDragItemKey: null,
                    currentDragItemPlayer: null,
                    currentDragItemWasStaged: null,
                    activeOffer: activeOffer,
                    lastOfferByPlayer: TradeOffer_1.cloneTradeOffer(activeOffer),
                    hasActiveProposal: false,
                };
            _this.bindMethods();
            return _this;
        }
        TradeOverviewComponent.makeInitialHumanTradeOffer = function (selfPlayer, otherPlayer) {
            var ownTrade = new Trade_1.Trade(selfPlayer);
            var willingnessToTradeItems = {};
            for (var key in ownTrade.allItems) {
                willingnessToTradeItems[key] = 1;
            }
            return ({
                ownTrade: ownTrade,
                otherTrade: new Trade_1.Trade(otherPlayer),
                willingnessToTradeItems: willingnessToTradeItems,
                isInitialOffer: true,
                message: "",
                willingToAccept: false,
                willingToKeepNegotiating: true,
            });
        };
        TradeOverviewComponent.prototype.render = function () {
            var hasDragItem = Boolean(this.state.currentDragItemKey);
            var selfPlayerAcceptsDrop = this.state.currentDragItemPlayer === "self";
            var otherPlayerAcceptsDrop = this.state.currentDragItemPlayer === "other";
            var selfAvailableItems = this.state.activeOffer.ownTrade.getItemsAvailableForTrade();
            var otherAvailableItems = this.state.activeOffer.otherTrade.getItemsAvailableForTrade();
            var ableToAcceptTrade = this.state.hasActiveProposal && this.state.activeOffer.willingToAccept;
            return (ReactDOMElements.div({
                className: "trade-overview",
            }, ReactDOMElements.div({
                className: "tradeable-items-container available-items-container",
            }, TradeableItems_1.TradeableItems({
                header: this.props.selfPlayer.name.fullName,
                tradeableItems: selfAvailableItems,
                isInvalidDropTarget: hasDragItem && !selfPlayerAcceptsDrop,
                onDragStart: this.handleAvailableDragStart.bind(this, "self"),
                onDragEnd: this.handleDragEnd,
                onMouseUp: this.handleAvailableMouseUp,
                onItemClick: this.handleStageItem.bind(this, "self"),
            }), TradeableItems_1.TradeableItems({
                header: this.props.otherPlayer.name.fullName,
                tradeableItems: otherAvailableItems,
                isInvalidDropTarget: hasDragItem && !otherPlayerAcceptsDrop,
                onDragStart: this.handleAvailableDragStart.bind(this, "other"),
                onDragEnd: this.handleDragEnd,
                onMouseUp: this.handleAvailableMouseUp,
                onItemClick: this.handleStageItem.bind(this, "other"),
            })), ReactDOMElements.div({
                className: "tradeable-items-container trade-staging-areas-container",
            }, TradeableItems_1.TradeableItems({
                tradeableItems: this.state.activeOffer.ownTrade.stagedItems,
                availableItems: this.state.activeOffer.ownTrade.allItems,
                isInvalidDropTarget: hasDragItem && !selfPlayerAcceptsDrop,
                onDragStart: this.handleStagingDragStart.bind(this, "self"),
                onDragEnd: this.handleDragEnd,
                onMouseUp: this.handleStagingAreaMouseUp,
                onItemClick: this.handleRemoveStagedItem.bind(this, "self"),
                adjustItemAmount: this.handleAdjustStagedItemAmount.bind(this, "self"),
            }), TradeableItems_1.TradeableItems({
                tradeableItems: this.state.activeOffer.otherTrade.stagedItems,
                availableItems: this.state.activeOffer.otherTrade.allItems,
                isInvalidDropTarget: hasDragItem && !otherPlayerAcceptsDrop,
                onDragStart: this.handleStagingDragStart.bind(this, "other"),
                onDragEnd: this.handleDragEnd,
                onMouseUp: this.handleStagingAreaMouseUp,
                onItemClick: this.handleRemoveStagedItem.bind(this, "other"),
                adjustItemAmount: this.handleAdjustStagedItemAmount.bind(this, "other"),
            })), ReactDOMElements.div({
                className: "trade-buttons-container tradeable-items-reset-buttons-container",
            }, ReactDOMElements.button({
                className: "trade-button tradeable-items-reset-button",
                disabled: this.state.activeOffer.ownTrade.isEqualWith(this.state.lastOfferByPlayer.ownTrade),
                onClick: this.resetSelfTrade,
            }, localize_1.localize("reset")()), ReactDOMElements.button({
                className: "trade-button tradeable-items-reset-button",
                disabled: this.state.activeOffer.otherTrade.isEqualWith(this.state.lastOfferByPlayer.otherTrade),
                onClick: this.resetOtherTrade,
            }, localize_1.localize("reset")())), ReactDOMElements.div({
                className: "trade-message",
            }, this.state.activeOffer.message), ReactDOMElements.div({
                className: "trade-buttons-container trade-controls-container",
            }, ReactDOMElements.button({
                className: "trade-button trade-control-button",
                disabled: !ableToAcceptTrade,
                onClick: this.rejectTrade,
            }, localize_1.localize("reject")()), this.state.hasActiveProposal ?
                ReactDOMElements.button({
                    className: "trade-button trade-control-button",
                    disabled: !ableToAcceptTrade,
                    onClick: this.acceptTrade,
                }, localize_1.localize("accept")()) :
                ReactDOMElements.button({
                    className: "trade-button trade-control-button",
                    disabled: !this.state.activeOffer.willingToKeepNegotiating,
                    onClick: this.proposeTrade,
                }, localize_1.localize("propose")()))));
        };
        TradeOverviewComponent.prototype.bindMethods = function () {
            this.handleDragEnd = this.handleDragEnd.bind(this);
            this.handleStagingDragStart = this.handleStagingDragStart.bind(this);
            this.handleAvailableDragStart = this.handleAvailableDragStart.bind(this);
            this.handleRemoveStagedItem = this.handleRemoveStagedItem.bind(this);
            this.handleStageItem = this.handleStageItem.bind(this);
            this.handleAdjustStagedItemAmount = this.handleAdjustStagedItemAmount.bind(this);
            this.handleStagingAreaMouseUp = this.handleStagingAreaMouseUp.bind(this);
            this.handleAvailableMouseUp = this.handleAvailableMouseUp.bind(this);
            this.getActiveTradeObjectForPlayer = this.getActiveTradeObjectForPlayer.bind(this);
            this.resetSelfTrade = this.resetSelfTrade.bind(this);
            this.resetOtherTrade = this.resetOtherTrade.bind(this);
            this.acceptTrade = this.acceptTrade.bind(this);
            this.proposeTrade = this.proposeTrade.bind(this);
            this.rejectTrade = this.rejectTrade.bind(this);
        };
        TradeOverviewComponent.prototype.getActiveTradeObjectForPlayer = function (player) {
            if (player === "self") {
                return this.state.activeOffer.ownTrade;
            }
            else if (player === "other") {
                return this.state.activeOffer.otherTrade;
            }
            else {
                throw new Error("Invalid player key '" + player + "'");
            }
        };
        TradeOverviewComponent.prototype.handleStageItem = function (player, key) {
            var activeTrade = this.getActiveTradeObjectForPlayer(player);
            var availableItems = activeTrade.getItemsAvailableForTrade();
            var availableAmount = availableItems[key].amount;
            if (availableAmount === 1) {
                activeTrade.stageItem(key, 1);
            }
            else {
                activeTrade.stageItem(key, availableAmount);
            }
            this.onTradeChange();
        };
        TradeOverviewComponent.prototype.handleAdjustStagedItemAmount = function (player, key, newAmount) {
            var activeTrade = this.getActiveTradeObjectForPlayer(player);
            activeTrade.setStagedItemAmount(key, newAmount);
            this.onTradeChange();
        };
        TradeOverviewComponent.prototype.handleRemoveStagedItem = function (player, key) {
            var activeTrade = this.getActiveTradeObjectForPlayer(player);
            activeTrade.removeStagedItem(key);
            this.onTradeChange();
        };
        TradeOverviewComponent.prototype.handleAvailableDragStart = function (player, key) {
            this.setState({
                currentDragItemKey: key,
                currentDragItemPlayer: player,
                currentDragItemWasStaged: false,
            });
        };
        TradeOverviewComponent.prototype.handleStagingDragStart = function (player, key) {
            this.setState({
                currentDragItemKey: key,
                currentDragItemPlayer: player,
                currentDragItemWasStaged: true,
            });
        };
        TradeOverviewComponent.prototype.handleDragEnd = function () {
            this.setState({
                currentDragItemKey: null,
                currentDragItemPlayer: null,
                currentDragItemWasStaged: null,
            });
        };
        TradeOverviewComponent.prototype.handleAvailableMouseUp = function () {
            if (this.state.currentDragItemKey && this.state.currentDragItemWasStaged) {
                this.handleDragEnd();
                this.handleRemoveStagedItem(this.state.currentDragItemPlayer, this.state.currentDragItemKey);
            }
        };
        TradeOverviewComponent.prototype.handleStagingAreaMouseUp = function () {
            if (this.state.currentDragItemKey && !this.state.currentDragItemWasStaged) {
                this.handleDragEnd();
                this.handleStageItem(this.state.currentDragItemPlayer, this.state.currentDragItemKey);
            }
        };
        TradeOverviewComponent.prototype.onTradeChange = function () {
            if (this.state.hasActiveProposal) {
                this.setState({ hasActiveProposal: false });
            }
            else {
                this.forceUpdate();
            }
        };
        TradeOverviewComponent.prototype.resetSelfTrade = function () {
            this.state.activeOffer.ownTrade = this.state.lastOfferByPlayer.ownTrade.clone();
            this.onTradeChange();
        };
        TradeOverviewComponent.prototype.resetOtherTrade = function () {
            this.state.activeOffer.otherTrade = this.state.lastOfferByPlayer.otherTrade.clone();
            this.onTradeChange();
        };
        TradeOverviewComponent.prototype.acceptTrade = function () {
            this.state.activeOffer.ownTrade.executeTrade(this.state.activeOffer.otherTrade);
            this.state.activeOffer.tradeWasAccepted = true;
            var response = this.props.otherPlayer.aiController.respondToTradeOffer(this.state.activeOffer);
            TradeOffer_1.flipTradeOffer(response);
            this.setState({
                activeOffer: response,
                lastOfferByPlayer: TradeOffer_1.cloneTradeOffer(response),
                hasActiveProposal: false,
            });
        };
        TradeOverviewComponent.prototype.proposeTrade = function () {
            var response = this.props.otherPlayer.aiController.respondToTradeOffer(this.state.activeOffer);
            TradeOffer_1.flipTradeOffer(response);
            this.setState({
                activeOffer: response,
                lastOfferByPlayer: TradeOffer_1.cloneTradeOffer(response),
                hasActiveProposal: true,
            });
        };
        TradeOverviewComponent.prototype.rejectTrade = function () {
            this.resetSelfTrade();
            this.resetOtherTrade();
        };
        return TradeOverviewComponent;
    }(React.Component));
    exports.TradeOverviewComponent = TradeOverviewComponent;
    exports.TradeOverview = React.createFactory(TradeOverviewComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/tutorials/DontShowAgain", ["require", "exports", "react", "react-dom-factories", "src/tutorials/TutorialStatus", "src/tutorials/TutorialVisibility", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, TutorialStatus_1, TutorialVisibility_1, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DontShowAgainComponent = (function (_super) {
        __extends(DontShowAgainComponent, _super);
        function DontShowAgainComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "DontShowAgain";
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        DontShowAgainComponent.prototype.bindMethods = function () {
            this.toggleState = this.toggleState.bind(this);
            this.getTutorialVisibility = this.getTutorialVisibility.bind(this);
        };
        DontShowAgainComponent.prototype.getInitialStateTODO = function () {
            return ({
                isChecked: this.getTutorialVisibility() === TutorialVisibility_1.TutorialVisibility.NeverShow,
            });
        };
        DontShowAgainComponent.prototype.getTutorialVisibility = function () {
            return TutorialStatus_1.tutorialStatus[this.props.tutorialId];
        };
        DontShowAgainComponent.prototype.toggleState = function () {
            if (this.state.isChecked) {
                TutorialStatus_1.tutorialStatus[this.props.tutorialId] = TutorialVisibility_1.TutorialVisibility.Show;
            }
            else {
                TutorialStatus_1.tutorialStatus[this.props.tutorialId] = TutorialVisibility_1.TutorialVisibility.NeverShow;
            }
            TutorialStatus_1.tutorialStatus.save();
            this.setState({
                isChecked: !this.state.isChecked,
            });
        };
        DontShowAgainComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "dont-show-again-wrapper",
            }, ReactDOMElements.label(null, ReactDOMElements.input({
                type: "checkBox",
                className: "dont-show-again",
                checked: this.state.isChecked,
                onChange: this.toggleState,
            }), localize_1.localize("dontShowAgain")())));
        };
        return DontShowAgainComponent;
    }(React.Component));
    exports.DontShowAgainComponent = DontShowAgainComponent;
    exports.DontShowAgain = React.createFactory(DontShowAgainComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/tutorials/IntroTutorial", ["require", "exports", "react", "src/tutorials/IntroTutorial", "src/tutorials/TutorialStatus", "src/tutorials/TutorialVisibility", "modules/defaultui/uicomponents/windows/DefaultWindow", "modules/defaultui/uicomponents/tutorials/Tutorial"], function (require, exports, React, IntroTutorial_1, TutorialStatus_1, TutorialVisibility_1, DefaultWindow_1, Tutorial_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IntroTutorialComponent = (function (_super) {
        __extends(IntroTutorialComponent, _super);
        function IntroTutorialComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "IntroTutorial";
            _this.popupId = null;
            _this.state =
                {
                    shouldShow: TutorialStatus_1.tutorialStatus.introTutorial === TutorialVisibility_1.TutorialVisibility.Show,
                };
            return _this;
        }
        IntroTutorialComponent.prototype.render = function () {
            var _this = this;
            if (!this.state.shouldShow) {
                return null;
            }
            return (DefaultWindow_1.DefaultWindow({
                title: "Tutorial",
                attributes: {
                    className: "never-hide-when-user-interacts-with-map"
                },
                handleClose: function () {
                    _this.setState({ shouldShow: false });
                },
            }, Tutorial_1.Tutorial({
                pages: IntroTutorial_1.introTutorial.pages,
                tutorialId: "introTutorial",
            })));
        };
        return IntroTutorialComponent;
    }(React.Component));
    exports.IntroTutorialComponent = IntroTutorialComponent;
    exports.IntroTutorial = React.createFactory(IntroTutorialComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/tutorials/Tutorial", ["require", "exports", "react", "react-dom-factories", "src/tutorials/TutorialStatus", "src/tutorials/TutorialVisibility", "src/utility", "modules/defaultui/uicomponents/tutorials/DontShowAgain"], function (require, exports, React, ReactDOMElements, TutorialStatus_1, TutorialVisibility_1, utility_1, DontShowAgain_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TutorialComponent = (function (_super) {
        __extends(TutorialComponent, _super);
        function TutorialComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "Tutorial";
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            return _this;
        }
        TutorialComponent.prototype.bindMethods = function () {
            this.handleEnterPage = this.handleEnterPage.bind(this);
            this.flipPage = this.flipPage.bind(this);
            this.handleLeavePage = this.handleLeavePage.bind(this);
            this.handleClose = this.handleClose.bind(this);
        };
        TutorialComponent.prototype.getInitialStateTODO = function () {
            return ({
                currentPageIndex: 0,
            });
        };
        TutorialComponent.prototype.componentDidMount = function () {
            this.handleEnterPage(this.props.pages[this.state.currentPageIndex]);
        };
        TutorialComponent.prototype.componentWillUnmount = function () {
            this.handleLeavePage(this.props.pages[this.state.currentPageIndex]);
            this.handleClose();
        };
        TutorialComponent.prototype.handleEnterPage = function (page) {
            if (page.onOpen) {
                page.onOpen();
            }
            if (page.desiredSize) {
            }
        };
        TutorialComponent.prototype.handleLeavePage = function (page) {
            if (page.onClose) {
                page.onClose();
            }
            if (page.desiredSize) {
            }
        };
        TutorialComponent.prototype.flipPage = function (amount) {
            var lastPage = this.props.pages.length - 1;
            var newPage = this.state.currentPageIndex + amount;
            newPage = utility_1.clamp(newPage, 0, lastPage);
            this.handleLeavePage(this.props.pages[this.state.currentPageIndex]);
            this.setState({
                currentPageIndex: newPage,
            }, this.handleEnterPage.bind(this, this.props.pages[newPage]));
        };
        TutorialComponent.prototype.handleClose = function () {
            if (TutorialStatus_1.tutorialStatus[this.props.tutorialId] === TutorialVisibility_1.TutorialVisibility.Show) {
                TutorialStatus_1.tutorialStatus[this.props.tutorialId] = TutorialVisibility_1.TutorialVisibility.DontShowThisSession;
            }
        };
        TutorialComponent.prototype.render = function () {
            var hasBackArrow = this.state.currentPageIndex > 0;
            var backElement;
            if (hasBackArrow) {
                backElement = ReactDOMElements.div({
                    className: "tutorial-flip-page tutorial-flip-page-back",
                    onClick: this.flipPage.bind(this, -1),
                });
            }
            else {
                backElement = ReactDOMElements.div({
                    className: "tutorial-flip-page disabled",
                });
            }
            var hasForwardArrow = this.state.currentPageIndex < this.props.pages.length - 1;
            var forwardElement;
            if (hasForwardArrow) {
                forwardElement = ReactDOMElements.div({
                    className: "tutorial-flip-page tutorial-flip-page-forward",
                    onClick: this.flipPage.bind(this, 1),
                });
            }
            else {
                forwardElement = ReactDOMElements.div({
                    className: "tutorial-flip-page disabled",
                });
            }
            return (ReactDOMElements.div({
                className: "tutorial",
            }, ReactDOMElements.div({
                className: "tutorial-inner",
            }, backElement, ReactDOMElements.div({
                className: "tutorial-content",
            }, utility_1.splitMultilineText(this.props.pages[this.state.currentPageIndex].content)), forwardElement), DontShowAgain_1.DontShowAgain({
                tutorialId: this.props.tutorialId,
            })));
        };
        return TutorialComponent;
    }(React.Component));
    exports.TutorialComponent = TutorialComponent;
    exports.Tutorial = React.createFactory(TutorialComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unit/EmptyUnit", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/unit/UnitIconContainer"], function (require, exports, React, ReactDOMElements, UnitIconContainer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EmptyUnitComponent = (function (_super) {
        __extends(EmptyUnitComponent, _super);
        function EmptyUnitComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "EmptyUnit";
            return _this;
        }
        EmptyUnitComponent.prototype.render = function () {
            var innerElements = [
                ReactDOMElements.div({
                    className: "unit-body",
                    key: "body",
                }, null),
                UnitIconContainer_1.UnitIconContainer({
                    iconSrc: null,
                    facesLeft: this.props.facesLeft,
                    key: "icon",
                }),
            ];
            if (this.props.facesLeft) {
                innerElements.reverse();
            }
            return (ReactDOMElements.div({
                className: "unit empty-unit" + (this.props.facesLeft ? " enemy-unit" : " friendly-unit"),
                onMouseUp: this.props.onMouseUp,
            }, innerElements));
        };
        return EmptyUnitComponent;
    }(React.PureComponent));
    exports.EmptyUnitComponent = EmptyUnitComponent;
    exports.EmptyUnit = React.createFactory(EmptyUnitComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unit/Unit", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "src/Options", "modules/defaultui/uicomponents/mixins/DragPositioner", "modules/defaultui/uicomponents/mixins/applyMixins", "modules/defaultui/uicomponents/unit/UnitAttributeChanges", "modules/defaultui/uicomponents/unit/UnitIconContainer", "modules/defaultui/uicomponents/unit/UnitInfo", "modules/defaultui/uicomponents/unit/UnitPassiveEffects", "modules/defaultui/uicomponents/unit/UnitPortrait"], function (require, exports, React, ReactDOMElements, localize_1, Options_1, DragPositioner_1, applyMixins_1, UnitAttributeChanges_1, UnitIconContainer_1, UnitInfo_1, UnitPassiveEffects_1, UnitPortrait_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitComponent = (function (_super) {
        __extends(UnitComponent, _super);
        function UnitComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "Unit";
            _this.ownDOMNode = React.createRef();
            _this.state = _this.getInitialStateTODO();
            _this.bindMethods();
            if (_this.props.isDraggable) {
                _this.dragPositioner = new DragPositioner_1.DragPositioner(_this, _this.ownDOMNode, _this.props.dragPositionerProps);
                _this.dragPositioner.onDragStart = _this.onDragStart;
                _this.dragPositioner.onDragEnd = _this.onDragEnd;
                applyMixins_1.applyMixins(_this, _this.dragPositioner);
            }
            return _this;
        }
        UnitComponent.prototype.bindMethods = function () {
            this.handleClick = this.handleClick.bind(this);
            this.onDragEnd = this.onDragEnd.bind(this);
            this.handleMouseEnter = this.handleMouseEnter.bind(this);
            this.onDragStart = this.onDragStart.bind(this);
            this.handleMouseLeave = this.handleMouseLeave.bind(this);
        };
        UnitComponent.prototype.getInitialStateTODO = function () {
            return ({});
        };
        UnitComponent.prototype.onDragStart = function () {
            this.props.onDragStart();
        };
        UnitComponent.prototype.onDragEnd = function () {
            this.props.onDragEnd();
        };
        UnitComponent.prototype.handleClick = function () {
            this.props.onUnitClick();
        };
        UnitComponent.prototype.handleMouseEnter = function () {
            this.props.handleMouseEnterUnit();
        };
        UnitComponent.prototype.handleMouseLeave = function (e) {
            this.props.handleMouseLeaveUnit(e);
        };
        UnitComponent.prototype.render = function () {
            var wrapperProps = {
                className: "unit",
                onMouseEnter: this.props.handleMouseEnterUnit ? this.handleMouseEnter : null,
                onMouseLeave: this.props.handleMouseLeaveUnit ? this.handleMouseLeave : null,
                onClick: this.props.onUnitClick ? this.handleClick : null,
                onMouseUp: this.props.onMouseUp,
                ref: this.ownDOMNode,
            };
            if (this.props.isDraggable) {
                wrapperProps.className += " draggable";
                wrapperProps.onMouseDown = wrapperProps.onTouchStart = this.dragPositioner.handleReactDownEvent;
                if (this.dragPositioner.isDragging) {
                    wrapperProps.style = this.dragPositioner.getStyleAttributes();
                    wrapperProps.className += " dragging";
                }
            }
            if (this.props.facesLeft) {
                wrapperProps.className += " enemy-unit";
            }
            else {
                wrapperProps.className += " friendly-unit";
            }
            if (this.props.isActiveUnit) {
                wrapperProps.className += " active-unit";
            }
            if (this.props.isInPotentialTargetArea) {
                wrapperProps.className += " target-unit";
            }
            if (this.props.isHovered) {
                wrapperProps.className += " hovered-unit";
            }
            if (this.props.isTargetOfActiveEffect) {
                wrapperProps.className += " active-effect-unit";
            }
            if (Options_1.options.debug.enabled) {
                wrapperProps.title = "id: " + this.props.id;
            }
            var bodyElements = [
                ReactDOMElements.div({
                    className: "unit-portrait-container",
                    key: "portraitContainer",
                }, UnitPortrait_1.UnitPortrait({
                    imageSrc: (this.props.portraitSrc || ""),
                }), UnitPassiveEffects_1.UnitPassiveEffects({
                    passiveEffects: this.props.passiveEffects,
                }), UnitAttributeChanges_1.UnitAttributeChanges({
                    attributeChanges: this.props.attributeChanges,
                })),
                UnitInfo_1.UnitInfo({
                    key: "info",
                    name: this.props.name,
                    guardAmount: this.props.guardAmount,
                    guardType: this.props.guardType,
                    isPreparing: this.props.isPreparing,
                    maxHealth: this.props.maxHealth,
                    currentHealth: this.props.currentHealth,
                    currentActionPoints: this.props.currentActionPoints,
                    maxActionPoints: this.props.maxActionPoints,
                    hoveredActionPointExpenditure: this.props.hoveredActionPointExpenditure,
                    isSquadron: this.props.isSquadron,
                    wasDestroyed: this.props.wasDestroyed,
                    wasCaptured: this.props.wasCaptured,
                    animateDuration: this.props.animateDuration,
                }),
            ];
            if (this.props.facesLeft) {
                bodyElements.reverse();
            }
            if (this.props.isAnnihilated) {
                bodyElements.push(ReactDOMElements.div({ key: "overlay", className: "unit-annihilated-overlay" }, localize_1.localize("unitAnnihilated")()));
            }
            var innerElements = [
                ReactDOMElements.div({
                    className: "unit-body",
                    id: "unit-id_" + this.props.id,
                    key: "body",
                }, bodyElements),
                UnitIconContainer_1.UnitIconContainer({
                    key: "icon",
                    facesLeft: this.props.facesLeft,
                    iconSrc: this.props.iconSrc,
                }),
            ];
            return (ReactDOMElements.div(wrapperProps, this.props.facesLeft ? innerElements.reverse() : innerElements));
        };
        return UnitComponent;
    }(React.PureComponent));
    exports.UnitComponent = UnitComponent;
    exports.Unit = React.createFactory(UnitComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unit/UnitActions", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitActionsComponent = (function (_super) {
        __extends(UnitActionsComponent, _super);
        function UnitActionsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UnitActions";
            return _this;
        }
        UnitActionsComponent.prototype.render = function () {
            var availableSrc = "img/icons/availableAction.png";
            var hoveredSrc = "img/icons/hoveredAction.png";
            var spentSrc = "img/icons/spentAction.png";
            var icons = [];
            var availableCount = this.props.currentActionPoints - (this.props.hoveredActionPointExpenditure || 0);
            for (var i = 0; i < availableCount; i++) {
                icons.push(ReactDOMElements.img({
                    src: availableSrc,
                    className: "unit-action-point available-action-point",
                    key: "available" + i,
                }));
            }
            var hoveredCount = Math.min(this.props.hoveredActionPointExpenditure, this.props.currentActionPoints);
            for (var i = 0; i < hoveredCount; i++) {
                icons.push(ReactDOMElements.img({
                    src: hoveredSrc,
                    className: "unit-action-point hovered-action-point",
                    key: "hovered" + i,
                }));
            }
            var spentCount = this.props.maxActionPoints - this.props.currentActionPoints;
            for (var i = 0; i < spentCount; i++) {
                icons.push(ReactDOMElements.img({
                    src: spentSrc,
                    className: "unit-action-point spent-action-point",
                    key: "spent" + i,
                }));
            }
            return (ReactDOMElements.div({ className: "unit-action-points" }, icons));
        };
        return UnitActionsComponent;
    }(React.PureComponent));
    exports.UnitActionsComponent = UnitActionsComponent;
    exports.UnitActions = React.createFactory(UnitActionsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unit/UnitAttributeChanges", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitAttributeChangesComponent = (function (_super) {
        __extends(UnitAttributeChangesComponent, _super);
        function UnitAttributeChangesComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UnitAttributeChanges";
            return _this;
        }
        UnitAttributeChangesComponent.prototype.render = function () {
            var attributeElements = [];
            if (this.props.attributeChanges) {
                for (var attributeType in this.props.attributeChanges) {
                    if (attributeType === "maxActionPoints") {
                        continue;
                    }
                    var amountChanged = this.props.attributeChanges[attributeType];
                    if (!amountChanged) {
                        continue;
                    }
                    var changeIsPositive = amountChanged > 0;
                    var polarityString = changeIsPositive ? "positive" : "negative";
                    var polaritySign = changeIsPositive ? " +" : " ";
                    var imageSrc = "img/icons/statusEffect_" + polaritySign + "_" + attributeType + ".png";
                    var titleString = "" + attributeType + polarityString + amountChanged;
                    attributeElements.push(ReactDOMElements.img({
                        className: "attribute-change-icon" + "attribute-change-icon-" + "attributeType",
                        src: imageSrc,
                        key: attributeType,
                        title: titleString,
                    }));
                }
            }
            return (ReactDOMElements.div({
                className: "unit-attribute-changes",
            }, attributeElements));
        };
        return UnitAttributeChangesComponent;
    }(React.PureComponent));
    exports.UnitAttributeChangesComponent = UnitAttributeChangesComponent;
    exports.UnitAttributeChanges = React.createFactory(UnitAttributeChangesComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unit/UnitIconContainer", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitIconContainerComponent = (function (_super) {
        __extends(UnitIconContainerComponent, _super);
        function UnitIconContainerComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UnitIconContainer";
            return _this;
        }
        UnitIconContainerComponent.prototype.render = function () {
            var containerProps = {
                className: "unit-icon-container",
            };
            var fillerProps = {
                className: "unit-icon-filler",
            };
            if (this.props.facesLeft) {
                fillerProps.className += " unit-border-right";
                containerProps.className += " unit-border-no-right";
            }
            else {
                fillerProps.className += " unit-border-left";
                containerProps.className += " unit-border-no-left";
            }
            var iconElement = React.Children.count(this.props.children) === 1 ?
                React.Children.only(this.props.children) :
                ReactDOMElements.img({ src: this.props.iconSrc });
            return (ReactDOMElements.div({ className: "unit-icon-wrapper" }, ReactDOMElements.div(fillerProps), ReactDOMElements.div(containerProps, iconElement), ReactDOMElements.div(fillerProps)));
        };
        return UnitIconContainerComponent;
    }(React.PureComponent));
    exports.UnitIconContainerComponent = UnitIconContainerComponent;
    exports.UnitIconContainer = React.createFactory(UnitIconContainerComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unit/UnitInfo", ["require", "exports", "react", "react-dom-factories", "react-motion", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/unit/UnitActions", "modules/defaultui/uicomponents/unit/UnitStatus", "modules/defaultui/uicomponents/unit/UnitStrength", "src/utility"], function (require, exports, React, ReactDOMElements, ReactMotion, localize_1, UnitActions_1, UnitStatus_1, UnitStrength_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitInfoComponent = (function (_super) {
        __extends(UnitInfoComponent, _super);
        function UnitInfoComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UnitInfo";
            return _this;
        }
        UnitInfoComponent.prototype.render = function () {
            var _this = this;
            var battleEndStatus = null;
            if (this.props.wasDestroyed) {
                battleEndStatus = ReactDOMElements.div({
                    className: "unit-battle-end-status-container",
                }, ReactDOMElements.div({
                    className: "unit-battle-end-status unit-battle-end-status-dead",
                }, localize_1.localize("destroyed_statusText")()));
            }
            else if (this.props.wasCaptured) {
                battleEndStatus = ReactDOMElements.div({
                    className: "unit-battle-end-status-container",
                }, ReactDOMElements.div({
                    className: "unit-battle-end-status unit-battle-end-status-captured",
                }, localize_1.localize("captured_statusText")()));
            }
            return (ReactDOMElements.div({ className: "unit-info" }, ReactDOMElements.div({ className: "unit-info-name" }, this.props.name), ReactDOMElements.div({ className: "unit-info-inner" }, UnitStatus_1.UnitStatus({
                guardAmount: this.props.guardAmount,
                guardCoverage: this.props.guardType,
                isPreparing: this.props.isPreparing,
            }), React.createElement(ReactMotion.Motion, {
                style: {
                    health: this.props.animateDuration ?
                        utility_1.fixedDurationSpring(this.props.currentHealth, this.props.animateDuration) :
                        this.props.currentHealth,
                },
                defaultStyle: {
                    health: this.props.currentHealth,
                }
            }, function (interpolatedStyle) {
                return UnitStrength_1.UnitStrength({
                    maxHealth: _this.props.maxHealth,
                    currentHealth: interpolatedStyle.health,
                    isSquadron: _this.props.isSquadron,
                });
            }), UnitActions_1.UnitActions({
                maxActionPoints: this.props.maxActionPoints,
                currentActionPoints: this.props.currentActionPoints,
                hoveredActionPointExpenditure: this.props.hoveredActionPointExpenditure,
            }), battleEndStatus)));
        };
        return UnitInfoComponent;
    }(React.PureComponent));
    exports.UnitInfoComponent = UnitInfoComponent;
    exports.UnitInfo = React.createFactory(UnitInfoComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unit/UnitPassiveEffects", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitPassiveEffectsComponent = (function (_super) {
        __extends(UnitPassiveEffectsComponent, _super);
        function UnitPassiveEffectsComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UnitPassiveEffects";
            return _this;
        }
        UnitPassiveEffectsComponent.prototype.render = function () {
            return ((this.props.passiveEffects && this.props.passiveEffects.length > 0) ?
                ReactDOMElements.img({
                    className: "unit-passive-effects-icon",
                    src: "img/icons/availableAction.png",
                    title: this.props.passiveEffects.reduce(function (t, e) {
                        return "" + t + e.displayName + ": " + e.description + "\n";
                    }, ""),
                }) :
                null);
        };
        return UnitPassiveEffectsComponent;
    }(React.PureComponent));
    exports.UnitPassiveEffectsComponent = UnitPassiveEffectsComponent;
    exports.UnitPassiveEffects = React.createFactory(UnitPassiveEffectsComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unit/UnitPortrait", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitPortraitComponent = (function (_super) {
        __extends(UnitPortraitComponent, _super);
        function UnitPortraitComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UnitPortrait";
            return _this;
        }
        UnitPortraitComponent.prototype.render = function () {
            var props = {};
            props.className = "unit-portrait " + (this.props.className || "");
            if (this.props.imageSrc) {
                props.style =
                    {
                        backgroundImage: "url(\"" + this.props.imageSrc + "\")",
                    };
            }
            return (ReactDOMElements.div(props, null));
        };
        return UnitPortraitComponent;
    }(React.Component));
    exports.UnitPortraitComponent = UnitPortraitComponent;
    exports.UnitPortrait = React.createFactory(UnitPortraitComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unit/UnitStatus", ["require", "exports", "react", "react-dom-factories", "src/utility", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, utility_1, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitStatusComponent = (function (_super) {
        __extends(UnitStatusComponent, _super);
        function UnitStatusComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UnitStatus";
            return _this;
        }
        UnitStatusComponent.prototype.render = function () {
            var statusElement = null;
            if (this.props.guardAmount > 0) {
                var guard = this.props.guardAmount;
                var damageReduction = Math.min(50, guard / 2);
                var protectString = localize_1.localize("guard_chanceToProtect")({
                    protChance: guard,
                    guardCoverage: this.props.guardCoverage,
                });
                var damageReductionString = localize_1.localize("reducedPhysicalDamage")({ damageReduction: damageReduction });
                var guardText = "" + protectString +
                    ("\n" + damageReductionString);
                statusElement = ReactDOMElements.div({
                    className: "status-container guard-meter-container",
                }, ReactDOMElements.div({
                    className: "guard-meter-value",
                    style: {
                        width: "" + utility_1.clamp(guard, 0, 100) + "%",
                    },
                }), ReactDOMElements.div({
                    className: "status-inner-wrapper",
                }, ReactDOMElements.div({
                    className: "guard-text-container status-inner",
                    title: guardText,
                }, ReactDOMElements.div({
                    className: "guard-text status-text",
                }, localize_1.localize("guard_statusText")()), ReactDOMElements.div({
                    className: "guard-text-value status-text",
                }, "" + guard + "%"))));
            }
            else if (this.props.isPreparing) {
                statusElement = ReactDOMElements.div({
                    className: "status-container preparation-container",
                }, ReactDOMElements.div({
                    className: "status-inner-wrapper",
                }, ReactDOMElements.div({
                    className: "preparation-text-container status-inner",
                    title: localize_1.localize("preparing_tooltip")(),
                }, localize_1.localize("preparing_statusText")())));
            }
            return (ReactDOMElements.div({ className: "unit-status" }, statusElement));
        };
        return UnitStatusComponent;
    }(React.Component));
    exports.UnitStatusComponent = UnitStatusComponent;
    exports.UnitStatus = React.createFactory(UnitStatusComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unit/UnitStrength", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitStrengthComponent = (function (_super) {
        __extends(UnitStrengthComponent, _super);
        function UnitStrengthComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UnitStrength";
            _this.makeSquadronInfo = _this.makeSquadronInfo.bind(_this);
            _this.makeStrengthText = _this.makeStrengthText.bind(_this);
            _this.makeCapitalInfo = _this.makeCapitalInfo.bind(_this);
            return _this;
        }
        UnitStrengthComponent.prototype.makeSquadronInfo = function () {
            return (ReactDOMElements.div({ className: "unit-strength-container" }, this.makeStrengthText()));
        };
        UnitStrengthComponent.prototype.makeCapitalInfo = function () {
            var text = this.makeStrengthText();
            var relativeHealth = this.props.currentHealth / this.props.maxHealth;
            var bar = ReactDOMElements.div({
                className: "unit-strength-bar",
            }, ReactDOMElements.div({
                className: "unit-strength-bar-value",
                style: {
                    width: relativeHealth * 100 + "%",
                },
            }));
            return (ReactDOMElements.div({ className: "unit-strength-container" }, text, bar));
        };
        UnitStrengthComponent.prototype.makeStrengthText = function () {
            var critThreshhold = 0.3;
            var currentStyle = {
                className: "unit-strength-current",
            };
            var healthRatio = this.props.currentHealth / this.props.maxHealth;
            if (!this.props.isNotDetected && healthRatio <= critThreshhold) {
                currentStyle.className += " critical";
            }
            else if (!this.props.isNotDetected && this.props.currentHealth < this.props.maxHealth) {
                currentStyle.className += " wounded";
            }
            var containerProps = {
                className: (this.props.isSquadron ? "unit-strength-amount" :
                    "unit-strength-amount-capital"),
            };
            var displayed = this.props.isNotDetected ? "???" : "" + Math.ceil(this.props.currentHealth);
            var max = this.props.isNotDetected ? "???" : "" + this.props.maxHealth;
            return (ReactDOMElements.div(containerProps, ReactDOMElements.span(currentStyle, displayed), ReactDOMElements.span({ className: "unit-strength-max" }, "/" + max)));
        };
        UnitStrengthComponent.prototype.render = function () {
            if (this.props.isSquadron) {
                return this.makeSquadronInfo();
            }
            else {
                return this.makeCapitalInfo();
            }
        };
        return UnitStrengthComponent;
    }(React.Component));
    exports.UnitStrengthComponent = UnitStrengthComponent;
    exports.UnitStrength = React.createFactory(UnitStrengthComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unit/UnitWrapper", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitWrapperComponent = (function (_super) {
        __extends(UnitWrapperComponent, _super);
        function UnitWrapperComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UnitWrapper";
            return _this;
        }
        UnitWrapperComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "unit-wrapper",
            }, this.props.children));
        };
        return UnitWrapperComponent;
    }(React.Component));
    exports.UnitWrapperComponent = UnitWrapperComponent;
    exports.UnitWrapper = React.createFactory(UnitWrapperComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unitlist/AbilityList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/unitlist/AbilityListItem"], function (require, exports, React, ReactDOMElements, AbilityListItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AbilityListComponent = (function (_super) {
        __extends(AbilityListComponent, _super);
        function AbilityListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "AbilityList";
            return _this;
        }
        AbilityListComponent.prototype.render = function () {
            var abilities = this.props.abilities;
            var abilityElements = [];
            var addedAbilityTypes = {};
            abilities.sort(function (_a, _b) {
                if (_a.mainEffect && !_b.mainEffect) {
                    return -1;
                }
                else if (_b.mainEffect && !_a.mainEffect) {
                    return 1;
                }
                if (_a.type === "learnable") {
                    return 1;
                }
                else if (_b.type === "learnable") {
                    return -1;
                }
                var a = _a.displayName.toLowerCase();
                var b = _b.displayName.toLowerCase();
                if (a > b) {
                    return 1;
                }
                else if (a < b) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
            for (var i = 0; i < abilities.length; i++) {
                var ability = abilities[i];
                if (ability.isHidden) {
                    continue;
                }
                if (!addedAbilityTypes[ability.type]) {
                    addedAbilityTypes[ability.type] = 0;
                }
                abilityElements.push(AbilityListItem_1.AbilityListItem({
                    key: ability.type + addedAbilityTypes[ability.type],
                    type: this.getAbilityListItemType(ability, addedAbilityTypes[ability.type]),
                    displayName: ability.displayName,
                    title: ability.description,
                    onClick: (this.props.handleClick ? this.props.handleClick.bind(null, ability) : undefined)
                }));
                addedAbilityTypes[ability.type]++;
            }
            return (ReactDOMElements.ol({
                className: "ability-list",
            }, abilityElements, this.props.children));
        };
        AbilityListComponent.prototype.getAbilityListItemType = function (ability, addedAbilitiesOfType) {
            if (addedAbilitiesOfType > 0) {
                return "redundant";
            }
            else if (!ability.mainEffect) {
                return "passive";
            }
            else {
                return "active";
            }
        };
        return AbilityListComponent;
    }(React.Component));
    exports.AbilityListComponent = AbilityListComponent;
    exports.AbilityList = React.createFactory(AbilityListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unitlist/AbilityListItem", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var classNameMap = {
        active: "active-skill",
        passive: "passive-skill",
        redundant: "redundant-ability",
        learnable: "learnable-ability",
    };
    var AbilityListItemComponent = (function (_super) {
        __extends(AbilityListItemComponent, _super);
        function AbilityListItemComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "AbilityListItem";
            return _this;
        }
        AbilityListItemComponent.prototype.render = function () {
            return (ReactDOMElements.li({
                className: "unit-info-ability " + classNameMap[this.props.type],
                title: this.props.title,
                onClick: this.props.onClick,
            }, "[" + this.props.displayName + "]"));
        };
        return AbilityListItemComponent;
    }(React.Component));
    exports.AbilityListItemComponent = AbilityListItemComponent;
    exports.AbilityListItem = React.createFactory(AbilityListItemComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unitlist/ItemEquip", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/unitlist/ItemList", "modules/defaultui/uicomponents/unitlist/MenuUnitInfo", "modules/defaultui/uicomponents/unitlist/UnitList"], function (require, exports, React, ReactDOMElements, ItemList_1, MenuUnitInfo_1, UnitList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ItemEquipComponent = (function (_super) {
        __extends(ItemEquipComponent, _super);
        function ItemEquipComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ItemEquip";
            _this.state =
                {
                    selectedUnit: null,
                    currentDragItem: null,
                };
            _this.handleDragStart = _this.handleDragStart.bind(_this);
            _this.handleDragEnd = _this.handleDragEnd.bind(_this);
            _this.handleDrop = _this.handleDrop.bind(_this);
            _this.handleSelectItemListRow = _this.handleSelectItemListRow.bind(_this);
            _this.handleSelectUnitListRow = _this.handleSelectUnitListRow.bind(_this);
            _this.equipItemOnSelectedUnit = _this.equipItemOnSelectedUnit.bind(_this);
            return _this;
        }
        ItemEquipComponent.prototype.render = function () {
            var player = this.props.player;
            return (ReactDOMElements.div({ className: "item-equip" }, ReactDOMElements.div({ className: "item-equip-left" }, MenuUnitInfo_1.MenuUnitInfo({
                unit: this.state.selectedUnit,
                onMouseUp: this.handleDrop,
                isDraggable: true,
                onDragStart: this.handleDragStart,
                onDragEnd: this.handleDragEnd,
                currentDragItem: this.state.currentDragItem,
            }), ItemList_1.ItemList({
                items: player.items,
                isDraggable: true,
                onDragStart: this.handleDragStart,
                onDragEnd: this.handleDragEnd,
                onRowChange: this.handleSelectItemListRow,
            })), UnitList_1.UnitList({
                units: player.units,
                selectedUnit: this.state.selectedUnit,
                reservedUnits: [],
                unavailableUnits: player.units.filter(function (unit) { return !unit.canFightOffensiveBattle(); }),
                isDraggable: false,
                onRowChange: this.handleSelectUnitListRow,
                autoSelect: true,
                onMouseUp: this.equipItemOnSelectedUnit,
            })));
        };
        ItemEquipComponent.prototype.handleSelectItemListRow = function (row) {
            if (row.content.props.unit) {
                this.setState({
                    selectedUnit: row.content.props.unit,
                });
            }
        };
        ItemEquipComponent.prototype.handleSelectUnitListRow = function (row) {
            this.setState({
                selectedUnit: row.content.props.unit,
            });
        };
        ItemEquipComponent.prototype.handleDragStart = function (item) {
            this.setState({
                currentDragItem: item,
            });
        };
        ItemEquipComponent.prototype.handleDragEnd = function (dropSuccessful) {
            if (dropSuccessful === void 0) { dropSuccessful = false; }
            if (!dropSuccessful && this.state.currentDragItem && this.state.selectedUnit) {
                var item = this.state.currentDragItem;
                if (this.state.selectedUnit.items.hasItem(item)) {
                    console.log("fail drag remove");
                    this.state.selectedUnit.items.removeItem(item);
                }
            }
            this.setState({
                currentDragItem: null,
            });
        };
        ItemEquipComponent.prototype.handleDrop = function (index) {
            var item = this.state.currentDragItem;
            var unit = this.state.selectedUnit;
            if (unit && item) {
                unit.items.addItemAtPosition(item, index);
            }
            this.handleDragEnd(true);
        };
        ItemEquipComponent.prototype.equipItemOnSelectedUnit = function (unit) {
            var item = this.state.currentDragItem;
            if (item) {
                if (!unit.items.hasItem(item) && unit.items.hasSlotForItem(item)) {
                    console.log("Unit list drop " + unit.template.type + " => " + item.template.type);
                    unit.items.addItem(item);
                    this.setState({
                        selectedUnit: unit,
                    });
                }
            }
            this.handleDragEnd(true);
        };
        return ItemEquipComponent;
    }(React.Component));
    exports.ItemEquipComponent = ItemEquipComponent;
    exports.ItemEquip = React.createFactory(ItemEquipComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unitlist/ItemList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/list/List", "modules/defaultui/uicomponents/unitlist/ItemListItem"], function (require, exports, React, ReactDOMElements, localize_1, List_1, ItemListItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ItemListComponent = (function (_super) {
        __extends(ItemListComponent, _super);
        function ItemListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ItemList";
            _this.bindMethods();
            return _this;
        }
        ItemListComponent.prototype.getSlotIndex = function (slot) {
            if (slot === "high") {
                return 2;
            }
            else if (slot === "mid") {
                return 1;
            }
            else {
                return 0;
            }
        };
        ItemListComponent.prototype.bindMethods = function () {
            this.getSlotIndex = this.getSlotIndex.bind(this);
        };
        ItemListComponent.prototype.render = function () {
            var rows = [];
            var items = this.props.items;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var ability = null;
                var abilityIsPassive = false;
                if (item.template.ability) {
                    ability = item.template.ability;
                }
                else if (item.template.passiveSkill) {
                    ability = item.template.passiveSkill;
                    abilityIsPassive = true;
                }
                var props = {
                    typeName: item.template.displayName,
                    slot: item.template.slot,
                    unitName: item.unit ? item.unit.name : "",
                    item: item,
                    key: item.id,
                    keyTODO: item.id,
                    id: item.id,
                    slotIndex: this.getSlotIndex(item.template.slot),
                    unit: item.unit ? item.unit : null,
                    techLevel: item.template.techLevel,
                    cost: item.template.buildCost,
                    ability: ability,
                    abilityIsPassive: abilityIsPassive,
                    isReserved: Boolean(item.unit),
                    dragPositionerProps: {
                        shouldMakeClone: true,
                        forcedDragOffset: { x: 32, y: 32 },
                    },
                    isDraggable: this.props.isDraggable,
                    onDragStart: this.props.onDragStart,
                    onDragEnd: this.props.onDragEnd,
                };
                rows.push({
                    key: "" + item.id,
                    content: ItemListItem_1.ItemListItem(props),
                });
            }
            var columns = [
                {
                    label: localize_1.localize("type")(),
                    key: "typeName",
                    defaultOrder: "asc",
                },
                {
                    label: localize_1.localize("slot")(),
                    key: "slot",
                    propToSortBy: "slotIndex",
                    defaultOrder: "desc",
                },
                {
                    label: localize_1.localize("unit")(),
                    key: "unitName",
                    defaultOrder: "desc",
                },
                {
                    label: localize_1.localize("ability")(),
                    key: "ability",
                    defaultOrder: "desc",
                },
            ];
            return (ReactDOMElements.div({ className: "item-list fixed-table-parent" }, List_1.List({
                listItems: rows,
                initialColumns: columns,
                initialSortOrder: [columns[1], columns[2]],
                onRowChange: this.props.onRowChange,
                tabIndex: 2,
                keyboardSelect: true,
            })));
        };
        return ItemListComponent;
    }(React.Component));
    exports.ItemListComponent = ItemListComponent;
    exports.ItemList = React.createFactory(ItemListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unitlist/ItemListItem", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/mixins/DragPositioner", "modules/defaultui/uicomponents/mixins/applyMixins"], function (require, exports, React, ReactDOMElements, DragPositioner_1, applyMixins_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ItemListItemComponent = (function (_super) {
        __extends(ItemListItemComponent, _super);
        function ItemListItemComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "ItemListItem";
            _this.ownDOMNode = React.createRef();
            _this.bindMethods();
            if (_this.props.isDraggable) {
                _this.dragPositioner = new DragPositioner_1.DragPositioner(_this, _this.ownDOMNode, _this.props.dragPositionerProps);
                _this.dragPositioner.onDragStart = _this.onDragStart;
                _this.dragPositioner.onDragEnd = _this.onDragEnd;
                _this.dragPositioner.makeDragClone = _this.makeDragClone;
                applyMixins_1.applyMixins(_this, _this.dragPositioner);
            }
            return _this;
        }
        ItemListItemComponent.prototype.bindMethods = function () {
            this.makeCell = this.makeCell.bind(this);
            this.onDragEnd = this.onDragEnd.bind(this);
            this.onDragStart = this.onDragStart.bind(this);
            this.makeDragClone = this.makeDragClone.bind(this);
        };
        ItemListItemComponent.prototype.onDragStart = function () {
            this.props.onDragStart(this.props.item);
        };
        ItemListItemComponent.prototype.onDragEnd = function () {
            this.props.onDragEnd();
        };
        ItemListItemComponent.prototype.makeCell = function (type) {
            var cellProps = {};
            cellProps.key = type;
            cellProps.className = "item-list-item-cell" + " item-list-" + type;
            var cellContent;
            switch (type) {
                case "ability":
                    {
                        if (this.props.ability) {
                            cellProps.title = this.props.ability.description;
                            if (this.props.abilityIsPassive) {
                                cellProps.className += " passive-skill";
                            }
                            cellContent = this.props.ability.displayName;
                        }
                        break;
                    }
                default:
                    {
                        cellContent = this.props[type];
                        if (isFinite(cellContent)) {
                            cellProps.className += " center-text";
                        }
                        break;
                    }
            }
            return (ReactDOMElements.td(cellProps, cellContent));
        };
        ItemListItemComponent.prototype.makeDragClone = function () {
            var clone = new Image();
            clone.src = this.props.item.template.getIconSrc();
            clone.className = "item-icon-base draggable dragging";
            return clone;
        };
        ItemListItemComponent.prototype.render = function () {
            var columns = this.props.activeColumns;
            var cells = [];
            for (var i = 0; i < columns.length; i++) {
                var cell = this.makeCell(columns[i].key);
                cells.push(cell);
            }
            var rowProps = {
                className: "item-list-item",
                onClick: this.props.handleClick,
                key: this.props.keyTODO,
                ref: this.ownDOMNode,
            };
            if (this.dragPositioner) {
                rowProps.className += " draggable";
                rowProps.onTouchStart = rowProps.onMouseDown =
                    this.dragPositioner.handleReactDownEvent;
            }
            if (this.props.isReserved) {
                rowProps.className += " reserved-item";
            }
            return (ReactDOMElements.tr(rowProps, cells));
        };
        return ItemListItemComponent;
    }(React.Component));
    exports.ItemListItemComponent = ItemListItemComponent;
    exports.ItemListItem = React.createFactory(ItemListItemComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unitlist/MenuUnitInfo", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/unitlist/AbilityList", "modules/defaultui/uicomponents/unitlist/UnitExperience", "modules/defaultui/uicomponents/unitlist/UnitItemGroup"], function (require, exports, React, ReactDOMElements, AbilityList_1, UnitExperience_1, UnitItemGroup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MenuUnitInfoComponent = (function (_super) {
        __extends(MenuUnitInfoComponent, _super);
        function MenuUnitInfoComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "MenuUnitInfo";
            _this.bindMethods();
            return _this;
        }
        MenuUnitInfoComponent.prototype.bindMethods = function () {
            this.handleUnitUpgrade = this.handleUnitUpgrade.bind(this);
        };
        MenuUnitInfoComponent.prototype.handleUnitUpgrade = function () {
            this.forceUpdate();
        };
        MenuUnitInfoComponent.prototype.render = function () {
            var unit = this.props.unit;
            if (!unit) {
                return (ReactDOMElements.div({ className: "menu-unit-info" }));
            }
            var itemGroups = [];
            var itemsBySlot = unit.items.getItemsBySlot();
            for (var slot in unit.items.itemSlots) {
                itemGroups.push(UnitItemGroup_1.UnitItemGroup({
                    key: slot,
                    slotName: slot,
                    maxItems: unit.items.itemSlots[slot],
                    items: itemsBySlot[slot],
                    onMouseUp: this.props.onMouseUp,
                    isDraggable: this.props.isDraggable,
                    onDragStart: this.props.onDragStart,
                    onDragEnd: this.props.onDragEnd,
                    currentDragItem: this.props.currentDragItem,
                }));
            }
            var unitAbilities = unit.getAllAbilities();
            unitAbilities = unitAbilities.concat(unit.getAllPassiveSkills());
            return (ReactDOMElements.div({
                className: "menu-unit-info",
            }, ReactDOMElements.div({
                className: "menu-unit-info-left",
            }, ReactDOMElements.div({
                className: "menu-unit-info-name",
            }, unit.name), ReactDOMElements.div({
                className: "menu-unit-info-abilities",
            }, AbilityList_1.AbilityList({
                abilities: unitAbilities,
            })), UnitExperience_1.UnitExperience({
                experienceForCurrentLevel: unit.experienceForCurrentLevel,
                experienceToNextLevel: unit.getExperienceToNextLevel(),
                unit: unit,
                onUnitUpgrade: this.handleUnitUpgrade,
            })), ReactDOMElements.div({
                className: "menu-unit-info-items-wrapper",
            }, itemGroups)));
        };
        return MenuUnitInfoComponent;
    }(React.Component));
    exports.MenuUnitInfoComponent = MenuUnitInfoComponent;
    exports.MenuUnitInfo = React.createFactory(MenuUnitInfoComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unitlist/UnitExperience", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/windows/DefaultWindow", "modules/defaultui/uicomponents/unitlist/UpgradeUnit"], function (require, exports, React, ReactDOMElements, localize_1, DefaultWindow_1, UpgradeUnit_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitExperienceComponent = (function (_super) {
        __extends(UnitExperienceComponent, _super);
        function UnitExperienceComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UnitExperience";
            _this.state =
                {
                    hasUpgradePopup: false,
                };
            _this.bindMethods();
            return _this;
        }
        UnitExperienceComponent.prototype.render = function () {
            var rows = [];
            var totalBars = Math.ceil(this.props.experienceToNextLevel) / 10;
            var filledBars = Math.ceil(this.props.experienceForCurrentLevel / 10);
            var lastBarWidth = (10 * (this.props.experienceForCurrentLevel % 10));
            for (var i = 0; i < totalBars; i++) {
                var bgProps = {
                    className: "unit-experience-bar-point-background",
                };
                if (i < filledBars) {
                    bgProps.className += " filled";
                    if (i === filledBars - 1 && lastBarWidth !== 0) {
                        bgProps.style =
                            {
                                width: "" + lastBarWidth + "%",
                            };
                    }
                }
                else {
                    bgProps.className += " empty";
                }
                rows.push(ReactDOMElements.div({
                    className: "unit-experience-bar-point",
                    key: "" + i,
                }, ReactDOMElements.div(bgProps, null)));
            }
            var isReadyToLevelUp = this.props.experienceForCurrentLevel >= this.props.experienceToNextLevel;
            var containerProps = {
                className: "unit-experience-bar-container",
            };
            var barProps = {
                className: "unit-experience-bar",
                title: localize_1.localize("EXPReadOut")({
                    currentEXP: this.props.experienceForCurrentLevel,
                    EXPToNextLevel: this.props.experienceToNextLevel,
                }),
            };
            if (isReadyToLevelUp) {
                containerProps.onClick = this.openPopup;
                containerProps.className += " ready-to-level-up";
            }
            return (ReactDOMElements.div({
                className: "unit-experience-wrapper",
            }, !this.state.hasUpgradePopup ? null :
                DefaultWindow_1.DefaultWindow({
                    title: localize_1.localize("upgradeUnit")(),
                    handleClose: this.closePopup,
                    isResizable: false,
                }, UpgradeUnit_1.UpgradeUnit({
                    unit: this.props.unit,
                    onUnitUpgrade: this.handleUnitUpgrade,
                })), ReactDOMElements.div(containerProps, ReactDOMElements.div(barProps, rows), !isReadyToLevelUp ? null : ReactDOMElements.span({
                className: "ready-to-level-up-message",
            }, localize_1.localize("clickToLevelUp")()))));
        };
        UnitExperienceComponent.prototype.bindMethods = function () {
            this.openPopup = this.openPopup.bind(this);
            this.closePopup = this.closePopup.bind(this);
            this.handleUnitUpgrade = this.handleUnitUpgrade.bind(this);
        };
        UnitExperienceComponent.prototype.openPopup = function () {
            this.setState({ hasUpgradePopup: true });
        };
        UnitExperienceComponent.prototype.closePopup = function () {
            this.setState({ hasUpgradePopup: false });
        };
        UnitExperienceComponent.prototype.handleUnitUpgrade = function () {
            if (this.props.unit.canLevelUp()) {
                this.props.onUnitUpgrade();
            }
            else {
                this.closePopup();
            }
        };
        return UnitExperienceComponent;
    }(React.Component));
    exports.UnitExperienceComponent = UnitExperienceComponent;
    exports.UnitExperience = React.createFactory(UnitExperienceComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unitlist/UnitItem", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/mixins/DragPositioner", "modules/defaultui/uicomponents/mixins/applyMixins", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, DragPositioner_1, applyMixins_1, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitItemComponent = (function (_super) {
        __extends(UnitItemComponent, _super);
        function UnitItemComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UnitItem";
            _this.ownDOMNode = React.createRef();
            _this.bindMethods();
            _this.dragPositioner = new DragPositioner_1.DragPositioner(_this, _this.ownDOMNode, _this.props.dragPositionerProps);
            _this.dragPositioner.onDragStart = _this.onDragStart;
            _this.dragPositioner.onDragEnd = _this.onDragEnd;
            applyMixins_1.applyMixins(_this, _this.dragPositioner);
            return _this;
        }
        UnitItemComponent.prototype.bindMethods = function () {
            this.onDragEnd = this.onDragEnd.bind(this);
            this.getTechIcon = this.getTechIcon.bind(this);
            this.onDragStart = this.onDragStart.bind(this);
        };
        UnitItemComponent.prototype.onDragStart = function () {
            this.props.onDragStart(this.props.item);
        };
        UnitItemComponent.prototype.onDragEnd = function () {
            this.props.onDragEnd();
        };
        UnitItemComponent.prototype.getTechIcon = function (techLevel) {
            switch (techLevel) {
                case 2:
                    {
                        return "img/icons/t2icon.png";
                    }
                case 3:
                    {
                        return "img/icons/t3icon.png";
                    }
                default:
                    {
                        throw new Error("Couldn't find icon for item tech level " + techLevel);
                    }
            }
        };
        UnitItemComponent.prototype.render = function () {
            if (!this.props.item) {
                return ReactDOMElements.div({
                    className: "empty-unit-item",
                    title: localize_1.localize("itemSlot")(this.props.slot),
                    ref: this.ownDOMNode,
                });
            }
            var item = this.props.item;
            var divProps = {
                className: "unit-item",
                title: item.template.displayName,
                ref: this.ownDOMNode,
            };
            if (this.props.isDraggable) {
                divProps.className += " draggable";
                divProps.onMouseDown = divProps.onTouchStart =
                    this.dragPositioner.handleReactDownEvent;
                if (this.dragPositioner.isDragging) {
                    divProps.style = this.dragPositioner.getStyleAttributes();
                    divProps.className += " dragging";
                }
            }
            return (ReactDOMElements.div(divProps, ReactDOMElements.div({
                className: "item-icon-container",
            }, ReactDOMElements.img({
                className: "item-icon-base",
                src: item.template.getIconSrc(),
            }), item.template.techLevel > 1 ? ReactDOMElements.img({
                className: "item-icon-tech-level",
                src: this.getTechIcon(item.template.techLevel),
            }) : null)));
        };
        return UnitItemComponent;
    }(React.Component));
    exports.UnitItemComponent = UnitItemComponent;
    exports.UnitItem = React.createFactory(UnitItemComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unitlist/UnitItemGroup", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/unitlist/UnitItemWrapper"], function (require, exports, React, ReactDOMElements, UnitItemWrapper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitItemGroupComponent = (function (_super) {
        __extends(UnitItemGroupComponent, _super);
        function UnitItemGroupComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UnitItemGroup";
            return _this;
        }
        UnitItemGroupComponent.prototype.render = function () {
            var itemWrappers = [];
            var itemsByPosition = {};
            this.props.items.forEach(function (item) {
                itemsByPosition[item.positionInUnit] = item;
            });
            for (var i = 0; i < this.props.maxItems; i++) {
                itemWrappers.push(UnitItemWrapper_1.UnitItemWrapper({
                    key: i,
                    slot: this.props.slotName,
                    item: itemsByPosition[i],
                    index: i,
                    onMouseUp: this.props.onMouseUp,
                    isDraggable: this.props.isDraggable,
                    onDragStart: this.props.onDragStart,
                    onDragEnd: this.props.onDragEnd,
                    currentDragItem: this.props.currentDragItem,
                }));
            }
            return (ReactDOMElements.div({
                className: "unit-item-group unit-item-group-" + this.props.slotName,
            }, itemWrappers));
        };
        return UnitItemGroupComponent;
    }(React.Component));
    exports.UnitItemGroupComponent = UnitItemGroupComponent;
    exports.UnitItemGroup = React.createFactory(UnitItemGroupComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unitlist/UnitItemWrapper", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/unitlist/UnitItem"], function (require, exports, React, ReactDOMElements, UnitItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitItemWrapperComponent = (function (_super) {
        __extends(UnitItemWrapperComponent, _super);
        function UnitItemWrapperComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UnitItemWrapper";
            _this.bindMethods();
            return _this;
        }
        UnitItemWrapperComponent.prototype.bindMethods = function () {
            this.handleMouseUp = this.handleMouseUp.bind(this);
        };
        UnitItemWrapperComponent.prototype.handleMouseUp = function () {
            this.props.onMouseUp(this.props.index);
        };
        UnitItemWrapperComponent.prototype.render = function () {
            var wrapperProps = {
                className: "unit-item-wrapper",
            };
            if (this.props.onMouseUp) {
                wrapperProps.onMouseUp = this.handleMouseUp;
            }
            if (this.props.currentDragItem) {
                var dragItem = this.props.currentDragItem;
                if (dragItem.template.slot === this.props.slot) {
                    wrapperProps.className += " drop-target";
                }
                else {
                    wrapperProps.onMouseUp = null;
                    wrapperProps.className += " invalid-drop-target";
                }
            }
            return (ReactDOMElements.div(wrapperProps, UnitItem_1.UnitItem({
                item: this.props.item,
                slot: this.props.slot,
                key: "item",
                isDraggable: this.props.isDraggable,
                onDragStart: this.props.onDragStart,
                onDragEnd: this.props.onDragEnd,
            })));
        };
        return UnitItemWrapperComponent;
    }(React.Component));
    exports.UnitItemWrapperComponent = UnitItemWrapperComponent;
    exports.UnitItemWrapper = React.createFactory(UnitItemWrapperComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unitlist/UnitList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/list/List", "modules/defaultui/uicomponents/unitlist/UnitListItem"], function (require, exports, React, ReactDOMElements, localize_1, List_1, UnitListItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitListComponent = (function (_super) {
        __extends(UnitListComponent, _super);
        function UnitListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UnitList";
            return _this;
        }
        UnitListComponent.prototype.render = function () {
            var _this = this;
            var rows = this.props.units.map(function (unit) {
                return ({
                    key: "" + unit.id,
                    content: UnitListItem_1.UnitListItem({
                        unit: unit,
                        id: unit.id,
                        name: unit.name,
                        typeName: unit.template.displayName,
                        strength: unit.currentHealth + " / " + unit.maxHealth,
                        currentHealth: unit.currentHealth,
                        maxHealth: unit.maxHealth,
                        maxActionPoints: unit.attributes.maxActionPoints,
                        attack: unit.attributes.attack,
                        defence: unit.attributes.defence,
                        intelligence: unit.attributes.intelligence,
                        speed: unit.attributes.speed,
                        isReserved: _this.props.reservedUnits.indexOf(unit) !== -1,
                        isUnavailable: _this.props.unavailableUnits.indexOf(unit) !== -1,
                        isSelected: Boolean(_this.props.selectedUnit && _this.props.selectedUnit.id === unit.id),
                        isHovered: Boolean(_this.props.hoveredUnit && _this.props.hoveredUnit.id === unit.id),
                        onMouseEnter: _this.props.onMouseEnterUnit,
                        onMouseLeave: _this.props.onMouseLeaveUnit,
                        onMouseUp: _this.props.onMouseUp,
                        isDraggable: _this.props.isDraggable,
                        onDragStart: _this.props.onDragStart,
                        onDragEnd: _this.props.onDragEnd,
                        dragPositionerProps: {
                            shouldMakeClone: true,
                        },
                    }),
                });
            });
            var columns = [
                {
                    label: localize_1.localize("unitName")(),
                    key: "name",
                    defaultOrder: "asc",
                },
                {
                    label: localize_1.localize("type")(),
                    key: "typeName",
                    defaultOrder: "asc",
                },
                {
                    label: localize_1.localize("strength")(),
                    key: "strength",
                    defaultOrder: "desc",
                    sortingFunction: function (a, b) {
                        return a.content.props.currentHealth - b.content.props.currentHealth;
                    },
                },
                {
                    label: localize_1.localize("act")(),
                    key: "maxActionPoints",
                    defaultOrder: "desc",
                },
                {
                    label: localize_1.localize("atk")(),
                    key: "attack",
                    defaultOrder: "desc",
                },
                {
                    label: localize_1.localize("def")(),
                    key: "defence",
                    defaultOrder: "desc",
                },
                {
                    label: localize_1.localize("int")(),
                    key: "intelligence",
                    defaultOrder: "desc",
                },
                {
                    label: localize_1.localize("spd")(),
                    key: "speed",
                    defaultOrder: "desc",
                },
            ];
            return (ReactDOMElements.div({ className: "unit-list fixed-table-parent" }, List_1.List({
                listItems: rows,
                initialColumns: columns,
                onRowChange: this.props.onRowChange,
                autoSelect: this.props.autoSelect,
                keyboardSelect: true,
            })));
        };
        return UnitListComponent;
    }(React.Component));
    exports.UnitListComponent = UnitListComponent;
    exports.UnitList = React.createFactory(UnitListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unitlist/UnitListItem", ["require", "exports", "react", "react-dom-factories", "react-dom", "src/utility", "modules/defaultui/uicomponents/unit/Unit", "modules/defaultui/uicomponents/unit/UnitStrength", "modules/defaultui/uicomponents/mixins/DragPositioner", "modules/defaultui/uicomponents/mixins/applyMixins"], function (require, exports, React, ReactDOMElements, ReactDOM, utility_1, Unit_1, UnitStrength_1, DragPositioner_1, applyMixins_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitListItemComponent = (function (_super) {
        __extends(UnitListItemComponent, _super);
        function UnitListItemComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UnitListItem";
            _this.ownDOMNode = React.createRef();
            _this.bindMethods();
            if (_this.props.isDraggable) {
                _this.dragPositioner = new DragPositioner_1.DragPositioner(_this, _this.ownDOMNode, _this.props.dragPositionerProps);
                _this.dragPositioner.onDragStart = _this.onDragStart;
                _this.dragPositioner.makeDragClone = _this.makeDragClone;
                _this.dragPositioner.onDragEnd = _this.onDragEnd;
                applyMixins_1.applyMixins(_this, _this.dragPositioner);
            }
            return _this;
        }
        UnitListItemComponent.prototype.bindMethods = function () {
            this.handleMouseEnter = this.handleMouseEnter.bind(this);
            this.handleMouseLeave = this.handleMouseLeave.bind(this);
            this.handleMouseUp = this.handleMouseUp.bind(this);
            this.makeCell = this.makeCell.bind(this);
            this.onDragEnd = this.onDragEnd.bind(this);
            this.onDragStart = this.onDragStart.bind(this);
            this.makeDragClone = this.makeDragClone.bind(this);
        };
        UnitListItemComponent.prototype.componentDidMount = function () {
            if (!this.props.isDraggable) {
                return;
            }
            var container = document.getElementsByClassName("unit-wrapper")[0];
            this.dragPositioner.forcedDragOffset =
                {
                    x: container.offsetWidth / 2,
                    y: container.offsetHeight / 2,
                };
        };
        UnitListItemComponent.prototype.onDragStart = function () {
            if (!this.props.onDragStart) {
                throw new Error("Draggable list item must specify props.onDragStart handler");
            }
            this.props.onDragStart(this.props.unit);
        };
        UnitListItemComponent.prototype.makeDragClone = function () {
            var container = document.createElement("div");
            ReactDOM.render(Unit_1.Unit(utility_1.shallowExtend(this.props.unit.getDisplayData("battlePrep"), { id: this.props.unit.id })), container);
            var renderedElement = container.firstChild;
            var wrapperElement = document.getElementsByClassName("unit-wrapper")[0];
            renderedElement.classList.add("draggable", "dragging");
            renderedElement.style.width = "" + wrapperElement.offsetWidth + "px";
            renderedElement.style.height = "" + wrapperElement.offsetHeight + "px";
            this.dragPositioner.forcedDragOffset =
                {
                    x: wrapperElement.offsetWidth / 2,
                    y: wrapperElement.offsetHeight / 2,
                };
            return renderedElement;
        };
        UnitListItemComponent.prototype.onDragEnd = function () {
            this.props.onDragEnd();
        };
        UnitListItemComponent.prototype.handleMouseEnter = function () {
            this.props.onMouseEnter(this.props.unit);
        };
        UnitListItemComponent.prototype.handleMouseLeave = function () {
            this.props.onMouseLeave();
        };
        UnitListItemComponent.prototype.handleMouseUp = function () {
            this.props.onMouseUp(this.props.unit);
        };
        UnitListItemComponent.prototype.makeCell = function (type) {
            var unit = this.props.unit;
            var cellProps = {};
            cellProps.key = type;
            cellProps.className = "unit-list-item-cell" + " unit-list-" + type;
            var cellContent;
            switch (type) {
                case "strength":
                    {
                        cellContent = UnitStrength_1.UnitStrength({
                            maxHealth: this.props.maxHealth,
                            currentHealth: this.props.currentHealth,
                            isSquadron: true,
                        });
                        break;
                    }
                case "attack":
                case "defence":
                case "intelligence":
                case "speed":
                    {
                        cellContent = this.props[type];
                        if (unit.attributes[type] < unit.baseAttributes[type]) {
                            cellProps.className += " lowered-stat";
                        }
                        else if (unit.attributes[type] > unit.baseAttributes[type]) {
                            cellProps.className += " raised-stat";
                        }
                        break;
                    }
                default:
                    {
                        cellContent = this.props[type];
                        break;
                    }
            }
            return (ReactDOMElements.td(cellProps, cellContent));
        };
        UnitListItemComponent.prototype.render = function () {
            var columns = this.props.activeColumns;
            var cells = [];
            for (var i = 0; i < columns.length; i++) {
                var cell = this.makeCell(columns[i].key);
                cells.push(cell);
            }
            var rowProps = {
                className: "unit-list-item",
                onClick: this.props.handleClick,
                ref: this.ownDOMNode,
            };
            if (this.props.isDraggable && !this.props.isUnavailable) {
                rowProps.className += " draggable";
                rowProps.onTouchStart = rowProps.onMouseDown =
                    this.dragPositioner.handleReactDownEvent;
            }
            if (this.props.isSelected) {
                rowProps.className += " selected-unit";
            }
            if (this.props.isReserved) {
                rowProps.className += " reserved-unit";
            }
            if (this.props.isUnavailable) {
                rowProps.className += " unavailable-unit";
            }
            if (this.props.isHovered) {
                rowProps.className += " unit-list-item-hovered";
            }
            if (this.props.onMouseEnter && this.props.onMouseLeave) {
                rowProps.onMouseEnter = this.handleMouseEnter;
                rowProps.onMouseLeave = this.handleMouseLeave;
            }
            if (this.props.onMouseUp) {
                rowProps.onMouseUp = this.handleMouseUp;
            }
            return (ReactDOMElements.tr(rowProps, cells));
        };
        return UnitListItemComponent;
    }(React.Component));
    exports.UnitListItemComponent = UnitListItemComponent;
    exports.UnitListItem = React.createFactory(UnitListItemComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unitlist/UpgradeAbilities", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/windows/DefaultWindow", "modules/defaultui/uicomponents/unitlist/AbilityList", "modules/defaultui/uicomponents/unitlist/AbilityListItem"], function (require, exports, React, ReactDOMElements, localize_1, DefaultWindow_1, AbilityList_1, AbilityListItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UpgradeAbilitiesComponent = (function (_super) {
        __extends(UpgradeAbilitiesComponent, _super);
        function UpgradeAbilitiesComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UpgradeAbilities";
            _this.state =
                {
                    activePopupType: null,
                    currentlyUpgradingAbility: null,
                };
            _this.closePopup = _this.closePopup.bind(_this);
            _this.toggleUpgradeAbilityPopup = _this.toggleUpgradeAbilityPopup.bind(_this);
            _this.toggleLearnNewAbilityPopup = _this.toggleLearnNewAbilityPopup.bind(_this);
            _this.handleUpgradeAbilityTargetClick = _this.handleUpgradeAbilityTargetClick.bind(_this);
            _this.upgradeAbility = _this.upgradeAbility.bind(_this);
            _this.learnAbility = _this.learnAbility.bind(_this);
            return _this;
        }
        UpgradeAbilitiesComponent.prototype.render = function () {
            var _this = this;
            var canLearnNewAbility = this.props.learnableAbilities.length > 0;
            var currentlyUpgradingAbility = this.state.currentlyUpgradingAbility ?
                this.props.upgradableAbilitiesData[this.state.currentlyUpgradingAbility.type] :
                null;
            return (ReactDOMElements.div({
                className: "upgrade-abilities",
            }, ReactDOMElements.div({
                className: "upgrade-abilities-header",
            }, localize_1.localize("upgradeAbilitiesHeader")()), AbilityList_1.AbilityList({
                abilities: Object.keys(this.props.upgradableAbilitiesData).map(function (sourceAbilityType) {
                    return _this.props.upgradableAbilitiesData[sourceAbilityType].source;
                }),
                handleClick: this.toggleUpgradeAbilityPopup,
            }, !canLearnNewAbility ? null : AbilityListItem_1.AbilityListItem({
                key: "learnNewAbility",
                type: "learnable",
                displayName: localize_1.localize("newAbility")(),
                title: localize_1.localize("clickToLearnNewAbility")(),
                onClick: this.toggleLearnNewAbilityPopup,
            })), !this.state.activePopupType ? null :
                DefaultWindow_1.DefaultWindow({
                    title: this.state.activePopupType === "learn" ?
                        localize_1.localize("learnAbility")() :
                        localize_1.localize("upgradeSpecificAbility")(currentlyUpgradingAbility.source.displayName),
                    handleClose: this.closePopup,
                    isResizable: false,
                }, AbilityList_1.AbilityList({
                    abilities: this.state.activePopupType === "learn" ?
                        this.props.learnableAbilities :
                        currentlyUpgradingAbility.possibleUpgrades,
                    handleClick: this.state.activePopupType === "learn" ?
                        this.learnAbility :
                        this.handleUpgradeAbilityTargetClick,
                }))));
        };
        UpgradeAbilitiesComponent.prototype.closePopup = function () {
            this.setState({
                activePopupType: null,
                currentlyUpgradingAbility: null,
            });
        };
        UpgradeAbilitiesComponent.prototype.toggleUpgradeAbilityPopup = function (sourceAbility) {
            if (this.state.activePopupType === "upgrade") {
                this.closePopup();
            }
            else {
                this.setState({
                    activePopupType: "upgrade",
                    currentlyUpgradingAbility: sourceAbility,
                });
            }
        };
        UpgradeAbilitiesComponent.prototype.toggleLearnNewAbilityPopup = function () {
            if (this.state.activePopupType === "learn") {
                this.closePopup();
            }
            else {
                this.setState({ activePopupType: "learn" });
            }
        };
        UpgradeAbilitiesComponent.prototype.handleUpgradeAbilityTargetClick = function (targetAbility) {
            this.upgradeAbility(this.state.currentlyUpgradingAbility, targetAbility);
            this.setState({
                activePopupType: null,
                currentlyUpgradingAbility: null,
            });
        };
        UpgradeAbilitiesComponent.prototype.upgradeAbility = function (source, newAbility) {
            this.props.unit.upgradeAbility(source, newAbility);
            this.props.unit.handleLevelUp();
            this.closePopup();
            this.props.onUpgrade();
        };
        UpgradeAbilitiesComponent.prototype.learnAbility = function (newAbility) {
            this.props.unit.learnAbility(newAbility);
            this.props.unit.handleLevelUp();
            this.closePopup();
            this.props.onUpgrade();
        };
        return UpgradeAbilitiesComponent;
    }(React.Component));
    exports.UpgradeAbilitiesComponent = UpgradeAbilitiesComponent;
    exports.UpgradeAbilities = React.createFactory(UpgradeAbilitiesComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unitlist/UpgradeAttributes", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize"], function (require, exports, React, ReactDOMElements, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UpgradeAttributesComponent = (function (_super) {
        __extends(UpgradeAttributesComponent, _super);
        function UpgradeAttributesComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UpgradeAttributes";
            _this.bindMethods();
            return _this;
        }
        UpgradeAttributesComponent.prototype.bindMethods = function () {
            this.upgradeAttribute = this.upgradeAttribute.bind(this);
        };
        UpgradeAttributesComponent.prototype.render = function () {
            var _this = this;
            var unit = this.props.unit;
            var rows = [];
            var attributes = unit.baseAttributes.getAttributesTypesSortedForDisplay();
            attributes.forEach(function (attribute) {
                var maxAttribute = attribute === "maxActionPoints" ? 6 : 9;
                if (unit.baseAttributes[attribute] < maxAttribute) {
                    rows.push(ReactDOMElements.li({
                        className: "upgrade-attributes-attribute",
                        onClick: _this.upgradeAttribute.bind(_this, attribute),
                        key: attribute,
                    }, localize_1.localize("upgradeAttribute")({
                        attribute: localize_1.localize(attribute)(),
                        currentLevel: unit.baseAttributes[attribute],
                        nextLevel: unit.baseAttributes[attribute] + 1,
                    })));
                }
            });
            return (ReactDOMElements.div({
                className: "upgrade-attributes",
            }, ReactDOMElements.div({
                className: "upgrade-attributes-header",
            }, localize_1.localize("upgradeStats")()), ReactDOMElements.ol({
                className: "upgrade-attributes-list",
            }, rows)));
        };
        UpgradeAttributesComponent.prototype.upgradeAttribute = function (attribute, e) {
            if (e.button) {
                return;
            }
            this.props.handleClick(attribute);
        };
        return UpgradeAttributesComponent;
    }(React.Component));
    exports.UpgradeAttributesComponent = UpgradeAttributesComponent;
    exports.UpgradeAttributes = React.createFactory(UpgradeAttributesComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/unitlist/UpgradeUnit", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/unitlist/UpgradeAbilities", "modules/defaultui/uicomponents/unitlist/UpgradeAttributes"], function (require, exports, React, ReactDOMElements, localize_1, UpgradeAbilities_1, UpgradeAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UpgradeUnitComponent = (function (_super) {
        __extends(UpgradeUnitComponent, _super);
        function UpgradeUnitComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "UpgradeUnit";
            _this.bindMethods();
            return _this;
        }
        UpgradeUnitComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "upgrade-unit",
            }, ReactDOMElements.div({
                className: "upgrade-unit-header",
            }, localize_1.localize("unitUpgradeHeader")({
                unitName: this.props.unit.name,
                currentLevel: this.props.unit.level,
                nextLevel: this.props.unit.level + 1,
            })), UpgradeAbilities_1.UpgradeAbilities({
                unit: this.props.unit,
                upgradableAbilitiesData: this.props.unit.getCurrentUpgradableAbilitiesData(),
                learnableAbilities: this.props.unit.getCurrentLearnableAbilities(),
                onUpgrade: this.props.onUnitUpgrade,
            }), UpgradeAttributes_1.UpgradeAttributes({
                unit: this.props.unit,
                handleClick: this.upgradeAttribute,
            })));
        };
        UpgradeUnitComponent.prototype.bindMethods = function () {
            this.upgradeAttribute = this.upgradeAttribute.bind(this);
        };
        UpgradeUnitComponent.prototype.upgradeAttribute = function (attribute) {
            var unit = this.props.unit;
            unit.baseAttributes[attribute] += 1;
            unit.attributesAreDirty = true;
            unit.handleLevelUp();
            this.props.onUnitUpgrade();
        };
        return UpgradeUnitComponent;
    }(React.Component));
    exports.UpgradeUnitComponent = UpgradeUnitComponent;
    exports.UpgradeUnit = React.createFactory(UpgradeUnitComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/vfxeditor/props/Color", ["require", "exports", "react", "modules/defaultui/uicomponents/setupgame/ColorSetter"], function (require, exports, React, ColorSetter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VfxFragmentPropColorComponent = (function (_super) {
        __extends(VfxFragmentPropColorComponent, _super);
        function VfxFragmentPropColorComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "VfxFragmentPropColor";
            _this.onColorChange = _this.onColorChange.bind(_this);
            return _this;
        }
        VfxFragmentPropColorComponent.prototype.onColorChange = function (color, isNull) {
            if (isNull) {
                return;
            }
            this.props.fragment.props[this.props.propName] = color;
            this.props.onValueChange();
        };
        VfxFragmentPropColorComponent.prototype.render = function () {
            return (ColorSetter_1.ColorSetter({
                color: this.props.color,
                onChange: this.onColorChange,
            }));
        };
        return VfxFragmentPropColorComponent;
    }(React.Component));
    exports.VfxFragmentPropColorComponent = VfxFragmentPropColorComponent;
    exports.VfxFragmentPropColor = React.createFactory(VfxFragmentPropColorComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/vfxeditor/props/InlineNumberProp", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/generic/NumberInput"], function (require, exports, React, ReactDOMElements, NumberInput_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InlineNumberPropComponent = (function (_super) {
        __extends(InlineNumberPropComponent, _super);
        function InlineNumberPropComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "InlineNumberProp";
            return _this;
        }
        InlineNumberPropComponent.prototype.render = function () {
            var baseId = "vfx-fragment-prop-inline-number-" + this.props.propName + "-" + this.props.label;
            return (ReactDOMElements.div({
                className: "vfx-fragment-prop-inline-number-wrapper",
            }, ReactDOMElements.label({
                className: "vfx-fragment-prop-inline-number-label",
                htmlFor: baseId,
            }, this.props.label + ":"), NumberInput_1.NumberInput({
                value: this.props.value,
                valueStringIsValid: function (valueString) { return isFinite(Number(valueString)); },
                getValueFromValueString: parseFloat,
                onChange: this.props.onValueChange,
            })));
        };
        return InlineNumberPropComponent;
    }(React.Component));
    exports.InlineNumberPropComponent = InlineNumberPropComponent;
    exports.InlineNumberProp = React.createFactory(InlineNumberPropComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/vfxeditor/props/Number", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/generic/NumberInput"], function (require, exports, React, ReactDOMElements, NumberInput_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VfxFragmentPropNumberComponent = (function (_super) {
        __extends(VfxFragmentPropNumberComponent, _super);
        function VfxFragmentPropNumberComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "VfxFragmentPropNumber";
            _this.handleChange = _this.handleChange.bind(_this);
            return _this;
        }
        VfxFragmentPropNumberComponent.prototype.handleChange = function (e) {
            var target = e.currentTarget;
            var value = parseFloat(target.value);
            var valueIsValid = isFinite(value);
            if (!valueIsValid) {
                return;
            }
            this.props.fragment.props[this.props.propName] = value;
            this.props.onValueChange();
        };
        VfxFragmentPropNumberComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "vfx-fragment-prop-number-input",
            }, NumberInput_1.NumberInput({
                value: this.props.value,
                valueStringIsValid: function (valueString) { return isFinite(Number(valueString)); },
                getValueFromValueString: parseFloat,
                onChange: function (newValue) {
                    _this.props.fragment.props[_this.props.propName] = newValue;
                    _this.props.onValueChange();
                },
            })));
        };
        return VfxFragmentPropNumberComponent;
    }(React.Component));
    exports.VfxFragmentPropNumberComponent = VfxFragmentPropNumberComponent;
    exports.VfxFragmentPropNumber = React.createFactory(VfxFragmentPropNumberComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/vfxeditor/props/Point", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/vfxeditor/props/VecBase"], function (require, exports, React, ReactDOMElements, VecBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VfxFragmentPropPointComponent = (function (_super) {
        __extends(VfxFragmentPropPointComponent, _super);
        function VfxFragmentPropPointComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "VfxFragmentPropPoint";
            return _this;
        }
        VfxFragmentPropPointComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "vfx-fragment-prop-point",
            }, VecBase_1.VfxFragmentPropVecBase({
                propName: this.props.propName,
                fragment: this.props.fragment,
                onValueChange: this.props.onValueChange,
                propProps: [
                    {
                        key: "x",
                        label: "X",
                        value: this.props.x,
                    },
                    {
                        key: "y",
                        label: "Y",
                        value: this.props.y,
                    },
                ],
            })));
        };
        return VfxFragmentPropPointComponent;
    }(React.Component));
    exports.VfxFragmentPropPointComponent = VfxFragmentPropPointComponent;
    exports.VfxFragmentPropPoint = React.createFactory(VfxFragmentPropPointComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/vfxeditor/props/RampingValue", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/vfxeditor/props/VecBase"], function (require, exports, React, ReactDOMElements, VecBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VfxFragmentPropRampingValueComponent = (function (_super) {
        __extends(VfxFragmentPropRampingValueComponent, _super);
        function VfxFragmentPropRampingValueComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "VfxFragmentPropRampingValue";
            return _this;
        }
        VfxFragmentPropRampingValueComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "vfx-fragment-prop-ramping-value",
            }, VecBase_1.VfxFragmentPropVecBase({
                propName: this.props.propName,
                fragment: this.props.fragment,
                onValueChange: this.props.onValueChange,
                propProps: [
                    {
                        key: "base",
                        label: "base",
                        value: this.props.base,
                    },
                    {
                        key: "up",
                        label: "up",
                        value: this.props.up,
                    },
                    {
                        key: "down",
                        label: "down",
                        value: this.props.down,
                    },
                ],
            })));
        };
        return VfxFragmentPropRampingValueComponent;
    }(React.Component));
    exports.VfxFragmentPropRampingValueComponent = VfxFragmentPropRampingValueComponent;
    exports.VfxFragmentPropRampingValue = React.createFactory(VfxFragmentPropRampingValueComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/vfxeditor/props/Range", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/vfxeditor/props/VecBase"], function (require, exports, React, ReactDOMElements, VecBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VfxFragmentPropRangeComponent = (function (_super) {
        __extends(VfxFragmentPropRangeComponent, _super);
        function VfxFragmentPropRangeComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "VfxFragmentPropRange";
            return _this;
        }
        VfxFragmentPropRangeComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "vfx-fragment-prop-range",
            }, VecBase_1.VfxFragmentPropVecBase({
                propName: this.props.propName,
                fragment: this.props.fragment,
                onValueChange: this.props.onValueChange,
                propProps: [
                    {
                        key: "min",
                        label: "Min",
                        value: this.props.min,
                    },
                    {
                        key: "max",
                        label: "Max",
                        value: this.props.max,
                    },
                ],
            })));
        };
        return VfxFragmentPropRangeComponent;
    }(React.Component));
    exports.VfxFragmentPropRangeComponent = VfxFragmentPropRangeComponent;
    exports.VfxFragmentPropRange = React.createFactory(VfxFragmentPropRangeComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/vfxeditor/props/VecBase", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/vfxeditor/props/InlineNumberProp"], function (require, exports, React, ReactDOMElements, InlineNumberProp_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VfxFragmentPropVecBaseComponent = (function (_super) {
        __extends(VfxFragmentPropVecBaseComponent, _super);
        function VfxFragmentPropVecBaseComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "VfxFragmentPropVecBase";
            return _this;
        }
        VfxFragmentPropVecBaseComponent.prototype.handleValueChange = function (prop, newValue) {
            var valueIsValid = isFinite(newValue);
            if (!valueIsValid) {
                return;
            }
            this.props.fragment.props[this.props.propName][prop.key] = newValue;
            this.props.onValueChange();
        };
        VfxFragmentPropVecBaseComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "vfx-fragment-prop-vec-wrapper",
            }, this.props.propProps.map(function (prop) {
                return InlineNumberProp_1.InlineNumberProp({
                    key: prop.key,
                    propName: _this.props.propName,
                    label: prop.label,
                    value: prop.value,
                    onValueChange: _this.handleValueChange.bind(_this, prop),
                });
            })));
        };
        return VfxFragmentPropVecBaseComponent;
    }(React.Component));
    exports.VfxFragmentPropVecBaseComponent = VfxFragmentPropVecBaseComponent;
    exports.VfxFragmentPropVecBase = React.createFactory(VfxFragmentPropVecBaseComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/vfxeditor/props/VfxFragmentProp", ["require", "exports", "react", "react-dom-factories", "modules/space/battlevfx/drawingfunctions/vfxfragments/props/PropInfoType", "modules/defaultui/uicomponents/vfxeditor/props/Color", "modules/defaultui/uicomponents/vfxeditor/props/Number", "modules/defaultui/uicomponents/vfxeditor/props/Point", "modules/defaultui/uicomponents/vfxeditor/props/RampingValue", "modules/defaultui/uicomponents/vfxeditor/props/Range"], function (require, exports, React, ReactDOMElements, PropInfoType_1, Color_1, Number_1, Point_1, RampingValue_1, Range_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VfxFragmentPropComponent = (function (_super) {
        __extends(VfxFragmentPropComponent, _super);
        function VfxFragmentPropComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "VfxFragmentProp";
            _this.state =
                {
                    isCollapsed: false,
                };
            _this.toggleCollapsed = _this.toggleCollapsed.bind(_this);
            return _this;
        }
        VfxFragmentPropComponent.prototype.toggleCollapsed = function () {
            this.setState({
                isCollapsed: !this.state.isCollapsed,
            });
        };
        VfxFragmentPropComponent.prototype.render = function () {
            var propValuesElement;
            switch (this.props.propType) {
                case PropInfoType_1.PropInfoType.Number:
                    {
                        var propValue = this.props.fragment.props[this.props.propName];
                        propValuesElement = Number_1.VfxFragmentPropNumber({
                            value: propValue,
                            propName: this.props.propName,
                            fragment: this.props.fragment,
                            onValueChange: this.props.onPropValueChange,
                        });
                        break;
                    }
                case PropInfoType_1.PropInfoType.Point:
                    {
                        var propValue = this.props.fragment.props[this.props.propName];
                        propValuesElement = Point_1.VfxFragmentPropPoint({
                            x: propValue.x,
                            y: propValue.y,
                            propName: this.props.propName,
                            fragment: this.props.fragment,
                            onValueChange: this.props.onPropValueChange,
                        });
                        break;
                    }
                case PropInfoType_1.PropInfoType.Color:
                    {
                        var propValue = this.props.fragment.props[this.props.propName];
                        propValuesElement = Color_1.VfxFragmentPropColor({
                            color: propValue,
                            propName: this.props.propName,
                            fragment: this.props.fragment,
                            onValueChange: this.props.onPropValueChange,
                        });
                        break;
                    }
                case PropInfoType_1.PropInfoType.Range:
                    {
                        var propValue = this.props.fragment.props[this.props.propName];
                        propValuesElement = Range_1.VfxFragmentPropRange({
                            min: propValue.min,
                            max: propValue.max,
                            propName: this.props.propName,
                            fragment: this.props.fragment,
                            onValueChange: this.props.onPropValueChange,
                        });
                        break;
                    }
                case PropInfoType_1.PropInfoType.RampingValue:
                    {
                        var propValue = this.props.fragment.props[this.props.propName];
                        propValuesElement = RampingValue_1.VfxFragmentPropRampingValue({
                            base: propValue.base,
                            up: propValue.up,
                            down: propValue.down,
                            propName: this.props.propName,
                            fragment: this.props.fragment,
                            onValueChange: this.props.onPropValueChange,
                        });
                        break;
                    }
            }
            return (ReactDOMElements.div({
                className: "vfx-fragment-prop vfx-fragment-prop-" + this.props.propType,
            }, ReactDOMElements.div({
                className: "vfx-fragment-prop-name-container" + (this.state.isCollapsed ? " collapsed" : " collapsible"),
                onClick: this.toggleCollapsed,
            }, ReactDOMElements.div({
                className: "vfx-fragment-prop-name",
            }, this.props.propName)), this.state.isCollapsed ? null : ReactDOMElements.div({
                className: "vfx-fragment-prop-value",
            }, propValuesElement)));
        };
        return VfxFragmentPropComponent;
    }(React.Component));
    exports.VfxFragmentPropComponent = VfxFragmentPropComponent;
    exports.VfxFragmentProp = React.createFactory(VfxFragmentPropComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/vfxeditor/VfxEditor", ["require", "exports", "react", "react-dom-factories", "modules/space/battlevfx/drawingfunctions/vfxfragments/Beam", "modules/space/battlevfx/drawingfunctions/vfxfragments/FocusingBeam", "modules/space/battlevfx/drawingfunctions/vfxfragments/LightBurst", "modules/space/battlevfx/drawingfunctions/vfxfragments/ShockWave", "src/utility", "modules/defaultui/uicomponents/vfxeditor/VfxEditorDisplay", "modules/defaultui/uicomponents/vfxeditor/VfxEditorSelection"], function (require, exports, React, ReactDOMElements, Beam_1, FocusingBeam_1, LightBurst_1, ShockWave_1, utility_1, VfxEditorDisplay_1, VfxEditorSelection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var availableFragmentConstructors = [
        {
            key: "shockWave",
            displayName: "ShockWave",
            constructorFN: ShockWave_1.ShockWave,
        },
        {
            key: "lightBurst",
            displayName: "LightBurst",
            constructorFN: LightBurst_1.LightBurst,
        },
        {
            key: "beam",
            displayName: "Beam",
            constructorFN: Beam_1.Beam,
        },
        {
            key: "foucsingBeam",
            displayName: "FocusingBeam",
            constructorFN: FocusingBeam_1.FocusingBeam,
        },
    ];
    function AlphabeticallyByProp(a2, b2, props) {
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            var a = a2[prop].toLowerCase();
            var b = b2[prop].toLowerCase();
            if (a < b) {
                return -1;
            }
            else if (a > b) {
                return 1;
            }
        }
        return 0;
    }
    availableFragmentConstructors.sort(function (a, b) {
        return AlphabeticallyByProp(a, b, ["displayName", "key"]);
    });
    var VfxEditorComponent = (function (_super) {
        __extends(VfxEditorComponent, _super);
        function VfxEditorComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "vfxEditor";
            _this.state =
                {
                    isPlaying: false,
                    currentTime: 0,
                    vfxDuration: 1000,
                    selectedFragment: null,
                    draggingFragment: null,
                };
            _this.handleChangeTime = _this.handleChangeTime.bind(_this);
            _this.handleChangeVfxDuration = _this.handleChangeVfxDuration.bind(_this);
            _this.togglePlay = _this.togglePlay.bind(_this);
            _this.handleFragmentConstructorDragStart = _this.handleFragmentConstructorDragStart.bind(_this);
            _this.handleFragmentConstructorDragEnd = _this.handleFragmentConstructorDragEnd.bind(_this);
            _this.handleFragmentDragMove = _this.handleFragmentDragMove.bind(_this);
            _this.selectFragment = _this.selectFragment.bind(_this);
            _this.handleSelectedFragmentPropValueChange = _this.handleSelectedFragmentPropValueChange.bind(_this);
            _this.advanceTime = _this.advanceTime.bind(_this);
            return _this;
        }
        VfxEditorComponent.prototype.handleChangeTime = function (e) {
            var target = e.currentTarget;
            var newTime = utility_1.clamp(parseFloat(target.value), 0, 1);
            if (this.state.isPlaying) {
                this.togglePlay();
            }
            this.updateTime(newTime);
        };
        VfxEditorComponent.prototype.handleChangeVfxDuration = function (e) {
            var target = e.currentTarget;
            var vfxDuration = Math.max(parseInt(target.value), 0);
            this.setState({
                vfxDuration: vfxDuration,
            });
        };
        VfxEditorComponent.prototype.togglePlay = function () {
            if (this.state.isPlaying) {
                this.stopAnimating();
            }
            else {
                this.startAnimating();
            }
        };
        VfxEditorComponent.prototype.startAnimating = function () {
            var _this = this;
            this.setState({
                isPlaying: true,
            }, function () {
                _this.lastAnimationTickTime = window.performance.now();
                _this.animationHandle = window.requestAnimationFrame(_this.advanceTime);
            });
        };
        VfxEditorComponent.prototype.stopAnimating = function () {
            var _this = this;
            this.setState({
                isPlaying: false,
            }, function () {
                if (isFinite(_this.animationHandle)) {
                    window.cancelAnimationFrame(_this.animationHandle);
                    _this.animationHandle = undefined;
                    _this.lastAnimationTickTime = undefined;
                }
            });
        };
        VfxEditorComponent.prototype.advanceTime = function (timeStamp) {
            var elapsedTime = timeStamp - this.lastAnimationTickTime;
            this.lastAnimationTickTime = timeStamp;
            var elapsedRelativeTime = elapsedTime / this.state.vfxDuration;
            var newRelativeTime = (this.state.currentTime + elapsedRelativeTime) % 1;
            this.updateTime(newRelativeTime);
            this.animationHandle = window.requestAnimationFrame(this.advanceTime);
        };
        VfxEditorComponent.prototype.updateTime = function (relativeTime) {
            this.display.animateFragments(relativeTime);
            this.display.updateRenderer();
            this.setState({
                currentTime: relativeTime,
            });
        };
        VfxEditorComponent.prototype.handleFragmentConstructorDragStart = function (fragmentConstructor) {
            var fragment = new fragmentConstructor.constructorFN();
            fragment.draw();
            fragment.animate(this.state.currentTime);
            this.display.addFragment(fragment);
            this.setState({
                selectedFragment: fragment,
                draggingFragment: fragment,
            });
        };
        VfxEditorComponent.prototype.handleFragmentConstructorDragEnd = function () {
            this.setState({
                draggingFragment: undefined,
            });
        };
        VfxEditorComponent.prototype.handleFragmentDragMove = function (e) {
            this.state.draggingFragment.setCenter(e.clientX, e.clientY);
            this.display.updateRenderer();
        };
        VfxEditorComponent.prototype.selectFragment = function (fragment) {
            this.setState({
                selectedFragment: fragment,
            });
        };
        VfxEditorComponent.prototype.updateFragment = function (fragment) {
            fragment.draw();
            fragment.animate(this.state.currentTime);
            this.display.updateRenderer();
        };
        VfxEditorComponent.prototype.handleSelectedFragmentPropValueChange = function () {
            this.updateFragment(this.state.selectedFragment);
            this.forceUpdate();
        };
        VfxEditorComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "vfx-editor",
            }, ReactDOMElements.div({
                className: "vfx-editor-main",
            }, VfxEditorDisplay_1.VfxEditorDisplay({
                hasDraggingFragment: Boolean(this.state.draggingFragment),
                moveDraggingFragment: this.handleFragmentDragMove,
                ref: function (component) {
                    _this.display = component;
                },
            }), ReactDOMElements.input({
                className: "vfx-editor-time-control",
                type: "range",
                min: 0,
                max: 1,
                step: 0.002,
                value: "" + this.state.currentTime,
                onChange: this.handleChangeTime,
                title: "Current time",
            }), ReactDOMElements.div({
                className: "vfx-editor-play-wrapper",
            }, ReactDOMElements.button({
                className: "vfx-editor-play-button",
                onClick: this.togglePlay,
            }, this.state.isPlaying ?
                "Pause" :
                "Play"), ReactDOMElements.label({
                className: "vfx-editor-duration-label",
                htmlFor: "vfx-editor-duration",
            }, "Vfx Duration (ms)"), ReactDOMElements.input({
                className: "vfx-editor-duration",
                id: "vfx-editor-duration",
                type: "number",
                min: 0,
                step: 100,
                value: "" + this.state.vfxDuration,
                onChange: this.handleChangeVfxDuration,
            }))), VfxEditorSelection_1.VfxEditorSelection({
                availableFragmentConstructors: availableFragmentConstructors,
                selectedFragment: this.state.selectedFragment,
                onSelectedFragmentPropValueChange: this.handleSelectedFragmentPropValueChange,
                selectFragment: this.selectFragment,
                onFragmentListDragStart: this.handleFragmentConstructorDragStart,
                onFragmentListDragEnd: this.handleFragmentConstructorDragEnd,
            })));
        };
        return VfxEditorComponent;
    }(React.Component));
    exports.VfxEditorComponent = VfxEditorComponent;
    exports.VfxEditor = React.createFactory(VfxEditorComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/vfxeditor/VfxEditorDisplay", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VfxEditorDisplayComponent = (function (_super) {
        __extends(VfxEditorDisplayComponent, _super);
        function VfxEditorDisplayComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "VfxEditorDisplay";
            _this.fragments = [];
            _this.renderer = new PIXI.Renderer({
                width: 0,
                height: 0,
                autoDensity: false,
            });
            _this.stage = new PIXI.Container();
            _this.fragmentContainer = new PIXI.Container();
            _this.stage.addChild(_this.fragmentContainer);
            _this.updateRenderer = _this.updateRenderer.bind(_this);
            _this.handleResize = _this.handleResize.bind(_this);
            return _this;
        }
        VfxEditorDisplayComponent.prototype.componentDidMount = function () {
            this.bindRendererView();
            this.updateRenderer();
            window.addEventListener("resize", this.handleResize, false);
        };
        VfxEditorDisplayComponent.prototype.componentWillUnmount = function () {
            window.removeEventListener("resize", this.handleResize);
        };
        VfxEditorDisplayComponent.prototype.handleResize = function () {
            var containerBounds = this.containerDiv.getBoundingClientRect();
            this.renderer.resize(containerBounds.width, containerBounds.height);
        };
        VfxEditorDisplayComponent.prototype.bindRendererView = function () {
            this.containerDiv.appendChild(this.renderer.view);
            this.handleResize();
        };
        VfxEditorDisplayComponent.prototype.addFragment = function (fragment) {
            this.fragmentContainer.addChild(fragment.displayObject);
            this.fragments.push(fragment);
            this.updateRenderer();
        };
        VfxEditorDisplayComponent.prototype.removeFragment = function (fragment) {
            this.fragmentContainer.removeChild(fragment.displayObject);
            this.fragments.splice(this.fragments.indexOf(fragment), 1);
            this.updateRenderer();
        };
        VfxEditorDisplayComponent.prototype.animateFragments = function (relativeTime) {
            this.fragments.forEach(function (fragment) {
                fragment.animate(relativeTime);
            });
        };
        VfxEditorDisplayComponent.prototype.updateRenderer = function () {
            this.renderer.render(this.stage);
        };
        VfxEditorDisplayComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.div({
                className: "vfx-editor-display",
                ref: function (element) {
                    _this.containerDiv = element;
                },
                onMouseMove: !this.props.hasDraggingFragment ? undefined :
                    this.props.moveDraggingFragment,
            }));
        };
        return VfxEditorDisplayComponent;
    }(React.Component));
    exports.VfxEditorDisplayComponent = VfxEditorDisplayComponent;
    exports.VfxEditorDisplay = React.createFactory(VfxEditorDisplayComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/vfxeditor/VfxEditorSelection", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/vfxeditor/VfxEditorSelectionTab", "modules/defaultui/uicomponents/vfxeditor/VfxFragmentEditor", "modules/defaultui/uicomponents/vfxeditor/VfxFragmentList"], function (require, exports, React, ReactDOMElements, VfxEditorSelectionTab_1, VfxFragmentEditor_1, VfxFragmentList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VfxEditorSelectionComponent = (function (_super) {
        __extends(VfxEditorSelectionComponent, _super);
        function VfxEditorSelectionComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "VfxEditorSelection";
            _this.state =
                {
                    activeTab: "fragmentConstructors",
                };
            _this.setActiveTab = _this.setActiveTab.bind(_this);
            return _this;
        }
        VfxEditorSelectionComponent.prototype.setActiveTab = function (tabType) {
            this.setState({
                activeTab: tabType,
            });
        };
        VfxEditorSelectionComponent.prototype.render = function () {
            var _this = this;
            var activeSelectionElements = [];
            switch (this.state.activeTab) {
                case "placedFragments":
                    if (this.props.selectedFragment) {
                        activeSelectionElements.push(VfxFragmentEditor_1.VfxFragmentEditor({
                            key: "fragmentEditor",
                            fragment: this.props.selectedFragment,
                            onActiveFragmentPropValueChange: this.props.onSelectedFragmentPropValueChange,
                        }));
                    }
                    break;
                case "fragmentConstructors":
                    activeSelectionElements.push(VfxFragmentList_1.VfxFragmentList({
                        key: "fragmentConstructors",
                        fragments: this.props.availableFragmentConstructors,
                        isDraggable: true,
                        onDragStart: this.props.onFragmentListDragStart,
                        onDragEnd: this.props.onFragmentListDragEnd,
                    }));
                    break;
            }
            var tabTypes = ["fragmentConstructors", "placedFragments"];
            return (ReactDOMElements.div({
                className: "vfx-editor-selection",
            }, ReactDOMElements.div({
                className: "vfx-editor-selection-tabs-container",
            }, tabTypes.map(function (tabType) {
                return VfxEditorSelectionTab_1.VfxEditorSelectionTab({
                    key: tabType,
                    type: tabType,
                    setTab: _this.setActiveTab,
                    isActive: tabType === _this.state.activeTab,
                });
            })), ReactDOMElements.div({
                className: "vfx-editor-selection-active-selector-container",
            }, activeSelectionElements)));
        };
        return VfxEditorSelectionComponent;
    }(React.Component));
    exports.VfxEditorSelectionComponent = VfxEditorSelectionComponent;
    exports.VfxEditorSelection = React.createFactory(VfxEditorSelectionComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/vfxeditor/VfxEditorSelectionTab", ["require", "exports", "react", "react-dom-factories"], function (require, exports, React, ReactDOMElements) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var displayString = {
        fragmentConstructors: "Fragments",
        placedFragments: "Placed",
    };
    var VfxEditorSelectionTabComponent = (function (_super) {
        __extends(VfxEditorSelectionTabComponent, _super);
        function VfxEditorSelectionTabComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "VfxEditorSelectionTab";
            _this.handleClick = _this.handleClick.bind(_this);
            return _this;
        }
        VfxEditorSelectionTabComponent.prototype.handleClick = function () {
            this.props.setTab(this.props.type);
        };
        VfxEditorSelectionTabComponent.prototype.render = function () {
            return (ReactDOMElements.button({
                className: "vfx-editor-selection-tab" +
                    " vfx-editor-selection-tab-" + this.props.type,
                disabled: this.props.isActive,
                onClick: this.handleClick,
            }, displayString[this.props.type]));
        };
        return VfxEditorSelectionTabComponent;
    }(React.Component));
    exports.VfxEditorSelectionTabComponent = VfxEditorSelectionTabComponent;
    exports.VfxEditorSelectionTab = React.createFactory(VfxEditorSelectionTabComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/vfxeditor/VfxFragmentEditor", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/vfxeditor/VfxFragmentPropsList"], function (require, exports, React, ReactDOMElements, VfxFragmentPropsList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VfxFragmentEditorComponent = (function (_super) {
        __extends(VfxFragmentEditorComponent, _super);
        function VfxFragmentEditorComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "VfxFragmentEditor";
            _this.handleReset = _this.handleReset.bind(_this);
            return _this;
        }
        VfxFragmentEditorComponent.prototype.handleReset = function () {
            this.props.fragment.setDefaultProps();
            this.props.onActiveFragmentPropValueChange();
        };
        VfxFragmentEditorComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "vfx-fragment-editor",
            }, ReactDOMElements.button({
                className: "vfx-fragment-reset-props-button",
                onClick: this.handleReset,
            }, "Reset"), VfxFragmentPropsList_1.VfxFragmentPropsList({
                fragment: this.props.fragment,
                onPropValueChange: this.props.onActiveFragmentPropValueChange,
            })));
        };
        return VfxFragmentEditorComponent;
    }(React.Component));
    exports.VfxFragmentEditorComponent = VfxFragmentEditorComponent;
    exports.VfxFragmentEditor = React.createFactory(VfxFragmentEditorComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/vfxeditor/VfxFragmentList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/vfxeditor/VfxFragmentListItem"], function (require, exports, React, ReactDOMElements, VfxFragmentListItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VfxFragmentListComponent = (function (_super) {
        __extends(VfxFragmentListComponent, _super);
        function VfxFragmentListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "VfxFragmentList";
            return _this;
        }
        VfxFragmentListComponent.prototype.render = function () {
            var _this = this;
            return (ReactDOMElements.ol({
                className: "vfx-fragment-list",
            }, this.props.fragments.map(function (fragment) {
                return VfxFragmentListItem_1.VfxFragmentListItem({
                    key: fragment.key,
                    fragment: fragment,
                    isDraggable: _this.props.isDraggable,
                    onDragStart: _this.props.onDragStart,
                    onDragEnd: _this.props.onDragEnd,
                    onClick: _this.props.onClick,
                });
            })));
        };
        return VfxFragmentListComponent;
    }(React.Component));
    exports.VfxFragmentListComponent = VfxFragmentListComponent;
    exports.VfxFragmentList = React.createFactory(VfxFragmentListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/vfxeditor/VfxFragmentListItem", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/mixins/DragPositioner", "modules/defaultui/uicomponents/mixins/applyMixins"], function (require, exports, React, ReactDOMElements, DragPositioner_1, applyMixins_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VfxFragmentListItemComponent = (function (_super) {
        __extends(VfxFragmentListItemComponent, _super);
        function VfxFragmentListItemComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "VfxFragmentListItem";
            _this.ownDOMNode = React.createRef();
            _this.onDragStart = _this.onDragStart.bind(_this);
            _this.onDragEnd = _this.onDragEnd.bind(_this);
            _this.handleClick = _this.handleClick.bind(_this);
            if (_this.props.isDraggable) {
                _this.dragPositioner = new DragPositioner_1.DragPositioner(_this, _this.ownDOMNode, {});
                _this.dragPositioner.onDragStart = _this.onDragStart;
                _this.dragPositioner.onDragEnd = _this.onDragEnd;
                applyMixins_1.applyMixins(_this, _this.dragPositioner);
            }
            return _this;
        }
        VfxFragmentListItemComponent.prototype.onDragStart = function () {
            this.props.onDragStart(this.props.fragment);
        };
        VfxFragmentListItemComponent.prototype.onDragEnd = function () {
            this.props.onDragEnd();
        };
        VfxFragmentListItemComponent.prototype.handleClick = function () {
            this.props.onClick(this.props.fragment);
        };
        VfxFragmentListItemComponent.prototype.render = function () {
            var listItemProps = {
                className: "vfx-fragment-list-item",
                ref: this.ownDOMNode,
            };
            if (this.props.isDraggable) {
                listItemProps.className += " draggable";
                listItemProps.onTouchStart = listItemProps.onMouseDown =
                    this.dragPositioner.handleReactDownEvent;
            }
            if (this.props.onClick) {
                listItemProps.className += " clickable";
                listItemProps.onClick = this.handleClick;
            }
            return (ReactDOMElements.li(listItemProps, this.props.fragment.displayName));
        };
        return VfxFragmentListItemComponent;
    }(React.Component));
    exports.VfxFragmentListItemComponent = VfxFragmentListItemComponent;
    exports.VfxFragmentListItem = React.createFactory(VfxFragmentListItemComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/vfxeditor/VfxFragmentPropsList", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/vfxeditor/props/VfxFragmentProp"], function (require, exports, React, ReactDOMElements, VfxFragmentProp_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VfxFragmentPropsListComponent = (function (_super) {
        __extends(VfxFragmentPropsListComponent, _super);
        function VfxFragmentPropsListComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "VfxFragmentPropsList";
            return _this;
        }
        VfxFragmentPropsListComponent.prototype.render = function () {
            var _this = this;
            var fragment = this.props.fragment;
            return (ReactDOMElements.ul({
                className: "vfx-fragment-props-list",
            }, Object.keys(fragment.props).sort().map(function (propName) {
                var propType = fragment.propInfo[propName].type;
                return VfxFragmentProp_1.VfxFragmentProp({
                    key: propName,
                    propName: propName,
                    propType: propType,
                    fragment: fragment,
                    onPropValueChange: _this.props.onPropValueChange,
                });
            })));
        };
        return VfxFragmentPropsListComponent;
    }(React.Component));
    exports.VfxFragmentPropsListComponent = VfxFragmentPropsListComponent;
    exports.VfxFragmentPropsList = React.createFactory(VfxFragmentPropsListComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("modules/defaultui/uicomponents/windows/DefaultWindow", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/windows/WindowContainer"], function (require, exports, React, ReactDOMElements, WindowContainer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var cssPropertyPrefix = "--rance-window-";
    var prefixedCssPropertyMap = {
        minWidth: cssPropertyPrefix + "min-width",
        minHeight: cssPropertyPrefix + "min-height",
        maxWidth: cssPropertyPrefix + "max-width",
        maxHeight: cssPropertyPrefix + "max-height",
    };
    var DefaultWindowComponent = (function (_super) {
        __extends(DefaultWindowComponent, _super);
        function DefaultWindowComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "DefaultWindow";
            _this.windowContainerComponent = React.createRef();
            _this.contentContainerElement = React.createRef();
            _this.titleBarElement = React.createRef();
            _this.handleTitleBarMouseDown = _this.handleTitleBarMouseDown.bind(_this);
            _this.getContentSizeBounds = _this.getContentSizeBounds.bind(_this);
            _this.state =
                {
                    sizeBounds: {
                        minWidth: 100,
                        minHeight: 100,
                        maxWidth: Infinity,
                        maxHeight: Infinity,
                    },
                };
            return _this;
        }
        DefaultWindowComponent.prototype.componentDidMount = function () {
            this.setState({
                sizeBounds: __assign({}, this.state.sizeBounds, this.getContentSizeBounds()),
            });
        };
        DefaultWindowComponent.prototype.render = function () {
            return (WindowContainer_1.WindowContainer({
                containingAreaElement: document.body,
                getInitialPosition: this.props.getInitialPosition,
                isResizable: this.props.isResizable === false ? false : true,
                attributes: this.props.attributes,
                minWidth: this.state.sizeBounds.minWidth,
                minHeight: this.state.sizeBounds.minHeight,
                maxWidth: this.state.sizeBounds.maxWidth,
                maxHeight: this.state.sizeBounds.maxHeight,
                ref: this.windowContainerComponent,
            }, ReactDOMElements.div({
                className: "window",
            }, ReactDOMElements.div({
                className: "window-title-bar draggable",
                onMouseDown: this.handleTitleBarMouseDown,
                onTouchStart: this.handleTitleBarMouseDown,
                ref: this.titleBarElement,
            }, ReactDOMElements.div({
                className: "window-title",
            }, this.props.title), ReactDOMElements.button({
                className: "window-close-button",
                onClick: this.props.handleClose,
            })), ReactDOMElements.div({
                className: "window-content",
                ref: this.contentContainerElement,
            }, this.props.children))));
        };
        DefaultWindowComponent.prototype.handleTitleBarMouseDown = function (e) {
            this.windowContainerComponent.current.onMouseDown(e);
        };
        DefaultWindowComponent.prototype.getContentSizeBounds = function () {
            var bounds = {};
            var contentElements = this.contentContainerElement.current.children;
            for (var i = 0; i < contentElements.length; i++) {
                var contentElement = contentElements[i];
                var contentElementStyle = window.getComputedStyle(contentElement);
                var titleBarHeight = this.titleBarElement.current.getBoundingClientRect().height;
                for (var prop in this.state.sizeBounds) {
                    var prefixedPropName = prefixedCssPropertyMap[prop];
                    var valueString = contentElementStyle.getPropertyValue(prefixedPropName);
                    if (valueString !== "") {
                        var propValue = parseInt(valueString);
                        if (prop === "minHeight" || prop === "maxHeight") {
                            propValue += titleBarHeight;
                        }
                        if (!isFinite(bounds[prop])) {
                            bounds[prop] = propValue;
                        }
                        else if (prop.substring(0, 3) === "min") {
                            bounds[prop] = Math.max(bounds[prop], propValue);
                        }
                        else {
                            bounds[prop] = Math.min(bounds[prop], propValue);
                        }
                    }
                }
            }
            return bounds;
        };
        return DefaultWindowComponent;
    }(React.Component));
    exports.DefaultWindowComponent = DefaultWindowComponent;
    exports.DefaultWindow = React.createFactory(DefaultWindowComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/windows/DialogBox", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/localization/localize", "modules/defaultui/uicomponents/windows/DefaultWindow"], function (require, exports, React, ReactDOMElements, localize_1, DefaultWindow_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DialogBoxComponent = (function (_super) {
        __extends(DialogBoxComponent, _super);
        function DialogBoxComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "DialogBox";
            _this.okButtonElement = React.createRef();
            return _this;
        }
        DialogBoxComponent.prototype.componentDidMount = function () {
            this.okButtonElement.current.focus();
        };
        DialogBoxComponent.prototype.render = function () {
            return (DefaultWindow_1.DefaultWindow({
                title: this.props.title,
                handleClose: this.props.handleCancel,
                isResizable: false,
            }, ReactDOMElements.div({
                className: "dialog-box",
            }, ReactDOMElements.div({
                className: "dialog-box-content",
            }, this.props.children), ReactDOMElements.div({
                className: "dialog-box-buttons",
            }, ReactDOMElements.button({
                className: "dialog-box-button ok-button",
                onClick: this.props.handleOk,
                ref: this.okButtonElement,
            }, this.props.okText || localize_1.localize("ok")()), this.props.extraButtons, ReactDOMElements.button({
                className: "dialog-box-button cancel-button",
                onClick: this.props.handleCancel,
            }, this.props.cancelText || localize_1.localize("cancel")())))));
        };
        return DialogBoxComponent;
    }(React.Component));
    exports.DialogBoxComponent = DialogBoxComponent;
    exports.DialogBox = React.createFactory(DialogBoxComponent);
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/windows/WindowContainer", ["require", "exports", "react", "react-dom-factories", "react-dom", "src/utility", "modules/defaultui/uicomponents/mixins/DragPositioner", "modules/defaultui/uicomponents/mixins/applyMixins", "modules/defaultui/uicomponents/windows/WindowResizeHandle", "modules/defaultui/uicomponents/windows/windowManager"], function (require, exports, React, ReactDOMElements, ReactDOM, utility_1, DragPositioner_1, applyMixins_1, WindowResizeHandle_1, windowManager) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var id = 0;
    var WindowContainerComponent = (function (_super) {
        __extends(WindowContainerComponent, _super);
        function WindowContainerComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "WindowContainer";
            _this.resizeStartPosition = {
                top: undefined,
                left: undefined,
                width: undefined,
                height: undefined,
            };
            _this.ownDOMNode = React.createRef();
            _this.id = id++;
            _this.bindMethods();
            _this.parentContainer = document.getElementById("windows-container");
            _this.state =
                {
                    zIndex: windowManager.getNewZIndex(_this),
                };
            _this.dragPositioner = new DragPositioner_1.DragPositioner(_this, _this.ownDOMNode, {
                preventAutoResize: true,
                startOnHandleElementOnly: true,
            });
            applyMixins_1.applyMixins(_this, _this.dragPositioner);
            return _this;
        }
        WindowContainerComponent.prototype.componentDidMount = function () {
            this.setInitialPosition();
            windowManager.handleMount(this);
            window.addEventListener("resize", this.onDocumentWindowResize, false);
        };
        WindowContainerComponent.prototype.componentWillUnmount = function () {
            windowManager.handleUnount(this);
            window.removeEventListener("resize", this.onDocumentWindowResize);
            if (this.onDocumentWindowResizeTimeoutHandle !== undefined) {
                window.cancelAnimationFrame(this.onDocumentWindowResizeTimeoutHandle);
            }
        };
        WindowContainerComponent.prototype.componentDidUpdate = function (prevProps) {
            var propsToCheck = ["minWidth", "minHeight", "maxWidth", "maxHeight"];
            for (var _i = 0, propsToCheck_1 = propsToCheck; _i < propsToCheck_1.length; _i++) {
                var prop = propsToCheck_1[_i];
                if (prevProps[prop] !== this.props[prop]) {
                    this.setDimensionBounds(this.props);
                    break;
                }
            }
        };
        WindowContainerComponent.prototype.render = function () {
            var defaultAttributes = {
                className: "window-container hide-when-user-interacts-with-map",
                ref: this.ownDOMNode,
                style: {
                    top: this.dragPositioner.position.top,
                    left: this.dragPositioner.position.left,
                    width: this.dragPositioner.position.width,
                    height: this.dragPositioner.position.height,
                    zIndex: this.state.zIndex,
                },
            };
            var customAttributes = this.props.attributes || {};
            var attributes = utility_1.mergeReactAttributes(defaultAttributes, customAttributes);
            return (ReactDOM.createPortal(ReactDOMElements.div(attributes, this.props.children, !this.props.isResizable ? null : this.makeResizeHandles()), this.parentContainer));
        };
        WindowContainerComponent.prototype.getPosition = function () {
            return ({
                left: this.dragPositioner.position.left,
                top: this.dragPositioner.position.top,
                width: this.dragPositioner.position.width,
                height: this.dragPositioner.position.height,
            });
        };
        WindowContainerComponent.prototype.onMouseDown = function (e) {
            this.dragPositioner.handleReactDownEvent(e);
            this.bringToTop();
        };
        WindowContainerComponent.prototype.isTopMostWindow = function () {
            return windowManager.getWindowsByZIndex()[0] === this;
        };
        WindowContainerComponent.prototype.bringToTop = function () {
            this.setState({
                zIndex: windowManager.getNewZIndex(this),
            });
        };
        WindowContainerComponent.prototype.bindMethods = function () {
            this.onMouseDown = this.onMouseDown.bind(this);
            this.handleResizeMove = this.handleResizeMove.bind(this);
            this.handleResizeStart = this.handleResizeStart.bind(this);
            this.setInitialPosition = this.setInitialPosition.bind(this);
            this.makeResizeHandles = this.makeResizeHandles.bind(this);
            this.isTopMostWindow = this.isTopMostWindow.bind(this);
            this.bringToTop = this.bringToTop.bind(this);
            this.setDimensionBounds = this.setDimensionBounds.bind(this);
            this.onDocumentWindowResize = this.onDocumentWindowResize.bind(this);
        };
        WindowContainerComponent.prototype.setInitialPosition = function () {
            this.setDimensionBounds();
            var initialRect = this.ownDOMNode.current.getBoundingClientRect();
            var position = {
                top: initialRect.top,
                left: initialRect.left,
                width: initialRect.width,
                height: initialRect.height,
            };
            var container = this.props.containingAreaElement;
            var requestedPosition = this.props.getInitialPosition ?
                this.props.getInitialPosition(position, container) :
                windowManager.getDefaultInitialPosition(position, container);
            position.width = utility_1.clamp(requestedPosition.width, this.minWidth, this.maxWidth);
            position.height = utility_1.clamp(requestedPosition.height, this.minHeight, this.maxHeight);
            position.left = utility_1.clamp(requestedPosition.left, 0, container.offsetWidth - position.width);
            position.top = utility_1.clamp(requestedPosition.top, 0, container.offsetHeight - position.height);
            this.dragPositioner.position = position;
            this.dragPositioner.updateDOMNodeStyle();
            var firstChildElement = this.ownDOMNode.current.firstElementChild;
            if (firstChildElement) {
                var firstChildRect = firstChildElement.getBoundingClientRect();
                var ownRect = this.ownDOMNode.current.getBoundingClientRect();
                var horizontalPadding = firstChildRect.width - ownRect.width;
                var verticalPadding = firstChildRect.height - ownRect.height;
                this.ownDOMNode.current.style.paddingRight = "" + horizontalPadding + "px";
                this.ownDOMNode.current.style.paddingBottom = "" + verticalPadding + "px";
            }
        };
        WindowContainerComponent.prototype.handleResizeMove = function (rawX, rawY) {
            if (isFinite(rawX)) {
                if (this.resizeStartQuadrant.left) {
                    var right = this.resizeStartPosition.left + this.resizeStartPosition.width;
                    var minX = right - this.maxWidth;
                    var maxX = right - this.minWidth;
                    var x = utility_1.clamp(rawX, minX, maxX);
                    this.dragPositioner.position.width = right - x;
                    this.dragPositioner.position.left = x;
                }
                else {
                    var minX = this.resizeStartPosition.left + this.minWidth;
                    var maxX = this.resizeStartPosition.left + this.maxWidth;
                    var x = utility_1.clamp(rawX, minX, maxX);
                    this.dragPositioner.position.width = x - this.resizeStartPosition.left;
                }
            }
            if (isFinite(rawY)) {
                if (this.resizeStartQuadrant.top) {
                    var bottom = this.resizeStartPosition.top + this.resizeStartPosition.height;
                    var minY = bottom - this.maxHeight;
                    var maxY = bottom - this.minHeight;
                    var y = utility_1.clamp(rawY, minY, maxY);
                    this.dragPositioner.position.height = bottom - y;
                    this.dragPositioner.position.top = y;
                }
                else {
                    var minY = this.resizeStartPosition.top + this.minHeight;
                    var maxY = this.resizeStartPosition.top + this.maxHeight;
                    var y = utility_1.clamp(rawY, minY, maxY);
                    this.dragPositioner.position.height = y - this.resizeStartPosition.top;
                }
            }
            this.dragPositioner.updateDOMNodeStyle();
        };
        WindowContainerComponent.prototype.handleResizeStart = function (x, y) {
            var rect = this.ownDOMNode.current.getBoundingClientRect();
            var midX = rect.left + rect.width / 2;
            var midY = rect.top + rect.height / 2;
            this.resizeStartPosition = this.getPosition();
            this.resizeStartQuadrant =
                {
                    left: x < midX,
                    top: y < midY,
                };
        };
        WindowContainerComponent.prototype.makeResizeHandles = function (directions) {
            var _this = this;
            if (directions === void 0) { directions = "all"; }
            var directionsToCreate = directions === "all" ?
                ["n", "e", "w", "s", "ne", "se", "sw", "nw"] :
                directions.slice(0);
            return directionsToCreate.map(function (direction) {
                return WindowResizeHandle_1.WindowResizeHandle({
                    handleResizeMove: _this.handleResizeMove,
                    handleResizeStart: _this.handleResizeStart,
                    direction: direction,
                    key: direction,
                });
            });
        };
        WindowContainerComponent.prototype.setDimensionBounds = function (props) {
            if (props === void 0) { props = this.props; }
            var container = props.containingAreaElement;
            var containerRect = container.getBoundingClientRect();
            this.minWidth = Math.min(props.minWidth, containerRect.width);
            this.minHeight = Math.min(props.minHeight, containerRect.height);
            this.maxWidth = Math.min(props.maxWidth, containerRect.width);
            this.maxHeight = Math.min(props.maxHeight, containerRect.height);
            this.ownDOMNode.current.style.minWidth = "" + this.minWidth + "px";
            this.ownDOMNode.current.style.minHeight = "" + this.minHeight + "px";
            this.ownDOMNode.current.style.maxWidth = "" + this.maxWidth + "px";
            this.ownDOMNode.current.style.maxHeight = "" + this.maxHeight + "px";
        };
        WindowContainerComponent.prototype.onDocumentWindowResize = function () {
            var _this = this;
            if (this.onDocumentWindowResizeTimeoutHandle !== undefined) {
                window.cancelAnimationFrame(this.onDocumentWindowResizeTimeoutHandle);
            }
            this.onDocumentWindowResizeTimeoutHandle = window.requestAnimationFrame(function () {
                _this.setDimensionBounds();
                _this.clampToContainingAreaElementBounds();
            });
        };
        WindowContainerComponent.prototype.clampToContainingAreaElementBounds = function () {
            var container = this.props.containingAreaElement;
            var containerRect = container.getBoundingClientRect();
            this.dragPositioner.position.width = utility_1.clamp(this.dragPositioner.position.width, this.minWidth, this.maxWidth);
            this.dragPositioner.position.height = utility_1.clamp(this.dragPositioner.position.height, this.minHeight, this.maxHeight);
            this.dragPositioner.position.left = utility_1.clamp(this.dragPositioner.position.left, containerRect.left, containerRect.right - this.dragPositioner.position.width);
            this.dragPositioner.position.top = utility_1.clamp(this.dragPositioner.position.top, containerRect.top, containerRect.bottom - this.dragPositioner.position.height);
            this.dragPositioner.updateDOMNodeStyle();
        };
        return WindowContainerComponent;
    }(React.Component));
    exports.WindowContainerComponent = WindowContainerComponent;
    exports.WindowContainer = React.createFactory(WindowContainerComponent);
});
define("modules/defaultui/uicomponents/windows/windowManager", ["require", "exports", "src/IdDictionary"], function (require, exports, IdDictionary_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var baseZIndex = 10000;
    var windowCascadeMargin = 20;
    var zIndex = baseZIndex;
    var byId = new IdDictionary_1.IdDictionary();
    function getNewZIndex(component) {
        if (component.state && component.state.zIndex && component.state.zIndex === zIndex) {
            return zIndex;
        }
        else {
            return zIndex++;
        }
    }
    exports.getNewZIndex = getNewZIndex;
    function getWindowsByZIndex() {
        return byId.sort(function (a, b) {
            return b.state.zIndex - a.state.zIndex;
        });
    }
    exports.getWindowsByZIndex = getWindowsByZIndex;
    function getDefaultInitialPosition(rect, container) {
        var windowsByZIndex = getWindowsByZIndex();
        if (windowsByZIndex.length === 0) {
            return ({
                left: container.offsetWidth / 2.5 - rect.width / 2,
                top: container.offsetHeight / 2.5 - rect.height / 2,
                width: rect.width,
                height: rect.height,
            });
        }
        else {
            var topMostWindowPosition = windowsByZIndex[0].dragPositioner.position;
            return ({
                left: topMostWindowPosition.left + windowCascadeMargin,
                top: topMostWindowPosition.top + windowCascadeMargin,
                width: rect.width,
                height: rect.height,
            });
        }
    }
    exports.getDefaultInitialPosition = getDefaultInitialPosition;
    function handleMount(component) {
        if (byId.has(component)) {
            throw new Error("Duplicate window id " + component.id + " in window " + component);
        }
        byId.set(component, component);
    }
    exports.handleMount = handleMount;
    function handleUnount(component) {
        byId.delete(component);
    }
    exports.handleUnount = handleUnount;
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultui/uicomponents/windows/WindowResizeHandle", ["require", "exports", "react", "react-dom-factories", "modules/defaultui/uicomponents/mixins/DragPositioner", "modules/defaultui/uicomponents/mixins/applyMixins"], function (require, exports, React, ReactDOMElements, DragPositioner_1, applyMixins_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WindowResizeHandleComponent = (function (_super) {
        __extends(WindowResizeHandleComponent, _super);
        function WindowResizeHandleComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "WindowResizeHandle";
            _this.ownDOMNode = React.createRef();
            _this.bindMethods();
            switch (_this.props.direction) {
                case "n":
                case "s":
                    {
                        _this.directionRestriction = "vertical";
                        break;
                    }
                case "e":
                case "w":
                    {
                        _this.directionRestriction = "horizontal";
                        break;
                    }
                case "ne":
                case "se":
                case "sw":
                case "nw":
                    {
                        _this.directionRestriction = "free";
                        break;
                    }
                default:
                    {
                        throw new Error("Invalid window resize handle direction '" + _this.props.direction + "'");
                    }
            }
            _this.dragPositioner = new DragPositioner_1.DragPositioner(_this, _this.ownDOMNode);
            _this.dragPositioner.onDragMove = _this.onDragMove;
            _this.dragPositioner.onDragStart = _this.onDragStart;
            _this.dragPositioner.forcedDragOffset = { x: 0, y: 0 };
            _this.dragPositioner.makeDragClone = function () {
                var div = document.createElement("div");
                div.classList.add("draggable", "dragging");
                return div;
            };
            applyMixins_1.applyMixins(_this, _this.dragPositioner);
            return _this;
        }
        WindowResizeHandleComponent.prototype.render = function () {
            return (ReactDOMElements.div({
                className: "window-resize-handle" + (" window-resize-handle-" + this.props.direction),
                ref: this.ownDOMNode,
                onTouchStart: this.dragPositioner.handleReactDownEvent,
                onMouseDown: this.dragPositioner.handleReactDownEvent,
            }));
        };
        WindowResizeHandleComponent.prototype.onDragStart = function (x, y) {
            this.props.handleResizeStart(x, y);
        };
        WindowResizeHandleComponent.prototype.onDragMove = function (x, y) {
            this.props.handleResizeMove(this.directionRestriction === "vertical" ? undefined : x, this.directionRestriction === "horizontal" ? undefined : y);
        };
        WindowResizeHandleComponent.prototype.bindMethods = function () {
            this.onDragStart = this.onDragStart.bind(this);
            this.onDragMove = this.onDragMove.bind(this);
        };
        return WindowResizeHandleComponent;
    }(React.Component));
    exports.WindowResizeHandleComponent = WindowResizeHandleComponent;
    exports.WindowResizeHandle = React.createFactory(WindowResizeHandleComponent);
});
//# sourceMappingURL=index.js.map