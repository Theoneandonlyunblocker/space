define("modules/englishlanguage/englishLanguage", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.englishLanguage = {
        code: "en",
        displayName: "English",
    };
});
define("modules/englishlanguage/englishLanguageSupport", ["require", "exports", "src/GameModuleInitializationPhase", "modules/englishlanguage/englishLanguage", "json!modules/englishlanguage/moduleInfo.json"], function (require, exports, GameModuleInitializationPhase_1, englishLanguage_1, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.englishLanguageSupport = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.AppInit,
        supportedLanguages: "all",
        addToModuleData: function (moduleData) {
            moduleData.copyTemplates({
                en: englishLanguage_1.englishLanguage,
            }, "Languages");
            return moduleData;
        },
    };
});
//# sourceMappingURL=index.js.map