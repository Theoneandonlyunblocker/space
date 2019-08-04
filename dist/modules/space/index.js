define("modules/space/abilities/abilities", ["require", "exports", "src/AbilityTargetDisplayData", "src/UnitAttributes", "src/targeting", "modules/space/battlevfx/templates/battleVfx", "modules/space/effectactions/effectActions", "modules/space/uniteffects/snipe"], function (require, exports, AbilityTargetDisplayData_1, UnitAttributes_1, targeting_1, BattleVfx, EffectActions, SnipeStatusEffects) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeFilteringUnitSelectFN(baseFN, filterFN) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return baseFN.apply(void 0, args).filter(filterFN);
        };
    }
    function activeUnitsFilter(unit) {
        return unit && unit.isActiveInBattle();
    }
    exports.closeAttack = {
        type: "closeAttack",
        displayName: "Close Attack",
        description: "Close range attack that hits adjacent targets in the same row",
        moveDelay: 90,
        actionsUse: 2,
        getPossibleTargets: function (user, battle) {
            return targeting_1.targetNextRow(user, battle).filter(function (unit) {
                return unit.battleStats.side !== user.battleStats.side;
            });
        },
        mainEffect: {
            id: "damage",
            executeAction: EffectActions.inflictDamage.bind(null, {
                baseDamage: 0.66,
                damageType: 0,
            }),
            getUnitsInArea: makeFilteringUnitSelectFN(targeting_1.areaRowNeighbors, activeUnitsFilter),
            getDisplayDataForTarget: targeting_1.makeGetAbilityTargetDisplayDataFN({
                areaFN: makeFilteringUnitSelectFN(targeting_1.areaRowNeighbors, activeUnitsFilter),
                targetType: AbilityTargetDisplayData_1.AbilityTargetType.Primary,
                targetEffect: AbilityTargetDisplayData_1.AbilityTargetEffect.Negative,
            }),
            vfx: BattleVfx.rocketAttack,
        },
    };
    exports.beamAttack = {
        type: "beamAttack",
        displayName: "Beam Attack",
        description: "Attack units in a line",
        moveDelay: 300,
        actionsUse: 1,
        getPossibleTargets: targeting_1.targetEnemies,
        mainEffect: {
            id: "damage",
            executeAction: EffectActions.inflictDamage.bind(null, {
                baseDamage: 0.75,
                damageType: 1,
            }),
            getUnitsInArea: makeFilteringUnitSelectFN(targeting_1.areaColumn, activeUnitsFilter),
            getDisplayDataForTarget: targeting_1.makeGetAbilityTargetDisplayDataFN({
                areaFN: makeFilteringUnitSelectFN(targeting_1.areaColumn, activeUnitsFilter),
                targetType: AbilityTargetDisplayData_1.AbilityTargetType.Primary,
                targetEffect: AbilityTargetDisplayData_1.AbilityTargetEffect.Negative,
            }),
            vfx: BattleVfx.beam,
        },
        targetCannotBeDiverted: true,
    };
    var bombAttackAreaFN = function (user, target, battle) {
        return targeting_1.areaOrthogonalNeighbors(user, target, battle).filter(function (unit) {
            return unit && unit.battleStats.side !== user.battleStats.side;
        });
    };
    exports.bombAttack = {
        type: "bombAttack",
        displayName: "Bomb Attack",
        description: "Ranged attack that hits all adjacent enemy units",
        moveDelay: 120,
        actionsUse: 1,
        getPossibleTargets: targeting_1.targetEnemies,
        mainEffect: {
            id: "damage",
            executeAction: EffectActions.inflictDamage.bind(null, {
                baseDamage: 0.5,
                damageType: 0,
            }),
            getUnitsInArea: makeFilteringUnitSelectFN(bombAttackAreaFN, activeUnitsFilter),
            getDisplayDataForTarget: targeting_1.makeGetAbilityTargetDisplayDataFN({
                areaFN: makeFilteringUnitSelectFN(bombAttackAreaFN, activeUnitsFilter),
                targetType: AbilityTargetDisplayData_1.AbilityTargetType.Primary,
                targetEffect: AbilityTargetDisplayData_1.AbilityTargetEffect.Negative,
            }),
            vfx: BattleVfx.rocketAttack,
        },
    };
    exports.guardRow = {
        type: "guardRow",
        displayName: "Guard Row",
        description: "Protect allies in the same row and boost defence against physical attacks",
        moveDelay: 100,
        actionsUse: 1,
        getPossibleTargets: targeting_1.targetSelf,
        mainEffect: {
            id: "addGuard",
            executeAction: EffectActions.addGuard.bind(null, {
                perAttribute: {
                    intelligence: { flat: 20 },
                },
                coverage: 0,
            }),
            getUnitsInArea: targeting_1.areaSingle,
            getDisplayDataForTarget: targeting_1.makeGetAbilityTargetDisplayDataFN({
                areaFN: makeFilteringUnitSelectFN(targeting_1.areaRow, activeUnitsFilter),
                targetType: AbilityTargetDisplayData_1.AbilityTargetType.Primary,
                targetEffect: AbilityTargetDisplayData_1.AbilityTargetEffect.Positive,
            }),
            vfx: BattleVfx.guard,
        },
        doesNotRemoveUserGuard: true,
    };
    exports.boardingHook = {
        type: "boardingHook",
        displayName: "Boarding Hook",
        description: "0.8x damage but increases target capture chance",
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
            vfx: BattleVfx.rocketAttack,
            attachedEffects: [
                {
                    id: "captureChance",
                    getUnitsInArea: targeting_1.areaSingle,
                    executeAction: EffectActions.increaseCaptureChance.bind(null, {
                        flat: 0.5,
                    }),
                },
                {
                    id: "counter",
                    getUnitsInArea: targeting_1.areaSingle,
                    executeAction: EffectActions.receiveCounterAttack.bind(null, {
                        baseDamage: 0.5,
                    }),
                },
            ],
        },
    };
    exports.debugAbility = {
        type: "debugAbility",
        displayName: "Debug Ability",
        description: "who knows what its going to do today",
        moveDelay: 0,
        actionsUse: 1,
        getPossibleTargets: targeting_1.targetAll,
        mainEffect: {
            id: "debugAbility",
            getUnitsInArea: targeting_1.areaSingle,
            getDisplayDataForTarget: targeting_1.makeGetAbilityTargetDisplayDataFN({
                areaFN: targeting_1.areaSingle,
                targetType: AbilityTargetDisplayData_1.AbilityTargetType.Primary,
                targetEffect: AbilityTargetDisplayData_1.AbilityTargetEffect.Positive,
            }),
            executeAction: function () { },
            vfx: BattleVfx.guard,
        },
    };
    exports.rangedAttack = {
        type: "rangedAttack",
        displayName: "Ranged Attack",
        description: "Standard ranged attack",
        moveDelay: 100,
        actionsUse: 1,
        getPossibleTargets: targeting_1.targetEnemies,
        mainEffect: {
            id: "damage",
            executeAction: EffectActions.inflictDamage.bind(null, {
                baseDamage: 1,
                damageType: 0,
            }),
            getUnitsInArea: targeting_1.areaSingle,
            getDisplayDataForTarget: targeting_1.makeGetAbilityTargetDisplayDataFN({
                areaFN: targeting_1.areaSingle,
                targetType: AbilityTargetDisplayData_1.AbilityTargetType.Primary,
                targetEffect: AbilityTargetDisplayData_1.AbilityTargetEffect.Negative,
            }),
            vfx: BattleVfx.rocketAttack,
            attachedEffects: [
                {
                    id: "counter",
                    executeAction: EffectActions.receiveCounterAttack.bind(null, {
                        baseDamage: 0.5,
                    }),
                    getUnitsInArea: targeting_1.areaSingle,
                },
            ],
        },
        defaultUpgrades: [
            {
                weight: 1,
                probabilityItems: [exports.bombAttack],
            },
            {
                weight: 1,
                probabilityItems: [exports.boardingHook],
            },
        ],
    };
    function makeSnipeTemplate(attribute) {
        var _a;
        var attributeName = UnitAttributes_1.UnitAttribute[attribute];
        var capitalizedAttributeName = attributeName[0].toUpperCase() + attributeName.slice(1);
        var key = "snipe" + capitalizedAttributeName;
        var displayName = "Snipe: " + capitalizedAttributeName;
        var description = "Deals damage and lowers target " + attributeName;
        var statusEffectTemplateByAttribute = (_a = {},
            _a[UnitAttributes_1.UnitAttribute.Attack] = SnipeStatusEffects.snipeAttack,
            _a[UnitAttributes_1.UnitAttribute.Defence] = SnipeStatusEffects.snipeDefence,
            _a[UnitAttributes_1.UnitAttribute.Intelligence] = SnipeStatusEffects.snipeIntelligence,
            _a[UnitAttributes_1.UnitAttribute.Speed] = SnipeStatusEffects.snipeSpeed,
            _a);
        return ({
            type: key,
            displayName: displayName,
            description: description,
            moveDelay: 100,
            actionsUse: 1,
            getPossibleTargets: targeting_1.targetEnemies,
            mainEffect: {
                id: "damage",
                executeAction: EffectActions.inflictDamage.bind(null, {
                    baseDamage: 0.6,
                    damageType: 0,
                }),
                getUnitsInArea: targeting_1.areaSingle,
                getDisplayDataForTarget: targeting_1.makeGetAbilityTargetDisplayDataFN({
                    areaFN: targeting_1.areaSingle,
                    targetType: AbilityTargetDisplayData_1.AbilityTargetType.Primary,
                    targetEffect: AbilityTargetDisplayData_1.AbilityTargetEffect.Negative,
                }),
                vfx: BattleVfx[key],
                attachedEffects: [
                    {
                        id: "statusEffect",
                        executeAction: EffectActions.addStatusEffect.bind(null, {
                            template: statusEffectTemplateByAttribute[attribute],
                            duration: -1,
                        }),
                        getUnitsInArea: targeting_1.areaSingle,
                    },
                ],
            },
        });
    }
    exports.snipeAttack = makeSnipeTemplate(UnitAttributes_1.UnitAttribute.Attack);
    exports.snipeDefence = makeSnipeTemplate(UnitAttributes_1.UnitAttribute.Defence);
    exports.snipeIntelligence = makeSnipeTemplate(UnitAttributes_1.UnitAttribute.Intelligence);
    exports.snipeSpeed = makeSnipeTemplate(UnitAttributes_1.UnitAttribute.Speed);
    exports.standBy = {
        type: "standBy",
        displayName: "Standby",
        description: "Skip a turn but next one comes faster",
        moveDelay: 50,
        actionsUse: 1,
        getPossibleTargets: targeting_1.targetSelf,
        mainEffect: {
            id: "standBy",
            getUnitsInArea: targeting_1.areaSingle,
            getDisplayDataForTarget: function () { return {}; },
            executeAction: function () { },
            vfx: {
                duration: 750,
            },
        },
        doesNotRemoveUserGuard: true,
        AiEvaluationPriority: 0.6,
        AiScoreMultiplier: 0.6,
        disableInAiBattles: true,
    };
});
define("modules/space/effectactions/AbilityEffectActionWithData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("modules/space/effectactions/damageAdjustment", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getAdjustedTroopSize(unit) {
        var minEffectiveHealth = Math.max(unit.currentHealth, unit.battleStats.lastHealthBeforeReceivingDamage / 3);
        var effectiveHealth = unit.template.isSquadron ?
            minEffectiveHealth :
            Math.min(unit.maxHealth, minEffectiveHealth + unit.maxHealth * 0.2);
        if (effectiveHealth <= 500) {
            return effectiveHealth;
        }
        else if (effectiveHealth <= 2000) {
            return effectiveHealth / 2 + 250;
        }
        else {
            return effectiveHealth / 4 + 750;
        }
    }
    exports.getAdjustedTroopSize = getAdjustedTroopSize;
    function getAttackDamageIncrease(unit, damageType) {
        var attackStat;
        var attackFactor;
        switch (damageType) {
            case 0:
                {
                    attackStat = unit.attributes.attack;
                    attackFactor = 0.1;
                    break;
                }
            case 1:
                {
                    attackStat = unit.attributes.intelligence;
                    attackFactor = 0.1;
                    break;
                }
        }
        var adjustedTroopSize = getAdjustedTroopSize(unit);
        var increaseFromStats = attackStat * attackFactor;
        var damageIncrease = (1 + increaseFromStats) * adjustedTroopSize;
        return damageIncrease;
    }
    exports.getAttackDamageIncrease = getAttackDamageIncrease;
    function getReducedDamageFactor(unit, damageType) {
        var defenceStat;
        var defenceFactor;
        var finalDamageMultiplier = 1;
        switch (damageType) {
            case 0:
                {
                    defenceStat = unit.attributes.defence;
                    defenceFactor = 0.045;
                    var guardAmount = Math.min(unit.battleStats.guardAmount, 100);
                    finalDamageMultiplier = 1 - guardAmount / 200;
                    break;
                }
            case 1:
                {
                    defenceStat = unit.attributes.intelligence;
                    defenceFactor = 0.045;
                    break;
                }
        }
        var reductionFromStats = defenceStat * defenceFactor;
        var damageReduction = (1 - reductionFromStats) * finalDamageMultiplier;
        return damageReduction;
    }
    exports.getReducedDamageFactor = getReducedDamageFactor;
    function getAdjustedDamage(user, target, baseDamage, damageType) {
        var dealtDamage = baseDamage * getAttackDamageIncrease(user, damageType);
        var reducedDamage = dealtDamage * getReducedDamageFactor(target, damageType);
        var clampedDamage = Math.min(reducedDamage, target.currentHealth);
        return clampedDamage;
    }
    exports.getAdjustedDamage = getAdjustedDamage;
});
define("modules/space/effectactions/effectActions", ["require", "exports", "src/FlatAndMultiplierAdjustment", "src/StatusEffect", "src/utility", "modules/space/effectactions/ResultType", "modules/space/effectactions/damageAdjustment", "modules/space/effectactions/healthAdjustment"], function (require, exports, FlatAndMultiplierAdjustment_1, StatusEffect_1, utility_1, ResultType_1, damageAdjustment_1, healthAdjustment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.inflictDamage = function (data, user, target, battle, executedEffectsResult) {
        var adjustedDamage = damageAdjustment_1.getAdjustedDamage(user, target, data.baseDamage, data.damageType);
        if (!executedEffectsResult[ResultType_1.ResultType.HealthChanged]) {
            executedEffectsResult[ResultType_1.ResultType.HealthChanged] = 0;
        }
        executedEffectsResult[ResultType_1.ResultType.HealthChanged] -= adjustedDamage;
        target.receiveDamage(adjustedDamage);
    };
    exports.addGuard = function (data, user, target, battle, executedEffectsResult) {
        var flat = data.flat || 0;
        var perAttribute = data.perAttribute || {};
        var guardAmount = user.attributes.modifyValueByAttributes(flat, perAttribute);
        target.addGuard(guardAmount, data.coverage);
    };
    exports.receiveCounterAttack = function (data, user, target, battle, executedEffectsResult) {
        var counterStrength = target.getCounterAttackStrength();
        if (counterStrength) {
            exports.inflictDamage({
                baseDamage: data.baseDamage * counterStrength,
                damageType: 0,
            }, target, user, battle, executedEffectsResult);
        }
    };
    exports.increaseCaptureChance = function (data, user, target, battle, executedEffectsResult) {
        var baseCaptureChance = target.battleStats.captureChance;
        target.battleStats.captureChance = FlatAndMultiplierAdjustment_1.applyFlatAndMultiplierAdjustments(baseCaptureChance, data);
    };
    exports.addStatusEffect = function (data, user, target, battle, executedEffectsResult) {
        target.addStatusEffect(new StatusEffect_1.StatusEffect({
            template: data.template,
            turnsToStayActiveFor: data.duration,
            sourceUnit: user,
        }));
    };
    exports.adjustHealth = function (data, user, target, battle, executedEffectsResult) {
        var healAmount = healthAdjustment_1.calculateHealthAdjustment(user, target, data);
        if (data.executedEffectsResultAdjustment) {
            healAmount += data.executedEffectsResultAdjustment(executedEffectsResult);
        }
        var minAdjustment = -target.currentHealth;
        var maxAdjustment = target.maxHealth - target.currentHealth;
        var clamped = utility_1.clamp(healAmount, minAdjustment, maxAdjustment);
        if (!executedEffectsResult[ResultType_1.ResultType.HealthChanged]) {
            executedEffectsResult[ResultType_1.ResultType.HealthChanged] = 0;
        }
        executedEffectsResult[ResultType_1.ResultType.HealthChanged] += clamped;
        target.addHealth(clamped);
    };
    exports.adjustCurrentAndMaxHealth = function (data, user, target, battle, executedEffectsResult) {
        var healAmount = healthAdjustment_1.calculateHealthAdjustment(user, target, data);
        if (data.executedEffectsResultAdjustment) {
            healAmount += data.executedEffectsResultAdjustment(executedEffectsResult);
        }
        target.addMaxHealth(healAmount);
        target.addHealth(healAmount);
    };
    exports.adjustBattleEvaluationAdjustment = function (data, user, target, battle, executedEffectsResult) {
        var adjustment = user.attributes.modifyValueByAttributes(data.flat, data.perAttribute);
        var sign = target.battleStats.side === "side1" ? 1 : -1;
        battle.evaluationAdjustment += adjustment * sign;
    };
    exports.adjustDefenderBattleEvaluationAdjustment = function (data, user, target, battle, executedEffectsResult) {
        var defender = battle.battleData.defender.player;
        var defendingSide = battle.getSideForPlayer(defender);
        var sign = defendingSide === "side1" ? 1 : -1;
        battle.evaluationAdjustment += data.amount * sign;
    };
});
define("modules/space/effectactions/healthAdjustment", ["require", "exports", "modules/space/effectactions/damageAdjustment"], function (require, exports, damageAdjustment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function calculateHealthAdjustment(user, target, data) {
        var healAmount = 0;
        if (data.flat) {
            healAmount += data.flat;
        }
        if (data.maxHealthPercentage) {
            healAmount += target.maxHealth * data.maxHealthPercentage;
        }
        if (data.perUserUnit) {
            healAmount += data.perUserUnit * damageAdjustment_1.getAttackDamageIncrease(user, 1);
        }
        return healAmount;
    }
    exports.calculateHealthAdjustment = calculateHealthAdjustment;
});
define("modules/space/effectactions/ResultType", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ResultType;
    (function (ResultType) {
        ResultType[ResultType["HealthChanged"] = 0] = "HealthChanged";
    })(ResultType = exports.ResultType || (exports.ResultType = {}));
});
define("modules/space/passiveskills/passiveSkills", ["require", "exports", "modules/space/uniteffects/autoHeal", "modules/space/uniteffects/poisoned", "src/BattlePrepFormationValidity", "modules/space/effectactions/effectActions"], function (require, exports, autoHeal_1, poisoned_1, BattlePrepFormationValidity_1, EffectActions) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.autoHeal = {
        type: "autoHeal",
        displayName: "Auto heal",
        description: "Restore 50 health after every action",
        atBattleStart: [
            {
                id: "addStatusEffect",
                getUnitsInArea: function (user) { return [user]; },
                executeAction: EffectActions.addStatusEffect.bind(null, {
                    duration: -1,
                    template: autoHeal_1.autoHeal,
                }),
            },
        ],
    };
    exports.overdrive = {
        type: "overdrive",
        displayName: "Overdrive",
        description: "Gives buffs at battle start but become poisoned",
        atBattleStart: [
            {
                id: "addStatusEffect",
                getUnitsInArea: function (user) { return [user]; },
                executeAction: EffectActions.addStatusEffect.bind(null, {
                    duration: 2,
                    template: poisoned_1.poisoned,
                }),
            },
        ],
    };
    var initialGuardStrength = 50;
    exports.initialGuard = {
        type: "initialGuard",
        displayName: "Initial Guard",
        description: "Adds initial guard",
        isHidden: true,
        atBattleStart: [
            {
                id: "addStatusEffect",
                getUnitsInArea: function (user) { return [user]; },
                executeAction: EffectActions.addGuard.bind(null, {
                    coverage: 0,
                    flat: initialGuardStrength,
                }),
            },
        ],
        inBattlePrep: [
            {
                onAdd: function (user, battlePrep) {
                    EffectActions.addGuard({
                        coverage: 0,
                        flat: initialGuardStrength,
                    }, user, user, null, {});
                },
                onRemove: function (user, battlePrep) {
                    user.removeGuard(initialGuardStrength);
                },
            },
        ],
    };
    exports.medic = {
        type: "medic",
        displayName: "Medic",
        description: "Heals all units in same star to full at turn start",
        atTurnStart: [
            function (user) {
                var star = user.fleet.location;
                var allFriendlyUnits = star.getUnits(function (player) { return player === user.fleet.player; });
                for (var i = 0; i < allFriendlyUnits.length; i++) {
                    allFriendlyUnits[i].addHealth(allFriendlyUnits[i].maxHealth);
                }
            },
        ],
    };
    function makeWarpJammerValidityModifier(user) {
        return {
            sourceType: BattlePrepFormationValidity_1.FormationValidityModifierSourceType.PassiveAbility,
            effect: {
                minUnits: 1,
            },
            sourcePassiveAbility: {
                unit: user,
                abilityTemplate: exports.warpJammer,
            },
        };
    }
    exports.warpJammer = {
        type: "warpJammer",
        displayName: "Warp Jammer",
        description: "Forces an extra unit to defend when starting a battle",
        inBattlePrep: [
            {
                onAdd: function (user, battlePrep) {
                    var isAttackingSide = user.fleet.player === battlePrep.attacker;
                    if (isAttackingSide) {
                        battlePrep.defenderFormation.addValidityModifier(makeWarpJammerValidityModifier(user));
                    }
                },
                onRemove: function (user, battlePrep) {
                    var isAttackingSide = user.fleet.player === battlePrep.attacker;
                    if (isAttackingSide) {
                        battlePrep.defenderFormation.removeValidityModifier(makeWarpJammerValidityModifier(user));
                    }
                },
            },
        ],
        defaultUpgrades: [
            {
                flatProbability: 1,
                probabilityItems: [exports.medic],
            },
        ],
    };
});
define("modules/space/ruleSet", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ruleSet = {
        units: {
            baseAttributeValue: 5,
            attributeVariance: 1.2,
            baseHealthValue: 250,
            healthVariance: 50,
        },
        manufactory: {
            startingCapacity: 1,
            maxCapacity: 3,
            buildCost: 1000,
        },
        research: {
            baseResearchPoints: 3000,
            baseResearchPointsPerStar: 0,
        },
        battle: {
            rowsPerFormation: 2,
            cellsPerRow: 3,
            maxUnitsPerSide: 6,
            maxUnitsPerRow: 3,
            baseMaxCapturedUnits: 1,
            absoluteMaxCapturedUnits: 3,
            baseUnitCaptureChance: 0.1,
            humanUnitDeathChance: 0.65,
            aiUnitDeathChance: 0.65,
            independentUnitDeathChance: 1.0,
            loserUnitExtraDeathChance: 0.35,
        },
        vision: {
            baseStarVisionRange: 1,
            baseStarDetectionRange: 0,
        }
    };
});
define("modules/space/space", ["require", "exports", "src/GameModuleInitializationPhase", "modules/englishlanguage/englishLanguage", "modules/space/ruleSet", "modules/space/abilities/abilities", "modules/space/passiveskills/passiveSkills", "modules/space/terrains/terrains", "modules/space/uniteffects/unitEffectTemplates", "modules/space/backgrounds/spaceBackgrounds", "modules/space/battlevfx/spaceBattleVfx", "modules/space/buildings/spaceBuildings", "modules/space/items/spaceItems", "modules/space/mapgen/spaceMapGen", "modules/space/mapmodes/spaceMapModes", "modules/space/races/spaceRaces", "modules/space/technologies/spaceTechnologies", "modules/space/units/spaceUnits", "modules/space/resources/spaceResources", "json!modules/space/moduleInfo.json"], function (require, exports, GameModuleInitializationPhase_1, englishLanguage_1, ruleSet_1, AbilityTemplates, PassiveSkillTemplates, TerrainTemplates, unitEffectTemplates_1, spaceBackgrounds_1, spaceBattleVfx_1, spaceBuildings_1, spaceItems_1, spaceMapGen_1, spaceMapModes_1, spaceRaces_1, spaceTechnologies_1, spaceUnits_1, spaceResources_1, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.space = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.GameSetup,
        supportedLanguages: [englishLanguage_1.englishLanguage],
        subModules: [
            spaceBackgrounds_1.spaceBackgrounds,
            spaceBattleVfx_1.spaceBattleVfx,
            spaceBuildings_1.spaceBuildings,
            spaceItems_1.spaceItems,
            spaceMapGen_1.spaceMapGen,
            spaceMapModes_1.spaceMapModes,
            spaceRaces_1.spaceRaces,
            spaceTechnologies_1.spaceTechnologies,
            spaceUnits_1.spaceUnits,
            spaceResources_1.spaceResources,
        ],
        addToModuleData: function (moduleData) {
            moduleData.copyTemplates(AbilityTemplates, "Abilities");
            moduleData.copyTemplates(PassiveSkillTemplates, "PassiveSkills");
            moduleData.copyTemplates(TerrainTemplates, "Terrains");
            moduleData.copyTemplates(unitEffectTemplates_1.unitEffectTemplates, "UnitEffects");
            moduleData.ruleSet = ruleSet_1.ruleSet;
        }
    };
});
define("modules/space/terrains/terrains", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.noneTerrain = {
        type: "noneTerrain",
        displayName: "None",
    };
    exports.asteroidsTerrain = {
        type: "asteroidsTerrain",
        displayName: "Asteroids",
    };
});
define("modules/space/uniteffects/autoHeal", ["require", "exports", "modules/space/effectactions/effectActions"], function (require, exports, effectActions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.autoHeal = {
        type: "autoHeal",
        displayName: "Auto heal",
        description: "Restore 50 health after every action",
        afterAbilityUse: [
            {
                id: "heal",
                getUnitsInArea: function (user) { return [user]; },
                executeAction: effectActions_1.adjustHealth.bind(null, {
                    flat: 50,
                }),
                trigger: function (user) { return user.currentHealth < user.maxHealth; },
            },
        ],
    };
});
define("modules/space/uniteffects/poisoned", ["require", "exports", "modules/space/effectactions/effectActions"], function (require, exports, effectActions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.poisoned = {
        type: "poisoned",
        displayName: "Poisoned",
        description: "-10% max health per turn",
        attributes: {
            attack: {
                flat: 9,
            },
            defence: {
                flat: 9,
            },
            speed: {
                flat: 9,
            },
        },
        afterAbilityUse: [
            {
                id: "removeHealth",
                getUnitsInArea: function (user, target, battle) { return [user]; },
                executeAction: effectActions_1.adjustHealth.bind(null, {
                    maxHealthPercentage: -0.1,
                }),
                vfx: {
                    duration: 1200,
                    userOverlay: function (params) {
                        var canvas = document.createElement("canvas");
                        canvas.width = params.width;
                        canvas.height = params.height;
                        var ctx = canvas.getContext("2d");
                        if (!ctx) {
                            throw new Error("Couldn't get context");
                        }
                        else {
                            ctx.fillStyle = "rgba(30, 150, 30, 0.5)";
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                        }
                        return canvas;
                    },
                },
            },
        ],
    };
});
define("modules/space/uniteffects/snipe", ["require", "exports", "src/UnitAttributes"], function (require, exports, UnitAttributes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeSnipeStatusEffect(attribute) {
        var _a;
        var attributeName = UnitAttributes_1.UnitAttribute[attribute];
        var capitalizedAttributeName = attributeName[0].toUpperCase() + attributeName.slice(1);
        var key = "snipe" + capitalizedAttributeName;
        var displayName = "Snipe: " + capitalizedAttributeName;
        var attributeAdjustment = {
            multiplicativeMultiplier: -0.5,
        };
        return ({
            type: key,
            displayName: displayName,
            attributes: (_a = {},
                _a[attributeName] = attributeAdjustment,
                _a),
        });
    }
    exports.snipeAttack = makeSnipeStatusEffect(UnitAttributes_1.UnitAttribute.Attack);
    exports.snipeDefence = makeSnipeStatusEffect(UnitAttributes_1.UnitAttribute.Defence);
    exports.snipeIntelligence = makeSnipeStatusEffect(UnitAttributes_1.UnitAttribute.Intelligence);
    exports.snipeSpeed = makeSnipeStatusEffect(UnitAttributes_1.UnitAttribute.Speed);
});
define("modules/space/uniteffects/unitEffectTemplates", ["require", "exports", "modules/space/uniteffects/autoHeal", "modules/space/uniteffects/poisoned", "modules/space/uniteffects/snipe"], function (require, exports, autoHeal_1, poisoned_1, snipe_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unitEffectTemplates = (_a = {},
        _a[autoHeal_1.autoHeal.type] = autoHeal_1.autoHeal,
        _a[poisoned_1.poisoned.type] = poisoned_1.poisoned,
        _a[snipe_1.snipeAttack.type] = snipe_1.snipeAttack,
        _a[snipe_1.snipeDefence.type] = snipe_1.snipeDefence,
        _a[snipe_1.snipeIntelligence.type] = snipe_1.snipeIntelligence,
        _a[snipe_1.snipeSpeed.type] = snipe_1.snipeSpeed,
        _a);
});
//# sourceMappingURL=index.js.map