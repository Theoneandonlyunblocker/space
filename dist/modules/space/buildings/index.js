define("modules/space/buildings/buildingTemplates", ["require", "exports", "modules/space/buildings/templates/otherBuildings", "modules/space/buildings/templates/territoryBuildings"], function (require, exports, otherBuildings, territoryBuildings) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildingTemplates = (_a = {},
        _a[territoryBuildings.sectorCommand.type] = territoryBuildings.sectorCommand,
        _a[territoryBuildings.sectorCommand1.type] = territoryBuildings.sectorCommand1,
        _a[territoryBuildings.sectorCommand2.type] = territoryBuildings.sectorCommand2,
        _a[territoryBuildings.starBase.type] = territoryBuildings.starBase,
        _a[otherBuildings.commercialPort.type] = otherBuildings.commercialPort,
        _a[otherBuildings.deepSpaceRadar.type] = otherBuildings.deepSpaceRadar,
        _a[otherBuildings.resourceMine.type] = otherBuildings.resourceMine,
        _a[otherBuildings.reserachLab.type] = otherBuildings.reserachLab,
        _a[otherBuildings.thePyramids.type] = otherBuildings.thePyramids,
        _a[otherBuildings.nationalEpic.type] = otherBuildings.nationalEpic,
        _a);
});
define("modules/space/buildings/resources", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.iconSources = {
        starBase: "./img/starBase.svg",
        sectorCommand: "./img/sectorCommand.svg",
    };
    exports.svgCache = {};
    function getIconElement(key, color) {
        var sourceElement = exports.svgCache[key];
        var clone = sourceElement.cloneNode(true);
        clone.setAttribute("preserveAspectRatio", "xMidYMid meet");
        var toFill = clone.querySelectorAll(".building-main");
        for (var i = 0; i < toFill.length; i++) {
            var match = toFill[i];
            match.setAttribute("fill", "#" + color.getHexString());
        }
        return clone;
    }
    exports.getIconElement = getIconElement;
});
define("modules/space/buildings/spaceBuildings", ["require", "exports", "pixi.js", "modules/englishlanguage/englishLanguage", "src/GameModuleInitializationPhase", "modules/space/buildings/buildingTemplates", "modules/space/buildings/resources", "json!modules/space/buildings/moduleInfo.json"], function (require, exports, PIXI, englishLanguage_1, GameModuleInitializationPhase_1, buildingTemplates_1, resources_1, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.spaceBuildings = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.MapGen,
        supportedLanguages: [englishLanguage_1.englishLanguage],
        initialize: function (baseUrl) {
            var loader = new PIXI.Loader(baseUrl);
            for (var key in resources_1.iconSources) {
                loader.add({
                    url: resources_1.iconSources[key],
                    loadType: 1,
                });
            }
            return new Promise(function (resolve) {
                loader.load(function () {
                    for (var key in resources_1.iconSources) {
                        var response = loader.resources[resources_1.iconSources[key]].data;
                        var svgDoc = response.children[0];
                        resources_1.svgCache[key] = svgDoc;
                    }
                    resolve();
                });
            });
        },
        addToModuleData: function (moduleData) {
            moduleData.copyTemplates(buildingTemplates_1.buildingTemplates, "Buildings");
            return moduleData;
        },
    };
});
define("modules/space/buildings/templates/battleEffects", ["require", "exports", "modules/space/effectactions/effectActions"], function (require, exports, effectActions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeDefenderAdvantageEffect(amount) {
        return ({
            type: "defenderAdvantage",
            isHidden: true,
            atBattleStart: [
                {
                    id: "defenderAdvantage",
                    getUnitsInArea: function () { return []; },
                    executeAction: effectActions_1.adjustDefenderBattleEvaluationAdjustment.bind(null, {
                        amount: amount,
                    }),
                },
            ],
        });
    }
    exports.makeDefenderAdvantageEffect = makeDefenderAdvantageEffect;
});
define("modules/space/buildings/templates/buildingFamilies", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.territoryBuildings = {
        type: "territoryBuilding",
        maxBuiltAtLocation: 4,
    };
    exports.sectorCommandFamily = {
        type: "sectorCommandFamily",
        maxBuiltAtLocation: 1,
    };
});
define("modules/space/buildings/templates/otherBuildings", ["require", "exports", "modules/space/technologies/technologyTemplates"], function (require, exports, technologies) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.commercialPort = {
        type: "commercialPort",
        kind: "building",
        displayName: "Commercial Spaceport",
        description: "Increase star income by 20",
        families: [],
        buildCost: 200,
        maxBuiltAtLocation: 1,
        getEffect: function () {
            return ({
                income: { flat: 20 },
            });
        },
    };
    exports.deepSpaceRadar = {
        type: "deepSpaceRadar",
        kind: "building",
        displayName: "Deep Space Radar",
        description: "Increase star vision and detection radius by 1",
        families: [],
        buildCost: 200,
        maxBuiltAtLocation: 1,
        getEffect: function () {
            return ({
                vision: { flat: 1 },
                detection: { flat: 1 },
            });
        },
        techRequirements: [
            {
                technology: technologies.stealth,
                level: 1,
            }
        ]
    };
    exports.resourceMine = {
        type: "resourceMine",
        kind: "building",
        displayName: "Mine",
        description: "Gathers 1 resource per turn from current star",
        families: [],
        buildCost: 500,
        maxBuiltAtLocation: 1,
        canBeBuiltInLocation: function (star) {
            return Boolean(star.resource);
        },
        getEffect: function () {
            return ({
                resourceIncome: {
                    flat: 1,
                },
            });
        },
    };
    exports.reserachLab = {
        type: "reserachLab",
        kind: "building",
        displayName: "Research Lab",
        description: "Increase research speed by 10",
        families: [],
        buildCost: 300,
        maxBuiltAtLocation: 1,
        getEffect: function () {
            return ({
                researchPoints: { flat: 10 },
            });
        },
    };
    exports.thePyramids = {
        type: "thePyramids",
        kind: "building",
        displayName: "The Pyramids",
        description: "",
        families: [],
        onBuild: function (star, player) {
            player.money += 1000;
        },
        buildCost: 0,
        maxBuiltAtLocation: 1,
        maxBuiltGlobally: 1,
    };
    exports.nationalEpic = {
        type: "nationalEpic",
        kind: "building",
        displayName: "National Epic",
        description: "",
        families: [],
        onBuild: function (star, player) {
            player.money += 999;
        },
        buildCost: 0,
        maxBuiltAtLocation: 1,
        maxBuiltForPlayer: 1,
    };
});
define("modules/space/buildings/templates/territoryBuildings", ["require", "exports", "modules/space/buildings/resources", "modules/space/buildings/templates/battleEffects", "modules/space/buildings/templates/buildingFamilies"], function (require, exports, resources_1, battleEffects_1, buildingFamilies_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sectorCommand = {
        type: "sectorCommand",
        isTerritoryBuilding: true,
        kind: "building",
        families: [buildingFamilies_1.territoryBuildings, buildingFamilies_1.sectorCommandFamily],
        displayName: "Sector Command",
        description: "Defence building with slight defender advantage. (All defence buildings must " +
            "be captured to gain control of area)",
        getIconElement: resources_1.getIconElement.bind(null, "sectorCommand"),
        buildCost: 200,
        maxBuiltAtLocation: 1,
        getStandardUpgradeTargets: function () {
            return [
                exports.sectorCommand1,
                exports.sectorCommand2,
            ];
        },
        battleEffects: [battleEffects_1.makeDefenderAdvantageEffect(0.2)],
    };
    exports.sectorCommand1 = {
        type: "sectorCommand1",
        isTerritoryBuilding: true,
        kind: "building",
        families: [buildingFamilies_1.territoryBuildings, buildingFamilies_1.sectorCommandFamily],
        displayName: "Sector Command1",
        description: "just testing upgrade paths",
        getIconElement: resources_1.getIconElement.bind(null, "sectorCommand"),
        buildCost: 100,
        maxBuiltAtLocation: 1,
        battleEffects: [battleEffects_1.makeDefenderAdvantageEffect(0.3)],
    };
    exports.sectorCommand2 = {
        type: "sectorCommand2",
        isTerritoryBuilding: true,
        kind: "building",
        families: [buildingFamilies_1.territoryBuildings, buildingFamilies_1.sectorCommandFamily],
        displayName: "Sector Command2",
        description: "just testing upgrade paths",
        getIconElement: resources_1.getIconElement.bind(null, "sectorCommand"),
        buildCost: 200,
        maxBuiltAtLocation: 1,
        battleEffects: [battleEffects_1.makeDefenderAdvantageEffect(0.3)],
    };
    exports.starBase = {
        type: "starBase",
        isTerritoryBuilding: true,
        kind: "building",
        families: [buildingFamilies_1.territoryBuildings],
        displayName: "Starbase",
        description: "Defence building with no defender advantage. (All defence buildings must " +
            "be captured to gain control of area)",
        getIconElement: resources_1.getIconElement.bind(null, "starBase"),
        buildCost: 200,
        battleEffects: [battleEffects_1.makeDefenderAdvantageEffect(0.1)],
        getStandardUpgradeTargets: function () {
            return [
                exports.sectorCommand,
            ];
        },
    };
});
//# sourceMappingURL=index.js.map