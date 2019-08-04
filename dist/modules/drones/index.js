define("modules/drones/abilities", ["require", "exports", "src/AbilityTargetDisplayData", "src/targeting", "modules/space/battlevfx/templates/battleVfx", "modules/space/effectactions/ResultType", "modules/space/effectactions/effectActions", "modules/drones/unitEffects", "modules/drones/battlevfx/templates"], function (require, exports, AbilityTargetDisplayData_1, targeting_1, battleVfx_1, ResultType_1, EffectActions, DroneStatusEffects, DroneBattleVfx) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assimilate = {
        type: "assimilate",
        displayName: "Assimilate",
        description: "Deal damage and increase own troop size by 10% of damage dealt",
        moveDelay: 100,
        actionsUse: 1,
        getPossibleTargets: targeting_1.targetEnemies,
        mainEffect: {
            id: "damage",
            executeAction: EffectActions.inflictDamage.bind(null, {
                baseDamage: 0.8,
                damageType: 0,
            }),
            getUnitsInArea: targeting_1.areaSingle,
            getDisplayDataForTarget: targeting_1.makeGetAbilityTargetDisplayDataFN({
                areaFN: targeting_1.areaSingle,
                targetType: AbilityTargetDisplayData_1.AbilityTargetType.Primary,
                targetEffect: AbilityTargetDisplayData_1.AbilityTargetEffect.Negative,
            }),
            vfx: DroneBattleVfx.assimilate,
            attachedEffects: [
                {
                    id: "increaseUserHealth",
                    getUnitsInArea: function (user) { return [user]; },
                    getDisplayDataForTarget: targeting_1.makeGetAbilityTargetDisplayDataFN({
                        areaFN: function (user) { return [user]; },
                        targetType: AbilityTargetDisplayData_1.AbilityTargetType.Primary,
                        targetEffect: AbilityTargetDisplayData_1.AbilityTargetEffect.Positive,
                    }),
                    executeAction: EffectActions.adjustCurrentAndMaxHealth.bind(null, {
                        executedEffectsResultAdjustment: function (executedEffectsResult) {
                            var damageDealt = executedEffectsResult[ResultType_1.ResultType.HealthChanged] || 0;
                            return damageDealt * -0.1;
                        },
                    }),
                },
            ],
        },
    };
    exports.merge = {
        type: "merge",
        displayName: "Merge",
        description: "Transfer up to 25% of own current health to target ally and increase target stats",
        moveDelay: 100,
        actionsUse: 1,
        getPossibleTargets: targeting_1.targetAllies,
        mainEffect: {
            id: "removeOwnHealth",
            executeAction: EffectActions.adjustHealth.bind(null, {
                maxHealthPercentage: -0.25,
            }),
            getUnitsInArea: function (user) { return [user]; },
            getDisplayDataForTarget: targeting_1.makeGetAbilityTargetDisplayDataFN({
                areaFN: function (user) { return [user]; },
                targetType: AbilityTargetDisplayData_1.AbilityTargetType.Primary,
                targetEffect: AbilityTargetDisplayData_1.AbilityTargetEffect.Negative,
            }),
            vfx: battleVfx_1.placeholder,
        },
        secondaryEffects: [
            {
                id: "addStatusEffect",
                getUnitsInArea: targeting_1.areaSingle,
                getDisplayDataForTarget: targeting_1.makeGetAbilityTargetDisplayDataFN({
                    areaFN: targeting_1.areaSingle,
                    targetType: AbilityTargetDisplayData_1.AbilityTargetType.Primary,
                    targetEffect: AbilityTargetDisplayData_1.AbilityTargetEffect.Positive,
                }),
                trigger: function (user, target, battle, executedEffectsResult) {
                    return Boolean(executedEffectsResult[ResultType_1.ResultType.HealthChanged]);
                },
                executeAction: EffectActions.addStatusEffect.bind(null, {
                    duration: -1,
                    template: DroneStatusEffects.merge,
                }),
            },
            {
                id: "addTargetHealth",
                getUnitsInArea: targeting_1.areaSingle,
                trigger: function (user, target, battle, executedEffectsResult) {
                    return Boolean(executedEffectsResult[ResultType_1.ResultType.HealthChanged]);
                },
                executeAction: EffectActions.adjustHealth.bind(null, {
                    executedEffectsResultAdjustment: function (executedEffectsResult) {
                        return -executedEffectsResult[ResultType_1.ResultType.HealthChanged];
                    },
                }),
            },
        ],
    };
    exports.infest = {
        type: "infest",
        displayName: "Infest",
        description: "Increase target capture chance and deal damage over time",
        moveDelay: 100,
        actionsUse: 1,
        getPossibleTargets: targeting_1.targetEnemies,
        mainEffect: {
            id: "addStatusEffect",
            getUnitsInArea: targeting_1.areaSingle,
            getDisplayDataForTarget: targeting_1.makeGetAbilityTargetDisplayDataFN({
                areaFN: targeting_1.areaSingle,
                targetType: AbilityTargetDisplayData_1.AbilityTargetType.Primary,
                targetEffect: AbilityTargetDisplayData_1.AbilityTargetEffect.Negative,
            }),
            executeAction: EffectActions.addStatusEffect.bind(null, {
                duration: 3,
                template: DroneStatusEffects.infest,
            }),
            vfx: battleVfx_1.placeholder,
            attachedEffects: [
                {
                    id: "increaseCaptureChance",
                    getUnitsInArea: targeting_1.areaSingle,
                    executeAction: EffectActions.increaseCaptureChance.bind(null, {
                        flat: 0.4,
                    }),
                },
            ],
        },
    };
    exports.repair = {
        type: "repair",
        displayName: "Repair",
        description: "Restore health to one ally",
        moveDelay: 100,
        actionsUse: 1,
        getPossibleTargets: targeting_1.targetAllies,
        mainEffect: {
            id: "heal",
            getUnitsInArea: targeting_1.areaSingle,
            getDisplayDataForTarget: targeting_1.makeGetAbilityTargetDisplayDataFN({
                areaFN: targeting_1.areaSingle,
                targetType: AbilityTargetDisplayData_1.AbilityTargetType.Primary,
                targetEffect: AbilityTargetDisplayData_1.AbilityTargetEffect.Positive,
            }),
            executeAction: EffectActions.adjustHealth.bind(null, {
                perUserUnit: 0.5,
            }),
            vfx: battleVfx_1.placeholder,
        },
    };
    exports.massRepair = {
        type: "massRepair",
        displayName: "Mass Repair",
        description: "Restore health to all allies",
        moveDelay: 100,
        actionsUse: 1,
        getPossibleTargets: targeting_1.targetAllies,
        mainEffect: {
            id: "heal",
            getUnitsInArea: function (user, target, battle) {
                return targeting_1.areaAll(user, target, battle).filter(function (unit) {
                    return unit && unit.isActiveInBattle && unit.battleStats.side === user.battleStats.side;
                });
            },
            getDisplayDataForTarget: targeting_1.makeGetAbilityTargetDisplayDataFN({
                areaFN: function (user, target, battle) {
                    return targeting_1.areaAll(user, target, battle).filter(function (unit) {
                        return unit && unit.isActiveInBattle && unit.battleStats.side === user.battleStats.side;
                    });
                },
                targetType: AbilityTargetDisplayData_1.AbilityTargetType.Primary,
                targetEffect: AbilityTargetDisplayData_1.AbilityTargetEffect.Positive,
            }),
            executeAction: EffectActions.adjustHealth.bind(null, {
                perUserUnit: 0.33,
            }),
            vfx: battleVfx_1.placeholder,
        },
    };
    exports.abilityTemplates = (_a = {},
        _a[exports.assimilate.type] = exports.assimilate,
        _a[exports.merge.type] = exports.merge,
        _a[exports.infest.type] = exports.infest,
        _a[exports.repair.type] = exports.repair,
        _a[exports.massRepair.type] = exports.massRepair,
        _a);
});
define("modules/drones/battlevfx/drawingfunctions/assimilate", ["require", "exports", "modules/space/battlevfx/drawingfunctions/vfxfragments/Absorb", "modules/space/effectactions/ResultType"], function (require, exports, Absorb_1, ResultType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getParticleCount(props) {
        var damageDealt = props.abilityUseEffect ?
            -1 * props.abilityUseEffect.executedEffectsResult[ResultType_1.ResultType.HealthChanged] :
            400;
        return Math.log(damageDealt) * 20;
    }
    function assimilate(props) {
        var offsetUserData = props.user.drawingFunctionData.normalizeForBattleVfx(props.userOffset, props.width, "user");
        var offsetTargetData = props.target.drawingFunctionData.normalizeForBattleVfx(props.targetOffset, props.width, "target");
        var container = new PIXI.Container();
        if (!props.facingRight) {
            container.x = props.width;
            container.scale.x = -1;
        }
        var asborbFragment = new Absorb_1.Absorb({
            getParticleDisplayObject: function (particle, color) {
                var graphics = new PIXI.Graphics();
                graphics.lineStyle(0);
                graphics.beginFill(color.getHex(), 1);
                graphics.drawRect(-2, -2, 4, 4);
                graphics.endFill();
                return graphics;
            },
            duration: props.duration,
            onEnd: end,
            particleCount: getParticleCount(props),
        });
        asborbFragment.draw(offsetUserData, offsetTargetData, props.renderer);
        container.addChild(asborbFragment.displayObject);
        var animationHandle;
        var hasEnded = false;
        function end() {
            hasEnded = true;
            cancelAnimationFrame(animationHandle);
            props.triggerEnd();
        }
        var fallbackAnimationStopTime = props.duration * 1.5;
        function animate() {
            var elapsedTime = Date.now() - startTime;
            var relativeTime = elapsedTime / props.duration;
            asborbFragment.animate(relativeTime);
            if (!hasEnded) {
                animationHandle = requestAnimationFrame(animate);
            }
            if (!hasEnded && elapsedTime > fallbackAnimationStopTime) {
                end();
            }
        }
        props.triggerStart(container);
        props.triggerEffect();
        var startTime = Date.now();
        animationHandle = requestAnimationFrame(animate);
    }
    exports.assimilate = assimilate;
});
define("modules/drones/battlevfx/templates", ["require", "exports", "modules/drones/battlevfx/drawingfunctions/assimilate"], function (require, exports, assimilate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assimilate = {
        duration: 2500,
        vfxWillTriggerEffect: true,
        battleOverlay: assimilate_1.assimilate,
    };
});
define("modules/drones/drones", ["require", "exports", "modules/englishlanguage/englishLanguage", "src/GameModuleInitializationPhase", "modules/drones/abilities", "modules/drones/raceTemplate", "modules/drones/unitEffects", "modules/drones/unitTemplates", "modules/drones/battlevfx/templates", "json!modules/drones/moduleInfo.json"], function (require, exports, englishLanguage_1, GameModuleInitializationPhase_1, abilities_1, raceTemplate_1, unitEffects_1, unitTemplates_1, battleVfxTemplates, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.drones = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.GameSetup,
        supportedLanguages: [englishLanguage_1.englishLanguage],
        addToModuleData: function (moduleData) {
            moduleData.copyTemplates(abilities_1.abilityTemplates, "Abilities");
            moduleData.copyTemplates(raceTemplate_1.raceTemplates, "Races");
            moduleData.copyTemplates(unitEffects_1.unitEffectTemplates, "UnitEffects");
            moduleData.copyTemplates(unitTemplates_1.unitTemplates, "Units");
            moduleData.copyTemplates(battleVfxTemplates, "BattleVfx");
            return moduleData;
        },
    };
});
define("modules/drones/raceTemplate", ["require", "exports", "src/Name", "src/utility", "modules/common/distributionGroups", "modules/common/generateIndependentFleets", "modules/common/generateIndependentPlayer", "modules/defaultai/mapai/DefaultAiConstructor", "modules/drones/units/droneBase", "modules/drones/units/droneCommander", "modules/drones/units/droneSwarm"], function (require, exports, Name_1, utility_1, distributionGroups_1, generateIndependentFleets_1, generateIndependentPlayer_1, DefaultAiConstructor_1, droneBase_1, droneCommander_1, droneSwarm_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.drones = {
        type: "drones",
        displayName: new Name_1.Name("Drones", true),
        description: "",
        distributionData: {
            weight: 1,
            distributionGroups: [distributionGroups_1.distributionGroups.common, distributionGroups_1.distributionGroups.rare],
        },
        isNotPlayable: true,
        getBuildableBuildings: function () { return []; },
        getBuildableItems: function () { return []; },
        getBuildableUnits: function () {
            return [
                droneSwarm_1.droneSwarm,
                droneCommander_1.droneCommander,
                droneBase_1.droneBase,
            ];
        },
        getUnitName: function (unitTemplate) {
            return unitTemplate.displayName + " #" + utility_1.randInt(0, 20000);
        },
        getUnitPortrait: function (unitTemplate, allTemplates) {
            return utility_1.getRandomProperty(allTemplates);
        },
        generateIndependentPlayer: function (emblemTemplates) {
            return generateIndependentPlayer_1.generateIndependentPlayer(exports.drones);
        },
        generateIndependentFleets: function (player, location, globalStrength, localStrength, maxUnitsPerSideInBattle) {
            return generateIndependentFleets_1.generateIndependentFleets(exports.drones, player, location, globalStrength, localStrength, maxUnitsPerSideInBattle);
        },
        technologies: [],
        getAiTemplateConstructor: function (player) { return DefaultAiConstructor_1.defaultAiConstructor; },
    };
    exports.raceTemplates = (_a = {},
        _a[exports.drones.type] = exports.drones,
        _a);
});
define("modules/drones/unitEffects", ["require", "exports", "modules/space/effectactions/effectActions", "modules/space/battlevfx/templates/battleVfx"], function (require, exports, effectActions_1, battleVfx_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.infest = {
        type: "infest",
        displayName: "Infest",
        description: "Deal increasing damage at the end of every turn",
        afterAbilityUse: [
            {
                id: "damage",
                getUnitsInArea: function (user) { return [user]; },
                executeAction: function (user, target, battle, executedEffectsResult, sourceStatusEffect) {
                    var healthReductionForLastTick = 0.5;
                    var tick = sourceStatusEffect.turnsHasBeenActiveFor + 1;
                    var relativeTick = tick / sourceStatusEffect.turnsToStayActiveFor;
                    var healthToReduceThisTurn = healthReductionForLastTick / relativeTick;
                    effectActions_1.adjustHealth({ maxHealthPercentage: -healthToReduceThisTurn }, user, target, battle, executedEffectsResult);
                },
                vfx: battleVfx_1.placeholder,
            },
        ],
    };
    exports.merge = {
        type: "merge",
        displayName: "Merge",
        attributes: {
            attack: { flat: 1 },
            defence: { flat: 1 },
            intelligence: { flat: 1 },
            speed: { flat: 1 },
        },
    };
    exports.unitEffectTemplates = (_a = {},
        _a[exports.infest.type] = exports.infest,
        _a[exports.merge.type] = exports.merge,
        _a);
});
define("modules/drones/units/droneBase", ["require", "exports", "modules/common/unitArchetypes", "modules/space/units/defaultUnitDrawingFunction", "modules/space/abilities/abilities", "modules/common/distributionGroups", "modules/drones/abilities"], function (require, exports, unitArchetypes, defaultUnitDrawingFunction_1, CommonAbility, distributionGroups_1, DroneAbility) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.droneBase = {
        type: "droneBase",
        displayName: "Drone Base",
        description: "Base o drones",
        archetype: unitArchetypes.utility,
        getIconSrc: function () { return "img/placeholder.png"; },
        unitDrawingFN: defaultUnitDrawingFunction_1.makeDefaultUnitDrawingFunction({
            anchor: { x: 0.5, y: 0.5 },
            attackOriginPoint: { x: 0.75, y: 0.5 },
        }, "img/placeholder.png"),
        isSquadron: false,
        buildCost: 500,
        kind: "unit",
        maxHealthLevel: 1.0,
        maxMovePoints: 1,
        maxOffensiveBattlesPerTurn: 1,
        visionRange: 1,
        detectionRange: -1,
        attributeLevels: {
            attack: 0.7,
            defence: 0.9,
            intelligence: 0.8,
            speed: 0.6,
        },
        possibleAbilities: [
            {
                flatProbability: 1,
                probabilityItems: [
                    DroneAbility.assimilate,
                    CommonAbility.standBy,
                ],
            },
            {
                flatProbability: 1,
                probabilityItems: [
                    {
                        flatProbability: 0.5,
                        probabilityItems: [DroneAbility.repair],
                    },
                    {
                        flatProbability: 0.5,
                        probabilityItems: [DroneAbility.massRepair],
                    },
                ],
            },
        ],
        itemSlots: {},
        distributionData: {
            weight: 1,
            distributionGroups: [distributionGroups_1.distributionGroups.unique],
        },
    };
});
define("modules/drones/units/droneCommander", ["require", "exports", "modules/common/unitArchetypes", "modules/space/units/defaultUnitDrawingFunction", "modules/space/abilities/abilities", "modules/common/distributionGroups", "modules/drones/abilities"], function (require, exports, unitArchetypes, defaultUnitDrawingFunction_1, CommonAbility, distributionGroups_1, DroneAbility) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.droneCommander = {
        type: "droneCommander",
        displayName: "Drone Commander",
        description: "Commander o drones",
        archetype: unitArchetypes.utility,
        getIconSrc: function () { return "img/placeholder.png"; },
        unitDrawingFN: defaultUnitDrawingFunction_1.makeDefaultUnitDrawingFunction({
            anchor: { x: 0.5, y: 0.5 },
            attackOriginPoint: { x: 0.75, y: 0.5 },
        }, "img/placeholder.png"),
        isSquadron: false,
        buildCost: 200,
        kind: "unit",
        maxHealthLevel: 0.75,
        maxMovePoints: 1,
        maxOffensiveBattlesPerTurn: 1,
        visionRange: 1,
        detectionRange: -1,
        attributeLevels: {
            attack: 0.7,
            defence: 0.5,
            intelligence: 0.5,
            speed: 0.7,
        },
        possibleAbilities: [
            {
                flatProbability: 1,
                probabilityItems: [
                    DroneAbility.assimilate,
                    DroneAbility.repair,
                    CommonAbility.standBy,
                ],
            },
            {
                flatProbability: 0.25,
                probabilityItems: [DroneAbility.infest],
            },
        ],
        possibleLearnableAbilities: [
            {
                flatProbability: 1,
                probabilityItems: [DroneAbility.infest],
            },
        ],
        itemSlots: {},
        distributionData: {
            weight: 1,
            distributionGroups: [distributionGroups_1.distributionGroups.rare],
        },
    };
});
define("modules/drones/units/droneSwarm", ["require", "exports", "modules/common/unitArchetypes", "modules/space/units/defaultUnitDrawingFunction", "modules/space/abilities/abilities", "modules/common/distributionGroups", "modules/drones/abilities"], function (require, exports, unitArchetypes, defaultUnitDrawingFunction_1, CommonAbility, distributionGroups_1, DroneAbility) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.droneSwarm = {
        type: "droneSwarm",
        displayName: "Drone Swarm",
        description: "Swarm o drones",
        archetype: unitArchetypes.combat,
        getIconSrc: function () { return "img/placeholder.png"; },
        unitDrawingFN: defaultUnitDrawingFunction_1.makeDefaultUnitDrawingFunction({
            anchor: { x: 0.5, y: 0.5 },
            attackOriginPoint: { x: 0.75, y: 0.5 },
        }, "img/placeholder.png"),
        isSquadron: true,
        buildCost: 150,
        kind: "unit",
        maxHealthLevel: 0.6,
        maxMovePoints: 1,
        maxOffensiveBattlesPerTurn: 1,
        visionRange: 1,
        detectionRange: -1,
        attributeLevels: {
            attack: 0.6,
            defence: 0.4,
            intelligence: 0.4,
            speed: 0.6,
        },
        possibleAbilities: [
            {
                flatProbability: 1,
                probabilityItems: [
                    DroneAbility.assimilate,
                    CommonAbility.standBy,
                ],
            },
            {
                flatProbability: 0.25,
                probabilityItems: [DroneAbility.merge],
            },
        ],
        possibleLearnableAbilities: [
            {
                flatProbability: 1,
                probabilityItems: [DroneAbility.merge],
            },
        ],
        itemSlots: {},
        distributionData: {
            weight: 1,
            distributionGroups: [distributionGroups_1.distributionGroups.common],
        },
    };
});
define("modules/drones/unitTemplates", ["require", "exports", "modules/drones/units/droneBase", "modules/drones/units/droneCommander", "modules/drones/units/droneSwarm"], function (require, exports, droneBase_1, droneCommander_1, droneSwarm_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unitTemplates = (_a = {},
        _a[droneSwarm_1.droneSwarm.type] = droneSwarm_1.droneSwarm,
        _a[droneCommander_1.droneCommander.type] = droneCommander_1.droneCommander,
        _a[droneBase_1.droneBase.type] = droneBase_1.droneBase,
        _a);
});
//# sourceMappingURL=index.js.map