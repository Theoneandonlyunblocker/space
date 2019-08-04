define("modules/space/items/itemSlot", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.itemSlot = {
        low: "low",
        mid: "mid",
        high: "high",
    };
});
define("modules/space/items/itemTemplates", ["require", "exports", "modules/space/abilities/abilities", "modules/space/passiveskills/passiveSkills", "modules/space/items/resources"], function (require, exports, abilities_1, passiveSkills_1, resources_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bombLauncher1 = {
        type: "bombLauncher1",
        displayName: "Bomb Launcher 1",
        description: "",
        getIconSrc: resources_1.getIconSrc.bind(null, "cannon"),
        techLevel: 1,
        buildCost: 100,
        kind: "item",
        slot: "high",
        ability: abilities_1.bombAttack,
    };
    exports.bombLauncher2 = {
        type: "bombLauncher2",
        displayName: "Bomb Launcher 2",
        description: "",
        getIconSrc: resources_1.getIconSrc.bind(null, "cannon"),
        techLevel: 2,
        buildCost: 200,
        kind: "item",
        attributeAdjustments: {
            attack: { flat: 1 },
        },
        slot: "high",
        ability: abilities_1.bombAttack,
    };
    exports.bombLauncher3 = {
        type: "bombLauncher3",
        displayName: "Bomb Launcher 3",
        description: "",
        getIconSrc: resources_1.getIconSrc.bind(null, "cannon"),
        techLevel: 3,
        buildCost: 300,
        kind: "item",
        attributeAdjustments: {
            attack: { flat: 3 },
        },
        slot: "high",
        ability: abilities_1.bombAttack,
    };
    exports.afterBurner1 = {
        type: "afterBurner1",
        displayName: "Afterburner 1",
        description: "",
        getIconSrc: resources_1.getIconSrc.bind(null, "blueThing"),
        techLevel: 1,
        buildCost: 100,
        kind: "item",
        attributeAdjustments: {
            speed: { flat: 1 },
        },
        slot: "mid",
        passiveSkill: passiveSkills_1.overdrive,
    };
    exports.afterBurner2 = {
        type: "afterBurner2",
        displayName: "Afterburner 2",
        description: "",
        getIconSrc: resources_1.getIconSrc.bind(null, "blueThing"),
        techLevel: 2,
        buildCost: 200,
        kind: "item",
        attributeAdjustments: {
            speed: { flat: 2 },
        },
        slot: "mid",
    };
    exports.afterBurner3 = {
        type: "afterBurner3",
        displayName: "Afterburner 3",
        description: "",
        getIconSrc: resources_1.getIconSrc.bind(null, "blueThing"),
        techLevel: 3,
        buildCost: 300,
        kind: "item",
        attributeAdjustments: {
            maxActionPoints: { flat: 1 },
            speed: { flat: 3 },
        },
        slot: "mid",
    };
    exports.shieldPlating1 = {
        type: "shieldPlating1",
        displayName: "Shield Plating 1",
        description: "",
        getIconSrc: resources_1.getIconSrc.bind(null, "armor"),
        techLevel: 1,
        buildCost: 100,
        kind: "item",
        attributeAdjustments: {
            defence: { flat: 1 },
        },
        slot: "low",
    };
    exports.shieldPlating2 = {
        type: "shieldPlating2",
        displayName: "Shield Plating 2",
        description: "",
        getIconSrc: resources_1.getIconSrc.bind(null, "armor"),
        techLevel: 2,
        buildCost: 200,
        kind: "item",
        attributeAdjustments: {
            defence: { flat: 2 },
        },
        slot: "low",
    };
    exports.shieldPlating3 = {
        type: "shieldPlating3",
        displayName: "Shield Plating 3",
        description: "",
        getIconSrc: resources_1.getIconSrc.bind(null, "armor"),
        techLevel: 3,
        buildCost: 300,
        kind: "item",
        attributeAdjustments: {
            defence: { flat: 3 },
            speed: { flat: -1 },
        },
        slot: "low",
        ability: abilities_1.guardRow,
    };
    exports.itemTemplates = (_a = {},
        _a[exports.bombLauncher1.type] = exports.bombLauncher1,
        _a[exports.bombLauncher2.type] = exports.bombLauncher2,
        _a[exports.bombLauncher3.type] = exports.bombLauncher3,
        _a[exports.afterBurner1.type] = exports.afterBurner1,
        _a[exports.afterBurner2.type] = exports.afterBurner2,
        _a[exports.afterBurner3.type] = exports.afterBurner3,
        _a[exports.shieldPlating1.type] = exports.shieldPlating1,
        _a[exports.shieldPlating2.type] = exports.shieldPlating2,
        _a[exports.shieldPlating3.type] = exports.shieldPlating3,
        _a);
});
define("modules/space/items/resources", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.iconSources = {
        armor: "./img/armor.png",
        blueThing: "./img/blueThing.png",
        cannon: "./img/cannon.png",
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
define("modules/space/items/spaceItems", ["require", "exports", "modules/englishlanguage/englishLanguage", "src/GameModuleInitializationPhase", "modules/space/items/itemTemplates", "modules/space/items/resources", "json!modules/space/items/moduleInfo.json"], function (require, exports, englishLanguage_1, GameModuleInitializationPhase_1, itemTemplates_1, resources_1, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.spaceItems = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.MapGen,
        supportedLanguages: [englishLanguage_1.englishLanguage],
        initialize: function (baseUrl) {
            resources_1.setBaseUrl(baseUrl);
            return Promise.resolve();
        },
        addToModuleData: function (moduleData) {
            moduleData.copyTemplates(itemTemplates_1.itemTemplates, "Items");
            return moduleData;
        },
    };
});
//# sourceMappingURL=index.js.map