define("src/AbilityTargetDisplayData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AbilityTargetType;
    (function (AbilityTargetType) {
        AbilityTargetType[AbilityTargetType["Primary"] = 1] = "Primary";
        AbilityTargetType[AbilityTargetType["Secondary"] = 2] = "Secondary";
        AbilityTargetType[AbilityTargetType["Random"] = 4] = "Random";
    })(AbilityTargetType = exports.AbilityTargetType || (exports.AbilityTargetType = {}));
    var AbilityTargetEffect;
    (function (AbilityTargetEffect) {
        AbilityTargetEffect[AbilityTargetEffect["Positive"] = 1] = "Positive";
        AbilityTargetEffect[AbilityTargetEffect["Negative"] = 2] = "Negative";
        AbilityTargetEffect[AbilityTargetEffect["Random"] = 4] = "Random";
    })(AbilityTargetEffect = exports.AbilityTargetEffect || (exports.AbilityTargetEffect = {}));
    function mergeAbilityTargetDisplayDataById() {
        var toMerge = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            toMerge[_i] = arguments[_i];
        }
        var merged = {};
        toMerge.forEach(function (data) {
            for (var unitId in data) {
                if (!merged[unitId]) {
                    merged[unitId] =
                        {
                            targetEffect: data[unitId].targetEffect,
                            targetType: data[unitId].targetType,
                        };
                }
                else {
                    merged[unitId].targetEffect = merged[unitId].targetEffect | data[unitId].targetEffect;
                    merged[unitId].targetType = merged[unitId].targetType | data[unitId].targetType;
                }
            }
        });
        return merged;
    }
    exports.mergeAbilityTargetDisplayDataById = mergeAbilityTargetDisplayDataById;
});
define("src/AbilityUseEffectQueue", ["require", "exports", "src/utility"], function (require, exports, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AbilityUseEffectQueue = (function () {
        function AbilityUseEffectQueue(battleScene, callbacks) {
            this.queue = [];
            this.battleScene = battleScene;
            for (var key in callbacks) {
                this[key] = callbacks[key];
            }
            this.triggerEffect = this.triggerEffect.bind(this);
            this.finishEffect = this.finishEffect.bind(this);
        }
        AbilityUseEffectQueue.squashEffects = function (parent, toSquash, parentIsMostRecent) {
            if (parentIsMostRecent === void 0) { parentIsMostRecent = false; }
            var squashedchangedUnitDisplayData = utility_1.shallowExtend.apply(void 0, [{},
                parent.changedUnitDisplayData].concat(toSquash.map(function (effect) { return effect.changedUnitDisplayData; })));
            if (parentIsMostRecent) {
                var squashedEffect = utility_1.shallowExtend({}, { changedUnitDisplayData: squashedchangedUnitDisplayData }, parent);
                return squashedEffect;
            }
            else {
                var squashedEffect = utility_1.shallowExtend({}, parent, { changedUnitDisplayData: squashedchangedUnitDisplayData });
                return squashedEffect;
            }
        };
        AbilityUseEffectQueue.squashEffectsWithoutVfx = function (sourceEffects) {
            var squashed = [];
            var effectsToSquash = [];
            for (var i = sourceEffects.length - 1; i >= 0; i--) {
                var effect = sourceEffects[i];
                if (effect.vfx) {
                    if (effectsToSquash.length > 0) {
                        var squashedEffect = AbilityUseEffectQueue.squashEffects(effect, effectsToSquash);
                        effectsToSquash = [];
                        squashed.push(squashedEffect);
                    }
                    else {
                        squashed.push(effect);
                    }
                }
                else {
                    effectsToSquash.unshift(effect);
                }
            }
            if (effectsToSquash.length > 0) {
                var lastEffectWithVfx = squashed.pop();
                squashed.push(AbilityUseEffectQueue.squashEffects(lastEffectWithVfx, effectsToSquash, true));
            }
            squashed.reverse();
            return squashed;
        };
        AbilityUseEffectQueue.prototype.addEffects = function (effects) {
            var _a;
            (_a = this.queue).push.apply(_a, AbilityUseEffectQueue.squashEffectsWithoutVfx(effects));
        };
        AbilityUseEffectQueue.prototype.playOnce = function () {
            this.currentEffect = this.queue.shift() || null;
            if (!this.currentEffect) {
                this.handleEndOfQueue();
                return;
            }
            if (this.onEffectStart) {
                this.onEffectStart(this.currentEffect);
            }
            this.battleScene.handleAbilityUse({
                vfxTemplate: this.currentEffect.vfx,
                abilityUseEffect: this.currentEffect,
                user: this.currentEffect.vfxUser,
                target: this.currentEffect.vfxTarget,
                triggerEffectCallback: this.triggerEffect,
                onVfxStartCallback: this.onVfxStart,
                afterFinishedCallback: this.finishEffect,
            });
        };
        AbilityUseEffectQueue.prototype.triggerEffect = function () {
            if (this.onEffectTrigger) {
                this.onEffectTrigger(this.currentEffect);
            }
        };
        AbilityUseEffectQueue.prototype.finishEffect = function () {
            this.currentEffect = null;
            if (this.onCurrentFinished) {
                this.onCurrentFinished();
            }
        };
        AbilityUseEffectQueue.prototype.handleEndOfQueue = function () {
            var _this = this;
            this.battleScene.updateUnits(function () {
                if (_this.onAllFinished) {
                    _this.onAllFinished();
                }
            });
        };
        return AbilityUseEffectQueue;
    }());
    exports.AbilityUseEffectQueue = AbilityUseEffectQueue;
});
define("src/activeModuleData", ["require", "exports", "src/ModuleData"], function (require, exports, ModuleData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.activeModuleData = new ModuleData_1.ModuleData();
});
define("src/activePlayer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function setActivePlayer(player) {
        exports.activePlayer = player;
    }
    exports.setActivePlayer = setActivePlayer;
});
define("src/AiController", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AiController = (function () {
        function AiController(template) {
            this.template = template;
            this.personality = template.personality;
        }
        AiController.prototype.processTurn = function (afterFinishedCallback) {
            this.template.processTurn(afterFinishedCallback);
        };
        AiController.prototype.createBattleFormation = function (availableUnits, hasScouted, enemyUnits, enemyFormation) {
            return this.template.createBattleFormation(availableUnits, hasScouted, enemyUnits, enemyFormation);
        };
        AiController.prototype.respondToTradeOffer = function (receivedOffer) {
            return this.template.respondToTradeOffer(receivedOffer);
        };
        AiController.prototype.serialize = function () {
            return ({
                templateType: this.template.type,
                templateData: this.template.serialize(),
                personality: this.personality,
            });
        };
        return AiController;
    }());
    exports.AiController = AiController;
});
define("src/App", ["require", "exports", "rng-js", "localforage", "src/Game", "src/GameLoader", "src/MapRenderer", "src/GameModuleInitializationPhase", "src/ModuleInitializer", "src/Options", "src/Player", "src/PlayerControl", "src/ReactUI", "src/Renderer", "src/activeModuleData", "src/activePlayer", "src/centerCameraOnPosition", "src/idGenerators", "src/handleError", "src/ModuleStore", "src/notifications/NotificationFilter", "src/debug", "src/reviveSaveData", "src/utility", "src/notifications/NotificationStore", "src/notifications/activeNotificationStore", "src/tutorials/TutorialStatus", "src/notifications/PlayerNotificationSubscriber", "src/storageStrings"], function (require, exports, RNG, localForage, Game_1, GameLoader_1, MapRenderer_1, GameModuleInitializationPhase_1, ModuleInitializer_1, Options_1, Player_1, PlayerControl_1, ReactUI_1, Renderer_1, activeModuleData_1, activePlayer_1, centerCameraOnPosition_1, idGenerators_1, handleError_1, ModuleStore_1, NotificationFilter_1, debug, reviveSaveData_1, utility_1, NotificationStore_1, activeNotificationStore_1, TutorialStatus_1, PlayerNotificationSubscriber_1, storageStrings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App() {
            var _this = this;
            var initialModules = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                initialModules[_i] = arguments[_i];
            }
            this.version = "0.4.0";
            this.initialModules = [];
            PIXI.utils.skipHello();
            this.cleanUpStorage();
            window.onhashchange = function () {
                _this.destroy();
                _this.initUI();
                _this.makeApp();
            };
            this.seed = "" + Math.random();
            Math.random = RNG.prototype.uniform.bind(new RNG(this.seed));
            window.onerror = handleError_1.handleError;
            this.initialModules = initialModules;
            ModuleStore_1.activeModuleStore.getModules.apply(ModuleStore_1.activeModuleStore, initialModules).then(function (gameModules) {
                _this.moduleInitializer = new ModuleInitializer_1.ModuleInitializer(activeModuleData_1.activeModuleData, ModuleStore_1.activeModuleStore, gameModules);
            }).then(function () {
                return utility_1.loadDom();
            }).then(function () {
                debug.log("init", "DOM loaded");
                _this.initUI();
                window.setTimeout(function () {
                    return _this.moduleInitializer.initModulesNeededForPhase(GameModuleInitializationPhase_1.GameModuleInitializationPhase.AppInit).then(function () {
                        return Promise.all([
                            Options_1.options.load(),
                            TutorialStatus_1.tutorialStatus.load(),
                        ]);
                    }).then(function () {
                        debug.log("init", "Finish loading data needed to init app");
                        _this.makeApp();
                    });
                }, 0);
            });
        }
        App.prototype.makeGameFromSetup = function (map, players) {
            var _this = this;
            this.destroy();
            this.initUI();
            this.moduleInitializer.initModulesNeededForPhase(GameModuleInitializationPhase_1.GameModuleInitializationPhase.GameStart).then(function () {
                _this.initGame(new Game_1.Game(map, players)).then(function () {
                    _this.reactUI.switchScene("galaxyMap");
                });
            });
        };
        App.prototype.load = function (saveKey, remakeUi) {
            var _this = this;
            if (remakeUi === void 0) { remakeUi = true; }
            return localForage.getItem(saveKey).then(function (rawData) {
                if (!rawData) {
                    throw new Error("Couldn't fetch save data with key " + saveKey);
                }
                var parsedData = JSON.parse(rawData);
                return reviveSaveData_1.reviveSaveData(parsedData, _this.version).then(function (data) {
                    idGenerators_1.idGenerators.setValues(data.idGenerators);
                    if (remakeUi) {
                        _this.destroy();
                        _this.initUI();
                    }
                    return _this.moduleInitializer.initModulesNeededForPhase(GameModuleInitializationPhase_1.GameModuleInitializationPhase.GameStart).then(function () {
                        var game = new GameLoader_1.GameLoader().deserializeGame(data.gameData);
                        game.gameStorageKey = saveKey;
                        return _this.initGame(game, data.cameraLocation).then(function () {
                            _this.reactUI.switchScene("galaxyMap");
                        });
                    });
                });
            });
        };
        App.prototype.makeApp = function () {
            var _this = this;
            var startTime = Date.now();
            this.moduleInitializer.progressivelyInitModulesByPhase(GameModuleInitializationPhase_1.GameModuleInitializationPhase.AppInit + 1);
            var optionsInUrl = this.getOptionsInUrl();
            var initialScene = optionsInUrl.initialScene;
            var finalizeMakingApp = function (scene) {
                _this.reactUI.switchScene(scene).then(function () {
                    debug.log("init", "Init app in " + (Date.now() - startTime) + "ms");
                });
            };
            if (initialScene === "galaxyMap" || optionsInUrl.params.save) {
                this.moduleInitializer.initModulesNeededForPhase(GameModuleInitializationPhase_1.GameModuleInitializationPhase.GameStart).then(function () {
                    if (optionsInUrl.params.save) {
                        var saveKey = storageStrings_1.storageStrings.savePrefix + optionsInUrl.params.save;
                        return _this.load(saveKey, false);
                    }
                    else {
                        return _this.initGame(_this.makeGame());
                    }
                }).then(function () {
                    finalizeMakingApp("galaxyMap");
                });
            }
            else {
                finalizeMakingApp(initialScene);
            }
        };
        App.prototype.destroy = function () {
            if (this.game) {
                this.game.destroy();
                this.game = null;
            }
            if (this.mapRenderer) {
                this.mapRenderer.destroy();
                this.mapRenderer = null;
            }
            if (this.renderer) {
                this.renderer.destroy();
                this.renderer = null;
            }
            if (this.playerControl) {
                this.playerControl.destroy();
                this.playerControl = null;
            }
            if (this.reactUI) {
                this.reactUI.destroy();
                this.reactUI = null;
            }
        };
        App.prototype.initUI = function () {
            var reactContainer = document.getElementById("react-container");
            if (!reactContainer) {
                throw new Error("Couldn't get react container");
            }
            this.reactUI = new ReactUI_1.ReactUI(reactContainer, this.moduleInitializer);
        };
        App.prototype.initGame = function (game, initialCameraPosition) {
            var _this = this;
            this.game = game;
            if (!activeNotificationStore_1.activeNotificationStore) {
                activeNotificationStore_1.setActiveNotificationStore(new NotificationStore_1.NotificationStore());
                activeNotificationStore_1.activeNotificationStore.currentTurn = game.turnNumber;
            }
            activePlayer_1.setActivePlayer(game.players[0]);
            activePlayer_1.activePlayer.isAi = false;
            if (this.playerControl) {
                this.playerControl.removeEventListeners();
            }
            this.playerControl = new PlayerControl_1.PlayerControl(activePlayer_1.activePlayer);
            game.players.forEach(function (player) {
                if (!player.isIndependent) {
                    if (!player.notificationLog) {
                        player.notificationLog = new PlayerNotificationSubscriber_1.PlayerNotificationSubscriber(player);
                    }
                    player.notificationLog.registerToNotificationStore(activeNotificationStore_1.activeNotificationStore);
                }
                if (!player.aiController) {
                    player.aiController = player.makeRandomAiController(game);
                }
            });
            return NotificationFilter_1.activeNotificationFilter.load().then(function () {
                activeModuleData_1.activeModuleData.scripts.game.afterInit.forEach(function (script) {
                    script(game);
                });
                _this.initDisplay(game, activePlayer_1.activePlayer);
                _this.hookUI(game, activePlayer_1.activePlayer, _this.playerControl, _this.renderer, _this.mapRenderer);
                var pointToCenterCameraOn = initialCameraPosition || activePlayer_1.activePlayer.controlledLocations[0];
                centerCameraOnPosition_1.centerCameraOnPosition(pointToCenterCameraOn);
            });
        };
        App.prototype.initDisplay = function (game, player) {
            this.renderer = new Renderer_1.Renderer(game.galaxyMap.seed, activeModuleData_1.activeModuleData.mapBackgroundDrawingFunction);
            this.mapRenderer = new MapRenderer_1.MapRenderer(game.galaxyMap, player);
            this.mapRenderer.setParent(this.renderer.layers.map);
            this.mapRenderer.init();
        };
        App.prototype.hookUI = function (game, player, playerControl, renderer, mapRenderer) {
            this.reactUI.game = game;
            this.reactUI.player = player;
            this.reactUI.playerControl = playerControl;
            this.reactUI.renderer = renderer;
            this.reactUI.mapRenderer = mapRenderer;
        };
        App.prototype.getOptionsInUrl = function () {
            var urlParser = document.createElement("a");
            urlParser.href = document.URL;
            var hash = urlParser.hash;
            var initialScene = hash ?
                hash.slice(1) :
                "setupGame";
            var params = new URLSearchParams(urlParser.search.slice(1));
            return ({
                initialScene: initialScene,
                params: {
                    save: params.get("save"),
                },
            });
        };
        App.prototype.makeGame = function () {
            var playerData = this.makePlayers();
            var players = playerData.players;
            var map = this.makeMap(playerData);
            var game = new Game_1.Game(map, players);
            return game;
        };
        App.prototype.makePlayers = function () {
            var players = [];
            var candidateRaces = Object.keys(activeModuleData_1.activeModuleData.templates.Races).map(function (raceKey) {
                return activeModuleData_1.activeModuleData.templates.Races[raceKey];
            }).filter(function (raceTemplate) {
                return !raceTemplate.isNotPlayable;
            });
            for (var i = 0; i < 5; i++) {
                players.push(new Player_1.Player({
                    isAi: i > 0,
                    isIndependent: false,
                    race: utility_1.getRandomArrayItem(candidateRaces),
                    money: 1000,
                }));
            }
            return ({
                players: players,
            });
        };
        App.prototype.makeMap = function (playerData) {
            var optionValues = {
                defaultOptions: {
                    height: 1200,
                    width: 1200,
                    starCount: 30,
                },
                basicOptions: {
                    arms: 5,
                    centerDensity: 40,
                    starSizeRegularity: 100,
                },
            };
            var mapGenResult = activeModuleData_1.activeModuleData.getDefaultMap().mapGenFunction(optionValues, playerData.players);
            var galaxyMap = mapGenResult.makeMap();
            return galaxyMap;
        };
        App.prototype.cleanUpStorage = function () {
            var _this = this;
            localForage.getItem(storageStrings_1.storageStrings.appVersion).then(function (storedAppVersion) {
                var reviversByAppVersion = {
                    "0.0.0": [
                        function removeSeparatelyStoredLanguageSetting() {
                            localStorage.removeItem(storageStrings_1.storageStrings.deprecated_language);
                        },
                    ],
                    "0.1.0": [
                        function onlyUseOneSlotForStoredOptions() {
                            var storedOptions = localStorage.getItem(storageStrings_1.storageStrings.deprecated_options);
                            localStorage.setItem(storageStrings_1.storageStrings.options, storedOptions);
                            localStorage.removeItem(storageStrings_1.storageStrings.deprecated_options);
                        },
                        function onlyUseOneSlotForStoredNotificationFilterSettings() {
                            var storedNotificationFilter = localStorage.getItem(storageStrings_1.storageStrings.deprecated_notificationFilter);
                            localStorage.setItem(storageStrings_1.storageStrings.notificationFilter, storedNotificationFilter);
                            localStorage.removeItem(storageStrings_1.storageStrings.deprecated_notificationFilter);
                        },
                        function moveStoredDataFromLocalStorageToLocalForage() {
                            Object.keys(localStorage).filter(function (key) { return key.indexOf(storageStrings_1.storageStrings.basePrefix) !== -1; }).forEach(function (key) {
                                localForage.setItem(key, localStorage.getItem(key)).then(function () {
                                    localStorage.removeItem(key);
                                });
                            });
                        }
                    ]
                };
                var reviversToExecute = reviveSaveData_1.fetchNeededReviversForData(storedAppVersion || "", _this.version, reviversByAppVersion);
                reviversToExecute.forEach(function (reviverFN) {
                    debug.log("saves", "Cleaning up outdated stored data with function '" + utility_1.getFunctionName(reviverFN) + "'");
                    reviverFN();
                });
                localForage.setItem(storageStrings_1.storageStrings.appVersion, _this.version);
            });
        };
        return App;
    }());
    function createApp() {
        var initialModules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            initialModules[_i] = arguments[_i];
        }
        exports.app = new (App.bind.apply(App, [void 0].concat(initialModules)))();
        return exports.app;
    }
    exports.createApp = createApp;
});
define("src/AttitudeModifier", ["require", "exports", "src/utility"], function (require, exports, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AttitudeModifier = (function () {
        function AttitudeModifier(props) {
            this.isOverRidden = false;
            this.hasFixedStrength = false;
            this.template = props.template;
            this.startTurn = props.startTurn;
            this.currentTurn = this.startTurn;
            this.hasFixedStrength = props.hasFixedStrength;
            if (props.endTurn !== undefined) {
                this.endTurn = props.endTurn;
            }
            else {
                this.endTurn = this.startTurn + this.template.duration;
            }
            if (props.strength !== undefined) {
                this.strength = props.strength;
            }
            else if (this.template.baseEffect !== undefined) {
                this.strength = this.template.baseEffect;
            }
            else if (props.evaluation && this.template.getEffectFromEvaluation) {
                this.setStrength(props.evaluation);
            }
            else {
                throw new Error("Attitude modifier " + this.template.type + " couldn't initialize with a strength value.");
            }
        }
        AttitudeModifier.prototype.update = function (evaluation) {
            this.currentTurn = evaluation.currentTurn;
            if (!this.hasFixedStrength) {
                this.setStrength(evaluation);
            }
        };
        AttitudeModifier.prototype.refresh = function (newModifier) {
            this.startTurn = newModifier.startTurn;
            this.endTurn = newModifier.endTurn;
            this.strength = newModifier.strength;
        };
        AttitudeModifier.prototype.getAdjustedStrength = function (currentTurn) {
            if (currentTurn === void 0) { currentTurn = this.currentTurn; }
            var freshenss = this.getFreshness(currentTurn);
            return Math.round(this.strength * freshenss);
        };
        AttitudeModifier.prototype.shouldEnd = function (evaluation) {
            if (this.hasExpired(evaluation.currentTurn)) {
                return true;
            }
            else if (this.template.endCondition) {
                return this.template.endCondition(evaluation);
            }
            else if (this.template.duration < 0 && this.template.startCondition) {
                return !this.template.startCondition(evaluation);
            }
            else {
                return false;
            }
        };
        AttitudeModifier.prototype.serialize = function () {
            var data = {
                templateType: this.template.type,
                startTurn: this.startTurn,
                endTurn: this.endTurn,
                strength: this.strength,
                hasFixedStrength: this.hasFixedStrength,
            };
            return data;
        };
        AttitudeModifier.prototype.setStrength = function (evaluation) {
            if (this.template.baseEffect) {
                this.strength = this.template.baseEffect;
            }
            else if (this.template.getEffectFromEvaluation) {
                this.strength = this.template.getEffectFromEvaluation(evaluation);
            }
            else {
                throw new Error("Attitude modifier " + this.template.type + " has no constant effect " +
                    "or effect from evaluation defined");
            }
            return this.strength;
        };
        AttitudeModifier.prototype.getFreshness = function (currentTurn) {
            if (currentTurn === void 0) { currentTurn = this.currentTurn; }
            if (!isFinite(this.endTurn)) {
                return 1;
            }
            else {
                if (!isFinite(this.template.decayRate)) {
                    throw new Error("Attitude modifier " + this.template.type + " has finite duration but no decayRate set.");
                }
                else {
                    var base = 1 - utility_1.getRelativeValue(currentTurn, this.startTurn, this.endTurn);
                    return Math.pow(base, this.template.decayRate);
                }
            }
        };
        AttitudeModifier.prototype.hasExpired = function (currentTurn) {
            if (currentTurn === void 0) { currentTurn = this.currentTurn; }
            return (this.endTurn >= 0 && currentTurn > this.endTurn);
        };
        return AttitudeModifier;
    }());
    exports.AttitudeModifier = AttitudeModifier;
});
define("src/BackgroundDrawer", ["require", "exports", "pixi.js", "src/pixiWrapperFunctions"], function (require, exports, PIXI, pixiWrapperFunctions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BackgroundDrawer = (function () {
        function BackgroundDrawer(props) {
            this.resizeBuffer = {
                width: 15,
                height: 15,
            };
            this.drawBackgroundFN = props.drawBackgroundFN;
            this.seed = props.seed;
            this.blurFilter = new PIXI.filters.BlurFilter();
            this.blurFilter.blur = 1;
            this.pixiContainer = new PIXI.Container();
            if (props.renderer) {
                this.setExternalRenderer(props.renderer);
            }
        }
        BackgroundDrawer.prototype.setExternalRenderer = function (renderer) {
            this.renderer = renderer;
            this.hasExternalRenderer = Boolean(renderer);
        };
        BackgroundDrawer.prototype.destroy = function () {
            if (!this.hasExternalRenderer) {
                this.renderer.destroy(true);
                this.renderer = null;
            }
            this.containerElement = null;
            this.destroyOldBackground();
            this.pixiContainer.removeChildren();
            this.blurFilter = null;
        };
        BackgroundDrawer.prototype.bindRendererView = function (containerElement) {
            if (this.hasExternalRenderer) {
                this.containerElement = containerElement;
                return;
            }
            if (this.containerElement) {
                this.containerElement.removeChild(this.renderer.view);
            }
            this.containerElement = containerElement;
            if (!this.renderer) {
                this.renderer = this.createRenderer();
            }
            this.containerElement.appendChild(this.renderer.view);
        };
        BackgroundDrawer.prototype.handleResize = function () {
            if (!this.containerElement) {
                return;
            }
            var containerElementRect = this.getContainerElementRect();
            if (!this.hasExternalRenderer) {
                this.renderer.resize(containerElementRect.width, containerElementRect.height);
            }
            if (!this.cachedBackgroundSize ||
                this.isRectBiggerThanCachedBackground(containerElementRect)) {
                this.drawScene();
            }
            if (this.blurArea) {
                this.setBlurMask();
            }
            if (!this.hasExternalRenderer) {
                this.renderer.render(this.pixiContainer);
            }
        };
        BackgroundDrawer.prototype.drawBackground = function () {
            var backgroundSize = this.getDesiredBackgroundSize();
            var bg = this.drawBackgroundFN(this.seed, backgroundSize, this.renderer);
            this.destroyBackgroundFN = bg.destroy;
            this.cachedBackgroundSize = backgroundSize;
            return bg.displayObject;
        };
        BackgroundDrawer.prototype.drawBlurredBackground = function (background) {
            background.filters = [this.blurFilter];
            var blurTextureSize = this.getDesiredBlurSize();
            var blurTexture = pixiWrapperFunctions_1.generateTextureWithBounds(this.renderer, background, PIXI.settings.SCALE_MODE, this.renderer.resolution, blurTextureSize);
            background.filters = null;
            var blurSprite = new PIXI.Sprite(blurTexture);
            return blurSprite;
        };
        BackgroundDrawer.prototype.drawScene = function () {
            this.pixiContainer.removeChildren();
            this.destroyOldBackground();
            this.layers =
                {
                    bg: this.drawBackground(),
                    blur: null,
                };
            this.pixiContainer.addChild(this.layers.bg);
            if (this.blurArea) {
                this.layers.blur = this.drawBlurredBackground(this.layers.bg);
                this.pixiContainer.addChild(this.layers.blur);
            }
        };
        BackgroundDrawer.prototype.setBlurMask = function () {
            if (!this.layers.blur) {
                throw new Error("BackgroundDrawer has no blur layer");
            }
            if (!this.layers.blur.mask) {
                this.layers.blur.mask = new PIXI.Graphics();
            }
            var mask = this.layers.blur.mask;
            mask.clear();
            mask.beginFill(0x000000);
            mask.drawShape(this.blurArea);
            mask.endFill();
        };
        BackgroundDrawer.prototype.destroyOldBackground = function () {
            if (this.destroyBackgroundFN) {
                this.destroyBackgroundFN();
                this.destroyBackgroundFN = null;
            }
        };
        BackgroundDrawer.prototype.createRenderer = function () {
            var renderer = new PIXI.Renderer({
                width: this.containerElement.clientWidth,
                height: this.containerElement.clientHeight,
                autoDensity: false,
                resolution: window.devicePixelRatio,
            });
            renderer.view.setAttribute("id", "pixi-canvas");
            return renderer;
        };
        BackgroundDrawer.prototype.addBufferToRect = function (rect) {
            var cloned = rect.clone();
            cloned.width += this.resizeBuffer.width;
            cloned.height += this.resizeBuffer.height;
            return cloned;
        };
        BackgroundDrawer.prototype.getDesiredBackgroundSize = function () {
            return this.addBufferToRect(this.getContainerElementRect());
        };
        BackgroundDrawer.prototype.getDesiredBlurSize = function () {
            return this.cachedBackgroundSize;
        };
        BackgroundDrawer.prototype.getContainerElementRect = function () {
            var w = this.containerElement.clientWidth;
            var h = this.containerElement.clientHeight;
            return new PIXI.Rectangle(0, 0, w, h);
        };
        BackgroundDrawer.prototype.isRectBiggerThanCachedBackground = function (toCheck) {
            return (toCheck.width > this.cachedBackgroundSize.width ||
                toCheck.height > this.cachedBackgroundSize.height);
        };
        return BackgroundDrawer;
    }());
    exports.BackgroundDrawer = BackgroundDrawer;
});
define("src/Battle", ["require", "exports", "src/activeModuleData", "src/BattleTurnOrder", "src/UnitBattleSide", "src/centerCameraOnPosition", "src/eventManager", "src/utility"], function (require, exports, activeModuleData_1, BattleTurnOrder_1, UnitBattleSide_1, centerCameraOnPosition_1, eventManager_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Battle = (function () {
        function Battle(props) {
            this.unitsById = {};
            this.unitsBySide = {
                side1: [],
                side2: [],
            };
            this.isVirtual = false;
            this.isSimulated = false;
            this.evaluationAdjustment = 0;
            this.afterFinishCallbacks = [];
            this.evaluation = {};
            this._ended = false;
            this.side1 = props.side1;
            this.side1Player = props.side1Player;
            this.side2 = props.side2;
            this.side2Player = props.side2Player;
            this.battleData = props.battleData;
            this.turnOrder = new BattleTurnOrder_1.BattleTurnOrder();
        }
        Object.defineProperty(Battle.prototype, "ended", {
            get: function () {
                return this._ended;
            },
            enumerable: true,
            configurable: true
        });
        Battle.prototype.init = function () {
            var _this = this;
            UnitBattleSide_1.unitBattleSides.forEach(function (sideId) {
                var side = _this[sideId];
                for (var i = 0; i < side.length; i++) {
                    for (var j = 0; j < side[i].length; j++) {
                        if (side[i][j]) {
                            _this.unitsById[side[i][j].id] = side[i][j];
                            _this.unitsBySide[sideId].push(side[i][j]);
                            var pos = Battle.getAbsolutePositionFromSidePosition([i, j], sideId);
                            _this.initUnit(side[i][j], sideId, pos);
                        }
                    }
                }
            });
            this.currentTurn = 0;
            this.maxTurns = 24;
            this.turnsLeft = this.maxTurns;
            this.updateTurnOrder();
            this.startHealth =
                {
                    side1: this.getTotalCurrentHealthForSide("side1"),
                    side2: this.getTotalCurrentHealthForSide("side2"),
                };
            if (this.shouldEnd()) {
                this.endBattle();
            }
            else {
                this.shiftRowsIfNeeded();
            }
            this.triggerBattleStartAbilities();
        };
        Battle.prototype.forEachUnit = function (callBack) {
            for (var id in this.unitsById) {
                callBack(this.unitsById[id]);
            }
        };
        Battle.prototype.endTurn = function () {
            this.currentTurn++;
            this.turnsLeft--;
            this.updateTurnOrder();
            var shouldEnd = this.shouldEnd();
            if (shouldEnd) {
                this.endBattle();
            }
            else {
                this.shiftRowsIfNeeded();
            }
        };
        Battle.prototype.getActivePlayer = function () {
            if (!this.activeUnit) {
                return null;
            }
            var side = this.activeUnit.battleStats.side;
            return this.getPlayerForSide(side);
        };
        Battle.prototype.initUnit = function (unit, side, position) {
            unit.resetBattleStats();
            unit.setBattlePosition(side, position);
            this.turnOrder.addUnit(unit);
            var isAttacking = this.battleData.attacker.units.indexOf(unit) !== -1;
            if (isAttacking) {
                unit.offensiveBattlesFoughtThisTurn += 1;
            }
        };
        Battle.prototype.triggerBattleStartAbilities = function () {
            var _this = this;
            this.battleData.location.buildings.forEach(function (building) {
                if (building.template.battleEffects) {
                    building.template.battleEffects.filter(function (unitEffect) {
                        return unitEffect.atBattleStart;
                    }).forEach(function (unitEffect) {
                        var executedEffectsResult = {};
                        unitEffect.atBattleStart.forEach(function (abilityEffect) {
                            abilityEffect.executeAction(null, null, _this, executedEffectsResult, null);
                        });
                    });
                }
            });
            this.forEachUnit(function (unit) {
                var passiveSkillsByPhase = unit.getPassiveSkillsByPhase();
                passiveSkillsByPhase.atBattleStart.forEach(function (passiveSkill) {
                    var executedEffectsResult = {};
                    passiveSkill.atBattleStart.forEach(function (effect) {
                        effect.executeAction(unit, unit, _this, executedEffectsResult, null);
                    });
                });
            });
        };
        Battle.prototype.getPlayerForSide = function (side) {
            if (side === "side1") {
                return this.side1Player;
            }
            else if (side === "side2") {
                return this.side2Player;
            }
            else {
                throw new Error("invalid side");
            }
        };
        Battle.prototype.getSideForPlayer = function (player) {
            if (this.side1Player === player) {
                return "side1";
            }
            else if (this.side2Player === player) {
                return "side2";
            }
            else {
                throw new Error("invalid player");
            }
        };
        Battle.prototype.getOtherPlayer = function (player) {
            if (player === this.side1Player) {
                return this.side2Player;
            }
            else if (player === this.side2Player) {
                return this.side1Player;
            }
            else {
                throw new Error("Invalid player");
            }
        };
        Battle.prototype.getRowByPosition = function (position) {
            var rowsPerSide = activeModuleData_1.activeModuleData.ruleSet.battle.rowsPerFormation;
            var side = position < rowsPerSide ? "side1" : "side2";
            var relativePosition = position % rowsPerSide;
            return this[side][relativePosition];
        };
        Battle.prototype.getAllUnits = function () {
            var allUnits = [];
            this.forEachUnit(function (unit) { return allUnits.push(unit); });
            return allUnits;
        };
        Battle.prototype.getUnitsForSide = function (side) {
            return this.unitsBySide[side].slice(0);
        };
        Battle.prototype.finishBattle = function (forcedVictor) {
            var _this = this;
            this.victor = forcedVictor || this.getVictor();
            this.loser = this.getOtherPlayer(this.victor);
            for (var i = 0; i < this.deadUnits.length; i++) {
                this.deadUnits[i].removeFromPlayer();
            }
            var experienceGainedPerSide = {
                side1: this.getExperienceGainedForSide("side1"),
                side2: this.getExperienceGainedForSide("side2"),
            };
            this.forEachUnit(function (unit) {
                unit.addExperience(experienceGainedPerSide[unit.battleStats.side]);
                unit.resetBattleStats();
                if (unit.currentHealth < Math.round(unit.maxHealth * 0.1)) {
                    unit.currentHealth = Math.round(unit.maxHealth * 0.1);
                }
                _this.side1Player.identifyUnit(unit);
                _this.side2Player.identifyUnit(unit);
            });
            if (this.victor) {
                this.capturedUnits.forEach(function (unit) {
                    activeModuleData_1.activeModuleData.scripts.unit.onCapture.forEach(function (script) {
                        script(unit, _this.loser, _this.victor);
                    });
                });
            }
            if (this.battleData.building) {
                if (this.victor) {
                    this.battleData.building.setController(this.victor);
                }
            }
            if (this.isSimulated) {
                eventManager_1.eventManager.dispatchEvent("renderLayer", "fleets", this.battleData.location);
            }
            else {
                centerCameraOnPosition_1.centerCameraOnPosition(this.battleData.location);
                eventManager_1.eventManager.dispatchEvent("selectFleets", []);
                eventManager_1.eventManager.dispatchEvent("switchScene", "galaxyMap");
            }
            activeModuleData_1.activeModuleData.scripts.battle.battleFinish.forEach(function (script) {
                script(_this);
            });
            for (var i = 0; i < this.afterFinishCallbacks.length; i++) {
                this.afterFinishCallbacks[i]();
            }
        };
        Battle.prototype.getVictor = function () {
            var evaluation = this.getEvaluation();
            if (evaluation > 0) {
                return this.side1Player;
            }
            else if (evaluation < 0) {
                return this.side2Player;
            }
            else {
                return this.battleData.defender.player;
            }
        };
        Battle.prototype.getCapturedUnits = function (victor, maxCapturedUnits) {
            if (!victor || victor.isIndependent) {
                return [];
            }
            var winningSide = this.getSideForPlayer(victor);
            var losingSide = utility_1.reverseSide(winningSide);
            var losingUnits = this.getUnitsForSide(losingSide);
            losingUnits.sort(function (a, b) {
                var captureChanceSort = b.battleStats.captureChance - a.battleStats.captureChance;
                if (captureChanceSort) {
                    return captureChanceSort;
                }
                else {
                    return utility_1.randInt(0, 1) * 2 - 1;
                }
            });
            var capturedUnits = [];
            for (var i = 0; i < losingUnits.length; i++) {
                if (capturedUnits.length >= maxCapturedUnits) {
                    break;
                }
                var unit = losingUnits[i];
                if (unit.currentHealth <= 0 &&
                    Math.random() <= unit.battleStats.captureChance) {
                    capturedUnits.push(unit);
                }
            }
            return capturedUnits;
        };
        Battle.prototype.getUnitDeathChance = function (unit, victor) {
            var player = unit.fleet.player;
            var deathChance;
            if (player.isIndependent) {
                deathChance = activeModuleData_1.activeModuleData.ruleSet.battle.independentUnitDeathChance;
            }
            else if (player.isAi) {
                deathChance = activeModuleData_1.activeModuleData.ruleSet.battle.aiUnitDeathChance;
            }
            else {
                deathChance = activeModuleData_1.activeModuleData.ruleSet.battle.humanUnitDeathChance;
            }
            var playerDidLose = (victor && player !== victor);
            if (playerDidLose) {
                deathChance += activeModuleData_1.activeModuleData.ruleSet.battle.loserUnitExtraDeathChance;
            }
            return deathChance;
        };
        Battle.prototype.getDeadUnits = function (capturedUnits, victor) {
            var _this = this;
            var deadUnits = [];
            this.forEachUnit(function (unit) {
                if (unit.currentHealth <= 0) {
                    var wasCaptured = capturedUnits.indexOf(unit) >= 0;
                    if (!wasCaptured) {
                        var deathChance = _this.getUnitDeathChance(unit, victor);
                        if (Math.random() < deathChance) {
                            deadUnits.push(unit);
                        }
                    }
                }
            });
            return deadUnits;
        };
        Battle.prototype.getUnitValueForExperienceGainedCalculation = function (unit) {
            return unit.level + 1;
        };
        Battle.prototype.getSideValueForExperienceGainedCalculation = function (side) {
            var _this = this;
            return this.getUnitsForSide(side).map(function (unit) {
                return _this.getUnitValueForExperienceGainedCalculation(unit);
            }).reduce(function (total, value) {
                return total + value;
            }, 0);
        };
        Battle.prototype.getExperienceGainedForSide = function (side) {
            var ownSideValue = this.getSideValueForExperienceGainedCalculation(side);
            var enemySideValue = this.getSideValueForExperienceGainedCalculation(utility_1.reverseSide(side));
            return (enemySideValue / ownSideValue) * 10;
        };
        Battle.prototype.shouldEnd = function () {
            var _this = this;
            if (!this.activeUnit) {
                return true;
            }
            if (this.turnsLeft <= 0) {
                return true;
            }
            var oneSideHasNoActiveUnits = UnitBattleSide_1.unitBattleSides.some(function (side) {
                return _this.getUnitsForSide(side).every(function (unit) { return !unit.isActiveInBattle(); });
            });
            if (oneSideHasNoActiveUnits) {
                return true;
            }
            return false;
        };
        Battle.prototype.endBattle = function () {
            this._ended = true;
            if (this.isVirtual) {
                return;
            }
            this.activeUnit = null;
            var victor = this.getVictor();
            var maxCapturedUnits = activeModuleData_1.activeModuleData.ruleSet.battle.baseMaxCapturedUnits;
            this.capturedUnits = this.getCapturedUnits(victor, maxCapturedUnits);
            this.deadUnits = this.getDeadUnits(this.capturedUnits, victor);
        };
        Battle.prototype.getEvaluation = function () {
            var _this = this;
            var evaluation = 0;
            UnitBattleSide_1.unitBattleSides.forEach(function (side) {
                var sign = side === "side1" ? 1 : -1;
                var currentHealth = _this.getTotalCurrentHealthForSide(side);
                if (currentHealth <= 0) {
                    evaluation -= 999 * sign;
                    return;
                }
                var currentHealthFactor = currentHealth / _this.startHealth[side];
                evaluation += currentHealthFactor * sign;
                var destroyedUnits = _this.getUnitsForSide(side).filter(function (unit) { return !unit.isActiveInBattle(); });
                var destroyedUnitsCount = destroyedUnits.length;
                if (destroyedUnitsCount > 0) {
                    evaluation *= Math.pow(destroyedUnits.length, 0.8);
                }
                if (_this.evaluationAdjustment) {
                    var sideWithAdvantageousAdjustment = _this.evaluationAdjustment > 0 ?
                        "side1" :
                        "side2";
                    if (side === sideWithAdvantageousAdjustment) {
                        var evaluationMultiplier = 1 + Math.abs(_this.evaluationAdjustment);
                        evaluation *= evaluationMultiplier;
                    }
                }
            });
            evaluation = utility_1.clamp(evaluation, -1, 1);
            this.evaluation[this.currentTurn] = evaluation;
            return this.evaluation[this.currentTurn];
        };
        Battle.prototype.getTotalCurrentHealthForRow = function (position) {
            return this.getRowByPosition(position).map(function (unit) {
                return unit ? unit.currentHealth : 0;
            }).reduce(function (total, value) {
                return total + value;
            }, 0);
        };
        Battle.prototype.getTotalCurrentHealthForSide = function (side) {
            return this.getUnitsForSide(side).map(function (unit) { return unit.currentHealth; }).reduce(function (total, value) {
                return total + value;
            }, 0);
        };
        Battle.getAbsolutePositionFromSidePosition = function (relativePosition, side) {
            if (side === "side1") {
                return relativePosition;
            }
            else {
                var rowsPerSide = activeModuleData_1.activeModuleData.ruleSet.battle.rowsPerFormation;
                return [relativePosition[0] + rowsPerSide, relativePosition[1]];
            }
        };
        Battle.prototype.updateBattlePositions = function (side) {
            var units = this[side];
            for (var i = 0; i < units.length; i++) {
                var row = this[side][i];
                for (var j = 0; j < row.length; j++) {
                    var pos = Battle.getAbsolutePositionFromSidePosition([i, j], side);
                    var unit = row[j];
                    if (unit) {
                        unit.setBattlePosition(side, pos);
                    }
                }
            }
        };
        Battle.prototype.shiftRowsForSide = function (side) {
            var formation = this[side];
            if (side === "side1") {
                formation.reverse();
            }
            var nextHealthyRowIndex;
            for (var i = 1; i < formation.length; i++) {
                var absoluteRow = side === "side1" ? i : i + activeModuleData_1.activeModuleData.ruleSet.battle.rowsPerFormation;
                if (this.getTotalCurrentHealthForRow(absoluteRow) > 0) {
                    nextHealthyRowIndex = i;
                    break;
                }
            }
            if (!isFinite(nextHealthyRowIndex)) {
                throw new Error("Tried to shift battle rows when all rows are defeated");
            }
            var rowsToShift = formation.splice(0, nextHealthyRowIndex);
            formation = formation.concat(rowsToShift);
            if (side === "side1") {
                formation.reverse();
            }
            this[side] = formation;
            this.updateBattlePositions(side);
        };
        Battle.prototype.shiftRowsIfNeeded = function () {
            var rowsPerSide = activeModuleData_1.activeModuleData.ruleSet.battle.rowsPerFormation;
            var side1FrontRowHealth = this.getTotalCurrentHealthForRow(rowsPerSide - 1);
            if (side1FrontRowHealth <= 0) {
                this.shiftRowsForSide("side1");
            }
            var side2FrontRowHealth = this.getTotalCurrentHealthForRow(rowsPerSide);
            if (side2FrontRowHealth <= 0) {
                this.shiftRowsForSide("side2");
            }
        };
        Battle.prototype.makeVirtualClone = function () {
            var battleData = this.battleData;
            function cloneUnits(units) {
                var clones = [];
                for (var i = 0; i < units.length; i++) {
                    var row = [];
                    for (var j = 0; j < units[i].length; j++) {
                        var unit = units[i][j];
                        if (!unit) {
                            row.push(unit);
                        }
                        else {
                            row.push(unit.makeVirtualClone());
                        }
                    }
                    clones.push(row);
                }
                return clones;
            }
            var side1 = cloneUnits(this.side1);
            var side2 = cloneUnits(this.side2);
            var side1Player = this.side1Player;
            var side2Player = this.side2Player;
            var clone = new Battle({
                battleData: battleData,
                side1: side1,
                side2: side2,
                side1Player: side1Player,
                side2Player: side2Player,
            });
            [side1, side2].forEach(function (side) {
                for (var i = 0; i < side.length; i++) {
                    for (var j = 0; j < side[i].length; j++) {
                        if (!side[i][j]) {
                            continue;
                        }
                        clone.turnOrder.addUnit(side[i][j]);
                        clone.unitsById[side[i][j].id] = side[i][j];
                        clone.unitsBySide[side[i][j].battleStats.side].push(side[i][j]);
                    }
                }
            });
            clone.isVirtual = true;
            clone.currentTurn = this.currentTurn;
            clone.maxTurns = this.maxTurns;
            clone.turnsLeft = this.turnsLeft;
            clone.startHealth = this.startHealth;
            clone.updateTurnOrder();
            if (clone.shouldEnd()) {
                clone.endBattle();
            }
            else {
                clone.shiftRowsIfNeeded();
            }
            return clone;
        };
        Battle.prototype.updateTurnOrder = function () {
            this.turnOrder.update();
            this.activeUnit = this.turnOrder.getActiveUnit();
        };
        return Battle;
    }());
    exports.Battle = Battle;
});
define("src/battleAbilityDisplay", ["require", "exports", "src/AbilityTargetDisplayData", "src/battleAbilityTargeting"], function (require, exports, AbilityTargetDisplayData_1, battleAbilityTargeting_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getAbilityTargetDisplayData(battle, ability, user, target) {
        var abilityEffects = [ability.mainEffect];
        if (ability.secondaryEffects) {
            abilityEffects.push.apply(abilityEffects, ability.secondaryEffects.filter(function (secondaryEffect) {
                return Boolean(secondaryEffect.getDisplayDataForTarget);
            }));
        }
        var allDisplayDataById = abilityEffects.map(function (abilityEffect) {
            return abilityEffect.getDisplayDataForTarget(user, target, battle);
        });
        var mergedDisplayDataById = AbilityTargetDisplayData_1.mergeAbilityTargetDisplayDataById.apply(void 0, allDisplayDataById);
        return mergedDisplayDataById;
    }
    exports.getAbilityTargetDisplayData = getAbilityTargetDisplayData;
    exports.getTargetsForAllAbilities = battleAbilityTargeting_1.getTargetsForAllAbilities;
});
define("src/battleAbilityProcessing", ["require", "exports", "src/targeting"], function (require, exports, targeting_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getAbilityEffectDataByPhase(battle, abilityUseData) {
        abilityUseData.actualTarget = getTargetOrGuard(battle, abilityUseData);
        var beforeUse = getAbilityEffectDataFromEffectTemplates(battle, abilityUseData, getBeforeAbilityUseEffectTemplates(abilityUseData), abilityUseData.actualTarget);
        beforeUse.push.apply(beforeUse, getDefaultBeforeUseEffects(abilityUseData));
        var abilityEffects = getAbilityEffectDataFromEffectTemplates(battle, abilityUseData, getAbilityUseEffectTemplates(abilityUseData), abilityUseData.actualTarget);
        var afterUse = getAbilityEffectDataFromEffectTemplates(battle, abilityUseData, getAfterAbilityUseEffectTemplates(abilityUseData), abilityUseData.actualTarget);
        afterUse.push.apply(afterUse, getDefaultAfterUseEffects(abilityUseData));
        return ({
            beforeUse: beforeUse,
            abilityEffects: abilityEffects,
            afterUse: afterUse,
        });
    }
    exports.getAbilityEffectDataByPhase = getAbilityEffectDataByPhase;
    function getTargetOrGuard(battle, abilityUseData) {
        if (abilityUseData.ability.targetCannotBeDiverted) {
            return abilityUseData.intendedTarget;
        }
        var guarding = getGuarders(battle, abilityUseData);
        guarding = guarding.sort(function (a, b) {
            return a.battleStats.guardAmount - b.battleStats.guardAmount;
        });
        for (var i = 0; i < guarding.length; i++) {
            var guardRoll = Math.random() * 100;
            if (guardRoll <= guarding[i].battleStats.guardAmount) {
                return guarding[i];
            }
        }
        return abilityUseData.intendedTarget;
    }
    function canUnitGuardTarget(unit, intendedTarget) {
        if (unit.battleStats.guardAmount > 0 && unit.isTargetable()) {
            if (unit.battleStats.guardCoverage === 1) {
                return true;
            }
            else if (unit.battleStats.guardCoverage === 0) {
                if (unit.battleStats.position[0] === intendedTarget.battleStats.position[0]) {
                    return true;
                }
            }
        }
        return false;
    }
    function getGuarders(battle, abilityUseData) {
        var userSide = abilityUseData.user.battleStats.side;
        var targetSide = abilityUseData.intendedTarget.battleStats.side;
        if (userSide === targetSide) {
            return [];
        }
        var allEnemies = battle.getUnitsForSide(targetSide);
        var guarders = allEnemies.filter(function (unit) {
            return canUnitGuardTarget(unit, abilityUseData.intendedTarget);
        });
        return guarders;
    }
    function getAbilityEffectDataFromEffectTemplate(battle, abilityUseData, effectTemplate, target, sourceStatusEffect) {
        var effectData = [];
        var unitsInEffectArea = effectTemplate.getUnitsInArea(abilityUseData.user, target, battle);
        unitsInEffectArea.forEach(function (unitInEffectArea) {
            effectData.push({
                sourceAbility: abilityUseData.ability,
                effectTemplate: effectTemplate,
                user: abilityUseData.user,
                target: unitInEffectArea,
                trigger: effectTemplate.trigger,
                sourceStatusEffect: sourceStatusEffect,
            });
            var attachedEffects = effectTemplate.attachedEffects || [];
            attachedEffects.forEach(function (attachedEffectTemplate) {
                effectData.push.apply(effectData, getAbilityEffectDataFromEffectTemplate(battle, abilityUseData, attachedEffectTemplate, unitInEffectArea, sourceStatusEffect));
            });
        });
        return effectData;
    }
    function getAbilityEffectDataFromEffectTemplates(battle, abilityUseData, effectTemplatesWithSource, target) {
        var effectData = [];
        effectTemplatesWithSource.forEach(function (effectTemplateWithSource) {
            effectData.push.apply(effectData, getAbilityEffectDataFromEffectTemplate(battle, abilityUseData, effectTemplateWithSource.template, target, effectTemplateWithSource.sourceStatusEffect));
        });
        return effectData;
    }
    function getBeforeAbilityUseEffectTemplates(abilityUseData) {
        var beforeUseEffects = [];
        if (abilityUseData.ability.beforeUse) {
            beforeUseEffects.push.apply(beforeUseEffects, abilityUseData.ability.beforeUse.map(function (effectTemplate) {
                return ({
                    template: effectTemplate,
                    sourceStatusEffect: null,
                });
            }));
        }
        abilityUseData.user.battleStats.statusEffects.forEach(function (statusEffect) {
            if (statusEffect.template.beforeAbilityUse) {
                beforeUseEffects.push.apply(beforeUseEffects, statusEffect.template.beforeAbilityUse.map(function (effectTemplate) {
                    return ({
                        template: effectTemplate,
                        sourceStatusEffect: statusEffect,
                    });
                }));
            }
        });
        return beforeUseEffects;
    }
    function getAbilityUseEffectTemplates(abilityUseData) {
        var abilityUseEffects = [];
        abilityUseEffects.push(abilityUseData.ability.mainEffect);
        if (abilityUseData.ability.secondaryEffects) {
            abilityUseEffects = abilityUseEffects.concat(abilityUseData.ability.secondaryEffects);
        }
        return abilityUseEffects.map(function (effectTemplate) {
            return ({
                template: effectTemplate,
                sourceStatusEffect: null,
            });
        });
    }
    function getAfterAbilityUseEffectTemplates(abilityUseData) {
        var afterUseEffects = [];
        if (abilityUseData.ability.afterUse) {
            afterUseEffects.push.apply(afterUseEffects, abilityUseData.ability.afterUse.map(function (effectTemplate) {
                return ({
                    template: effectTemplate,
                    sourceStatusEffect: null,
                });
            }));
        }
        abilityUseData.user.battleStats.statusEffects.forEach(function (statusEffect) {
            if (statusEffect.template.afterAbilityUse) {
                afterUseEffects.push.apply(afterUseEffects, statusEffect.template.afterAbilityUse.map(function (effectTemplate) {
                    return ({
                        template: effectTemplate,
                        sourceStatusEffect: statusEffect,
                    });
                }));
            }
        });
        return afterUseEffects;
    }
    function makeSelfAbilityEffectData(user, name, actionFN) {
        return ({
            sourceAbility: null,
            sourceStatusEffect: null,
            effectTemplate: {
                id: name,
                getDisplayDataForTarget: function () { return {}; },
                getUnitsInArea: targeting_1.areaSingle,
                executeAction: actionFN,
            },
            user: user,
            target: user,
            trigger: null,
        });
    }
    function getDefaultBeforeUseEffects(abilityUseData) {
        var effects = [];
        if (!abilityUseData.ability.doesNotRemoveUserGuard) {
            effects.push(makeSelfAbilityEffectData(abilityUseData.user, "removeGuard", function (user) { return user.removeAllGuard(); }));
        }
        effects.push(makeSelfAbilityEffectData(abilityUseData.user, "removeActionPoints", function (user) { return user.removeActionPoints(abilityUseData.ability.actionsUse); }));
        return effects;
    }
    function getDefaultAfterUseEffects(abilityUseData) {
        var effects = [];
        effects.push(makeSelfAbilityEffectData(abilityUseData.user, "addMoveDelay", function (user) { return user.addMoveDelay(abilityUseData.ability.moveDelay); }));
        effects.push(makeSelfAbilityEffectData(abilityUseData.user, "updateStatusEffects", function (user) { return user.updateStatusEffects(); }));
        return effects;
    }
});
define("src/battleAbilityTargeting", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getTargetsForAllAbilities(battle, user) {
        if (!user || !battle.activeUnit) {
            throw new Error();
        }
        var allTargets = {};
        var abilities = user.getAllAbilities();
        for (var i = 0; i < abilities.length; i++) {
            var ability = abilities[i];
            var targets = getPotentialTargets(battle, user, ability);
            for (var j = 0; j < targets.length; j++) {
                var target = targets[j];
                if (!allTargets[target.id]) {
                    allTargets[target.id] = [];
                }
                allTargets[target.id].push(ability);
            }
        }
        return allTargets;
    }
    exports.getTargetsForAllAbilities = getTargetsForAllAbilities;
    function isTargetableFilterFN(unit) {
        return unit && unit.isTargetable();
    }
    function getPotentialTargets(battle, user, ability) {
        var targetsInRange = ability.getPossibleTargets(user, battle);
        var targets = targetsInRange.filter(isTargetableFilterFN);
        return targets;
    }
});
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("src/battleAbilityUsage", ["require", "exports", "src/battleAbilityProcessing"], function (require, exports, battleAbilityProcessing_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function useAbility(battle, ability, user, target) {
        var effectDataByPhase = battleAbilityProcessing_1.getAbilityEffectDataByPhase(battle, {
            ability: ability,
            user: user,
            intendedTarget: target,
        });
        executeFullAbilityEffects(battle, effectDataByPhase);
    }
    exports.useAbility = useAbility;
    function useAbilityAndGetUseEffects(battle, ability, user, target) {
        var effectDataByPhase = battleAbilityProcessing_1.getAbilityEffectDataByPhase(battle, {
            ability: ability,
            user: user,
            intendedTarget: target,
        });
        var useData = executeFullAbilityEffectsAndGetUseEffects(battle, effectDataByPhase);
        return useData;
    }
    exports.useAbilityAndGetUseEffects = useAbilityAndGetUseEffects;
    function executeFullAbilityEffects(battle, abilityEffectDataByPhase) {
        var executedEffectsResult = {};
        [
            abilityEffectDataByPhase.beforeUse,
            abilityEffectDataByPhase.abilityEffects,
            abilityEffectDataByPhase.afterUse,
        ].forEach(function (effectDataForPhase) {
            effectDataForPhase.forEach(function (effectData) {
                executeAbilityEffectData(battle, effectData, executedEffectsResult);
            });
        });
    }
    function executeFullAbilityEffectsAndGetUseEffects(battle, abilityEffectDataByPhase) {
        var useEffects = [];
        var executedEffectsResult = {};
        [
            abilityEffectDataByPhase.beforeUse,
            abilityEffectDataByPhase.abilityEffects,
            abilityEffectDataByPhase.afterUse,
        ].forEach(function (effectDataForPhase) {
            effectDataForPhase.forEach(function (effectData) {
                var useEffect = executeAbilityEffectDataAndGetUseEffect(battle, effectData, executedEffectsResult);
                if (useEffect) {
                    useEffects.push(useEffect);
                }
            });
        });
        return useEffects;
    }
    function shouldEffectActionTrigger(abilityEffectData, battle, executedEffectsResult) {
        if (!abilityEffectData.trigger) {
            return true;
        }
        return abilityEffectData.trigger(abilityEffectData.user, abilityEffectData.target, battle, executedEffectsResult, abilityEffectData.sourceStatusEffect);
    }
    function executeAbilityEffectData(battle, abilityEffectData, executedEffectsResult) {
        if (!shouldEffectActionTrigger(abilityEffectData, battle, executedEffectsResult)) {
            return false;
        }
        abilityEffectData.effectTemplate.executeAction(abilityEffectData.user, abilityEffectData.target, battle, executedEffectsResult, abilityEffectData.sourceStatusEffect);
        return true;
    }
    function getIdForAbilityUseEffect(abilityEffectData) {
        var sourceString = "";
        if (abilityEffectData.sourceStatusEffect) {
            sourceString = abilityEffectData.sourceStatusEffect.template.type + ".";
        }
        else if (abilityEffectData.sourceAbility) {
            sourceString = abilityEffectData.sourceAbility.type + ".";
        }
        return "" + sourceString + abilityEffectData.effectTemplate.id;
    }
    function executeAbilityEffectDataAndGetUseEffect(battle, abilityEffectData, executedEffectsResult) {
        var didTriggerAction = executeAbilityEffectData(battle, abilityEffectData, executedEffectsResult);
        if (!didTriggerAction) {
            return null;
        }
        var changedUnitDisplayData = {};
        changedUnitDisplayData[abilityEffectData.user.id] = abilityEffectData.user.getDisplayData("battle");
        changedUnitDisplayData[abilityEffectData.target.id] = abilityEffectData.target.getDisplayData("battle");
        return ({
            effectId: getIdForAbilityUseEffect(abilityEffectData),
            changedUnitDisplayData: changedUnitDisplayData,
            executedEffectsResult: __assign({}, executedEffectsResult),
            vfx: abilityEffectData.effectTemplate.vfx,
            vfxUser: abilityEffectData.user,
            vfxTarget: abilityEffectData.target,
            newEvaluation: battle.getEvaluation(),
        });
    }
});
define("src/BattlePrep", ["require", "exports", "src/Battle", "src/BattlePrepFormation", "src/BattlePrepFormationValidity"], function (require, exports, Battle_1, BattlePrepFormation_1, BattlePrepFormationValidity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattlePrep = (function () {
        function BattlePrep(battleData) {
            var _this = this;
            this.afterBattleFinishCallbacks = [];
            this.attacker = battleData.attacker.player;
            this.defender = battleData.defender.player;
            this.battleData = battleData;
            this.attackerUnits = battleData.attacker.units;
            this.defenderUnits = battleData.defender.units;
            var attackerHasScouted = this.attacker.starIsDetected(battleData.location);
            this.attackerFormation = new BattlePrepFormation_1.BattlePrepFormation({
                player: this.attacker,
                units: this.attackerUnits,
                hasScouted: attackerHasScouted,
                isAttacker: true,
                validityModifiers: this.getAttackerFormationValidityModifiers(),
                triggerBattlePrepEffect: function (effect, unit) {
                    effect(unit, _this, _this.attackerFormation, _this.defenderFormation);
                },
            });
            var defenderHasScouted = this.defender.starIsDetected(battleData.location);
            this.defenderFormation = new BattlePrepFormation_1.BattlePrepFormation({
                player: this.defender,
                units: this.defenderUnits,
                hasScouted: defenderHasScouted,
                isAttacker: false,
                validityModifiers: this.getDefenderFormationValidityModifiers(),
                triggerBattlePrepEffect: function (effect, unit) {
                    effect(unit, _this, _this.defenderFormation, _this.attackerFormation);
                },
            });
            this.resetBattleStats();
            this.setHumanAndEnemy();
            if (this.enemyFormation) {
                this.enemyFormation.setAutoFormation(this.humanUnits);
            }
            else {
                this.attackerFormation.setAutoFormation(this.defenderUnits);
                this.defenderFormation.setAutoFormation(this.attackerUnits, this.attackerFormation.formation);
            }
        }
        BattlePrep.prototype.forEachUnit = function (f) {
            this.attackerUnits.forEach(f);
            this.defenderUnits.forEach(f);
        };
        BattlePrep.prototype.makeBattle = function () {
            var side1Formation = this.humanFormation || this.attackerFormation;
            var side2Formation = this.enemyFormation || this.defenderFormation;
            var side1Player = this.humanPlayer || this.attacker;
            var side2Player = this.enemyPlayer || this.defender;
            var battle = new Battle_1.Battle({
                battleData: this.battleData,
                side1: side1Formation.formation,
                side2: side2Formation.formation.reverse(),
                side1Player: side1Player,
                side2Player: side2Player,
            });
            battle.afterFinishCallbacks = battle.afterFinishCallbacks.concat(this.afterBattleFinishCallbacks);
            battle.init();
            return battle;
        };
        BattlePrep.prototype.setHumanAndEnemy = function () {
            if (!this.attacker.isAi) {
                this.humanPlayer = this.attacker;
                this.enemyPlayer = this.defender;
                this.humanUnits = this.attackerUnits;
                this.enemyUnits = this.defenderUnits;
                this.humanFormation = this.attackerFormation;
                this.enemyFormation = this.defenderFormation;
            }
            else if (!this.defender.isAi) {
                this.humanPlayer = this.defender;
                this.enemyPlayer = this.attacker;
                this.humanUnits = this.defenderUnits;
                this.enemyUnits = this.attackerUnits;
                this.humanFormation = this.defenderFormation;
                this.enemyFormation = this.attackerFormation;
            }
        };
        BattlePrep.prototype.resetBattleStats = function () {
            this.forEachUnit(function (unit) {
                unit.resetBattleStats();
            });
        };
        BattlePrep.prototype.getAttackerFormationValidityModifiers = function () {
            var allModifiers = [];
            allModifiers.push({
                sourceType: BattlePrepFormationValidity_1.FormationValidityModifierSourceType.OffensiveBattle,
                effect: { minUnits: 1 },
            });
            return allModifiers;
        };
        BattlePrep.prototype.getDefenderFormationValidityModifiers = function () {
            var allModifiers = [];
            if (this.attacker === this.battleData.location.owner) {
                allModifiers.push({
                    sourceType: BattlePrepFormationValidity_1.FormationValidityModifierSourceType.AttackedInEnemyTerritory,
                    effect: { minUnits: 1 },
                });
            }
            else if (this.defender !== this.battleData.location.owner) {
                allModifiers.push({
                    sourceType: BattlePrepFormationValidity_1.FormationValidityModifierSourceType.AttackedInNeutralTerritory,
                    effect: { minUnits: 1 },
                });
            }
            return allModifiers;
        };
        return BattlePrep;
    }());
    exports.BattlePrep = BattlePrep;
});
define("src/BattlePrepFormation", ["require", "exports", "src/BattlePrepFormationValidity", "src/getNullFormation", "src/utility"], function (require, exports, BattlePrepFormationValidity_1, getNullFormation_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattlePrepFormation = (function () {
        function BattlePrepFormation(props) {
            var _a;
            this.placedUnitPositionsById = {};
            this.validityModifiers = [];
            this.displayDataIsDirty = true;
            this.player = props.player;
            this.units = props.units;
            this.hasScouted = props.hasScouted;
            this.isAttacker = props.isAttacker;
            (_a = this.validityModifiers).push.apply(_a, props.validityModifiers);
            this.triggerBattlePrepEffect = props.triggerBattlePrepEffect;
            this.formation = getNullFormation_1.getNullFormation();
        }
        BattlePrepFormation.prototype.getPlacedUnits = function () {
            return utility_1.flatten2dArray(this.formation).filter(function (unit) { return Boolean(unit); });
        };
        BattlePrepFormation.prototype.forEachUnitInFormation = function (f) {
            for (var i = 0; i < this.formation.length; i++) {
                for (var j = 0; j < this.formation[i].length; j++) {
                    var unit = this.formation[i][j];
                    if (unit) {
                        f(unit, [i, j]);
                    }
                }
            }
        };
        BattlePrepFormation.prototype.getDisplayData = function () {
            if (this.displayDataIsDirty) {
                this.cachedDisplayData = this.getFormationDisplayData();
                this.displayDataIsDirty = false;
            }
            return this.cachedDisplayData;
        };
        BattlePrepFormation.prototype.setAutoFormation = function (enemyUnits, enemyFormation) {
            var _this = this;
            this.clearFormation();
            var newFormation = this.player.aiController.createBattleFormation(this.getAvailableUnits(), this.hasScouted, enemyUnits, enemyFormation);
            newFormation.forEach(function (row, i) {
                row.forEach(function (unitAtCell, j) {
                    if (unitAtCell) {
                        _this.addNewUnit(unitAtCell, [i, j]);
                    }
                });
            });
        };
        BattlePrepFormation.prototype.hasUnit = function (unit) {
            return Boolean(this.placedUnitPositionsById[unit.id]);
        };
        BattlePrepFormation.prototype.clearFormation = function () {
            var _this = this;
            this.forEachUnitInFormation(function (unit) { return _this.removeUnit(unit); });
        };
        BattlePrepFormation.prototype.getValidityRestriction = function () {
            var allEffects = this.validityModifiers.map(function (modifier) { return modifier.effect; });
            return BattlePrepFormationValidity_1.squashValidityModifierEffects.apply(void 0, allEffects);
        };
        BattlePrepFormation.prototype.getFormationValidity = function () {
            var validity = {
                isValid: true,
                reasons: BattlePrepFormationValidity_1.FormationInvalidityReason.Valid,
                modifiers: this.validityModifiers,
            };
            var validityRestriction = this.getValidityRestriction();
            var amountOfUnitsPlaced = this.getPlacedUnits().length;
            if (amountOfUnitsPlaced < validityRestriction.minUnits) {
                validity.isValid = false;
                validity.reasons |= BattlePrepFormationValidity_1.FormationInvalidityReason.NotEnoughUnits;
            }
            return validity;
        };
        BattlePrepFormation.prototype.assignUnit = function (unit, position) {
            var unitInTargetPosition = this.getUnitAtPosition(position);
            if (unitInTargetPosition) {
                if (unitInTargetPosition === unit) {
                }
                else {
                    this.swapUnits(unit, unitInTargetPosition);
                }
            }
            else {
                if (this.hasUnit(unit)) {
                    this.setUnitPosition(unit, position);
                }
                else {
                    this.addNewUnit(unit, position);
                }
            }
        };
        BattlePrepFormation.prototype.removeUnit = function (unit) {
            if (!this.hasUnit(unit)) {
                throw new Error("Tried to remove unit not part of the formation.");
            }
            this.cleanUpUnitPosition(unit);
            this.triggerPassiveSkillsForUnit("onRemove", unit);
            this.displayDataIsDirty = true;
        };
        BattlePrepFormation.prototype.getValidityModifierIndex = function (modifier) {
            for (var i = 0; i < this.validityModifiers.length; i++) {
                if (BattlePrepFormationValidity_1.validityModifiersAreEqual(modifier, this.validityModifiers[i])) {
                    return i;
                }
            }
            return -1;
        };
        BattlePrepFormation.prototype.addValidityModifier = function (modifier) {
            this.validityModifiers.push(modifier);
        };
        BattlePrepFormation.prototype.removeValidityModifier = function (modifier) {
            var index = this.getValidityModifierIndex(modifier);
            if (index === -1) {
                throw new Error("");
            }
            else {
                this.validityModifiers.splice(index, 1);
            }
        };
        BattlePrepFormation.prototype.getUnitPosition = function (unit) {
            return this.placedUnitPositionsById[unit.id];
        };
        BattlePrepFormation.prototype.getUnitAtPosition = function (position) {
            return this.formation[position[0]][position[1]];
        };
        BattlePrepFormation.prototype.cleanUpUnitPosition = function (unit) {
            if (!this.hasUnit(unit)) {
                return;
            }
            var position = this.getUnitPosition(unit);
            this.formation[position[0]][position[1]] = null;
            delete this.placedUnitPositionsById[unit.id];
        };
        BattlePrepFormation.prototype.setUnitPosition = function (unit, position) {
            this.cleanUpUnitPosition(unit);
            this.formation[position[0]][position[1]] = unit;
            this.placedUnitPositionsById[unit.id] = position;
            this.displayDataIsDirty = true;
        };
        BattlePrepFormation.prototype.addNewUnit = function (unit, position) {
            this.setUnitPosition(unit, position);
            this.triggerPassiveSkillsForUnit("onAdd", unit);
            this.displayDataIsDirty = true;
        };
        BattlePrepFormation.prototype.swapUnits = function (unit1, unit2) {
            if (unit1 === unit2) {
                throw new Error("Tried to swap unit position with itself.");
            }
            var new1Pos = this.getUnitPosition(unit2);
            var new2Pos = this.getUnitPosition(unit1);
            this.cleanUpUnitPosition(unit1);
            this.cleanUpUnitPosition(unit2);
            this.setUnitPosition(unit1, new1Pos);
            this.setUnitPosition(unit2, new2Pos);
        };
        BattlePrepFormation.prototype.getFormationDisplayData = function () {
            var displayDataById = {};
            this.forEachUnitInFormation(function (unit) {
                displayDataById[unit.id] = unit.getDisplayData("battlePrep");
            });
            return displayDataById;
        };
        BattlePrepFormation.prototype.getAvailableUnits = function () {
            return this.isAttacker ?
                this.units.filter(function (unit) { return unit.canFightOffensiveBattle(); }) :
                this.units.slice();
        };
        BattlePrepFormation.prototype.triggerPassiveSkillsForUnit = function (stateChange, unit) {
            var _this = this;
            var skills = unit.getPassiveSkillsByPhase().inBattlePrep;
            var didTriggerASkill = false;
            skills.forEach(function (skill) {
                skill.inBattlePrep.forEach(function (effectPair) {
                    var effectToTrigger = effectPair[stateChange];
                    _this.triggerBattlePrepEffect(effectToTrigger, unit);
                    didTriggerASkill = true;
                });
            });
            if (didTriggerASkill) {
                this.displayDataIsDirty = true;
            }
        };
        return BattlePrepFormation;
    }());
    exports.BattlePrepFormation = BattlePrepFormation;
});
define("src/BattlePrepFormationValidity", ["require", "exports", "src/utility"], function (require, exports, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FormationInvalidityReason;
    (function (FormationInvalidityReason) {
        FormationInvalidityReason[FormationInvalidityReason["Valid"] = 0] = "Valid";
        FormationInvalidityReason[FormationInvalidityReason["NotEnoughUnits"] = 1] = "NotEnoughUnits";
    })(FormationInvalidityReason = exports.FormationInvalidityReason || (exports.FormationInvalidityReason = {}));
    var FormationValidityModifierSourceType;
    (function (FormationValidityModifierSourceType) {
        FormationValidityModifierSourceType[FormationValidityModifierSourceType["OffensiveBattle"] = 0] = "OffensiveBattle";
        FormationValidityModifierSourceType[FormationValidityModifierSourceType["AttackedInEnemyTerritory"] = 1] = "AttackedInEnemyTerritory";
        FormationValidityModifierSourceType[FormationValidityModifierSourceType["AttackedInNeutralTerritory"] = 2] = "AttackedInNeutralTerritory";
        FormationValidityModifierSourceType[FormationValidityModifierSourceType["PassiveAbility"] = 3] = "PassiveAbility";
    })(FormationValidityModifierSourceType = exports.FormationValidityModifierSourceType || (exports.FormationValidityModifierSourceType = {}));
    function squashValidityModifierEffects() {
        var effects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            effects[_i] = arguments[_i];
        }
        var squashed = {
            minUnits: 0,
        };
        effects.forEach(function (toSquash) {
            for (var prop in toSquash) {
                switch (prop) {
                    case "minUnits":
                        {
                            squashed[prop] += toSquash[prop];
                            break;
                        }
                }
            }
        });
        return squashed;
    }
    exports.squashValidityModifierEffects = squashValidityModifierEffects;
    function validityModifiersAreEqual(a, b) {
        var sameSourceType = a.sourceType === b.sourceType;
        if (!sameSourceType) {
            return false;
        }
        var effectsMatch = utility_1.shallowEqual(a.effect, b.effect);
        if (!effectsMatch) {
            return false;
        }
        var sourcePassiveAbilitiesMatch = utility_1.shallowEqual(a.sourcePassiveAbility, b.sourcePassiveAbility);
        if (!sourcePassiveAbilitiesMatch) {
            return false;
        }
        return true;
    }
    exports.validityModifiersAreEqual = validityModifiersAreEqual;
});
define("src/BattleScene", ["require", "exports", "@tweenjs/tween.js", "pixi.js", "src/BattleSceneUnit", "src/BattleSceneUnitOverlay", "src/Options", "src/debug"], function (require, exports, TWEEN, PIXI, BattleSceneUnit_1, BattleSceneUnitOverlay_1, Options_1, debug) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattleScene = (function () {
        function BattleScene(containerElement) {
            this.side1UnitHasFinishedUpdating = false;
            this.side2UnitHasFinishedUpdating = false;
            this.isPaused = false;
            this.forceFrame = false;
            this.container = new PIXI.Container();
            this.renderer = new PIXI.Renderer({
                width: 2,
                height: 2,
                autoDensity: false,
                antialias: true,
                transparent: true,
            });
            this.renderer.view.setAttribute("id", "battle-scene-pixi-canvas");
            this.initLayers();
            this.resizeListener = this.handleResize.bind(this);
            window.addEventListener("resize", this.resizeListener, false);
            if (containerElement) {
                this.bindRendererView(containerElement);
            }
        }
        BattleScene.prototype.destroy = function () {
            this.container.renderable = false;
            this.pause();
            if (this.renderer) {
                this.renderer.destroy(true);
                this.renderer = null;
            }
            this.container = null;
            this.containerElement = null;
            window.removeEventListener("resize", this.resizeListener);
        };
        BattleScene.prototype.bindRendererView = function (containerElement) {
            if (this.containerElement) {
                this.containerElement.removeChild(this.renderer.view);
            }
            this.containerElement = containerElement;
            if (this.renderer) {
                this.handleResize();
            }
            this.containerElement.appendChild(this.renderer.view);
        };
        BattleScene.prototype.handleAbilityUse = function (props) {
            this.clearActiveVfx();
            this.userUnit = props.user;
            this.targetUnit = props.target;
            this.activeVfx = props.vfxTemplate;
            this.activeAbilityUseEffect = props.abilityUseEffect;
            this.onVfxStartCallback = props.onVfxStartCallback;
            this.abilityUseHasFinishedCallback = props.afterFinishedCallback;
            this.triggerEffectCallback = props.triggerEffectCallback;
            this.beforeUseDelayHasFinishedCallback = this.playVfx.bind(this);
            this.prepareVfx();
        };
        BattleScene.prototype.updateUnits = function (afterFinishedUpdatingCallback) {
            debug.log("graphics", "updateUnits");
            var boundAfterFinishFN1;
            var boundAfterFinishFN2;
            if (afterFinishedUpdatingCallback) {
                this.afterUnitsHaveFinishedUpdatingCallback = afterFinishedUpdatingCallback;
                boundAfterFinishFN1 = this.finishUpdatingUnit.bind(this, "side1");
                boundAfterFinishFN2 = this.finishUpdatingUnit.bind(this, "side2");
                this.side1UnitHasFinishedUpdating = false;
                this.side2UnitHasFinishedUpdating = false;
            }
            var activeSide1Unit = this.getHighestPriorityUnitForSide("side1");
            var activeSide2Unit = this.getHighestPriorityUnitForSide("side2");
            this.side1Unit.setActiveUnit(activeSide1Unit, boundAfterFinishFN1);
            this.side1Overlay.activeUnit = activeSide1Unit;
            this.side2Unit.setActiveUnit(activeSide2Unit, boundAfterFinishFN2);
            this.side2Overlay.activeUnit = activeSide2Unit;
        };
        BattleScene.prototype.renderOnce = function () {
            this.forceFrame = true;
            this.render();
        };
        BattleScene.prototype.pause = function () {
            this.isPaused = true;
            this.forceFrame = false;
        };
        BattleScene.prototype.resume = function () {
            this.isPaused = false;
            this.forceFrame = false;
            this.render();
        };
        BattleScene.prototype.initLayers = function () {
            this.layers =
                {
                    battleOverlay: new PIXI.Container(),
                    side1Container: new PIXI.Container(),
                    side2Container: new PIXI.Container(),
                };
            this.side1Unit = new BattleSceneUnit_1.BattleSceneUnit(this.layers.side1Container, this.renderer, "side1");
            this.side2Unit = new BattleSceneUnit_1.BattleSceneUnit(this.layers.side2Container, this.renderer, "side2");
            this.side1Unit.getSceneBounds = this.side2Unit.getSceneBounds = this.getSceneBounds;
            this.side1Overlay = new BattleSceneUnitOverlay_1.BattleSceneUnitOverlay(this.layers.side1Container, this.renderer);
            this.side2Overlay = new BattleSceneUnitOverlay_1.BattleSceneUnitOverlay(this.layers.side2Container, this.renderer);
            this.side1Overlay.getSceneBounds = this.side2Overlay.getSceneBounds = this.getSceneBounds;
            this.container.addChild(this.layers.side1Container);
            this.container.addChild(this.layers.side2Container);
            this.container.addChild(this.layers.battleOverlay);
        };
        BattleScene.prototype.handleResize = function () {
            if (!this.containerElement) {
                return;
            }
            var w = this.containerElement.clientWidth * window.devicePixelRatio;
            var h = this.containerElement.clientHeight * window.devicePixelRatio;
            this.renderer.resize(w, h);
            this.side1Unit.resize();
            this.side2Unit.resize();
        };
        BattleScene.prototype.getSceneBounds = function () {
            return ({
                width: this.renderer.width,
                height: this.renderer.height,
            });
        };
        BattleScene.prototype.getVfxParams = function (props) {
            var bounds = this.getSceneBounds();
            var duration = this.activeVfx.duration * Options_1.options.battle.animationTiming.effectDuration;
            return ({
                user: this.userUnit,
                target: this.targetUnit,
                userOffset: this.getBattleSceneUnit(this.userUnit).spriteContainer.position,
                targetOffset: this.getBattleSceneUnit(this.targetUnit).spriteContainer.position,
                width: bounds.width,
                height: bounds.height,
                duration: duration,
                facingRight: this.userUnit.battleStats.side === "side1",
                renderer: this.renderer,
                abilityUseEffect: this.activeAbilityUseEffect,
                triggerStart: props.triggerStart,
                triggerEffect: this.executeTriggerEffectCallback.bind(this),
                triggerEnd: props.triggerEnd,
            });
        };
        BattleScene.prototype.getHighestPriorityUnitForSide = function (side) {
            var units = [];
            if (this.activeVfx) {
                units.push(this.targetUnit, this.userUnit);
            }
            else {
                units.push(this.activeUnit, this.hoveredUnit);
            }
            for (var i = 0; i < units.length; i++) {
                var unit = units[i];
                if (unit && unit.battleStats.side === side) {
                    return unit;
                }
            }
            return null;
        };
        BattleScene.prototype.haveBothUnitsFinishedUpdating = function () {
            return this.side1UnitHasFinishedUpdating && this.side2UnitHasFinishedUpdating;
        };
        BattleScene.prototype.executeIfBothUnitsHaveFinishedUpdating = function () {
            if (this.afterUnitsHaveFinishedUpdatingCallback && this.haveBothUnitsFinishedUpdating()) {
                var temp = this.afterUnitsHaveFinishedUpdatingCallback;
                this.afterUnitsHaveFinishedUpdatingCallback = null;
                temp();
            }
            else {
                return;
            }
        };
        BattleScene.prototype.finishUpdatingUnit = function (side) {
            debug.log("graphics", "finishUpdatingUnit", side);
            if (side === "side1") {
                this.side1UnitHasFinishedUpdating = true;
            }
            else {
                this.side2UnitHasFinishedUpdating = true;
            }
            this.executeIfBothUnitsHaveFinishedUpdating();
        };
        BattleScene.prototype.executeBeforeUseDelayHasFinishedCallback = function () {
            if (!this.beforeUseDelayHasFinishedCallback) {
                throw new Error("No callback set for 'before ability use delay' finish.");
            }
            var temp = this.beforeUseDelayHasFinishedCallback;
            this.beforeUseDelayHasFinishedCallback = null;
            temp();
        };
        BattleScene.prototype.executeOnVfxStartCallback = function () {
            if (this.onVfxStartCallback) {
                var temp = this.onVfxStartCallback;
                this.onVfxStartCallback = null;
                temp();
            }
        };
        BattleScene.prototype.executeTriggerEffectCallback = function () {
            if (this.triggerEffectCallback) {
                var temp = this.triggerEffectCallback;
                this.triggerEffectCallback = null;
                temp();
            }
        };
        BattleScene.prototype.executeAfterUseDelayHasFinishedCallback = function () {
            if (!this.afterUseDelayHasFinishedCallback) {
                throw new Error("No callback set for 'after ability use delay' finish.");
            }
            var temp = this.afterUseDelayHasFinishedCallback;
            this.afterUseDelayHasFinishedCallback = null;
            temp();
        };
        BattleScene.prototype.executeAbilityUseHasFinishedCallback = function () {
            if (!this.abilityUseHasFinishedCallback) {
                throw new Error("No callback set for ability use finish.");
            }
            var temp = this.abilityUseHasFinishedCallback;
            this.abilityUseHasFinishedCallback = null;
            temp();
        };
        BattleScene.prototype.prepareVfx = function () {
            var _this = this;
            var beforeUseDelay = Options_1.options.battle.animationTiming.before;
            var afterUnitsHaveFinishedUpdatingCallback = function () {
                if (beforeUseDelay >= 0) {
                    window.setTimeout(_this.executeBeforeUseDelayHasFinishedCallback.bind(_this), beforeUseDelay);
                }
                else {
                    _this.executeBeforeUseDelayHasFinishedCallback();
                }
            };
            this.updateUnits(afterUnitsHaveFinishedUpdatingCallback);
        };
        BattleScene.prototype.playVfx = function () {
            var vfxDuration = Options_1.options.battle.animationTiming.effectDuration * this.activeVfx.duration;
            this.executeOnVfxStartCallback();
            if (!this.activeVfx.vfxWillTriggerEffect || vfxDuration <= 0) {
                this.executeTriggerEffectCallback();
            }
            if (vfxDuration <= 0) {
                this.handleActiveVfxEnd();
            }
            else {
                this.triggerVfxStart(this.activeVfx, this.userUnit, this.targetUnit, this.handleActiveVfxEnd.bind(this));
            }
        };
        BattleScene.prototype.clearActiveVfx = function () {
            this.activeVfx = null;
            this.activeAbilityUseEffect = null;
            this.userUnit = null;
            this.targetUnit = null;
            this.clearBattleOverlay();
            this.clearUnitOverlays();
        };
        BattleScene.prototype.handleActiveVfxEnd = function () {
            var _this = this;
            var afterUseDelay = Options_1.options.battle.animationTiming.after;
            this.afterUseDelayHasFinishedCallback = function () {
                _this.clearActiveVfx();
                _this.executeAbilityUseHasFinishedCallback();
            };
            if (afterUseDelay >= 0) {
                window.setTimeout(this.executeAfterUseDelayHasFinishedCallback.bind(this), afterUseDelay);
            }
            else {
                this.executeAfterUseDelayHasFinishedCallback();
            }
        };
        BattleScene.prototype.triggerVfxStart = function (vfxTemplate, user, target, afterFinishedCallback) {
            this.activeVfx = vfxTemplate;
            this.side1Unit.setVfx(vfxTemplate, user, target);
            this.side2Unit.setVfx(vfxTemplate, user, target);
            this.side1Overlay.setVfx(vfxTemplate, user, target);
            this.side2Overlay.setVfx(vfxTemplate, user, target);
            this.makeBattleOverlay(afterFinishedCallback);
        };
        BattleScene.prototype.makeBattleOverlay = function (afterFinishedCallback) {
            if (!this.activeVfx) {
                throw new Error("Tried to make battle overlay without active Vfx");
            }
            if (!this.activeVfx.battleOverlay) {
                afterFinishedCallback();
            }
            else {
                var vfxParams = this.getVfxParams({
                    triggerStart: this.addBattleOverlay.bind(this),
                    triggerEnd: afterFinishedCallback,
                });
                this.activeVfx.battleOverlay(vfxParams);
            }
        };
        BattleScene.prototype.addBattleOverlay = function (overlay) {
            this.layers.battleOverlay.addChild(overlay);
        };
        BattleScene.prototype.clearBattleOverlay = function () {
            this.layers.battleOverlay.removeChildren();
        };
        BattleScene.prototype.clearUnitOverlays = function () {
            this.side1Overlay.clearOverlay();
            this.side2Overlay.clearOverlay();
        };
        BattleScene.prototype.getBattleSceneUnit = function (unit) {
            switch (unit.battleStats.side) {
                case "side1":
                    {
                        return this.side1Unit;
                    }
                case "side2":
                    {
                        return this.side2Unit;
                    }
            }
        };
        BattleScene.prototype.render = function () {
            if (this.isPaused) {
                if (this.forceFrame) {
                    this.forceFrame = false;
                }
                else {
                    return;
                }
            }
            this.renderer.render(this.container);
            TWEEN.update();
            window.requestAnimationFrame(this.render.bind(this));
        };
        return BattleScene;
    }());
    exports.BattleScene = BattleScene;
});
define("src/BattleSceneUnit", ["require", "exports", "@tweenjs/tween.js", "pixi.js", "src/Options", "src/debug"], function (require, exports, TWEEN, PIXI, Options_1, debug) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattleSceneUnit = (function () {
        function BattleSceneUnit(container, renderer, side) {
            this.unitState = 3;
            this.hasVfxSprite = false;
            this.container = container;
            this.renderer = renderer;
            this.side = side;
            this.spriteContainer = new PIXI.Container();
            this.container.addChild(this.spriteContainer);
        }
        BattleSceneUnit.prototype.setActiveUnit = function (unit, afterChangedCallback) {
            debug.log("graphics", "setActiveUnit", this.side, unit ? unit.id : unit);
            if (this.hasVfxSprite) {
                if (unit) {
                    this.enterUnitSpriteWithoutAnimation(unit);
                }
                else {
                    this.exitUnitSpriteWithoutAnimation();
                }
                this.hasVfxSprite = false;
            }
            else if (!unit && this.activeUnit) {
                this.onFinishExit = afterChangedCallback;
                this.exitUnitSprite();
            }
            else if (unit && unit !== this.activeUnit) {
                this.onFinishEnter = afterChangedCallback;
                this.enterUnitSprite(unit);
            }
            else if (afterChangedCallback) {
                afterChangedCallback();
            }
        };
        BattleSceneUnit.prototype.setVfx = function (vfxTemplate, user, target) {
            if (this.activeUnit) {
                var duration = vfxTemplate.duration * Options_1.options.battle.animationTiming.effectDuration;
                if (this.activeUnit === user && vfxTemplate.userSprite) {
                    this.setVfxSprite(vfxTemplate.userSprite, duration);
                }
                else if (this.activeUnit === target && vfxTemplate.enemySprite) {
                    this.setVfxSprite(vfxTemplate.enemySprite, duration);
                }
                else {
                }
            }
            else {
            }
        };
        BattleSceneUnit.prototype.resize = function () {
            if (this.spriteContainer.children.length > 0) {
                this.setContainerPosition();
            }
        };
        BattleSceneUnit.prototype.enterUnitSpriteWithoutAnimation = function (unit) {
            this.setUnit(unit);
            this.setUnitSprite(unit);
            this.finishUnitSpriteEnter();
        };
        BattleSceneUnit.prototype.exitUnitSpriteWithoutAnimation = function () {
            this.finishUnitSpriteExit();
        };
        BattleSceneUnit.prototype.enterUnitSprite = function (unit) {
            if (this.unitState === 1) {
                this.onFinishExit = this.startUnitSpriteEnter.bind(this, unit);
                this.exitUnitSprite();
            }
            else if (this.unitState === 2) {
                this.onFinishExit = this.startUnitSpriteEnter.bind(this, unit);
            }
            else {
                this.clearUnit();
                this.clearUnitSprite();
                this.startUnitSpriteEnter(unit);
            }
        };
        BattleSceneUnit.prototype.exitUnitSprite = function () {
            switch (this.unitState) {
                case 0:
                    {
                        this.finishUnitSpriteExit();
                        break;
                    }
                case 1:
                    {
                        this.startUnitSpriteExit();
                        break;
                    }
                case 2:
                    {
                        this.onFinishExit = undefined;
                        break;
                    }
                default:
                    {
                        console.warn("called exitUnitSprite with unintended animation state " + this.unitState);
                    }
            }
        };
        BattleSceneUnit.prototype.startUnitSpriteEnter = function (unit) {
            debug.log("graphics", "startUnitSpriteEnter", this.side, unit.id);
            var enterAnimationDuration = Options_1.options.battle.animationTiming.unitEnter;
            if (enterAnimationDuration <= 0) {
                this.enterUnitSpriteWithoutAnimation(unit);
                return;
            }
            this.setUnit(unit);
            this.setUnitSprite(unit);
            this.unitState = 0;
            this.tween = this.makeEnterExitTween("enter", enterAnimationDuration, this.finishUnitSpriteEnter.bind(this));
            this.tween.start();
        };
        BattleSceneUnit.prototype.finishUnitSpriteEnter = function () {
            debug.log("graphics", this.side, this.activeUnit ? this.activeUnit.id : null, "finishUnitSpriteEnter");
            this.unitState = 1;
            this.clearTween();
            if (this.onFinishEnter) {
                debug.log("graphics", this.side, this.activeUnit ? this.activeUnit.id : null, "onFinishEnter");
                this.onFinishEnter();
                this.onFinishEnter = undefined;
            }
        };
        BattleSceneUnit.prototype.startUnitSpriteExit = function () {
            debug.log("graphics", this.side, this.activeUnit ? this.activeUnit.id : null, "startUnitSpriteExit");
            var exitAnimationDuration = Options_1.options.battle.animationTiming.unitExit;
            if (exitAnimationDuration <= 0) {
                this.exitUnitSpriteWithoutAnimation();
                return;
            }
            this.unitState = 2;
            this.tween = this.makeEnterExitTween("exit", exitAnimationDuration, this.finishUnitSpriteExit.bind(this));
            this.tween.start();
        };
        BattleSceneUnit.prototype.finishUnitSpriteExit = function () {
            debug.log("graphics", this.side, this.activeUnit ? this.activeUnit.id : null, "finishUnitSpriteExit");
            this.clearUnit();
            this.clearUnitSprite();
            if (this.onFinishExit) {
                this.onFinishExit();
                this.onFinishExit = undefined;
            }
        };
        BattleSceneUnit.prototype.getVfxParams = function (props) {
            var bounds = this.getSceneBounds();
            return ({
                user: props.unit,
                userOffset: { x: 0, y: 0 },
                width: bounds.width,
                height: bounds.height,
                duration: props.duration,
                facingRight: props.unit.battleStats.side === "side1",
                renderer: this.renderer,
                triggerStart: props.triggerStart,
                triggerEffect: function () { },
                triggerEnd: props.triggerEnd || (function () { }),
            });
        };
        BattleSceneUnit.prototype.setContainerPosition = function () {
            var sceneBounds = this.getSceneBounds();
            var shouldReverse = this.side === "side2";
            var containerBounds = this.spriteContainer.getLocalBounds();
            var xPadding = 25;
            var yPadding = 40;
            this.spriteContainer.y = Math.round(sceneBounds.height - containerBounds.height - containerBounds.y - yPadding);
            if (shouldReverse) {
                this.spriteContainer.scale.x = -1;
                this.spriteContainer.x = Math.round(sceneBounds.width - xPadding);
            }
            else {
                this.spriteContainer.x = Math.round(xPadding);
            }
        };
        BattleSceneUnit.prototype.setUnit = function (unit) {
            this.clearUnit();
            this.activeUnit = unit;
        };
        BattleSceneUnit.prototype.clearUnit = function () {
            this.unitState = 3;
            this.activeUnit = null;
            this.clearTween();
        };
        BattleSceneUnit.prototype.makeUnitSprite = function (unit, vfxParams) {
            return unit.drawBattleScene(vfxParams);
        };
        BattleSceneUnit.prototype.addUnitSprite = function (sprite) {
            this.spriteContainer.addChild(sprite);
            this.setContainerPosition();
        };
        BattleSceneUnit.prototype.clearUnitSprite = function () {
            this.spriteContainer.removeChildren();
        };
        BattleSceneUnit.prototype.setUnitSprite = function (unit) {
            this.clearUnitSprite();
            var vfxParams = this.getVfxParams({
                unit: unit,
                triggerStart: this.addUnitSprite.bind(this),
            });
            this.makeUnitSprite(unit, vfxParams);
        };
        BattleSceneUnit.prototype.clearTween = function () {
            if (this.tween) {
                debug.log("graphics", this.side, this.activeUnit ? this.activeUnit.id : null, "clearTween");
                this.tween.stop();
                TWEEN.remove(this.tween);
                this.tween = null;
            }
        };
        BattleSceneUnit.prototype.makeEnterExitTween = function (direction, duration, onComplete) {
            var side = this.activeUnit.battleStats.side;
            var container = this.spriteContainer;
            var bounds = container.getBounds();
            var distanceToMove = bounds.width * 1.25;
            if (side === "side2") {
                distanceToMove *= -1;
            }
            var offscreenLocation = container.x - distanceToMove;
            var stationaryLocation = container.x;
            var startX = direction === "enter" ? offscreenLocation : stationaryLocation;
            var finishX = direction === "enter" ? stationaryLocation : offscreenLocation;
            container.x = startX;
            var tweeningObject = { x: startX };
            var tween = new TWEEN.Tween(tweeningObject).to({
                x: finishX,
            }, duration).onStart(function () {
                container.x = startX;
            }).onUpdate(function () {
                container.x = tweeningObject.x;
            }).onComplete(onComplete);
            tween.start();
            return tween;
        };
        BattleSceneUnit.prototype.setVfxSprite = function (spriteDrawingFN, duration) {
            this.clearUnitSprite();
            var vfxParams = this.getVfxParams({
                unit: this.activeUnit,
                duration: duration,
                triggerStart: this.addUnitSprite.bind(this),
            });
            this.hasVfxSprite = true;
            spriteDrawingFN(vfxParams);
        };
        return BattleSceneUnit;
    }());
    exports.BattleSceneUnit = BattleSceneUnit;
});
define("src/BattleSceneUnitOverlay", ["require", "exports", "pixi.js", "src/Options"], function (require, exports, PIXI, Options_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattleSceneUnitOverlay = (function () {
        function BattleSceneUnitOverlay(container, renderer) {
            this.animationIsActive = false;
            this.container = container;
            this.renderer = renderer;
            this.initLayers();
        }
        BattleSceneUnitOverlay.prototype.destroy = function () {
        };
        BattleSceneUnitOverlay.prototype.initLayers = function () {
            this.overlayContainer = new PIXI.Container();
            this.container.addChild(this.overlayContainer);
        };
        BattleSceneUnitOverlay.prototype.setVfx = function (vfxTemplate, user, target) {
            if (this.activeUnit) {
                var duration = vfxTemplate.duration * Options_1.options.battle.animationTiming.effectDuration;
                if (this.activeUnit === user && vfxTemplate.userOverlay) {
                    this.setOverlay(vfxTemplate.userOverlay, user, duration);
                }
                else if (this.activeUnit === target && vfxTemplate.enemyOverlay) {
                    this.setOverlay(vfxTemplate.enemyOverlay, target, duration);
                }
                else {
                }
            }
            else {
            }
        };
        BattleSceneUnitOverlay.prototype.setOverlay = function (overlayFN, unit, duration) {
            this.clearOverlay();
            if (duration <= 0) {
                return;
            }
            if (this.animationIsActive) {
                console.warn("Triggered new unit overlay animation without clearing previous one");
            }
            this.activeUnit = unit;
            var vfxParams = this.getVfxParams(duration, this.addOverlay.bind(this), this.finishAnimation.bind(this));
            overlayFN(vfxParams);
        };
        BattleSceneUnitOverlay.prototype.clearOverlay = function () {
            this.animationIsActive = false;
            this.onAnimationFinish = null;
            this.activeUnit = null;
            this.overlayContainer.removeChildren();
        };
        BattleSceneUnitOverlay.prototype.getVfxParams = function (duration, triggerStart, triggerEnd) {
            var bounds = this.getSceneBounds();
            return ({
                user: this.activeUnit,
                userOffset: { x: 0, y: 0 },
                width: bounds.width,
                height: bounds.height,
                duration: duration,
                facingRight: this.activeUnit.battleStats.side === "side1",
                renderer: this.renderer,
                triggerStart: triggerStart,
                triggerEffect: function () { },
                triggerEnd: triggerEnd || (function () { }),
            });
        };
        BattleSceneUnitOverlay.prototype.setContainerPosition = function () {
            var sceneBounds = this.getSceneBounds();
            var shouldLockToRight = this.activeUnit.battleStats.side === "side2";
            var containerBounds = this.overlayContainer.getLocalBounds();
            this.overlayContainer.y = sceneBounds.height - containerBounds.height;
            if (shouldLockToRight) {
                this.overlayContainer.x = sceneBounds.width - containerBounds.width;
            }
        };
        BattleSceneUnitOverlay.prototype.addOverlay = function (overlay) {
            this.animationIsActive = true;
            this.overlayContainer.addChild(overlay);
            this.setContainerPosition();
        };
        BattleSceneUnitOverlay.prototype.finishAnimation = function () {
            if (this.onAnimationFinish) {
                this.onAnimationFinish();
            }
            this.clearOverlay();
        };
        return BattleSceneUnitOverlay;
    }());
    exports.BattleSceneUnitOverlay = BattleSceneUnitOverlay;
});
define("src/BattleSimulator", ["require", "exports", "src/MCTree", "src/Options", "src/battleAbilityUsage"], function (require, exports, MCTree_1, Options_1, battleAbilityUsage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattleSimulator = (function () {
        function BattleSimulator(battle) {
            this.hasEnded = false;
            this.battle = battle;
            battle.isSimulated = true;
            if (!battle.ended) {
                this.tree = new MCTree_1.MCTree(this.battle, this.battle.activeUnit.battleStats.side);
            }
        }
        BattleSimulator.prototype.simulateBattle = function () {
            while (!this.battle.ended) {
                this.simulateMove();
            }
        };
        BattleSimulator.prototype.simulateMove = function () {
            if (!this.battle.activeUnit || this.battle.ended) {
                throw new Error("Simulated battle already ended");
            }
            var rootVisitsUnderSimulationDepth = Math.min(Options_1.options.debug.aiVsAiBattleSimulationDepth - this.tree.rootNode.visits, 0);
            var iterations = Math.max(rootVisitsUnderSimulationDepth, this.tree.rootNode.getPossibleMoves(this.battle).length * Math.log(Options_1.options.debug.aiVsPlayerBattleSimulationDepth), Options_1.options.debug.aiVsAiBattleSimulationDepth / 2);
            var move = this.tree.getBestMoveAndAdvance(iterations, 1.0);
            var target = this.battle.unitsById[move.targetId];
            this.simulateAbility(move.ability, target);
            this.battle.endTurn();
        };
        BattleSimulator.prototype.simulateAbility = function (ability, target) {
            battleAbilityUsage_1.useAbility(this.battle, ability, this.battle.activeUnit, target);
        };
        BattleSimulator.prototype.finishBattle = function () {
            this.battle.finishBattle();
        };
        return BattleSimulator;
    }());
    exports.BattleSimulator = BattleSimulator;
});
define("src/BattleTurnOrder", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattleTurnOrder = (function () {
        function BattleTurnOrder() {
            this.allUnits = [];
            this.orderedUnits = [];
        }
        BattleTurnOrder.prototype.destroy = function () {
            this.allUnits = [];
            this.orderedUnits = [];
        };
        BattleTurnOrder.prototype.addUnit = function (unit) {
            if (this.hasUnit(unit)) {
                throw new Error("Unit " + unit.name + " is already part of turn order.");
            }
            this.allUnits.push(unit);
            this.orderedUnits.push(unit);
        };
        BattleTurnOrder.prototype.update = function () {
            this.orderedUnits = this.allUnits.filter(BattleTurnOrder.turnOrderFilterFN);
            this.orderedUnits.sort(BattleTurnOrder.turnOrderSortFN);
        };
        BattleTurnOrder.prototype.getActiveUnit = function () {
            return this.orderedUnits[0];
        };
        BattleTurnOrder.prototype.getDisplayData = function () {
            return this.orderedUnits.map(BattleTurnOrder.getDisplayDataFromUnit);
        };
        BattleTurnOrder.prototype.getGhostIndex = function (ghostMoveDelay, ghostId) {
            for (var i = 0; i < this.orderedUnits.length; i++) {
                var unit = this.orderedUnits[i];
                var unitMoveDelay = unit.battleStats.moveDelay;
                if (ghostMoveDelay < unitMoveDelay) {
                    return i;
                }
                else if (ghostMoveDelay === unitMoveDelay && ghostId < unit.id) {
                    return i;
                }
            }
            return this.orderedUnits.length;
        };
        BattleTurnOrder.prototype.hasUnit = function (unit) {
            return this.allUnits.indexOf(unit) !== -1;
        };
        BattleTurnOrder.turnOrderFilterFN = function (unit) {
            if (unit.battleStats.currentActionPoints <= 0) {
                return false;
            }
            if (unit.currentHealth <= 0) {
                return false;
            }
            return true;
        };
        BattleTurnOrder.turnOrderSortFN = function (a, b) {
            if (a.battleStats.moveDelay !== b.battleStats.moveDelay) {
                return a.battleStats.moveDelay - b.battleStats.moveDelay;
            }
            else {
                return a.id - b.id;
            }
        };
        BattleTurnOrder.getDisplayDataFromUnit = function (unit) {
            return ({
                moveDelay: unit.battleStats.moveDelay,
                unit: unit,
                displayName: unit.name,
            });
        };
        return BattleTurnOrder;
    }());
    exports.BattleTurnOrder = BattleTurnOrder;
});
define("src/borderPolygon", ["require", "exports", "polygon-offset", "src/Star", "src/utility"], function (require, exports, Offset, Star_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.borderWidth = 8;
    function starsOnlyShareNarrowBorder(a, b) {
        var minBorderWidth = exports.borderWidth * 2;
        var edge = a.getEdgeWith(b);
        if (!edge) {
            return false;
        }
        var edgeLength = Math.abs(edge.va.x - edge.vb.x) + Math.abs(edge.va.y - edge.vb.y);
        if (edgeLength < minBorderWidth) {
            var sharedNeighborPoints = a.getSharedNeighborsWith(b);
            var sharedOwnedNeighbors = sharedNeighborPoints.filter(function (sharedNeighborPoint) {
                return Boolean(sharedNeighborPoint.owner);
            }).filter(function (sharedNeighborStar) {
                return sharedNeighborStar.owner === a.owner;
            });
            return sharedOwnedNeighbors.length === 0;
        }
        else {
            return false;
        }
    }
    exports.starsOnlyShareNarrowBorder = starsOnlyShareNarrowBorder;
    function getBorderingHalfEdges(stars) {
        var borderingHalfEdges = [];
        function getHalfEdgeOppositeSite(halfEdge) {
            return halfEdge.edge.lSite === halfEdge.site ?
                halfEdge.edge.rSite : halfEdge.edge.lSite;
        }
        function halfEdgeIsBorder(halfEdge) {
            var oppositeSite = getHalfEdgeOppositeSite(halfEdge);
            var isBorderWithOtherOwner = !oppositeSite || !oppositeSite.owner || (oppositeSite.owner !== halfEdge.site.owner);
            var isBorderWithSameOwner = false;
            if (!isBorderWithOtherOwner) {
                isBorderWithSameOwner = starsOnlyShareNarrowBorder(halfEdge.site, oppositeSite) ||
                    halfEdge.site.getDistanceToStar(oppositeSite) > 3;
            }
            return isBorderWithOtherOwner || isBorderWithSameOwner;
        }
        function halfEdgeSharesOwner(halfEdge) {
            var oppositeSite = getHalfEdgeOppositeSite(halfEdge);
            var sharesOwner = Boolean(oppositeSite) && Boolean(oppositeSite.owner) &&
                (oppositeSite.owner === halfEdge.site.owner);
            return sharesOwner && !starsOnlyShareNarrowBorder(halfEdge.site, oppositeSite);
        }
        function getContiguousHalfEdgeBetweenSharedSites(sharedEdge) {
            var contiguousEdgeEndPoint = sharedEdge.getStartpoint();
            var oppositeSite = getHalfEdgeOppositeSite(sharedEdge);
            for (var i = 0; i < oppositeSite.voronoiCell.halfedges.length; i++) {
                var halfEdge = oppositeSite.voronoiCell.halfedges[i];
                if (halfEdge.getStartpoint() === contiguousEdgeEndPoint) {
                    return halfEdge;
                }
            }
            return false;
        }
        var startEdge;
        var star;
        for (var i = 0; i < stars.length; i++) {
            if (star) {
                break;
            }
            for (var j = 0; j < stars[i].voronoiCell.halfedges.length; j++) {
                var halfEdge = stars[i].voronoiCell.halfedges[j];
                if (halfEdgeIsBorder(halfEdge)) {
                    star = stars[i];
                    startEdge = halfEdge;
                    break;
                }
            }
        }
        if (!star) {
            throw new Error("Couldn't find starting location for border polygon");
        }
        var hasProcessedStartEdge = false;
        var contiguousEdge = null;
        for (var j = 0; j < stars.length * 40; j++) {
            var indexShift = 0;
            for (var _i = 0; _i < star.voronoiCell.halfedges.length; _i++) {
                if (!hasProcessedStartEdge) {
                    contiguousEdge = startEdge;
                }
                if (contiguousEdge) {
                    indexShift = star.voronoiCell.halfedges.indexOf(contiguousEdge);
                    contiguousEdge = null;
                }
                var i = (_i + indexShift) % (star.voronoiCell.halfedges.length);
                var halfEdge = star.voronoiCell.halfedges[i];
                if (halfEdgeIsBorder(halfEdge)) {
                    borderingHalfEdges.push({
                        star: star,
                        halfEdge: halfEdge,
                    });
                    if (!startEdge) {
                        startEdge = halfEdge;
                    }
                    else if (halfEdge === startEdge) {
                        if (!hasProcessedStartEdge) {
                            hasProcessedStartEdge = true;
                        }
                        else {
                            return borderingHalfEdges;
                        }
                    }
                }
                else if (halfEdgeSharesOwner(halfEdge)) {
                    contiguousEdge = getContiguousHalfEdgeBetweenSharedSites(halfEdge);
                    star = contiguousEdge.site;
                    break;
                }
            }
        }
        throw new Error("getHalfEdgesConnectingStars got stuck in infinite loop when star id = " + star.id);
    }
    exports.getBorderingHalfEdges = getBorderingHalfEdges;
    function joinPointsWithin(points, maxDistance) {
        for (var i = points.length - 2; i >= 0; i--) {
            var x1 = points[i].x;
            var y1 = points[i].y;
            var x2 = points[i + 1].x;
            var y2 = points[i + 1].y;
            if (Math.abs(x1 - x2) + Math.abs(y1 - y2) < maxDistance) {
                var newPoint = {
                    x: (x1 + x2) / 2,
                    y: (y1 + y2) / 2,
                };
                points.splice(i, 2, newPoint);
            }
        }
    }
    exports.joinPointsWithin = joinPointsWithin;
    function convertHalfEdgeDataToOffset(halfEdgeData) {
        var convertedToPoints = halfEdgeData.map(function (data) {
            var v1 = data.halfEdge.getStartpoint();
            return ({
                x: v1.x,
                y: v1.y,
            });
        });
        joinPointsWithin(convertedToPoints, exports.borderWidth / 2);
        var offset = new Offset();
        offset.arcSegments(0);
        var convertedToOffset = offset.data(convertedToPoints).padding(exports.borderWidth / 2);
        return convertedToOffset;
    }
    exports.convertHalfEdgeDataToOffset = convertHalfEdgeDataToOffset;
    function getRevealedBorderEdges(revealedStars, voronoiInfo) {
        var polyLines = [];
        var processedStarsById = {};
        for (var ii = 0; ii < revealedStars.length; ii++) {
            var star = revealedStars[ii];
            if (processedStarsById[star.id]) {
                continue;
            }
            if (!star.owner.isIndependent) {
                var ownedIsland = Star_1.Star.getIslandForQualifier([star], null, function (a, b) {
                    return (a.owner === b.owner && !starsOnlyShareNarrowBorder(a, b));
                });
                var currentPolyLine = [];
                var halfEdgesDataForIsland = getBorderingHalfEdges(ownedIsland);
                var offsetted = convertHalfEdgeDataToOffset(halfEdgesDataForIsland);
                for (var j = 0; j < offsetted.length; j++) {
                    var point = offsetted[j];
                    var nextPoint = offsetted[(j + 1) % offsetted.length];
                    var edgeCenter = {
                        x: utility_1.clamp((point.x + nextPoint.x) / 2, voronoiInfo.bounds.x1, voronoiInfo.bounds.x2),
                        y: utility_1.clamp((point.y + nextPoint.y) / 2, voronoiInfo.bounds.y1, voronoiInfo.bounds.y2),
                    };
                    var pointStar = point.star || voronoiInfo.getStarAtPoint(edgeCenter);
                    if (!pointStar) {
                        pointStar = voronoiInfo.getStarAtPoint(point);
                        if (!pointStar) {
                            pointStar = voronoiInfo.getStarAtPoint(nextPoint);
                        }
                    }
                    processedStarsById[pointStar.id] = true;
                    point.star = pointStar;
                }
                var startIndex = 0;
                for (var j = 0; j < offsetted.length; j++) {
                    var currPoint = offsetted[j];
                    var prevPoint = offsetted[(j === 0 ? offsetted.length - 1 : j - 1)];
                    if (revealedStars.indexOf(currPoint.star) !== -1 && revealedStars.indexOf(prevPoint.star) === -1) {
                        startIndex = j;
                    }
                }
                for (var _j = startIndex; _j < offsetted.length + startIndex; _j++) {
                    var j = _j % offsetted.length;
                    var point = offsetted[j];
                    if (revealedStars.indexOf(point.star) === -1) {
                        if (currentPolyLine.length > 1) {
                            currentPolyLine.push(point);
                            polyLines.push(currentPolyLine);
                            currentPolyLine = [];
                        }
                    }
                    else {
                        currentPolyLine.push(point);
                    }
                }
                if (currentPolyLine.length > 1) {
                    polyLines.push(currentPolyLine);
                }
            }
        }
        var polyLinesData = [];
        for (var i = 0; i < polyLines.length; i++) {
            var polyLine = polyLines[i];
            var isClosed = utility_1.pointsEqual(polyLine[0], polyLine[polyLine.length - 1]);
            if (isClosed) {
                polyLine.pop();
            }
            for (var j = 0; j < polyLine.length; j++) {
                polyLine[j].x += (j % 2) * 0.1;
                polyLine[j].y += (j % 2) * 0.1;
            }
            polyLinesData.push({
                points: polyLine,
                isClosed: isClosed,
            });
        }
        return polyLinesData;
    }
    exports.getRevealedBorderEdges = getRevealedBorderEdges;
});
define("src/Building", ["require", "exports", "src/idGenerators"], function (require, exports, idGenerators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Building = (function () {
        function Building(props) {
            this.template = props.template;
            this.id = (props.id && isFinite(props.id)) ? props.id : idGenerators_1.idGenerators.building++;
            this.location = props.location;
            this.controller = props.controller || this.location.owner;
            this.totalCost = props.totalCost || this.template.buildCost || 0;
        }
        Building.prototype.getEffect = function () {
            if (!this.template.getEffect) {
                return {};
            }
            return this.template.getEffect();
        };
        Building.prototype.getStandardUpgrades = function () {
            var _this = this;
            var upgrades = [];
            if (this.template.getStandardUpgradeTargets) {
                var possibleUpgradeTargets = this.template.getStandardUpgradeTargets(this.location);
                possibleUpgradeTargets.forEach(function (upgradeTarget) {
                    upgrades.push({
                        template: upgradeTarget,
                        cost: upgradeTarget.buildCost,
                        parentBuilding: _this,
                    });
                });
            }
            return upgrades;
        };
        Building.prototype.upgrade = function (upgradeData) {
            var oldTemplate = this.template;
            this.template = upgradeData.template;
            this.totalCost += upgradeData.cost;
            this.location.buildings.handleBuidlingUpgrade(this, oldTemplate);
        };
        Building.prototype.setController = function (newController) {
            var oldController = this.controller;
            if (oldController === newController) {
                return;
            }
            this.controller = newController;
            this.location.updateController();
        };
        Building.prototype.isOfFamily = function (familyToCheck) {
            return this.template.families.some(function (templateFamily) {
                return templateFamily === familyToCheck;
            });
        };
        Building.prototype.serialize = function () {
            return ({
                templateType: this.template.type,
                id: this.id,
                locationId: this.location.id,
                controllerId: this.controller.id,
                totalCost: this.totalCost,
            });
        };
        return Building;
    }());
    exports.Building = Building;
});
define("src/BuildingCollection", ["require", "exports", "src/BuildingEffect", "src/FlatAndMultiplierAdjustment"], function (require, exports, BuildingEffect_1, FlatAndMultiplierAdjustment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BuildingCollection = (function () {
        function BuildingCollection(props) {
            if (props === void 0) { props = {}; }
            this.buildings = [];
            this.cachedEffectsAreDirty = true;
            this.onAddBuilding = props.onAddBuilding;
            this.onRemoveBuilding = props.onRemoveBuilding;
            this.onUpgradeBuilding = props.onUpgradeBuilding;
        }
        BuildingCollection.prototype.has = function (building) {
            return this.buildings.indexOf(building) !== -1;
        };
        BuildingCollection.prototype.add = function (building) {
            if (this.has(building)) {
                throw new Error("Already has building");
            }
            this.buildings.push(building);
            if (this.onAddBuilding) {
                this.onAddBuilding(building);
            }
        };
        BuildingCollection.prototype.remove = function (building) {
            var index = this.buildings.indexOf(building);
            if (index === -1) {
                throw new Error("");
            }
            this.buildings.splice(index, 1);
            if (this.onRemoveBuilding) {
                this.onRemoveBuilding(building);
            }
        };
        BuildingCollection.prototype.forEach = function (callbackFn) {
            this.buildings.forEach(callbackFn);
        };
        BuildingCollection.prototype.map = function (callbackFn) {
            return this.buildings.map(callbackFn);
        };
        BuildingCollection.prototype.getBuildingsByFamily = function () {
            var byFamily = {};
            this.forEach(function (building) {
                building.template.families.forEach(function (family) {
                    if (!byFamily[family.type]) {
                        byFamily[family.type] = [];
                    }
                    byFamily[family.type].push(building);
                });
            });
            return byFamily;
        };
        BuildingCollection.prototype.filter = function (filterFn) {
            return this.buildings.filter(filterFn);
        };
        BuildingCollection.prototype.getEffects = function () {
            if (this.cachedEffectsAreDirty) {
                this.cachedEffects = this.calculateBuildingEffects();
            }
            return this.cachedEffects;
        };
        BuildingCollection.prototype.handleBuidlingUpgrade = function (building, oldTemplate) {
            this.cachedEffectsAreDirty = true;
            if (this.onUpgradeBuilding) {
                this.onUpgradeBuilding(building, oldTemplate);
            }
        };
        BuildingCollection.prototype.serialize = function () {
            return this.buildings.map(function (building) { return building.serialize(); });
        };
        BuildingCollection.prototype.calculateBuildingEffects = function () {
            var baseEffect = BuildingEffect_1.getBaseBuildingEffect();
            var buildingEffects = this.buildings.map(function (building) { return building.getEffect(); });
            var squashed = FlatAndMultiplierAdjustment_1.squashAdjustmentsObjects.apply(void 0, [baseEffect].concat(buildingEffects));
            return squashed;
        };
        return BuildingCollection;
    }());
    exports.BuildingCollection = BuildingCollection;
});
define("src/BuildingEffect", ["require", "exports", "src/FlatAndMultiplierAdjustment"], function (require, exports, FlatAndMultiplierAdjustment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getBaseBuildingEffect() {
        return ({
            vision: FlatAndMultiplierAdjustment_1.getBaseAdjustment(),
            detection: FlatAndMultiplierAdjustment_1.getBaseAdjustment(),
            income: FlatAndMultiplierAdjustment_1.getBaseAdjustment(),
            resourceIncome: FlatAndMultiplierAdjustment_1.getBaseAdjustment(),
            researchPoints: FlatAndMultiplierAdjustment_1.getBaseAdjustment(),
        });
    }
    exports.getBaseBuildingEffect = getBaseBuildingEffect;
});
define("src/Camera", ["require", "exports", "src/centerCameraOnPosition", "src/eventManager", "src/utility"], function (require, exports, centerCameraOnPosition_1, eventManager_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Camera = (function () {
        function Camera(container) {
            this.container = container;
            this.setSize = this.setSize.bind(this);
            this.setSize();
            this.addEventListeners();
            centerCameraOnPosition_1.registerActiveCamera(this);
        }
        Camera.prototype.destroy = function () {
            centerCameraOnPosition_1.registerActiveCamera(null);
            this.removeEventListeners();
            this.getBoundsObjectBoundsFN = null;
        };
        Camera.prototype.move = function (x, y) {
            this.container.pivot.set(x, y);
            this.clampEdges();
            this.onMove();
        };
        Camera.prototype.deltaMove = function (deltaX, deltaY) {
            this.move(this.container.pivot.x + deltaX, this.container.pivot.y + deltaY);
        };
        Camera.prototype.startScroll = function (position) {
            this.scrollPosition = { x: position.x, y: position.y };
        };
        Camera.prototype.scrollMove = function (position) {
            this.deltaMove((this.scrollPosition.x - position.x) / this.container.scale.x, (this.scrollPosition.y - position.y) / this.container.scale.y);
            this.scrollPosition = { x: position.x, y: position.y };
        };
        Camera.prototype.zoom = function (zoomAmount) {
            this.container.scale.set(zoomAmount, zoomAmount);
            this.onMove();
            this.onZoom();
        };
        Camera.prototype.deltaZoom = function (delta, scale) {
            if (delta === 0) {
                return;
            }
            var direction = delta < 0 ? "in" : "out";
            var adjDelta = 1 + Math.abs(delta) * scale;
            if (direction === "out") {
                this.zoom(this.container.scale.x / adjDelta);
            }
            else {
                this.zoom(this.container.scale.x * adjDelta);
            }
        };
        Camera.prototype.getCenterPosition = function () {
            return { x: this.container.pivot.x, y: this.container.pivot.y };
        };
        Camera.prototype.centerOnPosition = function (x, y) {
            this.container.pivot.set(x, y);
        };
        Camera.prototype.addEventListeners = function () {
            window.addEventListener("resize", this.setSize);
        };
        Camera.prototype.removeEventListeners = function () {
            window.removeEventListener("resize", this.setSize);
        };
        Camera.prototype.onMove = function () {
            eventManager_1.eventManager.dispatchEvent("cameraMoved", this.container.position.x, this.container.position.y);
        };
        Camera.prototype.onZoom = function () {
            eventManager_1.eventManager.dispatchEvent("cameraZoomed", this.container.scale.x);
        };
        Camera.prototype.setSize = function () {
            var container = document.getElementById("pixi-container");
            if (!container) {
                throw new Error("Camera has no container element");
            }
            var style = window.getComputedStyle(container);
            this.width = parseInt(style.width);
            this.height = parseInt(style.height);
            this.container.position.set(this.width / 2, this.height / 2);
        };
        Camera.prototype.clampEdges = function () {
            var bounds = this.getBoundsObjectBoundsFN();
            this.container.pivot.x = utility_1.clamp(this.container.pivot.x, bounds.x, bounds.x + bounds.width);
            this.container.pivot.y = utility_1.clamp(this.container.pivot.y, bounds.y, bounds.y + bounds.height);
        };
        return Camera;
    }());
    exports.Camera = Camera;
});
define("src/centerCameraOnPosition", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var activeCamera;
    var deferredPositionToCenterOn;
    function centerCameraOnPosition(position) {
        if (activeCamera) {
            activeCamera.centerOnPosition(position.x, position.y);
        }
        else {
            deferredPositionToCenterOn = { x: position.x, y: position.y };
        }
    }
    exports.centerCameraOnPosition = centerCameraOnPosition;
    function registerActiveCamera(camera) {
        activeCamera = camera;
        if (deferredPositionToCenterOn) {
            centerCameraOnPosition(deferredPositionToCenterOn);
        }
        deferredPositionToCenterOn = null;
    }
    exports.registerActiveCamera = registerActiveCamera;
});
define("src/Color", ["require", "exports", "hsluv"], function (require, exports, hsluv) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Color = (function () {
        function Color(r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
        }
        Color.fromHex = function (hex) {
            return new Color((hex >> 16 & 0xFF) / 255, (hex >> 8 & 0xFF) / 255, (hex & 0xFF) / 255);
        };
        Color.fromHexString = function (hexString) {
            var hexDigits;
            if (hexString.charAt(0) === "#") {
                hexDigits = hexString.substring(1, 7);
            }
            else {
                hexDigits = hexString;
            }
            return Color.fromHex(parseInt(hexDigits, 16));
        };
        Color.fromHSV = function (h, s, v) {
            var r;
            var g;
            var b;
            var i;
            var f;
            var p;
            var q;
            var t;
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0:
                    r = v, g = t, b = p;
                    break;
                case 1:
                    r = q, g = v, b = p;
                    break;
                case 2:
                    r = p, g = v, b = t;
                    break;
                case 3:
                    r = p, g = q, b = v;
                    break;
                case 4:
                    r = t, g = p, b = v;
                    break;
                case 5:
                    r = v, g = p, b = q;
                    break;
            }
            return new Color(r, g, b);
        };
        Color.fromHSL = function (h, s, l) {
            var r;
            var g;
            var b;
            function hue2rgb(p, q, t) {
                var t2 = t;
                if (t2 < 0) {
                    t2 += 1;
                }
                if (t2 > 1) {
                    t2 -= 1;
                }
                if (t2 < 1 / 6) {
                    return p + (q - p) * 6 * t2;
                }
                if (t2 < 1 / 2) {
                    return q;
                }
                if (t2 < 2 / 3) {
                    return p + (q - p) * (2 / 3 - t2) * 6;
                }
                return p;
            }
            if (s === 0) {
                r = g = b = l;
            }
            else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            return new Color(r, g, b);
        };
        Color.fromHUSL = function (h, s, l) {
            var RGB = hsluv.hsluvToRgb([h * 360, s * 100, l * 100]);
            return new Color(RGB[0], RGB[1], RGB[2]);
        };
        Color.convertScalarsToDegrees = function (s) {
            return [s[0] * 360, s[1] * 100, s[2] * 100];
        };
        Color.convertDegreesToScalars = function (d) {
            return [d[0] / 360, d[1] / 100, d[2] / 100];
        };
        Color.prototype.getRGB = function () {
            return [this.r, this.g, this.b];
        };
        Color.prototype.getRGBA = function (alpha) {
            return [this.r, this.g, this.b, alpha];
        };
        Color.prototype.get8BitRGB = function () {
            return this.getRGB().map(function (x) { return Math.round(x * 255); });
        };
        Color.prototype.getHex = function () {
            return (this.r * 255 << 16) + (this.g * 255 << 8) + this.b * 255;
        };
        Color.prototype.getHexString = function () {
            var hex = Math.round(this.getHex());
            var converted = hex.toString(16);
            return "000000".substr(0, 6 - converted.length) + converted;
        };
        Color.prototype.getHUSL = function () {
            var husl = hsluv.rgbToHsluv([this.r, this.g, this.b]);
            return [husl[0] / 360, husl[1] / 100, husl[2] / 100];
        };
        Color.prototype.getHSV = function () {
            var r = this.r;
            var g = this.g;
            var b = this.b;
            var min = Math.min(r, g, b);
            var max = Math.max(r, g, b);
            var d = max - min;
            var h;
            var s = max === 0 ? 0 : d / max;
            var v = max;
            if (max === min) {
                h = 0;
            }
            else {
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }
            return [h, s, v];
        };
        Color.prototype.saturate = function (amount) {
            var husl = this.getHUSL();
            husl[1] += amount;
            return Color.fromHUSL.apply(null, husl);
        };
        Color.prototype.serialize = function () {
            return this.getRGB();
        };
        Color.deserialize = function (saveData) {
            return new Color(saveData[0], saveData[1], saveData[2]);
        };
        Color.prototype.clone = function () {
            return Color.deserialize(this.serialize());
        };
        return Color;
    }());
    exports.Color = Color;
});
define("src/colorGeneration", ["require", "exports", "src/Color", "src/rangeOperations", "src/utility"], function (require, exports, Color_1, rangeOperations_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeRandomVibrantColor() {
        var hRanges = [
            { min: 0, max: 90 / 360 },
            { min: 120 / 360, max: 150 / 360 },
            { min: 180 / 360, max: 290 / 360 },
            { min: 320 / 360, max: 1 },
        ];
        var h = rangeOperations_1.randomSelectFromRanges(hRanges);
        var s = utility_1.randRange(0.8, 0.9);
        var v = utility_1.randRange(0.88, 0.92);
        return Color_1.Color.fromHSV(h, s, v);
    }
    function makeRandomDeepColor() {
        var randomValue = Math.random();
        if (randomValue < 0.88) {
            var hRanges = [
                { min: 0 / 360, max: 30 / 360 },
                { min: 100 / 360, max: 360 / 360 },
            ];
            var h = rangeOperations_1.randomSelectFromRanges(hRanges);
            var s = utility_1.randRange(0.9, 1.0);
            var v = utility_1.randRange(0.6, 0.75);
            return Color_1.Color.fromHSV(h, s, v);
        }
        else if (randomValue < 0.96) {
            return makeRandomColor({
                h: [{ min: 46 / 360, max: 60 / 360 }],
                s: [{ min: 1, max: 1 }],
                l: [{ min: 0.72, max: 0.8 }],
            });
        }
        else {
            return makeRandomColor({
                h: [{ min: 15 / 360, max: 80 / 360 }],
                s: [{ min: 1, max: 1 }],
                l: [{ min: 0.45, max: 0.55 }],
            });
        }
    }
    function makeRandomLightVibrantColor() {
        return Color_1.Color.fromHSV(utility_1.randRange(0, 1), utility_1.randRange(0.55, 0.65), 1);
    }
    function makeRandomPastelColor() {
        return makeRandomColor({
            s: [{ min: 0.4, max: 0.6 }],
            l: [{ min: 0.88, max: 1 }],
        });
    }
    function makeRandomColor(props) {
        var hRanges = props.h || [{ min: 0, max: 1 }];
        var sRanges = props.s || [{ min: 0, max: 1 }];
        var lRanges = props.l || [{ min: 0, max: 1 }];
        var h = rangeOperations_1.randomSelectFromRanges(hRanges);
        var s = rangeOperations_1.randomSelectFromRanges(sRanges);
        var l = rangeOperations_1.randomSelectFromRanges(lRanges);
        return Color_1.Color.fromHUSL(h, s, l);
    }
    function generateMainColor() {
        var randomValue = Math.random();
        if (randomValue < 0.6) {
            return makeRandomDeepColor();
        }
        else if (randomValue < 0.725) {
            return makeRandomVibrantColor();
        }
        else if (randomValue < 0.85) {
            return makeRandomLightVibrantColor();
        }
        else {
            return makeRandomPastelColor();
        }
    }
    exports.generateMainColor = generateMainColor;
    function makeContrastingColor(toContrastWith, colorGenProps) {
        var props = colorGenProps || {};
        var initialRanges = props.initialRanges || {};
        var hRange = initialRanges.h || { min: 0.0, max: 1.0 };
        var sRange = initialRanges.s || { min: 0.5, max: 1.0 };
        var lRange = initialRanges.l || { min: 0.0, max: 1.0 };
        var minDifference = props.minDifference || {};
        var hMinDifference = minDifference.h !== undefined ? minDifference.h : 0.1;
        var sMinDifference = minDifference.s !== undefined ? minDifference.s : 0.0;
        var lMinDifference = minDifference.l !== undefined ? minDifference.l : 0.3;
        var maxDifference = props.maxDifference || {};
        var hMaxDifference = maxDifference.h !== undefined ? maxDifference.h : 1.0;
        var toContrastWithHUSL = toContrastWith.getHUSL();
        var hExclusionRange = {
            min: (toContrastWithHUSL[0] - hMinDifference) % 1.0,
            max: (toContrastWithHUSL[0] + hMinDifference) % 1.0,
        };
        var hRangeWithMinExclusion = rangeOperations_1.excludeFromRange(hRange, hExclusionRange);
        var candidateHValue = rangeOperations_1.randomSelectFromRanges(hRangeWithMinExclusion);
        var h = utility_1.clamp(candidateHValue, toContrastWithHUSL[0] - hMaxDifference, toContrastWithHUSL[0] + hMaxDifference);
        var sExclusionRangeMin = utility_1.clamp(toContrastWithHUSL[1] - sMinDifference, sRange.min, 1.0);
        var sExclusionRange = {
            min: sExclusionRangeMin,
            max: utility_1.clamp(toContrastWithHUSL[1] + sMinDifference, sExclusionRangeMin, 1.0),
        };
        var lExclusionRangeMin = utility_1.clamp(toContrastWithHUSL[2] - lMinDifference, lRange.min, 1.0);
        var lExclusionRange = {
            min: lExclusionRangeMin,
            max: utility_1.clamp(toContrastWithHUSL[2] + lMinDifference, lExclusionRangeMin, 1.0),
        };
        return makeRandomColor({
            h: [{ min: h, max: h }],
            s: rangeOperations_1.excludeFromRange(sRange, sExclusionRange),
            l: rangeOperations_1.excludeFromRange(lRange, lExclusionRange),
        });
    }
    function generateSecondaryColor(mainColor) {
        return makeContrastingColor(mainColor, {
            minDifference: {
                h: 0.1,
                l: 0.3,
            },
        });
    }
    exports.generateSecondaryColor = generateSecondaryColor;
    function generateColorScheme(mainColor) {
        var main = mainColor || generateMainColor();
        return ({
            main: main,
            secondary: generateSecondaryColor(main),
        });
    }
    exports.generateColorScheme = generateColorScheme;
});
define("src/DamageType", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/debug", ["require", "exports", "src/Options"], function (require, exports, Options_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function shouldLog(category) {
        if (!Options_1.options || !Options_1.options.debug) {
            return true;
        }
        return Options_1.options.debug.logging[category];
    }
    exports.shouldLog = shouldLog;
    exports.log = createWrappedLogLikeFunction(console.log);
    exports.warn = createWrappedLogLikeFunction(console.warn);
    function table(category, header, rows) {
        if (shouldLog(category)) {
            exports.log(category, header);
        }
        console.table(rows);
    }
    exports.table = table;
    function createWrappedLogLikeFunction(toWrap) {
        return function (category, message) {
            var optionalParams = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                optionalParams[_i - 2] = arguments[_i];
            }
            if (shouldLog(category)) {
                toWrap.apply(void 0, ["[" + category.toUpperCase() + "]", Date.now(), message].concat(optionalParams));
            }
        };
    }
});
define("src/DiplomacyState", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DiplomacyState;
    (function (DiplomacyState) {
        DiplomacyState[DiplomacyState["Unmet"] = 0] = "Unmet";
        DiplomacyState[DiplomacyState["Peace"] = 1] = "Peace";
        DiplomacyState[DiplomacyState["ColdWar"] = 2] = "ColdWar";
        DiplomacyState[DiplomacyState["War"] = 3] = "War";
    })(DiplomacyState = exports.DiplomacyState || (exports.DiplomacyState = {}));
});
define("src/Direction", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/Emblem", ["require", "exports", "rng-js", "src/activeModuleData", "src/colorGeneration", "src/utility"], function (require, exports, RNG, activeModuleData_1, colorGeneration_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Emblem = (function () {
        function Emblem(colors, template) {
            this.colors = template.getColors ? template.getColors(null, colors) : colors;
            this.template = template;
        }
        Emblem.generateRandom = function (backgroundColor, colors, seed) {
            if (colors === void 0) { colors = []; }
            var _rng = new RNG(seed);
            var templates = Emblem.getAvailableTemplatesForRandomGeneration();
            var template = utility_1.getSeededRandomArrayItem(templates, _rng);
            var _colors;
            if (template.getColors) {
                _colors = template.getColors(backgroundColor, colors);
            }
            else {
                if (colors.length > 0) {
                    _colors = colors.slice(0);
                }
                else {
                    if (backgroundColor) {
                        _colors = [colorGeneration_1.generateSecondaryColor(backgroundColor)];
                    }
                    else {
                        _colors = [colorGeneration_1.generateMainColor()];
                    }
                }
            }
            return new Emblem(_colors, template);
        };
        Emblem.getAvailableTemplatesForRandomGeneration = function () {
            return Object.keys(activeModuleData_1.activeModuleData.templates.SubEmblems).map(function (key) {
                return activeModuleData_1.activeModuleData.templates.SubEmblems[key];
            }).filter(function (template) {
                return !template.disallowRandomGeneration;
            });
        };
        Emblem.prototype.draw = function () {
            var _this = this;
            var result = this.createElementClone();
            result.classList.add("emblem");
            result.setAttribute("preserveAspectRatio", "xMidYMid meet");
            this.template.colorMappings.forEach(function (colorMap, i) {
                var color = _this.colors[i];
                colorMap.selectors.forEach(function (selectorData) {
                    var selection = result.querySelectorAll(selectorData.selector);
                    for (var j = 0; j < selection.length; j++) {
                        var match = selection[j];
                        var colorString = color ? "#" + color.getHexString() : "none";
                        match.setAttribute(selectorData.attributeName, colorString);
                    }
                });
            });
            return result;
        };
        Emblem.prototype.serialize = function () {
            var data = {
                colors: this.colors.map(function (color) { return color.serialize(); }),
                templateKey: this.template.key,
            };
            return data;
        };
        Emblem.prototype.createElementClone = function () {
            return this.template.getSvgElementClone();
        };
        return Emblem;
    }());
    exports.Emblem = Emblem;
});
define("src/eventManager", ["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var eventEmitter = new PIXI.utils.EventEmitter();
    exports.eventManager = {
        dispatchEvent: eventEmitter.emit.bind(eventEmitter),
        removeEventListener: eventEmitter.removeListener.bind(eventEmitter),
        removeAllListeners: eventEmitter.removeAllListeners.bind(eventEmitter),
        addEventListener: function (eventType, listener) {
            eventEmitter.on(eventType, listener);
            return listener;
        },
    };
});
define("src/FillerPoint", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FillerPoint = (function () {
        function FillerPoint(x, y) {
            this.x = x;
            this.y = y;
        }
        FillerPoint.prototype.setPosition = function (x, y) {
            this.x = x;
            this.y = y;
        };
        FillerPoint.prototype.serialize = function () {
            return ({
                x: this.x,
                y: this.y,
            });
        };
        return FillerPoint;
    }());
    exports.FillerPoint = FillerPoint;
});
define("src/FixedRateTicker", ["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FixedRateTicker = (function () {
        function FixedRateTicker(onTick, tickRate) {
            this.accumulatedTime = 0;
            this.tickRate = tickRate;
            this.onTick = onTick;
            this.ticker = new PIXI.Ticker();
            this.ticker.add(this.onTickerUpdate, this);
        }
        FixedRateTicker.prototype.start = function () {
            this.accumulatedTime = 0;
            this.ticker.start();
        };
        FixedRateTicker.prototype.stop = function () {
            this.ticker.stop();
        };
        FixedRateTicker.prototype.onTickerUpdate = function () {
            this.accumulatedTime += this.ticker.elapsedMS;
            var ticksToPlay = Math.floor(this.accumulatedTime / this.tickRate);
            if (ticksToPlay) {
                this.accumulatedTime -= ticksToPlay * this.tickRate;
                this.onTick(ticksToPlay);
            }
        };
        return FixedRateTicker;
    }());
    exports.FixedRateTicker = FixedRateTicker;
});
define("src/Flag", ["require", "exports", "src/Emblem", "src/colorGeneration"], function (require, exports, Emblem_1, colorGeneration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Flag = (function () {
        function Flag(backgroundColor, emblems) {
            var _this = this;
            this.emblems = [];
            this.backgroundColor = backgroundColor;
            if (emblems) {
                emblems.forEach(function (emblem) { return _this.addEmblem(emblem); });
            }
        }
        Flag.generateRandom = function (backgroundColor, secondaryColor, seed) {
            if (backgroundColor === void 0) { backgroundColor = colorGeneration_1.generateMainColor(); }
            if (secondaryColor === void 0) { secondaryColor = colorGeneration_1.generateSecondaryColor(backgroundColor); }
            var flag = new Flag(backgroundColor);
            flag.addRandomEmblem(secondaryColor, seed);
            return flag;
        };
        Flag.prototype.draw = function () {
            var container = document.createElement("div");
            container.classList.add("flag");
            if (this.backgroundColor) {
                container.style.backgroundColor = "#" + this.backgroundColor.getHexString();
            }
            this.emblems.forEach(function (emblem) {
                container.appendChild(emblem.draw());
            });
            return container;
        };
        Flag.prototype.generateRandomEmblem = function (secondaryColor, seed) {
            return Emblem_1.Emblem.generateRandom(this.backgroundColor, [secondaryColor], seed);
        };
        Flag.prototype.addRandomEmblem = function (secondaryColor, seed) {
            this.addEmblem(this.generateRandomEmblem(secondaryColor, seed));
        };
        Flag.prototype.addEmblem = function (emblem) {
            this.emblems.push(emblem);
        };
        Flag.prototype.serialize = function () {
            var data = {
                mainColor: this.backgroundColor.serialize(),
                emblems: this.emblems.map(function (emblem) { return emblem.serialize(); }),
            };
            return data;
        };
        return Flag;
    }());
    exports.Flag = Flag;
});
define("src/FlatAndMultiplierAdjustment", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getBaseAdjustment() {
        return ({
            flat: 0,
            additiveMultiplier: 1,
            multiplicativeMultiplier: 1,
        });
    }
    exports.getBaseAdjustment = getBaseAdjustment;
    function applyFlatAndMultiplierAdjustments(baseValue) {
        var adjustments = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            adjustments[_i - 1] = arguments[_i];
        }
        var adjustment = squashFlatAndMultiplierAdjustments.apply(void 0, adjustments);
        return (baseValue + adjustment.flat) * adjustment.additiveMultiplier * adjustment.multiplicativeMultiplier;
    }
    exports.applyFlatAndMultiplierAdjustments = applyFlatAndMultiplierAdjustments;
    function squashFlatAndMultiplierAdjustments() {
        var allAdjustments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            allAdjustments[_i] = arguments[_i];
        }
        return allAdjustments.reduce(function (squashed, toSquash) {
            if (toSquash.flat) {
                squashed.flat += toSquash.flat;
            }
            if (toSquash.additiveMultiplier) {
                squashed.additiveMultiplier += toSquash.additiveMultiplier;
            }
            if (isFinite(toSquash.multiplicativeMultiplier)) {
                squashed.multiplicativeMultiplier *= toSquash.multiplicativeMultiplier;
            }
            return squashed;
        });
    }
    exports.squashFlatAndMultiplierAdjustments = squashFlatAndMultiplierAdjustments;
    function squashAdjustmentsObjects() {
        var adjustmentObjectsToSquash = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            adjustmentObjectsToSquash[_i] = arguments[_i];
        }
        return adjustmentObjectsToSquash.reduce(function (squashed, toSquash) {
            for (var key in toSquash) {
                var squashedAlreadyHasAdjustment = Boolean(squashed[key]);
                if (squashedAlreadyHasAdjustment) {
                    squashed[key] = squashFlatAndMultiplierAdjustments(squashed[key], toSquash[key]);
                }
                else {
                    squashed[key] = squashFlatAndMultiplierAdjustments(getBaseAdjustment(), toSquash[key]);
                }
            }
            return squashed;
        });
    }
    exports.squashAdjustmentsObjects = squashAdjustmentsObjects;
});
define("src/Fleet", ["require", "exports", "src/App", "src/Name", "src/eventManager", "src/idGenerators", "src/pathFinding"], function (require, exports, App_1, Name_1, eventManager_1, idGenerators_1, pathFinding_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Fleet = (function () {
        function Fleet(units, id) {
            var _this = this;
            this.units = [];
            this.visionIsDirty = true;
            this.visibleStars = [];
            this.detectedStars = [];
            this.id = isFinite(id) ? id : idGenerators_1.idGenerators.fleet++;
            this.name = new Name_1.Name("Fleet " + this.id);
            units.forEach(function (unitToAdd) {
                _this.addUnit(unitToAdd);
            });
            eventManager_1.eventManager.dispatchEvent("renderLayer", "fleets", this.location);
        }
        Fleet.createFleetsFromUnits = function (units) {
            var stealthyUnits = units.filter(function (unit) { return unit.isStealthy(); });
            var nonStealthyUnits = units.filter(function (unit) { return !unit.isStealthy(); });
            var fleets = [stealthyUnits, nonStealthyUnits].filter(function (unitsInGroup) {
                return unitsInGroup.length > 0;
            }).map(function (unitsInGroup) {
                return new Fleet(unitsInGroup);
            });
            return fleets;
        };
        Fleet.createFleet = function (units, id) {
            return new Fleet(units, id);
        };
        Fleet.sortByImportance = function (a, b) {
            var customNameSort = Number(b.name.hasBeenCustomized) - Number(a.name.hasBeenCustomized);
            if (customNameSort) {
                return customNameSort;
            }
            var unitCountSort = b.units.length - a.units.length;
            if (unitCountSort) {
                return unitCountSort;
            }
            return a.id - b.id;
        };
        Fleet.makeAlreadyInFleetError = function (unit) {
            return new Error("Unit " + unit.name + " is already part of fleet " + unit.fleet.name.toString());
        };
        Fleet.makeNotInFleetError = function (unit, fleet) {
            return new Error("Unit " + unit.name + " is not part of fleet " + fleet.name.toString());
        };
        Fleet.prototype.deleteFleet = function (shouldRender) {
            if (shouldRender === void 0) { shouldRender = true; }
            this.location.removeFleet(this);
            this.player.removeFleet(this);
            if (shouldRender) {
                eventManager_1.eventManager.dispatchEvent("renderLayer", "fleets", this.location);
            }
        };
        Fleet.prototype.mergeWith = function (fleetToMergeWith, shouldRender) {
            if (shouldRender === void 0) { shouldRender = true; }
            if (fleetToMergeWith.isStealthy !== this.isStealthy) {
                throw new Error("Tried to merge stealthy fleet with non stealthy or other way around");
            }
            for (var i = this.units.length - 1; i >= 0; i--) {
                var unit = this.units[i];
                this.transferUnit(fleetToMergeWith, unit, shouldRender);
            }
            this.deleteFleet(shouldRender);
        };
        Fleet.prototype.addUnit = function (unit) {
            if (unit.fleet) {
                throw Fleet.makeAlreadyInFleetError(unit);
            }
            if (this.units.length === 0) {
                this.isStealthy = unit.isStealthy();
            }
            else if (unit.isStealthy() !== this.isStealthy) {
                throw new Error("Tried to add stealthy unit to non stealthy fleet or other way around");
            }
            this.units.push(unit);
            unit.fleet = this;
            this.visionIsDirty = true;
        };
        Fleet.prototype.removeUnit = function (unit) {
            var index = this.units.indexOf(unit);
            if (index < 0) {
                throw Fleet.makeNotInFleetError(unit, this);
            }
            this.units.splice(index, 1);
            unit.fleet = null;
            this.visionIsDirty = true;
        };
        Fleet.prototype.transferUnit = function (receivingFleet, unitToTransfer, shouldRender) {
            if (shouldRender === void 0) { shouldRender = true; }
            if (receivingFleet === this) {
                throw new Error("Tried to transfer unit into unit's current fleet");
            }
            this.removeUnit(unitToTransfer);
            receivingFleet.addUnit(unitToTransfer);
            if (shouldRender) {
                eventManager_1.eventManager.dispatchEvent("renderLayer", "fleets", this.location);
            }
        };
        Fleet.prototype.split = function () {
            var newFleet = new Fleet([]);
            this.player.addFleet(newFleet);
            this.location.addFleet(newFleet);
            return newFleet;
        };
        Fleet.prototype.getMinCurrentMovePoints = function () {
            return this.units.map(function (unit) {
                return unit.currentMovePoints;
            }).reduce(function (minMovePoints, currentUnitMovePoints) {
                return Math.min(minMovePoints, currentUnitMovePoints);
            }, Infinity);
        };
        Fleet.prototype.getMinMaxMovePoints = function () {
            return this.units.map(function (unit) {
                return unit.maxMovePoints;
            }).reduce(function (minMovePoints, currentUnitMovePoints) {
                return Math.min(minMovePoints, currentUnitMovePoints);
            }, Infinity);
        };
        Fleet.prototype.hasEnoughMovePointsToMoveTo = function (target) {
            return this.getMinCurrentMovePoints() >= this.location.getDistanceToStar(target);
        };
        Fleet.prototype.getPathTo = function (newLocation) {
            var a = pathFinding_1.aStar(this.location, newLocation);
            if (!a) {
                throw new Error("Couldn't find path between " + this.location.name + " and " + newLocation.name);
            }
            var path = pathFinding_1.backTrace(a.came, newLocation);
            return path;
        };
        Fleet.prototype.pathFind = function (newLocation, onMove, afterMove) {
            var _this = this;
            var path = this.getPathTo(newLocation);
            var interval = window.setInterval(function () {
                if (!path || path.length <= 0) {
                    window.clearInterval(interval);
                    if (afterMove) {
                        afterMove();
                    }
                    return;
                }
                var move = path.shift();
                _this.move(move.star);
                if (onMove) {
                    onMove();
                }
            }, 10);
        };
        Fleet.prototype.getTotalCurrentHealth = function () {
            return this.units.map(function (unit) {
                return unit.currentHealth;
            }).reduce(function (total, current) {
                return total + current;
            }, 0);
        };
        Fleet.prototype.getTotalMaxHealth = function () {
            return this.units.map(function (unit) {
                return unit.maxHealth;
            }).reduce(function (total, current) {
                return total + current;
            }, 0);
        };
        Fleet.prototype.getVisibleStars = function () {
            if (this.visionIsDirty) {
                this.updateVisibleStars();
            }
            return this.visibleStars;
        };
        Fleet.prototype.getDetectedStars = function () {
            if (this.visionIsDirty) {
                this.updateVisibleStars();
            }
            return this.detectedStars;
        };
        Fleet.prototype.serialize = function () {
            var data = {
                id: this.id,
                name: this.name.serialize(),
                locationId: this.location.id,
                playerId: this.player.id,
                unitIds: this.units.map(function (unit) { return unit.id; }),
            };
            return data;
        };
        Fleet.prototype.canMove = function () {
            return this.units.every(function (unit) { return unit.currentMovePoints > 0; });
        };
        Fleet.prototype.move = function (newLocation) {
            var _this = this;
            if (newLocation === this.location) {
                return;
            }
            if (!this.canMove()) {
                return;
            }
            var oldLocation = this.location;
            oldLocation.removeFleet(this);
            this.location = newLocation;
            newLocation.addFleet(this);
            this.units.forEach(function (unit) { return unit.currentMovePoints -= 1; });
            this.visionIsDirty = true;
            this.player.visionIsDirty = true;
            App_1.app.game.getLiveMajorPlayers().forEach(function (player) {
                if (player !== _this.player) {
                    player.updateAllVisibilityInStar(oldLocation);
                    player.updateAllVisibilityInStar(newLocation);
                }
            });
            eventManager_1.eventManager.dispatchEvent("renderLayer", "fleets", this.location);
            eventManager_1.eventManager.dispatchEvent("updateSelection", null);
        };
        Fleet.prototype.updateVisibleStars = function () {
            var highestVisionRange = 0;
            var highestDetectionRange = -1;
            for (var i = 0; i < this.units.length; i++) {
                highestVisionRange = Math.max(this.units[i].getVisionRange(), highestVisionRange);
                highestDetectionRange = Math.max(this.units[i].getDetectionRange(), highestDetectionRange);
            }
            var inVision = this.location.getLinkedInRange(highestVisionRange);
            var inDetection = this.location.getLinkedInRange(highestDetectionRange);
            this.visibleStars = inVision.all;
            this.detectedStars = inDetection.all;
            this.visionIsDirty = false;
        };
        return Fleet;
    }());
    exports.Fleet = Fleet;
});
define("src/GalaxyMap", ["require", "exports", "src/BuildingCollection"], function (require, exports, BuildingCollection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GalaxyMap = (function () {
        function GalaxyMap(mapGen) {
            var _this = this;
            this.width = mapGen.width;
            this.height = mapGen.height;
            this.seed = mapGen.seed;
            this.stars = mapGen.stars;
            this.fillerPoints = mapGen.fillerPoints;
            this.independents = mapGen.independents;
            this.voronoi = mapGen.voronoiInfo;
            this.globallyLimitedBuildings = new BuildingCollection_1.BuildingCollection();
            this.stars.forEach(function (star) { return star.galaxyMap = _this; });
        }
        GalaxyMap.prototype.getIncomeBounds = function () {
            var min;
            var max;
            for (var i = 0; i < this.stars.length; i++) {
                var star = this.stars[i];
                var income = star.getIncome();
                if (!min) {
                    min = max = income;
                }
                else {
                    if (income < min) {
                        min = income;
                    }
                    else if (income > max) {
                        max = income;
                    }
                }
            }
            return ({
                min: min,
                max: max,
            });
        };
        GalaxyMap.prototype.serialize = function () {
            var data = {
                stars: this.stars.map(function (star) { return star.serialize(); }),
                fillerPoints: this.fillerPoints.map(function (fillerPoint) { return fillerPoint.serialize(); }),
                width: this.width,
                height: this.height,
                seed: this.seed,
            };
            return data;
        };
        return GalaxyMap;
    }());
    exports.GalaxyMap = GalaxyMap;
});
define("src/Game", ["require", "exports", "localforage", "src/App", "src/PlayerDiplomacy", "src/activePlayer", "src/eventManager", "src/idGenerators", "src/notifications/activeNotificationStore", "src/activeModuleData", "src/storageStrings"], function (require, exports, localForage, App_1, PlayerDiplomacy_1, activePlayer_1, eventManager_1, idGenerators_1, activeNotificationStore_1, activeModuleData_1, storageStrings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = (function () {
        function Game(map, players) {
            var _a;
            var _this = this;
            this.players = [];
            this.hasEnded = false;
            this.actingPlayerIndex = 0;
            this.galaxyMap = map;
            this.players = players.slice();
            this.playerToAct = players[0];
            if (map.independents) {
                (_a = this.players).push.apply(_a, map.independents);
                map.independents = null;
                delete map.independents;
            }
            this.players.filter(function (player) {
                return !player.isIndependent && !player.isDead;
            }).forEach(function (player) {
                player.diplomacy = new PlayerDiplomacy_1.PlayerDiplomacy(player, _this);
            });
            this.turnNumber = 1;
        }
        Game.prototype.destroy = function () {
            this.players.forEach(function (player) {
                player.destroy();
            });
        };
        Game.prototype.endTurn = function () {
            var _this = this;
            if (!this.playerToAct.isAi) {
                activeModuleData_1.activeModuleData.scripts.game.beforePlayerTurnEnd.forEach(function (script) {
                    script(_this);
                });
            }
            this.processPlayerEndTurn(this.playerToAct);
            this.setNextPlayer();
            while (this.playerToAct.isDead) {
                if (this.playerToAct === activePlayer_1.activePlayer) {
                    this.endGame();
                    return;
                }
                this.setNextPlayer();
            }
            this.processPlayerStartTurn(this.playerToAct);
            if (this.playerToAct.isIndependent) {
                this.endTurn();
                return;
            }
            eventManager_1.eventManager.dispatchEvent("endTurn", null);
            eventManager_1.eventManager.dispatchEvent("updateSelection", null);
            if (this.playerToAct.isAi) {
                this.playerToAct.aiController.processTurn(this.endTurn.bind(this));
            }
        };
        Game.prototype.getSaveData = function (name) {
            var gameData = this.serialize();
            var fullSaveData = {
                name: name,
                date: new Date().toISOString(),
                appVersion: App_1.app.version,
                gameData: gameData,
                idGenerators: idGenerators_1.idGenerators.serialize(),
                cameraLocation: App_1.app.renderer && App_1.app.renderer.camera ?
                    App_1.app.renderer.camera.getCenterPosition() :
                    undefined,
                moduleData: activeModuleData_1.activeModuleData.serialize(),
            };
            return JSON.stringify(fullSaveData);
        };
        Game.prototype.save = function (name, wasManuallyTriggered) {
            if (wasManuallyTriggered === void 0) { wasManuallyTriggered = true; }
            var saveData = this.getSaveData(name);
            var saveString = storageStrings_1.storageStrings.savePrefix + name;
            if (wasManuallyTriggered) {
                this.gameStorageKey = saveString;
            }
            return localForage.setItem(saveString, saveData);
        };
        Game.prototype.getLiveMajorPlayers = function () {
            return this.players.filter(function (player) {
                return !player.isDead && !player.isIndependent;
            });
        };
        Game.prototype.processPlayerStartTurn = function (player) {
            player.units.forEach(function (unit) {
                unit.addHealth(unit.getHealingForGameTurnStart());
                var passiveSkillsByPhase = unit.getPassiveSkillsByPhase();
                if (passiveSkillsByPhase.atTurnStart) {
                    for (var i = 0; i < passiveSkillsByPhase.atTurnStart.length; i++) {
                        var skill = passiveSkillsByPhase.atTurnStart[i];
                        for (var j = 0; j < skill.atTurnStart.length; j++) {
                            skill.atTurnStart[j](unit);
                        }
                    }
                }
                unit.resetMovePoints();
                unit.offensiveBattlesFoughtThisTurn = 0;
            });
            if (!player.isIndependent) {
                player.money += player.getIncome();
                var allResourceIncomeData = player.getResourceIncome();
                for (var resourceType in allResourceIncomeData) {
                    var resourceData = allResourceIncomeData[resourceType];
                    player.addResource(resourceData.resource, resourceData.amount);
                }
                player.playerTechnology.allocateResearchPoints(player.getResearchSpeed());
            }
        };
        Game.prototype.processPlayerEndTurn = function (player) {
            if (!player.isIndependent) {
                player.getAllManufactories().forEach(function (manufactory) {
                    manufactory.buildAllThings();
                });
            }
        };
        Game.prototype.processNewRoundOfPlayStart = function () {
            this.turnNumber++;
            activeNotificationStore_1.activeNotificationStore.currentTurn = this.turnNumber;
        };
        Game.prototype.setNextPlayer = function () {
            this.actingPlayerIndex = (this.actingPlayerIndex + 1) % this.players.length;
            this.playerToAct = this.players[this.actingPlayerIndex];
            if (this.actingPlayerIndex === 0) {
                this.processNewRoundOfPlayStart();
            }
        };
        Game.prototype.serialize = function () {
            var data = {
                turnNumber: this.turnNumber,
                galaxyMap: this.galaxyMap.serialize(),
                players: this.players.map(function (player) {
                    return player.serialize();
                }),
                notificationStore: activeNotificationStore_1.activeNotificationStore.serialize(),
                units: this.players.map(function (player) {
                    return player.units.map(function (unit) {
                        return unit.serialize();
                    });
                }).reduce(function (allUnits, playerUnits) {
                    return allUnits.concat(playerUnits);
                }, []),
                items: this.players.map(function (player) {
                    return player.items.map(function (item) { return item.serialize(); });
                }).reduce(function (allItems, playerItems) {
                    return allItems.concat(playerItems);
                }, []),
            };
            return data;
        };
        Game.prototype.endGame = function () {
            this.hasEnded = true;
        };
        return Game;
    }());
    exports.Game = Game;
});
define("src/GameLoader", ["require", "exports", "src/AiController", "src/AttitudeModifier", "src/Building", "src/Color", "src/Emblem", "src/FillerPoint", "src/Flag", "src/Fleet", "src/Game", "src/Item", "src/Manufactory", "src/MapGenResult", "src/Name", "src/Player", "src/Star", "src/StatusEffect", "src/Unit", "src/activeModuleData", "src/notifications/activeNotificationStore", "src/notifications/Notification", "src/notifications/NotificationStore", "src/notifications/PlayerNotificationSubscriber"], function (require, exports, AiController_1, AttitudeModifier_1, Building_1, Color_1, Emblem_1, FillerPoint_1, Flag_1, Fleet_1, Game_1, Item_1, Manufactory_1, MapGenResult_1, Name_1, Player_1, Star_1, StatusEffect_1, Unit_1, activeModuleData_1, activeNotificationStore_1, Notification_1, NotificationStore_1, PlayerNotificationSubscriber_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameLoader = (function () {
        function GameLoader() {
            this.players = [];
            this.playersById = {};
            this.starsById = {};
            this.unitsById = {};
            this.buildingsByControllerId = {};
            this.itemsById = {};
        }
        GameLoader.prototype.deserializeGame = function (data) {
            var _this = this;
            this.map = this.deserializeMap(data.galaxyMap);
            data.items.forEach(function (itemSaveData) {
                _this.itemsById[itemSaveData.id] = _this.deserializeItem(itemSaveData);
            });
            data.units.forEach(function (unitSaveData) {
                _this.unitsById[unitSaveData.id] = _this.deserializeUnit(unitSaveData);
            });
            data.units.forEach(function (unitSaveData) {
                var unit = _this.unitsById[unitSaveData.id];
                unitSaveData.battleStats.statusEffects.forEach(function (statusEffectSaveData) {
                    unit.addStatusEffect(_this.deserializeStatusEffect(statusEffectSaveData));
                });
            });
            for (var i = 0; i < data.players.length; i++) {
                var playerData = data.players[i];
                var id = playerData.id;
                var player = this.playersById[id] = this.deserializePlayer(playerData);
                this.players.push(player);
            }
            this.deserializeBuildings(data.galaxyMap);
            var game = new Game_1.Game(this.map, this.players);
            game.turnNumber = data.turnNumber;
            data.players.forEach(function (playerData) {
                var player = _this.playersById[playerData.id];
                if (player.diplomacy && playerData.diplomacyData) {
                    _this.deserializePlayerDiplomacy(player, playerData.diplomacyData);
                }
            });
            var notificationStore = this.deserializeNotificationStore(data.notificationStore);
            activeNotificationStore_1.setActiveNotificationStore(notificationStore);
            data.players.filter(function (playerData) { return playerData.notificationLog; }).forEach(function (playerData) {
                var player = _this.playersById[playerData.id];
                var subscriber = new PlayerNotificationSubscriber_1.PlayerNotificationSubscriber(player);
                player.notificationLog = _this.deserializeNotificationSubscriber(playerData.notificationLog, subscriber, notificationStore);
            });
            data.players.forEach(function (playerData) {
                var player = _this.playersById[playerData.id];
                if (playerData.AiController) {
                    player.aiController = _this.deserializeAiController(playerData.AiController, player, game);
                }
            });
            return game;
        };
        GameLoader.prototype.deserializeNotificationStore = function (data) {
            var _this = this;
            var notificationStore = new NotificationStore_1.NotificationStore();
            data.notifications.forEach(function (notificationData) {
                var template = activeModuleData_1.activeModuleData.templates.Notifications[notificationData.templateKey];
                var notification = new Notification_1.Notification({
                    id: notificationData.id,
                    template: activeModuleData_1.activeModuleData.templates.Notifications[notificationData.templateKey],
                    props: template.deserializeProps(notificationData.props, _this),
                    turn: notificationData.turn,
                    involvedPlayers: notificationData.involvedPlayerIds.map(function (id) { return _this.playersById[id]; }),
                    location: isFinite(notificationData.locationId) ? _this.starsById[notificationData.locationId] : undefined,
                });
                notificationStore.notificationsById[notification.id] = notification;
            });
            return notificationStore;
        };
        GameLoader.prototype.deserializeNotificationSubscriber = function (data, liveSubscriber, liveStore) {
            data.allReceivedNotificationIds.forEach(function (id) {
                var notification = liveStore.notificationsById[id];
                liveSubscriber.allReceivedNotifications.push(notification);
            });
            data.unreadNotificationIds.forEach(function (id) {
                var notification = liveStore.notificationsById[id];
                liveSubscriber.unreadNotifications.push(notification);
            });
            return liveSubscriber;
        };
        GameLoader.prototype.deserializeMap = function (data) {
            var stars = [];
            for (var i = 0; i < data.stars.length; i++) {
                var star = this.deserializeStar(data.stars[i]);
                stars.push(star);
                this.starsById[star.id] = star;
            }
            for (var i = 0; i < data.stars.length; i++) {
                var dataStar = data.stars[i];
                var realStar = this.starsById[dataStar.id];
                for (var j = 0; j < dataStar.linksToIds.length; j++) {
                    var linkId = dataStar.linksToIds[j];
                    var linkStar = this.starsById[linkId];
                    realStar.addLink(linkStar);
                }
            }
            var fillerPoints = [];
            for (var i = 0; i < data.fillerPoints.length; i++) {
                var dataPoint = data.fillerPoints[i];
                fillerPoints.push(new FillerPoint_1.FillerPoint(dataPoint.x, dataPoint.y));
            }
            var mapGenResult = new MapGenResult_1.MapGenResult({
                stars: stars,
                fillerPoints: fillerPoints,
                width: data.width,
                height: data.height,
                seed: data.seed,
                independents: null,
            });
            var galaxyMap = mapGenResult.makeMap();
            return galaxyMap;
        };
        GameLoader.prototype.deserializeStar = function (data) {
            var star = new Star_1.Star({
                x: data.x,
                y: data.y,
                id: data.id,
                seed: data.seed,
                name: data.name,
                race: activeModuleData_1.activeModuleData.templates.Races[data.raceType],
                terrain: activeModuleData_1.activeModuleData.templates.Terrains[data.terrainType],
            });
            star.baseIncome = data.baseIncome;
            if (data.resourceType) {
                star.resource = activeModuleData_1.activeModuleData.templates.Resources[data.resourceType];
            }
            return star;
        };
        GameLoader.prototype.deserializeBuildings = function (data) {
            var _this = this;
            var _loop_1 = function (i) {
                var starData = data.stars[i];
                var star = this_1.starsById[starData.id];
                starData.buildings.forEach(function (buildingData) {
                    var building = _this.deserializeBuilding(buildingData);
                    star.buildings.add(building);
                });
                if (starData.manufactory) {
                    star.manufactory = new Manufactory_1.Manufactory(star, starData.manufactory);
                }
            };
            var this_1 = this;
            for (var i = 0; i < data.stars.length; i++) {
                _loop_1(i);
            }
        };
        GameLoader.prototype.deserializeBuilding = function (data) {
            var template = activeModuleData_1.activeModuleData.templates.Buildings[data.templateType];
            var building = new Building_1.Building({
                template: template,
                location: this.starsById[data.locationId],
                controller: this.playersById[data.controllerId],
                totalCost: data.totalCost,
                id: data.id,
            });
            return building;
        };
        GameLoader.prototype.deserializePlayer = function (data) {
            var _this = this;
            var player = new Player_1.Player({
                isAi: data.isAi,
                isIndependent: data.isIndependent,
                isDead: data.isDead,
                race: activeModuleData_1.activeModuleData.templates.Races[data.raceKey],
                money: data.money,
                id: data.id,
                name: Name_1.Name.fromData(data.name),
                color: {
                    main: Color_1.Color.deserialize(data.color),
                    secondary: Color_1.Color.deserialize(data.secondaryColor),
                    alpha: data.colorAlpha,
                },
                flag: this.deserializeFlag(data.flag),
                resources: data.resources,
            });
            data.unitIds.forEach(function (unitId) {
                player.addUnit(_this.unitsById[unitId]);
            });
            for (var i = 0; i < data.fleets.length; i++) {
                var fleet = data.fleets[i];
                player.addFleet(this.deserializeFleet(player, fleet));
            }
            for (var i = 0; i < data.controlledLocationIds.length; i++) {
                player.addStar(this.starsById[data.controlledLocationIds[i]]);
            }
            data.itemIds.forEach(function (itemId) {
                player.addItem(_this.itemsById[itemId]);
            });
            for (var i = 0; i < data.revealedStarIds.length; i++) {
                var id = data.revealedStarIds[i];
                player.revealedStars[id] = this.starsById[id];
            }
            data.identifiedUnitIds.forEach(function (unitId) {
                if (_this.unitsById[unitId]) {
                    player.identifyUnit(_this.unitsById[unitId]);
                }
            });
            return player;
        };
        GameLoader.prototype.deserializePlayerDiplomacy = function (player, data) {
            var _this = this;
            for (var playerId in data.statusByPlayer) {
                player.diplomacy.setStatusWithPlayer(this.playersById[playerId], data.statusByPlayer[playerId]);
            }
            var _loop_2 = function (playerId) {
                var modifiers = data.attitudeModifiersByPlayer[playerId];
                modifiers.forEach(function (modifierData) {
                    var template = activeModuleData_1.activeModuleData.templates.AttitudeModifiers[modifierData.templateType];
                    var modifier = new AttitudeModifier_1.AttitudeModifier({
                        template: template,
                        startTurn: modifierData.startTurn,
                        endTurn: modifierData.endTurn === null ?
                            Infinity :
                            modifierData.endTurn,
                        strength: modifierData.strength,
                        hasFixedStrength: modifierData.hasFixedStrength,
                    });
                    player.diplomacy.addAttitudeModifier(_this.playersById[playerId], modifier);
                });
            };
            for (var playerId in data.attitudeModifiersByPlayer) {
                _loop_2(playerId);
            }
        };
        GameLoader.prototype.deserializeEmblem = function (emblemData) {
            return new Emblem_1.Emblem(emblemData.colors.map(function (colorData) { return Color_1.Color.deserialize(colorData); }), activeModuleData_1.activeModuleData.templates.SubEmblems[emblemData.templateKey]);
        };
        GameLoader.prototype.deserializeFlag = function (data) {
            var _this = this;
            var emblems = data.emblems.map(function (emblemSaveData) {
                return _this.deserializeEmblem(emblemSaveData);
            });
            var flag = new Flag_1.Flag(Color_1.Color.deserialize(data.mainColor), emblems);
            return flag;
        };
        GameLoader.prototype.deserializeFleet = function (player, data) {
            var _this = this;
            var units = data.unitIds.map(function (unitId) { return _this.unitsById[unitId]; });
            var location = this.starsById[data.locationId];
            var fleet = Fleet_1.Fleet.createFleet(units, data.id);
            player.addFleet(fleet);
            location.addFleet(fleet);
            fleet.name = Name_1.Name.fromData(data.name);
            return fleet;
        };
        GameLoader.prototype.deserializeUnit = function (data) {
            var _this = this;
            var unit = Unit_1.Unit.fromSaveData(data);
            data.items.itemIds.forEach(function (itemId) {
                var item = _this.itemsById[itemId];
                unit.items.addItemAtPosition(item, item.positionInUnit);
            });
            return unit;
        };
        GameLoader.prototype.deserializeItem = function (data) {
            var template = activeModuleData_1.activeModuleData.templates.Items[data.templateType];
            var item = new Item_1.Item(template, data.id);
            item.positionInUnit = data.positionInUnit;
            return item;
        };
        GameLoader.prototype.deserializeAiController = function (data, player, game) {
            var templateConstructor = activeModuleData_1.activeModuleData.templates.AiTemplateConstructors[data.templateType];
            var template = templateConstructor.construct({
                game: game,
                player: player,
                saveData: data.templateData,
                personality: data.personality,
            });
            var controller = new AiController_1.AiController(template);
            return controller;
        };
        GameLoader.prototype.deserializeStatusEffect = function (data) {
            return new StatusEffect_1.StatusEffect({
                id: data.id,
                template: activeModuleData_1.activeModuleData.templates.UnitEffects[data.templateType],
                turnsToStayActiveFor: data.turnsToStayActiveFor,
                turnsHasBeenActiveFor: data.turnsHasBeenActiveFor,
                sourceUnit: this.unitsById[data.sourceUnitId],
            });
        };
        return GameLoader;
    }());
    exports.GameLoader = GameLoader;
});
define("src/GameModule", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/GameModuleInitializationPhase", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameModuleInitializationPhase;
    (function (GameModuleInitializationPhase) {
        GameModuleInitializationPhase[GameModuleInitializationPhase["AppInit"] = 0] = "AppInit";
        GameModuleInitializationPhase[GameModuleInitializationPhase["GameSetup"] = 1] = "GameSetup";
        GameModuleInitializationPhase[GameModuleInitializationPhase["MapGen"] = 2] = "MapGen";
        GameModuleInitializationPhase[GameModuleInitializationPhase["GameStart"] = 3] = "GameStart";
        GameModuleInitializationPhase[GameModuleInitializationPhase["BattlePrep"] = 4] = "BattlePrep";
        GameModuleInitializationPhase[GameModuleInitializationPhase["BattleStart"] = 5] = "BattleStart";
    })(GameModuleInitializationPhase = exports.GameModuleInitializationPhase || (exports.GameModuleInitializationPhase = {}));
    exports.allGameModuleInitializationPhases = Object.keys(GameModuleInitializationPhase).filter(function (key) { return !isNaN(Number(key)); }).map(function (key) { return Number(key); });
});
define("src/getNullFormation", ["require", "exports", "src/activeModuleData"], function (require, exports, activeModuleData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getNullFormation() {
        var nullFormation = [];
        var rows = activeModuleData_1.activeModuleData.ruleSet.battle.rowsPerFormation;
        var columns = activeModuleData_1.activeModuleData.ruleSet.battle.cellsPerRow;
        for (var i = 0; i < rows; i++) {
            nullFormation.push([]);
            for (var j = 0; j < columns; j++) {
                nullFormation[i].push(null);
            }
        }
        return nullFormation;
    }
    exports.getNullFormation = getNullFormation;
});
define("src/GuardCoverage", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/handleError", ["require", "exports", "src/App", "src/Options"], function (require, exports, App_1, Options_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var hasAlertedOfError = false;
    exports.errorReportingModes = [
        "ignore",
        "alertOnce",
        "panic",
    ];
    exports.handleError = function (message, source, lineno, colno, error) {
        var handler = getErrorHandler();
        var returnValue = handler(message, source, lineno, colno, error);
        return returnValue;
    };
    function getErrorHandler() {
        switch (Options_1.options.system.errorReporting) {
            case "ignore":
                {
                    return ignoreError;
                }
            case "alertOnce":
                {
                    if (hasAlertedOfError) {
                        return ignoreError;
                    }
                    else {
                        return createErrorAlert;
                    }
                }
            case "panic":
                {
                    return panicOnError;
                }
            default:
                {
                    return panicOnError;
                }
        }
    }
    var createErrorAlert = function (message, source, lineno, colno, error) {
        hasAlertedOfError = true;
    };
    var ignoreError = function () {
        return true;
    };
    var panicOnError = function (message, source, lineno, colno, error) {
        App_1.app.reactUI.error = error;
        App_1.app.reactUI.switchScene("errorRecovery");
    };
});
define("src/IdDictionary", ["require", "exports", "src/utility"], function (require, exports, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IdDictionary = (function () {
        function IdDictionary(keys, getValueFN) {
            var _this = this;
            this.valuesById = {};
            this.keysById = {};
            if (keys && getValueFN) {
                keys.forEach(function (key) {
                    _this.set(key, getValueFN(key));
                });
            }
        }
        Object.defineProperty(IdDictionary.prototype, "length", {
            get: function () {
                return Object.keys(this.keysById).length;
            },
            enumerable: true,
            configurable: true
        });
        IdDictionary.prototype.destroy = function () {
            var _this = this;
            this.forEach(function (k, v) {
                _this.delete(k);
            });
        };
        IdDictionary.prototype.has = function (key) {
            return Boolean(this.valuesById[key.id]);
        };
        IdDictionary.prototype.get = function (key) {
            return this.valuesById[key.id];
        };
        IdDictionary.prototype.getById = function (id) {
            return this.valuesById[id];
        };
        IdDictionary.prototype.set = function (key, value) {
            this.valuesById[key.id] = value;
            this.keysById[key.id] = key;
        };
        IdDictionary.prototype.setIfDoesntExist = function (key, value) {
            if (!this.keysById[key.id]) {
                this.set(key, value);
            }
        };
        IdDictionary.prototype.delete = function (key) {
            delete this.valuesById[key.id];
            delete this.keysById[key.id];
        };
        IdDictionary.prototype.forEach = function (callback) {
            for (var id in this.keysById) {
                callback(this.keysById[id], this.valuesById[id]);
            }
        };
        IdDictionary.prototype.filter = function (filterFN) {
            var filtered = new this.constructor();
            this.forEach(function (key, value) {
                if (filterFN(key, value)) {
                    filtered.set(key, value);
                }
            });
            return filtered;
        };
        IdDictionary.prototype.zip = function (keyName, valueName) {
            var _a;
            var zipped = [];
            for (var id in this.keysById) {
                var zippedPair = (_a = {},
                    _a[keyName] = this.keysById[id],
                    _a[valueName] = this.valuesById[id],
                    _a);
                zipped.push(zippedPair);
            }
            return zipped;
        };
        IdDictionary.prototype.toObject = function () {
            return utility_1.shallowCopy(this.valuesById);
        };
        IdDictionary.prototype.sort = function (sortingFN) {
            var _this = this;
            var keys = [];
            for (var id in this.keysById) {
                keys.push(this.keysById[id]);
            }
            keys.sort(function (a, b) {
                var sortingValue = sortingFN(_this.valuesById[a.id], _this.valuesById[b.id]);
                if (sortingValue) {
                    return sortingValue;
                }
                else {
                    return a.id - b.id;
                }
            });
            var values = keys.map(function (key) { return _this.valuesById[key.id]; });
            return values;
        };
        IdDictionary.prototype.mapToArray = function (mapFN) {
            var mapped = [];
            this.forEach(function (k, v) {
                mapped.push(mapFN(k, v));
            });
            return mapped;
        };
        IdDictionary.prototype.merge = function (mergeFN) {
            var toMerge = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                toMerge[_i - 1] = arguments[_i];
            }
            var merged = this.constructor();
            toMerge.forEach(function (dictToMerge) {
                dictToMerge.filter(function (k, v) {
                    return !merged.has(k);
                }).forEach(function (key) {
                    var allValues = toMerge.filter(function (dictToCheck) {
                        return dictToCheck.has(key);
                    }).map(function (dictWithKey) {
                        return dictWithKey.get(key);
                    });
                    merged.set(key, mergeFN.apply(void 0, allValues));
                });
            });
            return merged;
        };
        IdDictionary.prototype.find = function (filterFN) {
            for (var id in this.keysById) {
                if (filterFN(this.keysById[id], this.valuesById[id])) {
                    return this.keysById[id];
                }
            }
            return null;
        };
        IdDictionary.prototype.some = function (filterFN) {
            return Boolean(this.find(filterFN));
        };
        return IdDictionary;
    }());
    exports.IdDictionary = IdDictionary;
});
define("src/idGenerators", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IdGenerator = (function () {
        function IdGenerator() {
            this.fleet = 0;
            this.item = 0;
            this.player = 0;
            this.star = 0;
            this.unit = 0;
            this.building = 0;
            this.objective = 0;
            this.statusEffect = 0;
            this.notification = 0;
        }
        IdGenerator.prototype.setValues = function (newValues) {
            for (var key in newValues) {
                this[key] = newValues[key];
            }
        };
        IdGenerator.prototype.serialize = function () {
            return ({
                fleet: this.fleet,
                item: this.item,
                player: this.player,
                star: this.star,
                unit: this.unit,
                building: this.building,
                objective: this.objective,
                statusEffect: this.statusEffect,
                notification: this.notification,
            });
        };
        return IdGenerator;
    }());
    exports.idGenerators = new IdGenerator();
});
define("src/ImageCache", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ImageCache = (function () {
        function ImageCache() {
            this.images = {};
        }
        ImageCache.prototype.addImage = function (key, image) {
            this.images[key] = image;
        };
        ImageCache.prototype.addSpriteSheet = function (sheetData, sheetImg) {
            for (var spriteName in sheetData.frames) {
                var frame = sheetData.frames[spriteName].frame;
                var image = ImageCache.spriteSheetFrameToImage(sheetImg, frame);
                this.addImage(spriteName, image);
            }
        };
        ImageCache.spriteSheetFrameToImage = function (sheetImg, frame) {
            var canvas = document.createElement("canvas");
            canvas.width = frame.w;
            canvas.height = frame.h;
            var context = canvas.getContext("2d");
            if (!context) {
                throw new Error("Couldn't get canvas context");
            }
            context.drawImage(sheetImg, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);
            var image = new Image();
            image.src = canvas.toDataURL();
            return image;
        };
        return ImageCache;
    }());
    exports.ImageCache = ImageCache;
});
define("src/Item", ["require", "exports", "src/idGenerators"], function (require, exports, idGenerators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Item = (function () {
        function Item(template, id) {
            this.id = id !== undefined ? id : idGenerators_1.idGenerators.item++;
            this.template = template;
        }
        Item.prototype.serialize = function () {
            var data = {
                id: this.id,
                templateType: this.template.type,
            };
            if (isFinite(this.positionInUnit)) {
                data.positionInUnit = this.positionInUnit;
            }
            return data;
        };
        return Item;
    }());
    exports.Item = Item;
});
define("src/kinematics", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function solveAcceleration(p) {
        return (p.displacement - p.initialVelocity * p.duration) / (0.5 * Math.pow(p.duration, 2));
    }
    exports.solveAcceleration = solveAcceleration;
});
define("src/localization/formatters", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatters = {
        capitalize: function (s) { return s.charAt(0).toUpperCase() + s.slice(1); },
        signedNumber: function (n) { return "" + (n > 0 ? "+" : "") + n; },
    };
});
define("src/localization/Language", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/localization/languageSupport", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LanguageSupportLevel;
    (function (LanguageSupportLevel) {
        LanguageSupportLevel[LanguageSupportLevel["None"] = 0] = "None";
        LanguageSupportLevel[LanguageSupportLevel["Partial"] = 1] = "Partial";
        LanguageSupportLevel[LanguageSupportLevel["Full"] = 2] = "Full";
    })(LanguageSupportLevel = exports.LanguageSupportLevel || (exports.LanguageSupportLevel = {}));
    function getLanguageSupportLevelForGameModules() {
        var gameModules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            gameModules[_i] = arguments[_i];
        }
        var totalModulesCount = gameModules.length;
        var languageSupportLevelByCode = {};
        var modulesGroupedByLanguageSupport = groupGameModulesByLanguageSupport.apply(void 0, gameModules);
        for (var languageCode in modulesGroupedByLanguageSupport) {
            var supportedModulesCount = modulesGroupedByLanguageSupport[languageCode].length;
            if (supportedModulesCount < totalModulesCount) {
                languageSupportLevelByCode[languageCode] = LanguageSupportLevel.Partial;
            }
            else {
                languageSupportLevelByCode[languageCode] = LanguageSupportLevel.Full;
            }
        }
        return languageSupportLevelByCode;
    }
    exports.getLanguageSupportLevelForGameModules = getLanguageSupportLevelForGameModules;
    function getLanguagesByCodeFromGameModules() {
        var gameModules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            gameModules[_i] = arguments[_i];
        }
        var languagesByCode = {};
        gameModules.forEach(function (gameModule) {
            if (gameModule.supportedLanguages !== "all") {
                gameModule.supportedLanguages.forEach(function (language) {
                    languagesByCode[language.code] = language;
                });
            }
        });
        return languagesByCode;
    }
    exports.getLanguagesByCodeFromGameModules = getLanguagesByCodeFromGameModules;
    function groupGameModulesByLanguageSupport() {
        var _a;
        var gameModules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            gameModules[_i] = arguments[_i];
        }
        var gameModulesByLanguageSupport = {};
        gameModules.forEach(function (gameModule) {
            if (gameModule.supportedLanguages !== "all") {
                gameModule.supportedLanguages.forEach(function (language) {
                    if (!gameModulesByLanguageSupport[language.code]) {
                        gameModulesByLanguageSupport[language.code] = [];
                    }
                    gameModulesByLanguageSupport[language.code].push(gameModule);
                });
            }
        });
        var universalGameModules = gameModules.filter(function (gameModule) {
            return gameModule.supportedLanguages === "all";
        });
        for (var code in gameModulesByLanguageSupport) {
            (_a = gameModulesByLanguageSupport[code]).push.apply(_a, universalGameModules);
        }
        return gameModulesByLanguageSupport;
    }
});
define("src/localization/Localizer", ["require", "exports", "messageformat", "src/localization/formatters", "src/utility", "src/Options"], function (require, exports, MessageFormat, formatters_1, utility_1, Options_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function wrapMessageFunction(messageFN) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args.length === 0 || (typeof args[0] === "object" && args[0] !== null)) {
                return messageFN.apply(null, args);
            }
            else {
                return messageFN(args);
            }
        };
    }
    var Localizer = (function () {
        function Localizer(key) {
            this.messageFormattersByLanguageCode = {};
            this.messagesByLanguageCode = {};
            this.compiledMessagesByLanguageCode = {};
            this.warningMessagesOutputted = {};
            this.key = key;
        }
        Localizer.prototype.setAllMessages = function (messages, language) {
            this.setMessages(messages, language);
        };
        Localizer.prototype.setMessages = function (messages, language) {
            if (this.languageHasBeenInit(language)) {
                this.clearMessages(messages, language);
            }
            this.appendMessages(messages, language);
        };
        Localizer.prototype.appendMessages = function (messages, language) {
            var _a, _b;
            var _this = this;
            if (!this.languageHasBeenInit(language)) {
                this.initLanguage(language);
            }
            for (var key in messages) {
                var messagesForKey = Array.isArray(messages[key]) ?
                    messages[key] :
                    [messages[key]];
                if (!this.messagesByLanguageCode[language.code][key]) {
                    this.messagesByLanguageCode[language.code][key] = [];
                }
                (_a = this.messagesByLanguageCode[language.code][key]).push.apply(_a, messagesForKey);
                if (!this.compiledMessagesByLanguageCode[language.code][key]) {
                    this.compiledMessagesByLanguageCode[language.code][key] = [];
                }
                (_b = this.compiledMessagesByLanguageCode[language.code][key]).push.apply(_b, messagesForKey.map(function (message) {
                    return _this.compileMessage(message, language);
                }));
            }
        };
        Localizer.prototype.localize = function (key) {
            var activeLanguage = Options_1.options.display.language;
            var compiledMessagesForLanguage = this.compiledMessagesByLanguageCode[activeLanguage.code];
            if (compiledMessagesForLanguage) {
                var matchingCompiledMessages = this.compiledMessagesByLanguageCode[activeLanguage.code][key];
                if (matchingCompiledMessages) {
                    return wrapMessageFunction(utility_1.getRandomArrayItem(matchingCompiledMessages));
                }
            }
            var missingLocalizationMessageFunction = this.getMissingLocalizationMessage.bind(this, key, activeLanguage);
            this.warnOfMissingLocalization(missingLocalizationMessageFunction());
            return wrapMessageFunction(missingLocalizationMessageFunction);
        };
        Localizer.prototype.languageHasBeenInit = function (language) {
            return Boolean(this.messagesByLanguageCode[language.code]);
        };
        Localizer.prototype.initLanguage = function (language) {
            this.messagesByLanguageCode[language.code] = {};
            this.messageFormattersByLanguageCode[language.code] = new MessageFormat(language.code);
            this.messageFormattersByLanguageCode[language.code].addFormatters(formatters_1.formatters);
            this.compiledMessagesByLanguageCode[language.code] = {};
        };
        Localizer.prototype.clearMessages = function (messages, language) {
            for (var key in messages) {
                this.messagesByLanguageCode[language.code][key] = [];
                this.compiledMessagesByLanguageCode[language.code][key] = [];
            }
        };
        Localizer.prototype.compileMessage = function (message, language) {
            var messageFormatter = this.messageFormattersByLanguageCode[language.code];
            return messageFormatter.compile(message);
        };
        Localizer.prototype.getMissingLocalizationMessage = function (key, activeLanguage) {
            return this.key + "." + activeLanguage.code + "." + key;
        };
        Localizer.prototype.warnOfMissingLocalization = function (warningMessage) {
            if (!this.warningMessagesOutputted[warningMessage]) {
                this.warningMessagesOutputted[warningMessage] = true;
                console.warn("Missing localization: " + warningMessage);
            }
        };
        return Localizer;
    }());
    exports.Localizer = Localizer;
});
define("src/main", ["require", "exports", "src/App"], function (require, exports, App_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    window.app = App_1.app;
});
define("src/Manufactory", ["require", "exports", "src/activeModuleData", "src/Fleet", "src/Item", "src/Unit", "src/eventManager", "src/utility"], function (require, exports, activeModuleData_1, Fleet_1, Item_1, Unit_1, eventManager_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Manufactory = (function () {
        function Manufactory(star, serializedData) {
            this.buildQueue = [];
            this.unitStatsModifier = 1;
            this.unitHealthModifier = 1;
            this.star = star;
            if (serializedData) {
                this.makeFromData(serializedData);
            }
            else {
                this.capacity = activeModuleData_1.activeModuleData.ruleSet.manufactory.startingCapacity;
                this.maxCapacity = activeModuleData_1.activeModuleData.ruleSet.manufactory.maxCapacity;
            }
        }
        Object.defineProperty(Manufactory.prototype, "owner", {
            get: function () {
                return this.star.owner;
            },
            enumerable: true,
            configurable: true
        });
        Manufactory.getBuildCost = function () {
            return activeModuleData_1.activeModuleData.ruleSet.manufactory.buildCost;
        };
        Manufactory.prototype.makeFromData = function (data) {
            this.capacity = data.capacity;
            this.maxCapacity = data.maxCapacity;
            this.unitStatsModifier = data.unitStatsModifier;
            this.unitHealthModifier = data.unitHealthModifier;
            this.buildQueue = data.buildQueue.map(function (savedThing) {
                var templatesString;
                switch (savedThing.kind) {
                    case "unit":
                        {
                            templatesString = "Units";
                            break;
                        }
                    case "item":
                        {
                            templatesString = "Items";
                        }
                }
                return ({
                    kind: savedThing.kind,
                    template: activeModuleData_1.activeModuleData.templates[templatesString][savedThing.templateType],
                });
            });
        };
        Manufactory.prototype.queueIsFull = function () {
            return this.buildQueue.length >= this.capacity;
        };
        Manufactory.prototype.addThingToQueue = function (template, kind) {
            this.buildQueue.push({ kind: kind, template: template });
            this.owner.money -= template.buildCost;
        };
        Manufactory.prototype.removeThingAtIndex = function (index) {
            var template = this.buildQueue[index].template;
            this.owner.money += template.buildCost;
            this.buildQueue.splice(index, 1);
        };
        Manufactory.prototype.clearBuildingQueue = function () {
            while (this.buildQueue.length > 0) {
                this.removeThingAtIndex(this.buildQueue.length - 1);
            }
        };
        Manufactory.prototype.buildAllThings = function () {
            var _this = this;
            var units = [];
            var toBuild = this.buildQueue.slice(0, this.capacity);
            this.buildQueue = this.buildQueue.slice(this.capacity);
            while (toBuild.length > 0) {
                var thingData = toBuild.pop();
                switch (thingData.kind) {
                    case "unit":
                        {
                            var unitTemplate = thingData.template;
                            var unit = Unit_1.Unit.fromTemplate({
                                template: unitTemplate,
                                race: this.star.localRace,
                                attributeMultiplier: this.unitStatsModifier,
                                healthMultiplier: this.unitHealthModifier,
                            });
                            units.push(unit);
                            this.owner.addUnit(unit);
                            break;
                        }
                    case "item":
                        {
                            var itemTemplate = thingData.template;
                            var item = new Item_1.Item(itemTemplate);
                            this.owner.addItem(item);
                            break;
                        }
                }
            }
            if (units.length > 0) {
                var fleets = Fleet_1.Fleet.createFleetsFromUnits(units);
                fleets.forEach(function (fleet) {
                    _this.owner.addFleet(fleet);
                    _this.star.addFleet(fleet);
                });
            }
            if (!this.owner.isAi) {
                eventManager_1.eventManager.dispatchEvent("playerManufactoryBuiltThings");
            }
        };
        Manufactory.prototype.getManufacturableUnits = function () {
            var _this = this;
            var allUnits = this.owner.race.getBuildableUnits().concat(this.getLocalUnitTypes());
            var uniqueUnits = utility_1.getUniqueArrayKeys(allUnits, function (unit) { return unit.type; });
            var manufacturableUnits = uniqueUnits.filter(function (unitTemplate) {
                return !unitTemplate.techRequirements ||
                    _this.owner.meetsTechRequirements(unitTemplate.techRequirements);
            });
            return manufacturableUnits;
        };
        Manufactory.prototype.getManufacturableItems = function () {
            var _this = this;
            var allItems = this.owner.race.getBuildableItems().concat(this.getLocalItemTypes());
            var uniqueItems = utility_1.getUniqueArrayKeys(allItems, function (item) { return item.type; });
            var manufacturableItems = uniqueItems.filter(function (itemTemplate) {
                return !itemTemplate.techRequirements ||
                    _this.owner.meetsTechRequirements(itemTemplate.techRequirements);
            });
            return manufacturableItems;
        };
        Manufactory.prototype.handleOwnerChange = function () {
            this.clearBuildingQueue();
        };
        Manufactory.prototype.getCapacityUpgradeCost = function () {
            return activeModuleData_1.activeModuleData.ruleSet.manufactory.buildCost * this.capacity;
        };
        Manufactory.prototype.upgradeCapacity = function (amount) {
            this.owner.money -= this.getCapacityUpgradeCost();
            this.capacity = Math.min(this.capacity + amount, this.maxCapacity);
        };
        Manufactory.prototype.getUnitModifierUpgradeCost = function () {
            var totalUpgrades = (this.unitStatsModifier + this.unitHealthModifier - 2) / 0.1;
            return Math.round((totalUpgrades + 1) * 100);
        };
        Manufactory.prototype.upgradeUnitStatsModifier = function (amount) {
            this.owner.money -= this.getUnitModifierUpgradeCost();
            this.unitStatsModifier += amount;
        };
        Manufactory.prototype.upgradeUnitHealthModifier = function (amount) {
            this.owner.money -= this.getUnitModifierUpgradeCost();
            this.unitHealthModifier += amount;
        };
        Manufactory.prototype.serialize = function () {
            var buildQueue = this.buildQueue.map(function (thingData) {
                return ({
                    kind: thingData.kind,
                    templateType: thingData.template.type,
                });
            });
            return ({
                capacity: this.capacity,
                maxCapacity: this.maxCapacity,
                unitStatsModifier: this.unitStatsModifier,
                unitHealthModifier: this.unitHealthModifier,
                buildQueue: buildQueue,
            });
        };
        Manufactory.prototype.getLocalUnitTypes = function () {
            return this.star.localRace.getBuildableUnits();
        };
        Manufactory.prototype.getLocalItemTypes = function () {
            return this.star.localRace.getBuildableItems();
        };
        return Manufactory;
    }());
    exports.Manufactory = Manufactory;
});
define("src/MapGenResult", ["require", "exports", "quadtree-lib", "src/GalaxyMap", "src/MapVoronoiInfo", "src/voronoi"], function (require, exports, QuadTree, GalaxyMap_1, MapVoronoiInfo_1, voronoi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapGenResult = (function () {
        function MapGenResult(props) {
            this.stars = props.stars;
            this.fillerPoints = props.fillerPoints;
            this.width = props.width;
            this.height = props.height;
            this.seed = props.seed;
            this.independents = props.independents;
        }
        MapGenResult.prototype.makeMap = function () {
            this.voronoiInfo = this.makeVoronoiInfo();
            var map = new GalaxyMap_1.GalaxyMap(this);
            return map;
        };
        MapGenResult.prototype.getAllPoints = function () {
            var castedFillerPoints = this.fillerPoints;
            return castedFillerPoints.concat(this.stars);
        };
        MapGenResult.prototype.makeVoronoiInfo = function () {
            var voronoiInfo = new MapVoronoiInfo_1.MapVoronoiInfo();
            voronoiInfo.diagram = voronoi_1.makeVoronoi(this.getAllPoints(), this.width, this.height);
            voronoi_1.setVoronoiCells(voronoiInfo.diagram.cells);
            voronoiInfo.treeMap = this.makeVoronoiTreeMap();
            voronoiInfo.bounds =
                {
                    x1: 0,
                    x2: this.width,
                    y1: 0,
                    y2: this.height,
                };
            for (var i = 0; i < this.stars.length; i++) {
                var star = this.stars[i];
                star.basisX = star.x;
                star.basisY = star.y;
            }
            voronoi_1.relaxVoronoi(voronoiInfo.diagram, function (point) {
                var isFiller = !isFinite(point.id);
                return isFiller ? 0 : 1;
            });
            return voronoiInfo;
        };
        MapGenResult.prototype.makeVoronoiTreeMap = function () {
            var treeMap = new QuadTree({
                x: 0,
                y: 0,
                width: this.width,
                height: this.height,
            });
            this.stars.forEach(function (star) {
                treeMap.push(star.voronoiCell);
            });
            return treeMap;
        };
        return MapGenResult;
    }());
    exports.MapGenResult = MapGenResult;
});
define("src/MapRenderer", ["require", "exports", "pixi.js", "src/activeModuleData", "src/MapRendererLayer", "src/MapRendererMapMode", "src/Options", "src/eventManager"], function (require, exports, PIXI, activeModuleData_1, MapRendererLayer_1, MapRendererMapMode_1, Options_1, eventManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapRenderer = (function () {
        function MapRenderer(map, player) {
            this.layers = {};
            this.mapModes = {};
            this.isDirty = true;
            this.preventRender = false;
            this.listeners = {};
            this.container = new PIXI.Container();
            this.galaxyMap = map;
            this.player = player;
        }
        MapRenderer.prototype.destroy = function () {
            this.preventRender = true;
            this.container.renderable = false;
            for (var name_1 in this.listeners) {
                eventManager_1.eventManager.removeEventListener(name_1, this.listeners[name_1]);
            }
            this.container.removeChildren();
            this.parent.removeChild(this.container);
            this.player = null;
            this.container = null;
            this.parent = null;
            for (var layerName in this.layers) {
                this.layers[layerName].destroy();
            }
        };
        MapRenderer.prototype.init = function () {
            this.initLayers();
            this.initMapModes();
            this.addEventListeners();
        };
        MapRenderer.prototype.addEventListeners = function () {
            var _this = this;
            this.listeners["renderMap"] =
                eventManager_1.eventManager.addEventListener("renderMap", this.setAllLayersAsDirty.bind(this));
            this.listeners["renderLayer"] =
                eventManager_1.eventManager.addEventListener("renderLayer", function (layerName, star) {
                    var passesStarVisibilityCheck = true;
                    if (star) {
                        switch (layerName) {
                            case "fleets":
                                {
                                    passesStarVisibilityCheck = _this.player.starIsVisible(star);
                                    break;
                                }
                            default:
                                {
                                    passesStarVisibilityCheck = _this.player.starIsRevealed(star);
                                    break;
                                }
                        }
                    }
                    if (passesStarVisibilityCheck || Options_1.options.debug.enabled) {
                        _this.setLayerAsDirty(layerName);
                    }
                });
        };
        MapRenderer.prototype.setPlayer = function (player) {
            this.player = player;
            this.setAllLayersAsDirty();
        };
        MapRenderer.prototype.initLayers = function () {
            for (var layerKey in activeModuleData_1.activeModuleData.templates.MapRendererLayers) {
                var template = activeModuleData_1.activeModuleData.templates.MapRendererLayers[layerKey];
                var layer = new MapRendererLayer_1.MapRendererLayer(template);
                this.layers[layerKey] = layer;
            }
        };
        MapRenderer.prototype.initMapModes = function () {
            var _this = this;
            var buildMapMode = function (mapModeKey, template) {
                var alreadyAdded = {};
                var mapMode = new MapRendererMapMode_1.MapRendererMapMode(template);
                for (var i = 0; i < template.layers.length; i++) {
                    var layer = template.layers[i];
                    mapMode.addLayer(_this.layers[layer.key], true);
                    alreadyAdded[layer.key] = true;
                }
                for (var layerKey in _this.layers) {
                    if (!alreadyAdded[layerKey]) {
                        mapMode.addLayer(_this.layers[layerKey], false);
                        alreadyAdded[layerKey] = true;
                    }
                }
                _this.mapModes[mapModeKey] = mapMode;
            };
            for (var mapModeKey in activeModuleData_1.activeModuleData.templates.MapRendererMapModes) {
                var template = activeModuleData_1.activeModuleData.templates.MapRendererMapModes[mapModeKey];
                buildMapMode(mapModeKey, template);
            }
        };
        MapRenderer.prototype.setParent = function (newParent) {
            var oldParent = this.parent;
            if (oldParent) {
                oldParent.removeChild(this.container);
            }
            this.parent = newParent;
            newParent.addChild(this.container);
        };
        MapRenderer.prototype.resetContainer = function () {
            this.container.removeChildren();
        };
        MapRenderer.prototype.getMapBoundsForCamera = function () {
            var boundsLayers = this.currentMapMode.getActiveLayers().filter(function (layer) {
                return layer.container.width && layer.container.height && layer.template.isUsedForCameraBounds;
            });
            if (boundsLayers.length > 0) {
                return boundsLayers.map(function (layer) {
                    return layer.container.getLocalBounds();
                }).reduce(function (finalBounds, bounds) {
                    if (!finalBounds) {
                        return bounds.clone();
                    }
                    else {
                        finalBounds.enlarge(bounds);
                        return finalBounds;
                    }
                });
            }
            else {
                return this.container.getLocalBounds();
            }
        };
        MapRenderer.prototype.setLayerAsDirty = function (layerName) {
            var layer = this.layers[layerName];
            layer.isDirty = true;
            this.isDirty = true;
            this.render();
        };
        MapRenderer.prototype.setAllLayersAsDirty = function () {
            for (var i = 0; i < this.currentMapMode.layers.length; i++) {
                this.currentMapMode.layers[i].isDirty = true;
            }
            this.isDirty = true;
            this.render();
        };
        MapRenderer.prototype.updateMapModeLayers = function (updatedLayers) {
            for (var i = 0; i < updatedLayers.length; i++) {
                var layer = updatedLayers[i];
                var childIndex = this.container.children.indexOf(layer.container);
                var mapModeLayerIndex = this.currentMapMode.getLayerIndexInContainer(layer);
                if (childIndex === -1) {
                    this.container.addChildAt(layer.container, mapModeLayerIndex);
                }
                else {
                    this.container.removeChildAt(mapModeLayerIndex + 1);
                }
                this.setLayerAsDirty(layer.template.key);
            }
        };
        MapRenderer.prototype.resetMapModeLayersPosition = function () {
            this.resetContainer();
            var layerData = this.currentMapMode.getActiveLayers();
            for (var i = 0; i < layerData.length; i++) {
                var layer = layerData[i];
                this.container.addChild(layer.container);
            }
        };
        MapRenderer.prototype.setMapModeByKey = function (key) {
            this.setMapMode(this.mapModes[key]);
        };
        MapRenderer.prototype.setMapMode = function (newMapMode) {
            if (!this.mapModes[newMapMode.template.key]) {
                throw new Error("Invalid mapmode " + newMapMode.template.key);
            }
            if (this.currentMapMode && this.currentMapMode === newMapMode) {
                return;
            }
            this.currentMapMode = newMapMode;
            this.resetContainer();
            var layerData = this.currentMapMode.getActiveLayers();
            for (var i = 0; i < layerData.length; i++) {
                var layer = layerData[i];
                this.container.addChild(layer.container);
            }
            this.setAllLayersAsDirty();
        };
        MapRenderer.prototype.render = function () {
            if (this.preventRender || !this.isDirty) {
                return;
            }
            var layerData = this.currentMapMode.getActiveLayers();
            for (var i = 0; i < layerData.length; i++) {
                var layer = layerData[i];
                layer.draw(this.galaxyMap, this);
            }
            this.isDirty = false;
        };
        return MapRenderer;
    }());
    exports.MapRenderer = MapRenderer;
});
define("src/MapRendererLayer", ["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapRendererLayer = (function () {
        function MapRendererLayer(template) {
            this.isDirty = true;
            this.template = template;
            this.container = new PIXI.Container();
            this.container.interactiveChildren = template.interactive;
            this.alpha = template.initialAlpha || 1;
        }
        Object.defineProperty(MapRendererLayer.prototype, "alpha", {
            get: function () {
                return this._alpha;
            },
            set: function (newAlpha) {
                this._alpha = newAlpha;
                this.container.alpha = newAlpha;
            },
            enumerable: true,
            configurable: true
        });
        MapRendererLayer.prototype.resetAlpha = function () {
            this.alpha = this.template.initialAlpha || 1;
        };
        MapRendererLayer.prototype.draw = function (map, mapRenderer) {
            if (!this.isDirty) {
                return;
            }
            this.container.removeChildren();
            this.container.addChild(this.template.drawingFunction(map, mapRenderer.player));
            this.isDirty = false;
        };
        MapRendererLayer.prototype.destroy = function () {
            if (this.template.destroy) {
                this.template.destroy();
            }
        };
        return MapRendererLayer;
    }());
    exports.MapRendererLayer = MapRendererLayer;
});
define("src/MapRendererMapMode", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapRendererMapMode = (function () {
        function MapRendererMapMode(template) {
            this.layers = [];
            this.activeLayers = {};
            this.template = template;
            this.displayName = template.displayName;
        }
        MapRendererMapMode.prototype.addLayer = function (layer, isActive) {
            if (isActive === void 0) { isActive = true; }
            if (this.hasLayer(layer)) {
                throw new Error("Tried to add duplicate layer " + layer.template.key);
            }
            this.layers.push(layer);
            this.activeLayers[layer.template.key] = isActive;
        };
        MapRendererMapMode.prototype.hasLayer = function (layer) {
            return this.layers.indexOf(layer) !== -1;
        };
        MapRendererMapMode.prototype.getLayerIndexInContainer = function (layer) {
            var index = -1;
            for (var i = 0; i < this.layers.length; i++) {
                if (this.activeLayers[this.layers[i].template.key]) {
                    index++;
                }
                if (this.layers[i] === layer) {
                    return index;
                }
            }
            throw new Error("Map mode doesn't have layer " + layer.template.key);
        };
        MapRendererMapMode.prototype.toggleLayer = function (layer) {
            this.activeLayers[layer.template.key] = !this.activeLayers[layer.template.key];
            if (!this.hasLayer(layer)) {
                this.addLayer(layer);
            }
        };
        MapRendererMapMode.prototype.moveLayer = function (toInsert, target, position) {
            var indexAdjust = (position === "top" ? 0 : 1);
            var prevIndex = this.layers.indexOf(toInsert);
            this.layers.splice(prevIndex, 1);
            var newIndex = this.layers.indexOf(target) + indexAdjust;
            this.layers.splice(newIndex, 0, toInsert);
        };
        MapRendererMapMode.prototype.getActiveLayers = function () {
            var _this = this;
            return (this.layers.filter(function (layer) {
                return _this.activeLayers[layer.template.key];
            }));
        };
        MapRendererMapMode.prototype.resetLayers = function () {
            var layersByKey = {};
            var newLayers = [];
            var newActive = {};
            for (var i = 0; i < this.layers.length; i++) {
                var layer = this.layers[i];
                layersByKey[layer.template.key] = layer;
            }
            for (var i = 0; i < this.template.layers.length; i++) {
                var layerTemplate = this.template.layers[i];
                var layer = layersByKey[layerTemplate.key];
                newLayers.push(layer);
                newActive[layerTemplate.key] = true;
                delete layersByKey[layerTemplate.key];
            }
            for (var key in layersByKey) {
                var layer = layersByKey[key];
                newLayers.push(layer);
                newActive[key] = false;
            }
            this.layers = newLayers;
            this.activeLayers = newActive;
            for (var i = 0; i < this.layers.length; i++) {
                this.layers[i].resetAlpha();
            }
        };
        return MapRendererMapMode;
    }());
    exports.MapRendererMapMode = MapRendererMapMode;
});
define("src/MapVoronoiInfo", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapVoronoiInfo = (function () {
        function MapVoronoiInfo() {
            this.nonFillerLines = {};
        }
        MapVoronoiInfo.prototype.getNonFillerVoronoiLines = function (visibleStars) {
            if (!this.diagram) {
                return [];
            }
            var indexString = "";
            if (!visibleStars) {
                indexString = "all";
            }
            else {
                var ids = visibleStars.map(function (star) { return star.id; });
                ids.sort();
                indexString = ids.join();
            }
            if (!this.nonFillerLines[indexString] ||
                this.nonFillerLines[indexString].length <= 0) {
                this.nonFillerLines[indexString] = this.diagram.edges.filter(function (edge) {
                    var adjacentSites = [edge.lSite, edge.rSite];
                    var adjacentFillerSites = 0;
                    var maxAllowedFillerSites = 2;
                    for (var i = 0; i < adjacentSites.length; i++) {
                        var site = adjacentSites[i];
                        if (!site) {
                            maxAllowedFillerSites--;
                            if (adjacentFillerSites >= maxAllowedFillerSites) {
                                return false;
                            }
                            continue;
                        }
                        if (visibleStars && visibleStars.indexOf(site) < 0) {
                            maxAllowedFillerSites--;
                            if (adjacentFillerSites >= maxAllowedFillerSites) {
                                return false;
                            }
                            continue;
                        }
                        var castedSite = site;
                        var isFiller = !isFinite(castedSite.id);
                        if (isFiller) {
                            adjacentFillerSites++;
                            if (adjacentFillerSites >= maxAllowedFillerSites) {
                                return false;
                            }
                        }
                    }
                    return true;
                });
            }
            return this.nonFillerLines[indexString];
        };
        MapVoronoiInfo.prototype.getStarAtPoint = function (point) {
            var items = this.treeMap.colliding(point);
            for (var i = 0; i < items.length; i++) {
                if (items[i].pointIntersection(point.x, point.y) > -1) {
                    return items[i].site;
                }
            }
            return null;
        };
        return MapVoronoiInfo;
    }());
    exports.MapVoronoiInfo = MapVoronoiInfo;
});
define("src/MCTree", ["require", "exports", "src/MCTreeNode", "src/debug"], function (require, exports, MCTreeNode_1, debug) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MCTree = (function () {
        function MCTree(battle, sideId) {
            this.battle = battle;
            this.remakeRootNode();
        }
        Object.defineProperty(MCTree.prototype, "rootNode", {
            get: function () {
                return this._rootNode;
            },
            enumerable: true,
            configurable: true
        });
        MCTree.sortByCombinedScoreFN = function (a, b) {
            return b.getCombinedScore() - a.getCombinedScore();
        };
        MCTree.prototype.advanceMove = function (move, confidencePersistence) {
            this._rootNode = this._rootNode.children.get(move);
            if (!this._rootNode) {
                this.remakeRootNode();
            }
            this._rootNode.recursivelyAdjustConfidence(confidencePersistence);
        };
        MCTree.prototype.getBestMoveAndAdvance = function (iterations, confidencePersistence) {
            var best = this.getBestMove(iterations);
            this.advanceMove(best.move, confidencePersistence);
            return best.move;
        };
        MCTree.prototype.getBestMove = function (iterations) {
            for (var i = 0; i < iterations; i++) {
                var battle = this.battle.makeVirtualClone();
                var toSimulateFrom = this._rootNode.getBestNodeToSimulateFrom(battle);
                toSimulateFrom.simulateToEnd(battle);
            }
            var sortedMoves = this._rootNode.children.flatten().sort(MCTree.sortByCombinedScoreFN);
            if (debug.shouldLog("ai")) {
                debug.table("ai", "AI move evaluation", sortedMoves.map(function (node) { return node.getDebugInformation(); }));
            }
            var best = sortedMoves[0];
            return best;
        };
        MCTree.prototype.remakeRootNode = function () {
            this._rootNode = new MCTreeNode_1.MCTreeNode({
                sideId: this.battle.activeUnit.battleStats.side,
                move: null,
                depth: 0,
                parent: null,
                isBetweenAi: this.battle.side1Player.isAi && this.battle.side2Player.isAi,
            });
        };
        return MCTree;
    }());
    exports.MCTree = MCTree;
});
define("src/MCTreeNode", ["require", "exports", "src/Move", "src/battleAbilityTargeting", "src/battleAbilityUsage", "src/utility"], function (require, exports, Move_1, battleAbilityTargeting_1, battleAbilityUsage_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MCTreeNode = (function () {
        function MCTreeNode(props) {
            this.visits = 0;
            this.wins = 0;
            this.totalEndScore = 0;
            this.timesMoveWasPossible = 0;
            this.depth = 0;
            this.evaluationWeightIsDirty = true;
            this.sideId = props.sideId;
            this.move = props.move;
            this.depth = props.depth;
            this.parent = props.parent;
            this.isBetweenAi = props.isBetweenAi;
            this.children = new Move_1.MoveCollection();
        }
        MCTreeNode.prototype.getCombinedScore = function () {
            var winRateWeight = 1;
            var endScoreWeight = 0.5;
            var sign = this.sideId === "side1" ? 1 : -1;
            var averageEndScore = this.totalEndScore / this.visits;
            var baseEndScore = averageEndScore * sign;
            var normalizedEndScore = (baseEndScore + 1) / 2;
            var winRate = this.wins / this.visits;
            var aiAdjust = this.move.ability.AiScoreMultiplier || 1;
            var combinedScore = (normalizedEndScore * endScoreWeight + winRate * winRateWeight) * aiAdjust;
            var normalizedCombinedScore = combinedScore / (winRateWeight + endScoreWeight);
            return normalizedCombinedScore;
        };
        MCTreeNode.prototype.simulateToEnd = function (battle) {
            while (!battle.ended) {
                this.playRandomMove(battle);
            }
            this.updateResult(battle.getEvaluation());
        };
        MCTreeNode.prototype.getBestNodeToSimulateFrom = function (battle) {
            var _this = this;
            if (battle.ended) {
                return this;
            }
            var possibleMoves = this.getPossibleMoves(battle);
            var unexploredChildNodes = [];
            possibleMoves.forEach(function (move) {
                var childForMove = _this.children.get(move);
                if (!childForMove) {
                    childForMove = _this.addChild(move, battle.activeUnit.battleStats.side);
                }
                if (childForMove.visits === 0) {
                    unexploredChildNodes.push(childForMove);
                }
                childForMove.timesMoveWasPossible += 1;
            });
            if (unexploredChildNodes.length > 0) {
                unexploredChildNodes.sort(function (a, b) {
                    var aPriority = isFinite(a.move.ability.AiEvaluationPriority) ? a.move.ability.AiEvaluationPriority : 0;
                    var bPriority = isFinite(b.move.ability.AiEvaluationPriority) ? b.move.ability.AiEvaluationPriority : 0;
                    return bPriority - aPriority;
                });
                unexploredChildNodes[0].playAssociatedMove(battle);
                return unexploredChildNodes[0];
            }
            else if (this.children.length > 0) {
                var child = this.getHighestEvaluationWeightChild(possibleMoves);
                child.playAssociatedMove(battle);
                return child.getBestNodeToSimulateFrom(battle);
            }
            else {
                throw new Error("AI simulation couldn't find a move despite battle not having ended");
            }
        };
        MCTreeNode.prototype.recursivelyAdjustConfidence = function (confidencePersistence) {
            this.depth = this.depth - 1;
            this.evaluationWeightIsDirty = true;
            if (confidencePersistence === 1) {
                return;
            }
            else {
                this.visits *= confidencePersistence;
                this.timesMoveWasPossible *= confidencePersistence;
                this.wins *= confidencePersistence;
                this.totalEndScore *= confidencePersistence;
                if (confidencePersistence === 0) {
                    this.children = new Move_1.MoveCollection();
                }
                else {
                    this.children.forEach(function (child) {
                        child.recursivelyAdjustConfidence(confidencePersistence);
                    });
                }
            }
        };
        MCTreeNode.prototype.getPossibleMoves = function (battle) {
            if (!battle.activeUnit) {
                return [];
            }
            var targets = battleAbilityTargeting_1.getTargetsForAllAbilities(battle, battle.activeUnit);
            var possibleMoves = [];
            for (var id in targets) {
                var targetActions = targets[id];
                for (var i = 0; i < targetActions.length; i++) {
                    if (targetActions[i].disableInAiBattles && this.isBetweenAi) {
                    }
                    else {
                        possibleMoves.push({
                            userId: battle.activeUnit.id,
                            targetId: parseInt(id),
                            ability: targetActions[i],
                        });
                    }
                }
            }
            return possibleMoves;
        };
        MCTreeNode.prototype.getDebugInformation = function () {
            return ({
                combinedScore: this.getCombinedScore(),
                visits: this.visits,
                evaluationWeight: this.evaluationWeight,
                winRate: this.wins / this.visits,
                averageEndScore: this.totalEndScore / this.visits,
                timesMoveWasPossible: this.timesMoveWasPossible,
                move: this.move.userId + ": " + this.move.ability.displayName + " => " + this.move.targetId,
            });
        };
        MCTreeNode.prototype.updateResult = function (result) {
            this.visits++;
            this.totalEndScore += result;
            if (this.sideId === "side1") {
                if (result > 0) {
                    this.wins++;
                }
            }
            else if (this.sideId === "side2") {
                if (result < 0) {
                    this.wins++;
                }
            }
            this.evaluationWeightIsDirty = true;
            if (this.parent) {
                this.parent.updateResult(result);
            }
        };
        MCTreeNode.prototype.pickRandomMoveFromPossibleActions = function (actions, userId) {
            var key = 0;
            var prioritiesByKey = {};
            var movesByKey = {};
            var _loop_1 = function (targetId) {
                var abilities = actions[targetId];
                abilities.forEach(function (ability) {
                    var priority = isFinite(ability.AiEvaluationPriority) ? ability.AiEvaluationPriority : 1;
                    prioritiesByKey[key] = priority;
                    movesByKey[key] =
                        {
                            userId: userId,
                            targetId: parseInt(targetId),
                            ability: ability,
                        };
                    key++;
                });
            };
            for (var targetId in actions) {
                _loop_1(targetId);
            }
            var selectedKey = utility_1.getRandomKeyWithWeights(prioritiesByKey);
            return movesByKey[selectedKey];
        };
        MCTreeNode.prototype.playAssociatedMove = function (battle) {
            var user = battle.unitsById[this.move.userId];
            var target = battle.unitsById[this.move.targetId];
            battleAbilityUsage_1.useAbility(battle, this.move.ability, user, target);
            battle.endTurn();
        };
        MCTreeNode.prototype.playRandomMove = function (battle) {
            var actions = battleAbilityTargeting_1.getTargetsForAllAbilities(battle, battle.activeUnit);
            var selectedMove = this.pickRandomMoveFromPossibleActions(actions, battle.activeUnit.id);
            var ability = selectedMove.ability;
            var user = battle.unitsById[selectedMove.userId];
            var target = battle.unitsById[selectedMove.targetId];
            battleAbilityUsage_1.useAbility(battle, ability, user, target);
            battle.endTurn();
        };
        MCTreeNode.prototype.addChild = function (move, side) {
            var child = new MCTreeNode({
                sideId: side,
                move: move,
                depth: this.depth + 1,
                parent: this,
                isBetweenAi: this.isBetweenAi,
            });
            this.children.set(move, child);
            return child;
        };
        MCTreeNode.prototype.setEvaluationWeight = function () {
            var explorationBias = 2;
            var availabilityBias = 0.2;
            var winRate = this.wins / this.visits;
            var decidedness = Math.pow(utility_1.smoothStep(winRate, 0.925, 1.0), 3) / 2;
            this.evaluationWeight = this.getCombinedScore() * (1 - decidedness) +
                Math.sqrt(explorationBias * Math.log(this.parent.visits) / this.visits) +
                availabilityBias * (this.parent.visits / this.timesMoveWasPossible);
            if (isFinite(this.move.ability.AiEvaluationPriority)) {
                this.evaluationWeight *= this.move.ability.AiEvaluationPriority;
            }
            this.evaluationWeightIsDirty = false;
        };
        MCTreeNode.prototype.getHighestEvaluationWeightChild = function (possibleMoves) {
            var _this = this;
            var candidateChildren = possibleMoves.filter(function (move) {
                return _this.children.has(move);
            }).map(function (move) {
                return _this.children.get(move);
            });
            return candidateChildren.reduce(function (previousHighest, child) {
                if (child.evaluationWeightIsDirty) {
                    child.setEvaluationWeight();
                }
                if (!previousHighest || child.evaluationWeight > previousHighest.evaluationWeight) {
                    return child;
                }
                else {
                    return previousHighest;
                }
            }, null);
        };
        return MCTreeNode;
    }());
    exports.MCTreeNode = MCTreeNode;
});
define("src/ModuleData", ["require", "exports", "src/ModuleScripts", "src/utility"], function (require, exports, ModuleScripts_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModuleData = (function () {
        function ModuleData() {
            this.gameModules = [];
            this.templates = {
                Abilities: {},
                AiTemplateConstructors: {},
                AttitudeModifiers: {},
                BattleVfx: {},
                Buildings: {},
                Items: {},
                Languages: {},
                MapGen: {},
                MapRendererLayers: {},
                MapRendererMapModes: {},
                Notifications: {},
                PassiveSkills: {},
                Personalities: {},
                Portraits: {},
                Races: {},
                Resources: {},
                SubEmblems: {},
                Technologies: {},
                Terrains: {},
                UnitArchetypes: {},
                UnitEffects: {},
                Units: {},
            };
            this.uiScenes = {};
            this.technologyUnlocksAreDirty = true;
            this.cachedTechnologyUnlocks = {};
            this.scripts = new ModuleScripts_1.ModuleScripts();
        }
        Object.defineProperty(ModuleData.prototype, "technologyUnlocks", {
            get: function () {
                if (this.technologyUnlocksAreDirty) {
                    this.cachedTechnologyUnlocks = this.getAllTechnologyUnlocks();
                }
                return this.cachedTechnologyUnlocks;
            },
            enumerable: true,
            configurable: true
        });
        ModuleData.prototype.copyTemplates = function (source, category) {
            if (!this.templates[category]) {
                console.warn("Tried to copy templates in invalid category \"" + category + "\". Category must be one of: " + Object.keys(this.templates).join(", "));
                return;
            }
            for (var templateType in source) {
                var hasDuplicate = Boolean(this.templates[category][templateType]);
                if (category === "Abilities" || category === "PassiveSkills") {
                    if (this.templates.Abilities[templateType] || this.templates.PassiveSkills[templateType]) {
                        hasDuplicate = true;
                    }
                }
                if (hasDuplicate) {
                    throw new Error("Duplicate '" + category + "' template '" + templateType + "'");
                }
                this.templates[category][templateType] = source[templateType];
            }
            this.technologyUnlocksAreDirty = true;
        };
        ModuleData.prototype.copyAllTemplates = function (source) {
            for (var category in this.templates) {
                if (source[category]) {
                    this.copyTemplates(source[category], category);
                }
            }
        };
        ModuleData.prototype.addGameModule = function (gameModule) {
            this.gameModules.push(gameModule);
        };
        ModuleData.prototype.getDefaultMap = function () {
            if (this.defaultMap) {
                return this.defaultMap;
            }
            else if (Object.keys(this.templates.MapGen).length > 0) {
                return utility_1.getRandomProperty(this.templates.MapGen);
            }
            else {
                throw new Error("No modules have map generators registered.");
            }
        };
        ModuleData.prototype.appendRuleSet = function (valuesToAppend) {
            if (!this.ruleSet) {
                throw new Error("Set ModuleData.ruleSet first");
            }
            this.ruleSet = utility_1.deepMerge(this.ruleSet, valuesToAppend);
        };
        ModuleData.prototype.fetchLanguageForCode = function (languageCode) {
            var language = this.templates.Languages[languageCode];
            if (language) {
                return language;
            }
            else {
                var defaultLanguage = this.getDefaultLanguage();
                console.warn("Desired language (code '" + languageCode + "') is not loaded.");
                return defaultLanguage;
            }
        };
        ModuleData.prototype.getDefaultLanguage = function () {
            var chosenLanguage;
            if (this.defaultLanguage) {
                chosenLanguage = this.defaultLanguage;
            }
            else if (this.templates.Languages["en"]) {
                chosenLanguage = this.templates.Languages["en"];
            }
            else {
                throw new Error("Please define a default language for your module configuration if " +
                    "it doesn't include English language support.");
            }
            return chosenLanguage;
        };
        ModuleData.prototype.serialize = function () {
            return this.gameModules.map(function (gameModule) {
                return ({
                    info: gameModule.info,
                    moduleSaveData: gameModule.serializeModuleSpecificData ? gameModule.serializeModuleSpecificData : null,
                });
            });
        };
        ModuleData.prototype.getAllTechnologyUnlocks = function () {
            var technologyUnlocks = {};
            var allUnlockableTemplateCollections = [
                this.templates.Buildings,
                this.templates.Items,
                this.templates.Units,
            ];
            var allUnlockableThings = allUnlockableTemplateCollections.map(function (templateCollection) {
                return Object.keys(templateCollection).map(function (key) {
                    return templateCollection[key];
                });
            }).reduce(function (allUnlockables, unlockablesOfType) {
                return allUnlockables.concat(unlockablesOfType);
            }, []);
            var unlockableThingsWithTechRequirements = allUnlockableThings.filter(function (unlockableThing) {
                return Boolean(unlockableThing.techRequirements);
            });
            unlockableThingsWithTechRequirements.forEach(function (unlockableThing) {
                unlockableThing.techRequirements.forEach(function (techRequirement) {
                    var tech = techRequirement.technology;
                    if (!technologyUnlocks[tech.key]) {
                        technologyUnlocks[tech.key] = {};
                    }
                    if (!technologyUnlocks[tech.key][techRequirement.level]) {
                        technologyUnlocks[tech.key][techRequirement.level] = [];
                    }
                    technologyUnlocks[tech.key][techRequirement.level].push(unlockableThing);
                });
            });
            return technologyUnlocks;
        };
        return ModuleData;
    }());
    exports.ModuleData = ModuleData;
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
define("src/ModuleDependencyGraph", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DependencyGraph = (function () {
        function DependencyGraph() {
            this._nodes = {};
            this.children = {};
            this.parents = {};
        }
        DependencyGraph.prototype.addNode = function (key, node) {
            this._nodes[key] = node;
            this.initKeyIfNeeded(key);
        };
        DependencyGraph.prototype.addDependency = function (parentKey, childKey) {
            var _this = this;
            [childKey, parentKey].forEach(function (nodeKey) {
                _this.initKeyIfNeeded(nodeKey);
            });
            this.parents[childKey][parentKey] = true;
            this.children[parentKey][childKey] = true;
        };
        DependencyGraph.prototype.getOrderedNodes = function () {
            var _this = this;
            var startNodes = this.getIndependentNodeKeys();
            var ordered = [];
            var traversed = {};
            var DFS = function (currentNodeKey, takenPath) {
                if (takenPath === void 0) { takenPath = []; }
                Object.keys(_this.children[currentNodeKey]).forEach(function (childOfCurrent) {
                    if (!traversed[childOfCurrent]) {
                        DFS(childOfCurrent, takenPath.concat([currentNodeKey]));
                    }
                    else if (takenPath.indexOf(childOfCurrent) !== -1) {
                        throw new Error("Cyclical dependency: " + takenPath.concat([childOfCurrent]).join(" -> "));
                    }
                });
                traversed[currentNodeKey] = true;
                ordered.unshift(_this.getNode(currentNodeKey));
            };
            startNodes.forEach(function (startNode) { return DFS(startNode); });
            return ordered;
        };
        DependencyGraph.prototype.getImmediateParentsOf = function (nodeKey) {
            var _this = this;
            return Object.keys(this.parents[nodeKey]).map(function (parentKey) { return _this.getNode(parentKey); });
        };
        DependencyGraph.prototype.hasKey = function (key) {
            return Boolean(this.parents[key] || this.children[key]);
        };
        DependencyGraph.prototype.initKeyIfNeeded = function (key) {
            if (!this.hasKey(key)) {
                this.parents[key] = {};
                this.children[key] = {};
            }
        };
        DependencyGraph.prototype.getIndependentNodeKeys = function () {
            var _this = this;
            return Object.keys(this._nodes).filter(function (node) { return Object.keys(_this.parents[node]).length === 0; });
        };
        DependencyGraph.prototype.getNode = function (key) {
            var node = this._nodes[key];
            if (!node) {
                throw new Error("'" + key + "' was listed as a dependency in dependency graph, but no node with the key '" + key + "' was provided.");
            }
            return node;
        };
        return DependencyGraph;
    }());
    var ModuleDependencyGraph = (function (_super) {
        __extends(ModuleDependencyGraph, _super);
        function ModuleDependencyGraph(modules) {
            if (modules === void 0) { modules = []; }
            var _this = _super.call(this) || this;
            modules.forEach(function (moduleInfo) { return _this.addModule(moduleInfo); });
            return _this;
        }
        ModuleDependencyGraph.prototype.addModule = function (moduleInfo) {
            var _this = this;
            this.addNode(moduleInfo.key, moduleInfo);
            if (moduleInfo.modsToLoadAfter) {
                moduleInfo.modsToLoadAfter.forEach(function (child) {
                    _this.addDependency(moduleInfo.key, child);
                });
            }
            if (moduleInfo.modsToLoadBefore) {
                moduleInfo.modsToLoadBefore.forEach(function (child) {
                    _this.addDependency(child, moduleInfo.key);
                });
            }
        };
        return ModuleDependencyGraph;
    }(DependencyGraph));
    exports.ModuleDependencyGraph = ModuleDependencyGraph;
});
define("src/ModuleInitializer", ["require", "exports", "src/GameModuleInitializationPhase", "src/debug", "src/ModuleDependencyGraph", "src/ModuleStore"], function (require, exports, GameModuleInitializationPhase_1, debug, ModuleDependencyGraph_1, ModuleStore_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModuleInitializer = (function () {
        function ModuleInitializer(moduleData, moduleStore, gameModules) {
            var _this = this;
            this.gameModulesByKey = {};
            this.gameModulesByPhase = {};
            this.moduleInitializationPromises = {};
            this.moduleInitalizationStart = {};
            this.moduleData = moduleData;
            this.moduleStore = moduleStore;
            this.dependencyGraph = new ModuleDependencyGraph_1.ModuleDependencyGraph();
            GameModuleInitializationPhase_1.allGameModuleInitializationPhases.forEach(function (phase) {
                _this.gameModulesByPhase[phase] = [];
            });
            gameModules.forEach(function (gameModule) { return _this.addGameModule(gameModule); });
        }
        ModuleInitializer.prototype.initModulesNeededForPhase = function (phaseToInitUpTo) {
            var _this = this;
            var phasesNeeded = Object.keys(this.gameModulesByPhase).map(function (phaseString) {
                return Number(phaseString);
            }).filter(function (phase) {
                return phase <= phaseToInitUpTo;
            }).sort();
            var allPromises = phasesNeeded.map(function (phase) { return _this.initModulesForPhase(phase); });
            return Promise.all(allPromises);
        };
        ModuleInitializer.prototype.progressivelyInitModulesByPhase = function (startingPhase) {
            var _this = this;
            this.initModulesForPhase(startingPhase).then(function () {
                var nextPhase = startingPhase + 1;
                if (_this.gameModulesByPhase[nextPhase]) {
                    _this.progressivelyInitModulesByPhase(nextPhase);
                }
            });
        };
        ModuleInitializer.prototype.addGameModule = function (gameModule) {
            var _this = this;
            if (this.gameModulesByKey[gameModule.info.key]) {
                return;
            }
            this.gameModulesByKey[gameModule.info.key] = gameModule;
            this.gameModulesByPhase[gameModule.phaseToInitializeBefore].push(gameModule);
            this.dependencyGraph.addModule(gameModule.info);
            if (gameModule.subModules) {
                gameModule.subModules.forEach(function (subModule) { return _this.addGameModule(subModule); });
            }
        };
        ModuleInitializer.prototype.initGameModule = function (gameModule) {
            var _this = this;
            if (this.moduleInitializationPromises[gameModule.info.key]) {
                return this.moduleInitializationPromises[gameModule.info.key];
            }
            var promise = this.initGameModuleParents(gameModule).then(function () {
                debug.log("modules", "Start initializing module \"" + gameModule.info.key + "\"");
                _this.moduleInitalizationStart[gameModule.info.key] = Date.now();
                if (gameModule.initialize) {
                    var processedModuleBundleUrl = ModuleStore_1.ModuleStore.processModuleBundleUrl(gameModule.info.moduleBundleUrl);
                    var baseUrl = new URL("./", processedModuleBundleUrl).toString();
                    return gameModule.initialize(baseUrl);
                }
                else {
                    return Promise.resolve();
                }
            }).then(function () {
                _this.finishInitializingGameModule(gameModule);
            });
            this.moduleInitializationPromises[gameModule.info.key] = promise;
            return promise;
        };
        ModuleInitializer.prototype.initGameModules = function (gameModules) {
            var _this = this;
            return Promise.all(gameModules.map(function (gameModule) {
                return _this.initGameModule(gameModule);
            }));
        };
        ModuleInitializer.prototype.initModulesForPhase = function (phase) {
            if (this.hasStartedInitializingAllModulesForPhase(phase)) {
                return Promise.all(this.getModuleInitializationPromisesForPhase(phase));
            }
            var startTime = Date.now();
            var gameModulesToInit = this.gameModulesByPhase[phase];
            debug.log("init", "Start initializing modules needed for " + GameModuleInitializationPhase_1.GameModuleInitializationPhase[phase]);
            return this.initGameModules(gameModulesToInit).then(function () {
                var timeTaken = Date.now() - startTime;
                debug.log("init", "Finish initializing modules needed for " + GameModuleInitializationPhase_1.GameModuleInitializationPhase[phase] + " in " + timeTaken + "ms");
            });
        };
        ModuleInitializer.prototype.initGameModuleParents = function (gameModule) {
            var _this = this;
            var parents = this.dependencyGraph.getImmediateParentsOf(gameModule.info.key).map(function (parentInfo) {
                return _this.gameModulesByKey[parentInfo.key];
            });
            var parentInitPromises = parents.map(function (parentModule) {
                return _this.initGameModule(parentModule);
            });
            return Promise.all(parentInitPromises);
        };
        ModuleInitializer.prototype.finishInitializingGameModule = function (gameModule) {
            this.constructGameModule(gameModule);
            var timeTaken = Date.now() - this.moduleInitalizationStart[gameModule.info.key];
            debug.log("modules", "Finish initializing module '" + gameModule.info.key + "' in " + timeTaken + "ms");
        };
        ModuleInitializer.prototype.hasStartedInitializingAllModulesForPhase = function (phase) {
            var _this = this;
            return this.gameModulesByPhase[phase].every(function (gameModule) {
                return isFinite(_this.moduleInitalizationStart[gameModule.info.key]);
            });
        };
        ModuleInitializer.prototype.getModuleInitializationPromisesForPhase = function (phase) {
            var _this = this;
            return this.gameModulesByPhase[phase].map(function (gameModule) {
                return _this.moduleInitializationPromises[gameModule.info.key];
            });
        };
        ModuleInitializer.prototype.constructGameModule = function (gameModule) {
            if (gameModule.addToModuleData) {
                gameModule.addToModuleData(this.moduleData);
            }
            this.moduleData.addGameModule(gameModule);
        };
        return ModuleInitializer;
    }());
    exports.ModuleInitializer = ModuleInitializer;
});
define("src/ModuleScripts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModuleScripts = (function () {
        function ModuleScripts() {
            this.scriptsWithData = {
                battle: {
                    battleFinish: [],
                },
                diplomacy: {
                    onWarDeclaration: [],
                    onFirstMeeting: [],
                },
                game: {
                    afterInit: [],
                    beforePlayerTurnEnd: [],
                },
                player: {
                    onDeath: [],
                },
                star: {
                    onOwnerChange: [],
                },
                unit: {
                    removeFromPlayer: [],
                    onCapture: [],
                },
            };
            this.battle = ModuleScripts.makeAccessorObject(this.scriptsWithData.battle);
            this.diplomacy = ModuleScripts.makeAccessorObject(this.scriptsWithData.diplomacy);
            this.game = ModuleScripts.makeAccessorObject(this.scriptsWithData.game);
            this.player = ModuleScripts.makeAccessorObject(this.scriptsWithData.player);
            this.star = ModuleScripts.makeAccessorObject(this.scriptsWithData.star);
            this.unit = ModuleScripts.makeAccessorObject(this.scriptsWithData.unit);
        }
        ModuleScripts.merge = function () {
            var toMerge = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                toMerge[_i] = arguments[_i];
            }
            var merged = new ModuleScripts();
            toMerge.forEach(function (moduleScripts) {
                merged.add(moduleScripts.scriptsWithData);
            });
            return merged;
        };
        ModuleScripts.sort = function (a, b) {
            return b.priority - a.priority;
        };
        ModuleScripts.makeAccessorObject = function (scriptsWithData) {
            var accessorObject = {};
            var _loop_1 = function (scriptKey) {
                Object.defineProperty(accessorObject, scriptKey, {
                    get: function () { return scriptsWithData[scriptKey].sort(ModuleScripts.sort).map(function (scriptData) { return scriptData.script; }); },
                });
            };
            for (var scriptKey in scriptsWithData) {
                _loop_1(scriptKey);
            }
            return accessorObject;
        };
        ModuleScripts.prototype.add = function () {
            var _this = this;
            var allScriptData = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                allScriptData[_i] = arguments[_i];
            }
            allScriptData.forEach(function (toAdd) {
                var _a;
                for (var category in toAdd) {
                    for (var scriptKey in toAdd[category]) {
                        (_a = _this.scriptsWithData[category][scriptKey]).push.apply(_a, toAdd[category][scriptKey]);
                    }
                }
            });
        };
        ModuleScripts.prototype.remove = function (toRemove) {
            var _loop_2 = function (category) {
                var _loop_3 = function (scriptKey) {
                    this_1.scriptsWithData[category][scriptKey] =
                        this_1.scriptsWithData[category][scriptKey].filter(function (scriptData) {
                            return toRemove[category][scriptKey].indexOf(scriptData) !== -1;
                        });
                };
                for (var scriptKey in toRemove[category]) {
                    _loop_3(scriptKey);
                }
            };
            var this_1 = this;
            for (var category in toRemove) {
                _loop_2(category);
            }
        };
        return ModuleScripts;
    }());
    exports.ModuleScripts = ModuleScripts;
});
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("src/ModuleStore", ["require", "exports", "src/versions", "src/ModuleDependencyGraph", "src/debug"], function (require, exports, semver, ModuleDependencyGraph_1, debug) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModuleStore = (function () {
        function ModuleStore() {
            this.loadedModules = {};
        }
        ModuleStore.processModuleBundleUrl = function (moduleBundleUrl) {
            var macros = {
                "{DOCUMENT_PATH}": function () {
                    var documentUrl = new URL(document.URL);
                    var path = new URL(documentUrl.pathname, documentUrl.origin).toString();
                    var pathWithoutTrailingSlash = path.replace(/\/$/, "");
                    return pathWithoutTrailingSlash;
                }
            };
            var processedUrl = moduleBundleUrl;
            for (var macroIdentifier in macros) {
                processedUrl = processedUrl.replace(macroIdentifier, macros[macroIdentifier]);
            }
            return processedUrl;
        };
        ModuleStore.prototype.add = function (toAdd) {
            var _this = this;
            var existingModuleWithSameKey = this.loadedModules[toAdd.info.key];
            if (existingModuleWithSameKey) {
                var moduleVersionToUse = this.getModuleWithPriority(existingModuleWithSameKey, toAdd.info);
                if (moduleVersionToUse !== existingModuleWithSameKey) {
                    debug.log("modules", "Replacing stored module '" + toAdd.info.key + "@" + toAdd.info.version + "' with newer version '" + existingModuleWithSameKey.version + "'");
                }
                else {
                    return;
                }
            }
            this.loadedModules[toAdd.info.key] = toAdd.info;
            if (toAdd.subModules) {
                toAdd.subModules.forEach(function (subModule) { return _this.add(subModule); });
            }
        };
        ModuleStore.prototype.getModules = function () {
            var requestedModules = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                requestedModules[_i] = arguments[_i];
            }
            var modulesToGet = this.resolveRequestedModules.apply(this, requestedModules);
            var ordered = this.getModuleLoadOrder.apply(this, modulesToGet);
            return this.requireModules.apply(this, ordered);
        };
        ModuleStore.prototype.requireModules = function () {
            var modules = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                modules[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, Promise.all(modules.map(function (moduleInfo) {
                                return _this.fetchBundle(moduleInfo);
                            }))];
                        case 1:
                            _a.sent();
                            return [2, Promise.all(modules.map(function (moduleInfo) {
                                    var promise = new Promise(function (resolve) {
                                        require([moduleInfo.moduleObjRequireJsName], function (importedModule) {
                                            var gameModule = importedModule[moduleInfo.gameModuleVariableName];
                                            _this.add(gameModule);
                                            resolve(gameModule);
                                        });
                                    });
                                    return promise;
                                }))];
                    }
                });
            });
        };
        ModuleStore.prototype.fetchBundle = function (moduleInfo) {
            var loadedModule = this.loadedModules[moduleInfo.key];
            if (loadedModule) {
                var loadedModuleHasPriority = this.getModuleWithPriority(loadedModule, moduleInfo) === loadedModule;
                if (loadedModuleHasPriority) {
                    return Promise.resolve();
                }
            }
            return this.fetchRemoteBundle(moduleInfo).catch(function (reason) {
                throw new Error("Couldn't fetch module '" + moduleInfo.key + "'.\n" + reason);
            });
        };
        ModuleStore.prototype.fetchRemoteBundle = function (moduleInfo) {
            var url = ModuleStore.processModuleBundleUrl(moduleInfo.moduleBundleUrl);
            if (url.substring(url.length - 3, url.length) !== ".js") {
                throw new Error("Module file URL must end in '.js'." +
                    (" Module '" + moduleInfo.key + "' specifies URL as " + url));
            }
            return new Promise(function (resolve, reject) {
                require([url], function (definesBundle) {
                    resolve();
                }, function (error) {
                    reject(error);
                });
            });
        };
        ModuleStore.prototype.getModuleLoadOrder = function () {
            var modules = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                modules[_i] = arguments[_i];
            }
            var dependencyGraph = new ModuleDependencyGraph_1.ModuleDependencyGraph(modules);
            return dependencyGraph.getOrderedNodes();
        };
        ModuleStore.prototype.resolveRequestedModules = function () {
            var _this = this;
            var requestedModules = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                requestedModules[_i] = arguments[_i];
            }
            var allModules = __assign({}, this.loadedModules);
            var replacements = {};
            requestedModules.forEach(function (requestedModule) {
                var storedModule = allModules[requestedModule.key];
                if (storedModule) {
                    var versionWithPriority = _this.getModuleWithPriority(storedModule, requestedModule);
                    if (versionWithPriority === storedModule) {
                        replacements[requestedModule.key] = storedModule.key;
                        debug.log("modules", "Replacing module " + requestedModule.key + "@" + requestedModule.version + " with " + storedModule.key + "@" + storedModule.version);
                    }
                }
            });
            Object.keys(allModules).forEach(function (moduleKey) {
                var moduleInfo = allModules[moduleKey];
                if (moduleInfo.modsToReplace) {
                    moduleInfo.modsToReplace.forEach(function (toBeReplacedKey) {
                        if (replacements[toBeReplacedKey]) {
                            throw new Error("Modules '" + replacements[toBeReplacedKey] + "' & '" + moduleInfo.key + "' tried to both replace module '" + toBeReplacedKey + "'");
                        }
                        replacements[toBeReplacedKey] = moduleInfo.key;
                        debug.log("modules", "Replacing module '" + toBeReplacedKey + "' with module '" + moduleInfo.key + "'");
                    });
                }
            });
            var resolved = requestedModules.map(function (moduleInfo) {
                var replacingModuleInfo = allModules[replacements[moduleInfo.key]];
                if (replacingModuleInfo) {
                    return replacingModuleInfo;
                }
                else {
                    return moduleInfo;
                }
            });
            return resolved;
        };
        ModuleStore.prototype.getModuleWithPriority = function (a, b) {
            var getModuleToReturn = function (sortResult) {
                if (sortResult > 0) {
                    return a;
                }
                else if (sortResult < 0) {
                    return b;
                }
                else {
                    throw new Error("Invalid sort result '" + sortResult + "'");
                }
            };
            if (a.key !== b.key) {
                throw new Error("Tried to compare versions with 2 different modules: " + a.key + " <=> " + b.key);
            }
            var newnessSort = semver.compare(a.version, b.version);
            if (newnessSort) {
                return getModuleToReturn(newnessSort);
            }
            return a;
        };
        return ModuleStore;
    }());
    exports.ModuleStore = ModuleStore;
    exports.activeModuleStore = new ModuleStore();
});
define("src/MouseEventHandler", ["require", "exports", "src/RectangleSelect", "src/eventManager"], function (require, exports, RectangleSelect_1, eventManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MouseButtons;
    (function (MouseButtons) {
        MouseButtons[MouseButtons["None"] = 0] = "None";
        MouseButtons[MouseButtons["Left"] = 1] = "Left";
        MouseButtons[MouseButtons["Right"] = 2] = "Right";
        MouseButtons[MouseButtons["Middle"] = 4] = "Middle";
    })(MouseButtons || (MouseButtons = {}));
    var MouseEventHandler = (function () {
        function MouseEventHandler(interactionManager, camera, selectionLayer, mainLayer) {
            this.currentActions = {
                pan: false,
                select: false,
                fleetMove: false,
            };
            this.preventMoveAndSelectForCurrentGesture = false;
            this.gestureHasStarted = false;
            this.preventingGhost = {
                hover: undefined,
            };
            this.listeners = {
                hoverStar: undefined,
                clearHover: undefined,
            };
            this.pixiCanvasListeners = {
                mousewheel: undefined,
                contextmenu: undefined,
            };
            this.interactionManager = interactionManager;
            this.camera = camera;
            this.rectangleSelect = new RectangleSelect_1.RectangleSelect(selectionLayer, mainLayer);
            this.bindEventHandlers();
            this.addEventListeners();
        }
        MouseEventHandler.getButtonChanges = function (oldButtons, newButtons) {
            return oldButtons ^ newButtons;
        };
        MouseEventHandler.getActionsInButtonChanges = function (buttonChanges) {
            return ({
                pan: Boolean(buttonChanges & MouseButtons.Middle),
                select: Boolean(buttonChanges & MouseButtons.Left),
                fleetMove: Boolean(buttonChanges & MouseButtons.Right),
            });
        };
        MouseEventHandler.prototype.destroy = function () {
            for (var name_1 in this.listeners) {
                eventManager_1.eventManager.removeEventListener(name_1, this.listeners[name_1]);
            }
            for (var name_2 in this.pixiCanvasListeners) {
                this.pixiCanvas.removeEventListener(name_2, this.pixiCanvasListeners[name_2]);
            }
            this.interactionManager.off("pointerdown", this.onPointerDown);
            this.interactionManager.off("pointerup", this.onPointerUp);
            this.interactionManager.off("pointerupoutside", this.onPointerUp);
            this.interactionManager.off("pointermove", this.onPointerChange);
            this.pixiCanvas = null;
            this.hoveredStar = null;
            this.rectangleSelect.destroy();
            this.rectangleSelect = null;
            this.interactionManager = null;
            this.camera = null;
        };
        MouseEventHandler.prototype.addEventListeners = function () {
            var _this = this;
            this.pixiCanvas = document.getElementById("pixi-canvas");
            this.pixiCanvasListeners.contextmenu = this.handleContextMenu;
            this.pixiCanvas.addEventListener("contextmenu", this.handleContextMenu);
            this.pixiCanvasListeners.mousewheel = this.handleMouseWheel;
            this.pixiCanvas.addEventListener("wheel", this.handleMouseWheel);
            this.listeners.hoverStar = eventManager_1.eventManager.addEventListener("hoverStar", function (star) {
                _this.setHoveredStar(star);
            });
            this.listeners.clearHover = eventManager_1.eventManager.addEventListener("clearHover", function () {
                _this.clearHoveredStar();
            });
            this.interactionManager.on("pointerdown", this.onPointerDown);
            this.interactionManager.on("pointerup", this.onPointerUp);
            this.interactionManager.on("pointerupoutside", this.onPointerUp);
            this.interactionManager.on("pointermove", this.onPointerChange);
        };
        MouseEventHandler.prototype.bindEventHandlers = function () {
            this.handleContextMenu = this.handleContextMenu.bind(this);
            this.handleMouseWheel = this.handleMouseWheel.bind(this);
            this.onPointerDown = this.onPointerDown.bind(this);
            this.onPointerChange = this.onPointerChange.bind(this);
            this.onPointerUp = this.onPointerUp.bind(this);
        };
        MouseEventHandler.prototype.preventGhost = function (delay, type) {
            var _this = this;
            if (this.preventingGhost[type] !== undefined) {
                window.clearTimeout(this.preventingGhost[type]);
            }
            this.preventingGhost[type] = window.setTimeout(function () {
                _this.preventingGhost[type] = undefined;
            }, delay);
        };
        MouseEventHandler.prototype.makeUITransparent = function () {
            var elementsToHide = document.getElementsByClassName("hide-when-user-interacts-with-map");
            for (var i = 0; i < elementsToHide.length; i++) {
                elementsToHide[i].classList.add("being-hidden");
            }
        };
        MouseEventHandler.prototype.makeUIOpaque = function () {
            var elementsToHide = document.getElementsByClassName("hide-when-user-interacts-with-map");
            for (var i = 0; i < elementsToHide.length; i++) {
                elementsToHide[i].classList.remove("being-hidden");
            }
        };
        MouseEventHandler.prototype.onPointerDown = function (e) {
            this.preventMoveAndSelectForCurrentGesture = false;
            this.gestureHasStarted = true;
            this.onPointerChange(e);
        };
        MouseEventHandler.prototype.onPointerChange = function (e) {
            if (!this.gestureHasStarted) {
                return;
            }
            var shouldNullifyLeftAndRightButtons = this.preventMoveAndSelectForCurrentGesture;
            var validPressedButtons = shouldNullifyLeftAndRightButtons ?
                e.data.buttons & ~MouseButtons.Left & ~MouseButtons.Right :
                e.data.buttons;
            var changedButtons = MouseEventHandler.getButtonChanges(this.pressedButtons, validPressedButtons);
            if (changedButtons) {
                this.pressedButtons = validPressedButtons;
                var changedActions = MouseEventHandler.getActionsInButtonChanges(changedButtons);
                for (var key in changedActions) {
                    if (changedActions[key]) {
                        this.handleActionChange(key, e);
                    }
                }
            }
            if (this.currentActions.pan) {
                this.handlePanMove(e);
            }
            if (this.currentActions.select) {
                this.handleSelectionMove(e);
            }
        };
        MouseEventHandler.prototype.onPointerUp = function (e) {
            this.onPointerChange(e);
            this.gestureHasStarted = false;
        };
        MouseEventHandler.prototype.handleContextMenu = function (e) {
            e.stopPropagation();
            e.preventDefault();
        };
        MouseEventHandler.prototype.handleMouseWheel = function (e) {
            this.camera.deltaZoom(e.deltaY / 40, 0.05);
            this.rectangleSelect.handleTargetLayerShift();
        };
        MouseEventHandler.prototype.setHoveredStar = function (star) {
            this.preventGhost(30, "hover");
            if (star !== this.hoveredStar) {
                this.hoveredStar = star;
                if (this.currentActions.fleetMove) {
                    this.setFleetMoveTarget(star);
                }
            }
        };
        MouseEventHandler.prototype.clearHoveredStar = function () {
            var _this = this;
            var timeout = window.setTimeout(function () {
                if (!_this.preventingGhost.hover) {
                    _this.hoveredStar = null;
                    if (_this.currentActions.fleetMove) {
                        _this.clearFleetMoveTarget();
                    }
                }
                window.clearTimeout(timeout);
            }, 15);
        };
        MouseEventHandler.prototype.handleActionChange = function (action, e) {
            switch (action) {
                case "pan":
                    {
                        if (!this.currentActions.pan) {
                            var wasFirstActionInGesture = !this.currentActions.fleetMove && !this.currentActions.select;
                            if (wasFirstActionInGesture) {
                                this.preventMoveAndSelectForCurrentGesture = true;
                            }
                            this.handlePanStart(e);
                        }
                        else {
                            this.handlePanEnd();
                        }
                        break;
                    }
                case "select":
                    {
                        if (this.currentActions.fleetMove) {
                            this.cancelCurrentAction();
                        }
                        else if (!this.currentActions.select) {
                            this.handleSelectionStart(e);
                        }
                        else {
                            this.completeSelection();
                        }
                        break;
                    }
                case "fleetMove":
                    {
                        if (this.currentActions.select) {
                            this.cancelCurrentAction();
                        }
                        else if (!this.currentActions.fleetMove) {
                            this.handleFleetMoveStart();
                        }
                        else {
                            this.completeFleetMove();
                        }
                        break;
                    }
            }
            if (this.hasActiveAction()) {
                this.makeUITransparent();
            }
            else {
                this.makeUIOpaque();
            }
        };
        MouseEventHandler.prototype.cancelCurrentAction = function () {
            if (this.currentActions.fleetMove) {
                this.handleFleetMoveStop();
            }
            if (this.currentActions.select) {
                this.handleSelectionStop();
            }
        };
        MouseEventHandler.prototype.hasActiveAction = function () {
            var _this = this;
            return Object.keys(this.currentActions).some(function (key) {
                return _this.currentActions[key];
            });
        };
        MouseEventHandler.prototype.handlePanStart = function (e) {
            this.camera.startScroll(e.data.global);
            this.currentActions.pan = true;
        };
        MouseEventHandler.prototype.handlePanMove = function (e) {
            this.camera.scrollMove(e.data.global);
            this.rectangleSelect.handleTargetLayerShift();
        };
        MouseEventHandler.prototype.handlePanEnd = function () {
            this.currentActions.pan = false;
        };
        MouseEventHandler.prototype.handleSelectionStart = function (e) {
            this.rectangleSelect.startSelection(e.data.global);
            this.currentActions.select = true;
        };
        MouseEventHandler.prototype.handleSelectionMove = function (e) {
            this.rectangleSelect.moveSelection(e.data.global);
        };
        MouseEventHandler.prototype.completeSelection = function () {
            this.rectangleSelect.endSelection();
            this.handleSelectionStop();
        };
        MouseEventHandler.prototype.handleSelectionStop = function () {
            this.rectangleSelect.clearSelection();
            this.currentActions.select = false;
            this.preventMoveAndSelectForCurrentGesture = true;
        };
        MouseEventHandler.prototype.setFleetMoveTarget = function (star) {
            eventManager_1.eventManager.dispatchEvent("setPotentialMoveTarget", star);
        };
        MouseEventHandler.prototype.clearFleetMoveTarget = function () {
            eventManager_1.eventManager.dispatchEvent("clearPotentialMoveTarget");
        };
        MouseEventHandler.prototype.handleFleetMoveStart = function () {
            eventManager_1.eventManager.dispatchEvent("startPotentialMove");
            if (this.hoveredStar) {
                this.setFleetMoveTarget(this.hoveredStar);
            }
            this.currentActions.fleetMove = true;
        };
        MouseEventHandler.prototype.completeFleetMove = function () {
            if (this.hoveredStar) {
                eventManager_1.eventManager.dispatchEvent("moveFleets", this.hoveredStar);
            }
            this.handleFleetMoveStop();
        };
        MouseEventHandler.prototype.handleFleetMoveStop = function () {
            eventManager_1.eventManager.dispatchEvent("endPotentialMove");
            this.currentActions.fleetMove = false;
            this.preventMoveAndSelectForCurrentGesture = true;
        };
        return MouseEventHandler;
    }());
    exports.MouseEventHandler = MouseEventHandler;
});
define("src/Move", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MoveCollection = (function () {
        function MoveCollection() {
            this._length = 0;
            this.moves = {};
        }
        Object.defineProperty(MoveCollection.prototype, "length", {
            get: function () {
                return this._length;
            },
            enumerable: true,
            configurable: true
        });
        MoveCollection.prototype.set = function (move, value) {
            if (!this.moves[move.userId]) {
                this.moves[move.userId] = {};
            }
            if (!this.moves[move.userId][move.targetId]) {
                this.moves[move.userId][move.targetId] = {};
            }
            if (!this.moves[move.userId][move.targetId][move.ability.type]) {
                this._length += 1;
            }
            this.moves[move.userId][move.targetId][move.ability.type] =
                {
                    value: value,
                    move: move,
                };
        };
        MoveCollection.prototype.has = function (move) {
            return Boolean(this.get(move));
        };
        MoveCollection.prototype.get = function (move) {
            if (this.moves[move.userId] &&
                this.moves[move.userId][move.targetId] &&
                this.moves[move.userId][move.targetId][move.ability.type]) {
                return this.moves[move.userId][move.targetId][move.ability.type].value;
            }
            return null;
        };
        MoveCollection.prototype.forEach = function (fn) {
            for (var userId in this.moves) {
                for (var targetId in this.moves[userId]) {
                    for (var abilityType in this.moves[userId][targetId]) {
                        var storedData = this.moves[userId][targetId][abilityType];
                        fn(storedData.value, storedData.move);
                    }
                }
            }
        };
        MoveCollection.prototype.filter = function (filterFn) {
            var filtered = new MoveCollection();
            this.forEach(function (value, move) {
                if (filterFn(value, move)) {
                    filtered.set(move, value);
                }
            });
            return filtered;
        };
        MoveCollection.prototype.flatten = function () {
            var allValues = [];
            this.forEach(function (value) {
                allValues.push(value);
            });
            return allValues;
        };
        return MoveCollection;
    }());
    exports.MoveCollection = MoveCollection;
});
define("src/Name", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Name = (function () {
        function Name(fullName, isPlural) {
            if (isPlural === void 0) { isPlural = false; }
            this.isPlural = false;
            this.hasBeenCustomized = false;
            this.fullName = fullName;
            this.isPlural = isPlural;
        }
        Name.fromData = function (data) {
            var name = new Name(data.fullName, data.isPlural);
            name.hasBeenCustomized = data.hasBeenCustomized;
            return name;
        };
        Name.prototype.setName = function (name, isPlural) {
            if (isPlural === void 0) { isPlural = false; }
            this.fullName = name;
            this.isPlural = isPlural;
        };
        Name.prototype.customizeName = function (name, isPlural) {
            if (isPlural === void 0) { isPlural = false; }
            this.hasBeenCustomized = true;
            this.setName(name, isPlural);
        };
        Name.prototype.toString = function () {
            return this.fullName;
        };
        Name.prototype.getPossessive = function () {
            var standard = this.toString();
            var lastChar = standard[standard.length - 1];
            if (lastChar.toLocaleLowerCase() === "s") {
                return standard + "'";
            }
            else {
                return standard + "'s";
            }
        };
        Name.prototype.pluralizeVerb = function (singularVerb, pluralVerb) {
            if (this.isPlural) {
                return pluralVerb;
            }
            else {
                return singularVerb;
            }
        };
        Name.prototype.pluralizeVerbWithS = function (sourceVerb) {
            if (sourceVerb.charAt(sourceVerb.length - 1) === "s") {
                return this.pluralizeVerb(sourceVerb + "s", sourceVerb);
            }
            else {
                return this.pluralizeVerb(sourceVerb, sourceVerb + "s");
            }
        };
        Name.prototype.serialize = function () {
            return ({
                fullName: this.fullName,
                isPlural: this.isPlural,
                hasBeenCustomized: this.hasBeenCustomized,
            });
        };
        return Name;
    }());
    exports.Name = Name;
});
define("src/notifications/activeNotificationStore", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function setActiveNotificationStore(store) {
        exports.activeNotificationStore = store;
    }
    exports.setActiveNotificationStore = setActiveNotificationStore;
});
define("src/notifications/Notification", ["require", "exports", "src/idGenerators"], function (require, exports, idGenerators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Notification = (function () {
        function Notification(args) {
            this.id = isFinite(args.id) ? args.id : idGenerators_1.idGenerators.notification++;
            this.template = args.template;
            this.props = args.props;
            this.turn = args.turn;
            this.involvedPlayers = args.involvedPlayers;
            this.location = args.location;
        }
        Notification.prototype.makeMessage = function () {
            return this.template.messageConstructor(this.props);
        };
        Notification.prototype.getTitle = function () {
            return this.template.getTitle(this.props);
        };
        Notification.prototype.serialize = function () {
            var data = {
                id: this.id,
                templateKey: this.template.key,
                turn: this.turn,
                involvedPlayerIds: this.involvedPlayers.map(function (player) { return player.id; }),
                locationId: this.location ? this.location.id : undefined,
                props: this.template.serializeProps(this.props),
            };
            return data;
        };
        return Notification;
    }());
    exports.Notification = Notification;
});
define("src/notifications/NotificationFilter", ["require", "exports", "localforage", "src/activeModuleData", "src/activePlayer", "src/utility", "src/notifications/NotificationFilterState", "src/storageStrings"], function (require, exports, localForage, activeModuleData_1, activePlayer_1, utility_1, NotificationFilterState_1, storageStrings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NotificationFilter = (function () {
        function NotificationFilter() {
            this.filters = {};
        }
        NotificationFilter.prototype.shouldDisplayNotification = function (notification) {
            var filterStates = this.filters[notification.template.key];
            if (filterStates.indexOf(NotificationFilterState_1.NotificationFilterState.AlwaysShow) !== -1) {
                return true;
            }
            else if (filterStates.indexOf(NotificationFilterState_1.NotificationFilterState.NeverShow) !== -1) {
                return false;
            }
            var activePlayerWasInvolved = notification.involvedPlayers.indexOf(activePlayer_1.activePlayer) !== -1;
            if (activePlayerWasInvolved) {
                return filterStates.indexOf(NotificationFilterState_1.NotificationFilterState.ShowIfInvolved) !== -1;
            }
            return false;
        };
        NotificationFilter.prototype.handleFilterStateChange = function (filterKey, state) {
            var stateIndex = this.filters[filterKey].indexOf(state);
            if (stateIndex !== -1) {
                if (this.filters[filterKey].length === 1) {
                    this.filters[filterKey] = [NotificationFilterState_1.NotificationFilterState.NeverShow];
                }
                else {
                    this.filters[filterKey].splice(stateIndex, 1);
                }
            }
            else {
                var newState = [state];
                var compatibleStates = this.getCompatibleFilterStates(state);
                for (var i = 0; i < this.filters[filterKey].length; i++) {
                    if (compatibleStates.indexOf(this.filters[filterKey][i]) !== -1) {
                        newState.push(this.filters[filterKey][i]);
                    }
                }
                this.filters[filterKey] = newState;
            }
        };
        NotificationFilter.prototype.getFiltersByCategory = function () {
            var filtersByCategory = {};
            var notifications = activeModuleData_1.activeModuleData.templates.Notifications;
            for (var key in this.filters) {
                var notificationTemplate = notifications[key];
                if (notificationTemplate) {
                    if (!filtersByCategory[notificationTemplate.category]) {
                        filtersByCategory[notificationTemplate.category] = [];
                    }
                    filtersByCategory[notificationTemplate.category].push({
                        notificationTemplate: notificationTemplate,
                        filterState: this.filters[key],
                    });
                }
            }
            return filtersByCategory;
        };
        NotificationFilter.prototype.setDefaultFilterStatesForCategory = function (category) {
            var byCategory = this.getFiltersByCategory();
            var forSelectedCategory = byCategory[category];
            for (var i = 0; i < forSelectedCategory.length; i++) {
                var template = forSelectedCategory[i].notificationTemplate;
                this.filters[template.key] = template.defaultFilterState.slice(0);
            }
        };
        NotificationFilter.prototype.save = function () {
            var data = JSON.stringify({
                filters: this.filters,
                date: new Date(),
            });
            return localForage.setItem(storageStrings_1.storageStrings.notificationFilter, data);
        };
        NotificationFilter.prototype.load = function () {
            var _this = this;
            this.setDefaultFilterStates();
            return localForage.getItem(storageStrings_1.storageStrings.notificationFilter).then(function (savedData) {
                var parsedData = JSON.parse(savedData);
                if (parsedData) {
                    _this.filters = utility_1.extendObject(parsedData.filters, _this.filters, false);
                }
            });
        };
        NotificationFilter.prototype.setDefaultFilterStates = function () {
            var notifications = activeModuleData_1.activeModuleData.templates.Notifications;
            for (var key in notifications) {
                var notificationTemplate = notifications[key];
                this.filters[key] = notificationTemplate.defaultFilterState.slice(0);
            }
        };
        NotificationFilter.prototype.getCompatibleFilterStates = function (filterState) {
            switch (filterState) {
                case NotificationFilterState_1.NotificationFilterState.AlwaysShow:
                    {
                        return [];
                    }
                case NotificationFilterState_1.NotificationFilterState.ShowIfInvolved:
                    {
                        return [];
                    }
                case NotificationFilterState_1.NotificationFilterState.NeverShow:
                    {
                        return [];
                    }
            }
        };
        return NotificationFilter;
    }());
    exports.NotificationFilter = NotificationFilter;
    exports.activeNotificationFilter = new NotificationFilter();
});
define("src/notifications/NotificationFilterState", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NotificationFilterState;
    (function (NotificationFilterState) {
        NotificationFilterState[NotificationFilterState["AlwaysShow"] = 0] = "AlwaysShow";
        NotificationFilterState[NotificationFilterState["ShowIfInvolved"] = 1] = "ShowIfInvolved";
        NotificationFilterState[NotificationFilterState["NeverShow"] = 2] = "NeverShow";
    })(NotificationFilterState = exports.NotificationFilterState || (exports.NotificationFilterState = {}));
});
define("src/notifications/NotificationStore", ["require", "exports", "src/notifications/Notification"], function (require, exports, Notification_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NotificationStore = (function () {
        function NotificationStore() {
            this.onNewNotification = [];
            this.notificationsById = {};
        }
        NotificationStore.prototype.makeNotification = function (args) {
            var notification = new Notification_1.Notification({
                id: undefined,
                template: args.template,
                props: args.props,
                involvedPlayers: args.involvedPlayers,
                location: args.location,
                turn: this.currentTurn,
            });
            this.notificationsById[notification.id] = notification;
            this.onNewNotification.forEach(function (listenerFN) {
                listenerFN(notification);
            });
        };
        NotificationStore.prototype.serialize = function () {
            var _this = this;
            return ({
                notifications: Object.keys(this.notificationsById).map(function (id) {
                    return _this.notificationsById[id].serialize();
                }),
            });
        };
        return NotificationStore;
    }());
    exports.NotificationStore = NotificationStore;
});
define("src/notifications/NotificationSubscriber", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NotificationSubscriber = (function () {
        function NotificationSubscriber(notificationIsRelevantFilter) {
            this.allReceivedNotifications = [];
            this.unreadNotifications = [];
            this.notificationIsRelevantFilter = notificationIsRelevantFilter;
            this.receiveNotificationIfNeeded = this.receiveNotificationIfNeeded.bind(this);
        }
        NotificationSubscriber.prototype.registerToNotificationStore = function (store) {
            store.onNewNotification.push(this.receiveNotificationIfNeeded);
        };
        NotificationSubscriber.prototype.markNotificationAsRead = function (notification) {
            this.unreadNotifications.splice(this.unreadNotifications.indexOf(notification), 1);
        };
        NotificationSubscriber.prototype.serialize = function () {
            return ({
                allReceivedNotificationIds: this.allReceivedNotifications.map(function (notification) { return notification.id; }),
                unreadNotificationIds: this.unreadNotifications.map(function (notification) { return notification.id; }),
            });
        };
        NotificationSubscriber.prototype.receiveNotificationIfNeeded = function (notification) {
            var shouldReceiveNotification = this.notificationIsRelevantFilter(notification);
            if (!shouldReceiveNotification) {
                return;
            }
            this.allReceivedNotifications.push(notification);
            this.unreadNotifications.push(notification);
        };
        return NotificationSubscriber;
    }());
    exports.NotificationSubscriber = NotificationSubscriber;
});
define("src/notifications/NotificationWitnessCriterion", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NotificationWitnessCriterion;
    (function (NotificationWitnessCriterion) {
        NotificationWitnessCriterion[NotificationWitnessCriterion["Always"] = 0] = "Always";
        NotificationWitnessCriterion[NotificationWitnessCriterion["IsInvolved"] = 1] = "IsInvolved";
        NotificationWitnessCriterion[NotificationWitnessCriterion["MetOneInvolvedPlayer"] = 2] = "MetOneInvolvedPlayer";
        NotificationWitnessCriterion[NotificationWitnessCriterion["MetAllInvolvedPlayers"] = 3] = "MetAllInvolvedPlayers";
        NotificationWitnessCriterion[NotificationWitnessCriterion["LocationIsRevealed"] = 4] = "LocationIsRevealed";
        NotificationWitnessCriterion[NotificationWitnessCriterion["LocationIsVisible"] = 5] = "LocationIsVisible";
        NotificationWitnessCriterion[NotificationWitnessCriterion["LocationIsDetected"] = 6] = "LocationIsDetected";
    })(NotificationWitnessCriterion = exports.NotificationWitnessCriterion || (exports.NotificationWitnessCriterion = {}));
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
define("src/notifications/PlayerNotificationSubscriber", ["require", "exports", "src/notifications/NotificationSubscriber", "src/notifications/NotificationWitnessCriterion"], function (require, exports, NotificationSubscriber_1, NotificationWitnessCriterion_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function witnessCriterionIsSatisfied(witnessingPlayer, criterion, involvedPlayers, location) {
        switch (criterion) {
            case NotificationWitnessCriterion_1.NotificationWitnessCriterion.Always:
                {
                    return true;
                }
            case NotificationWitnessCriterion_1.NotificationWitnessCriterion.IsInvolved:
                {
                    return involvedPlayers.some(function (involvedPlayer) { return witnessingPlayer === involvedPlayer; });
                }
            case NotificationWitnessCriterion_1.NotificationWitnessCriterion.MetOneInvolvedPlayer:
                {
                    return involvedPlayers.some(function (involvedPlayer) { return witnessingPlayer.diplomacy.hasMetPlayer(involvedPlayer); });
                }
            case NotificationWitnessCriterion_1.NotificationWitnessCriterion.MetAllInvolvedPlayers:
                {
                    return involvedPlayers.every(function (involvedPlayer) { return witnessingPlayer.diplomacy.hasMetPlayer(involvedPlayer); });
                }
            case NotificationWitnessCriterion_1.NotificationWitnessCriterion.LocationIsRevealed:
                {
                    return witnessingPlayer.starIsRevealed(location);
                }
            case NotificationWitnessCriterion_1.NotificationWitnessCriterion.LocationIsVisible:
                {
                    return witnessingPlayer.starIsVisible(location);
                }
            case NotificationWitnessCriterion_1.NotificationWitnessCriterion.LocationIsDetected:
                {
                    return witnessingPlayer.starIsDetected(location);
                }
        }
    }
    function playerDidWitnessEvent(player, notification) {
        var witnessCriteria = notification.template.witnessCriteria;
        var oneCriteriaGroupIsSatisfied = witnessCriteria.some(function (criteriaGroup) {
            var allCriteriaInGroupAreSatisfied = criteriaGroup.every(function (criterion) {
                return witnessCriterionIsSatisfied(player, criterion, notification.involvedPlayers, notification.location);
            });
            return allCriteriaInGroupAreSatisfied;
        });
        return oneCriteriaGroupIsSatisfied;
    }
    var PlayerNotificationSubscriber = (function (_super) {
        __extends(PlayerNotificationSubscriber, _super);
        function PlayerNotificationSubscriber(player) {
            return _super.call(this, playerDidWitnessEvent.bind(null, player)) || this;
        }
        return PlayerNotificationSubscriber;
    }(NotificationSubscriber_1.NotificationSubscriber));
    exports.PlayerNotificationSubscriber = PlayerNotificationSubscriber;
});
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("src/Options", ["require", "exports", "localforage", "src/eventManager", "src/utility", "src/App", "src/reviveSaveData", "src/activeModuleData", "src/storageStrings", "src/debug"], function (require, exports, localForage, eventManager_1, utility_1, App_1, reviveSaveData_1, activeModuleData_1, storageStrings_1, debug) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var optionsCategories = [
        "battle", "debug", "display", "system",
    ];
    var defaultOptionsValues = {
        battle: {
            animationTiming: {
                before: 750,
                effectDuration: 1,
                after: 1500,
                unitEnter: 200,
                unitExit: 100,
                turnTransition: 500,
            },
        },
        debug: {
            enabled: false,
            aiVsPlayerBattleSimulationDepth: 1000,
            aiVsAiBattleSimulationDepth: 20,
            logging: {
                ai: false,
                graphics: false,
                saves: true,
                modules: true,
                init: true,
            },
        },
        display: {
            language: undefined,
            noHamburger: false,
        },
        system: {
            errorReporting: "alertOnce",
        },
    };
    var Options = (function () {
        function Options() {
        }
        Options.prototype.setDefaultForCategory = function (category) {
            var shouldReRenderUI = false;
            var shouldReRenderMap = false;
            switch (category) {
                case "battle":
                    {
                        this.battle = utility_1.extendObject(defaultOptionsValues.battle);
                        break;
                    }
                case "battle.animationTiming":
                    {
                        this.battle.animationTiming = utility_1.extendObject(defaultOptionsValues.battle.animationTiming);
                        break;
                    }
                case "debug":
                    {
                        this.debug = utility_1.extendObject(defaultOptionsValues.debug);
                        if (this.debug.enabled !== defaultOptionsValues.debug.enabled) {
                            shouldReRenderUI = true;
                            shouldReRenderMap = true;
                        }
                        break;
                    }
                case "debug.logging":
                    {
                        this.debug.logging = utility_1.extendObject(defaultOptionsValues.debug.logging);
                        break;
                    }
                case "display":
                    {
                        var previouslySetLanguage = this.display ? this.display.language : undefined;
                        this.display = utility_1.extendObject(defaultOptionsValues.display);
                        this.display.language = previouslySetLanguage;
                        if (!this.display.language) {
                            this.display.language = activeModuleData_1.activeModuleData.getDefaultLanguage();
                        }
                        if (this.display.noHamburger !== defaultOptionsValues.display.noHamburger) {
                            shouldReRenderUI = true;
                        }
                        break;
                    }
                case "system":
                    {
                        this.system = utility_1.extendObject(defaultOptionsValues.system);
                    }
            }
            if (shouldReRenderUI) {
                eventManager_1.eventManager.dispatchEvent("renderUI");
            }
            if (shouldReRenderMap) {
                eventManager_1.eventManager.dispatchEvent("renderMap");
            }
        };
        Options.prototype.setDefaults = function () {
            var _this = this;
            optionsCategories.forEach(function (category) {
                _this.setDefaultForCategory(category);
            });
        };
        Options.prototype.save = function () {
            var data = {
                options: this.serialize(),
                date: new Date().toISOString(),
                appVersion: App_1.app.version,
            };
            return localForage.setItem(storageStrings_1.storageStrings.options, JSON.stringify(data));
        };
        Options.prototype.load = function () {
            var _this = this;
            debug.log("init", "Start loading options");
            this.setDefaults();
            return localForage.getItem(storageStrings_1.storageStrings.options).then(function (savedData) {
                var parsedData = JSON.parse(savedData);
                if (parsedData) {
                    var revivedData = _this.reviveOptionsSaveData(parsedData);
                    _this.deserialize(revivedData.options);
                }
                debug.log("init", "Finish loading options");
            });
        };
        Options.prototype.serialize = function () {
            return ({
                battle: this.battle,
                debug: this.debug,
                display: {
                    languageCode: this.display.language.code,
                    noHamburger: this.display.noHamburger,
                },
                system: this.system,
            });
        };
        Options.prototype.deserialize = function (data) {
            this.battle = utility_1.deepMerge(this.battle, data.battle, true);
            this.debug = utility_1.deepMerge(this.debug, data.debug, true);
            this.display =
                {
                    language: activeModuleData_1.activeModuleData.fetchLanguageForCode(data.display.languageCode),
                    noHamburger: data.display.noHamburger,
                };
            this.system = utility_1.deepMerge(this.system, data.system, true);
        };
        Options.prototype.reviveOptionsSaveData = function (toRevive) {
            var revived = __assign({}, toRevive);
            var reviversByOptionsVersion = {
                "0.0.0": [
                    function (data) {
                        data.appVersion = "0.0.0";
                    },
                    function (data) {
                        data.options.battle = {};
                        data.options.battle.animationTiming = __assign({}, data.options.battleAnimationTiming);
                        delete data.options.battleAnimationTiming;
                        data.options.display.noHamburger = data.options.ui.noHamburger;
                        delete data.options.ui;
                        delete data.options.display.borderWidth;
                        data.options.system = {};
                    }
                ],
            };
            var reviversToExecute = reviveSaveData_1.fetchNeededReviversForData(revived.appVersion, App_1.app.version, reviversByOptionsVersion);
            reviversToExecute.forEach(function (reviverFN) {
                debug.log("saves", "Executing stored options reviver function '" + utility_1.getFunctionName(reviverFN) + "'");
                reviverFN(revived);
            });
            return revived;
        };
        return Options;
    }());
    exports.options = new Options();
});
define("src/pathFinding", ["require", "exports", "src/PriorityQueue"], function (require, exports, PriorityQueue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function backTrace(graph, target) {
        var parent = graph[target.id];
        if (!parent) {
            return [];
        }
        var path = [
            {
                star: target,
                cost: parent.cost,
            },
        ];
        while (parent) {
            path.push({
                star: parent.star,
                cost: parent.cost,
            });
            parent = graph[parent.star.id];
        }
        path.reverse();
        path[0].cost = null;
        return path;
    }
    exports.backTrace = backTrace;
    function aStar(start, target) {
        var frontier = new PriorityQueue_1.PriorityQueue();
        frontier.push(0, start);
        var cameFrom = {};
        var costSoFar = {};
        cameFrom[start.id] = null;
        costSoFar[start.id] = 0;
        while (!frontier.isEmpty()) {
            var current = frontier.pop();
            if (current === target) {
                return { came: cameFrom, cost: costSoFar };
            }
            var neighbors = current.getAllLinks();
            for (var i = 0; i < neighbors.length; i++) {
                var neigh = neighbors[i];
                if (!neigh) {
                    continue;
                }
                var moveCost = 1;
                var newCost = costSoFar[current.id] + moveCost;
                if (costSoFar[neigh.id] === undefined || newCost < costSoFar[neigh.id]) {
                    costSoFar[neigh.id] = newCost;
                    var priority = newCost;
                    frontier.push(priority, neigh);
                    cameFrom[neigh.id] =
                        {
                            star: current,
                            cost: moveCost,
                        };
                }
            }
        }
        return null;
    }
    exports.aStar = aStar;
});
define("src/PathfindingArrow", ["require", "exports", "pixi.js", "src/App", "src/Color", "src/eventManager"], function (require, exports, PIXI, App_1, Color_1, eventManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PathfindingArrow = (function () {
        function PathfindingArrow(parentContainer) {
            this.selectedFleets = [];
            this.labelCache = {};
            this.listeners = {};
            this.curveStyles = {
                reachable: {
                    color: Color_1.Color.fromHex(0xFFFFF0),
                },
                unreachable: {
                    color: Color_1.Color.fromHex(0xFF0000),
                },
            };
            this.parentContainer = parentContainer;
            this.container = new PIXI.Container();
            this.parentContainer.addChild(this.container);
            this.addEventListeners();
        }
        PathfindingArrow.prototype.destroy = function () {
            this.active = false;
            this.removeEventListeners();
            this.parentContainer = null;
            this.container = null;
            this.currentTarget = null;
            window.clearTimeout(this.clearTargetTimeout);
            this.selectedFleets = null;
            this.labelCache = null;
        };
        PathfindingArrow.prototype.removeEventListener = function (name) {
            eventManager_1.eventManager.removeEventListener(name, this.listeners[name]);
        };
        PathfindingArrow.prototype.removeEventListeners = function () {
            for (var name_1 in this.listeners) {
                this.removeEventListener(name_1);
            }
        };
        PathfindingArrow.prototype.addEventListener = function (name, handler) {
            this.listeners[name] = handler;
            eventManager_1.eventManager.addEventListener(name, handler);
        };
        PathfindingArrow.prototype.addEventListeners = function () {
            var _this = this;
            this.addEventListener("startPotentialMove", function () {
                _this.startMove();
            });
            this.addEventListener("setPotentialMoveTarget", function (star) {
                _this.setTarget(star);
            });
            this.addEventListener("clearPotentialMoveTarget", function () {
                _this.clearTarget();
            });
            this.addEventListener("endPotentialMove", function () {
                _this.endMove();
            });
        };
        PathfindingArrow.prototype.startMove = function () {
            var fleets = App_1.app.playerControl.selectedFleets;
            if (this.active || !fleets || fleets.length < 1) {
                return;
            }
            this.active = true;
            this.currentTarget = null;
            this.selectedFleets = fleets;
            this.clearArrows();
        };
        PathfindingArrow.prototype.setTarget = function (star) {
            if (!this.active) {
                return;
            }
            if (this.clearTargetTimeout) {
                window.clearTimeout(this.clearTargetTimeout);
            }
            this.currentTarget = star;
            window.setTimeout(this.drawAllCurrentCurves.bind(this), 10);
        };
        PathfindingArrow.prototype.clearTarget = function () {
            var _this = this;
            if (!this.active) {
                return;
            }
            if (this.clearTargetTimeout) {
                window.clearTimeout(this.clearTargetTimeout);
            }
            this.clearTargetTimeout = window.setTimeout(function () {
                _this.currentTarget = null;
                _this.clearArrows();
                _this.clearTargetTimeout = null;
            }, 10);
        };
        PathfindingArrow.prototype.endMove = function () {
            this.active = false;
            this.currentTarget = null;
            this.selectedFleets = [];
            this.clearArrows();
        };
        PathfindingArrow.prototype.clearArrows = function () {
            this.container.removeChildren();
        };
        PathfindingArrow.prototype.makeLabel = function (style, distance) {
            var textStyle;
            switch (style) {
                case "reachable":
                    {
                        textStyle =
                            {
                                fill: 0xFFFFF0,
                            };
                        break;
                    }
                case "unreachable":
                    {
                        textStyle =
                            {
                                fill: 0xFF0000,
                            };
                        break;
                    }
            }
            if (!this.labelCache[style]) {
                this.labelCache[style] = {};
            }
            this.labelCache[style][distance] = new PIXI.Text("" + distance, textStyle);
        };
        PathfindingArrow.prototype.getLabel = function (style, distance) {
            if (!this.labelCache[style] || !this.labelCache[style][distance]) {
                this.makeLabel(style, distance);
            }
            return this.labelCache[style][distance];
        };
        PathfindingArrow.prototype.getAllCurrentPaths = function () {
            var paths = [];
            for (var i = 0; i < this.selectedFleets.length; i++) {
                var fleet = this.selectedFleets[i];
                if (fleet.location.id === this.currentTarget.id) {
                    continue;
                }
                var path = fleet.getPathTo(this.currentTarget);
                paths.push({
                    fleet: fleet,
                    path: path,
                });
            }
            return paths;
        };
        PathfindingArrow.prototype.getAllCurrentCurves = function () {
            var paths = this.getAllCurrentPaths();
            var curves = [];
            var totalPathsPerStar = {};
            var alreadyVisitedPathsPerStar = {};
            for (var i = 0; i < paths.length; i++) {
                for (var j = 0; j < paths[i].path.length; j++) {
                    var star = paths[i].path[j].star;
                    if (!totalPathsPerStar[star.id]) {
                        totalPathsPerStar[star.id] = 0;
                        alreadyVisitedPathsPerStar[star.id] = 0;
                    }
                    totalPathsPerStar[star.id]++;
                }
            }
            for (var i = 0; i < paths.length; i++) {
                var fleet = paths[i].fleet;
                var path = paths[i].path;
                var distance = path.length - 1;
                var currentMovePoints = fleet.getMinCurrentMovePoints();
                var canReach = currentMovePoints >= distance;
                var style = canReach ? "reachable" : "unreachable";
                var curvePoints = [];
                for (var j = path.length - 1; j >= 0; j--) {
                    var star = path[j].star;
                    var sourceStar = j < path.length - 1 ? path[j + 1].star : null;
                    if (totalPathsPerStar[star.id] > 1 && star !== this.currentTarget) {
                        var visits = ++alreadyVisitedPathsPerStar[star.id];
                        curvePoints.unshift(this.getTargetOffset(star, sourceStar, visits, totalPathsPerStar[star.id], 12));
                    }
                    else {
                        curvePoints.unshift(star);
                    }
                }
                var segments = this.getSplineThroughPoints(curvePoints);
                curves.push({
                    style: style,
                    segments: segments
                });
            }
            return curves;
        };
        PathfindingArrow.prototype.drawAllCurrentCurves = function () {
            this.clearArrows();
            var curves = this.getAllCurrentCurves();
            for (var i = 0; i < curves.length; i++) {
                var curve = this.drawCurve(curves[i].segments, this.curveStyles[curves[i].style]);
                this.container.addChild(curve);
            }
        };
        PathfindingArrow.prototype.getSplineThroughPoints = function (points) {
            var i6 = 1.0 / 6.0;
            var segments = [];
            var startPoint = points[0];
            var endPoint = points[points.length - 1];
            var path = [startPoint].concat(points, [endPoint]);
            for (var i = 3; i < path.length; i++) {
                var p0 = path[i - 3];
                var p1 = path[i - 2];
                var p2 = path[i - 1];
                var p3 = path[i];
                segments.push([
                    p2.x * i6 + p1.x - p0.x * i6,
                    p2.y * i6 + p1.y - p0.y * i6,
                    p3.x * -i6 + p2.x + p1.x * i6,
                    p3.y * -i6 + p2.y + p1.y * i6,
                    p2.x,
                    p2.y,
                ]);
            }
            segments[0][0] = points[0].x;
            segments[0][1] = points[0].y;
            return segments;
        };
        PathfindingArrow.prototype.drawCurve = function (segments, style) {
            var gfx = new PIXI.Graphics();
            gfx.lineStyle(12, style.color.getHex(), 0.7);
            gfx.moveTo(segments[0][0], segments[0][1]);
            for (var i = 0; i < segments.length; i++) {
                gfx.bezierCurveTo.apply(gfx, segments[i]);
            }
            this.drawArrowHead(gfx, style.color.getHex());
            return gfx;
        };
        PathfindingArrow.prototype.drawArrowHead = function (gfx, color) {
            var points = gfx.currentPath.points;
            var x1 = points[points.length - 12];
            var y1 = points[points.length - 11];
            var x2 = points[points.length - 2];
            var y2 = points[points.length - 1];
            var lineAngle = Math.atan2(y2 - y1, x2 - x1);
            var headLength = 30;
            var buttAngle = 27 * (Math.PI / 180);
            var hypotenuseLength = Math.abs(headLength / Math.cos(buttAngle));
            var angle1 = lineAngle + Math.PI + buttAngle;
            var topX = x2 + Math.cos(angle1) * hypotenuseLength;
            var topY = y2 + Math.sin(angle1) * hypotenuseLength;
            var angle2 = lineAngle + Math.PI - buttAngle;
            var botX = x2 + Math.cos(angle2) * hypotenuseLength;
            var botY = y2 + Math.sin(angle2) * hypotenuseLength;
            gfx.lineStyle(null);
            gfx.moveTo(x2, y2);
            gfx.beginFill(color, 0.7);
            gfx.lineTo(topX, topY);
            gfx.lineTo(botX, botY);
            gfx.lineTo(x2, y2);
            gfx.endFill();
            var buttMidX = x2 + Math.cos(lineAngle + Math.PI) * headLength;
            var buttMidY = y2 + Math.sin(lineAngle + Math.PI) * headLength;
            for (var i = points.length - 1; i >= 0; i -= 2) {
                var y = points[i];
                var x = points[i - 1];
                var distance = Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2));
                if (distance >= headLength + 10) {
                    points.push(buttMidX);
                    points.push(buttMidY);
                    break;
                }
                else {
                    points.pop();
                    points.pop();
                }
            }
        };
        PathfindingArrow.prototype.getTargetOffset = function (target, sourcePoint, i, totalPaths, offsetPerOrbit) {
            var maxPerOrbit = 6;
            var currentOrbit = Math.ceil(i / maxPerOrbit);
            var isOuterOrbit = currentOrbit > Math.floor(totalPaths / maxPerOrbit);
            var pathsInCurrentOrbit = isOuterOrbit ? totalPaths % maxPerOrbit : maxPerOrbit;
            var positionInOrbit = (i - 1) % pathsInCurrentOrbit;
            var distance = currentOrbit * offsetPerOrbit;
            var angle = (Math.PI * 2 / pathsInCurrentOrbit) * positionInOrbit;
            if (sourcePoint) {
                var dx = sourcePoint.x - target.x;
                var dy = sourcePoint.y - target.y;
                var approachAngle = Math.atan2(dy, dx);
                angle += approachAngle;
            }
            var x = Math.sin(angle) * distance;
            var y = Math.cos(angle) * distance;
            return ({
                x: target.x + x,
                y: target.y - y,
            });
        };
        return PathfindingArrow;
    }());
    exports.PathfindingArrow = PathfindingArrow;
});
define("src/pixiWrapperFunctions", ["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dummyShaderTexture = (function () {
        var canvas = document.createElement("canvas");
        canvas._pixiId = "dummyShaderTexture";
        canvas.width = 1;
        canvas.height = 1;
        return PIXI.Texture.from(canvas);
    })();
    function makeShaderSprite(shader, x, y, width, height) {
        shader.uniforms["uSampler"] = exports.dummyShaderTexture;
        var geometry = new PIXI.Quad;
        geometry.addAttribute("aTextureCoord", [0, 0, 1, 0, 1, 1, 0, 1], 2);
        geometry.addIndex([0, 1, 2, 0, 2, 3]);
        var mesh = new PIXI.Mesh(geometry, shader);
        if (isFinite(x)) {
            mesh.position.set(x, y);
            mesh.width = width;
            mesh.height = height;
        }
        return mesh;
    }
    exports.makeShaderSprite = makeShaderSprite;
    function makeCenteredShaderSprite(shader) {
        var mesh = makeShaderSprite(shader);
        mesh.geometry.addAttribute("aVertexPosition", [
            -0.5, -0.5,
            0.5, -0.5,
            0.5, 0.5,
            -0.5, 0.5,
        ]);
        return mesh;
    }
    exports.makeCenteredShaderSprite = makeCenteredShaderSprite;
    function convertClientRectToPixiRect(rect) {
        return new PIXI.Rectangle(rect.left, rect.top, rect.width, rect.height);
    }
    exports.convertClientRectToPixiRect = convertClientRectToPixiRect;
    function generateTextureWithBounds(renderer, displayObject, scaleMode, resolution, customBounds) {
        var bounds = customBounds;
        var renderTexture = PIXI.RenderTexture.create({
            width: bounds.width || 0,
            height: bounds.height || 0,
            scaleMode: scaleMode,
            resolution: resolution,
        });
        var tempMatrix = new PIXI.Matrix();
        tempMatrix.tx = -bounds.x;
        tempMatrix.ty = -bounds.y;
        renderer.render(displayObject, renderTexture, false, tempMatrix, false);
        return renderTexture;
    }
    exports.generateTextureWithBounds = generateTextureWithBounds;
    function makePolygonFromPoints(points) {
        var pointPositions = [];
        points.forEach(function (point) {
            pointPositions.push(point.x, point.y);
        });
        return new PIXI.Polygon(pointPositions);
    }
    exports.makePolygonFromPoints = makePolygonFromPoints;
    function isSprite(displayObject) {
        return displayObject.isSprite;
    }
    function copyTransform(source, target) {
        target.setTransform(source.position.x, source.position.y, source.scale.x, source.scale.y, source.rotation, source.skew.x, source.skew.y, source.pivot.x, source.pivot.y);
    }
    exports.copyTransform = copyTransform;
    function cloneMesh(mesh) {
        return new PIXI.Mesh(mesh.geometry, mesh.shader, mesh.state, mesh.drawMode);
    }
    exports.cloneMesh = cloneMesh;
    function cloneSprite(sprite) {
        return new PIXI.Sprite(sprite.texture);
    }
    exports.cloneSprite = cloneSprite;
    function cloneDisplayObject(displayObject) {
        if (isSprite(displayObject)) {
            var cloned = cloneSprite(displayObject);
            copyTransform(displayObject, cloned);
            return cloned;
        }
        else if (displayObject instanceof PIXI.Mesh) {
            var cloned = cloneMesh(displayObject);
            copyTransform(displayObject, cloned);
            return cloned;
        }
        else if (displayObject instanceof PIXI.Graphics) {
            var cloned = displayObject.clone();
            copyTransform(displayObject, cloned);
            return cloned;
        }
        else {
            throw new Error();
        }
    }
    exports.cloneDisplayObject = cloneDisplayObject;
    function extractImageData(target, extract) {
        var wrappingContainer = new PIXI.Container;
        wrappingContainer.addChild(target);
        var pixels = extract.pixels(wrappingContainer);
        var bounds = target.getBounds();
        var clampedPixelsArray = Uint8ClampedArray.from(pixels);
        return new ImageData(clampedPixelsArray, bounds.width, bounds.height);
    }
    exports.extractImageData = extractImageData;
});
define("src/Player", ["require", "exports", "src/AiController", "src/App", "src/BattlePrep", "src/BattleSimulator", "src/Flag", "src/Name", "src/Options", "src/PlayerTechnology", "src/ValuesByStar", "src/activeModuleData", "src/colorGeneration", "src/eventManager", "src/idGenerators", "src/utility", "src/Building"], function (require, exports, AiController_1, App_1, BattlePrep_1, BattleSimulator_1, Flag_1, Name_1, Options_1, PlayerTechnology_1, ValuesByStar_1, activeModuleData_1, colorGeneration_1, eventManager_1, idGenerators_1, utility_1, Building_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Player = (function () {
        function Player(props) {
            this.units = [];
            this.resources = {};
            this.fleets = [];
            this.items = [];
            this.isAi = false;
            this.isIndependent = false;
            this.isDead = false;
            this.controlledLocations = [];
            this.visionIsDirty = true;
            this.visibleStars = {};
            this.revealedStars = {};
            this.detectedStars = {};
            this.identifiedUnits = {};
            this.tempOverflowedResearchAmount = 0;
            this.listeners = {};
            this.isAi = props.isAi;
            this.isIndependent = props.isIndependent;
            this.isDead = props.isDead || false;
            this.race = props.race;
            this.money = props.money;
            this.id = isFinite(props.id) ? props.id : idGenerators_1.idGenerators.player++;
            if (props.name) {
                if (typeof props.name === "string") {
                    var castedStringName = props.name;
                    this.name = new Name_1.Name(castedStringName);
                }
                else {
                    var castedName = props.name;
                    this.name = castedName;
                }
            }
            else {
                this.name = new Name_1.Name("Player " + this.id);
            }
            if (props.color) {
                this.color = props.color.main;
                this.secondaryColor = props.color.secondary || colorGeneration_1.generateSecondaryColor(this.color);
                this.colorAlpha = isFinite(props.color.alpha) ? props.color.alpha : 1;
            }
            else {
                var colorScheme = colorGeneration_1.generateColorScheme();
                this.color = colorScheme.main;
                this.secondaryColor = colorScheme.secondary;
                this.colorAlpha = 1;
            }
            if (props.flag) {
                this.flag = props.flag;
            }
            else {
                this.flag = this.makeRandomFlag();
            }
            if (props.resources) {
                this.resources = utility_1.extendObject(props.resources);
            }
            if (!this.isIndependent) {
                if (this.race.isNotPlayable) {
                    console.warn("Race " + this.race.displayName + " is marked as unplayable, but was assigned to player " + this.name);
                }
                this.initTechnologies(props.technologyData);
            }
        }
        Object.defineProperty(Player.prototype, "money", {
            get: function () {
                return this._money;
            },
            set: function (amount) {
                this._money = amount;
                if (!this.isAi) {
                    eventManager_1.eventManager.dispatchEvent("playerMoneyUpdated");
                }
            },
            enumerable: true,
            configurable: true
        });
        Player.createDummyPlayer = function () {
            return new Player({
                isAi: false,
                isIndependent: false,
                id: -9999,
                name: "Dummy",
                race: {
                    type: null,
                    displayName: null,
                    description: null,
                    technologies: [],
                    distributionData: {
                        weight: 0,
                        distributionGroups: [],
                    },
                    getBuildableBuildings: function () { return []; },
                    getBuildableUnits: function () { return []; },
                    getBuildableItems: function () { return []; },
                    getUnitName: function () { return ""; },
                    getUnitPortrait: function () { return null; },
                    generateIndependentPlayer: function () { return null; },
                    generateIndependentFleets: function () { return null; },
                    getAiTemplateConstructor: function () { return null; },
                },
                money: 0,
            });
        };
        Player.prototype.destroy = function () {
            if (this.diplomacy) {
                this.diplomacy.destroy();
                this.diplomacy = null;
            }
            this.aiController = null;
            for (var key in this.listeners) {
                eventManager_1.eventManager.removeEventListener(key, this.listeners[key]);
            }
        };
        Player.prototype.shouldDie = function () {
            return this.controlledLocations.length === 0;
        };
        Player.prototype.die = function () {
            var _this = this;
            this.isDead = true;
            for (var i = this.fleets.length - 1; i >= 0; i--) {
                this.fleets[i].deleteFleet(false);
            }
            activeModuleData_1.activeModuleData.scripts.player.onDeath.forEach(function (script) {
                script(_this);
            });
        };
        Player.prototype.initTechnologies = function (savedData) {
            var race = this.race;
            this.playerTechnology = new PlayerTechnology_1.PlayerTechnology(this.getResearchSpeed.bind(this), race.technologies, savedData);
            this.listeners["builtBuildingWithEffect_research"] = eventManager_1.eventManager.addEventListener("builtBuildingWithEffect_research", this.playerTechnology.capTechnologyPrioritiesToMaxNeeded.bind(this.playerTechnology));
        };
        Player.prototype.makeRandomFlag = function (seed) {
            if (!this.color || !this.secondaryColor) {
                throw new Error("Player has no color specified");
            }
            var flag = new Flag_1.Flag(this.color);
            flag.addRandomEmblem(this.secondaryColor, seed);
            return flag;
        };
        Player.prototype.makeRandomAiController = function (game) {
            var race = this.race;
            var templateConstructor = race.getAiTemplateConstructor(this);
            var template = templateConstructor.construct({
                player: this,
                game: game,
                personality: utility_1.makeRandomPersonality(),
            });
            return new AiController_1.AiController(template);
        };
        Player.prototype.addUnit = function (unit) {
            this.units.push(unit);
            this.identifyUnit(unit);
        };
        Player.prototype.removeUnit = function (toRemove) {
            var index = this.units.indexOf(toRemove);
            this.units.splice(index, 1);
        };
        Player.prototype.getFleetIndex = function (fleet) {
            return this.fleets.indexOf(fleet);
        };
        Player.prototype.addFleet = function (fleet) {
            if (this.getFleetIndex(fleet) >= 0) {
                return;
            }
            fleet.player = this;
            this.fleets.push(fleet);
            this.visionIsDirty = true;
        };
        Player.prototype.removeFleet = function (fleet) {
            var fleetIndex = this.getFleetIndex(fleet);
            if (fleetIndex < 0) {
                return;
            }
            this.fleets.splice(fleetIndex, 1);
            this.visionIsDirty = true;
        };
        Player.prototype.getFleetsWithPositions = function () {
            var positions = [];
            for (var i = 0; i < this.fleets.length; i++) {
                var fleet = this.fleets[i];
                positions.push({
                    position: fleet.location,
                    data: fleet,
                });
            }
            return positions;
        };
        Player.prototype.hasStar = function (star) {
            return (this.controlledLocations.indexOf(star) >= 0);
        };
        Player.prototype.addStar = function (star) {
            if (this.hasStar(star)) {
                throw new Error("Player " + this.name + " already has star " + star.name);
            }
            star.owner = this;
            this.controlledLocations.push(star);
            this.visionIsDirty = true;
        };
        Player.prototype.removeStar = function (star) {
            var index = this.controlledLocations.indexOf(star);
            if (index < 0) {
                throw new Error("Player " + this.name + " doesn't have star " + star.name);
            }
            star.owner = null;
            this.controlledLocations.splice(index, 1);
            this.visionIsDirty = true;
            if (this.shouldDie()) {
                this.die();
            }
        };
        Player.prototype.getIncome = function () {
            return this.controlledLocations.reduce(function (total, star) {
                return total + star.getIncome();
            }, 0);
        };
        Player.prototype.addResource = function (resource, amount) {
            if (!this.resources[resource.type]) {
                this.resources[resource.type] = 0;
            }
            this.resources[resource.type] += amount;
        };
        Player.prototype.getResourceIncome = function () {
            var incomeByResource = {};
            for (var i = 0; i < this.controlledLocations.length; i++) {
                var star = this.controlledLocations[i];
                var starIncome = star.getResourceIncome();
                if (!starIncome) {
                    continue;
                }
                if (!incomeByResource[starIncome.resource.type]) {
                    incomeByResource[starIncome.resource.type] =
                        {
                            resource: starIncome.resource,
                            amount: 0,
                        };
                }
                incomeByResource[starIncome.resource.type].amount += starIncome.amount;
            }
            return incomeByResource;
        };
        Player.prototype.getNeighboringStars = function () {
            var stars = {};
            for (var i = 0; i < this.controlledLocations.length; i++) {
                var currentOwned = this.controlledLocations[i];
                var frontier = currentOwned.getLinkedInRange(1).all;
                for (var j = 0; j < frontier.length; j++) {
                    if (stars[frontier[j].id]) {
                        continue;
                    }
                    else if (frontier[j].owner.id === this.id) {
                        continue;
                    }
                    else {
                        stars[frontier[j].id] = frontier[j];
                    }
                }
            }
            var allStars = [];
            for (var id in stars) {
                allStars.push(stars[id]);
            }
            return allStars;
        };
        Player.prototype.getNeighboringPlayers = function () {
            var alreadyAddedPlayersById = {};
            var neighboringStars = this.getNeighboringStars();
            neighboringStars.forEach(function (star) {
                alreadyAddedPlayersById[star.owner.id] = star.owner;
            });
            return Object.keys(alreadyAddedPlayersById).map(function (playerId) {
                return alreadyAddedPlayersById[playerId];
            });
        };
        Player.prototype.updateVisionInStar = function (star) {
            if (this.diplomacy && this.diplomacy.hasAnUnmetPlayer()) {
                this.meetPlayersInStarByVisibility(star, "visible");
            }
        };
        Player.prototype.updateDetectionInStar = function (star) {
            if (this.diplomacy && this.diplomacy.hasAnUnmetPlayer()) {
                this.meetPlayersInStarByVisibility(star, "stealthy");
            }
            var unitsToIdentify = star.getUnits();
            for (var i = 0; i < unitsToIdentify.length; i++) {
                this.identifyUnit(unitsToIdentify[i]);
            }
        };
        Player.prototype.updateAllVisibilityInStar = function (star) {
            if (this.starIsVisible(star)) {
                this.updateVisionInStar(star);
            }
            if (this.starIsDetected(star)) {
                this.updateDetectionInStar(star);
            }
        };
        Player.prototype.meetPlayersInStarByVisibility = function (star, visibility) {
            var presentPlayersByVisibility = star.getPresentPlayersByVisibility();
            for (var playerId in presentPlayersByVisibility[visibility]) {
                var player = presentPlayersByVisibility[visibility][playerId];
                this.diplomacy.meetPlayerIfNeeded(player);
            }
        };
        Player.prototype.updateVisibleStars = function () {
            var previousVisibleStars = utility_1.extendObject(this.visibleStars);
            var previousDetectedStars = utility_1.extendObject(this.detectedStars);
            var newVisibleStars = [];
            var newDetectedStars = [];
            var visibilityHasChanged = false;
            var detectionHasChanged = false;
            this.visibleStars = {};
            this.detectedStars = {};
            var allVisible = [];
            var allDetected = [];
            for (var i = 0; i < this.controlledLocations.length; i++) {
                allVisible = allVisible.concat(this.controlledLocations[i].getVision());
                allDetected = allDetected.concat(this.controlledLocations[i].getDetection());
            }
            for (var i = 0; i < this.fleets.length; i++) {
                allVisible = allVisible.concat(this.fleets[i].getVisibleStars());
                allDetected = allDetected.concat(this.fleets[i].getDetectedStars());
            }
            for (var i = 0; i < allVisible.length; i++) {
                var star = allVisible[i];
                if (!this.visibleStars[star.id]) {
                    this.visibleStars[star.id] = star;
                    if (!previousVisibleStars[star.id]) {
                        visibilityHasChanged = true;
                        newVisibleStars.push(star);
                    }
                    if (!this.revealedStars[star.id]) {
                        this.revealedStars[star.id] = star;
                    }
                }
            }
            for (var i = 0; i < allDetected.length; i++) {
                var star = allDetected[i];
                if (!this.detectedStars[star.id]) {
                    this.detectedStars[star.id] = star;
                    if (!previousDetectedStars[star.id]) {
                        detectionHasChanged = true;
                        newDetectedStars.push(star);
                    }
                }
            }
            this.visionIsDirty = false;
            if (!visibilityHasChanged) {
                visibilityHasChanged = (Object.keys(this.visibleStars).length !==
                    Object.keys(previousVisibleStars).length);
            }
            if (!visibilityHasChanged && !detectionHasChanged) {
                detectionHasChanged = (Object.keys(this.detectedStars).length !==
                    Object.keys(previousDetectedStars).length);
            }
            for (var i = 0; i < newVisibleStars.length; i++) {
                this.updateVisionInStar(newVisibleStars[i]);
            }
            for (var i = 0; i < newDetectedStars.length; i++) {
                this.updateDetectionInStar(newDetectedStars[i]);
            }
            if (visibilityHasChanged && !this.isAi) {
                eventManager_1.eventManager.dispatchEvent("renderMap");
            }
            if (detectionHasChanged && !this.isAi) {
                eventManager_1.eventManager.dispatchEvent("renderLayer", "fleets");
            }
        };
        Player.prototype.getDebugVisibleStars = function () {
            if (this.controlledLocations.length > 0) {
                return this.controlledLocations[0].getAllLinkedStars();
            }
            else if (Object.keys(this.revealedStars).length > 0) {
                var initialStar = this.revealedStars[Object.keys(this.revealedStars)[0]];
                return initialStar.getAllLinkedStars();
            }
            else {
                return [];
            }
        };
        Player.prototype.getVisibleStars = function () {
            if (!this.isAi && Options_1.options.debug.enabled) {
                return this.getDebugVisibleStars();
            }
            if (this.visionIsDirty) {
                this.updateVisibleStars();
            }
            var visible = [];
            for (var id in this.visibleStars) {
                var star = this.visibleStars[id];
                visible.push(star);
            }
            return visible;
        };
        Player.prototype.getRevealedStars = function () {
            if (!this.isAi && Options_1.options.debug.enabled) {
                return this.getDebugVisibleStars();
            }
            if (this.visionIsDirty) {
                this.updateVisibleStars();
            }
            var toReturn = [];
            for (var id in this.revealedStars) {
                toReturn.push(this.revealedStars[id]);
            }
            return toReturn;
        };
        Player.prototype.getRevealedButNotVisibleStars = function () {
            if (this.visionIsDirty) {
                this.updateVisibleStars();
            }
            var toReturn = [];
            for (var id in this.revealedStars) {
                if (!this.visibleStars[id]) {
                    toReturn.push(this.revealedStars[id]);
                }
            }
            return toReturn;
        };
        Player.prototype.getDetectedStars = function () {
            if (!this.isAi && Options_1.options.debug.enabled) {
                return this.getDebugVisibleStars();
            }
            if (this.visionIsDirty) {
                this.updateVisibleStars();
            }
            var toReturn = [];
            for (var id in this.detectedStars) {
                toReturn.push(this.detectedStars[id]);
            }
            return toReturn;
        };
        Player.prototype.starIsVisible = function (star) {
            if (!this.isAi && Options_1.options.debug.enabled) {
                return true;
            }
            if (this.visionIsDirty) {
                this.updateVisibleStars();
            }
            return Boolean(this.visibleStars[star.id]);
        };
        Player.prototype.starIsRevealed = function (star) {
            if (!this.isAi && Options_1.options.debug.enabled) {
                return true;
            }
            if (this.visionIsDirty) {
                this.updateVisibleStars();
            }
            return Boolean(this.revealedStars[star.id]);
        };
        Player.prototype.starIsDetected = function (star) {
            if (!this.isAi && Options_1.options.debug.enabled) {
                return true;
            }
            if (this.visionIsDirty) {
                this.updateVisibleStars();
            }
            return Boolean(this.detectedStars[star.id]);
        };
        Player.prototype.getLinksToUnRevealedStars = function () {
            if (this.visionIsDirty) {
                this.updateVisibleStars();
            }
            var linksBySourceStar = new ValuesByStar_1.ValuesByStar();
            for (var starId in this.revealedStars) {
                var star = this.revealedStars[starId];
                var links = star.getAllLinks();
                for (var i = 0; i < links.length; i++) {
                    var linkedStar = links[i];
                    if (!this.revealedStars[linkedStar.id]) {
                        if (!linksBySourceStar.has(star)) {
                            linksBySourceStar.set(star, [linkedStar]);
                        }
                        else {
                            linksBySourceStar.get(star).push(linkedStar);
                        }
                    }
                }
            }
            return linksBySourceStar;
        };
        Player.prototype.identifyUnit = function (unit) {
            if (!this.identifiedUnits[unit.id]) {
                this.identifiedUnits[unit.id] = unit;
            }
        };
        Player.prototype.unitIsIdentified = function (unit) {
            if (Options_1.options.debug.enabled && !this.isAi) {
                return true;
            }
            else {
                return Boolean(this.identifiedUnits[unit.id]);
            }
        };
        Player.prototype.fleetIsFullyIdentified = function (fleet) {
            if (Options_1.options.debug.enabled && !this.isAi) {
                return true;
            }
            for (var i = 0; i < fleet.units.length; i++) {
                if (!this.identifiedUnits[fleet.units[i].id]) {
                    return false;
                }
            }
            return true;
        };
        Player.prototype.addItem = function (item) {
            this.items.push(item);
        };
        Player.prototype.removeItem = function (item) {
            var index = this.items.indexOf(item);
            if (index === -1) {
                throw new Error("Player " + this.name + " has no item " + item.id);
            }
            this.items.splice(index, 1);
        };
        Player.prototype.getNearestOwnedStarTo = function (targetStar) {
            var _this = this;
            var isOwnedByThisFN = function (star) {
                return star.owner === _this;
            };
            return targetStar.getNearestStarForQualifier(isOwnedByThisFN);
        };
        Player.prototype.attackTarget = function (location, target, battleFinishCallback) {
            var _this = this;
            var battleData = {
                location: location,
                building: target.building,
                attacker: {
                    player: this,
                    units: location.getUnits(function (player) { return player === _this; }),
                },
                defender: {
                    player: target.enemy,
                    units: target.units,
                },
            };
            var battlePrep = new BattlePrep_1.BattlePrep(battleData);
            if (battlePrep.humanPlayer) {
                App_1.app.reactUI.battlePrep = battlePrep;
                if (battleFinishCallback) {
                    battlePrep.afterBattleFinishCallbacks.push(battleFinishCallback);
                }
                App_1.app.reactUI.switchScene("battlePrep");
            }
            else {
                var battle = battlePrep.makeBattle();
                battle.afterFinishCallbacks.push(battleFinishCallback);
                var simulator = new BattleSimulator_1.BattleSimulator(battle);
                simulator.simulateBattle();
                simulator.finishBattle();
            }
        };
        Player.prototype.buildBuilding = function (template, location) {
            var building = new Building_1.Building({
                template: template,
                location: location,
            });
            building.controller = this;
            location.buildings.add(building);
            this.money -= building.template.buildCost;
            if (template.onBuild) {
                template.onBuild(location, this);
            }
        };
        Player.prototype.upgradeBuilding = function (upgradeData) {
            upgradeData.parentBuilding.upgrade(upgradeData);
            this.money -= upgradeData.cost;
        };
        Player.prototype.getResearchSpeed = function () {
            var research = 0;
            research += activeModuleData_1.activeModuleData.ruleSet.research.baseResearchPoints;
            for (var i = 0; i < this.controlledLocations.length; i++) {
                research += this.controlledLocations[i].getResearchPoints();
            }
            return research;
        };
        Player.prototype.getAllOwnedBuildings = function () {
            var _this = this;
            var allBuildings = [];
            this.controlledLocations.forEach(function (location) {
                var ownedBuildingsAtLocation = location.buildings.filter(function (building) {
                    return building.controller === _this;
                });
                allBuildings.push.apply(allBuildings, ownedBuildingsAtLocation);
            });
            return allBuildings;
        };
        Player.prototype.getAllManufactories = function () {
            var manufactories = [];
            for (var i = 0; i < this.controlledLocations.length; i++) {
                if (this.controlledLocations[i].manufactory) {
                    manufactories.push(this.controlledLocations[i].manufactory);
                }
            }
            return manufactories;
        };
        Player.prototype.canAccessManufactoringAtLocation = function (location) {
            return this === location.owner;
        };
        Player.prototype.meetsTechRequirements = function (requirements) {
            if (!this.playerTechnology) {
                return false;
            }
            for (var i = 0; i < requirements.length; i++) {
                var requirement = requirements[i];
                if (this.playerTechnology.technologies[requirement.technology.key].level < requirement.level) {
                    return false;
                }
            }
            return true;
        };
        Player.prototype.serialize = function () {
            var revealedStarIds = [];
            for (var id in this.revealedStars) {
                revealedStarIds.push(this.revealedStars[id].id);
            }
            var identifiedUnitIds = [];
            for (var id in this.identifiedUnits) {
                identifiedUnitIds.push(this.identifiedUnits[id].id);
            }
            var data = {
                id: this.id,
                name: this.name.serialize(),
                color: this.color.serialize(),
                colorAlpha: this.colorAlpha,
                secondaryColor: this.secondaryColor.serialize(),
                isIndependent: this.isIndependent,
                isAi: this.isAi,
                resources: utility_1.extendObject(this.resources),
                fleets: this.fleets.map(function (fleet) { return fleet.serialize(); }),
                money: this.money,
                controlledLocationIds: this.controlledLocations.map(function (star) { return star.id; }),
                itemIds: this.items.map(function (item) { return item.id; }),
                unitIds: this.units.map(function (unit) { return unit.id; }),
                revealedStarIds: revealedStarIds,
                identifiedUnitIds: identifiedUnitIds,
                raceKey: this.race.type,
                isDead: this.isDead,
                diplomacyData: this.diplomacy ? this.diplomacy.serialize() : null,
                researchByTechnology: this.playerTechnology ? this.playerTechnology.serialize() : null,
                flag: this.flag ? this.flag.serialize() : null,
                AiController: this.aiController ? this.aiController.serialize() : null,
                notificationLog: this.notificationLog ? this.notificationLog.serialize() : null,
            };
            return data;
        };
        return Player;
    }());
    exports.Player = Player;
});
define("src/PlayerControl", ["require", "exports", "src/eventManager"], function (require, exports, eventManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlayerControl = (function () {
        function PlayerControl(player) {
            this.selectedFleets = [];
            this.inspectedFleets = [];
            this.currentlyReorganizing = [];
            this.lastSelectedFleetsIds = {};
            this.currentAttackTargets = [];
            this.preventingGhost = false;
            this.listeners = {};
            this.player = player;
            this.addEventListeners();
        }
        PlayerControl.prototype.destroy = function () {
            this.removeEventListeners();
            this.player = null;
            this.selectedFleets = null;
            this.currentlyReorganizing = null;
            this.currentAttackTargets = null;
            this.selectedStar = null;
        };
        PlayerControl.prototype.removeEventListener = function (name) {
            eventManager_1.eventManager.removeEventListener(name, this.listeners[name]);
        };
        PlayerControl.prototype.removeEventListeners = function () {
            for (var name_1 in this.listeners) {
                this.removeEventListener(name_1);
            }
        };
        PlayerControl.prototype.addEventListener = function (name, handler) {
            this.listeners[name] = handler;
            eventManager_1.eventManager.addEventListener(name, handler);
        };
        PlayerControl.prototype.addEventListeners = function () {
            var _this = this;
            this.addEventListener("updateSelection", function () {
                _this.updateSelection();
            });
            this.addEventListener("selectFleets", function (fleets) {
                _this.selectFleets(fleets);
            });
            this.addEventListener("deselectFleet", function (fleet) {
                _this.deselectFleet(fleet);
            });
            this.addEventListener("mergeFleets", function () {
                _this.mergeFleets();
            });
            this.addEventListener("splitFleet", function (fleet) {
                _this.splitFleet(fleet);
            });
            this.addEventListener("startReorganizingFleets", function (fleets) {
                _this.startReorganizingFleets(fleets);
            });
            this.addEventListener("endReorganizingFleets", function () {
                _this.endReorganizingFleets();
            });
            this.addEventListener("starClick", function (star) {
                _this.selectStar(star);
            });
            this.addEventListener("moveFleets", function (star) {
                _this.moveFleets(star);
            });
            this.addEventListener("setRectangleSelectTargetFN", function (rectangleSelect) {
                rectangleSelect.getSelectionTargetsFN =
                    _this.player.getFleetsWithPositions.bind(_this.player);
            });
            this.addEventListener("attackTarget", function (target) {
                _this.attackTarget(target);
            });
        };
        PlayerControl.prototype.preventGhost = function (delay) {
            var _this = this;
            this.preventingGhost = true;
            var timeout = window.setTimeout(function () {
                _this.preventingGhost = false;
                window.clearTimeout(timeout);
            }, delay);
        };
        PlayerControl.prototype.clearSelection = function () {
            this.selectedFleets = [];
            this.inspectedFleets = [];
            this.selectedStar = null;
        };
        PlayerControl.prototype.updateSelection = function (endReorganizingFleets) {
            if (endReorganizingFleets === void 0) { endReorganizingFleets = true; }
            if (endReorganizingFleets) {
                this.endReorganizingFleets();
            }
            this.currentAttackTargets = this.getCurrentAttackTargets();
            eventManager_1.eventManager.dispatchEvent("playerControlUpdated", null);
        };
        PlayerControl.prototype.areAllFleetsInSameLocation = function () {
            if (this.selectedFleets.length <= 0) {
                return false;
            }
            for (var i = 1; i < this.selectedFleets.length; i++) {
                if (this.selectedFleets[i].location !== this.selectedFleets[i - 1].location) {
                    return false;
                }
            }
            return true;
        };
        PlayerControl.prototype.selectFleets = function (fleets) {
            if (fleets.length < 1) {
                this.clearSelection();
                this.updateSelection();
                return;
            }
            var playerFleets = [];
            var otherFleets = [];
            for (var i = 0; i < fleets.length; i++) {
                if (fleets[i].player === this.player) {
                    playerFleets.push(fleets[i]);
                }
                else {
                    otherFleets.push(fleets[i]);
                }
            }
            if (playerFleets.length > 0) {
                this.selectPlayerFleets(playerFleets);
            }
            else {
                this.selectOtherFleets(otherFleets);
            }
            this.updateSelection();
            this.preventGhost(15);
        };
        PlayerControl.prototype.selectPlayerFleets = function (fleets) {
            this.clearSelection();
            for (var i = 0; i < fleets.length; i++) {
                if (fleets[i].units.length < 1) {
                    if (this.currentlyReorganizing.indexOf(fleets[i]) >= 0) {
                        continue;
                    }
                    fleets[i].deleteFleet();
                    fleets.splice(i, 1);
                }
            }
            this.selectedFleets = fleets;
        };
        PlayerControl.prototype.selectOtherFleets = function (fleets) {
            this.inspectedFleets = fleets;
        };
        PlayerControl.prototype.deselectFleet = function (fleet) {
            var fleetsContainer = this.selectedFleets.length > 0 ? this.selectedFleets : this.inspectedFleets;
            var fleetIndex = fleetsContainer.indexOf(fleet);
            if (fleetIndex < 0) {
                return;
            }
            fleetsContainer.splice(fleetIndex, 1);
            if (fleetsContainer.length < 1) {
                this.selectedStar = fleet.location;
            }
            this.updateSelection();
        };
        PlayerControl.prototype.getMasterFleetForMerge = function (fleets) {
            return fleets[0];
        };
        PlayerControl.prototype.mergeFleetsOfSameType = function (fleets) {
            if (fleets.length === 0) {
                return [];
            }
            var master = this.getMasterFleetForMerge(fleets);
            fleets.splice(fleets.indexOf(master), 1);
            var slaves = fleets;
            for (var i = 0; i < slaves.length; i++) {
                slaves[i].mergeWith(master, i === slaves.length - 1);
            }
            return [master];
        };
        PlayerControl.prototype.mergeFleets = function () {
            var allFleets = this.selectedFleets;
            var normalFleets = [];
            var stealthyFleets = [];
            for (var i = 0; i < allFleets.length; i++) {
                if (allFleets[i].isStealthy) {
                    stealthyFleets.push(allFleets[i]);
                }
                else {
                    normalFleets.push(allFleets[i]);
                }
            }
            this.clearSelection();
            this.selectedFleets =
                this.mergeFleetsOfSameType(normalFleets).concat(this.mergeFleetsOfSameType(stealthyFleets));
            this.updateSelection();
        };
        PlayerControl.prototype.selectStar = function (star) {
            if (this.preventingGhost || this.selectedStar === star) {
                return;
            }
            this.clearSelection();
            this.selectedStar = star;
            this.updateSelection();
        };
        PlayerControl.prototype.moveFleets = function (star) {
            for (var i = 0; i < this.selectedFleets.length; i++) {
                this.selectedFleets[i].pathFind(star);
            }
        };
        PlayerControl.prototype.splitFleet = function (fleet) {
            if (fleet.units.length <= 0) {
                return;
            }
            this.endReorganizingFleets();
            var newFleet = fleet.split();
            this.currentlyReorganizing = [fleet, newFleet];
            this.selectedFleets = [fleet, newFleet];
            this.updateSelection(false);
        };
        PlayerControl.prototype.startReorganizingFleets = function (fleets) {
            if (fleets.length !== 2 ||
                fleets[0].location !== fleets[1].location ||
                this.selectedFleets.length !== 2 ||
                this.selectedFleets.indexOf(fleets[0]) < 0 ||
                this.selectedFleets.indexOf(fleets[1]) < 0) {
                throw new Error("cant reorganize fleets");
            }
            this.currentlyReorganizing = fleets;
            this.updateSelection(false);
        };
        PlayerControl.prototype.endReorganizingFleets = function () {
            for (var i = 0; i < this.currentlyReorganizing.length; i++) {
                var fleet = this.currentlyReorganizing[i];
                if (fleet.units.length <= 0) {
                    var selectedIndex = this.selectedFleets.indexOf(fleet);
                    if (selectedIndex >= 0) {
                        this.selectedFleets.splice(selectedIndex, 1);
                    }
                    fleet.deleteFleet();
                }
            }
            this.currentlyReorganizing = [];
        };
        PlayerControl.prototype.getCurrentAttackTargets = function () {
            if (this.selectedFleets.length < 1) {
                return [];
            }
            if (!this.areAllFleetsInSameLocation()) {
                return [];
            }
            var location = this.selectedFleets[0].location;
            var possibleTargets = location.getTargetsForPlayer(this.player);
            return possibleTargets;
        };
        PlayerControl.prototype.attackTarget = function (target) {
            if (this.currentAttackTargets.indexOf(target) < 0) {
                throw new Error("Invalid attack target");
            }
            var currentLocation = this.selectedFleets[0].location;
            this.player.attackTarget(currentLocation, target);
        };
        return PlayerControl;
    }());
    exports.PlayerControl = PlayerControl;
});
define("src/PlayerDiplomacy", ["require", "exports", "src/activeModuleData", "src/AttitudeModifier", "src/DiplomacyState", "src/ValuesByPlayer"], function (require, exports, activeModuleData_1, AttitudeModifier_1, DiplomacyState_1, ValuesByPlayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlayerDiplomacy = (function () {
        function PlayerDiplomacy(player, game) {
            this.player = player;
            this.game = game;
            this.statusByPlayer = new ValuesByPlayer_1.ValuesByPlayer();
            this.attitudeModifiersByPlayer = new ValuesByPlayer_1.ValuesByPlayer();
        }
        PlayerDiplomacy.prototype.destroy = function () {
            this.attitudeModifiersByPlayer.destroy();
            this.statusByPlayer.destroy();
        };
        PlayerDiplomacy.prototype.getStatusWithPlayer = function (player) {
            return this.statusByPlayer.get(player) || DiplomacyState_1.DiplomacyState.Unmet;
        };
        PlayerDiplomacy.prototype.setStatusWithPlayer = function (player, status) {
            this.statusByPlayer.set(player, status);
        };
        PlayerDiplomacy.prototype.getAttitudeModifiersForPlayer = function (player) {
            return this.attitudeModifiersByPlayer.get(player) || [];
        };
        PlayerDiplomacy.prototype.getOpinionOf = function (player) {
            var attitudeModifiers = this.getAttitudeModifiersForPlayer(player);
            var modifierOpinion = attitudeModifiers.map(function (modifier) {
                return modifier.getAdjustedStrength();
            }).reduce(function (totalOpinion, currentOpinion) {
                return totalOpinion + currentOpinion;
            }, 0);
            return Math.round(modifierOpinion);
        };
        PlayerDiplomacy.prototype.canDoDiplomacyWithPlayer = function (player) {
            return player !== this.player &&
                !player.isIndependent &&
                !player.isDead;
        };
        PlayerDiplomacy.prototype.hasMetPlayer = function (player) {
            return this.getStatusWithPlayer(player) > DiplomacyState_1.DiplomacyState.Unmet;
        };
        PlayerDiplomacy.prototype.meetPlayerIfNeeded = function (player) {
            if (!this.hasMetPlayer(player) && this.canDoDiplomacyWithPlayer(player)) {
                this.triggerMeetingWithPlayer(player);
                player.diplomacy.triggerMeetingWithPlayer(this.player);
            }
        };
        PlayerDiplomacy.prototype.getMetPlayers = function () {
            return this.statusByPlayer.filter(function (player, state) {
                return state > DiplomacyState_1.DiplomacyState.Unmet;
            }).mapToArray(function (player) {
                return player;
            });
        };
        PlayerDiplomacy.prototype.hasAnUnmetPlayer = function () {
            var _this = this;
            return this.game.players.some(function (player) {
                return _this.getStatusWithPlayer(player) === DiplomacyState_1.DiplomacyState.Unmet;
            });
        };
        PlayerDiplomacy.prototype.canDeclareWarOn = function (player) {
            return this.hasMetPlayer(player) && this.getStatusWithPlayer(player) < DiplomacyState_1.DiplomacyState.War;
        };
        PlayerDiplomacy.prototype.canMakePeaceWith = function (player) {
            return this.hasMetPlayer(player) && this.getStatusWithPlayer(player) > DiplomacyState_1.DiplomacyState.Peace;
        };
        PlayerDiplomacy.prototype.declareWarOn = function (targetPlayer) {
            var _this = this;
            if (this.getStatusWithPlayer(targetPlayer) >= DiplomacyState_1.DiplomacyState.War) {
                console.error("Players " + this.player.id + " and " + targetPlayer.id + " are already at war");
                return;
            }
            this.statusByPlayer.set(targetPlayer, DiplomacyState_1.DiplomacyState.War);
            targetPlayer.diplomacy.statusByPlayer.set(this.player, DiplomacyState_1.DiplomacyState.War);
            activeModuleData_1.activeModuleData.scripts.diplomacy.onWarDeclaration.forEach(function (script) {
                script(_this.player, targetPlayer, _this.game);
            });
        };
        PlayerDiplomacy.prototype.makePeaceWith = function (targetPlayer) {
            if (!this.canMakePeaceWith(targetPlayer)) {
                console.error("Players " + this.player.id + " and " + targetPlayer.id + " can't delcare peace");
            }
            this.statusByPlayer.set(targetPlayer, DiplomacyState_1.DiplomacyState.Peace);
            targetPlayer.diplomacy.statusByPlayer.set(this.player, DiplomacyState_1.DiplomacyState.Peace);
        };
        PlayerDiplomacy.prototype.canAttackFleetOfPlayer = function (player) {
            if (player.isIndependent) {
                return true;
            }
            if (this.getStatusWithPlayer(player) >= DiplomacyState_1.DiplomacyState.ColdWar) {
                return true;
            }
            return false;
        };
        PlayerDiplomacy.prototype.canAttackBuildingOfPlayer = function (player) {
            if (player.isIndependent) {
                return true;
            }
            if (this.getStatusWithPlayer(player) >= DiplomacyState_1.DiplomacyState.War) {
                return true;
            }
            return false;
        };
        PlayerDiplomacy.prototype.addAttitudeModifier = function (player, modifier) {
            var sameType = this.getModifierOfSameType(player, modifier);
            if (sameType) {
                sameType.refresh(modifier);
                return;
            }
            if (!this.attitudeModifiersByPlayer.has(player)) {
                this.attitudeModifiersByPlayer.set(player, [modifier]);
            }
            else {
                this.attitudeModifiersByPlayer.get(player).push(modifier);
            }
        };
        PlayerDiplomacy.prototype.processAttitudeModifiersForPlayer = function (player, evaluation) {
            var allModifiers = activeModuleData_1.activeModuleData.templates.AttitudeModifiers;
            var modifiersForPlayer = this.getAttitudeModifiersForPlayer(player);
            var activeModifiers = {};
            var modifiersAdded = {};
            var modifiersRemoved = {};
            for (var i = modifiersForPlayer.length - 1; i >= 0; i--) {
                var modifier = modifiersForPlayer[i];
                if (modifier.shouldEnd(evaluation)) {
                    modifiersForPlayer.splice(i, 1);
                    modifiersRemoved[modifier.template.type] = modifier;
                }
                else {
                    activeModifiers[modifier.template.type] = modifier;
                }
            }
            for (var modifierType in allModifiers) {
                var template = allModifiers[modifierType];
                var activeModifier = activeModifiers[template.type];
                if (!activeModifier && template.startCondition) {
                    var shouldStart = template.startCondition(evaluation);
                    if (shouldStart) {
                        var newModifier = new AttitudeModifier_1.AttitudeModifier({
                            template: template,
                            startTurn: evaluation.currentTurn,
                            evaluation: evaluation,
                        });
                        modifiersForPlayer.push(newModifier);
                        modifiersAdded[template.type] = newModifier;
                    }
                }
                else if (activeModifier) {
                    activeModifier.update(evaluation);
                }
            }
        };
        PlayerDiplomacy.prototype.serialize = function () {
            var attitudeModifiersByPlayer = {};
            this.attitudeModifiersByPlayer.forEach(function (player, modifiers) {
                attitudeModifiersByPlayer[player.id] = modifiers.map(function (modifier) { return modifier.serialize(); });
            });
            var data = {
                statusByPlayer: this.statusByPlayer.toObject(),
                attitudeModifiersByPlayer: attitudeModifiersByPlayer,
            };
            return data;
        };
        PlayerDiplomacy.prototype.getModifierOfSameType = function (player, modifier) {
            var modifiers = this.getAttitudeModifiersForPlayer(player);
            for (var i = 0; i < modifiers.length; i++) {
                if (modifiers[i].template.type === modifier.template.type) {
                    return modifiers[i];
                }
            }
            return null;
        };
        PlayerDiplomacy.prototype.triggerMeetingWithPlayer = function (player) {
            var _this = this;
            this.statusByPlayer.set(player, DiplomacyState_1.DiplomacyState.ColdWar);
            activeModuleData_1.activeModuleData.scripts.diplomacy.onFirstMeeting.forEach(function (script) {
                script(_this.player, player, _this.game);
            });
        };
        return PlayerDiplomacy;
    }());
    exports.PlayerDiplomacy = PlayerDiplomacy;
});
define("src/PlayerTechnology", ["require", "exports", "src/activeModuleData", "src/eventManager"], function (require, exports, activeModuleData_1, eventManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlayerTechnology = (function () {
        function PlayerTechnology(getResearchSpeed, raceTechnologyValues, savedData) {
            var _this = this;
            this.tempOverflowedResearchAmount = 0;
            this.getResearchSpeed = getResearchSpeed;
            this.technologies = {};
            raceTechnologyValues.forEach(function (raceValue) {
                var techKey = raceValue.tech.key;
                var technology = activeModuleData_1.activeModuleData.templates.Technologies[techKey];
                _this.technologies[techKey] =
                    {
                        technology: technology,
                        totalResearch: 0,
                        level: 0,
                        maxLevel: raceValue.maxLevel,
                        priority: undefined,
                        priorityIsLocked: false,
                    };
                if (savedData && savedData[techKey]) {
                    _this.addResearchTowardsTechnology(technology, savedData[techKey].totalResearch);
                    _this.technologies[techKey].priority = savedData[techKey].priority;
                    _this.technologies[techKey].priorityIsLocked = savedData[techKey].priorityIsLocked;
                }
                else {
                    _this.technologies[techKey].level = raceValue.startingLevel;
                    _this.technologies[techKey].totalResearch =
                        _this.getResearchNeededForTechnologyLevel(raceValue.startingLevel);
                }
            });
            this.initPriorities();
        }
        PlayerTechnology.prototype.initPriorities = function () {
            var _this = this;
            var priorityToAllocate = 1;
            var techsToInit = [];
            for (var key in this.technologies) {
                var techData = this.technologies[key];
                if (techData.priority === undefined) {
                    techsToInit.push(techData.technology);
                }
                else {
                    priorityToAllocate -= techData.priority;
                }
            }
            techsToInit.sort(function (a, b) {
                return _this.technologies[b.key].maxLevel - _this.technologies[a.key].maxLevel;
            });
            while (techsToInit.length > 0) {
                var averagePriority = priorityToAllocate / techsToInit.length;
                var technology = techsToInit.pop();
                var maxNeededPriority = this.getMaxNeededPriority(technology);
                var priorityForTech = Math.min(averagePriority, maxNeededPriority);
                this.technologies[technology.key].priority = priorityForTech;
                priorityToAllocate -= priorityForTech;
            }
        };
        PlayerTechnology.prototype.allocateResearchPoints = function (amount, iteration) {
            if (iteration === void 0) { iteration = 0; }
            var totalPriority = 0;
            for (var key in this.technologies) {
                totalPriority += this.technologies[key].priority;
            }
            for (var key in this.technologies) {
                var techData = this.technologies[key];
                var relativePriority = techData.priority / totalPriority;
                if (relativePriority > 0) {
                    this.addResearchTowardsTechnology(techData.technology, relativePriority * amount);
                }
            }
            if (this.tempOverflowedResearchAmount) {
                if (iteration > 10) {
                    throw new RangeError("Maximum call stack size exceeded");
                }
                this.allocateOverflowedResearchPoints(iteration);
            }
            else {
                this.capTechnologyPrioritiesToMaxNeeded();
            }
        };
        PlayerTechnology.prototype.allocateOverflowedResearchPoints = function (iteration) {
            if (iteration === void 0) { iteration = 0; }
            var overflow = this.tempOverflowedResearchAmount;
            this.tempOverflowedResearchAmount = 0;
            this.allocateResearchPoints(overflow, iteration + 1);
        };
        PlayerTechnology.prototype.getResearchNeededForTechnologyLevel = function (level) {
            if (level <= 0) {
                return 0;
            }
            if (level === 1) {
                return 40;
            }
            var a = 20;
            var b = 40;
            var swap;
            var total = 0;
            for (var i = 0; i < level; i++) {
                swap = a;
                a = b;
                b = swap + b;
                total += a;
            }
            return total;
        };
        PlayerTechnology.prototype.addResearchTowardsTechnology = function (technology, amount) {
            var tech = this.technologies[technology.key];
            var overflow = 0;
            if (tech.level >= tech.maxLevel) {
                return;
            }
            else {
                tech.totalResearch += amount;
                while (tech.level < tech.maxLevel &&
                    this.getResearchNeededForTechnologyLevel(tech.level + 1) <= tech.totalResearch) {
                    tech.level++;
                }
                if (tech.level === tech.maxLevel) {
                    var neededForMaxLevel = this.getResearchNeededForTechnologyLevel(tech.level);
                    overflow += tech.totalResearch - neededForMaxLevel;
                    tech.totalResearch -= overflow;
                    this.setTechnologyPriority(technology, 0, true);
                    tech.priorityIsLocked = true;
                }
            }
            this.tempOverflowedResearchAmount += overflow;
        };
        PlayerTechnology.prototype.getMaxNeededPriority = function (technology) {
            var tech = this.technologies[technology.key];
            var researchUntilMaxed = this.getResearchNeededForTechnologyLevel(tech.maxLevel) - tech.totalResearch;
            return researchUntilMaxed / this.getResearchSpeed();
        };
        PlayerTechnology.prototype.getOpenTechnologiesPriority = function () {
            var openPriority = 0;
            for (var key in this.technologies) {
                var techData = this.technologies[key];
                if (!techData.priorityIsLocked) {
                    openPriority += techData.priority;
                }
            }
            return openPriority;
        };
        PlayerTechnology.prototype.getRelativeOpenTechnologyPriority = function (technology) {
            var totalOpenPriority = this.getOpenTechnologiesPriority();
            if (this.technologies[technology.key].priorityIsLocked || !totalOpenPriority) {
                return 0;
            }
            return this.technologies[technology.key].priority / totalOpenPriority;
        };
        PlayerTechnology.prototype.setTechnologyPriority = function (technology, desiredPriority, force) {
            if (force === void 0) { force = false; }
            var priority = desiredPriority;
            var remainingPriority = 1;
            var totalOtherPriority = 0;
            var totalOtherPriorityWasZero = false;
            var totalOthersCount = 0;
            for (var key in this.technologies) {
                if (key !== technology.key) {
                    if (this.technologies[key].priorityIsLocked) {
                        remainingPriority -= this.technologies[key].priority;
                    }
                    else {
                        totalOtherPriority += this.technologies[key].priority;
                        totalOthersCount++;
                    }
                }
            }
            if (totalOthersCount === 0) {
                if (force) {
                    this.technologies[technology.key].priority = priority;
                    eventManager_1.eventManager.dispatchEvent("technologyPrioritiesUpdated");
                }
                return;
            }
            if (remainingPriority < 0.0001) {
                remainingPriority = 0;
            }
            if (priority > remainingPriority) {
                priority = remainingPriority;
            }
            var priorityNeededForMaxLevel = this.getMaxNeededPriority(technology);
            var maxNeededPriority = Math.min(priorityNeededForMaxLevel, priority);
            this.technologies[technology.key].priority = maxNeededPriority;
            remainingPriority -= maxNeededPriority;
            if (totalOtherPriority === 0) {
                totalOtherPriority = 1;
                totalOtherPriorityWasZero = true;
            }
            for (var key in this.technologies) {
                if (key !== technology.key && !this.technologies[key].priorityIsLocked) {
                    var techData = this.technologies[key];
                    if (totalOtherPriorityWasZero) {
                        techData.priority = 1 / totalOthersCount;
                    }
                    var maxNeededPriorityForOtherTech = this.getMaxNeededPriority(techData.technology);
                    var relativePriority = techData.priority / totalOtherPriority;
                    var reservedPriority = relativePriority * remainingPriority;
                    if (reservedPriority > maxNeededPriorityForOtherTech) {
                        techData.priority = maxNeededPriorityForOtherTech;
                        var priorityOverflow = reservedPriority - maxNeededPriorityForOtherTech;
                        remainingPriority += priorityOverflow;
                    }
                    else {
                        techData.priority = reservedPriority;
                    }
                }
            }
            eventManager_1.eventManager.dispatchEvent("technologyPrioritiesUpdated");
        };
        PlayerTechnology.prototype.capTechnologyPrioritiesToMaxNeeded = function () {
            for (var key in this.technologies) {
                var techData = this.technologies[key];
                var maxNeededPriorityForOtherTech = this.getMaxNeededPriority(techData.technology);
                if (techData.priority > maxNeededPriorityForOtherTech) {
                    this.setTechnologyPriority(techData.technology, maxNeededPriorityForOtherTech, true);
                    break;
                }
            }
        };
        PlayerTechnology.prototype.serialize = function () {
            var data = {};
            for (var key in this.technologies) {
                data[key] =
                    {
                        totalResearch: this.technologies[key].totalResearch,
                        priority: this.technologies[key].priority,
                        priorityIsLocked: this.technologies[key].priorityIsLocked,
                    };
            }
            return data;
        };
        return PlayerTechnology;
    }());
    exports.PlayerTechnology = PlayerTechnology;
});
define("src/Point", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/PriorityQueue", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PriorityQueue = (function () {
        function PriorityQueue() {
            this.items = {};
        }
        PriorityQueue.prototype.isEmpty = function () {
            if (Object.keys(this.items).length > 0) {
                return false;
            }
            else {
                return true;
            }
        };
        PriorityQueue.prototype.push = function (priority, data) {
            if (!this.items[priority]) {
                this.items[priority] = [];
            }
            this.items[priority].push(data);
        };
        PriorityQueue.prototype.pop = function () {
            var highestPriorityValue = this.getHighestPriorityValue();
            var toReturn = this.items[highestPriorityValue].pop();
            if (this.items[highestPriorityValue].length < 1) {
                delete this.items[highestPriorityValue];
            }
            return toReturn;
        };
        PriorityQueue.prototype.peek = function () {
            var highestPriorityValue = this.getHighestPriorityValue();
            var items = this.items[highestPriorityValue];
            return items[items.length - 1];
        };
        PriorityQueue.prototype.getHighestPriorityValue = function () {
            var allPriorityValues = Object.keys(this.items).map(function (key) { return Number(key); });
            return Math.min.apply(Math, allPriorityValues);
        };
        return PriorityQueue;
    }());
    exports.PriorityQueue = PriorityQueue;
});
define("src/Range", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/rangeOperations", ["require", "exports", "src/utility"], function (require, exports, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function excludeFromRanges(ranges, toExclude) {
        var intersecting = getIntersectingRanges(ranges, toExclude);
        var newRanges = ranges.slice(0);
        for (var i = 0; i < intersecting.length; i++) {
            newRanges.splice(newRanges.indexOf(intersecting[i]), 1);
            var intersectedRanges = excludeFromRange(intersecting[i], toExclude);
            if (intersectedRanges) {
                newRanges = newRanges.concat(intersectedRanges);
            }
        }
        return newRanges;
    }
    exports.excludeFromRanges = excludeFromRanges;
    function getIntersectingRanges(ranges, toIntersectWith) {
        var intersecting = [];
        for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            if (toIntersectWith.max < range.min || toIntersectWith.min > range.max) {
                continue;
            }
            intersecting.push(range);
        }
        return intersecting;
    }
    exports.getIntersectingRanges = getIntersectingRanges;
    function rangesHaveOverlap() {
        var ranges = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ranges[_i] = arguments[_i];
        }
        var sorted = ranges.sort(function (a, b) {
            return a.min - b.min;
        });
        for (var i = 0; i < sorted.length - 1; i++) {
            if (sorted[i].max > sorted[i + 1].min) {
                return true;
            }
        }
        return false;
    }
    exports.rangesHaveOverlap = rangesHaveOverlap;
    function excludeFromRange(range, toExclude) {
        if (toExclude.max < range.min || toExclude.min > range.max) {
            return null;
        }
        else if (toExclude.min < range.min && toExclude.max > range.max) {
            return null;
        }
        if (toExclude.min <= range.min) {
            return ([{ min: toExclude.max, max: range.max }]);
        }
        else if (toExclude.max >= range.max) {
            return ([{ min: range.min, max: toExclude.min }]);
        }
        return ([
            {
                min: range.min,
                max: toExclude.min,
            },
            {
                min: toExclude.max,
                max: range.max,
            },
        ]);
    }
    exports.excludeFromRange = excludeFromRange;
    function randomSelectFromRanges(ranges) {
        var totalWeight = 0;
        var currentRelativeWeight = 0;
        var rangesByRelativeWeight = {};
        for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            if (!isFinite(range.max)) {
                range.max = 1;
            }
            if (!isFinite(range.min)) {
                range.min = 0;
            }
            var weight = range.max - range.min;
            totalWeight += weight;
        }
        for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            var relativeWeight = (range.max - range.min) / totalWeight;
            if (totalWeight === 0) {
                relativeWeight = 1;
            }
            currentRelativeWeight += relativeWeight;
            rangesByRelativeWeight[currentRelativeWeight] = range;
        }
        var rand = Math.random();
        var sortedWeights = Object.keys(rangesByRelativeWeight).map(function (weight) { return parseFloat(weight); }).sort();
        for (var i = 0; i < sortedWeights.length; i++) {
            if (rand < sortedWeights[i]) {
                var selectedRange = rangesByRelativeWeight[sortedWeights[i]];
                return utility_1.randRange(selectedRange.min, selectedRange.max);
            }
        }
        throw new Error("Couldn't select from ranges.");
    }
    exports.randomSelectFromRanges = randomSelectFromRanges;
});
define("src/ReactUI", ["require", "exports", "react", "react-dom", "src/GameModuleInitializationPhase", "src/activePlayer", "src/eventManager", "src/Options", "src/activeModuleData"], function (require, exports, React, ReactDOM, GameModuleInitializationPhase_1, activePlayer_1, eventManager_1, Options_1, activeModuleData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var moduleInitializationPhaseByScene = {
        battle: GameModuleInitializationPhase_1.GameModuleInitializationPhase.BattleStart,
        battlePrep: GameModuleInitializationPhase_1.GameModuleInitializationPhase.BattlePrep,
        galaxyMap: GameModuleInitializationPhase_1.GameModuleInitializationPhase.GameStart,
        setupGame: GameModuleInitializationPhase_1.GameModuleInitializationPhase.GameSetup,
        errorRecovery: GameModuleInitializationPhase_1.GameModuleInitializationPhase.AppInit,
        flagMaker: GameModuleInitializationPhase_1.GameModuleInitializationPhase.GameSetup,
        battleSceneTester: GameModuleInitializationPhase_1.GameModuleInitializationPhase.BattleStart,
        vfxEditor: GameModuleInitializationPhase_1.GameModuleInitializationPhase.BattleStart,
    };
    var ReactUI = (function () {
        function ReactUI(container, moduleInitializer) {
            this.container = container;
            this.moduleInitializer = moduleInitializer;
            this.addEventListeners();
        }
        ReactUI.prototype.switchScene = function (newScene) {
            var _this = this;
            this.currentScene = newScene;
            return this.initializeModulesNeededForCurrentScene().then(function () {
                _this.render();
            });
        };
        ReactUI.prototype.destroy = function () {
            eventManager_1.eventManager.removeAllListeners("switchScene");
            eventManager_1.eventManager.removeAllListeners("renderUI");
            ReactDOM.unmountComponentAtNode(this.container);
            this.container = null;
        };
        ReactUI.prototype.render = function () {
            var elementToRender = this.getElementToRender();
            ReactDOM.render(React.createElement(React.StrictMode, null, activeModuleData_1.activeModuleData.uiScenes.topLevelErrorBoundary({
                errorReportingMode: Options_1.options.system.errorReporting,
            }, elementToRender)), this.container);
        };
        ReactUI.prototype.addEventListeners = function () {
            eventManager_1.eventManager.addEventListener("switchScene", this.switchScene.bind(this));
            eventManager_1.eventManager.addEventListener("renderUI", this.render.bind(this));
        };
        ReactUI.prototype.initializeModulesNeededForCurrentScene = function () {
            var phase = moduleInitializationPhaseByScene[this.currentScene];
            return this.moduleInitializer.initModulesNeededForPhase(phase);
        };
        ReactUI.prototype.getElementToRender = function () {
            switch (this.currentScene) {
                case "battle":
                    {
                        return activeModuleData_1.activeModuleData.uiScenes.battle({
                            battle: this.battle,
                            humanPlayer: this.player,
                        });
                    }
                case "battlePrep":
                    {
                        return activeModuleData_1.activeModuleData.uiScenes.battlePrep({
                            battlePrep: this.battlePrep,
                        });
                    }
                case "galaxyMap":
                    {
                        return activeModuleData_1.activeModuleData.uiScenes.galaxyMap({
                            renderer: this.renderer,
                            mapRenderer: this.mapRenderer,
                            playerControl: this.playerControl,
                            player: this.player,
                            game: this.game,
                            activeLanguage: Options_1.options.display.language,
                            notifications: activePlayer_1.activePlayer.notificationLog.unreadNotifications.slice(),
                            notificationLog: activePlayer_1.activePlayer.notificationLog,
                        });
                    }
                case "setupGame":
                    {
                        return activeModuleData_1.activeModuleData.uiScenes.setupGame();
                    }
                case "errorRecovery":
                    {
                        return activeModuleData_1.activeModuleData.uiScenes.errorRecovery({
                            game: this.game,
                            error: this.error,
                        });
                    }
                case "flagMaker":
                    {
                        return activeModuleData_1.activeModuleData.uiScenes.flagMaker();
                    }
                case "battleSceneTester":
                    {
                        return activeModuleData_1.activeModuleData.uiScenes.battleSceneTester();
                    }
                case "vfxEditor":
                    {
                        return activeModuleData_1.activeModuleData.uiScenes.vfxEditor();
                    }
            }
        };
        return ReactUI;
    }());
    exports.ReactUI = ReactUI;
});
define("src/Rect", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/RectangleSelect", ["require", "exports", "pixi.js", "src/eventManager"], function (require, exports, PIXI, eventManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RectangleSelect = (function () {
        function RectangleSelect(gfxContainer, targetLayer) {
            this.minimumSizeThreshhold = 5;
            this.gfxContainer = gfxContainer;
            this.targetLayer = targetLayer;
            this.graphics = new PIXI.Graphics();
            gfxContainer.addChild(this.graphics);
            this.addEventListeners();
        }
        RectangleSelect.prototype.destroy = function () {
            this.gfxContainer.removeChild(this.graphics);
            this.gfxContainer = null;
            this.graphics = null;
            this.toSelectFrom = null;
            this.getSelectionTargetsFN = null;
        };
        RectangleSelect.prototype.startSelection = function (point) {
            this.startLocal = this.targetLayer.worldTransform.applyInverse(new PIXI.Point(point.x, point.y));
            this.currentGlobal = { x: point.x, y: point.y };
        };
        RectangleSelect.prototype.moveSelection = function (point) {
            this.currentGlobal = { x: point.x, y: point.y };
            this.drawSelectionRectangle();
        };
        RectangleSelect.prototype.endSelection = function () {
            var bounds = this.getBounds();
            if (bounds.width < this.minimumSizeThreshhold || bounds.height < this.minimumSizeThreshhold) {
                return;
            }
            this.setSelectionTargets();
            var inSelection = this.getAllInSelection();
            eventManager_1.eventManager.dispatchEvent("selectFleets", inSelection);
            this.clearSelection();
        };
        RectangleSelect.prototype.clearSelection = function () {
            this.graphics.clear();
            this.startLocal = null;
            this.currentGlobal = null;
        };
        RectangleSelect.prototype.handleTargetLayerShift = function () {
            var _this = this;
            window.requestAnimationFrame(function () {
                _this.drawSelectionRectangle();
            });
        };
        RectangleSelect.prototype.addEventListeners = function () {
            eventManager_1.eventManager.dispatchEvent("setRectangleSelectTargetFN", this);
        };
        RectangleSelect.prototype.drawSelectionRectangle = function () {
            if (!this.currentGlobal) {
                return;
            }
            var bounds = this.getBounds();
            this.graphics.clear();
            this.graphics.lineStyle(1, 0xFFFFFF, 1);
            this.graphics.beginFill(0x000000, 0);
            this.graphics.drawRect(bounds.left, bounds.top, bounds.width, bounds.height);
            this.graphics.endFill();
        };
        RectangleSelect.prototype.setSelectionTargets = function () {
            if (!this.getSelectionTargetsFN) {
                return;
            }
            this.toSelectFrom = this.getSelectionTargetsFN();
        };
        RectangleSelect.prototype.getBounds = function () {
            var startGlobal = this.targetLayer.worldTransform.apply(this.startLocal);
            var x1 = Math.round(Math.min(startGlobal.x, this.currentGlobal.x));
            var x2 = Math.round(Math.max(startGlobal.x, this.currentGlobal.x));
            var y1 = Math.round(Math.min(startGlobal.y, this.currentGlobal.y));
            var y2 = Math.round(Math.max(startGlobal.y, this.currentGlobal.y));
            return ({
                left: x1,
                top: y1,
                right: x2,
                bottom: y2,
                width: x2 - x1,
                height: y2 - y1,
            });
        };
        RectangleSelect.prototype.getAllInSelection = function () {
            var toReturn = [];
            for (var i = 0; i < this.toSelectFrom.length; i++) {
                if (this.selectionContains(this.toSelectFrom[i].position)) {
                    toReturn.push(this.toSelectFrom[i].data);
                }
            }
            return toReturn;
        };
        RectangleSelect.prototype.selectionContains = function (point) {
            var pixiPoint = new PIXI.Point(point.x, point.y);
            var transformedPoint = this.targetLayer.worldTransform.apply(pixiPoint);
            var x = transformedPoint.x;
            var y = transformedPoint.y;
            var bounds = this.getBounds();
            return ((x >= bounds.left && x <= bounds.right) &&
                (y >= bounds.top && y <= bounds.bottom));
        };
        return RectangleSelect;
    }());
    exports.RectangleSelect = RectangleSelect;
});
define("src/Region", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Region = (function () {
        function Region(id, initialStars) {
            var _this = this;
            this.stars = [];
            this.starsById = {};
            this.id = id;
            if (initialStars) {
                initialStars.forEach(function (star) { return _this.addStar(star); });
            }
        }
        Region.prototype.addStar = function (star) {
            this.stars.push(star);
            this.starsById[star.id] = star;
        };
        Region.prototype.hasStar = function (star) {
            return Boolean(this.starsById[star.id]);
        };
        Region.prototype.severLinksToRegionsExcept = function (exemptRegions) {
            this.severLinksForQualifier(function (a, b) {
                var isPartOfExemptRegion = exemptRegions.some(function (region) {
                    return region.hasStar(b);
                });
                return !isPartOfExemptRegion;
            });
        };
        Region.prototype.getBorderLengthWithStars = function (stars) {
            var sharedHalfEdges = this.getSharedHalfEdgesWithStars(stars);
            var borderLength = sharedHalfEdges.reduce(function (totalLength, halfEdge) {
                var edge = halfEdge.edge;
                var edgeLength = Math.abs(edge.va.x - edge.vb.x) + Math.abs(edge.va.y - edge.vb.y);
                return totalLength + edgeLength;
            }, 0);
            return borderLength;
        };
        Region.prototype.getStarsByDistanceToQualifier = function (qualifierFN) {
            var starsByDistance = {};
            this.stars.forEach(function (star) {
                var nearestStar = star.getNearestStarForQualifier(qualifierFN);
                var distanceToNearestStar = star.getDistanceToStar(nearestStar);
                if (!starsByDistance[distanceToNearestStar]) {
                    starsByDistance[distanceToNearestStar] = [];
                }
                starsByDistance[distanceToNearestStar].push(star);
            });
            return starsByDistance;
        };
        Region.prototype.getLinkedStars = function () {
            var _this = this;
            return this.getUniqueStarsFromCallback(function (star) {
                var linkedStars = star.getLinkedInRange(1).all;
                return linkedStars.filter(function (linkedStar) {
                    return !_this.hasStar(linkedStar);
                });
            });
        };
        Region.prototype.getMajorityRegions = function (regionsToCheck) {
            var overlappingStarsWithRegions = this.getOverlappingStarsWithRegions(regionsToCheck);
            var maxStarCount = 0;
            var regionsByOverlappingStarCount = {};
            overlappingStarsWithRegions.forEach(function (regionWithStars) {
                var starCount = regionWithStars.stars.length;
                if (!regionsByOverlappingStarCount[starCount]) {
                    regionsByOverlappingStarCount[starCount] = [];
                }
                regionsByOverlappingStarCount[starCount].push(regionWithStars.region);
                maxStarCount = Math.max(maxStarCount, starCount);
            });
            return regionsByOverlappingStarCount[maxStarCount];
        };
        Region.prototype.getLinkedRegions = function (regionsToCheck) {
            return this.getLinkedStarsWithRegions(regionsToCheck).map(function (rs) {
                return rs.region;
            });
        };
        Region.prototype.getSharedHalfEdgesWithStars = function (stars) {
            var _this = this;
            var toCheckRegion = new Region(null, stars);
            var sharedStarsWithRegion = this.getNeighboringStarsWithRegions([toCheckRegion])[0];
            var neighboringStars = sharedStarsWithRegion ? sharedStarsWithRegion.stars : [];
            var sharedHalfEdges = [];
            neighboringStars.forEach(function (star) {
                star.voronoiCell.halfedges.forEach(function (halfEdge) {
                    var edge = halfEdge.edge;
                    var edgeNeighborsThisRegion = ((edge.lSite && _this.hasStar(edge.lSite)) ||
                        (edge.rSite && _this.hasStar(edge.rSite)));
                    if (edgeNeighborsThisRegion) {
                        sharedHalfEdges.push(halfEdge);
                    }
                });
            });
            return sharedHalfEdges;
        };
        Region.prototype.getLinkedStarsWithRegions = function (regionsToCheck) {
            return Region.getRegionsWithStarsForQualifier(regionsToCheck, this.getLinkedStars(), function (region, star) { return region.hasStar(star); });
        };
        Region.prototype.getOverlappingStarsWithRegions = function (regionsToCheck) {
            return Region.getRegionsWithStarsForQualifier(regionsToCheck, this.stars, function (region, star) { return region.hasStar(star); });
        };
        Region.prototype.getNeighboringStarsWithRegions = function (regionsToCheck) {
            return Region.getRegionsWithStarsForQualifier(regionsToCheck, this.getNeighboringStars(), function (region, star) { return region.hasStar(star); });
        };
        Region.getRegionsWithStarsForQualifier = function (regionsToCheck, starsToCheck, qualifierFN) {
            var regionsWithStarsForQualifier = regionsToCheck.map(function (region) {
                var starsThatPassQualifier = starsToCheck.filter(function (star) {
                    return qualifierFN(region, star);
                });
                return ({
                    region: region,
                    stars: starsThatPassQualifier,
                });
            });
            return regionsWithStarsForQualifier.filter(function (regionWithStars) {
                return regionWithStars.stars.length > 0;
            });
        };
        Region.prototype.severLinksForQualifier = function (qualifierFN) {
            this.stars.forEach(function (star) {
                star.getAllLinks().forEach(function (linkedStar) {
                    if (qualifierFN(star, linkedStar)) {
                        star.removeLink(linkedStar);
                    }
                });
            });
        };
        Region.prototype.getNeighboringStars = function () {
            var _this = this;
            return this.getUniqueStarsFromCallback(function (star) {
                var neighborPoints = star.getNeighbors();
                return neighborPoints.filter(function (neighbor) {
                    return isFinite(neighbor.id);
                }).filter(function (neighborStar) {
                    return !_this.hasStar(neighborStar);
                });
            });
        };
        Region.prototype.getUniqueStarsFromCallback = function (callbackFN) {
            var resultStars = [];
            var alreadyAdded = {};
            this.stars.forEach(function (sourceStar) {
                var starsFromCallback = callbackFN(sourceStar);
                var newStarsFromCallback = starsFromCallback.filter(function (star) {
                    return !alreadyAdded[star.id];
                });
                newStarsFromCallback.forEach(function (newStar) {
                    alreadyAdded[newStar.id] = true;
                    resultStars.push(newStar);
                });
            });
            return resultStars;
        };
        return Region;
    }());
    exports.Region = Region;
});
define("src/Renderer", ["require", "exports", "pixi.js", "src/BackgroundDrawer", "src/Camera", "src/MouseEventHandler", "src/PathfindingArrow"], function (require, exports, PIXI, BackgroundDrawer_1, Camera_1, MouseEventHandler_1, PathfindingArrow_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Renderer = (function () {
        function Renderer(backgroundSeed, backgroundDrawingFunction) {
            this.activeRenderLoopId = 0;
            this.isPaused = false;
            this.forceFrame = false;
            PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
            this.stage = new PIXI.Container();
            this.backgroundDrawer = new BackgroundDrawer_1.BackgroundDrawer({
                seed: backgroundSeed,
                drawBackgroundFN: backgroundDrawingFunction,
            });
            this.setupDefaultLayers();
            this.activeRenderLoopId++;
            this.stage.renderable = true;
            this.resizeListener = this.resize.bind(this);
            window.addEventListener("resize", this.resizeListener, false);
        }
        Renderer.prototype.destroy = function () {
            this.stage.renderable = false;
            this.pause();
            this.backgroundDrawer.destroy();
            this.removeCamera();
            if (this.renderer) {
                this.renderer.destroy(true);
                this.renderer = null;
            }
            this.stage.destroy(true);
            this.stage = null;
            this.pixiContainer = null;
            window.removeEventListener("resize", this.resizeListener);
        };
        Renderer.prototype.removeRendererView = function () {
            if (this.renderer && this.renderer.view.parentNode) {
                this.renderer.view.parentNode.removeChild(this.renderer.view);
            }
            this.removeCamera();
        };
        Renderer.prototype.bindRendererView = function (container) {
            this.pixiContainer = container;
            if (!this.renderer) {
                var containerStyle = window.getComputedStyle(this.pixiContainer);
                this.renderer = new PIXI.Renderer({
                    width: parseInt(containerStyle.width),
                    height: parseInt(containerStyle.height),
                    autoDensity: false,
                    antialias: true,
                });
                this.backgroundDrawer.setExternalRenderer(this.renderer);
            }
            this.pixiContainer.appendChild(this.renderer.view);
            this.renderer.view.setAttribute("id", "pixi-canvas");
            this.backgroundDrawer.bindRendererView(this.pixiContainer);
            this.resize();
            this.addCamera();
        };
        Renderer.prototype.pause = function () {
            this.isPaused = true;
            this.forceFrame = false;
        };
        Renderer.prototype.resume = function () {
            this.isPaused = false;
            this.forceFrame = false;
            this.activeRenderLoopId = this.activeRenderLoopId++;
            this.render(this.activeRenderLoopId);
        };
        Renderer.prototype.setupDefaultLayers = function () {
            this.layers =
                {
                    background: this.backgroundDrawer.pixiContainer,
                    main: new PIXI.Container(),
                    map: new PIXI.Container(),
                    select: new PIXI.Container(),
                };
            this.stage.removeChildren();
            this.stage.addChild(this.layers.background);
            this.layers.background.interactive = false;
            this.layers.background.interactiveChildren = false;
            this.stage.addChild(this.layers.main);
            this.layers.main.addChild(this.layers.map);
            this.stage.addChild(this.layers.select);
            this.layers.select.interactive = false;
            this.layers.select.interactiveChildren = false;
        };
        Renderer.prototype.removeCamera = function () {
            if (this.pathfindingArrow) {
                this.pathfindingArrow.destroy();
                this.pathfindingArrow = null;
            }
            if (this.mouseEventHandler) {
                this.mouseEventHandler.destroy();
                this.mouseEventHandler = null;
            }
            if (this.camera) {
                this.camera.destroy();
                this.camera = null;
            }
        };
        Renderer.prototype.addCamera = function () {
            this.removeCamera();
            this.camera = new Camera_1.Camera(this.layers.main);
            this.mouseEventHandler = new MouseEventHandler_1.MouseEventHandler(this.renderer.plugins.interaction, this.camera, this.layers.select, this.layers.main);
            this.pathfindingArrow = new PathfindingArrow_1.PathfindingArrow(this.layers.main);
        };
        Renderer.prototype.resize = function () {
            if (this.renderer && document.body.contains(this.renderer.view)) {
                var w = this.pixiContainer.offsetWidth * window.devicePixelRatio;
                var h = this.pixiContainer.offsetHeight * window.devicePixelRatio;
                this.renderer.resize(w, h);
                this.backgroundDrawer.handleResize();
                if (this.isPaused) {
                    this.renderOnce();
                }
            }
        };
        Renderer.prototype.renderOnce = function () {
            this.forceFrame = true;
            this.render();
        };
        Renderer.prototype.render = function (renderLoopId) {
            if (!document.body.contains(this.pixiContainer)) {
                this.pause();
                return;
            }
            if (this.isPaused) {
                if (this.forceFrame) {
                    this.forceFrame = false;
                }
                else {
                    return;
                }
            }
            this.renderer.render(this.stage);
            if (this.activeRenderLoopId === renderLoopId) {
                window.requestAnimationFrame(this.render.bind(this, renderLoopId));
            }
        };
        return Renderer;
    }());
    exports.Renderer = Renderer;
});
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("src/reviveSaveData", ["require", "exports", "src/App", "src/versions", "src/debug", "src/utility", "src/ModuleStore"], function (require, exports, App_1, semver, debug, utility_1, ModuleStore_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function fetchNeededReviversForData(dataVersion, liveVersion, revivers) {
        var neededRevivers = [];
        Object.keys(revivers).sort(semver.compare).reverse().filter(function (reviverDataVersion) {
            if (!dataVersion) {
                return true;
            }
            return semver.gte(reviverDataVersion, dataVersion) && semver.lt(reviverDataVersion, liveVersion);
        }).forEach(function (reviverVersion) {
            neededRevivers.push.apply(neededRevivers, revivers[reviverVersion]);
        });
        return neededRevivers;
    }
    exports.fetchNeededReviversForData = fetchNeededReviversForData;
    function reviveSaveData(data, liveAppVersion) {
        var clonedData = __assign({}, data);
        return new Promise(function (resolve) {
            reviveCoreSaveData(clonedData, liveAppVersion);
            reviveModuleSaveData(clonedData).then(function () {
                resolve(clonedData);
            });
        });
    }
    exports.reviveSaveData = reviveSaveData;
    var coreSaveDataRevivers = {
        "0.0.0": [
            function setAppVersion(saveData) {
                saveData.appVersion = "0.0.0";
            },
            function addDummyModuleData(saveData) {
                saveData.moduleData = App_1.app.initialModules.map(function (moduleInfo) {
                    return ({
                        metaData: __assign({}, moduleInfo, { version: "0.0.0" }),
                        moduleSaveData: {},
                    });
                });
            },
        ],
        "0.1.0": [
            function renameUnitSaveDataAbilityKeys(saveData) {
                saveData.gameData.units.forEach(function (unitData) {
                    unitData.abilityTypes = unitData.abilityTemplateTypes;
                    unitData.passiveSkillTypes = unitData.passiveSkillTemplateTypes;
                });
            },
        ],
        "0.2.0": [
            function renameModuleMetaDataToModuleInfo(saveData) {
                saveData.moduleData.forEach(function (moduleSaveData) {
                    moduleSaveData.info = moduleSaveData.metaData;
                });
            },
        ],
        "0.3.0": [
            function remapModuleInfoKeys(saveData) {
                saveData.moduleData.forEach(function (moduleSaveData) {
                    moduleSaveData.info.gameModuleVariableName = moduleSaveData.info.moduleFileVariableName;
                    moduleSaveData.info.moduleBundleUrl = moduleSaveData.info.moduleFileUrl;
                });
            }
        ]
    };
    function reviveModuleSaveData(data) {
        return new Promise(function (resolve) {
            var modulesInData = data.moduleData.map(function (moduleData) { return moduleData.info; });
            ModuleStore_1.activeModuleStore.getModules.apply(ModuleStore_1.activeModuleStore, modulesInData).then(function (gameModules) {
                gameModules.forEach(function (gameModule) {
                    if (gameModule.reviveGameData) {
                        gameModule.reviveGameData(data);
                    }
                });
            }).then(resolve);
        });
    }
    function reviveCoreSaveData(data, liveAppVersion) {
        var reviversToExecute = fetchNeededReviversForData(data.appVersion, liveAppVersion, coreSaveDataRevivers);
        reviversToExecute.forEach(function (reviverFN) {
            debug.log("saves", "Executing stored core save data reviver function '" + utility_1.getFunctionName(reviverFN) + "'");
            reviverFN(data);
        });
    }
});
define("src/Star", ["require", "exports", "src/App", "src/activeModuleData", "src/activePlayer", "src/BuildingCollection", "src/Manufactory", "src/eventManager", "src/idGenerators", "src/pathFinding", "src/FlatAndMultiplierAdjustment", "src/utility"], function (require, exports, App_1, activeModuleData_1, activePlayer_1, BuildingCollection_1, Manufactory_1, eventManager_1, idGenerators_1, pathFinding_1, FlatAndMultiplierAdjustment_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Star = (function () {
        function Star(props) {
            var _this = this;
            this.linksTo = [];
            this.linksFrom = [];
            this.fleets = {};
            this.indexedNeighborsInRange = {};
            this.indexedDistanceToStar = {};
            this.x = props.x;
            this.y = props.y;
            this.id = isFinite(props.id) ? props.id : idGenerators_1.idGenerators.star++;
            this.seed = props.seed || this.generateSeedString();
            this.name = props.name || "Star " + this.id;
            this.localRace = props.race;
            this.terrain = props.terrain;
            this.buildings = new BuildingCollection_1.BuildingCollection({
                onAddBuilding: function (building) {
                    if (isFinite(building.template.maxBuiltGlobally) ||
                        building.template.families.some(function (family) {
                            return isFinite(family.maxBuiltGlobally);
                        })) {
                        _this.galaxyMap.globallyLimitedBuildings.add(building);
                    }
                    var effect = building.getEffect();
                    var buildingChangesVision = effect.vision || effect.detection;
                    if (buildingChangesVision) {
                        _this.owner.updateVisibleStars();
                    }
                    var isTerritoryBuilding = building.template.isTerritoryBuilding;
                    if (isTerritoryBuilding) {
                        eventManager_1.eventManager.dispatchEvent("renderLayer", "nonFillerStars", _this);
                    }
                    if (_this.owner === activePlayer_1.activePlayer) {
                        for (var key in effect) {
                            eventManager_1.eventManager.dispatchEvent("builtBuildingWithEffect_" + key);
                        }
                        eventManager_1.eventManager.dispatchEvent("humanPlayerBuiltBuilding");
                    }
                },
                onRemoveBuilding: function (building) {
                    if (isFinite(building.template.maxBuiltGlobally) ||
                        building.template.families.some(function (family) {
                            return isFinite(family.maxBuiltGlobally);
                        })) {
                        _this.galaxyMap.globallyLimitedBuildings.remove(building);
                    }
                },
                onUpgradeBuilding: function (building, oldTemplate) {
                    var effect = building.getEffect();
                    if (_this.owner === activePlayer_1.activePlayer) {
                        for (var key in effect) {
                            eventManager_1.eventManager.dispatchEvent("builtBuildingWithEffect_" + key);
                        }
                        eventManager_1.eventManager.dispatchEvent("humanPlayerBuiltBuilding");
                    }
                }
            });
        }
        Object.defineProperty(Star.prototype, "territoryBuildings", {
            get: function () {
                return this.buildings.filter(function (building) {
                    return building.template.isTerritoryBuilding;
                });
            },
            enumerable: true,
            configurable: true
        });
        Star.getIslandForQualifier = function (initialStars, earlyReturnSize, qualifier) {
            var visited = {};
            var connected = {};
            var sizeFound = 1;
            var frontier = initialStars.slice(0);
            initialStars.forEach(function (star) {
                visited[star.id] = true;
            });
            while (frontier.length > 0) {
                var current = frontier.pop();
                connected[current.id] = current;
                var neighbors = current.getLinkedInRange(1).all;
                for (var i = 0; i < neighbors.length; i++) {
                    var neighbor = neighbors[i];
                    if (visited[neighbor.id]) {
                        continue;
                    }
                    visited[neighbor.id] = true;
                    if (qualifier(current, neighbor)) {
                        sizeFound++;
                        frontier.push(neighbor);
                    }
                }
                if (earlyReturnSize && sizeFound >= earlyReturnSize) {
                    for (var i = 0; i < frontier.length; i++) {
                        connected[frontier[i].id] = frontier[i];
                    }
                    break;
                }
            }
            var island = [];
            for (var starId in connected) {
                island.push(connected[starId]);
            }
            return island;
        };
        Star.prototype.getSecondaryController = function () {
            var territoryBuildings = this.territoryBuildings;
            for (var i = 0; i < territoryBuildings.length; i++) {
                if (territoryBuildings[i].controller !== this.owner) {
                    return territoryBuildings[i].controller;
                }
            }
            return null;
        };
        Star.prototype.updateController = function () {
            var oldOwner = this.owner;
            var newOwner = this.territoryBuildings[0].controller;
            if (oldOwner && oldOwner !== newOwner) {
                this.changeOwner(newOwner);
            }
        };
        Star.prototype.changeOwner = function (newOwner) {
            var _this = this;
            var oldOwner = this.owner;
            oldOwner.removeStar(this);
            newOwner.addStar(this);
            if (this.manufactory) {
                this.manufactory.handleOwnerChange();
            }
            activeModuleData_1.activeModuleData.scripts.star.onOwnerChange.forEach(function (script) {
                script(_this, oldOwner, newOwner);
            });
            eventManager_1.eventManager.dispatchEvent("renderLayer", "nonFillerStars", this);
            eventManager_1.eventManager.dispatchEvent("renderLayer", "starOwners", this);
            eventManager_1.eventManager.dispatchEvent("renderLayer", "ownerBorders", this);
        };
        Star.prototype.getIncome = function () {
            var buildingsEffect = this.buildings.getEffects().income;
            return FlatAndMultiplierAdjustment_1.applyFlatAndMultiplierAdjustments(this.baseIncome, buildingsEffect);
        };
        Star.prototype.getResearchPoints = function () {
            var basePoints = activeModuleData_1.activeModuleData.ruleSet.research.baseResearchPointsPerStar;
            var buildingsEffect = this.buildings.getEffects().researchPoints;
            return FlatAndMultiplierAdjustment_1.applyFlatAndMultiplierAdjustments(basePoints, buildingsEffect);
        };
        Star.prototype.getResourceIncome = function () {
            if (!this.resource) {
                return null;
            }
            var baseAmount = 0;
            var buildingsEffect = this.buildings.getEffects().resourceIncome;
            var finalAmount = FlatAndMultiplierAdjustment_1.applyFlatAndMultiplierAdjustments(baseAmount, buildingsEffect);
            return ({
                resource: this.resource,
                amount: finalAmount,
            });
        };
        Star.prototype.getFleets = function (playerFilter) {
            var allFleets = [];
            for (var playerId in this.fleets) {
                var playerFleets = this.fleets[playerId];
                if (playerFleets.length > 0) {
                    var player = this.fleets[playerId][0].player;
                    if (!playerFilter || playerFilter(player) === true) {
                        allFleets.push.apply(allFleets, playerFleets);
                    }
                }
            }
            return allFleets;
        };
        Star.prototype.getUnits = function (playerFilter) {
            var fleets = this.getFleets(playerFilter);
            var units = [];
            fleets.forEach(function (fleet) {
                units.push.apply(units, fleet.units);
            });
            return units;
        };
        Star.prototype.getFleetOwners = function () {
            var fleetOwners = [];
            for (var playerId in this.fleets) {
                if (this.fleets[playerId].length > 0) {
                    fleetOwners.push(this.fleets[playerId][0].player);
                }
            }
            return fleetOwners;
        };
        Star.prototype.getFleetIndex = function (fleet) {
            if (!this.fleets[fleet.player.id]) {
                return -1;
            }
            return this.fleets[fleet.player.id].indexOf(fleet);
        };
        Star.prototype.hasFleet = function (fleet) {
            return this.getFleetIndex(fleet) !== -1;
        };
        Star.prototype.addFleet = function (fleet) {
            if (!this.fleets[fleet.player.id]) {
                this.fleets[fleet.player.id] = [];
            }
            if (this.hasFleet(fleet)) {
                throw new Error("Star " + this.name + " already has fleet " + fleet.name);
            }
            fleet.location = this;
            this.fleets[fleet.player.id].push(fleet);
        };
        Star.prototype.removeFleet = function (fleet) {
            var fleetIndex = this.getFleetIndex(fleet);
            if (fleetIndex < 0) {
                throw new Error("Star " + this.name + " doesn't have fleet " + fleet.name);
            }
            this.fleets[fleet.player.id].splice(fleetIndex, 1);
            if (this.fleets[fleet.player.id].length === 0) {
                delete this.fleets[fleet.player.id];
            }
        };
        Star.prototype.getTargetsForPlayer = function (player) {
            var buildingTarget = this.getFirstEnemyTerritoryBuilding(player);
            var buildingController = buildingTarget ? buildingTarget.controller : null;
            var targets = [];
            if (buildingTarget && player.diplomacy.canAttackBuildingOfPlayer(buildingTarget.controller)) {
                targets.push({
                    type: "building",
                    enemy: buildingTarget.controller,
                    building: buildingTarget,
                    units: this.getUnits(function (unitOwner) { return unitOwner === buildingTarget.controller; }),
                });
            }
            var hostileFleetOwners = this.getFleetOwners().filter(function (fleetOwner) {
                if (fleetOwner === buildingController) {
                    return false;
                }
                else {
                    return player.diplomacy.canAttackFleetOfPlayer(fleetOwner);
                }
            });
            var _loop_1 = function (i) {
                if (player.diplomacy.canAttackFleetOfPlayer(hostileFleetOwners[i])) {
                    targets.push({
                        type: "fleet",
                        enemy: hostileFleetOwners[i],
                        building: null,
                        units: this_1.getUnits(function (unitOwner) { return unitOwner === hostileFleetOwners[i]; }),
                    });
                }
            };
            var this_1 = this;
            for (var i = 0; i < hostileFleetOwners.length; i++) {
                _loop_1(i);
            }
            return targets;
        };
        Star.prototype.hasBuildingTargetForPlayer = function (player) {
            return this.getTargetsForPlayer(player).some(function (target) {
                return target.type === "building";
            });
        };
        Star.prototype.getFirstEnemyTerritoryBuilding = function (player) {
            var territoryBuildings = this.territoryBuildings;
            if (this.owner === player) {
                territoryBuildings.reverse();
            }
            for (var i = territoryBuildings.length - 1; i >= 0; i--) {
                if (territoryBuildings[i].controller.id !== player.id) {
                    return territoryBuildings[i];
                }
            }
            return null;
        };
        Star.prototype.hasLink = function (linkTo) {
            return this.linksTo.indexOf(linkTo) >= 0 || this.linksFrom.indexOf(linkTo) >= 0;
        };
        Star.prototype.addLink = function (linkTo) {
            if (this.hasLink(linkTo)) {
                return;
            }
            this.linksTo.push(linkTo);
            linkTo.linksFrom.push(this);
        };
        Star.prototype.removeLink = function (linkTo, removeOpposite) {
            if (removeOpposite === void 0) { removeOpposite = true; }
            if (!this.hasLink(linkTo)) {
                throw new Error("Tried to remove nonexistant link between stars: " + this.id + " <-> " + linkTo.id);
            }
            var toIndex = this.linksTo.indexOf(linkTo);
            if (toIndex >= 0) {
                this.linksTo.splice(toIndex, 1);
            }
            else {
                this.linksFrom.splice(this.linksFrom.indexOf(linkTo), 1);
            }
            if (removeOpposite) {
                linkTo.removeLink(this, false);
            }
        };
        Star.prototype.getAllLinks = function () {
            return this.linksTo.concat(this.linksFrom);
        };
        Star.prototype.getEdgeWith = function (neighbor) {
            for (var i = 0; i < this.voronoiCell.halfedges.length; i++) {
                var edge = this.voronoiCell.halfedges[i].edge;
                if ((edge.lSite && edge.lSite === neighbor) ||
                    (edge.rSite && edge.rSite === neighbor)) {
                    return edge;
                }
            }
            return null;
        };
        Star.prototype.getSharedNeighborsWith = function (neighbor) {
            var ownNeighbors = this.getNeighbors();
            var neighborNeighbors = neighbor.getNeighbors();
            var sharedNeighbors = [];
            for (var i = 0; i < ownNeighbors.length; i++) {
                var star = ownNeighbors[i];
                if (star !== neighbor && neighborNeighbors.indexOf(star) !== -1) {
                    sharedNeighbors.push(star);
                }
            }
            return sharedNeighbors;
        };
        Star.prototype.getNeighbors = function () {
            var neighbors = [];
            for (var i = 0; i < this.voronoiCell.halfedges.length; i++) {
                var edge = this.voronoiCell.halfedges[i].edge;
                if (edge.lSite !== null && edge.lSite.id !== this.id) {
                    neighbors.push(edge.lSite);
                }
                else if (edge.rSite !== null && edge.rSite.id !== this.id) {
                    neighbors.push(edge.rSite);
                }
            }
            return neighbors;
        };
        Star.prototype.getAllLinkedStars = function () {
            return this.getLinkedInRange(99999).all;
        };
        Star.prototype.getLinkedInRange = function (range) {
            if (this.indexedNeighborsInRange[range]) {
                return this.indexedNeighborsInRange[range];
            }
            var visited = {};
            var visitedByRange = {};
            if (range >= 0) {
                visited[this.id] = this;
            }
            var current = [];
            var frontier = [this];
            for (var i = 0; i < range; i++) {
                current = frontier.slice(0);
                if (current.length <= 0) {
                    break;
                }
                frontier = [];
                visitedByRange[i + 1] = [];
                for (var j = 0; j < current.length; j++) {
                    var neighbors = current[j].getAllLinks();
                    for (var k = 0; k < neighbors.length; k++) {
                        if (visited[neighbors[k].id]) {
                            continue;
                        }
                        visited[neighbors[k].id] = neighbors[k];
                        visitedByRange[i + 1].push(neighbors[k]);
                        frontier.push(neighbors[k]);
                        this.indexedDistanceToStar[neighbors[k].id] = i;
                    }
                }
            }
            var allVisited = [];
            for (var id in visited) {
                allVisited.push(visited[id]);
            }
            this.indexedNeighborsInRange[range] =
                {
                    all: allVisited,
                    byRange: visitedByRange,
                };
            return ({
                all: allVisited,
                byRange: visitedByRange,
            });
        };
        Star.prototype.getNearestStarForQualifier = function (qualifier) {
            if (qualifier(this)) {
                return this;
            }
            var visited = {};
            var frontier = [this];
            visited[this.id] = true;
            while (frontier.length > 0) {
                var current = frontier.shift();
                var neighbors = current.getLinkedInRange(1).all;
                for (var i = 0; i < neighbors.length; i++) {
                    var neighbor = neighbors[i];
                    if (visited[neighbor.id]) {
                        continue;
                    }
                    visited[neighbor.id] = true;
                    if (qualifier(neighbor)) {
                        return neighbor;
                    }
                    else {
                        frontier.push(neighbor);
                    }
                }
            }
            return null;
        };
        Star.prototype.getDistanceToStar = function (target) {
            if (!App_1.app.game) {
                var a = pathFinding_1.aStar(this, target);
                return a.cost[target.id];
            }
            if (!this.indexedDistanceToStar[target.id]) {
                var a = pathFinding_1.aStar(this, target);
                if (!a) {
                    this.indexedDistanceToStar[target.id] = -1;
                }
                else {
                    for (var id in a.cost) {
                        this.indexedDistanceToStar[id] = a.cost[id];
                    }
                }
            }
            return this.indexedDistanceToStar[target.id];
        };
        Star.prototype.getVisionRange = function () {
            var baseRange = activeModuleData_1.activeModuleData.ruleSet.vision.baseStarVisionRange;
            var buildingsEffect = this.buildings.getEffects().vision;
            return FlatAndMultiplierAdjustment_1.applyFlatAndMultiplierAdjustments(baseRange, buildingsEffect);
        };
        Star.prototype.getVision = function () {
            return this.getLinkedInRange(this.getVisionRange()).all;
        };
        Star.prototype.getDetectionRange = function () {
            var baseRange = activeModuleData_1.activeModuleData.ruleSet.vision.baseStarDetectionRange;
            var buildingsEffect = this.buildings.getEffects().detection;
            return FlatAndMultiplierAdjustment_1.applyFlatAndMultiplierAdjustments(baseRange, buildingsEffect);
        };
        Star.prototype.getDetection = function () {
            return this.getLinkedInRange(this.getDetectionRange()).all;
        };
        Star.prototype.getHealingFactor = function (player) {
            var factor = 0;
            if (player === this.owner) {
                factor += 0.15;
            }
            return factor;
        };
        Star.prototype.getPresentPlayersByVisibility = function () {
            var byVisibilityAndId = {
                visible: {},
                stealthy: {},
                all: {},
            };
            byVisibilityAndId.visible[this.owner.id] = this.owner;
            var secondaryController = this.getSecondaryController();
            if (secondaryController) {
                byVisibilityAndId.visible[secondaryController.id] = secondaryController;
            }
            for (var playerId in this.fleets) {
                var fleets = this.fleets[playerId];
                for (var i = 0; i < fleets.length; i++) {
                    var fleetPlayer = fleets[i].player;
                    if (byVisibilityAndId.stealthy[fleetPlayer.id] && byVisibilityAndId.visible[fleetPlayer.id]) {
                        break;
                    }
                    byVisibilityAndId.all[fleetPlayer.id] = fleetPlayer;
                    if (fleets[i].isStealthy) {
                        byVisibilityAndId.stealthy[fleetPlayer.id] = fleetPlayer;
                    }
                    else {
                        byVisibilityAndId.visible[fleetPlayer.id] = fleetPlayer;
                    }
                }
            }
            return byVisibilityAndId;
        };
        Star.prototype.generateSeedString = function () {
            return "" + Math.round(this.x) + Math.round(this.y) + new Date().getTime();
        };
        Star.prototype.buildManufactory = function () {
            this.manufactory = new Manufactory_1.Manufactory(this);
        };
        Star.prototype.serialize = function () {
            var data = {
                id: this.id,
                x: this.basisX,
                y: this.basisY,
                baseIncome: this.baseIncome,
                name: this.name,
                ownerId: this.owner ? this.owner.id : null,
                linksToIds: this.linksTo.map(function (star) { return star.id; }),
                linksFromIds: this.linksFrom.map(function (star) { return star.id; }),
                seed: this.seed,
                buildings: this.buildings.serialize(),
                raceType: this.localRace.type,
                terrainType: this.terrain.type,
            };
            if (this.resource) {
                data.resourceType = this.resource.type;
            }
            if (this.manufactory) {
                data.manufactory = this.manufactory.serialize();
            }
            return data;
        };
        Star.prototype.canBuildBuildingHere = function (templateToBuild, parentBuilding, localBuildingsByFamily) {
            var _this = this;
            if (localBuildingsByFamily === void 0) { localBuildingsByFamily = this.buildings.getBuildingsByFamily(); }
            var hasBuildingRestriction = Boolean(templateToBuild.canBeBuiltInLocation);
            if (hasBuildingRestriction) {
                if (!templateToBuild.canBeBuiltInLocation(this)) {
                    return false;
                }
            }
            var globalLimit = templateToBuild.maxBuiltGlobally || Infinity;
            if (isFinite(globalLimit)) {
                var globalBuilt = this.galaxyMap.globallyLimitedBuildings.filter(function (globalBuilding) {
                    return globalBuilding.template === templateToBuild;
                }).length;
                if (globalBuilt >= globalLimit) {
                    return false;
                }
            }
            var allPlayerBuildings = this.owner.getAllOwnedBuildings();
            var perPlayerLimit = templateToBuild.maxBuiltForPlayer || Infinity;
            if (isFinite(perPlayerLimit)) {
                var ownedByPlayer = allPlayerBuildings.filter(function (playerBuilding) {
                    return playerBuilding.template === templateToBuild;
                }).length;
                if (ownedByPlayer >= perPlayerLimit) {
                    return false;
                }
            }
            var localLimit = templateToBuild.maxBuiltAtLocation || Infinity;
            if (isFinite(localLimit)) {
                var localBuilt = this.buildings.filter(function (localBuilding) {
                    return localBuilding.template === templateToBuild;
                }).length;
                if (localBuilt >= localLimit) {
                    return false;
                }
            }
            var isGloballyLimitedByFamily = templateToBuild.families.some(function (templateFamily) {
                var familyGlobalLimit = templateFamily.maxBuiltGlobally || Infinity;
                if (isFinite(familyGlobalLimit)) {
                    var familyGlobalBuilt = _this.galaxyMap.globallyLimitedBuildings.filter(function (globalBuilding) {
                        return globalBuilding.isOfFamily(templateFamily);
                    }).length;
                    var familyLimitModifier = parentBuilding && parentBuilding.isOfFamily(templateFamily) ? 1 : 0;
                    if (familyGlobalBuilt >= familyGlobalLimit + familyLimitModifier) {
                        return true;
                    }
                }
                return false;
            });
            if (isGloballyLimitedByFamily) {
                return false;
            }
            var isPlayerLimitedByFamily = templateToBuild.families.some(function (templateFamily) {
                var familyPerPlayerLimit = templateFamily.maxBuiltForPlayer || Infinity;
                if (isFinite(familyPerPlayerLimit)) {
                    var familyOwnedByPlayer = allPlayerBuildings.filter(function (playerBuilding) {
                        return playerBuilding.isOfFamily(templateFamily);
                    }).length;
                    var familyLimitModifier = parentBuilding && parentBuilding.isOfFamily(templateFamily) ? 1 : 0;
                    if (familyOwnedByPlayer >= familyPerPlayerLimit + familyLimitModifier) {
                        return true;
                    }
                }
                return false;
            });
            if (isPlayerLimitedByFamily) {
                return false;
            }
            var isLocallyLimitedByFamily = templateToBuild.families.some(function (templateFamily) {
                var familyLocalLimit = templateFamily.maxBuiltAtLocation || Infinity;
                if (isFinite(familyLocalLimit)) {
                    var familyLocalBuilt = localBuildingsByFamily[templateFamily.type] ?
                        localBuildingsByFamily[templateFamily.type].length :
                        0;
                    var familyLimitModifier = parentBuilding && parentBuilding.isOfFamily(templateFamily) ? 1 : 0;
                    if (familyLocalBuilt >= familyLocalLimit + familyLimitModifier) {
                        return true;
                    }
                }
                return false;
            });
            if (isLocallyLimitedByFamily) {
                return false;
            }
            return true;
        };
        Star.prototype.getBuildableBuildings = function () {
            var _this = this;
            var localBuildingsByFamily = this.buildings.getBuildingsByFamily();
            var allBuildings = this.owner.race.getBuildableBuildings().concat(this.localRace.getBuildableBuildings());
            var uniqueBuildings = utility_1.getUniqueArrayKeys(allBuildings, function (template) { return template.type; });
            var buildableBuildings = uniqueBuildings.filter(function (buildingTemplate) {
                var canBuildHere = _this.canBuildBuildingHere(buildingTemplate, null, localBuildingsByFamily);
                if (!canBuildHere) {
                    return false;
                }
                var isWithinOwnerTechLevel = !buildingTemplate.techRequirements ||
                    _this.owner.meetsTechRequirements(buildingTemplate.techRequirements);
                if (!isWithinOwnerTechLevel) {
                    return false;
                }
                return true;
            });
            return buildableBuildings;
        };
        Star.prototype.getBuildingUpgrades = function () {
            var _this = this;
            var ownerBuildings = this.buildings.filter(function (building) {
                return building.controller === _this.owner;
            });
            var specialUpgrades = [];
            if (this.owner.race.getSpecialBuildingUpgrades) {
                specialUpgrades.push.apply(specialUpgrades, this.owner.race.getSpecialBuildingUpgrades(ownerBuildings, this, this.owner));
            }
            var standardUpgrades = [];
            ownerBuildings.forEach(function (parentBuilding) {
                standardUpgrades.push.apply(standardUpgrades, parentBuilding.getStandardUpgrades());
            });
            var allUpgrades = specialUpgrades.concat(standardUpgrades);
            var validUpgrades = allUpgrades.filter(function (upgradeData) {
                return _this.canBuildBuildingHere(upgradeData.template, upgradeData.parentBuilding);
            });
            var upgradeDataByParentId = {};
            validUpgrades.forEach(function (upgradeData) {
                var parent = upgradeData.parentBuilding;
                if (!upgradeDataByParentId[parent.id]) {
                    upgradeDataByParentId[parent.id] = [];
                }
                upgradeDataByParentId[parent.id].push(upgradeData);
            });
            return upgradeDataByParentId;
        };
        return Star;
    }());
    exports.Star = Star;
});
define("src/StatusEffect", ["require", "exports", "src/idGenerators"], function (require, exports, idGenerators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StatusEffect = (function () {
        function StatusEffect(props) {
            this.turnsHasBeenActiveFor = 0;
            this.id = isFinite(props.id) ? props.id : idGenerators_1.idGenerators.statusEffect++;
            this.template = props.template;
            this.turnsToStayActiveFor = props.turnsToStayActiveFor;
            this.turnsHasBeenActiveFor = props.turnsHasBeenActiveFor || 0;
            this.sourceUnit = props.sourceUnit;
        }
        StatusEffect.prototype.clone = function () {
            var effect = new StatusEffect({
                template: this.template,
                turnsToStayActiveFor: this.turnsToStayActiveFor,
                turnsHasBeenActiveFor: this.turnsHasBeenActiveFor,
                id: this.id,
                sourceUnit: this.sourceUnit,
            });
            return effect;
        };
        StatusEffect.prototype.processTurnEnd = function () {
            this.turnsHasBeenActiveFor++;
        };
        StatusEffect.prototype.serialize = function () {
            return ({
                id: this.id,
                templateType: this.template.type,
                turnsToStayActiveFor: this.turnsToStayActiveFor,
                turnsHasBeenActiveFor: this.turnsHasBeenActiveFor,
                sourceUnitId: this.sourceUnit.id,
            });
        };
        return StatusEffect;
    }());
    exports.StatusEffect = StatusEffect;
});
define("src/storageStrings", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var basePrefix = "Rance.";
    exports.storageStrings = {
        basePrefix: basePrefix,
        savePrefix: basePrefix + "Save.",
        appVersion: basePrefix + "AppVersion",
        options: basePrefix + "Options",
        notificationFilter: basePrefix + "NotificationFilter",
        windowPositions: basePrefix + "WindowPositions",
        tutorialStatus: basePrefix + "TutorialStatus",
        panicSave: "panicSave",
        deprecated_language: basePrefix + "language",
        deprecated_options: basePrefix + "Options.0",
        deprecated_notificationFilter: basePrefix + "NotificationFilter.0",
    };
});
define("src/svgCache", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.svgCache = {
        battleSceneFlagFade: undefined,
    };
});
define("src/targeting", ["require", "exports", "src/utility"], function (require, exports, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.targetSelf = function (user, battle) {
        return [user];
    };
    exports.targetNextRow = function (user, battle) {
        var ownPosition = user.battleStats.position;
        var increment = user.battleStats.side === "side1" ? 1 : -1;
        var fullFormation = battle.side1.concat(battle.side2);
        return fullFormation[ownPosition[0] + increment].filter(function (unit) { return unit !== null; });
    };
    exports.targetAllies = function (user, battle) {
        return battle.getUnitsForSide(user.battleStats.side);
    };
    exports.targetEnemies = function (user, battle) {
        return battle.getUnitsForSide(utility_1.reverseSide(user.battleStats.side));
    };
    exports.targetAll = function (user, battle) {
        return utility_1.flatten2dArray(battle.side1.concat(battle.side2)).filter(function (unit) { return unit !== null; });
    };
    exports.areaSingle = function (user, target, battle) {
        return [target];
    };
    exports.areaAll = function (user, target, battle) {
        return utility_1.flatten2dArray(battle.side1.concat(battle.side2));
    };
    exports.areaColumn = function (user, target, battle) {
        var allRows = battle.side1.concat(battle.side2);
        var y = target.battleStats.position[1];
        return allRows.map(function (row) { return row[y]; });
    };
    exports.areaRow = function (user, target, battle) {
        var allRows = battle.side1.concat(battle.side2);
        var x = target.battleStats.position[0];
        return allRows[x];
    };
    exports.areaRowNeighbors = function (user, target, battle) {
        var row = exports.areaRow(user, target, battle);
        var y = target.battleStats.position[1];
        var y1 = Math.max(y - 1, 0);
        var y2 = Math.min(y + 1, row.length - 1);
        return row.slice(y1, y2 + 1);
    };
    exports.areaOrthogonalNeighbors = function (user, target, battle) {
        var allRows = battle.side1.concat(battle.side2);
        var x = target.battleStats.position[0];
        var y = target.battleStats.position[1];
        var targetLocations = [];
        targetLocations.push([x, y]);
        targetLocations.push([x - 1, y]);
        targetLocations.push([x + 1, y]);
        targetLocations.push([x, y - 1]);
        targetLocations.push([x, y + 1]);
        return utility_1.getFrom2dArray(allRows, targetLocations);
    };
    function makeGetAbilityTargetDisplayDataFN(props) {
        return function (user, target, battle) {
            var unitsInArea = props.areaFN(user, target, battle);
            var displayDataById = {};
            unitsInArea.forEach(function (unit) {
                displayDataById[unit.id] =
                    {
                        targetType: props.targetType,
                        targetEffect: props.targetEffect,
                    };
            });
            return displayDataById;
        };
    }
    exports.makeGetAbilityTargetDisplayDataFN = makeGetAbilityTargetDisplayDataFN;
});
define("src/TemplateIndexes", ["require", "exports", "src/activeModuleData"], function (require, exports, activeModuleData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TemplateIndexes = (function () {
        function TemplateIndexes() {
            this.builtIndexes = {
                distributablesByTypeAndDistributionGroup: null,
                itemsByTechLevel: null,
            };
        }
        Object.defineProperty(TemplateIndexes.prototype, "distributablesByDistributionGroup", {
            get: function () {
                if (!this.builtIndexes.distributablesByTypeAndDistributionGroup) {
                    this.builtIndexes.distributablesByTypeAndDistributionGroup =
                        TemplateIndexes.getDistributablesByTypeAndDistributionGroup();
                }
                return this.builtIndexes.distributablesByTypeAndDistributionGroup;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TemplateIndexes.prototype, "itemsByTechLevel", {
            get: function () {
                if (!this.builtIndexes.itemsByTechLevel) {
                    this.builtIndexes.itemsByTechLevel = TemplateIndexes.getItemsByTechLevel();
                }
                return this.builtIndexes.itemsByTechLevel;
            },
            enumerable: true,
            configurable: true
        });
        TemplateIndexes.prototype.clear = function () {
            for (var key in this.builtIndexes) {
                this.builtIndexes[key] = null;
            }
        };
        TemplateIndexes.getDistributablesByTypeAndDistributionGroup = function () {
            return ({
                resources: TemplateIndexes.getDistributablesByGroup(activeModuleData_1.activeModuleData.templates.Resources),
                races: TemplateIndexes.getDistributablesByGroup(activeModuleData_1.activeModuleData.templates.Races),
            });
        };
        TemplateIndexes.getDistributablesByGroup = function (allDistributables) {
            var byGroup = {};
            var _loop_1 = function (key) {
                var distributable = allDistributables[key];
                distributable.distributionData.distributionGroups.forEach(function (group) {
                    if (!byGroup[group]) {
                        byGroup[group] = [];
                    }
                    byGroup[group].push(distributable);
                });
            };
            for (var key in allDistributables) {
                _loop_1(key);
            }
            return byGroup;
        };
        TemplateIndexes.getItemsByTechLevel = function () {
            var itemsByTechLevel = {};
            for (var itemName in activeModuleData_1.activeModuleData.templates.Items) {
                var item = activeModuleData_1.activeModuleData.templates.Items[itemName];
                if (!itemsByTechLevel[item.techLevel]) {
                    itemsByTechLevel[item.techLevel] = [];
                }
                itemsByTechLevel[item.techLevel].push(item);
            }
            return itemsByTechLevel;
        };
        return TemplateIndexes;
    }());
    exports.templateIndexes = new TemplateIndexes();
});
define("src/templateinterfaces/Distributable", ["require", "exports", "src/utility"], function (require, exports, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getRandomWeightedDistributable(candidates) {
        var maxWeight = candidates.map(function (distributable) {
            return distributable.distributionData.weight;
        }).reduce(function (total, current) {
            return Math.max(total, current);
        }, -Infinity);
        if (maxWeight <= 0) {
            var candidatesWithMaxWeight = candidates.filter(function (distributable) {
                return distributable.distributionData.weight === maxWeight;
            });
            return utility_1.getRandomArrayItem(candidatesWithMaxWeight);
        }
        else {
            while (true) {
                var candidate = utility_1.getRandomArrayItem(candidates);
                if (Math.random() < candidate.distributionData.weight / maxWeight) {
                    return candidate;
                }
            }
        }
    }
    exports.getRandomWeightedDistributable = getRandomWeightedDistributable;
    function getDistributablesMatchingHighestPriorityGroup(candidates, groupsByPriority) {
        if (groupsByPriority.length === 0) {
            return candidates;
        }
        var distributablesThatDidntMatchGroups = [];
        var _loop_1 = function (i) {
            var group = groupsByPriority[i];
            var distributablesWithGroup = candidates.filter(function (distributable) {
                var distributableHasGroup = distributable.distributionData.distributionGroups.indexOf(group) !== -1;
                if (i === groupsByPriority.length - 1 && !distributableHasGroup) {
                    distributablesThatDidntMatchGroups.push(distributable);
                }
                return distributableHasGroup;
            });
            if (distributablesWithGroup.length > 0) {
                return { value: distributablesWithGroup };
            }
        };
        for (var i = 0; i < groupsByPriority.length; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return distributablesThatDidntMatchGroups;
    }
    exports.getDistributablesMatchingHighestPriorityGroup = getDistributablesMatchingHighestPriorityGroup;
    function filterCandidatesByGroups(candidates, groupsToMatch, valueWhenGroupMatches) {
        return candidates.filter(function (candidate) {
            var hasGroupMatch = candidate.distributionData.distributionGroups.some(function (candidateGroup) {
                return groupsToMatch.indexOf(candidateGroup) !== -1;
            });
            if (valueWhenGroupMatches === true) {
                return hasGroupMatch;
            }
            else {
                return !hasGroupMatch;
            }
        });
    }
    exports.filterCandidatesByGroups = filterCandidatesByGroups;
    function getDistributablesWithGroups(candidates, groupsToFilter) {
        return filterCandidatesByGroups(candidates, groupsToFilter, true);
    }
    exports.getDistributablesWithGroups = getDistributablesWithGroups;
    function getDistributablesWithoutGroups(candidates, groupsToFilter) {
        return filterCandidatesByGroups(candidates, groupsToFilter, false);
    }
    exports.getDistributablesWithoutGroups = getDistributablesWithoutGroups;
});
define("src/templateinterfaces/TerritoryBuildingTemplate", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/templateinterfaces/UnitEffectTemplate", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/Trade", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TradeableItemType;
    (function (TradeableItemType) {
        TradeableItemType[TradeableItemType["Money"] = 0] = "Money";
        TradeableItemType[TradeableItemType["Resource"] = 1] = "Resource";
    })(TradeableItemType = exports.TradeableItemType || (exports.TradeableItemType = {}));
    var Trade = (function () {
        function Trade(player) {
            this.stagedItems = {};
            this.player = player;
            this.setAllTradeableItems();
        }
        Trade.tradeableItemsAreEqual = function (t1, t2) {
            if (Object.keys(t1).length !== Object.keys(t2).length) {
                return false;
            }
            for (var key in t1) {
                if (!t2[key] || t1[key].amount !== t2[key].amount) {
                    return false;
                }
            }
            return true;
        };
        Trade.prototype.executeTrade = function (otherTrade) {
            this.executeAllStagedTrades(otherTrade.player);
            otherTrade.executeAllStagedTrades(this.player);
            this.updateAfterExecutedTrade();
            otherTrade.updateAfterExecutedTrade();
        };
        Trade.prototype.stageItem = function (key, amount) {
            if (!this.stagedItems[key]) {
                this.stagedItems[key] =
                    {
                        key: key,
                        type: this.allItems[key].type,
                        amount: amount,
                    };
            }
            else {
                this.stagedItems[key].amount += amount;
                if (this.stagedItems[key].amount <= 0) {
                    this.removeStagedItem(key);
                }
            }
        };
        Trade.prototype.setStagedItemAmount = function (key, newAmount) {
            if (newAmount <= 0) {
                this.removeStagedItem(key);
            }
            else {
                var clamped = Math.min(this.allItems[key].amount, newAmount);
                this.stagedItems[key].amount = clamped;
            }
        };
        Trade.prototype.getItemsAvailableForTrade = function () {
            var available = {};
            for (var key in this.allItems) {
                var stagedAmount = this.stagedItems[key] ? this.stagedItems[key].amount : 0;
                available[key] =
                    {
                        key: key,
                        type: this.allItems[key].type,
                        amount: this.allItems[key].amount - stagedAmount,
                    };
            }
            return available;
        };
        Trade.prototype.removeStagedItem = function (key) {
            delete this.stagedItems[key];
        };
        Trade.prototype.removeAllStagedItems = function () {
            for (var key in this.stagedItems) {
                this.removeStagedItem(key);
            }
        };
        Trade.prototype.clone = function () {
            var cloned = new Trade(this.player);
            cloned.copyStagedItemsFrom(this);
            return cloned;
        };
        Trade.prototype.isEqualWith = function (t2) {
            return Trade.tradeableItemsAreEqual(this.stagedItems, t2.stagedItems);
        };
        Trade.prototype.isEmpty = function () {
            return Object.keys(this.stagedItems).length === 0;
        };
        Trade.prototype.setAllTradeableItems = function () {
            this.allItems =
                {
                    money: {
                        key: "money",
                        type: TradeableItemType.Money,
                        amount: this.player.money,
                    },
                };
        };
        Trade.prototype.handleTradeOfItem = function (key, amount, targetPlayer) {
            switch (key) {
                case "money":
                    {
                        this.player.money -= amount;
                        targetPlayer.money += amount;
                    }
            }
        };
        Trade.prototype.executeAllStagedTrades = function (targetPlayer) {
            for (var key in this.stagedItems) {
                this.handleTradeOfItem(key, this.stagedItems[key].amount, targetPlayer);
            }
        };
        Trade.prototype.updateAfterExecutedTrade = function () {
            this.setAllTradeableItems();
            this.removeAllStagedItems();
        };
        Trade.prototype.copyStagedItemsFrom = function (toCopyFrom) {
            for (var key in toCopyFrom.stagedItems) {
                this.stagedItems[key] =
                    {
                        key: key,
                        type: toCopyFrom.stagedItems[key].type,
                        amount: toCopyFrom.stagedItems[key].amount,
                    };
            }
        };
        return Trade;
    }());
    exports.Trade = Trade;
});
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("src/TradeOffer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function cloneTradeOffer(offer) {
        return ({
            ownTrade: offer.ownTrade.clone(),
            otherTrade: offer.otherTrade.clone(),
            willingnessToTradeItems: __assign({}, offer.willingnessToTradeItems),
            message: offer.message,
            willingToAccept: offer.willingToAccept,
            willingToKeepNegotiating: offer.willingToKeepNegotiating,
        });
    }
    exports.cloneTradeOffer = cloneTradeOffer;
    function flipTradeOffer(offer) {
        var tempOwn = offer.ownTrade;
        offer.ownTrade = offer.otherTrade;
        offer.otherTrade = tempOwn;
    }
    exports.flipTradeOffer = flipTradeOffer;
});
define("src/tutorials/IntroTutorial", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.introTutorial = {
        pages: [
            {
                content: [
                    "Thanks for checking out spacegame!",
                    "",
                    "This game is still heavily in development. Many things are unfinished or unimplemented, including a proper tutorial.",
                ],
            },
            {
                content: [
                    "To get started, click on \"Production\" in the top menu. ",
                    "",
                    "Click on a ship type on the right of the production window to add it to your build queue. ",
                    "Units in the queue are built at the end of each turn. ",
                    "",
                    "You can end your turn by clicking the \"End turn\" button at the bottom right of the main window.",
                ],
            },
            {
                content: [
                    "Built units are assigned to fleets on the map. ",
                    "",
                    "To select fleets, drag a rectangle over them on the map or click on the fleet icon. ",
                    "Selected fleets can be moved by right-clicking.",
                    "",
                    "To move the camera, drag the map while holding down middle mouse button or while holding down ctrl/cmd + right click.",
                    "Touchscreen devices aren't supported yet, sorry.",
                ],
            },
            {
                content: [
                    "To start a battle, move your fleet to a star containing hostile fleets and click on \"attack\" button in the bottom left of the main window.",
                    "",
                    "In the battle setup screen, drag units from the unit list on the right into the formation on the bottom left or click the \"Auto formation\" button.",
                    "",
                    "To use abilities in battle, hover over the unit you want to target and select the ability to use.",
                ],
            },
        ],
    };
});
define("src/tutorials/TutorialStatus", ["require", "exports", "localforage", "src/tutorials/TutorialVisibility", "src/debug", "src/storageStrings"], function (require, exports, localForage, TutorialVisibility_1, debug, storageStrings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultTutorialStatus = {
        introTutorial: TutorialVisibility_1.TutorialVisibility.Show,
    };
    var TutorialStatus = (function () {
        function TutorialStatus() {
            this.setDefaultValues();
        }
        TutorialStatus.getDeserializedState = function (state) {
            return state === TutorialVisibility_1.TutorialVisibility.DontShowThisSession ? TutorialVisibility_1.TutorialVisibility.Show : state;
        };
        TutorialStatus.prototype.save = function () {
            localForage.setItem(storageStrings_1.storageStrings.tutorialStatus, JSON.stringify(this.serialize()));
        };
        TutorialStatus.prototype.load = function () {
            var _this = this;
            debug.log("init", "Start loading tutorial status");
            this.setDefaultValues();
            return localForage.getItem(storageStrings_1.storageStrings.tutorialStatus).then(function (tutorialStatusData) {
                if (tutorialStatusData) {
                    var parsedData = JSON.parse(tutorialStatusData);
                    _this.deserialize(parsedData);
                }
                debug.log("init", "Finish loading tutorial status");
            });
        };
        TutorialStatus.prototype.reset = function () {
            var _this = this;
            return localForage.removeItem(storageStrings_1.storageStrings.tutorialStatus).then(function () {
                _this.setDefaultValues();
            });
        };
        TutorialStatus.prototype.setDefaultValues = function () {
            this.introTutorial = defaultTutorialStatus.introTutorial;
        };
        TutorialStatus.prototype.setDefaultValuesForUndefined = function () {
            this.introTutorial = isFinite(this.introTutorial) ? this.introTutorial : defaultTutorialStatus.introTutorial;
        };
        TutorialStatus.prototype.serialize = function () {
            return ({
                introTutorial: this.introTutorial,
            });
        };
        TutorialStatus.prototype.deserialize = function (data) {
            this.introTutorial = TutorialStatus.getDeserializedState(data.introTutorial);
            this.setDefaultValuesForUndefined();
        };
        return TutorialStatus;
    }());
    exports.tutorialStatus = new TutorialStatus();
});
define("src/tutorials/TutorialVisibility", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TutorialVisibility;
    (function (TutorialVisibility) {
        TutorialVisibility[TutorialVisibility["NeverShow"] = 0] = "NeverShow";
        TutorialVisibility[TutorialVisibility["DontShowThisSession"] = 1] = "DontShowThisSession";
        TutorialVisibility[TutorialVisibility["Show"] = 2] = "Show";
    })(TutorialVisibility = exports.TutorialVisibility || (exports.TutorialVisibility = {}));
});
define("src/UIScenes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("src/Unit", ["require", "exports", "src/activeModuleData", "src/idGenerators", "src/Fleet", "src/UnitAttributes", "src/UnitItems", "src/utility"], function (require, exports, activeModuleData_1, idGenerators_1, Fleet_1, UnitAttributes_1, UnitItems_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Unit = (function () {
        function Unit(props) {
            var _this = this;
            this.attributesAreDirty = false;
            this.abilities = [];
            this.passiveSkills = [];
            this.learnableAbilities = [];
            this.abilityUpgrades = {};
            this.passiveSkillsByPhase = {
                atBattleStart: [],
                atTurnStart: [],
                inBattlePrep: [],
            };
            this.passiveSkillsByPhaseAreDirty = true;
            this.uiDisplayIsDirty = true;
            this.template = props.template;
            this.id = props.id;
            this.name = props.name;
            this.maxHealth = props.maxHealth;
            this.currentHealth = props.currentHealth;
            this.baseAttributes = new UnitAttributes_1.UnitAttributes(props.attributes).clamp(1, 9);
            this.cachedAttributes = this.baseAttributes.clone();
            this.currentMovePoints = props.currentMovePoints;
            this.maxMovePoints = props.maxMovePoints;
            this.offensiveBattlesFoughtThisTurn = props.offensiveBattlesFoughtThisTurn;
            this.abilities = props.abilities.slice(0);
            this.passiveSkills = props.passiveSkills.slice(0);
            this.learnableAbilities = props.learnableAbilities;
            this.abilityUpgrades = props.abilityUpgrades;
            this.level = props.level;
            this.experienceForCurrentLevel = props.experienceForCurrentLevel;
            if (props.battleStats) {
                this.battleStats =
                    {
                        moveDelay: props.battleStats.moveDelay,
                        side: props.battleStats.side,
                        position: props.battleStats.position,
                        currentActionPoints: props.battleStats.currentActionPoints,
                        guardAmount: props.battleStats.guardAmount,
                        guardCoverage: props.battleStats.guardCoverage,
                        captureChance: props.battleStats.captureChance,
                        statusEffects: props.battleStats.statusEffects.map(function (statusEffect) {
                            return statusEffect.clone();
                        }),
                        lastHealthBeforeReceivingDamage: this.currentHealth,
                        queuedAction: props.battleStats.queuedAction ?
                            {
                                ability: props.battleStats.queuedAction.ability,
                                targetId: props.battleStats.queuedAction.targetId,
                                turnsPrepared: props.battleStats.queuedAction.turnsPrepared,
                                timesInterrupted: props.battleStats.queuedAction.timesInterrupted,
                            } :
                            null,
                        isAnnihilated: props.battleStats.isAnnihilated,
                    };
            }
            else {
                this.resetBattleStats();
            }
            this.items = this.makeUnitItems(props.maxItemSlots);
            props.items.forEach(function (item) {
                if (item.positionInUnit !== undefined) {
                    _this.items.addItemAtPosition(item, item.positionInUnit);
                }
                else {
                    _this.items.addItem(item);
                }
            });
            this.race = props.race;
            this.portrait = props.portrait;
        }
        Object.defineProperty(Unit.prototype, "attributes", {
            get: function () {
                if (this.attributesAreDirty || !this.cachedAttributes) {
                    this.updateCachedAttributes();
                }
                return this.cachedAttributes;
            },
            enumerable: true,
            configurable: true
        });
        Unit.fromTemplate = function (props) {
            var template = props.template;
            var race = props.race;
            var attributeMultiplier = props.attributeMultiplier !== undefined ? props.attributeMultiplier : 1;
            var healthMultiplier = props.healthMultiplier !== undefined ? props.healthMultiplier : 1;
            var baseAttributeValue = activeModuleData_1.activeModuleData.ruleSet.units.baseAttributeValue * attributeMultiplier;
            var attributeVariance = activeModuleData_1.activeModuleData.ruleSet.units.attributeVariance;
            var baseHealthValue = activeModuleData_1.activeModuleData.ruleSet.units.baseHealthValue * healthMultiplier;
            var healthVariance = activeModuleData_1.activeModuleData.ruleSet.units.healthVariance;
            var baseHealth = baseHealthValue * template.maxHealthLevel;
            var health = utility_1.randInt(baseHealth - healthVariance, baseHealth + healthVariance);
            var abilities = utility_1.getItemsFromProbabilityDistributions(template.possibleAbilities);
            var passiveSkills = template.possiblePassiveSkills ?
                utility_1.getItemsFromProbabilityDistributions(template.possiblePassiveSkills) :
                [];
            var learnableAbilities = template.possibleLearnableAbilities ?
                utility_1.getItemsFromProbabilityDistributions(template.possibleLearnableAbilities) :
                [];
            var unit = new Unit({
                template: template,
                id: idGenerators_1.idGenerators.unit++,
                name: props.name || race.getUnitName(template),
                maxHealth: health,
                currentHealth: health,
                attributes: Unit.getRandomAttributesFromTemplate(template, baseAttributeValue, attributeVariance),
                currentMovePoints: template.maxMovePoints,
                maxMovePoints: template.maxMovePoints,
                offensiveBattlesFoughtThisTurn: 0,
                abilities: abilities,
                passiveSkills: passiveSkills,
                learnableAbilities: learnableAbilities,
                abilityUpgrades: Unit.getUpgradableAbilitiesData(template, abilities.concat(passiveSkills, learnableAbilities)),
                level: 1,
                experienceForCurrentLevel: 0,
                maxItemSlots: template.itemSlots,
                items: [],
                portrait: race.getUnitPortrait(template, activeModuleData_1.activeModuleData.templates.Portraits),
                race: race,
            });
            return unit;
        };
        Unit.fromSaveData = function (data) {
            var unit = new Unit({
                template: activeModuleData_1.activeModuleData.templates.Units[data.templateType],
                id: data.id,
                name: data.name,
                maxHealth: data.maxHealth,
                currentHealth: data.currentHealth,
                attributes: data.baseAttributes,
                currentMovePoints: data.currentMovePoints,
                maxMovePoints: data.maxMovePoints,
                offensiveBattlesFoughtThisTurn: data.offensiveBattlesFoughtThisTurn,
                abilities: data.abilityTypes.map(function (templateType) {
                    return activeModuleData_1.activeModuleData.templates.Abilities[templateType];
                }),
                passiveSkills: data.passiveSkillTypes.map(function (templateType) {
                    return activeModuleData_1.activeModuleData.templates.PassiveSkills[templateType];
                }),
                abilityUpgrades: data.abilityUpgrades.reduce(function (allUpgradeData, currentUpgradeData) {
                    var allAbilitiesAndPassiveSkills = __assign({}, activeModuleData_1.activeModuleData.templates.Abilities, activeModuleData_1.activeModuleData.templates.PassiveSkills);
                    var source = allAbilitiesAndPassiveSkills[currentUpgradeData.source];
                    var upgrades = currentUpgradeData.possibleUpgrades.map(function (templateType) {
                        return allAbilitiesAndPassiveSkills[templateType];
                    });
                    allUpgradeData[source.type] =
                        {
                            source: source,
                            possibleUpgrades: upgrades,
                        };
                    return allUpgradeData;
                }, {}),
                learnableAbilities: data.learnableAbilities.map(function (templateType) {
                    var allAbilitiesAndPassiveSkills = __assign({}, activeModuleData_1.activeModuleData.templates.Abilities, activeModuleData_1.activeModuleData.templates.PassiveSkills);
                    return allAbilitiesAndPassiveSkills[templateType];
                }),
                level: data.level,
                experienceForCurrentLevel: data.experienceForCurrentLevel,
                battleStats: {
                    moveDelay: data.battleStats.moveDelay,
                    side: data.battleStats.side,
                    position: data.battleStats.position,
                    currentActionPoints: data.battleStats.currentActionPoints,
                    guardAmount: data.battleStats.guardAmount,
                    guardCoverage: data.battleStats.guardCoverage,
                    captureChance: data.battleStats.captureChance,
                    isAnnihilated: data.battleStats.isAnnihilated,
                    lastHealthBeforeReceivingDamage: data.currentHealth,
                    statusEffects: [],
                    queuedAction: data.battleStats.queuedAction ?
                        {
                            ability: activeModuleData_1.activeModuleData.templates.Abilities[data.battleStats.queuedAction.abilityTemplateKey],
                            targetId: data.battleStats.queuedAction.targetId,
                            turnsPrepared: data.battleStats.queuedAction.turnsPrepared,
                            timesInterrupted: data.battleStats.queuedAction.timesInterrupted,
                        } :
                        null,
                },
                maxItemSlots: data.items.maxItemSlots,
                items: [],
                portrait: data.portraitKey ?
                    activeModuleData_1.activeModuleData.templates.Portraits[data.portraitKey] :
                    undefined,
                race: data.raceKey ?
                    activeModuleData_1.activeModuleData.templates.Races[data.raceKey] :
                    undefined,
            });
            return unit;
        };
        Unit.getRandomValueFromAttributeLevel = function (level, baseValue, variance) {
            var baseValueForLevel = baseValue * level;
            return utility_1.randInt(baseValueForLevel - variance, baseValueForLevel + variance);
        };
        Unit.getRandomAttributesFromTemplate = function (template, baseValue, variance) {
            return ({
                attack: Unit.getRandomValueFromAttributeLevel(template.attributeLevels.attack, baseValue, variance),
                defence: Unit.getRandomValueFromAttributeLevel(template.attributeLevels.defence, baseValue, variance),
                intelligence: Unit.getRandomValueFromAttributeLevel(template.attributeLevels.intelligence, baseValue, variance),
                speed: Unit.getRandomValueFromAttributeLevel(template.attributeLevels.speed, baseValue, variance),
                maxActionPoints: utility_1.randInt(3, 5),
            });
        };
        Unit.prototype.getBaseMoveDelay = function () {
            return 30 - this.attributes.speed;
        };
        Unit.prototype.resetMovePoints = function () {
            this.currentMovePoints = this.maxMovePoints;
        };
        Unit.prototype.resetBattleStats = function () {
            this.battleStats =
                {
                    moveDelay: this.getBaseMoveDelay(),
                    currentActionPoints: this.attributes.maxActionPoints,
                    side: null,
                    position: null,
                    guardAmount: 0,
                    guardCoverage: null,
                    captureChance: activeModuleData_1.activeModuleData.ruleSet.battle.baseUnitCaptureChance,
                    statusEffects: [],
                    lastHealthBeforeReceivingDamage: this.currentHealth,
                    queuedAction: null,
                    isAnnihilated: false,
                };
            this.attributesAreDirty = true;
            this.uiDisplayIsDirty = true;
        };
        Unit.prototype.setBattlePosition = function (side, position) {
            this.battleStats.side = side;
            this.battleStats.position = position;
        };
        Unit.prototype.addMaxHealth = function (amountToAdd) {
            this.maxHealth += Math.max(0, Math.round(amountToAdd));
            if (this.currentHealth > this.maxHealth) {
                this.currentHealth = this.maxHealth;
            }
            this.uiDisplayIsDirty = true;
        };
        Unit.prototype.addHealth = function (amountToAdd) {
            var newHealth = this.currentHealth + Math.round(amountToAdd);
            this.currentHealth = utility_1.clamp(newHealth, 0, this.maxHealth);
            if (this.currentHealth <= 0) {
                this.battleStats.isAnnihilated = true;
            }
            this.uiDisplayIsDirty = true;
        };
        Unit.prototype.removeHealth = function (amountToRemove) {
            this.addHealth(-amountToRemove);
        };
        Unit.prototype.removeActionPoints = function (amount) {
            this.battleStats.currentActionPoints -= amount;
            if (this.battleStats.currentActionPoints < 0) {
                this.battleStats.currentActionPoints = 0;
            }
            this.uiDisplayIsDirty = true;
        };
        Unit.prototype.addMoveDelay = function (amount) {
            this.battleStats.moveDelay += amount;
        };
        Unit.prototype.updateStatusEffects = function () {
            for (var i = this.battleStats.statusEffects.length - 1; i >= 0; i--) {
                var statusEffect = this.battleStats.statusEffects[i];
                statusEffect.processTurnEnd();
                if (statusEffect.turnsHasBeenActiveFor >= statusEffect.turnsToStayActiveFor) {
                    this.removeStatusEffect(statusEffect);
                }
            }
            this.uiDisplayIsDirty = true;
        };
        Unit.prototype.setQueuedAction = function (ability, target) {
            this.battleStats.queuedAction =
                {
                    ability: ability,
                    targetId: target.id,
                    turnsPrepared: 0,
                    timesInterrupted: 0,
                };
            this.uiDisplayIsDirty = true;
        };
        Unit.prototype.interruptQueuedAction = function (interruptStrength) {
            var action = this.battleStats.queuedAction;
            if (!action) {
                return;
            }
            action.timesInterrupted += interruptStrength;
            if (action.timesInterrupted >= action.ability.preparation.interruptsNeeded) {
                this.clearQueuedAction();
            }
            this.uiDisplayIsDirty = true;
        };
        Unit.prototype.updateQueuedAction = function () {
            var action = this.battleStats.queuedAction;
            if (!action) {
                return;
            }
            action.turnsPrepared++;
            this.uiDisplayIsDirty = true;
        };
        Unit.prototype.isReadyToUseQueuedAction = function () {
            var action = this.battleStats.queuedAction;
            return (action && action.turnsPrepared >= action.ability.preparation.turnsToPrep);
        };
        Unit.prototype.clearQueuedAction = function () {
            this.battleStats.queuedAction = null;
            this.uiDisplayIsDirty = true;
        };
        Unit.prototype.isTargetable = function () {
            return this.isActiveInBattle();
        };
        Unit.prototype.isActiveInBattle = function () {
            return this.currentHealth > 0 && !this.battleStats.isAnnihilated;
        };
        Unit.prototype.makeUnitItems = function (itemSlots) {
            var _this = this;
            return new UnitItems_1.UnitItems(itemSlots, function (item) {
                item.unit = _this;
            }, function (changedItem) {
                if (changedItem.template.attributeAdjustments) {
                    _this.attributesAreDirty = true;
                }
                if (changedItem.template.passiveSkill) {
                    _this.passiveSkillsByPhaseAreDirty = true;
                }
            });
        };
        Unit.prototype.getAttributesWithItems = function () {
            var _a;
            return (_a = this.baseAttributes).getAdjustedAttributes.apply(_a, this.items.getAttributeAdjustments()).clamp(1, 9);
        };
        Unit.prototype.addStatusEffect = function (statusEffect) {
            if (this.battleStats.statusEffects.indexOf(statusEffect) !== -1) {
                throw new Error("Tried to add duplicate status effect to unit " + this.name);
            }
            else if (statusEffect.turnsToStayActiveFor === 0) {
                console.warn("Tried to add status effect", statusEffect, "with 0 duration");
                return;
            }
            this.battleStats.statusEffects.push(statusEffect);
            if (statusEffect.template.attributes) {
                this.attributesAreDirty = true;
            }
            this.uiDisplayIsDirty = true;
        };
        Unit.prototype.removeStatusEffect = function (statusEffect) {
            var index = this.battleStats.statusEffects.indexOf(statusEffect);
            if (index === -1) {
                throw new Error("Tried to remove status effect not active on unit " + this.name);
            }
            this.battleStats.statusEffects.splice(index, 1);
            if (statusEffect.template.attributes) {
                this.attributesAreDirty = true;
            }
            this.uiDisplayIsDirty = true;
        };
        Unit.prototype.getStatusEffectAttributeAdjustments = function () {
            if (!this.battleStats || !this.battleStats.statusEffects) {
                return [];
            }
            return this.battleStats.statusEffects.filter(function (statusEffect) {
                return Boolean(statusEffect.template.attributes);
            }).map(function (statusEffect) {
                return statusEffect.template.attributes;
            });
        };
        Unit.prototype.getAttributesWithItemsAndEffects = function () {
            var _a;
            var itemAdjustments = this.items.getAttributeAdjustments();
            var effectAdjustments = this.getStatusEffectAttributeAdjustments();
            return (_a = this.baseAttributes).getAdjustedAttributes.apply(_a, itemAdjustments.concat(effectAdjustments));
        };
        Unit.prototype.getAttributesWithEffectsDifference = function () {
            var withItems = this.getAttributesWithItems();
            var withEffects = this.getAttributesWithItemsAndEffects();
            return withEffects.getDifferenceBetween(withItems);
        };
        Unit.prototype.updateCachedAttributes = function () {
            this.cachedAttributes = this.getAttributesWithItemsAndEffects();
            this.attributesAreDirty = false;
        };
        Unit.prototype.getAllAbilities = function () {
            var allAbilities = this.abilities.concat(this.items.getAbilities());
            var allUniqueAbilities = utility_1.getUniqueArrayKeys(allAbilities, function (template) { return template.type; });
            return allUniqueAbilities;
        };
        Unit.prototype.getAllPassiveSkills = function () {
            var allPassiveSkills = this.passiveSkills.concat(this.items.getPassiveSkills());
            var allUniquePassiveSkills = utility_1.getUniqueArrayKeys(allPassiveSkills, function (template) { return template.type; });
            return allUniquePassiveSkills;
        };
        Unit.prototype.updatePassiveSkillsByPhase = function () {
            var updatedSkills = {
                atBattleStart: [],
                atTurnStart: [],
                inBattlePrep: [],
            };
            var allSkills = this.getAllPassiveSkills();
            var _loop_1 = function (i) {
                var skill = allSkills[i];
                ["atBattleStart", "atTurnStart", "inBattlePrep"].forEach(function (phase) {
                    if (skill[phase]) {
                        if (updatedSkills[phase].indexOf(skill) === -1) {
                            updatedSkills[phase].push(skill);
                        }
                    }
                });
            };
            for (var i = 0; i < allSkills.length; i++) {
                _loop_1(i);
            }
            this.passiveSkillsByPhase = updatedSkills;
            this.passiveSkillsByPhaseAreDirty = false;
        };
        Unit.prototype.getPassiveSkillsByPhase = function () {
            if (this.passiveSkillsByPhaseAreDirty) {
                this.updatePassiveSkillsByPhase();
            }
            return this.passiveSkillsByPhase;
        };
        Unit.prototype.getPassiveEffectsForScene = function (scene) {
            var relevantTemplateKeys = [];
            switch (scene) {
                case "galaxyMap":
                    break;
                case "battlePrep":
                    relevantTemplateKeys.push("atBattleStart", "inBattlePrep");
                    break;
                case "battle":
                    relevantTemplateKeys.push("beforeAbilityUse", "afterAbilityUse");
                    break;
            }
            var effectFilterFN = function (passiveEffect) {
                if (passiveEffect.isHidden) {
                    return false;
                }
                for (var _i = 0, relevantTemplateKeys_1 = relevantTemplateKeys; _i < relevantTemplateKeys_1.length; _i++) {
                    var key = relevantTemplateKeys_1[_i];
                    if (passiveEffect[key]) {
                        return true;
                    }
                }
                return false;
            };
            var relevantStatusEffectTemplates = this.battleStats.statusEffects.map(function (statusEffect) {
                return statusEffect.template;
            }).filter(effectFilterFN);
            var relevantPassiveEffectTemplates = this.getAllPassiveSkills().filter(effectFilterFN);
            return relevantStatusEffectTemplates.concat(relevantPassiveEffectTemplates);
        };
        Unit.prototype.receiveDamage = function (amount) {
            this.battleStats.lastHealthBeforeReceivingDamage = this.currentHealth;
            this.addHealth(-amount);
        };
        Unit.prototype.removeFromPlayer = function () {
            var _this = this;
            var fleet = this.fleet;
            var player = fleet.player;
            this.items.destroyAllItems();
            player.removeUnit(this);
            fleet.removeUnit(this);
            if (fleet.units.length <= 0) {
                fleet.deleteFleet();
            }
            activeModuleData_1.activeModuleData.scripts.unit.removeFromPlayer.forEach(function (scriptFN) {
                scriptFN(_this);
            });
            this.uiDisplayIsDirty = true;
        };
        Unit.prototype.transferToPlayer = function (newPlayer) {
            var location = this.fleet.location;
            this.removeFromPlayer();
            newPlayer.addUnit(this);
            var fleet = Fleet_1.Fleet.createFleet([this]);
            newPlayer.addFleet(fleet);
            location.addFleet(fleet);
        };
        Unit.prototype.removeGuard = function (amount) {
            this.battleStats.guardAmount -= amount;
            if (this.battleStats.guardAmount < 0) {
                this.removeAllGuard();
            }
            this.uiDisplayIsDirty = true;
        };
        Unit.prototype.addGuard = function (amount, coverage) {
            this.battleStats.guardAmount += amount;
            this.battleStats.guardCoverage = coverage;
            this.uiDisplayIsDirty = true;
        };
        Unit.prototype.removeAllGuard = function () {
            this.battleStats.guardAmount = 0;
            this.battleStats.guardCoverage = null;
            this.uiDisplayIsDirty = true;
        };
        Unit.prototype.getCounterAttackStrength = function () {
            return 1;
        };
        Unit.prototype.getMaxOffensiveBattlesPerTurn = function () {
            return this.template.maxOffensiveBattlesPerTurn;
        };
        Unit.prototype.canFightOffensiveBattle = function () {
            return this.offensiveBattlesFoughtThisTurn < this.getMaxOffensiveBattlesPerTurn();
        };
        Unit.prototype.isStealthy = function () {
            return Boolean(this.template.isStealthy);
        };
        Unit.prototype.getVisionRange = function () {
            return this.template.visionRange;
        };
        Unit.prototype.getDetectionRange = function () {
            return this.template.detectionRange;
        };
        Unit.prototype.getHealingForGameTurnStart = function () {
            var location = this.fleet.location;
            var baseHealFactor = 0.05;
            var healingFactor = baseHealFactor + location.getHealingFactor(this.fleet.player);
            var healAmount = this.maxHealth * healingFactor;
            return healAmount;
        };
        Unit.prototype.getTotalCost = function () {
            var totalCost = 0;
            totalCost += this.template.buildCost;
            totalCost += this.items.getAllItems().map(function (item) {
                return item.template.buildCost;
            }).reduce(function (a, b) {
                return a + b;
            }, 0);
            return totalCost;
        };
        Unit.prototype.getTurnsToReachStar = function (star) {
            var currentLocation = this.fleet.location;
            var distance = currentLocation.getDistanceToStar(star);
            if (distance <= this.currentMovePoints) {
                if (this.currentMovePoints === 0) {
                    return 0;
                }
                else {
                    return distance / this.currentMovePoints;
                }
            }
            distance -= this.currentMovePoints;
            return distance / this.maxMovePoints;
        };
        Unit.prototype.getExperienceToNextLevel = function () {
            return (4 + this.level) * 10;
        };
        Unit.prototype.addExperience = function (amount) {
            this.experienceForCurrentLevel += Math.round(amount);
        };
        Unit.prototype.canLevelUp = function () {
            return this.experienceForCurrentLevel >= this.getExperienceToNextLevel();
        };
        Unit.prototype.handleLevelUp = function () {
            this.experienceForCurrentLevel -= this.getExperienceToNextLevel();
            this.level++;
        };
        Unit.prototype.getCurrentLearnableAbilities = function () {
            var currentlyKnownAbilities = this.abilities.concat(this.passiveSkills);
            var unknownLearnableAbilities = this.learnableAbilities.filter(function (ability) {
                return currentlyKnownAbilities.indexOf(ability) === -1;
            });
            return unknownLearnableAbilities;
        };
        Unit.prototype.getCurrentUpgradableAbilitiesData = function () {
            var _this = this;
            var upgradeDataForCurrentAbilities = {};
            this.abilities.concat(this.passiveSkills).forEach(function (ability) {
                if (_this.abilityUpgrades[ability.type]) {
                    upgradeDataForCurrentAbilities[ability.type] = _this.abilityUpgrades[ability.type];
                }
            });
            return upgradeDataForCurrentAbilities;
        };
        Unit.getUpgradableAbilitiesData = function (template, upgradeCandidates, fullUpgradeData) {
            if (fullUpgradeData === void 0) { fullUpgradeData = {}; }
            if (upgradeCandidates.length === 0) {
                return fullUpgradeData;
            }
            var newUpgradeCandidates = [];
            upgradeCandidates.forEach(function (sourceAbility) {
                var probabilityDistributions;
                if (template.possibleAbilityUpgrades && template.possibleAbilityUpgrades[sourceAbility.type]) {
                    probabilityDistributions = template.possibleAbilityUpgrades[sourceAbility.type](sourceAbility);
                }
                else if (sourceAbility.defaultUpgrades) {
                    probabilityDistributions = sourceAbility.defaultUpgrades;
                }
                else {
                    probabilityDistributions = [];
                }
                var chosenUpgrades = utility_1.getItemsFromProbabilityDistributions(probabilityDistributions);
                if (chosenUpgrades.length !== 0) {
                    if (!fullUpgradeData[sourceAbility.type]) {
                        fullUpgradeData[sourceAbility.type] =
                            {
                                source: sourceAbility,
                                possibleUpgrades: [],
                            };
                    }
                }
                chosenUpgrades.forEach(function (abilityToUpgradeInto) {
                    fullUpgradeData[sourceAbility.type].possibleUpgrades.push(abilityToUpgradeInto);
                    if (!fullUpgradeData[abilityToUpgradeInto.type]) {
                        newUpgradeCandidates.push(abilityToUpgradeInto);
                    }
                });
            });
            return Unit.getUpgradableAbilitiesData(template, newUpgradeCandidates, fullUpgradeData);
        };
        Unit.prototype.upgradeAbility = function (source, newAbility) {
            var sourceIsPassiveSkill = !source.mainEffect;
            if (sourceIsPassiveSkill) {
                this.passiveSkills.splice(this.passiveSkills.indexOf(source), 1);
            }
            else {
                this.abilities.splice(this.abilities.indexOf(source), 1);
            }
            this.addAbility(newAbility);
        };
        Unit.prototype.learnAbility = function (newAbility) {
            this.addAbility(newAbility);
        };
        Unit.prototype.addAbility = function (newAbility) {
            var newAbilityIsPassiveSkill = !newAbility.mainEffect;
            if (newAbilityIsPassiveSkill) {
                this.passiveSkills.push(newAbility);
            }
            else {
                this.abilities.push(newAbility);
            }
        };
        Unit.prototype.drawBattleScene = function (params) {
            var data = this.template.unitDrawingFN(this, params);
            this.drawingFunctionData = data;
        };
        Unit.prototype.getDisplayData = function (scene) {
            return ({
                name: this.name,
                facesLeft: this.battleStats.side === "side2",
                currentHealth: this.currentHealth,
                maxHealth: this.maxHealth,
                guardAmount: this.battleStats.guardAmount,
                guardType: this.battleStats.guardCoverage,
                currentActionPoints: this.battleStats.currentActionPoints,
                maxActionPoints: this.attributes.maxActionPoints,
                isPreparing: Boolean(this.battleStats.queuedAction),
                isAnnihilated: this.battleStats.isAnnihilated,
                isSquadron: this.template.isSquadron,
                portraitSrc: this.portrait.getImageSrc(),
                iconSrc: this.template.getIconSrc(),
                attributeChanges: this.getAttributesWithEffectsDifference().serialize(),
                passiveEffects: this.getPassiveEffectsForScene(scene),
            });
        };
        Unit.prototype.serialize = function () {
            var _this = this;
            var battleStatsSavedData = {
                moveDelay: this.battleStats.moveDelay,
                side: this.battleStats.side,
                position: this.battleStats.position,
                currentActionPoints: this.battleStats.currentActionPoints,
                guardAmount: this.battleStats.guardAmount,
                guardCoverage: this.battleStats.guardCoverage,
                captureChance: this.battleStats.captureChance,
                statusEffects: this.battleStats.statusEffects.map(function (statusEffect) { return statusEffect.serialize(); }),
                queuedAction: !this.battleStats.queuedAction ? null :
                    {
                        abilityTemplateKey: this.battleStats.queuedAction.ability.type,
                        targetId: this.battleStats.queuedAction.targetId,
                        turnsPrepared: this.battleStats.queuedAction.turnsPrepared,
                        timesInterrupted: this.battleStats.queuedAction.timesInterrupted,
                    },
                isAnnihilated: this.battleStats.isAnnihilated,
            };
            var data = {
                templateType: this.template.type,
                id: this.id,
                name: this.name,
                maxHealth: this.maxHealth,
                currentHealth: this.currentHealth,
                currentMovePoints: this.currentMovePoints,
                maxMovePoints: this.maxMovePoints,
                offensiveBattlesFoughtThisTurn: this.offensiveBattlesFoughtThisTurn,
                baseAttributes: this.baseAttributes.serialize(),
                abilityTypes: this.abilities.map(function (abilityTemplate) { return abilityTemplate.type; }),
                passiveSkillTypes: this.passiveSkills.map(function (passiveSkillTemplate) { return passiveSkillTemplate.type; }),
                abilityUpgrades: Object.keys(this.abilityUpgrades).map(function (sourceAbilityType) {
                    return ({
                        source: sourceAbilityType,
                        possibleUpgrades: _this.abilityUpgrades[sourceAbilityType].possibleUpgrades.map(function (ability) {
                            return ability.type;
                        }),
                    });
                }),
                learnableAbilities: this.learnableAbilities.map(function (abilityTemplate) { return abilityTemplate.type; }),
                experienceForCurrentLevel: this.experienceForCurrentLevel,
                level: this.level,
                items: this.items.serialize(),
                battleStats: battleStatsSavedData,
                portraitKey: this.portrait.key,
                raceKey: this.race.type,
            };
            if (this.fleet) {
                data.fleetId = this.fleet.id;
            }
            return data;
        };
        Unit.prototype.makeVirtualClone = function () {
            var clone = new Unit({
                template: this.template,
                id: this.id,
                name: this.name,
                maxHealth: this.maxHealth,
                currentHealth: this.currentHealth,
                attributes: this.baseAttributes.clone(),
                currentMovePoints: this.currentMovePoints,
                maxMovePoints: this.maxMovePoints,
                offensiveBattlesFoughtThisTurn: this.offensiveBattlesFoughtThisTurn,
                abilities: this.abilities,
                passiveSkills: this.passiveSkills,
                abilityUpgrades: this.abilityUpgrades,
                learnableAbilities: this.learnableAbilities,
                level: this.level,
                experienceForCurrentLevel: this.experienceForCurrentLevel,
                battleStats: this.battleStats,
                maxItemSlots: this.items.itemSlots,
                items: this.items.items,
                portrait: this.portrait,
                race: this.race,
            });
            return clone;
        };
        return Unit;
    }());
    exports.Unit = Unit;
});
define("src/UnitAttributes", ["require", "exports", "src/FlatAndMultiplierAdjustment", "src/utility"], function (require, exports, FlatAndMultiplierAdjustment_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitAttribute;
    (function (UnitAttribute) {
        UnitAttribute[UnitAttribute["Attack"] = 0] = "Attack";
        UnitAttribute[UnitAttribute["Defence"] = 1] = "Defence";
        UnitAttribute[UnitAttribute["Intelligence"] = 2] = "Intelligence";
        UnitAttribute[UnitAttribute["Speed"] = 3] = "Speed";
    })(UnitAttribute = exports.UnitAttribute || (exports.UnitAttribute = {}));
    var UnitAttributes = (function () {
        function UnitAttributes(initialAttributes) {
            for (var key in initialAttributes) {
                this[key] = initialAttributes[key];
            }
        }
        UnitAttributes.createBlank = function () {
            return new UnitAttributes({
                maxActionPoints: 0,
                attack: 0,
                defence: 0,
                intelligence: 0,
                speed: 0,
            });
        };
        UnitAttributes.getBaseAdjustmentsObject = function () {
            return ({
                maxActionPoints: FlatAndMultiplierAdjustment_1.getBaseAdjustment(),
                attack: FlatAndMultiplierAdjustment_1.getBaseAdjustment(),
                defence: FlatAndMultiplierAdjustment_1.getBaseAdjustment(),
                intelligence: FlatAndMultiplierAdjustment_1.getBaseAdjustment(),
                speed: FlatAndMultiplierAdjustment_1.getBaseAdjustment(),
            });
        };
        UnitAttributes.prototype.clone = function () {
            return new UnitAttributes(this);
        };
        UnitAttributes.prototype.clamp = function (min, max) {
            var _this = this;
            this.forEachAttribute(function (attribute) {
                _this[attribute] = utility_1.clamp(_this[attribute], min, max);
            });
            return this;
        };
        UnitAttributes.prototype.getAdjustedAttributes = function () {
            var adjustments = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                adjustments[_i] = arguments[_i];
            }
            var baseAdjustments = UnitAttributes.getBaseAdjustmentsObject();
            var squashedAdjustments = FlatAndMultiplierAdjustment_1.squashAdjustmentsObjects.apply(void 0, [baseAdjustments].concat(adjustments));
            var cloned = this.clone();
            cloned.applyAdjustments(squashedAdjustments);
            return cloned;
        };
        UnitAttributes.prototype.modifyValueByAttributes = function (baseValue, attributeAdjustments) {
            var totalAdjustment = FlatAndMultiplierAdjustment_1.getBaseAdjustment();
            for (var attributeName in attributeAdjustments) {
                var adjustment = attributeAdjustments[attributeName];
                var attributeValue = this[attributeName];
                if (adjustment.flat) {
                    totalAdjustment.flat += adjustment.flat * attributeValue;
                }
                if (adjustment.additiveMultiplier) {
                    totalAdjustment.additiveMultiplier += adjustment.additiveMultiplier * attributeValue;
                }
                if (isFinite(adjustment.multiplicativeMultiplier)) {
                    totalAdjustment.multiplicativeMultiplier *= adjustment.multiplicativeMultiplier * attributeValue;
                }
            }
            return FlatAndMultiplierAdjustment_1.applyFlatAndMultiplierAdjustments(baseValue, totalAdjustment);
        };
        UnitAttributes.prototype.getDifferenceBetween = function (toCompare) {
            return new UnitAttributes({
                maxActionPoints: this.maxActionPoints - toCompare.maxActionPoints,
                attack: this.attack - toCompare.attack,
                defence: this.defence - toCompare.defence,
                intelligence: this.intelligence - toCompare.intelligence,
                speed: this.speed - toCompare.speed,
            });
        };
        UnitAttributes.prototype.getAttributesTypesSortedForDisplay = function () {
            return ([
                "maxActionPoints",
                "attack",
                "defence",
                "intelligence",
                "speed",
            ]);
        };
        UnitAttributes.prototype.serialize = function () {
            return JSON.parse(JSON.stringify(this));
        };
        UnitAttributes.prototype.applyAdjustments = function (adjustments) {
            for (var attribute in adjustments) {
                this[attribute] = FlatAndMultiplierAdjustment_1.applyFlatAndMultiplierAdjustments(this[attribute], adjustments[attribute]);
            }
            return this;
        };
        UnitAttributes.prototype.forEachAttribute = function (cb) {
            this.getAttributesTypesSortedForDisplay().forEach(function (attribute) {
                cb(attribute);
            });
        };
        return UnitAttributes;
    }());
    exports.UnitAttributes = UnitAttributes;
});
define("src/UnitBattleSide", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unitBattleSides = ["side1", "side2"];
});
define("src/UnitDrawingFunctionData", ["require", "exports", "src/pixiWrapperFunctions"], function (require, exports, pixiWrapperFunctions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function mirrorRectangle(rect, midX) {
        rect.x = getMirroredPosition(rect.x, midX) - rect.width;
    }
    function mirrorPoint(point, midX) {
        point.x = getMirroredPosition(point.x, midX);
    }
    function getMirroredPosition(pos, mid) {
        return pos - (pos - mid) * 2;
    }
    function offsetRectangle(rect, offset) {
        rect.x += offset.x;
        rect.y += offset.y;
    }
    function offsetPoint(point, offset) {
        point.x += offset.x;
        point.y += offset.y;
    }
    var UnitDrawingFunctionData = (function () {
        function UnitDrawingFunctionData(props) {
            this.boundingBox = props.boundingBox;
            this.individualUnitBoundingBoxes = props.individualUnitBoundingBoxes;
            this.singleAttackOriginPoint = props.singleAttackOriginPoint;
            this.sequentialAttackOriginPoints = props.sequentialAttackOriginPoints;
            this.individualUnitDisplayObjects = props.individualUnitDisplayObjects;
        }
        UnitDrawingFunctionData.prototype.normalizeForBattleVfx = function (offset, sceneWidth, side) {
            var cloned = this.clone();
            var padding = 25;
            cloned.offset({ x: padding, y: offset.y });
            if (side === "target") {
                cloned.mirror(sceneWidth / 2);
            }
            return cloned;
        };
        UnitDrawingFunctionData.prototype.clone = function () {
            return new UnitDrawingFunctionData({
                boundingBox: this.boundingBox.clone(),
                individualUnitBoundingBoxes: this.individualUnitBoundingBoxes.map(function (bBox) {
                    return bBox.clone();
                }),
                singleAttackOriginPoint: { x: this.singleAttackOriginPoint.x, y: this.singleAttackOriginPoint.y },
                sequentialAttackOriginPoints: this.sequentialAttackOriginPoints.map(function (point) {
                    return { x: point.x, y: point.y };
                }),
                individualUnitDisplayObjects: this.individualUnitDisplayObjects.map(function (displayObject) {
                    return pixiWrapperFunctions_1.cloneDisplayObject(displayObject);
                }),
            });
        };
        UnitDrawingFunctionData.prototype.offset = function (offset) {
            offsetRectangle(this.boundingBox, offset);
            this.individualUnitBoundingBoxes.forEach(function (bBox) { return offsetRectangle(bBox, offset); });
            offsetPoint(this.singleAttackOriginPoint, offset);
            this.sequentialAttackOriginPoints.forEach(function (point) { return offsetPoint(point, offset); });
            this.individualUnitDisplayObjects.forEach(function (displayObject) {
                displayObject.x += offset.x;
                displayObject.y += offset.y;
            });
        };
        UnitDrawingFunctionData.prototype.mirror = function (midX) {
            mirrorRectangle(this.boundingBox, midX);
            this.individualUnitBoundingBoxes.forEach(function (bBox) { return mirrorRectangle(bBox, midX); });
            mirrorPoint(this.singleAttackOriginPoint, midX);
            this.sequentialAttackOriginPoints.forEach(function (point) { return mirrorPoint(point, midX); });
            this.individualUnitDisplayObjects.forEach(function (displayObject) { return displayObject.scale.x *= -1; });
        };
        return UnitDrawingFunctionData;
    }());
    exports.UnitDrawingFunctionData = UnitDrawingFunctionData;
});
define("src/UnitItems", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitItems = (function () {
        function UnitItems(itemSlots, addItemToUnit, updateUnit) {
            this.items = [];
            this.itemSlots = itemSlots;
            this.addItemToUnit = addItemToUnit;
            this.updateUnit = updateUnit;
        }
        UnitItems.prototype.getAllItems = function () {
            return this.items;
        };
        UnitItems.prototype.getItemsBySlot = function () {
            var itemsBySlot = {};
            var allItems = this.getAllItems();
            allItems.forEach(function (item) {
                if (!itemsBySlot[item.template.slot]) {
                    itemsBySlot[item.template.slot] = [];
                }
                itemsBySlot[item.template.slot].push(item);
            });
            var itemsBySlotWithEmptySlots = {};
            for (var slot in this.itemSlots) {
                itemsBySlotWithEmptySlots[slot] = itemsBySlot[slot] || [];
            }
            return itemsBySlotWithEmptySlots;
        };
        UnitItems.prototype.getItemsForSlot = function (slot) {
            return this.getItemsBySlot()[slot];
        };
        UnitItems.prototype.getAmountOfAvailableItemSlots = function (slot) {
            return this.itemSlots[slot] - this.getItemsForSlot(slot).length;
        };
        UnitItems.prototype.getAttributeAdjustments = function () {
            return this.getAllItems().filter(function (item) {
                return Boolean(item.template.attributeAdjustments);
            }).map(function (item) {
                return item.template.attributeAdjustments;
            });
        };
        UnitItems.prototype.getAbilities = function () {
            return this.getAllItems().filter(function (item) {
                return Boolean(item.template.ability);
            }).map(function (item) {
                return item.template.ability;
            });
        };
        UnitItems.prototype.getPassiveSkills = function () {
            return this.getAllItems().filter(function (item) {
                return Boolean(item.template.passiveSkill);
            }).map(function (item) {
                return item.template.passiveSkill;
            });
        };
        UnitItems.prototype.hasSlotForItem = function (item) {
            return this.getAmountOfAvailableItemSlots(item.template.slot) > 0;
        };
        UnitItems.prototype.getItemAtPosition = function (slot, position) {
            var itemsForSlot = this.getItemsBySlot()[slot];
            for (var i = 0; i < itemsForSlot.length; i++) {
                if (itemsForSlot[i].positionInUnit === position) {
                    return itemsForSlot[i];
                }
            }
            return null;
        };
        UnitItems.prototype.hasItem = function (item) {
            return this.indexOf(item) !== -1;
        };
        UnitItems.prototype.addItemAtPosition = function (toAdd, position) {
            var oldItemAtTargetPosition = this.getItemAtPosition(toAdd.template.slot, position);
            if (this.hasItem(toAdd)) {
                var oldPositionForItem = toAdd.positionInUnit;
                if (oldItemAtTargetPosition) {
                    this.moveItem(oldItemAtTargetPosition, oldPositionForItem);
                }
                this.moveItem(toAdd, position);
            }
            else {
                if (toAdd.unit) {
                    toAdd.unit.items.removeItem(toAdd);
                }
                if (oldItemAtTargetPosition) {
                    this.removeItem(oldItemAtTargetPosition);
                }
                if (!this.hasSlotForItem(toAdd)) {
                    throw new Error("Tried to add item " + toAdd.template.type + " to unit without open slots.");
                }
                this.items.push(toAdd);
                toAdd.positionInUnit = position;
                this.addItemToUnit(toAdd);
                this.updateUnit(toAdd);
            }
        };
        UnitItems.prototype.addItem = function (toAdd) {
            var position = this.getFirstAvailablePositionForItem(toAdd);
            if (position === null) {
                throw new Error("Tried to add item to unit without an open slot for item.");
            }
            this.addItemAtPosition(toAdd, position);
        };
        UnitItems.prototype.moveItem = function (toMove, newPosition) {
            toMove.positionInUnit = newPosition;
        };
        UnitItems.prototype.removeItem = function (toRemove) {
            if (!this.hasItem(toRemove)) {
                throw new Error("");
            }
            this.items.splice(this.indexOf(toRemove), 1);
            toRemove.unit = undefined;
            toRemove.positionInUnit = undefined;
            this.updateUnit(toRemove);
        };
        UnitItems.prototype.destroyAllItems = function () {
            this.getAllItems().forEach(function (item) {
                item.unit.fleet.player.removeItem(item);
            });
        };
        UnitItems.prototype.serialize = function () {
            return ({
                maxItemSlots: this.itemSlots,
                itemIds: this.items.map(function (item) { return item.id; }),
            });
        };
        UnitItems.prototype.indexOf = function (item) {
            return this.items.indexOf(item);
        };
        UnitItems.prototype.getFirstAvailablePositionForItem = function (item) {
            if (!this.hasSlotForItem(item)) {
                return null;
            }
            else {
                var itemsForSlot = this.getItemsForSlot(item.template.slot).sort(function (a, b) {
                    return a.positionInUnit - b.positionInUnit;
                });
                if (itemsForSlot.length === 0) {
                    return 0;
                }
                var maxPosition = this.itemSlots[item.template.slot] - 1;
                for (var i = 0; i <= maxPosition; i++) {
                    if (itemsForSlot[i].positionInUnit !== i) {
                        return i;
                    }
                }
            }
            throw new Error("Couldn't find available slot for item");
        };
        return UnitItems;
    }());
    exports.UnitItems = UnitItems;
});
define("src/UpgradableAbilitiesData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("src/utility", ["require", "exports", "react-dom-factories", "react-motion", "src/activeModuleData"], function (require, exports, ReactDOMElements, ReactMotion, activeModuleData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    exports.randInt = randInt;
    function randRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    exports.randRange = randRange;
    function getRandomArrayKey(target) {
        return Math.floor(Math.random() * (target.length));
    }
    exports.getRandomArrayKey = getRandomArrayKey;
    function getRandomArrayItem(target) {
        var _rnd = Math.floor(Math.random() * (target.length));
        return target[_rnd];
    }
    exports.getRandomArrayItem = getRandomArrayItem;
    function getSeededRandomArrayItem(array, rng) {
        var _rnd = Math.floor(rng.uniform() * array.length);
        return array[_rnd];
    }
    exports.getSeededRandomArrayItem = getSeededRandomArrayItem;
    function getRandomKey(target) {
        var _targetKeys = Object.keys(target);
        var _rnd = Math.floor(Math.random() * (_targetKeys.length));
        return _targetKeys[_rnd];
    }
    exports.getRandomKey = getRandomKey;
    function getRandomProperty(target) {
        var _rndProp = target[getRandomKey(target)];
        return _rndProp;
    }
    exports.getRandomProperty = getRandomProperty;
    function getRandomKeyWithWeights(target) {
        var totalWeight = 0;
        for (var prop in target) {
            totalWeight += target[prop];
        }
        var selection = randRange(0, totalWeight);
        for (var prop in target) {
            selection -= target[prop];
            if (selection <= 0) {
                return prop;
            }
        }
        throw new Error();
    }
    exports.getRandomKeyWithWeights = getRandomKeyWithWeights;
    function getRandomArrayItemWithWeights(arr) {
        var totalWeight = 0;
        for (var i = 0; i < arr.length; i++) {
            totalWeight += arr[i].weight;
        }
        var selection = randRange(0, totalWeight);
        for (var i = 0; i < arr.length; i++) {
            selection -= arr[i].weight;
            if (selection <= 0) {
                return arr[i];
            }
        }
        throw new Error();
    }
    exports.getRandomArrayItemWithWeights = getRandomArrayItemWithWeights;
    function getFrom2dArray(target, arr) {
        var result = [];
        for (var i = 0; i < arr.length; i++) {
            if ((arr[i] !== undefined) &&
                (arr[i][0] >= 0 && arr[i][0] < target.length) &&
                (arr[i][1] >= 0 && arr[i][1] < target[0].length)) {
                result.push(target[arr[i][0]][arr[i][1]]);
            }
            else {
                result.push(null);
            }
        }
        return result;
    }
    exports.getFrom2dArray = getFrom2dArray;
    function flatten2dArray(toFlatten) {
        var flattened = [];
        for (var i = 0; i < toFlatten.length; i++) {
            for (var j = 0; j < toFlatten[i].length; j++) {
                flattened.push(toFlatten[i][j]);
            }
        }
        return flattened;
    }
    exports.flatten2dArray = flatten2dArray;
    function reverseSide(side) {
        switch (side) {
            case "side1":
                {
                    return "side2";
                }
            case "side2":
                {
                    return "side1";
                }
            default:
                {
                    throw new Error("Invalid side");
                }
        }
    }
    exports.reverseSide = reverseSide;
    function rectContains(rect, point) {
        var x = point.x;
        var y = point.y;
        var x1 = Math.min(rect.x1, rect.x2);
        var x2 = Math.max(rect.x1, rect.x2);
        var y1 = Math.min(rect.y1, rect.y2);
        var y2 = Math.max(rect.y1, rect.y2);
        return ((x >= x1 && x <= x2) &&
            (y >= y1 && y <= y2));
    }
    exports.rectContains = rectContains;
    function hexToString(hex) {
        var rounded = Math.round(hex);
        var converted = rounded.toString(16);
        return "000000".substr(0, 6 - converted.length) + converted;
    }
    exports.hexToString = hexToString;
    function stringToHex(text) {
        var toParse = text.charAt(0) === "#" ? text.substring(1, 7) : text;
        return parseInt(toParse, 16);
    }
    exports.stringToHex = stringToHex;
    function extendObject(from, to, onlyExtendAlreadyPresent) {
        if (onlyExtendAlreadyPresent === void 0) { onlyExtendAlreadyPresent = false; }
        if (from === null || typeof from !== "object") {
            return from;
        }
        if (from.constructor !== Object && from.constructor !== Array) {
            return from;
        }
        if (from.constructor === Date || from.constructor === RegExp || from.constructor === Function ||
            from.constructor === String || from.constructor === Number || from.constructor === Boolean) {
            return new from.constructor(from);
        }
        to = to || new from.constructor();
        var toIterateOver = onlyExtendAlreadyPresent ? to : from;
        for (var name_1 in toIterateOver) {
            if (!onlyExtendAlreadyPresent || from.hasOwnProperty(name_1)) {
                to[name_1] = extendObject(from[name_1], null);
            }
        }
        return to;
    }
    exports.extendObject = extendObject;
    function shallowCopy(toCopy) {
        return shallowExtend(toCopy);
    }
    exports.shallowCopy = shallowCopy;
    function shallowExtend() {
        var sources = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sources[_i] = arguments[_i];
        }
        var merged = {};
        sources.forEach(function (source) {
            for (var key in source) {
                merged[key] = source[key];
            }
        });
        return merged;
    }
    exports.shallowExtend = shallowExtend;
    function deepMerge(target, src, excludeKeysNotInTarget) {
        if (excludeKeysNotInTarget === void 0) { excludeKeysNotInTarget = false; }
        if (excludeKeysNotInTarget) {
            var merged = deepMerge(target, src, false);
            return deletePropertiesNotSharedWithTarget(merged, target);
        }
        var array = Array.isArray(src);
        var dst = array && [] || {};
        if (array) {
            target = target || [];
            dst = dst.concat(target);
            src.forEach(function (e, i) {
                if (typeof dst[i] === "undefined") {
                    dst[i] = e;
                }
                else if (typeof e === "object") {
                    dst[i] = deepMerge(target[i], e);
                }
                else {
                    if (target.indexOf(e) === -1) {
                        dst.push(e);
                    }
                }
            });
        }
        else {
            if (target && typeof target === "object") {
                Object.keys(target).forEach(function (key) {
                    dst[key] = target[key];
                });
            }
            Object.keys(src).forEach(function (key) {
                if (typeof src[key] !== "object" || !src[key]) {
                    dst[key] = src[key];
                }
                else {
                    if (!target[key]) {
                        dst[key] = src[key];
                    }
                    else {
                        dst[key] = deepMerge(target[key], src[key]);
                    }
                }
            });
        }
        return dst;
    }
    exports.deepMerge = deepMerge;
    function deletePropertiesNotSharedWithTarget(source, target) {
        var dst = {};
        for (var key in target) {
            if (typeof target[key] !== "object" || !target[key]) {
                dst[key] = source[key];
            }
            else {
                dst[key] = deletePropertiesNotSharedWithTarget(source[key], target[key]);
            }
        }
        return dst;
    }
    function recursiveRemoveAttribute(parent, attribute) {
        parent.removeAttribute(attribute);
        for (var i = 0; i < parent.children.length; i++) {
            var child = parent.children[i];
            recursiveRemoveAttribute(child, attribute);
        }
    }
    exports.recursiveRemoveAttribute = recursiveRemoveAttribute;
    function clamp(value, min, max) {
        if (value < min) {
            return min;
        }
        else if (value > max) {
            return max;
        }
        else {
            return value;
        }
    }
    exports.clamp = clamp;
    function roundToNearestMultiple(value, multiple) {
        var resto = value % multiple;
        if (resto <= (multiple / 2)) {
            return value - resto;
        }
        else {
            return value + multiple - resto;
        }
    }
    exports.roundToNearestMultiple = roundToNearestMultiple;
    function prettifyDate(date) {
        return ([
            [
                date.getDate(),
                date.getMonth() + 1,
                date.getFullYear().toString().slice(2, 4),
            ].join("/"),
            [
                date.getHours(),
                date.getMinutes().toString().length < 2 ? "0" + date.getMinutes() : date.getMinutes().toString(),
            ].join(":"),
        ].join(" "));
    }
    exports.prettifyDate = prettifyDate;
    function getRelativeValue(value, min, max, inverse) {
        if (inverse === void 0) { inverse = false; }
        if (inverse) {
            if (min === max) {
                return 0;
            }
            else {
                return 1 - ((value - min) / (max - min));
            }
        }
        else {
            if (min === max) {
                return 1;
            }
            else {
                return (value - min) / (max - min);
            }
        }
    }
    exports.getRelativeValue = getRelativeValue;
    function smoothStep(value, min, max, inverse) {
        if (inverse === void 0) { inverse = false; }
        return clamp(getRelativeValue(value, min, max, inverse), 0.0, 1.0);
    }
    exports.smoothStep = smoothStep;
    function getRelativeWeightsFromObject(byCount) {
        var relativeWeights = {};
        var min = 0;
        var max = Object.keys(byCount).map(function (key) {
            return byCount[key];
        }).reduce(function (maxWeight, itemWeight) {
            return Math.max(maxWeight, itemWeight);
        }, min);
        for (var prop in byCount) {
            var count = byCount[prop];
            relativeWeights[prop] = getRelativeValue(count, min, max);
        }
        return relativeWeights;
    }
    exports.getRelativeWeightsFromObject = getRelativeWeightsFromObject;
    function getDropTargetAtLocation(x, y) {
        var dropTargets = document.getElementsByClassName("drop-target");
        var point = {
            x: x,
            y: y,
        };
        for (var i = 0; i < dropTargets.length; i++) {
            var node = dropTargets[i];
            var nodeBounds = node.getBoundingClientRect();
            var rect = {
                x1: nodeBounds.left,
                x2: nodeBounds.right,
                y1: nodeBounds.top,
                y2: nodeBounds.bottom,
            };
            if (rectContains(rect, point)) {
                return node;
            }
        }
        return null;
    }
    exports.getDropTargetAtLocation = getDropTargetAtLocation;
    function loadDom() {
        if (document.readyState === "interactive" || document.readyState === "complete") {
            return Promise.resolve();
        }
        else {
            return new Promise(function (resolve) {
                document.addEventListener("DOMContentLoaded", function () { resolve(); });
            });
        }
    }
    exports.loadDom = loadDom;
    function probabilityDistributionsAreWeighted(distributions) {
        return Boolean(distributions[0].weight);
    }
    function probabilityItemsAreTerminal(items) {
        var firstItem = items[0];
        return !firstItem.probabilityItems;
    }
    function getItemsFromProbabilityDistributions(distributions) {
        var allItems = [];
        if (distributions.length === 0) {
            return allItems;
        }
        if (probabilityDistributionsAreWeighted(distributions)) {
            var selected = getRandomArrayItemWithWeights(distributions);
            if (!probabilityItemsAreTerminal(selected.probabilityItems)) {
                var probabilityItems = selected.probabilityItems;
                allItems = allItems.concat(getItemsFromProbabilityDistributions(probabilityItems));
            }
            else {
                var toAdd = selected.probabilityItems;
                allItems = allItems.concat(toAdd);
            }
        }
        else {
            for (var i = 0; i < distributions.length; i++) {
                var selected = distributions[i];
                if (Math.random() < selected.flatProbability) {
                    if (!probabilityItemsAreTerminal(selected.probabilityItems)) {
                        allItems = allItems.concat(getItemsFromProbabilityDistributions(selected.probabilityItems));
                    }
                    else {
                        var toAdd = selected.probabilityItems;
                        allItems = allItems.concat(toAdd);
                    }
                }
            }
        }
        return allItems;
    }
    exports.getItemsFromProbabilityDistributions = getItemsFromProbabilityDistributions;
    function transformMat3(a, m) {
        var x = m[0] * a.x + m[3] * a.y + m[6];
        var y = m[1] * a.x + m[4] * a.y + m[7];
        return { x: x, y: y };
    }
    exports.transformMat3 = transformMat3;
    function shallowEqual(a, b) {
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);
        var hasSameAmountOfProperties = aProps.length === bProps.length;
        if (!hasSameAmountOfProperties) {
            return false;
        }
        var allPropertyValuesMatch = aProps.every(function (prop) {
            return a[prop] === b[prop];
        });
        if (!allPropertyValuesMatch) {
            return false;
        }
        return true;
    }
    exports.shallowEqual = shallowEqual;
    function pointsEqual(p1, p2) {
        return (p1.x === p2.x && p1.y === p2.y);
    }
    exports.pointsEqual = pointsEqual;
    function makeRandomPersonality() {
        var unitCompositionPreference = {};
        for (var archetype in activeModuleData_1.activeModuleData.templates.UnitArchetypes) {
            unitCompositionPreference[archetype] = Math.random();
        }
        return ({
            expansiveness: Math.random(),
            aggressiveness: Math.random(),
            friendliness: Math.random(),
            unitCompositionPreference: unitCompositionPreference,
        });
    }
    exports.makeRandomPersonality = makeRandomPersonality;
    function splitMultilineText(text) {
        if (Array.isArray(text)) {
            var returnArr = [];
            for (var i = 0; i < text.length; i++) {
                returnArr.push(text[i]);
                returnArr.push(ReactDOMElements.br({
                    key: "" + i,
                }));
            }
            return returnArr;
        }
        else {
            return text;
        }
    }
    exports.splitMultilineText = splitMultilineText;
    function mergeReactAttributes() {
        var toMerge = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            toMerge[_i] = arguments[_i];
        }
        var merged = shallowExtend.apply(void 0, [{}].concat(toMerge));
        var stringProps = ["className", "id"];
        stringProps.forEach(function (prop) {
            var joined = toMerge.filter(function (attributes) {
                return Boolean(attributes[prop]);
            }).map(function (attributes) {
                return attributes[prop];
            }).join(" ");
            merged[prop] = joined;
        });
        return merged;
    }
    exports.mergeReactAttributes = mergeReactAttributes;
    function getUniqueArrayKeys(source, getIdentifier) {
        var uniqueKeysById = {};
        source.forEach(function (key) {
            var id = getIdentifier(key);
            uniqueKeysById[id] = key;
        });
        return Object.keys(uniqueKeysById).map(function (type) { return uniqueKeysById[type]; });
    }
    exports.getUniqueArrayKeys = getUniqueArrayKeys;
    function extractFlagsFromFlagWord(flagWord, allFlags) {
        if (flagWord === 0) {
            var hasExplicitZeroFlag = isFinite(allFlags[0]);
            if (hasExplicitZeroFlag) {
                return [allFlags[0]];
            }
            else {
                return [];
            }
        }
        var allPresentFlags = Object.keys(allFlags).map(function (key) {
            return allFlags[key];
        }).filter(function (flag) {
            return Boolean(flagWord & flag);
        });
        return allPresentFlags;
    }
    exports.extractFlagsFromFlagWord = extractFlagsFromFlagWord;
    function getFunctionName(f) {
        var result = /^function\s+([\w\$]+)\s*\(/.exec(f.toString());
        return result ? result[1] : "anonymous";
    }
    exports.getFunctionName = getFunctionName;
    function fixedDurationSpring(value, duration, overshoot) {
        if (overshoot === void 0) { overshoot = 0; }
        var w = duration / 1000;
        var o = overshoot;
        var s = o <= 0
            ? 1 - o
            : 1 / Math.sqrt(1 + Math.pow(2 * Math.PI / Math.log(1 / (o * o)), 2));
        var ks = (2 * Math.PI / w) / Math.max(Math.sqrt(1 - s * s), 0.5);
        var damping = Math.min(2 * ks * s, 100);
        var stiffness = Math.min(ks * ks, 1000);
        return ReactMotion.spring(value, { stiffness: stiffness, damping: damping });
    }
    exports.fixedDurationSpring = fixedDurationSpring;
    function stringIsSignedFloat(toCheck) {
        var signedFloatRegex = /^(-?(?:0|[1-9]\d*)(?:\.\d+)?)?$/;
        return signedFloatRegex.test(toCheck);
    }
    exports.stringIsSignedFloat = stringIsSignedFloat;
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
define("src/ValuesByPlayer", ["require", "exports", "src/IdDictionary"], function (require, exports, IdDictionary_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValuesByPlayer = (function (_super) {
        __extends(ValuesByPlayer, _super);
        function ValuesByPlayer(players, getValueFN) {
            return _super.call(this, players, getValueFN) || this;
        }
        return ValuesByPlayer;
    }(IdDictionary_1.IdDictionary));
    exports.ValuesByPlayer = ValuesByPlayer;
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
define("src/ValuesByStar", ["require", "exports", "src/IdDictionary"], function (require, exports, IdDictionary_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValuesByStar = (function (_super) {
        __extends(ValuesByStar, _super);
        function ValuesByStar(stars, getValueFN) {
            return _super.call(this, stars, getValueFN) || this;
        }
        return ValuesByStar;
    }(IdDictionary_1.IdDictionary));
    exports.ValuesByStar = ValuesByStar;
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
define("src/ValuesByUnit", ["require", "exports", "src/IdDictionary"], function (require, exports, IdDictionary_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValuesByUnit = (function (_super) {
        __extends(ValuesByUnit, _super);
        function ValuesByUnit(units, getValueFN) {
            return _super.call(this, units, getValueFN) || this;
        }
        return ValuesByUnit;
    }(IdDictionary_1.IdDictionary));
    exports.ValuesByUnit = ValuesByUnit;
});
define("src/versions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Version = (function () {
        function Version(versionString) {
            var _a;
            _a = versionString.split(".").map(function (n) { return parseInt(n); }), this.major = _a[0], this.minor = _a[1], this.patch = _a[2];
        }
        return Version;
    }());
    function compare(a, b) {
        var aVer = new Version(a);
        var bVer = new Version(b);
        var majorSort = aVer.major - bVer.major;
        if (majorSort) {
            return majorSort;
        }
        var minorSort = aVer.minor - bVer.minor;
        if (minorSort) {
            return minorSort;
        }
        var patchSort = aVer.patch - bVer.patch;
        if (patchSort) {
            return patchSort;
        }
        return 0;
    }
    exports.compare = compare;
    function gt(a, b) {
        return compare(a, b) > 0;
    }
    exports.gt = gt;
    function gte(a, b) {
        return compare(a, b) >= 0;
    }
    exports.gte = gte;
    function lt(a, b) {
        return compare(a, b) < 0;
    }
    exports.lt = lt;
});
define("src/voronoi", ["require", "exports", "voronoi", "src/VoronoiCell"], function (require, exports, Voronoi, VoronoiCell_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeVoronoi(points, width, height) {
        var boundingBox = {
            xl: 0,
            xr: width,
            yt: 0,
            yb: height,
        };
        var voronoi = new Voronoi();
        var diagram = voronoi.compute(points, boundingBox);
        return diagram;
    }
    exports.makeVoronoi = makeVoronoi;
    function relaxVoronoi(diagram, getRelaxAmountFN) {
        for (var i = 0; i < diagram.cells.length; i++) {
            var cell = diagram.cells[i];
            var point = cell.site;
            var vertices = cell.halfedges.map(function (halfEdge) {
                return halfEdge.getStartpoint();
            });
            var centroid = getPolygonCentroid(vertices);
            if (getRelaxAmountFN) {
                var dampingValue = getRelaxAmountFN(point);
                var xDelta = (centroid.x - point.x) * dampingValue;
                var yDelta = (centroid.y - point.y) * dampingValue;
                point.x = point.x + xDelta;
                point.y = point.y + yDelta;
            }
            else {
                point.x = centroid.x;
                point.y = centroid.y;
            }
        }
    }
    exports.relaxVoronoi = relaxVoronoi;
    function setVoronoiCells(cells) {
        cells.forEach(function (cell) {
            var castedSite = cell.site;
            var isFiller = !isFinite(castedSite.id);
            if (isFiller) {
                cell.site.voronoiCell = new VoronoiCell_1.VoronoiCell(cell);
            }
            else {
                cell.site.voronoiCell = new VoronoiCell_1.VoronoiCell(cell);
            }
        });
    }
    exports.setVoronoiCells = setVoronoiCells;
    function getPolygonCentroid(vertices) {
        var signedArea = 0;
        var x = 0;
        var y = 0;
        var x0;
        var y0;
        var x1;
        var y1;
        var a;
        var i = 0;
        for (i = 0; i < vertices.length - 1; i++) {
            x0 = vertices[i].x;
            y0 = vertices[i].y;
            x1 = vertices[i + 1].x;
            y1 = vertices[i + 1].y;
            a = x0 * y1 - x1 * y0;
            signedArea += a;
            x += (x0 + x1) * a;
            y += (y0 + y1) * a;
        }
        x0 = vertices[i].x;
        y0 = vertices[i].y;
        x1 = vertices[0].x;
        y1 = vertices[0].y;
        a = x0 * y1 - x1 * y0;
        signedArea += a;
        x += (x0 + x1) * a;
        y += (y0 + y1) * a;
        signedArea *= 0.5;
        x /= (6.0 * signedArea);
        y /= (6.0 * signedArea);
        return ({
            x: x,
            y: y,
        });
    }
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
define("src/VoronoiCell", ["require", "exports", "voronoi"], function (require, exports, Voronoi) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VoronoiCell = (function (_super) {
        __extends(VoronoiCell, _super);
        function VoronoiCell(cell) {
            var _this = _super.call(this, cell.site) || this;
            _this.halfedges = cell.halfedges;
            var bbox = cell.getBbox();
            _this.x = bbox.x;
            _this.y = bbox.y;
            _this.width = bbox.width;
            _this.height = bbox.height;
            _this.vertices = cell.halfedges.map(function (halfEdge) {
                return halfEdge.getStartpoint();
            });
            return _this;
        }
        return VoronoiCell;
    }(Voronoi.prototype.Cell));
    exports.VoronoiCell = VoronoiCell;
});
//# sourceMappingURL=index.js.map