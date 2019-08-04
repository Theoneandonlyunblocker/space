define("modules/space/technologies/spaceTechnologies", ["require", "exports", "modules/englishlanguage/englishLanguage", "src/GameModuleInitializationPhase", "modules/space/technologies/technologyTemplates", "json!modules/space/technologies/moduleInfo.json"], function (require, exports, englishLanguage_1, GameModuleInitializationPhase_1, technologyTemplates_1, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.spaceTechnologies = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.MapGen,
        supportedLanguages: [englishLanguage_1.englishLanguage],
        addToModuleData: function (moduleData) {
            moduleData.copyTemplates(technologyTemplates_1.technologyTemplates, "Technologies");
            return moduleData;
        },
    };
});
define("modules/space/technologies/technologyTemplates", ["require", "exports"], function (require, exports) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stealth = {
        key: "stealth",
        displayName: "Stealth",
        description: "stealthy stuff",
        maxLevel: 9,
    };
    exports.lasers = {
        key: "lasers",
        displayName: "Lasers",
        description: "pew pew",
        maxLevel: 9,
    };
    exports.missiles = {
        key: "missiles",
        displayName: "Missiles",
        description: "boom",
        maxLevel: 9,
    };
    exports.test1 = {
        key: "test1",
        displayName: "test1",
        description: "test1",
        maxLevel: 1,
    };
    exports.test2 = {
        key: "test2",
        displayName: "test2",
        description: "test2",
        maxLevel: 2,
    };
    exports.technologyTemplates = (_a = {},
        _a[exports.stealth.key] = exports.stealth,
        _a[exports.lasers.key] = exports.lasers,
        _a[exports.missiles.key] = exports.missiles,
        _a[exports.test1.key] = exports.test1,
        _a[exports.test2.key] = exports.test2,
        _a);
});
//# sourceMappingURL=index.js.map