define("modules/defaultattitudemodifiers/attitudeModifierModuleScripts", ["require", "exports", "src/AttitudeModifier", "modules/defaultattitudemodifiers/attitudeModifierTemplates"], function (require, exports, AttitudeModifier_1, attitudeModifierTemplates_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.attitudeModifierModuleScripts = {
        diplomacy: {
            onFirstMeeting: [
                {
                    key: "addBaseOpinionAttitudeModifier",
                    priority: 0,
                    script: function (a, b, game) {
                        var friendliness = a.aiController.personality.friendliness;
                        var opinion = Math.round((friendliness - 0.5) * 10);
                        var modifier = new AttitudeModifier_1.AttitudeModifier({
                            template: attitudeModifierTemplates_1.baseOpinion,
                            startTurn: game.turnNumber,
                            strength: opinion,
                            hasFixedStrength: true,
                        });
                        a.diplomacy.addAttitudeModifier(b, modifier);
                    },
                },
            ],
            onWarDeclaration: [
                {
                    key: "addDeclaredWarAttitudeModifier",
                    priority: 0,
                    script: function (aggressor, defender, game) {
                        var modifier = new AttitudeModifier_1.AttitudeModifier({
                            template: attitudeModifierTemplates_1.declaredWar,
                            startTurn: game.turnNumber,
                        });
                        defender.diplomacy.addAttitudeModifier(aggressor, modifier);
                    },
                }
            ]
        },
    };
});
define("modules/defaultattitudemodifiers/attitudeModifierTemplates", ["require", "exports", "src/DiplomacyState"], function (require, exports, DiplomacyState_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.neighborStars = {
        type: "neighborStars",
        displayName: "neighborStars",
        duration: Infinity,
        startCondition: function (evaluation) {
            return (evaluation.neighborStars.length >= 2 && evaluation.opinion < 50);
        },
        getEffectFromEvaluation: function (evaluation) {
            return -2 * evaluation.neighborStars.length;
        },
    };
    exports.atWar = {
        type: "atWar",
        displayName: "At war",
        duration: Infinity,
        startCondition: function (evaluation) {
            return (evaluation.currentStatus >= DiplomacyState_1.DiplomacyState.War);
        },
        baseEffect: -30,
    };
    exports.baseOpinion = {
        type: "baseOpinion",
        displayName: "Base opinion",
        duration: Infinity,
    };
    exports.declaredWar = {
        type: "declaredWar",
        displayName: "Declared war",
        duration: 15,
        baseEffect: -35,
        decayRate: 0.5,
    };
    exports.attitudeModifierTemplates = (_a = {},
        _a[exports.neighborStars.type] = exports.neighborStars,
        _a[exports.atWar.type] = exports.atWar,
        _a[exports.declaredWar.type] = exports.declaredWar,
        _a[exports.baseOpinion.type] = exports.baseOpinion,
        _a);
});
define("modules/defaultattitudemodifiers/defaultAttitudeModifiers", ["require", "exports", "modules/englishlanguage/englishLanguage", "src/GameModuleInitializationPhase", "modules/defaultattitudemodifiers/attitudeModifierTemplates", "modules/defaultattitudemodifiers/attitudeModifierModuleScripts", "json!modules/defaultattitudemodifiers/moduleInfo.json"], function (require, exports, englishLanguage_1, GameModuleInitializationPhase_1, attitudeModifierTemplates_1, attitudeModifierModuleScripts_1, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultAttitudeModifiers = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.MapGen,
        supportedLanguages: [englishLanguage_1.englishLanguage],
        addToModuleData: function (moduleData) {
            moduleData.copyTemplates(attitudeModifierTemplates_1.attitudeModifierTemplates, "AttitudeModifiers");
            moduleData.scripts.add(attitudeModifierModuleScripts_1.attitudeModifierModuleScripts);
            return moduleData;
        },
    };
});
//# sourceMappingURL=index.js.map