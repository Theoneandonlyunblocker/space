define("modules/defaultai/attachedUnitData", ["require", "exports", "src/ValuesByUnit", "src/utility"], function (require, exports, ValuesByUnit_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AttachedUnitDataManager = (function () {
        function AttachedUnitDataManager() {
            this.byUnit = new ValuesByUnit_1.ValuesByUnit();
        }
        AttachedUnitDataManager.prototype.get = function (unit) {
            if (!this.byUnit.has(unit)) {
                this.byUnit.set(unit, {});
            }
            return this.byUnit.get(unit);
        };
        AttachedUnitDataManager.prototype.set = function (unit, data) {
            if (this.byUnit.has(unit)) {
                var oldData = this.byUnit.get(unit);
                var mergedData = utility_1.shallowExtend(oldData, data);
                this.byUnit.set(unit, mergedData);
            }
            else {
                this.byUnit.set(unit, data);
            }
        };
        AttachedUnitDataManager.prototype.delete = function (unit) {
            this.byUnit.delete(unit);
        };
        AttachedUnitDataManager.prototype.deleteAll = function () {
            this.byUnit = new ValuesByUnit_1.ValuesByUnit();
        };
        return AttachedUnitDataManager;
    }());
    exports.attachedUnitData = new AttachedUnitDataManager();
    exports.attachedUnitDataScripts = {
        unit: {
            removeFromPlayer: [
                {
                    key: "removeFromFront",
                    priority: 0,
                    script: function (unit) {
                        var front = exports.attachedUnitData.get(unit).front;
                        if (front) {
                            front.removeUnit(unit);
                        }
                        exports.attachedUnitData.delete(unit);
                    },
                },
            ],
        },
    };
});
define("modules/defaultai/defaultAi", ["require", "exports", "modules/englishlanguage/englishLanguage", "src/GameModuleInitializationPhase", "modules/defaultai/mapai/DefaultAiConstructor", "modules/defaultai/attachedUnitData", "json!modules/defaultai/moduleInfo.json"], function (require, exports, englishLanguage_1, GameModuleInitializationPhase_1, DefaultAiConstructor_1, attachedUnitData_1, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultAi = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.GameStart,
        supportedLanguages: [englishLanguage_1.englishLanguage],
        addToModuleData: function (moduleData) {
            var _a;
            moduleData.copyTemplates((_a = {},
                _a[DefaultAiConstructor_1.defaultAiConstructor.type] = DefaultAiConstructor_1.defaultAiConstructor,
                _a), "AiTemplateConstructors");
            moduleData.scripts.add(attachedUnitData_1.attachedUnitDataScripts);
            return moduleData;
        },
    };
});
define("modules/defaultai/localization/en/tradeMessages", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tradeMessages = {
        initialOffer: [
            "What do you propose?",
        ],
        requestOffer: [
            "Please make an offer.",
        ],
        willingToAcceptOffer: [
            "Seems good to me.",
        ],
        notWillingToAcceptOffer: [
            "That won't work for us.",
            "We can't do that.",
        ],
        proposeOffer: [
            "How does this sound?",
            "Here's my offer.",
        ],
        afterAcceptedOffer: [
            "We accept your terms.",
        ],
        willingToAcceptGift: [
            "How generous. We'll gladly accept.",
        ],
        notWillingToAcceptDemand: [
            "Over my dead body.",
        ],
    };
});
define("modules/defaultai/localization/localize", ["require", "exports", "modules/englishlanguage/englishLanguage", "src/localization/Localizer", "modules/defaultai/localization/en/tradeMessages"], function (require, exports, englishLanguage_1, Localizer_1, tradeMessages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.localizer = new Localizer_1.Localizer("tradeMessages");
    exports.localizer.setAllMessages(tradeMessages_1.tradeMessages, englishLanguage_1.englishLanguage);
    exports.localize = exports.localizer.localize.bind(exports.localizer);
});
define("modules/defaultai/mapai/DefaultAi", ["require", "exports", "src/activeModuleData", "src/getNullFormation", "src/utility", "modules/defaultai/mapai/DiplomacyAi", "modules/defaultai/mapai/EconomicAi", "modules/defaultai/mapai/FrontsAi", "modules/defaultai/mapai/GrandStrategyAi", "modules/defaultai/mapai/MapEvaluator", "modules/defaultai/mapai/ObjectivesAi", "modules/defaultai/mapai/UnitEvaluator"], function (require, exports, activeModuleData_1, getNullFormation_1, utility_1, DiplomacyAi_1, EconomicAi_1, FrontsAi_1, GrandStrategyAi_1, MapEvaluator_1, ObjectivesAi_1, UnitEvaluator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DefaultAi = (function () {
        function DefaultAi(player, game, personality) {
            this.type = "DefaultAi";
            this.turnProcessingQueue = [];
            this.personality = personality || utility_1.makeRandomPersonality();
            this.player = player;
            this.game = game;
            this.map = game.galaxyMap;
            this.unitEvaluator = new UnitEvaluator_1.UnitEvaluator();
            this.mapEvaluator = new MapEvaluator_1.MapEvaluator(this.map, this.player, this.unitEvaluator);
            this.grandStrategyAi = new GrandStrategyAi_1.GrandStrategyAi(this.personality, this.mapEvaluator, this.game);
            this.objectivesAi = new ObjectivesAi_1.ObjectivesAi(this.mapEvaluator, this.grandStrategyAi);
            this.frontsAi = new FrontsAi_1.FrontsAi(this.player, this.objectivesAi);
            this.diplomacyAi = new DiplomacyAi_1.DiplomacyAi(this.mapEvaluator, this.game);
            this.economicAi = new EconomicAi_1.EconomicAi();
        }
        DefaultAi.prototype.processTurn = function (afterFinishedCallback) {
            this.afterTurnHasProcessed = afterFinishedCallback;
            this.turnProcessingQueue = this.constructTurnProcessingQueue();
            this.processTurnStep();
        };
        DefaultAi.prototype.createBattleFormation = function (availableUnits, hasScouted, enemyUnits, enemyFormation) {
            var _this = this;
            var scoutedUnits = hasScouted ? enemyUnits : null;
            var scoutedFormation = hasScouted ? enemyFormation : null;
            var formation = getNullFormation_1.getNullFormation();
            var unitsToPlace = availableUnits.slice();
            var maxUnitsPerRow = formation[0].length;
            var maxUnitsPerSide = activeModuleData_1.activeModuleData.ruleSet.battle.maxUnitsPerSide;
            var placedInFront = 0;
            var placedInBack = 0;
            var totalPlaced = 0;
            var unitsPlacedByArchetype = {};
            var getUnitScoreFN = function (unit, row) {
                var baseScore = _this.unitEvaluator.evaluateCombatStrength(unit);
                var archetype = unit.template.archetype;
                var idealMaxUnitsOfArchetype = Math.ceil(maxUnitsPerSide / archetype.idealWeightInBattle);
                var unitsPlacedOfArchetype = unitsPlacedByArchetype[archetype.type] || 0;
                var overMaxOfArchetypeIdeal = Math.max(0, unitsPlacedOfArchetype - idealMaxUnitsOfArchetype);
                var archetypeIdealAdjust = 1 - overMaxOfArchetypeIdeal * 0.15;
                var rowUnits = row === "ROW_FRONT" ? formation[1] : formation[0];
                var rowModifier = archetype.scoreMultiplierForRowFN ?
                    archetype.scoreMultiplierForRowFN(row, rowUnits, scoutedUnits, scoutedFormation) :
                    archetype.rowScores[row];
                return ({
                    unit: unit,
                    score: baseScore * archetypeIdealAdjust * rowModifier,
                    row: row,
                });
            };
            while (unitsToPlace.length > 0 && totalPlaced < maxUnitsPerSide) {
                var positionScores = [];
                for (var i = 0; i < unitsToPlace.length; i++) {
                    var unit = unitsToPlace[i];
                    if (placedInFront < maxUnitsPerRow) {
                        positionScores.push(getUnitScoreFN(unit, "ROW_FRONT"));
                    }
                    if (placedInBack < maxUnitsPerRow) {
                        positionScores.push(getUnitScoreFN(unit, "ROW_BACK"));
                    }
                }
                positionScores.sort(function (a, b) {
                    return (b.score - a.score);
                });
                var topScore = positionScores[0];
                if (topScore.row === "ROW_FRONT") {
                    placedInFront++;
                    formation[1][placedInFront - 1] = topScore.unit;
                }
                else {
                    placedInBack++;
                    formation[0][placedInBack - 1] = topScore.unit;
                }
                totalPlaced++;
                if (!unitsPlacedByArchetype[topScore.unit.template.archetype.type]) {
                    unitsPlacedByArchetype[topScore.unit.template.archetype.type] = 0;
                }
                unitsPlacedByArchetype[topScore.unit.template.archetype.type]++;
                unitsToPlace.splice(unitsToPlace.indexOf(topScore.unit), 1);
            }
            return formation;
        };
        DefaultAi.prototype.respondToTradeOffer = function (receivedOffer) {
            return this.economicAi.respondToTradeOffer(receivedOffer);
        };
        DefaultAi.prototype.serialize = function () {
            return undefined;
        };
        DefaultAi.prototype.constructTurnProcessingQueue = function () {
            var _this = this;
            var queue = [];
            queue.push(function (triggerFinish) {
                _this.grandStrategyAi.setDesires();
                _this.diplomacyAi.setAttitudes();
                _this.objectivesAi.processDiplomaticObjectives(triggerFinish);
            });
            queue.push(function (triggerFinish) {
                _this.objectivesAi.createFrontObjectives();
                _this.frontsAi.formFronts();
                _this.frontsAi.assignUnits();
                _this.objectivesAi.processEconomicObjectives(triggerFinish);
            });
            queue.push(function (triggerFinish) {
                _this.frontsAi.organizeFleets();
                _this.objectivesAi.executeFrontObjectives(triggerFinish);
            });
            queue.push(function (triggerFinish) {
                _this.frontsAi.organizeFleets();
                triggerFinish();
            });
            return queue;
        };
        DefaultAi.prototype.processTurnStep = function () {
            var nextStep = this.turnProcessingQueue.shift();
            if (!nextStep) {
                var afterFinishedCallback = this.afterTurnHasProcessed;
                this.afterTurnHasProcessed = null;
                afterFinishedCallback();
                return;
            }
            nextStep(this.processTurnStep.bind(this));
        };
        DefaultAi.type = "DefaultAi";
        return DefaultAi;
    }());
    exports.DefaultAi = DefaultAi;
});
define("modules/defaultai/mapai/DefaultAiConstructor", ["require", "exports", "modules/defaultai/mapai/DefaultAi"], function (require, exports, DefaultAi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultAiConstructor = {
        type: DefaultAi_1.DefaultAi.type,
        construct: function (props) {
            return new DefaultAi_1.DefaultAi(props.player, props.game, props.personality);
        },
    };
});
define("modules/defaultai/mapai/DiplomacyAi", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DiplomacyAi = (function () {
        function DiplomacyAi(mapEvaluator, game) {
            this.game = game;
            this.player = mapEvaluator.player;
            this.playerDiplomacy = this.player.diplomacy;
            this.mapEvaluator = mapEvaluator;
        }
        DiplomacyAi.prototype.setAttitudes = function () {
            var _this = this;
            var diplomacyEvaluations = this.mapEvaluator.getDiplomacyEvaluations(this.game.turnNumber);
            diplomacyEvaluations.forEach(function (player, evaluation) {
                _this.playerDiplomacy.processAttitudeModifiersForPlayer(player, evaluation);
            });
        };
        return DiplomacyAi;
    }());
    exports.DiplomacyAi = DiplomacyAi;
});
define("modules/defaultai/mapai/EconomicAi", ["require", "exports", "modules/defaultai/localization/localize", "modules/defaultai/mapai/tradeEvaluationFunctions"], function (require, exports, localize_1, tradeEvaluationFunctions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EconomicAi = (function () {
        function EconomicAi() {
        }
        EconomicAi.prototype.respondToTradeOffer = function (incomingOffer) {
            var tradeBeingReceived = incomingOffer.ownTrade;
            var tradeBeingDemanded = incomingOffer.otherTrade;
            var receivingValue = tradeEvaluationFunctions_1.evaluateValueOfTrade(tradeBeingReceived);
            var demandingValue = tradeEvaluationFunctions_1.evaluateValueOfTrade(tradeBeingDemanded);
            if (receivingValue === 0 && demandingValue === 0) {
                var message = void 0;
                if (incomingOffer.tradeWasAccepted) {
                    message = localize_1.localize("afterAcceptedOffer")();
                }
                else if (incomingOffer.isInitialOffer) {
                    message = localize_1.localize("initialOffer")();
                }
                else {
                    message = localize_1.localize("requestOffer")();
                }
                return ({
                    ownTrade: tradeBeingDemanded.clone(),
                    otherTrade: tradeBeingReceived.clone(),
                    willingnessToTradeItems: this.getWillingnessToTradeItems(tradeBeingDemanded),
                    message: message,
                    willingToAccept: false,
                    willingToKeepNegotiating: true,
                });
            }
            else if (receivingValue === 0) {
                return this.respondToDemand(tradeBeingReceived, tradeBeingDemanded);
            }
            else if (demandingValue === 0) {
                return this.respondToGift(tradeBeingReceived, tradeBeingDemanded);
            }
            var valueRatio = receivingValue / demandingValue;
            var isFavourable = valueRatio > 1;
            var valueRatioDifference = Math.abs(1 - valueRatio);
            var willingToAccept = isFavourable || valueRatioDifference < 0.04;
            return ({
                ownTrade: tradeBeingDemanded.clone(),
                otherTrade: tradeBeingReceived.clone(),
                willingnessToTradeItems: this.getWillingnessToTradeItems(tradeBeingDemanded),
                message: willingToAccept ?
                    localize_1.localize("willingToAcceptOffer")() :
                    localize_1.localize("notWillingToAcceptOffer")(),
                willingToAccept: willingToAccept,
                willingToKeepNegotiating: true,
            });
        };
        EconomicAi.prototype.respondToDemand = function (receivedOffer, ownTrade) {
            return ({
                ownTrade: ownTrade.clone(),
                otherTrade: receivedOffer.clone(),
                willingnessToTradeItems: this.getWillingnessToTradeItems(ownTrade),
                message: localize_1.localize("notWillingToAcceptDemand")(),
                willingToAccept: false,
                willingToKeepNegotiating: true,
            });
        };
        EconomicAi.prototype.respondToGift = function (receivedOffer, ownTrade) {
            return ({
                ownTrade: ownTrade.clone(),
                otherTrade: receivedOffer.clone(),
                willingnessToTradeItems: this.getWillingnessToTradeItems(ownTrade),
                message: localize_1.localize("willingToAcceptGift")(),
                willingToAccept: true,
                willingToKeepNegotiating: true,
            });
        };
        EconomicAi.prototype.getWillingnessToTradeItems = function (ownTrade) {
            var willingnessPerItem = {};
            for (var key in ownTrade.allItems) {
                willingnessPerItem[key] = 1;
            }
            return willingnessPerItem;
        };
        return EconomicAi;
    }());
    exports.EconomicAi = EconomicAi;
});
define("modules/defaultai/mapai/Front", ["require", "exports", "src/Fleet", "modules/defaultai/attachedUnitData"], function (require, exports, Fleet_1, attachedUnitData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Front = (function () {
        function Front(id, units) {
            this.id = id;
            this.units = units || [];
        }
        Front.prototype.destroy = function () {
            this.units.forEach(function (unit) {
                attachedUnitData_1.attachedUnitData.get(unit).front = undefined;
            });
        };
        Front.prototype.addUnit = function (unit) {
            var unitData = attachedUnitData_1.attachedUnitData.get(unit);
            if (unitData.front) {
                unitData.front.removeUnit(unit);
            }
            unitData.front = this;
            this.units.push(unit);
        };
        Front.prototype.removeUnit = function (unit) {
            attachedUnitData_1.attachedUnitData.get(unit).front = undefined;
            var unitIndex = this.getUnitIndex(unit);
            this.units.splice(unitIndex, 1);
        };
        Front.prototype.getUnitsByLocation = function (units) {
            if (units === void 0) { units = this.units; }
            var byLocation = {};
            units.forEach(function (unit) {
                var star = unit.fleet.location;
                if (!byLocation[star.id]) {
                    byLocation[star.id] = [];
                }
                byLocation[star.id].push(unit);
            });
            return byLocation;
        };
        Front.prototype.getFleetsByLocation = function (fleets) {
            if (fleets === void 0) { fleets = this.getAssociatedFleets(); }
            var byLocation = {};
            fleets.forEach(function (fleet) {
                var star = fleet.location;
                if (!byLocation[star.id]) {
                    byLocation[star.id] = [];
                }
                byLocation[star.id].push(fleet);
            });
            return byLocation;
        };
        Front.prototype.getAssociatedFleets = function () {
            var fleetsById = {};
            for (var i = 0; i < this.units.length; i++) {
                if (!this.units[i].fleet) {
                    continue;
                }
                if (!fleetsById[this.units[i].fleet.id]) {
                    fleetsById[this.units[i].fleet.id] = this.units[i].fleet;
                }
            }
            var allFleets = [];
            for (var fleetId in fleetsById) {
                allFleets.push(fleetsById[fleetId]);
            }
            return allFleets;
        };
        Front.prototype.organizeAllFleets = function () {
            this.organizeFleets(this.getAssociatedFleets().filter(function (fleet) { return !fleet.isStealthy; }), this.units.filter(function (unit) { return !unit.isStealthy(); }));
            this.organizeFleets(this.getAssociatedFleets().filter(function (fleet) { return fleet.isStealthy; }), this.units.filter(function (unit) { return unit.isStealthy(); }));
        };
        Front.prototype.hasUnit = function (unit) {
            return this.getUnitIndex(unit) !== -1;
        };
        Front.prototype.getUnitCountByArchetype = function () {
            var unitCountByArchetype = {};
            for (var i = 0; i < this.units.length; i++) {
                var archetype = this.units[i].template.archetype;
                if (!unitCountByArchetype[archetype.type]) {
                    unitCountByArchetype[archetype.type] = 0;
                }
                unitCountByArchetype[archetype.type]++;
            }
            return unitCountByArchetype;
        };
        Front.prototype.organizeFleets = function (fleetsToOrganize, unitsToOrganize) {
            var _this = this;
            var pureFleetsBeforeMerge = fleetsToOrganize.filter(function (fleet) { return _this.isFleetPure(fleet); });
            this.mergeFleetsWithSharedLocation(pureFleetsBeforeMerge);
            var pureFleets = pureFleetsBeforeMerge.filter(function (fleet) { return fleet.units.length > 0; });
            var unitsInImpureFleets = this.getUnitsInImpureFleets(unitsToOrganize);
            var pureFleetsByLocation = this.getFleetsByLocation(pureFleets);
            var impureUnitsByLocation = this.getUnitsByLocation(unitsInImpureFleets);
            var _loop_1 = function (locationId) {
                if (pureFleetsByLocation[locationId]) {
                    var fleet_1 = pureFleetsByLocation[locationId][0];
                    impureUnitsByLocation[locationId].forEach(function (unitToTransfer) {
                        var fleetToTransferFrom = unitToTransfer.fleet;
                        fleetToTransferFrom.transferUnit(fleet_1, unitToTransfer);
                        if (fleetToTransferFrom.units.length <= 0) {
                            fleetToTransferFrom.deleteFleet();
                        }
                    });
                    delete impureUnitsByLocation[locationId];
                }
            };
            for (var locationId in impureUnitsByLocation) {
                _loop_1(locationId);
            }
            var _loop_2 = function (locationId) {
                var units = impureUnitsByLocation[locationId];
                var player = units[0].fleet.player;
                var location_1 = units[0].fleet.location;
                units.forEach(function (unitToRemove) {
                    unitToRemove.fleet.removeUnit(unitToRemove);
                });
                var fleets = Fleet_1.Fleet.createFleetsFromUnits(units);
                fleets.forEach(function (fleet) {
                    player.addFleet(fleet);
                    location_1.addFleet(fleet);
                });
            };
            for (var locationId in impureUnitsByLocation) {
                _loop_2(locationId);
            }
        };
        Front.prototype.isFleetPure = function (fleet) {
            var _this = this;
            return fleet.units.every(function (unit) { return _this.hasUnit(unit); });
        };
        Front.prototype.getUnitIndex = function (unit) {
            return this.units.indexOf(unit);
        };
        Front.prototype.mergeFleetsWithSharedLocation = function (fleetsToMerge) {
            var fleetsByLocationId = this.getFleetsByLocation(fleetsToMerge);
            for (var locationId in fleetsByLocationId) {
                var fleetsAtLocation = fleetsByLocationId[locationId].sort(Fleet_1.Fleet.sortByImportance);
                for (var i = fleetsAtLocation.length - 1; i >= 1; i--) {
                    fleetsAtLocation[i].mergeWith(fleetsAtLocation[0]);
                }
            }
        };
        Front.prototype.getUnitsInImpureFleets = function (units) {
            var _this = this;
            var fleetPurityById = {};
            return units.filter(function (unit) {
                if (fleetPurityById.hasOwnProperty("" + unit.fleet.id)) {
                    return !fleetPurityById[unit.fleet.id];
                }
                else {
                    var fleetIsPure = _this.isFleetPure(unit.fleet);
                    fleetPurityById[unit.fleet.id] = fleetIsPure;
                    return !fleetIsPure;
                }
            });
        };
        return Front;
    }());
    exports.Front = Front;
});
define("modules/defaultai/mapai/FrontsAi", ["require", "exports", "src/IdDictionary"], function (require, exports, IdDictionary_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FrontsAi = (function () {
        function FrontsAi(player, objectivesAi) {
            this.fronts = [];
            this.player = player;
            this.objectivesAi = objectivesAi;
        }
        FrontsAi.prototype.assignUnits = function () {
            var units = this.player.units;
            var allUnitScores = [];
            var unitScoresByFront = {};
            var objectivesByFront = new IdDictionary_1.IdDictionary();
            this.objectivesAi.getFrontObjectives().forEach(function (objective) {
                objectivesByFront.set(objective.front, objective);
            });
            var recalculateScoresForFront = function (front) {
                var frontScores = unitScoresByFront[front.id];
                var objective = objectivesByFront.get(front);
                for (var i = 0; i < frontScores.length; i++) {
                    frontScores[i].score = objective.evaluateUnitFit(frontScores[i].unit);
                }
            };
            var removeUnit = function (unit) {
                for (var frontId in unitScoresByFront) {
                    unitScoresByFront[frontId] = unitScoresByFront[frontId].filter(function (score) {
                        return score.unit !== unit;
                    });
                }
            };
            for (var i = 0; i < this.fronts.length; i++) {
                var frontScores = this.getUnitScoresForFront(units, this.fronts[i]);
                unitScoresByFront[this.fronts[i].id] = frontScores;
                allUnitScores.push.apply(allUnitScores, frontScores);
            }
            var alreadyAdded = {};
            var sortByScoreFN = function (a, b) {
                return a.score - b.score;
            };
            while (allUnitScores.length > 0) {
                allUnitScores.sort(sortByScoreFN);
                var bestScore = allUnitScores.pop();
                if (alreadyAdded[bestScore.unit.id]) {
                    continue;
                }
                bestScore.front.addUnit(bestScore.unit);
                removeUnit(bestScore.unit);
                alreadyAdded[bestScore.unit.id] = true;
                recalculateScoresForFront(bestScore.front);
            }
        };
        FrontsAi.prototype.organizeFleets = function () {
            for (var i = 0; i < this.fronts.length; i++) {
                this.fronts[i].organizeAllFleets();
            }
        };
        FrontsAi.prototype.formFronts = function () {
            this.destroyInactiveFronts();
            this.fronts = this.objectivesAi.getFrontObjectives().map(function (objective) { return objective.front; });
        };
        FrontsAi.prototype.getUnitScoresForFront = function (units, front) {
            var scores = [];
            var activeObjectives = this.objectivesAi.getFrontObjectives();
            var objective;
            for (var i = 0; i < activeObjectives.length; i++) {
                if (activeObjectives[i].front === front) {
                    objective = activeObjectives[i];
                    break;
                }
            }
            for (var i = 0; i < units.length; i++) {
                scores.push({
                    unit: units[i],
                    score: objective.evaluateUnitFit(units[i]),
                    front: front,
                });
            }
            return scores;
        };
        FrontsAi.prototype.destroyInactiveFronts = function () {
            var activeObjectives = this.objectivesAi.getFrontObjectives();
            var activeFrontsWithObjective = new IdDictionary_1.IdDictionary();
            activeObjectives.forEach(function (objective) {
                activeFrontsWithObjective.set(objective.front, objective);
            });
            this.fronts.filter(function (front) {
                return !activeFrontsWithObjective.has(front);
            }).forEach(function (front) {
                front.destroy();
            });
        };
        return FrontsAi;
    }());
    exports.FrontsAi = FrontsAi;
});
define("modules/defaultai/mapai/GrandStrategyAi", ["require", "exports", "src/Star", "src/utility"], function (require, exports, Star_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GrandStrategyAi = (function () {
        function GrandStrategyAi(personality, mapEvaluator, game) {
            this.personality = personality;
            this.mapEvaluator = mapEvaluator;
            this.game = game;
        }
        GrandStrategyAi.prototype.setDesires = function () {
            this.desireForExpansion = this.getDesireForExpansion();
            this.desireForWar = this.getDesireForWar();
            this.desireForConsolidation = 0.4 + 0.6 * (1 - this.desireForExpansion);
            this.desireForExploration = this.getDesireForExploration();
        };
        GrandStrategyAi.prototype.setDesiredStars = function () {
            var totalStarsInMap = this.mapEvaluator.map.stars.length;
            var majorPlayersCount = this.game.getLiveMajorPlayers().length;
            var starsPerPlayer = totalStarsInMap / majorPlayersCount;
            var baseMinStarsDesired = starsPerPlayer * 0.34;
            var baseMaxStarsDesired = starsPerPlayer;
            var extraMinStarsDesired = this.personality.expansiveness * (starsPerPlayer * 0.66);
            var extraMaxStarsDesired = this.personality.expansiveness * (starsPerPlayer * (majorPlayersCount / 4));
            var minStarsDesired = baseMinStarsDesired + extraMinStarsDesired;
            var maxStarsDesired = baseMaxStarsDesired + extraMaxStarsDesired;
            this.desiredStars =
                {
                    min: minStarsDesired,
                    max: maxStarsDesired,
                };
        };
        GrandStrategyAi.prototype.getDesireForExpansion = function () {
            if (!this.desiredStars) {
                this.setDesiredStars();
            }
            var starsOwned = this.mapEvaluator.player.controlledLocations.length;
            var desire = 1 - utility_1.getRelativeValue(starsOwned, this.desiredStars.min, this.desiredStars.max);
            return utility_1.clamp(desire, 0.1, 1);
        };
        GrandStrategyAi.prototype.getDesireForExploration = function () {
            var _this = this;
            var percentageOfUnrevealedStars = 1 -
                this.mapEvaluator.player.getRevealedStars().length / this.mapEvaluator.map.stars.length;
            var surroundingStars = Star_1.Star.getIslandForQualifier(this.mapEvaluator.player.controlledLocations, null, function (parent, candidate) {
                var nearestOwnedStar = _this.mapEvaluator.player.getNearestOwnedStarTo(candidate);
                return candidate.getDistanceToStar(nearestOwnedStar) <= 2;
            });
            var unrevealedSurroundingStars = surroundingStars.filter(function (star) {
                return !_this.mapEvaluator.player.revealedStars[star.id];
            });
            var percentageOfUnrevealedSurroundingStars = unrevealedSurroundingStars.length / surroundingStars.length;
            return percentageOfUnrevealedSurroundingStars * 0.8 + percentageOfUnrevealedStars * 0.2;
        };
        GrandStrategyAi.prototype.getDesireForWar = function () {
            if (!this.desiredStars) {
                this.setDesiredStars();
            }
            var fromAggressiveness = this.personality.aggressiveness;
            var fromExpansiveness = 0;
            var minStarsStillDesired = this.mapEvaluator.player.controlledLocations.length - this.desiredStars.min;
            var availableExpansionTargets = this.mapEvaluator.getIndependentNeighborStarIslands(minStarsStillDesired);
            if (availableExpansionTargets.length < minStarsStillDesired) {
                fromExpansiveness += this.personality.expansiveness / (1 + availableExpansionTargets.length);
            }
            var desire = fromAggressiveness + fromExpansiveness;
            return utility_1.clamp(desire, 0, 1);
        };
        return GrandStrategyAi;
    }());
    exports.GrandStrategyAi = GrandStrategyAi;
});
define("modules/defaultai/mapai/MapEvaluator", ["require", "exports", "src/Star", "src/ValuesByPlayer", "src/ValuesByStar", "src/utility", "src/activeModuleData"], function (require, exports, Star_1, ValuesByPlayer_1, ValuesByStar_1, utility_1, activeModuleData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultEvaluationParameters = {
        starDesirability: {
            neighborRange: 1,
            neighborWeight: 0.5,
            defendabilityWeight: 1,
            totalIncomeWeight: 1,
            baseIncomeWeight: 0.5,
            infrastructureWeight: 1,
            productionWeight: 1,
        },
    };
    var MapEvaluator = (function () {
        function MapEvaluator(map, player, unitEvaluator) {
            this.map = map;
            this.player = player;
            this.unitEvaluator = unitEvaluator;
            this.evaluationParameters = exports.defaultEvaluationParameters;
        }
        MapEvaluator.prototype.evaluateStarIncome = function (star) {
            var evaluation = 0;
            evaluation += star.baseIncome;
            evaluation += (star.getIncome() - star.baseIncome) *
                (1 - this.evaluationParameters.starDesirability.baseIncomeWeight);
            return evaluation;
        };
        MapEvaluator.prototype.evaluateStarInfrastructure = function (star) {
            var totalCostOfAllBuildings = star.buildings.map(function (building) {
                return building.totalCost;
            }).reduce(function (total, current) {
                return total + current;
            }, 0);
            return totalCostOfAllBuildings / 25;
        };
        MapEvaluator.prototype.evaluateStarProduction = function (star) {
            var evaluation = 0;
            return evaluation;
        };
        MapEvaluator.prototype.evaluateStarDefendability = function (star) {
            var evaluation = 0;
            var nearbyStars = star.getLinkedInRange(2).byRange;
            for (var rangeString in nearbyStars) {
                var distanceMultiplier = 1 / parseInt(rangeString);
                var starsInRange = nearbyStars[rangeString];
                for (var i = 0; i < starsInRange.length; i++) {
                    var neighbor = starsInRange[i];
                    var neighborDefendability = void 0;
                    if (neighbor.owner === this.player) {
                        neighborDefendability = 3;
                    }
                    else if (neighbor.owner.isIndependent) {
                        neighborDefendability = -0.75;
                    }
                    else {
                        neighborDefendability = -2;
                    }
                    evaluation += neighborDefendability * distanceMultiplier;
                }
            }
            if (star.owner === this.player) {
                evaluation += 3;
            }
            return evaluation * 5;
        };
        MapEvaluator.prototype.evaluateIndividualStarDesirability = function (star) {
            var evaluation = 0;
            var p = this.evaluationParameters.starDesirability;
            var incomeEvaluation = this.evaluateStarIncome(star) * p.totalIncomeWeight;
            incomeEvaluation *= incomeEvaluation / (this.player.getIncome() / 4);
            evaluation += incomeEvaluation;
            var infrastructureEvaluation = this.evaluateStarInfrastructure(star) * p.infrastructureWeight;
            evaluation += infrastructureEvaluation;
            var productionEvaluation = this.evaluateStarProduction(star) * p.productionWeight;
            evaluation += productionEvaluation;
            var defendabilityEvaluation = this.evaluateStarDefendability(star) * p.defendabilityWeight;
            evaluation += defendabilityEvaluation;
            return evaluation;
        };
        MapEvaluator.prototype.evaluateNeighboringStarsDesirability = function (star, range) {
            var evaluation = 0;
            var inRange = star.getLinkedInRange(range).byRange;
            for (var distanceString in inRange) {
                var stars = inRange[distanceString];
                var distance = parseInt(distanceString);
                var distanceFalloff = 1 / (distance + 1);
                for (var i = 0; i < stars.length; i++) {
                    evaluation += this.evaluateIndividualStarDesirability(stars[i]) * distanceFalloff;
                }
            }
            return evaluation;
        };
        MapEvaluator.prototype.evaluateStarDesirability = function (star) {
            var evaluation = 0;
            var p = this.evaluationParameters.starDesirability;
            evaluation += this.evaluateIndividualStarDesirability(star);
            evaluation += this.evaluateNeighboringStarsDesirability(star, p.neighborRange) *
                p.neighborWeight;
            return evaluation;
        };
        MapEvaluator.prototype.evaluateStarTargets = function (targetStars) {
            var _this = this;
            var evaluationByStar = new ValuesByStar_1.ValuesByStar(targetStars, function (star) {
                var desirability = _this.evaluateStarDesirability(star);
                var hostileStrength = _this.getHostileStrengthAtStar(star);
                var ownInfluenceMap = _this.getPlayerInfluenceMap(_this.player);
                var ownInfluenceAtStar = ownInfluenceMap.get(star) || 1;
                return ({
                    desirability: desirability,
                    hostileStrength: hostileStrength,
                    ownInfluence: ownInfluenceAtStar,
                });
            });
            return evaluationByStar;
        };
        MapEvaluator.prototype.scoreStarTargets = function (evaluations, getScoreFN) {
            var scores = new ValuesByStar_1.ValuesByStar();
            evaluations.forEach(function (star, evaluation) {
                scores.set(star, getScoreFN(star, evaluation));
            });
            return scores;
        };
        MapEvaluator.prototype.scoreIndependentTargets = function (evaluations) {
            var _this = this;
            return this.scoreStarTargets(evaluations, function (star, evaluation) {
                var easeOfCapturing = evaluation.ownInfluence / evaluation.hostileStrength;
                var score = evaluation.desirability * easeOfCapturing;
                if (star.getSecondaryController() === _this.player) {
                    score *= 1.5;
                }
                return score;
            });
        };
        MapEvaluator.prototype.getIndependentNeighborStars = function () {
            var _this = this;
            var independentNeighborStars = this.player.getNeighboringStars().filter(function (star) {
                var secondaryController = star.getSecondaryController();
                return star.owner.isIndependent && (!secondaryController || secondaryController === _this.player);
            });
            return independentNeighborStars;
        };
        MapEvaluator.prototype.getIndependentNeighborStarIslands = function (earlyReturnSize) {
            var _this = this;
            var islandQualifierFN = function (a, b) {
                var secondaryController = b.getSecondaryController();
                return b.owner.isIndependent && (!secondaryController || secondaryController === _this.player);
            };
            return Star_1.Star.getIslandForQualifier(this.player.controlledLocations, earlyReturnSize, islandQualifierFN);
        };
        MapEvaluator.prototype.getHostileUnitsAtStar = function (star) {
            var _this = this;
            return star.getUnits(function (player) {
                return _this.player.diplomacy.canAttackFleetOfPlayer(player);
            });
        };
        MapEvaluator.prototype.getHostileStrengthAtStar = function (star) {
            var _a;
            return (_a = this.unitEvaluator).evaluateMapStrength.apply(_a, this.getHostileUnitsAtStar(star));
        };
        MapEvaluator.prototype.getIndependentStrengthAtStar = function (star) {
            var _a;
            var independentUnits = star.getUnits(function (player) { return player.isIndependent; });
            return (_a = this.unitEvaluator).evaluateMapStrength.apply(_a, independentUnits);
        };
        MapEvaluator.prototype.getDefenceBuildingStrengthAtStarByPlayer = function (star) {
            var byPlayer = new ValuesByPlayer_1.ValuesByPlayer();
            star.territoryBuildings.forEach(function (building) {
                var previousValue = byPlayer.get(building.controller) || 0;
                byPlayer.set(building.controller, previousValue + building.totalCost);
            });
            return byPlayer;
        };
        MapEvaluator.prototype.getVisibleFleetsOfPlayer = function (player) {
            var _this = this;
            var visibleFleets = [];
            this.player.getVisibleStars().forEach(function (star) {
                var playerFleetsAtStar = star.fleets[player.id];
                if (playerFleetsAtStar) {
                    var hasDetectionInStar = _this.player.starIsDetected(star);
                    var visibleFleetsAtStar = hasDetectionInStar ? playerFleetsAtStar :
                        playerFleetsAtStar.filter(function (fleet) {
                            return !fleet.isStealthy;
                        });
                    visibleFleets.push.apply(visibleFleets, visibleFleetsAtStar);
                }
            });
            return visibleFleets;
        };
        MapEvaluator.prototype.getPlayerInfluenceMap = function (player) {
            var _a;
            var _this = this;
            var stars = this.player.getRevealedStars();
            var influence = new ValuesByStar_1.ValuesByStar(stars, function (star) {
                var defenceBuildingStrength = _this.getDefenceBuildingStrengthAtStarByPlayer(star);
                return defenceBuildingStrength.get(player) || 0;
            });
            var fleets = this.getVisibleFleetsOfPlayer(player);
            for (var i = 0; i < fleets.length; i++) {
                var fleet = fleets[i];
                var strength = (_a = this.unitEvaluator).evaluateMapStrength.apply(_a, fleet.units);
                var location_1 = fleet.location;
                var range = fleet.getMinMaxMovePoints();
                var turnsToCheck = 4;
                var inFleetRange = location_1.getLinkedInRange(range * turnsToCheck).byRange;
                inFleetRange[0] = [location_1];
                for (var distance in inFleetRange) {
                    var numericDistance = parseInt(distance);
                    var turnsToReach = Math.floor((numericDistance - 1) / range);
                    if (turnsToReach < 0) {
                        turnsToReach = 0;
                    }
                    var distanceFalloff = 1 / (turnsToReach + 1);
                    var adjustedStrength = strength * distanceFalloff;
                    for (var j = 0; j < inFleetRange[distance].length; j++) {
                        var star = inFleetRange[distance][j];
                        var previousInfluence = influence.get(star) || 0;
                        influence.set(star, previousInfluence + adjustedStrength);
                    }
                }
            }
            return influence;
        };
        MapEvaluator.prototype.getInfluenceMapsForKnownPlayers = function () {
            var _this = this;
            var byPlayer = new ValuesByPlayer_1.ValuesByPlayer();
            this.player.diplomacy.getMetPlayers().filter(function (player) { return !player.isDead; }).forEach(function (player) {
                byPlayer.set(player, _this.getPlayerInfluenceMap(player));
            });
            return byPlayer;
        };
        MapEvaluator.prototype.getKnownPlayersInfluenceOnStar = function (star) {
            var influenceMaps = this.getInfluenceMapsForKnownPlayers();
            var influenceByPlayer = new ValuesByPlayer_1.ValuesByPlayer();
            influenceMaps.forEach(function (player, influenceMap) {
                var influenceOnStar = influenceMap.get(star);
                if (isFinite(influenceOnStar)) {
                    influenceByPlayer.set(player, influenceOnStar);
                }
            });
            return influenceByPlayer;
        };
        MapEvaluator.prototype.getVisibleStarsOfPlayer = function (player) {
            return this.player.getVisibleStars().filter(function (star) {
                return star.owner === player;
            });
        };
        MapEvaluator.prototype.getVisibleStarsOfKnownPlayers = function () {
            var _this = this;
            var byPlayer = new ValuesByPlayer_1.ValuesByPlayer();
            this.player.diplomacy.getMetPlayers().filter(function (player) { return !player.isDead; }).forEach(function (player) {
                byPlayer.set(player, _this.getVisibleStarsOfPlayer(player));
            });
            return byPlayer;
        };
        MapEvaluator.prototype.estimateGlobalStrength = function (player) {
            var _a;
            var visibleStrength = 0;
            var invisibleStrength = 0;
            var fleets = this.getVisibleFleetsOfPlayer(player);
            for (var i = 0; i < fleets.length; i++) {
                visibleStrength += (_a = this.unitEvaluator).evaluateMapStrength.apply(_a, fleets[i].units);
            }
            if (player !== this.player) {
                invisibleStrength = visibleStrength * 0.5;
            }
            return visibleStrength + invisibleStrength;
        };
        MapEvaluator.prototype.getPerceivedThreatOfPlayer = function (player) {
            if (!this.player.diplomacy.hasMetPlayer(player)) {
                throw new Error(this.player.name.fullName +
                    " tried to call getPerceivedThreatOfPlayer on unmet player " + player.name.fullName);
            }
            var otherInfluenceMap = this.getPlayerInfluenceMap(player);
            var ownInfluenceMap = this.getPlayerInfluenceMap(this.player);
            var totalInfluenceInOwnStars = 0;
            this.player.controlledLocations.forEach(function (star) {
                var ownInfluence = ownInfluenceMap.get(star);
                var otherInfluence = otherInfluenceMap.get(star);
                totalInfluenceInOwnStars += otherInfluence - 0.5 * ownInfluence;
            });
            var globalStrengthDifference = this.estimateGlobalStrength(player) - this.estimateGlobalStrength(this.player);
            return totalInfluenceInOwnStars + globalStrengthDifference;
        };
        MapEvaluator.prototype.getPerceivedThreatOfAllKnownPlayers = function () {
            var _this = this;
            var byPlayer = new ValuesByPlayer_1.ValuesByPlayer();
            this.player.diplomacy.getMetPlayers().filter(function (player) { return !player.isDead; }).forEach(function (player) {
                byPlayer.set(player, _this.getPerceivedThreatOfPlayer(player));
            });
            return byPlayer;
        };
        MapEvaluator.prototype.getRelativePerceivedThreatOfAllKnownPlayers = function () {
            var byPlayer = this.getPerceivedThreatOfAllKnownPlayers();
            var relative = new ValuesByPlayer_1.ValuesByPlayer();
            var min;
            var max;
            byPlayer.forEach(function (player, threat) {
                min = isFinite(min) ? Math.min(min, threat) : threat;
                max = isFinite(max) ? Math.max(max, threat) : threat;
            });
            byPlayer.forEach(function (player, threat) {
                relative.set(player, utility_1.getRelativeValue(threat, min, max));
            });
            return relative;
        };
        MapEvaluator.prototype.getVisionCoverageAroundStar = function (star, range, useDetection) {
            if (useDetection === void 0) { useDetection = false; }
            var toCheck = star.getLinkedInRange(range).all;
            var scorePerVisibleStar = 1 / toCheck.length;
            var coverageScore = 0;
            var visibilityCheckFN = useDetection ? this.player.starIsDetected : this.player.starIsVisible;
            for (var i = 0; i < toCheck.length; i++) {
                var neighbor = toCheck[i];
                if (visibilityCheckFN.call(this.player, neighbor)) {
                    coverageScore += scorePerVisibleStar;
                }
            }
            return coverageScore;
        };
        MapEvaluator.prototype.estimateFleetVisionRange = function (fleet) {
            var _this = this;
            var fleetLikelyHasScoutingUnit = fleet.units.length >= 5;
            var estimatedRange = fleetLikelyHasScoutingUnit ? 2 : 1;
            fleet.units.forEach(function (unit) {
                if (_this.player.unitIsIdentified(unit)) {
                    estimatedRange = Math.max(estimatedRange, unit.getVisionRange());
                }
            });
            return estimatedRange;
        };
        MapEvaluator.prototype.estimateFleetDetectionRange = function (fleet) {
            var _this = this;
            var fleetLikelyHasScoutingUnit = fleet.units.length >= 5;
            var estimatedRange = fleetLikelyHasScoutingUnit ? 0 : -1;
            fleet.units.forEach(function (unit) {
                if (_this.player.unitIsIdentified(unit)) {
                    estimatedRange = Math.max(estimatedRange, unit.getDetectionRange());
                }
            });
            return estimatedRange;
        };
        MapEvaluator.prototype.getPlayerVisionMap = function (player) {
            var detectedStars = {};
            var visibleStars = {};
            var revealedStarsOfPlayer = this.player.getRevealedStars().filter(function (star) { return star.owner === player; });
            var visibleFleetsOfPlayer = this.getVisibleFleetsOfPlayer(player);
            var processDetectionSource = function (source, detectionRange, visionRange) {
                var detected = source.getLinkedInRange(detectionRange).all;
                for (var i = 0; i < detected.length; i++) {
                    var star = detected[i];
                    if (!detectedStars[star.id]) {
                        detectedStars[star.id] = star;
                    }
                }
                var visible = source.getLinkedInRange(visionRange).all;
                for (var i = 0; i < visible.length; i++) {
                    var star = visible[i];
                    if (!visibleStars[star.id]) {
                        visibleStars[star.id] = star;
                    }
                }
            };
            for (var i = 0; i < revealedStarsOfPlayer.length; i++) {
                var star = revealedStarsOfPlayer[i];
                var assumedDetectionRange = activeModuleData_1.activeModuleData.ruleSet.vision.baseStarDetectionRange;
                var detectionRange = this.player.starIsDetected(star) ?
                    star.getDetectionRange() :
                    assumedDetectionRange;
                var assumedVisionRange = activeModuleData_1.activeModuleData.ruleSet.vision.baseStarVisionRange;
                var visionRange = this.player.starIsDetected(star) ?
                    star.getVisionRange() :
                    assumedVisionRange;
                processDetectionSource(star, detectionRange, visionRange);
            }
            for (var i = 0; i < visibleFleetsOfPlayer.length; i++) {
                var fleet = visibleFleetsOfPlayer[i];
                var detectionRange = this.estimateFleetDetectionRange(fleet);
                var visionRange = this.estimateFleetVisionRange(fleet);
                processDetectionSource(fleet.location, detectionRange, visionRange);
            }
            return ({
                visible: visibleStars,
                detected: detectedStars,
            });
        };
        MapEvaluator.prototype.getScoredPerimeterLocationsAgainstPlayer = function (player, safetyFactor, forScouting) {
            var _this = this;
            var ownInfluence = this.getPlayerInfluenceMap(this.player);
            var enemyInfluence = this.getPlayerInfluenceMap(player);
            var enemyVision = this.getPlayerVisionMap(player);
            var revealedStars = this.player.getRevealedStars();
            var stars = revealedStars.filter(function (star) {
                return star.owner.isIndependent || star.owner === _this.player;
            });
            var scores = new ValuesByStar_1.ValuesByStar(stars, function (star) {
                var score;
                var nearestOwnedStar = player.getNearestOwnedStarTo(star);
                var distanceToEnemy = star.getDistanceToStar(nearestOwnedStar);
                distanceToEnemy = Math.max(distanceToEnemy - 1, 1);
                var distanceScore = Math.pow(1 / distanceToEnemy, 2);
                var danger = enemyInfluence.get(star) || 1;
                if (!enemyVision.visible[star.id]) {
                    danger *= 0.5;
                }
                danger *= safetyFactor;
                if (forScouting) {
                    var safety = ownInfluence.get(star) / (danger * safetyFactor);
                    score = safety * distanceScore;
                }
                else {
                    score = (danger / ownInfluence.get(star)) / safetyFactor;
                }
                return score;
            });
            return scores;
        };
        MapEvaluator.prototype.getDesireToGoToWarWith = function (player) {
            return Math.random();
        };
        MapEvaluator.prototype.getAbilityToGoToWarWith = function (player) {
            return Math.random();
        };
        MapEvaluator.prototype.getDiplomacyEvaluations = function (currentTurn) {
            var _this = this;
            var evaluations = new ValuesByPlayer_1.ValuesByPlayer();
            var neighborStarsByPlayer = new ValuesByPlayer_1.ValuesByPlayer();
            this.player.getNeighboringStars().forEach(function (star) {
                neighborStarsByPlayer.setIfDoesntExist(star.owner, []);
                neighborStarsByPlayer.get(star.owner).push(star);
            });
            this.player.diplomacy.getMetPlayers().filter(function (player) { return !player.isDead; }).forEach(function (player) {
                neighborStarsByPlayer.setIfDoesntExist(player, []);
                evaluations.set(player, {
                    currentTurn: currentTurn,
                    opinion: _this.player.diplomacy.getOpinionOf(player),
                    neighborStars: neighborStarsByPlayer.get(player),
                    currentStatus: _this.player.diplomacy.getStatusWithPlayer(player),
                });
            });
            return evaluations;
        };
        return MapEvaluator;
    }());
    exports.MapEvaluator = MapEvaluator;
});
define("modules/defaultai/mapai/objectiveCreatorTemplates", ["require", "exports", "modules/defaultai/objectives/BuildUnitsForFront", "modules/defaultai/objectives/CleanUpPirates", "modules/defaultai/objectives/Conquer", "modules/defaultai/objectives/DeclareWar", "modules/defaultai/objectives/Discovery", "modules/defaultai/objectives/ExpandManufactoryCapacity", "modules/defaultai/objectives/Expansion", "modules/defaultai/objectives/FightInvadingEnemy", "modules/defaultai/objectives/Heal", "modules/defaultai/objectives/ScoutingPerimeter"], function (require, exports, BuildUnitsForFront_1, CleanUpPirates_1, Conquer_1, DeclareWar_1, Discovery_1, ExpandManufactoryCapacity_1, Expansion_1, FightInvadingEnemy_1, Heal_1, ScoutingPerimeter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.objectiveCreatorTemplates = [
        BuildUnitsForFront_1.BuildUnitsForFront.makeCreatorTemplate(),
        CleanUpPirates_1.CleanUpPirates.makeCreatorTemplate(),
        Conquer_1.Conquer.makeCreatorTemplate(),
        DeclareWar_1.DeclareWar.makeCreatorTemplate(),
        Discovery_1.Discovery.makeCreatorTemplate(),
        ExpandManufactoryCapacity_1.ExpandManufactoryCapacity.makeCreatorTemplate(),
        Expansion_1.Expansion.makeCreatorTemplate(),
        FightInvadingEnemy_1.FightInvadingEnemy.makeCreatorTemplate(),
        Heal_1.Heal.makeCreatorTemplate(),
        ScoutingPerimeter_1.ScoutingPerimeter.makeCreatorTemplate(),
    ];
});
define("modules/defaultai/mapai/ObjectiveQueue", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObjectiveQueue = (function () {
        function ObjectiveQueue() {
            this.objectivesToExecute = [];
        }
        ObjectiveQueue.sortByFinalPriority = function (a, b) {
            return b.finalPriority - a.finalPriority;
        };
        ObjectiveQueue.prototype.executeObjectives = function (objectivesToExecute, onAllFinished) {
            this.objectivesToExecute = objectivesToExecute;
            this.onAllFinished = onAllFinished;
            this.executeNextObjective();
        };
        ObjectiveQueue.prototype.executeNextObjective = function () {
            this.currentObjective = this.objectivesToExecute.shift();
            this.clearExecutionFailureTimeout();
            if (!this.currentObjective) {
                this.onAllFinished();
                return;
            }
            this.setExecutionFailureTimeout();
            this.currentObjective.execute(this.executeNextObjective.bind(this));
        };
        ObjectiveQueue.prototype.setExecutionFailureTimeout = function (delay) {
            var _this = this;
            if (delay === void 0) { delay = 5000; }
            this.executionFailureTimeoutHandle = window.setTimeout(function () {
                console.warn("Objective of type " + _this.currentObjective.type + " failed to trigger finish callback for objective execution after " + delay + "ms");
                _this.clearExecutionFailureTimeout();
            }, delay);
        };
        ObjectiveQueue.prototype.clearExecutionFailureTimeout = function () {
            window.clearTimeout(this.executionFailureTimeoutHandle);
            this.executionFailureTimeoutHandle = null;
        };
        return ObjectiveQueue;
    }());
    exports.ObjectiveQueue = ObjectiveQueue;
});
define("modules/defaultai/mapai/ObjectivesAi", ["require", "exports", "src/IdDictionary", "src/utility", "modules/defaultai/objectives/common/ObjectiveFamily", "modules/defaultai/mapai/ObjectiveQueue", "modules/defaultai/mapai/objectiveCreatorTemplates"], function (require, exports, IdDictionary_1, utility_1, ObjectiveFamily_1, ObjectiveQueue_1, objectiveCreatorTemplates_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObjectivesAi = (function () {
        function ObjectivesAi(mapEvaluator, grandStrategyAi) {
            this.ongoingObjectives = [];
            this.mapEvaluator = mapEvaluator;
            this.grandStrategyAi = grandStrategyAi;
        }
        ObjectivesAi.diplomaticFilter = function (toFilter) {
            return toFilter.family === ObjectiveFamily_1.ObjectiveFamily.Diplomatic;
        };
        ObjectivesAi.economicFilter = function (toFilter) {
            return toFilter.family === ObjectiveFamily_1.ObjectiveFamily.Economic;
        };
        ObjectivesAi.frontFilter = function (toFilter) {
            return toFilter.family === ObjectiveFamily_1.ObjectiveFamily.Front;
        };
        ObjectivesAi.groupObjectivesByType = function (objectives) {
            var grouped = {};
            objectives.forEach(function (objective) {
                if (!grouped[objective.type]) {
                    grouped[objective.type] = [];
                }
                grouped[objective.type].push(objective);
            });
            return grouped;
        };
        ObjectivesAi.prototype.processDiplomaticObjectives = function (onAllFinished) {
            this.updateAndExecuteObjectives(ObjectivesAi.diplomaticFilter, onAllFinished);
        };
        ObjectivesAi.prototype.processEconomicObjectives = function (onAllFinished) {
            this.updateAndExecuteObjectives(ObjectivesAi.economicFilter, onAllFinished);
        };
        ObjectivesAi.prototype.createFrontObjectives = function () {
            this.updateObjectivesForFilter(ObjectivesAi.frontFilter);
            this.calculateFinalPrioritiesForObjectivesMatchingFilter(ObjectivesAi.frontFilter);
        };
        ObjectivesAi.prototype.getFrontObjectives = function () {
            return this.ongoingObjectives.filter(ObjectivesAi.frontFilter);
        };
        ObjectivesAi.prototype.executeFrontObjectives = function (onAllFinished) {
            var objectives = this.getFrontObjectives();
            objectives.sort(function (a, b) {
                var movePrioritySort = b.movePriority - a.movePriority;
                if (movePrioritySort) {
                    return movePrioritySort;
                }
                var finalPrioritySort = b.finalPriority - a.finalPriority;
                if (finalPrioritySort) {
                    return finalPrioritySort;
                }
                return a.id - b.id;
            });
            var objectiveQueue = new ObjectiveQueue_1.ObjectiveQueue();
            objectiveQueue.executeObjectives(objectives, onAllFinished);
        };
        ObjectivesAi.prototype.updateAndExecuteObjectives = function (filterFN, onAllFinished) {
            this.updateObjectivesForFilter(filterFN);
            this.calculateFinalPrioritiesForObjectivesMatchingFilter(filterFN);
            var objectiveQueue = new ObjectiveQueue_1.ObjectiveQueue();
            objectiveQueue.executeObjectives(this.ongoingObjectives.filter(filterFN).sort(ObjectiveQueue_1.ObjectiveQueue.sortByFinalPriority), onAllFinished);
        };
        ObjectivesAi.prototype.updateObjectivesForFilter = function (filterFN) {
            var _this = this;
            var creatorTemplates = objectiveCreatorTemplates_1.objectiveCreatorTemplates.filter(filterFN);
            creatorTemplates.forEach(function (template) {
                var newObjectives = template.getUpdatedObjectivesList(_this.mapEvaluator, _this.ongoingObjectives);
                _this.ongoingObjectives = newObjectives;
            });
        };
        ObjectivesAi.prototype.getRelativeScoresForObjectives = function (objectives) {
            var objectivesByType = ObjectivesAi.groupObjectivesByType(objectives);
            var relativeScores = new IdDictionary_1.IdDictionary();
            var _loop_1 = function (type) {
                var min;
                var max;
                objectivesByType[type].forEach(function (objective) {
                    var score = objective.score;
                    min = isFinite(min) ? Math.min(min, score) : score;
                    max = isFinite(max) ? Math.max(max, score) : score;
                });
                objectivesByType[type].forEach(function (objective) {
                    var relativeScore = utility_1.getRelativeValue(objective.score, min, max);
                    relativeScores.set(objective, relativeScore);
                });
            };
            for (var type in objectivesByType) {
                _loop_1(type);
            }
            return relativeScores;
        };
        ObjectivesAi.prototype.calculateFinalPrioritiesForObjectivesMatchingFilter = function (filterFN) {
            var _this = this;
            var priorities = {};
            objectiveCreatorTemplates_1.objectiveCreatorTemplates.filter(filterFN).forEach(function (template) {
                priorities[template.type] = template.evaluatePriority(_this.mapEvaluator, _this.grandStrategyAi);
            });
            var relativeScores = this.getRelativeScoresForObjectives(this.ongoingObjectives.filter(filterFN));
            relativeScores.forEach(function (objective, score) {
                objective.finalPriority = score * priorities[objective.type];
            });
        };
        return ObjectivesAi;
    }());
    exports.ObjectivesAi = ObjectivesAi;
});
define("modules/defaultai/mapai/tradeEvaluationFunctions", ["require", "exports", "src/Trade"], function (require, exports, Trade_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function evaluateValueOfTrade(trade) {
        var value = 0;
        for (var key in trade.stagedItems) {
            var item = trade.stagedItems[key];
            value += evaluateTradeableItemValue(item);
        }
        return value;
    }
    exports.evaluateValueOfTrade = evaluateValueOfTrade;
    function evaluateTradeableItemValue(item) {
        switch (item.type) {
            case Trade_1.TradeableItemType.Money:
                {
                    return item.amount;
                }
            default:
                {
                    throw new Error("Unrecognized trade item " + item + ".");
                }
        }
    }
    exports.evaluateTradeableItemValue = evaluateTradeableItemValue;
});
define("modules/defaultai/mapai/UnitEvaluator", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitEvaluator = (function () {
        function UnitEvaluator() {
        }
        UnitEvaluator.prototype.evaluateCombatStrength = function () {
            var units = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                units[_i] = arguments[_i];
            }
            var strength = 0;
            units.forEach(function (unit) {
                strength += unit.currentHealth;
            });
            return strength;
        };
        UnitEvaluator.prototype.evaluateMapStrength = function () {
            var units = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                units[_i] = arguments[_i];
            }
            return this.evaluateCombatStrength.apply(this, units);
        };
        UnitEvaluator.prototype.evaluateUnitScoutingAbility = function (unit) {
            var score = 0;
            var visionRange = unit.getVisionRange();
            if (visionRange < 0) {
                return -Infinity;
            }
            else {
                score += Math.pow(visionRange, 1.5) / 2;
            }
            var isStealthy = unit.isStealthy();
            if (isStealthy) {
                score *= 1.5;
            }
            score /= unit.getTotalCost();
            return score;
        };
        return UnitEvaluator;
    }());
    exports.UnitEvaluator = UnitEvaluator;
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultai/objectives/BuildUnitsForFront", ["require", "exports", "src/utility", "modules/defaultai/objectives/common/EconomicObjective", "modules/defaultai/objectives/common/ObjectiveFamily"], function (require, exports, utility_1, EconomicObjective_1, ObjectiveFamily_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BuildUnitsForFront = (function (_super) {
        __extends(BuildUnitsForFront, _super);
        function BuildUnitsForFront(objective, player) {
            var _this = _super.call(this, objective.finalPriority) || this;
            _this.type = "BuildUnitsForFront";
            _this.ongoingMultiplier = 1;
            _this.objective = objective;
            _this.player = player;
            return _this;
        }
        BuildUnitsForFront.createObjectives = function (mapEvaluator, allOngoingObjectives) {
            var frontObjectives = allOngoingObjectives.filter(function (objective) {
                return objective.family === ObjectiveFamily_1.ObjectiveFamily.Front;
            });
            var frontObjectivesRequestingUnits = frontObjectives.filter(function (objective) {
                return objective.evaluateCurrentCombatStrength() < objective.getIdealRequiredCombatStrength();
            });
            return frontObjectivesRequestingUnits.map(function (objective) {
                return new BuildUnitsForFront(objective, mapEvaluator.player);
            });
        };
        BuildUnitsForFront.evaluatePriority = function (mapEvaluator, grandStrategyAi) {
            return 0.66;
        };
        BuildUnitsForFront.updateOngoingObjectivesList = function (allOngoingObjectives, createdObjectives) {
            return this.replaceObjectives(allOngoingObjectives, createdObjectives);
        };
        BuildUnitsForFront.prototype.execute = function (afterDoneCallback) {
            var _this = this;
            var manufactoryLocation = this.objective.getRallyPoint().getNearestStarForQualifier(function (location) {
                return location.owner === _this.player && location.manufactory && !location.manufactory.queueIsFull();
            });
            if (!manufactoryLocation) {
                afterDoneCallback();
                return;
            }
            var manufactory = manufactoryLocation.manufactory;
            var unitType = utility_1.getRandomArrayItem(manufactory.getManufacturableUnits());
            if (this.player.money >= unitType.buildCost) {
                manufactory.addThingToQueue(unitType, "unit");
            }
            afterDoneCallback();
        };
        BuildUnitsForFront.type = "BuildUnitsForFront";
        return BuildUnitsForFront;
    }(EconomicObjective_1.EconomicObjective));
    exports.BuildUnitsForFront = BuildUnitsForFront;
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultai/objectives/CleanUpPirates", ["require", "exports", "modules/defaultai/objectives/common/MovePriority", "modules/defaultai/objectives/common/TargetedFrontObjective"], function (require, exports, MovePriority_1, TargetedFrontObjective_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CleanUpPirates = (function (_super) {
        __extends(CleanUpPirates, _super);
        function CleanUpPirates(score, target, mapEvaluator, unitEvaluator) {
            var _this = _super.call(this, score, target, mapEvaluator, unitEvaluator) || this;
            _this.type = "CleanUpPirates";
            _this.movePriority = MovePriority_1.MovePriority.CleanUpPirates;
            return _this;
        }
        CleanUpPirates.createObjectives = function (mapEvaluator, allOngoingObjectives) {
            var ownedStarsWithPirates = mapEvaluator.player.controlledLocations.filter(function (star) {
                if (star.getSecondaryController) {
                    return false;
                }
                else {
                    return star.getUnits(function (player) { return player.isIndependent; }).length > 0;
                }
            });
            var evaluations = mapEvaluator.evaluateStarTargets(ownedStarsWithPirates);
            var scores = mapEvaluator.scoreIndependentTargets(evaluations);
            return scores.mapToArray(function (star, score) {
                return new CleanUpPirates(score, star, mapEvaluator, mapEvaluator.unitEvaluator);
            });
        };
        CleanUpPirates.evaluatePriority = function (mapEvaluator, grandStrategyAi) {
            return grandStrategyAi.desireForConsolidation;
        };
        CleanUpPirates.prototype.execute = function (afterDoneCallback) {
            this.musterAndAttack(afterDoneCallback, function (target) {
                return target.enemy.isIndependent;
            });
        };
        CleanUpPirates.prototype.evaluateUnitFit = function (unit) {
            var strengthScore = this.unitEvaluator.evaluateCombatStrength(unit);
            return strengthScore * this.evaluateDefaultUnitFit(unit, this.front);
        };
        CleanUpPirates.prototype.getMinimumRequiredCombatStrength = function () {
            var enemyStrength = this.mapEvaluator.getIndependentStrengthAtStar(this.target);
            return enemyStrength * 1.5;
        };
        CleanUpPirates.prototype.getIdealRequiredCombatStrength = function () {
            var enemyStrength = this.mapEvaluator.getIndependentStrengthAtStar(this.target);
            return enemyStrength * 2;
        };
        CleanUpPirates.type = "CleanUpPirates";
        return CleanUpPirates;
    }(TargetedFrontObjective_1.TargetedFrontObjective));
    exports.CleanUpPirates = CleanUpPirates;
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultai/objectives/common/DiplomaticObjective", ["require", "exports", "modules/defaultai/objectives/common/Objective", "modules/defaultai/objectives/common/ObjectiveFamily"], function (require, exports, Objective_1, ObjectiveFamily_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DiplomaticObjective = (function (_super) {
        __extends(DiplomaticObjective, _super);
        function DiplomaticObjective(priority, playerDiplomacy) {
            var _this = _super.call(this, priority) || this;
            _this.family = ObjectiveFamily_1.ObjectiveFamily.Diplomatic;
            _this.playerDiplomacy = playerDiplomacy;
            return _this;
        }
        DiplomaticObjective.family = ObjectiveFamily_1.ObjectiveFamily.Diplomatic;
        return DiplomaticObjective;
    }(Objective_1.Objective));
    exports.DiplomaticObjective = DiplomaticObjective;
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultai/objectives/common/EconomicObjective", ["require", "exports", "modules/defaultai/objectives/common/Objective", "modules/defaultai/objectives/common/ObjectiveFamily"], function (require, exports, Objective_1, ObjectiveFamily_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EconomicObjective = (function (_super) {
        __extends(EconomicObjective, _super);
        function EconomicObjective(priority) {
            var _this = _super.call(this, priority) || this;
            _this.family = ObjectiveFamily_1.ObjectiveFamily.Economic;
            return _this;
        }
        EconomicObjective.family = ObjectiveFamily_1.ObjectiveFamily.Economic;
        return EconomicObjective;
    }(Objective_1.Objective));
    exports.EconomicObjective = EconomicObjective;
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultai/objectives/common/FrontObjective", ["require", "exports", "modules/defaultai/mapai/Front", "modules/defaultai/objectives/common/Objective", "modules/defaultai/objectives/common/ObjectiveFamily"], function (require, exports, Front_1, Objective_1, ObjectiveFamily_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var frontIdGenerator = 0;
    var FrontObjective = (function (_super) {
        __extends(FrontObjective, _super);
        function FrontObjective(score, mapEvaluator, unitEvaluator) {
            var _this = _super.call(this, score) || this;
            _this.family = ObjectiveFamily_1.ObjectiveFamily.Front;
            _this.front = new Front_1.Front(frontIdGenerator++);
            _this.mapEvaluator = mapEvaluator;
            _this.unitEvaluator = unitEvaluator;
            return _this;
        }
        FrontObjective.prototype.evaluateCurrentCombatStrength = function () {
            var _a;
            return (_a = this.unitEvaluator).evaluateCombatStrength.apply(_a, this.front.units);
        };
        FrontObjective.prototype.getRallyPoint = function () {
            return this.mapEvaluator.player.controlledLocations[0];
        };
        FrontObjective.family = ObjectiveFamily_1.ObjectiveFamily.Front;
        return FrontObjective;
    }(Objective_1.Objective));
    exports.FrontObjective = FrontObjective;
});
define("modules/defaultai/objectives/common/MovePriority", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MovePriority;
    (function (MovePriority) {
        MovePriority[MovePriority["Discovery"] = 999] = "Discovery";
        MovePriority[MovePriority["ScoutingPerimeter"] = 8] = "ScoutingPerimeter";
        MovePriority[MovePriority["FightInvadingEnemy"] = 7] = "FightInvadingEnemy";
        MovePriority[MovePriority["Conquer"] = 6] = "Conquer";
        MovePriority[MovePriority["Expansion"] = 4] = "Expansion";
        MovePriority[MovePriority["CleanUpPirates"] = 3] = "CleanUpPirates";
        MovePriority[MovePriority["Heal"] = -1] = "Heal";
    })(MovePriority = exports.MovePriority || (exports.MovePriority = {}));
});
define("modules/defaultai/objectives/common/moveroutines/moveToTarget", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function moveToTarget(front, afterDoneCallback, getMoveTarget) {
        var fleets = front.getAssociatedFleets();
        if (fleets.length <= 0) {
            afterDoneCallback();
            return;
        }
        var finishedMovingCount = 0;
        var afterFleetMoveCallback = function () {
            finishedMovingCount++;
            if (finishedMovingCount >= fleets.length) {
                afterDoneCallback();
            }
        };
        fleets.forEach(function (fleet) {
            var moveTarget = getMoveTarget(fleet);
            fleet.pathFind(moveTarget, undefined, afterFleetMoveCallback);
        });
    }
    exports.moveToTarget = moveToTarget;
});
define("modules/defaultai/objectives/common/Objective", ["require", "exports", "src/IdDictionary", "src/idGenerators"], function (require, exports, IdDictionary_1, idGenerators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Objective = (function () {
        function Objective(score) {
            this.isOngoing = false;
            this.ongoingMultiplier = 1.25;
            this.id = idGenerators_1.idGenerators.objective++;
            this.score = score;
        }
        Object.defineProperty(Objective.prototype, "score", {
            get: function () {
                return this.isOngoing ? this.baseScore * this.ongoingMultiplier : this.baseScore;
            },
            set: function (score) {
                this.baseScore = score;
            },
            enumerable: true,
            configurable: true
        });
        Objective.makeCreatorTemplate = function () {
            var _this = this;
            [
                { member: this.type, memberIdentifier: "type" },
                { member: this.family, memberIdentifier: "family" },
                { member: this.createObjectives, memberIdentifier: "createObjectives" },
                { member: this.updateOngoingObjectivesList, memberIdentifier: "updateOngoingObjectivesList" },
                { member: this.evaluatePriority, memberIdentifier: "evaluatePriority" },
            ].forEach(function (toCheck) {
                if (toCheck.member === undefined) {
                    throw new Error("Objective " + (_this.type || _this) + " lacks required static member " + toCheck.memberIdentifier);
                }
            });
            return ({
                type: this.type,
                family: this.family,
                getUpdatedObjectivesList: function (mapEvaluator, allOngoingObjectives) {
                    var createdObjectives = _this.createObjectives(mapEvaluator, allOngoingObjectives);
                    return _this.updateOngoingObjectivesList(allOngoingObjectives, createdObjectives);
                },
                evaluatePriority: this.evaluatePriority.bind(this),
            });
        };
        Objective.getObjectivesByTarget = function (objectives) {
            var byTarget = new IdDictionary_1.IdDictionary();
            objectives.forEach(function (objective) {
                if (byTarget.has(objective.target)) {
                    throw new Error("Duplicate target id:'" + objective.target.id + "' for objectives of type '" + objective.type + "'");
                }
                else {
                    byTarget.set(objective.target, objective);
                }
            });
            return byTarget;
        };
        Objective.updateTargetedObjectives = function (allOngoingObjectives, createdObjectives) {
            var _this = this;
            var resultingObjectives = [];
            var createdObjectivesByTarget = Objective.getObjectivesByTarget(createdObjectives);
            allOngoingObjectives.forEach(function (objective) {
                if (objective.type === _this.type) {
                    if (createdObjectivesByTarget.has(objective.target)) {
                        var createdObjective = createdObjectivesByTarget.get(objective.target);
                        objective.score = createdObjective.score;
                        objective.isOngoing = true;
                        resultingObjectives.push(objective);
                        createdObjectivesByTarget.delete(objective.target);
                    }
                    else {
                    }
                }
                else {
                    resultingObjectives.push(objective);
                }
            });
            createdObjectivesByTarget.forEach(function (target, objective) {
                resultingObjectives.push(objective);
            });
            return resultingObjectives;
        };
        Objective.updateUniqueObjective = function (allOngoingObjectives, createdObjective) {
            for (var i = 0; i < allOngoingObjectives.length; i++) {
                var objective = allOngoingObjectives[i];
                if (objective.type === createdObjective.type) {
                    objective.score = createdObjective.score;
                    return allOngoingObjectives;
                }
            }
            allOngoingObjectives.push(createdObjective);
            return allOngoingObjectives;
        };
        Objective.replaceObjectives = function (allOngoingObjectives, createdObjectives) {
            var _this = this;
            var resultingObjectives = allOngoingObjectives.filter(function (objective) {
                return objective.type !== _this.type;
            });
            resultingObjectives.push.apply(resultingObjectives, createdObjectives);
            return resultingObjectives;
        };
        return Objective;
    }());
    exports.Objective = Objective;
});
define("modules/defaultai/objectives/common/ObjectiveFamily", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObjectiveFamily;
    (function (ObjectiveFamily) {
        ObjectiveFamily[ObjectiveFamily["Diplomatic"] = 0] = "Diplomatic";
        ObjectiveFamily[ObjectiveFamily["Economic"] = 1] = "Economic";
        ObjectiveFamily[ObjectiveFamily["Front"] = 2] = "Front";
    })(ObjectiveFamily = exports.ObjectiveFamily || (exports.ObjectiveFamily = {}));
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultai/objectives/common/TargetedFrontObjective", ["require", "exports", "modules/defaultai/objectives/common/FrontObjective"], function (require, exports, FrontObjective_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TargetedFrontObjective = (function (_super) {
        __extends(TargetedFrontObjective, _super);
        function TargetedFrontObjective(score, target, mapEvaluator, unitEvaluator) {
            var _this = _super.call(this, score, mapEvaluator, unitEvaluator) || this;
            _this.hasMustered = false;
            _this.target = target;
            _this.musterLocation = mapEvaluator.player.getNearestOwnedStarTo(target);
            return _this;
        }
        TargetedFrontObjective.updateOngoingObjectivesList = function (allOngoingObjectives, createdObjectives) {
            return this.updateTargetedObjectives(allOngoingObjectives, createdObjectives);
        };
        TargetedFrontObjective.prototype.getRallyPoint = function () {
            return this.hasMustered ? this.target : this.musterLocation;
        };
        TargetedFrontObjective.prototype.evaluateDefaultUnitFit = function (unit, front, lowHealthThreshhold, healthAdjust, distanceAdjust) {
            if (lowHealthThreshhold === void 0) { lowHealthThreshhold = 0.75; }
            if (healthAdjust === void 0) { healthAdjust = 1; }
            if (distanceAdjust === void 0) { distanceAdjust = 1; }
            var score = 1;
            var healthPercentage = unit.currentHealth / unit.maxHealth;
            if (healthPercentage < lowHealthThreshhold) {
                score *= healthPercentage * healthAdjust;
            }
            var turnsToReach = unit.getTurnsToReachStar(this.target);
            if (turnsToReach > 0) {
                turnsToReach *= distanceAdjust;
                var distanceMultiplier = 1 / (Math.log(turnsToReach + 2.5) / Math.log(2.5));
                score *= distanceMultiplier;
            }
            if (this.front.hasUnit(unit)) {
                score *= 1.2;
                if (this.hasMustered) {
                    score *= 1.2;
                }
            }
            return score;
        };
        TargetedFrontObjective.prototype.musterAndAttack = function (afterMoveCallback, targetFilter) {
            var _this = this;
            var moveTarget = this.getMoveTarget();
            var fleets = this.front.getAssociatedFleets();
            if (fleets.length <= 0) {
                afterMoveCallback();
                return;
            }
            var finishAllMoveFN = function () {
                var _a;
                var unitsByLocation = _this.front.getUnitsByLocation();
                var strengthAtTarget = (_a = _this.unitEvaluator).evaluateCombatStrength.apply(_a, unitsByLocation[_this.target.id]);
                if (strengthAtTarget >= _this.getMinimumRequiredCombatStrength()) {
                    var targetLocation = _this.target;
                    var player = _this.mapEvaluator.player;
                    var attackTargets = targetLocation.getTargetsForPlayer(player);
                    var targetToAttack = targetFilter ?
                        attackTargets.filter(targetFilter)[0] :
                        attackTargets[0];
                    if (!targetToAttack) {
                        throw new Error("Targeted objective couldn't find target to attack.");
                    }
                    player.attackTarget(targetLocation, targetToAttack, afterMoveCallback);
                }
                else {
                    afterMoveCallback();
                }
            };
            var finishedMovingCount = 0;
            var finishFleetMoveFN = function () {
                finishedMovingCount++;
                if (finishedMovingCount >= fleets.length) {
                    finishAllMoveFN();
                }
            };
            for (var i = 0; i < fleets.length; i++) {
                fleets[i].pathFind(moveTarget, undefined, finishFleetMoveFN);
            }
        };
        TargetedFrontObjective.prototype.getMoveTarget = function () {
            var _a;
            var _this = this;
            var shouldMoveToTarget = false;
            var unitsByLocation = this.front.getUnitsByLocation();
            var fleets = this.front.getAssociatedFleets();
            if (this.hasMustered) {
                shouldMoveToTarget = true;
            }
            else {
                var minimumRequiredStrength = this.getMinimumRequiredCombatStrength();
                var strengthAtMuster = (_a = this.unitEvaluator).evaluateCombatStrength.apply(_a, unitsByLocation[this.musterLocation.id]);
                if (strengthAtMuster >= minimumRequiredStrength) {
                    this.hasMustered = true;
                    shouldMoveToTarget = true;
                }
                else {
                    var fleetsInRange = fleets.filter(function (fleet) { return fleet.hasEnoughMovePointsToMoveTo(_this.target); });
                    var strengthInRange = fleetsInRange.map(function (fleet) { return fleet.units; }).reduce(function (total, units) {
                        var _a;
                        return total + (_a = _this.unitEvaluator).evaluateCombatStrength.apply(_a, units);
                    }, 0);
                    if (strengthInRange >= minimumRequiredStrength) {
                        this.hasMustered = true;
                        shouldMoveToTarget = true;
                    }
                }
            }
            var moveTarget = shouldMoveToTarget ? this.target : this.musterLocation;
            return moveTarget;
        };
        return TargetedFrontObjective;
    }(FrontObjective_1.FrontObjective));
    exports.TargetedFrontObjective = TargetedFrontObjective;
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultai/objectives/Conquer", ["require", "exports", "modules/defaultai/objectives/common/MovePriority", "modules/defaultai/objectives/common/TargetedFrontObjective"], function (require, exports, MovePriority_1, TargetedFrontObjective_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Conquer = (function (_super) {
        __extends(Conquer, _super);
        function Conquer(score, target, mapEvaluator, unitEvaluator) {
            var _this = _super.call(this, score, target, mapEvaluator, unitEvaluator) || this;
            _this.type = "Conquer";
            _this.movePriority = MovePriority_1.MovePriority.Conquer;
            return _this;
        }
        Conquer.createObjectives = function (mapEvaluator, allOngoingObjectives) {
            var possibleTargets = mapEvaluator.player.getNeighboringStars().filter(function (star) {
                if (star.owner.isIndependent) {
                    return false;
                }
                if (!mapEvaluator.player.starIsRevealed(star)) {
                    return false;
                }
                return star.hasBuildingTargetForPlayer(mapEvaluator.player);
            });
            var evaluations = mapEvaluator.evaluateStarTargets(possibleTargets);
            var scores = mapEvaluator.scoreStarTargets(evaluations, function (star, evaluation) {
                var strengthRatio = evaluation.ownInfluence / evaluation.hostileStrength;
                var score = evaluation.desirability * strengthRatio;
                return score;
            });
            return scores.mapToArray(function (star, score) {
                return new Conquer(score, star, mapEvaluator, mapEvaluator.unitEvaluator);
            });
        };
        Conquer.evaluatePriority = function (mapEvaluator, grandStrategyAi) {
            return grandStrategyAi.desireForExpansion;
        };
        Conquer.prototype.execute = function (afterDoneCallback) {
            this.musterAndAttack(afterDoneCallback, function (target) {
                return target.building && target.enemy === target.building.controller;
            });
        };
        Conquer.prototype.evaluateUnitFit = function (unit) {
            var strengthScore = this.unitEvaluator.evaluateCombatStrength(unit);
            return strengthScore * this.evaluateDefaultUnitFit(unit, this.front);
        };
        Conquer.prototype.getMinimumRequiredCombatStrength = function () {
            var enemyStrength = this.mapEvaluator.getHostileStrengthAtStar(this.target);
            return enemyStrength * 1.3;
        };
        Conquer.prototype.getIdealRequiredCombatStrength = function () {
            var enemyStrength = this.mapEvaluator.getHostileStrengthAtStar(this.target);
            return enemyStrength * 1.75;
        };
        Conquer.type = "Conquer";
        return Conquer;
    }(TargetedFrontObjective_1.TargetedFrontObjective));
    exports.Conquer = Conquer;
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultai/objectives/DeclareWar", ["require", "exports", "modules/defaultai/objectives/common/DiplomaticObjective"], function (require, exports, DiplomaticObjective_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DeclareWar = (function (_super) {
        __extends(DeclareWar, _super);
        function DeclareWar(score, target, playerDiplomacy) {
            var _this = _super.call(this, score, playerDiplomacy) || this;
            _this.type = "DeclareWar";
            _this.target = target;
            return _this;
        }
        DeclareWar.createObjectives = function (mapEvaluator, allOngoingObjectives) {
            var metNeighborPlayers = mapEvaluator.player.getNeighboringPlayers().filter(function (player) {
                return mapEvaluator.player.diplomacy.hasMetPlayer(player);
            });
            var declarableNeighbors = metNeighborPlayers.filter(function (player) {
                return mapEvaluator.player.diplomacy.canDeclareWarOn(player);
            });
            return declarableNeighbors.map(function (player) {
                var score = mapEvaluator.getDesireToGoToWarWith(player) *
                    mapEvaluator.getAbilityToGoToWarWith(player);
                return new DeclareWar(score, player, mapEvaluator.player.diplomacy);
            });
        };
        DeclareWar.evaluatePriority = function (mapEvaluator, grandStrategyAi) {
            return grandStrategyAi.desireForWar;
        };
        DeclareWar.updateOngoingObjectivesList = function (allOngoingObjectives, createdObjectives) {
            return this.updateTargetedObjectives(allOngoingObjectives, createdObjectives);
        };
        DeclareWar.prototype.execute = function (afterDoneCallback) {
            this.playerDiplomacy.declareWarOn(this.target);
            afterDoneCallback();
        };
        DeclareWar.type = "DeclareWar";
        return DeclareWar;
    }(DiplomaticObjective_1.DiplomaticObjective));
    exports.DeclareWar = DeclareWar;
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultai/objectives/Discovery", ["require", "exports", "modules/defaultai/objectives/common/MovePriority", "modules/defaultai/objectives/common/TargetedFrontObjective", "modules/defaultai/objectives/common/moveroutines/moveToTarget"], function (require, exports, MovePriority_1, TargetedFrontObjective_1, moveToTarget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Discovery = (function (_super) {
        __extends(Discovery, _super);
        function Discovery(score, target, mapEvaluator, unitEvaluator) {
            var _this = _super.call(this, score, target, mapEvaluator, unitEvaluator) || this;
            _this.type = "Discovery";
            _this.movePriority = MovePriority_1.MovePriority.Discovery;
            return _this;
        }
        Discovery.createObjectives = function (mapEvaluator, allOngoingObjectives) {
            var linksToUnRevealedStars = mapEvaluator.player.getLinksToUnRevealedStars();
            return linksToUnRevealedStars.mapToArray(function (targetStar, linkedStars) {
                var nearestOwnedStar = mapEvaluator.player.getNearestOwnedStarTo(targetStar);
                var distanceToNearestOwnedStar = nearestOwnedStar.getDistanceToStar(targetStar);
                var desirabilityScore = mapEvaluator.evaluateIndividualStarDesirability(targetStar);
                var linksMultiplier = linkedStars.length;
                var distanceMultiplier = 1 / distanceToNearestOwnedStar;
                var score = desirabilityScore * linksMultiplier * distanceMultiplier;
                return new Discovery(score, targetStar, mapEvaluator, mapEvaluator.unitEvaluator);
            });
        };
        Discovery.evaluatePriority = function (mapEvaluator, grandStrategyAi) {
            return grandStrategyAi.desireForExploration;
        };
        Discovery.prototype.execute = function (afterDoneCallback) {
            var _this = this;
            moveToTarget_1.moveToTarget(this.front, afterDoneCallback, function (fleet) {
                return _this.target;
            });
        };
        Discovery.prototype.evaluateUnitFit = function (unit) {
            var scoutingScore = this.unitEvaluator.evaluateUnitScoutingAbility(unit);
            var movementMultiplier = unit.maxMovePoints;
            var score = scoutingScore * movementMultiplier;
            return score * this.evaluateDefaultUnitFit(unit, this.front, 0, 0, 2);
        };
        Discovery.prototype.getMinimumRequiredCombatStrength = function () {
            return 0;
        };
        Discovery.prototype.getIdealRequiredCombatStrength = function () {
            return 0;
        };
        Discovery.type = "Discovery";
        return Discovery;
    }(TargetedFrontObjective_1.TargetedFrontObjective));
    exports.Discovery = Discovery;
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultai/objectives/ExpandManufactoryCapacity", ["require", "exports", "src/Manufactory", "modules/defaultai/objectives/common/EconomicObjective"], function (require, exports, Manufactory_1, EconomicObjective_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExpandManufactoryCapacity = (function (_super) {
        __extends(ExpandManufactoryCapacity, _super);
        function ExpandManufactoryCapacity(score, player, target) {
            var _this = _super.call(this, score) || this;
            _this.type = "ExpandManufactoryCapacity";
            _this.player = player;
            _this.target = target;
            return _this;
        }
        ExpandManufactoryCapacity.createObjectives = function (mapEvaluator, allOngoingObjectives) {
            var starsThatCanExpand = mapEvaluator.player.controlledLocations.filter(function (star) {
                return !star.manufactory || star.manufactory.capacity < star.manufactory.maxCapacity;
            });
            return starsThatCanExpand.map(function (star) {
                var upgradeScore = star.manufactory ?
                    1 * star.manufactory.unitStatsModifier * star.manufactory.unitHealthModifier :
                    1;
                var upgradeCost = ExpandManufactoryCapacity.getCostForStar(star);
                var costScore = Manufactory_1.Manufactory.getBuildCost() / upgradeCost;
                var score = costScore + Math.pow(upgradeScore, 2);
                return new ExpandManufactoryCapacity(score, mapEvaluator.player, star);
            });
        };
        ExpandManufactoryCapacity.evaluatePriority = function (mapEvaluator, grandStrategyAi) {
            return grandStrategyAi.desireForConsolidation;
        };
        ExpandManufactoryCapacity.updateOngoingObjectivesList = function (allOngoingObjectives, createdObjectives) {
            return this.updateTargetedObjectives(allOngoingObjectives, createdObjectives);
        };
        ExpandManufactoryCapacity.getCostForStar = function (star) {
            return star.manufactory ?
                star.manufactory.getCapacityUpgradeCost() :
                Manufactory_1.Manufactory.getBuildCost();
        };
        ExpandManufactoryCapacity.prototype.execute = function (afterDoneCallback) {
            var upgradeCost = ExpandManufactoryCapacity.getCostForStar(this.target);
            var canAffordUpgrade = upgradeCost <= this.player.money;
            if (canAffordUpgrade) {
                if (this.target.manufactory) {
                    this.target.manufactory.upgradeCapacity(1);
                }
                else {
                    this.target.buildManufactory();
                    this.player.money -= Manufactory_1.Manufactory.getBuildCost();
                }
            }
            afterDoneCallback();
        };
        ExpandManufactoryCapacity.type = "ExpandManufactoryCapacity";
        return ExpandManufactoryCapacity;
    }(EconomicObjective_1.EconomicObjective));
    exports.ExpandManufactoryCapacity = ExpandManufactoryCapacity;
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultai/objectives/Expansion", ["require", "exports", "modules/defaultai/objectives/common/MovePriority", "modules/defaultai/objectives/common/TargetedFrontObjective"], function (require, exports, MovePriority_1, TargetedFrontObjective_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Expansion = (function (_super) {
        __extends(Expansion, _super);
        function Expansion(score, target, mapEvaluator, unitEvaluator) {
            var _this = _super.call(this, score, target, mapEvaluator, unitEvaluator) || this;
            _this.type = "Expansion";
            _this.movePriority = MovePriority_1.MovePriority.Expansion;
            return _this;
        }
        Expansion.createObjectives = function (mapEvaluator, allOngoingObjectives) {
            var independentNeighborStars = mapEvaluator.getIndependentNeighborStars();
            var evaluations = mapEvaluator.evaluateStarTargets(independentNeighborStars);
            var scores = mapEvaluator.scoreIndependentTargets(evaluations);
            return scores.mapToArray(function (star, score) {
                return new Expansion(score, star, mapEvaluator, mapEvaluator.unitEvaluator);
            });
        };
        Expansion.evaluatePriority = function (mapEvaluator, grandStrategyAi) {
            return grandStrategyAi.desireForExpansion;
        };
        Expansion.prototype.execute = function (afterDoneCallback) {
            this.musterAndAttack(afterDoneCallback, function (target) {
                return target.enemy.isIndependent;
            });
        };
        Expansion.prototype.evaluateUnitFit = function (unit) {
            var strengthScore = this.unitEvaluator.evaluateCombatStrength(unit);
            return strengthScore * this.evaluateDefaultUnitFit(unit, this.front);
        };
        Expansion.prototype.getMinimumRequiredCombatStrength = function () {
            var enemyStrength = this.mapEvaluator.getHostileStrengthAtStar(this.target);
            return enemyStrength * 1.2;
        };
        Expansion.prototype.getIdealRequiredCombatStrength = function () {
            var enemyStrength = this.mapEvaluator.getHostileStrengthAtStar(this.target);
            return enemyStrength * 1.6;
        };
        Expansion.type = "Expansion";
        return Expansion;
    }(TargetedFrontObjective_1.TargetedFrontObjective));
    exports.Expansion = Expansion;
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultai/objectives/FightInvadingEnemy", ["require", "exports", "modules/defaultai/objectives/common/MovePriority", "modules/defaultai/objectives/common/TargetedFrontObjective"], function (require, exports, MovePriority_1, TargetedFrontObjective_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FightInvadingEnemy = (function (_super) {
        __extends(FightInvadingEnemy, _super);
        function FightInvadingEnemy(score, target, mapEvaluator, unitEvaluator) {
            var _this = _super.call(this, score, target, mapEvaluator, unitEvaluator) || this;
            _this.type = "FightInvadingEnemy";
            _this.movePriority = MovePriority_1.MovePriority.FightInvadingEnemy;
            return _this;
        }
        FightInvadingEnemy.createObjectives = function (mapEvaluator, allOngoingObjectives) {
            var ownedStarsWithInvaders = mapEvaluator.player.controlledLocations.filter(function (star) {
                var hostileUnits = star.getUnits(function (player) {
                    return (!player.isIndependent &&
                        mapEvaluator.player.diplomacy.canAttackFleetOfPlayer(player));
                });
                return hostileUnits.length > 0;
            });
            var evaluations = mapEvaluator.evaluateStarTargets(ownedStarsWithInvaders);
            var scores = mapEvaluator.scoreStarTargets(evaluations, function (star, evaluation) {
                var strengthRatio = evaluation.ownInfluence / evaluation.hostileStrength;
                var score = evaluation.desirability * strengthRatio;
                return score;
            });
            return scores.mapToArray(function (star, score) {
                return new FightInvadingEnemy(score, star, mapEvaluator, mapEvaluator.unitEvaluator);
            });
        };
        FightInvadingEnemy.evaluatePriority = function (mapEvaluator, grandStrategyAi) {
            return grandStrategyAi.desireForConsolidation;
        };
        FightInvadingEnemy.prototype.execute = function (afterDoneCallback) {
            this.musterAndAttack(afterDoneCallback, function (target) {
                return !target.enemy.isIndependent;
            });
        };
        FightInvadingEnemy.prototype.evaluateUnitFit = function (unit) {
            var strengthScore = this.unitEvaluator.evaluateCombatStrength(unit);
            return strengthScore * this.evaluateDefaultUnitFit(unit, this.front);
        };
        FightInvadingEnemy.prototype.getMinimumRequiredCombatStrength = function () {
            var enemyStrength = this.mapEvaluator.getIndependentStrengthAtStar(this.target);
            return enemyStrength * 1.2;
        };
        FightInvadingEnemy.prototype.getIdealRequiredCombatStrength = function () {
            var enemyStrength = this.mapEvaluator.getIndependentStrengthAtStar(this.target);
            return enemyStrength * 2;
        };
        FightInvadingEnemy.type = "FightInvadingEnemy";
        return FightInvadingEnemy;
    }(TargetedFrontObjective_1.TargetedFrontObjective));
    exports.FightInvadingEnemy = FightInvadingEnemy;
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultai/objectives/Heal", ["require", "exports", "modules/defaultai/objectives/common/FrontObjective", "modules/defaultai/objectives/common/MovePriority", "modules/defaultai/objectives/common/moveroutines/moveToTarget"], function (require, exports, FrontObjective_1, MovePriority_1, moveToTarget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Heal = (function (_super) {
        __extends(Heal, _super);
        function Heal(score, mapEvaluator, unitEvaluator) {
            var _this = _super.call(this, score, mapEvaluator, unitEvaluator) || this;
            _this.type = "Heal";
            _this.movePriority = MovePriority_1.MovePriority.Heal;
            return _this;
        }
        Heal.createObjectives = function (mapEvaluator, allOngoingObjectives) {
            return [new Heal(1, mapEvaluator, mapEvaluator.unitEvaluator)];
        };
        Heal.evaluatePriority = function (mapEvaluator, grandStrategyAi) {
            return 0.5;
        };
        Heal.updateOngoingObjectivesList = function (allOngoingObjectives, createdObjectives) {
            return this.updateUniqueObjective(allOngoingObjectives, createdObjectives[0]);
        };
        Heal.prototype.execute = function (afterDoneCallback) {
            moveToTarget_1.moveToTarget(this.front, afterDoneCallback, function (fleet) {
                return fleet.player.getNearestOwnedStarTo(fleet.location);
            });
        };
        Heal.prototype.evaluateUnitFit = function (unit) {
            var healthPercentage = unit.currentHealth / unit.maxHealth;
            return 1 - healthPercentage;
        };
        Heal.prototype.getMinimumRequiredCombatStrength = function () {
            return 0;
        };
        Heal.prototype.getIdealRequiredCombatStrength = function () {
            return 0;
        };
        Heal.type = "Heal";
        return Heal;
    }(FrontObjective_1.FrontObjective));
    exports.Heal = Heal;
});
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("modules/defaultai/objectives/ScoutingPerimeter", ["require", "exports", "src/ValuesByStar", "modules/defaultai/objectives/common/MovePriority", "modules/defaultai/objectives/common/TargetedFrontObjective", "modules/defaultai/objectives/common/moveroutines/moveToTarget"], function (require, exports, ValuesByStar_1, MovePriority_1, TargetedFrontObjective_1, moveToTarget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScoutingPerimeter = (function (_super) {
        __extends(ScoutingPerimeter, _super);
        function ScoutingPerimeter(score, target, mapEvaluator, unitEvaluator) {
            var _this = _super.call(this, score, target, mapEvaluator, unitEvaluator) || this;
            _this.type = "ScoutingPerimeter";
            _this.movePriority = MovePriority_1.MovePriority.ScoutingPerimeter;
            return _this;
        }
        ScoutingPerimeter.createObjectives = function (mapEvaluator, allOngoingObjectives) {
            var playersToEstablishPerimeterAgainst = mapEvaluator.player.diplomacy.getMetPlayers().filter(function (player) {
                return player.diplomacy.canAttackBuildingOfPlayer(mapEvaluator.player);
            });
            var allScores = playersToEstablishPerimeterAgainst.map(function (player) {
                return mapEvaluator.getScoredPerimeterLocationsAgainstPlayer(player, 1, true);
            });
            var mergedScores = new ValuesByStar_1.ValuesByStar();
            mergedScores.merge.apply(mergedScores, [function () {
                    var scores = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        scores[_i] = arguments[_i];
                    }
                    return scores.reduce(function (total, current) {
                        return total + current;
                    }, 0);
                }].concat(allScores));
            return mergedScores.mapToArray(function (star, score) {
                return new ScoutingPerimeter(score, star, mapEvaluator, mapEvaluator.unitEvaluator);
            });
        };
        ScoutingPerimeter.evaluatePriority = function (mapEvaluator, grandStrategyAi) {
            return grandStrategyAi.desireForConsolidation;
        };
        ScoutingPerimeter.prototype.execute = function (afterDoneCallback) {
            var _this = this;
            moveToTarget_1.moveToTarget(this.front, afterDoneCallback, function (fleet) {
                return _this.target;
            });
        };
        ScoutingPerimeter.prototype.evaluateUnitFit = function (unit) {
            var scoutingScore = this.unitEvaluator.evaluateUnitScoutingAbility(unit);
            return scoutingScore * this.evaluateDefaultUnitFit(unit, this.front, 0, 0, 2);
        };
        ScoutingPerimeter.prototype.getMinimumRequiredCombatStrength = function () {
            return 0;
        };
        ScoutingPerimeter.prototype.getIdealRequiredCombatStrength = function () {
            return 0;
        };
        ScoutingPerimeter.type = "ScoutingPerimeter";
        return ScoutingPerimeter;
    }(TargetedFrontObjective_1.TargetedFrontObjective));
    exports.ScoutingPerimeter = ScoutingPerimeter;
});
//# sourceMappingURL=index.js.map