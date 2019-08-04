define("modules/core/core", ["require", "exports", "pixi.js", "src/GameModuleInitializationPhase", "modules/core/modulescripts/allScripts", "json!modules/core/moduleInfo.json"], function (require, exports, PIXI, GameModuleInitializationPhase_1, allScripts_1, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.core = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.GameSetup,
        supportedLanguages: "all",
        initialize: function (baseUrl) {
            var loader = new PIXI.Loader();
            var placeHolderResourceName = "placeHolder";
            var placeHolderUrl = "img/placeholder.png";
            loader.add(placeHolderResourceName, placeHolderUrl);
            return new Promise(function (resolve) {
                loader.load(resolve);
            });
        },
        addToModuleData: function (moduleData) {
            moduleData.scripts.add(allScripts_1.allScripts);
            return moduleData;
        },
    };
});
define("modules/core/modulescripts/allScripts", ["require", "exports", "modules/core/modulescripts/unitScripts", "modules/core/modulescripts/starScripts", "modules/core/modulescripts/autoSaveScripts"], function (require, exports, unitScripts_1, starScripts_1, autoSaveScripts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var scriptsToMerge = [
        starScripts_1.starScripts,
        unitScripts_1.unitScripts,
        autoSaveScripts_1.autoSaveScripts,
    ];
    exports.allScripts = scriptsToMerge.reduce(function (merged, toMerge) {
        var _a;
        for (var category in toMerge) {
            if (!merged[category]) {
                merged[category] = {};
            }
            for (var scriptType in toMerge[category]) {
                if (!merged[category][scriptType]) {
                    merged[category][scriptType] = [];
                }
                (_a = merged[category][scriptType]).push.apply(_a, toMerge[category][scriptType]);
            }
        }
        return toMerge;
    }, {});
});
define("modules/core/modulescripts/autoSaveScripts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.autoSaveScripts = {
        game: {
            beforePlayerTurnEnd: [
                {
                    key: "autoSaveBeforePlayerTurnEnd",
                    priority: 0,
                    script: function (game) {
                        game.save("autosave", false);
                    }
                },
            ],
        }
    };
});
define("modules/core/modulescripts/starScripts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.starScripts = {
        star: {
            onOwnerChange: [
                {
                    key: "destroyPerPlayerLimitedBuildings",
                    priority: 0,
                    script: function (star, oldOwner, newOwner) {
                        star.buildings.filter(function (building) {
                            return isFinite(building.template.maxBuiltForPlayer) ||
                                building.template.families.some(function (family) {
                                    return isFinite(family.maxBuiltForPlayer);
                                });
                        }).forEach(function (building) {
                            star.buildings.remove(building);
                        });
                    },
                },
            ],
        },
    };
});
define("modules/core/modulescripts/unitScripts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unitScripts = {
        unit: {
            onCapture: [
                {
                    key: "transferCapturedUnit",
                    priority: 0,
                    script: function (unit, oldPlayer, newPlayer) {
                        unit.transferToPlayer(newPlayer);
                    },
                },
                {
                    key: "resetExperience",
                    priority: 0,
                    script: function (unit, oldPlayer, newPlayer) {
                        unit.experienceForCurrentLevel = 0;
                    },
                },
                {
                    key: "exhaustUnit",
                    priority: 0,
                    script: function (unit, oldPlayer, newPlayer) {
                        unit.currentMovePoints = 0;
                        unit.offensiveBattlesFoughtThisTurn = Infinity;
                    },
                },
            ],
        },
    };
});
//# sourceMappingURL=index.js.map