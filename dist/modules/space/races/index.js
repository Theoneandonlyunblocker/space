define("modules/space/races/common/defaultRaceTechnologyValues", ["require", "exports", "modules/space/technologies/technologyTemplates"], function (require, exports, TechnologyTemplates) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultRaceTechnologyValues = [
        {
            tech: TechnologyTemplates.stealth,
            startingLevel: 0,
            maxLevel: 9,
        },
        {
            tech: TechnologyTemplates.lasers,
            startingLevel: 0,
            maxLevel: 9,
        },
        {
            tech: TechnologyTemplates.missiles,
            startingLevel: 0,
            maxLevel: 9,
        },
    ];
});
define("modules/space/races/common/getDefaultBuildableBuildings", ["require", "exports", "modules/space/buildings/templates/otherBuildings", "modules/space/buildings/templates/territoryBuildings"], function (require, exports, otherBuildings, territoryBuildings) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getDefaultBuildableBuildings() {
        return [
            territoryBuildings.sectorCommand,
            territoryBuildings.starBase,
            otherBuildings.deepSpaceRadar,
            otherBuildings.resourceMine,
            otherBuildings.thePyramids,
            otherBuildings.nationalEpic,
        ];
    }
    exports.getDefaultBuildableBuildings = getDefaultBuildableBuildings;
});
define("modules/space/races/common/getDefaultBuildableItems", ["require", "exports", "modules/space/items/itemTemplates"], function (require, exports, items) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getDefaultBuildableItems() {
        return [
            items.bombLauncher1,
            items.bombLauncher2,
            items.afterBurner1,
            items.afterBurner2,
            items.shieldPlating1,
            items.shieldPlating2,
        ];
    }
    exports.getDefaultBuildableItems = getDefaultBuildableItems;
});
define("modules/space/races/common/getDefaultBuildableUnits", ["require", "exports", "modules/space/units/unitTemplates", "modules/space/units/templates/debugShip", "src/Options"], function (require, exports, unitTemplates_1, debugShip_1, Options_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getDefaultBuildableUnits() {
        var availableUnits = [
            unitTemplates_1.unitTemplates.battleCruiser,
            unitTemplates_1.unitTemplates.stealthShip,
            unitTemplates_1.unitTemplates.scout,
            unitTemplates_1.unitTemplates.bomberSquadron,
            unitTemplates_1.unitTemplates.shieldBoat,
        ];
        if (Options_1.options.debug.enabled) {
            availableUnits.push(debugShip_1.debugShip);
        }
        return availableUnits;
    }
    exports.getDefaultBuildableUnits = getDefaultBuildableUnits;
});
define("modules/space/races/common/utility", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function mergeTechnologyValues() {
        var valuesToMerge = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            valuesToMerge[_i] = arguments[_i];
        }
        var valuesByTechKey = {};
        valuesToMerge.forEach(function (techValues) {
            techValues.forEach(function (techValue) {
                valuesByTechKey[techValue.tech.key] = techValue;
            });
        });
        var mergedValues = [];
        for (var key in valuesByTechKey) {
            mergedValues.push(valuesByTechKey[key]);
        }
        return mergedValues;
    }
    exports.mergeTechnologyValues = mergeTechnologyValues;
});
define("modules/space/races/raceTemplates", ["require", "exports", "modules/space/races/templates/federationAlliance", "modules/space/races/templates/wormThings"], function (require, exports, federationAlliance_1, wormThings_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.raceTemplates = (_a = {},
        _a[federationAlliance_1.federationAlliance.type] = federationAlliance_1.federationAlliance,
        _a[wormThings_1.wormThings.type] = wormThings_1.wormThings,
        _a);
});
define("modules/space/races/spaceRaces", ["require", "exports", "modules/englishlanguage/englishLanguage", "src/GameModuleInitializationPhase", "modules/space/races/raceTemplates", "json!modules/space/races/moduleInfo.json"], function (require, exports, englishLanguage_1, GameModuleInitializationPhase_1, raceTemplates_1, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.spaceRaces = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.GameSetup,
        supportedLanguages: [englishLanguage_1.englishLanguage],
        addToModuleData: function (moduleData) {
            moduleData.copyTemplates(raceTemplates_1.raceTemplates, "Races");
            return moduleData;
        },
    };
});
define("modules/space/races/templates/federationAlliance", ["require", "exports", "src/Name", "src/utility", "modules/common/generateIndependentFleets", "modules/common/generateIndependentPlayer", "modules/defaultai/mapai/DefaultAiConstructor", "modules/space/technologies/technologyTemplates", "modules/space/items/itemTemplates", "modules/space/units/unitTemplates", "modules/space/buildings/templates/otherBuildings", "modules/space/races/common/getDefaultBuildableBuildings", "modules/space/races/common/getDefaultBuildableItems", "modules/space/races/common/getDefaultBuildableUnits", "modules/space/races/common/defaultRaceTechnologyValues", "modules/space/races/common/utility"], function (require, exports, Name_1, utility_1, generateIndependentFleets_1, generateIndependentPlayer_1, DefaultAiConstructor_1, TechnologyTemplates, items, unitTemplates_1, buildings, getDefaultBuildableBuildings_1, getDefaultBuildableItems_1, getDefaultBuildableUnits_1, defaultRaceTechnologyValues_1, utility_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.federationAlliance = {
        type: "federationAlliance",
        displayName: new Name_1.Name("Federation Alliance", false),
        description: "The good guys",
        distributionData: {
            weight: 0,
            distributionGroups: [],
        },
        getBuildableBuildings: function () {
            return getDefaultBuildableBuildings_1.getDefaultBuildableBuildings().concat([
                buildings.commercialPort,
            ]);
        },
        getBuildableItems: function () {
            return getDefaultBuildableItems_1.getDefaultBuildableItems().concat([
                items.bombLauncher3,
            ]);
        },
        getBuildableUnits: function () {
            return getDefaultBuildableUnits_1.getDefaultBuildableUnits().concat([
                unitTemplates_1.unitTemplates.commandShip,
            ]);
        },
        getUnitName: function (unitTemplate) {
            return "Federation " + unitTemplate.displayName;
        },
        getUnitPortrait: function (unitTemplate, allTemplates) {
            return utility_1.getRandomProperty(allTemplates);
        },
        generateIndependentPlayer: function (emblemTemplates) {
            var player = generateIndependentPlayer_1.generateIndependentPlayer(exports.federationAlliance);
            player.name = new Name_1.Name(exports.federationAlliance.displayName + " Independents", true);
            return player;
        },
        generateIndependentFleets: function (player, location, globalStrength, localStrength, maxUnitsPerSideInBattle) {
            return generateIndependentFleets_1.generateIndependentFleets(exports.federationAlliance, player, location, globalStrength, localStrength, maxUnitsPerSideInBattle);
        },
        technologies: utility_2.mergeTechnologyValues(defaultRaceTechnologyValues_1.defaultRaceTechnologyValues, [
            {
                tech: TechnologyTemplates.test1,
                startingLevel: 1,
                maxLevel: 5,
            },
        ]),
        getAiTemplateConstructor: function (player) { return DefaultAiConstructor_1.defaultAiConstructor; },
    };
});
define("modules/space/races/templates/wormThings", ["require", "exports", "src/Name", "src/utility", "modules/common/generateIndependentFleets", "modules/common/generateIndependentPlayer", "modules/defaultai/mapai/DefaultAiConstructor", "modules/space/technologies/technologyTemplates", "modules/space/items/itemTemplates", "modules/space/units/unitTemplates", "modules/space/buildings/templates/otherBuildings", "modules/space/races/common/getDefaultBuildableBuildings", "modules/space/races/common/getDefaultBuildableItems", "modules/space/races/common/getDefaultBuildableUnits", "modules/space/races/common/defaultRaceTechnologyValues", "modules/space/races/common/utility"], function (require, exports, Name_1, utility_1, generateIndependentFleets_1, generateIndependentPlayer_1, DefaultAiConstructor_1, TechnologyTemplates, items, unitTemplates_1, buildings, getDefaultBuildableBuildings_1, getDefaultBuildableItems_1, getDefaultBuildableUnits_1, defaultRaceTechnologyValues_1, utility_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wormThings = {
        type: "wormThings",
        displayName: new Name_1.Name("Worm Things", true),
        description: "The gross guys",
        distributionData: {
            weight: 0,
            distributionGroups: [],
        },
        getBuildableBuildings: function () {
            return getDefaultBuildableBuildings_1.getDefaultBuildableBuildings().concat([
                buildings.reserachLab,
            ]);
        },
        getBuildableItems: function () {
            return getDefaultBuildableItems_1.getDefaultBuildableItems().concat([
                items.shieldPlating3,
            ]);
        },
        getBuildableUnits: function () {
            return getDefaultBuildableUnits_1.getDefaultBuildableUnits().concat([
                unitTemplates_1.unitTemplates.fighterSquadron,
            ]);
        },
        getUnitName: function (unitTemplate) {
            return "Infested " + unitTemplate.displayName;
        },
        getUnitPortrait: function (unitTemplate, allTemplates) {
            return utility_1.getRandomProperty(allTemplates);
        },
        generateIndependentPlayer: function (emblemTemplates) {
            return generateIndependentPlayer_1.generateIndependentPlayer(exports.wormThings);
        },
        generateIndependentFleets: function (player, location, globalStrength, localStrength, maxUnitsPerSideInBattle) {
            return generateIndependentFleets_1.generateIndependentFleets(exports.wormThings, player, location, globalStrength, localStrength, maxUnitsPerSideInBattle);
        },
        technologies: utility_2.mergeTechnologyValues(defaultRaceTechnologyValues_1.defaultRaceTechnologyValues, [
            {
                tech: TechnologyTemplates.test2,
                startingLevel: 1,
                maxLevel: 5,
            },
        ]),
        getAiTemplateConstructor: function (player) { return DefaultAiConstructor_1.defaultAiConstructor; },
    };
});
//# sourceMappingURL=index.js.map