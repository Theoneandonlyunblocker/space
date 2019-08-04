define("modules/space/resources/assets", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.iconSources = {
        test1: "./img/test1.png",
        test2: "./img/test2.png",
        test3: "./img/test3.png",
        test4: "./img/test4.png",
        test5: "./img/test5.png",
    };
    var baseUrl = "";
    function setBaseUrl(newUrl) {
        baseUrl = newUrl;
    }
    exports.setBaseUrl = setBaseUrl;
    function getIconSrc(type) {
        return new URL(exports.iconSources[type], baseUrl).toString();
    }
    exports.getIconSrc = getIconSrc;
});
define("modules/space/resources/resourceTemplates", ["require", "exports", "modules/space/resources/assets"], function (require, exports, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.testResource1 = {
        type: "testResource1",
        displayName: "Test Resource 1",
        getIconSrc: assets_1.getIconSrc.bind(null, "test1"),
        distributionData: {
            weight: 1,
            distributionGroups: ["common"],
        },
    };
    exports.testResource2 = {
        type: "testResource2",
        displayName: "Test Resource 2",
        getIconSrc: assets_1.getIconSrc.bind(null, "test2"),
        distributionData: {
            weight: 1,
            distributionGroups: ["common"],
        },
    };
    exports.testResource3 = {
        type: "testResource3",
        displayName: "Test Resource 3",
        getIconSrc: assets_1.getIconSrc.bind(null, "test3"),
        distributionData: {
            weight: 1,
            distributionGroups: ["common"],
        },
    };
    exports.testResource4 = {
        type: "testResource4",
        displayName: "Test Resource 4",
        getIconSrc: assets_1.getIconSrc.bind(null, "test4"),
        distributionData: {
            weight: 1,
            distributionGroups: ["rare"],
        },
    };
    exports.testResource5 = {
        type: "testResource5",
        displayName: "Test Resource 5",
        getIconSrc: assets_1.getIconSrc.bind(null, "test5"),
        distributionData: {
            weight: 1,
            distributionGroups: ["rare"],
        },
    };
});
define("modules/space/resources/spaceResources", ["require", "exports", "modules/englishlanguage/englishLanguage", "src/GameModuleInitializationPhase", "modules/space/resources/resourceTemplates", "modules/space/resources/assets", "json!modules/space/resources/moduleInfo.json"], function (require, exports, englishLanguage_1, GameModuleInitializationPhase_1, ResourceTemplates, assets_1, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.spaceResources = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.MapGen,
        supportedLanguages: [englishLanguage_1.englishLanguage],
        initialize: function (baseUrl) {
            assets_1.setBaseUrl(baseUrl);
            return Promise.resolve();
        },
        addToModuleData: function (moduleData) {
            moduleData.copyTemplates(ResourceTemplates, "Resources");
            return moduleData;
        },
    };
});
//# sourceMappingURL=index.js.map