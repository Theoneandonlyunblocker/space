define("modules/defaultnotifications/assets", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.iconSources = {
        test1: "./img/test1.png",
        test2: "./img/test2.png",
        test3: "./img/test3.png",
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
define("modules/defaultnotifications/defaultNotifications", ["require", "exports", "modules/englishlanguage/englishLanguage", "src/GameModuleInitializationPhase", "modules/defaultnotifications/notificationTemplates", "modules/defaultnotifications/assets", "json!modules/defaultnotifications/moduleInfo.json"], function (require, exports, englishLanguage_1, GameModuleInitializationPhase_1, notificationTemplates_1, assets_1, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultNotifications = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.GameStart,
        supportedLanguages: [englishLanguage_1.englishLanguage],
        initialize: function (baseUrl) {
            assets_1.setBaseUrl(baseUrl);
            return Promise.resolve();
        },
        addToModuleData: function (moduleData) {
            var _a;
            moduleData.copyTemplates(notificationTemplates_1.notificationTemplates, "Notifications");
            (_a = moduleData.scripts).add.apply(_a, notificationTemplates_1.notificationCreationScripts);
            return moduleData;
        },
    };
});
define("modules/defaultnotifications/localization/en/notificationMessages", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var battleFinish = {
        attackSuccessful: "{attackerName} successfully attacked {locationName}.",
        attackUnsuccessful: "{attackerName} unsuccessfully attacked {locationName}.",
        locationConquered: "{attackerName} now controls {locationName}.",
        locationNotConquered: "{defenderName} maintains control of {locationName}.",
    };
    exports.notificationMessages = {
        battleFinishTitle: "Battle finished",
        battleFinishMessage: "A battle was fought in {locationName} between {attackerName} and {defenderName}",
        battleFinishText_attackerLost: battleFinish.attackUnsuccessful + " " + battleFinish.locationNotConquered,
        battleFinishText_attackerWon: battleFinish.attackSuccessful + " " + battleFinish.locationNotConquered,
        battleFinishText_locationConquered: battleFinish.attackSuccessful + " " + battleFinish.locationConquered,
        playerDiedTitle: "Player eliminated",
        playerDiedMessage: "{playerName} " +
            "{count, plural," +
            "  one   {was}" +
            "  other {were}" +
            "}" +
            " eliminated.",
        playerDiedTextTop: "Here lies {playerName}.",
        playerDiedTextBottom: "{playerPronoun} never scored.",
        warDeclarationTitle: "War declaration",
        warDeclarationMessage: "{aggressorName} declared war on {defenderName}.",
        warDeclarationText: "{aggressorName} declared war on {defenderName}.",
    };
});
define("modules/defaultnotifications/localization/localize", ["require", "exports", "modules/englishlanguage/englishLanguage", "src/localization/Localizer", "modules/defaultnotifications/localization/en/notificationMessages"], function (require, exports, englishLanguage_1, Localizer_1, notificationMessages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.localizer = new Localizer_1.Localizer("notificationMessages");
    exports.localizer.setAllMessages(notificationMessages_1.notificationMessages, englishLanguage_1.englishLanguage);
    exports.localize = exports.localizer.localize.bind(exports.localizer);
});
define("modules/defaultnotifications/notifications/battleFinishNotification", ["require", "exports", "src/notifications/NotificationFilterState", "src/notifications/NotificationWitnessCriterion", "src/notifications/activeNotificationStore", "modules/defaultnotifications/localization/localize", "modules/defaultnotifications/notifications/uicomponents/BattleFinishNotification", "modules/defaultnotifications/assets"], function (require, exports, NotificationFilterState_1, NotificationWitnessCriterion_1, activeNotificationStore_1, localize_1, BattleFinishNotification_1, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.battleFinishNotification = {
        key: "battleFinishNotification",
        displayName: "Battle finished",
        category: "combat",
        defaultFilterState: [NotificationFilterState_1.NotificationFilterState.NeverShow],
        witnessCriteria: [
            [NotificationWitnessCriterion_1.NotificationWitnessCriterion.IsInvolved],
            [NotificationWitnessCriterion_1.NotificationWitnessCriterion.LocationIsVisible],
        ],
        getIconSrc: assets_1.getIconSrc.bind(null, "test1"),
        contentConstructor: BattleFinishNotification_1.BattleFinishNotification,
        messageConstructor: function (props) {
            return localize_1.localize("battleFinishMessage")({
                locationName: props.location.name,
                attackerName: props.attacker.name.toString(),
                defenderName: props.defender.name.toString(),
            });
        },
        getTitle: function (props) { return localize_1.localize("battleFinishTitle")(); },
        serializeProps: function (props) {
            return ({
                attackerId: props.attacker.id,
                defenderId: props.defender.id,
                locationId: props.location.id,
                victorId: props.victor.id,
                newControllerId: props.newController.id,
            });
        },
        deserializeProps: function (props, gameLoader) {
            return ({
                attacker: gameLoader.playersById[props.attackerId],
                defender: gameLoader.playersById[props.defenderId],
                location: gameLoader.starsById[props.locationId],
                victor: gameLoader.playersById[props.victorId],
                newController: gameLoader.playersById[props.newControllerId],
            });
        },
    };
    exports.battleFinishNotificationCreationScripts = {
        battle: {
            battleFinish: [
                {
                    key: "makeBattleFinishNotification",
                    priority: 0,
                    script: function (battle) {
                        activeNotificationStore_1.activeNotificationStore.makeNotification({
                            template: exports.battleFinishNotification,
                            props: {
                                location: battle.battleData.location,
                                attacker: battle.battleData.attacker.player,
                                defender: battle.battleData.defender.player,
                                victor: battle.victor,
                                newController: battle.battleData.location.owner,
                            },
                            involvedPlayers: [battle.side1Player, battle.side2Player],
                            location: battle.battleData.location,
                        });
                    },
                },
            ],
        },
    };
});
define("modules/defaultnotifications/notifications/playerDiedNotification", ["require", "exports", "modules/defaultnotifications/localization/localize", "src/notifications/NotificationFilterState", "src/notifications/NotificationWitnessCriterion", "src/notifications/activeNotificationStore", "modules/defaultnotifications/notifications/uicomponents/PlayerDiedNotification", "modules/defaultnotifications/assets"], function (require, exports, localize_1, NotificationFilterState_1, NotificationWitnessCriterion_1, activeNotificationStore_1, PlayerDiedNotification_1, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.playerDiedNotification = {
        key: "playerDiedNotification",
        displayName: "Player died",
        category: "game",
        defaultFilterState: [NotificationFilterState_1.NotificationFilterState.AlwaysShow],
        witnessCriteria: [[NotificationWitnessCriterion_1.NotificationWitnessCriterion.MetOneInvolvedPlayer]],
        getIconSrc: assets_1.getIconSrc.bind(null, "test3"),
        contentConstructor: PlayerDiedNotification_1.PlayerDiedNotification,
        messageConstructor: function (props) {
            return localize_1.localize("playerDiedMessage")({
                playerName: props.deadPlayerName,
                count: 1,
            });
        },
        getTitle: function (props) { return localize_1.localize("playerDiedTitle")(); },
        serializeProps: function (props) {
            return ({
                deadPlayerName: props.deadPlayerName,
            });
        },
        deserializeProps: function (props, gameLoader) {
            return ({
                deadPlayerName: props.deadPlayerName,
            });
        },
    };
    exports.playerDiedNotificationCreationScripts = {
        player: {
            onDeath: [
                {
                    key: "playerDiedNotification",
                    priority: 0,
                    script: function (player) {
                        activeNotificationStore_1.activeNotificationStore.makeNotification({
                            template: exports.playerDiedNotification,
                            props: {
                                deadPlayerName: player.name.fullName,
                            },
                            involvedPlayers: [player],
                            location: null,
                        });
                    },
                },
            ],
        },
    };
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
define("modules/defaultnotifications/notifications/uicomponents/BattleFinishNotification", ["require", "exports", "react", "react-dom-factories", "modules/defaultnotifications/localization/localize"], function (require, exports, React, ReactDOMElements, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BattleFinishNotificationComponent = (function (_super) {
        __extends(BattleFinishNotificationComponent, _super);
        function BattleFinishNotificationComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "BattleFinishNotification";
            return _this;
        }
        BattleFinishNotificationComponent.prototype.render = function () {
            var notification = this.props.notification;
            var location = notification.props.location;
            var attacker = notification.props.attacker;
            var defender = notification.props.defender;
            var victor = notification.props.victor;
            var newController = notification.props.newController;
            var attackWasSuccessful = victor === attacker;
            var attackerGainedControl = newController === attacker;
            var messageToLocalize = attackWasSuccessful ?
                attackerGainedControl ?
                    "battleFinishText_locationConquered" :
                    "battleFinishText_attackerWon" :
                "battleFinishText_attackerLost";
            return (ReactDOMElements.div({
                className: "battle-finish-notification",
            }, localize_1.localize(messageToLocalize)({
                attackerName: attacker.name.toString(),
                defenderName: defender.name.toString(),
                locationName: location.name.toString(),
            })));
        };
        return BattleFinishNotificationComponent;
    }(React.Component));
    exports.BattleFinishNotification = React.createFactory(BattleFinishNotificationComponent);
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
define("modules/defaultnotifications/notifications/uicomponents/PlayerDiedNotification", ["require", "exports", "react", "react-dom-factories", "modules/defaultnotifications/localization/localize"], function (require, exports, React, ReactDOMElements, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlayerDiedNotificationComponent = (function (_super) {
        __extends(PlayerDiedNotificationComponent, _super);
        function PlayerDiedNotificationComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "PlayerDiedNotification";
            return _this;
        }
        PlayerDiedNotificationComponent.prototype.render = function () {
            var notification = this.props.notification;
            return (ReactDOMElements.div({
                className: "player-died-notification",
            }, localize_1.localize("playerDiedTextTop")({
                playerName: notification.props.deadPlayerName,
            }), ReactDOMElements.br(null), ReactDOMElements.br(null), localize_1.localize("playerDiedTextBottom")({
                playerPronoun: "He",
            })));
        };
        return PlayerDiedNotificationComponent;
    }(React.Component));
    exports.PlayerDiedNotification = React.createFactory(PlayerDiedNotificationComponent);
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
define("modules/defaultnotifications/notifications/uicomponents/WarDeclarationNotification", ["require", "exports", "react", "react-dom-factories", "modules/defaultnotifications/localization/localize"], function (require, exports, React, ReactDOMElements, localize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WarDeclarationNotificationComponent = (function (_super) {
        __extends(WarDeclarationNotificationComponent, _super);
        function WarDeclarationNotificationComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.displayName = "WarDeclarationNotification";
            return _this;
        }
        WarDeclarationNotificationComponent.prototype.render = function () {
            var notification = this.props.notification;
            return (ReactDOMElements.div({
                className: "war-declaration-notification",
            }, localize_1.localize("warDeclarationText")({
                aggressorName: notification.props.aggressor.name.toString(),
                defenderName: notification.props.defender.name.toString(),
            })));
        };
        return WarDeclarationNotificationComponent;
    }(React.Component));
    exports.WarDeclarationNotification = React.createFactory(WarDeclarationNotificationComponent);
});
define("modules/defaultnotifications/notifications/warDeclarationNotification", ["require", "exports", "src/notifications/NotificationFilterState", "src/notifications/NotificationWitnessCriterion", "src/notifications/activeNotificationStore", "modules/defaultnotifications/localization/localize", "modules/defaultnotifications/notifications/uicomponents/WarDeclarationNotification", "modules/defaultnotifications/assets"], function (require, exports, NotificationFilterState_1, NotificationWitnessCriterion_1, activeNotificationStore_1, localize_1, WarDeclarationNotification_1, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.warDeclarationNotification = {
        key: "warDeclarationNotification",
        displayName: "War declaration",
        category: "diplomacy",
        defaultFilterState: [NotificationFilterState_1.NotificationFilterState.ShowIfInvolved],
        witnessCriteria: [
            [NotificationWitnessCriterion_1.NotificationWitnessCriterion.IsInvolved],
            [NotificationWitnessCriterion_1.NotificationWitnessCriterion.MetAllInvolvedPlayers],
        ],
        getIconSrc: assets_1.getIconSrc.bind(null, "test2"),
        contentConstructor: WarDeclarationNotification_1.WarDeclarationNotification,
        messageConstructor: function (props) {
            return localize_1.localize("warDeclarationMessage")({
                aggressorName: props.aggressor.name,
                defenderName: props.defender.name,
            });
        },
        getTitle: function (props) { return localize_1.localize("warDeclarationTitle")(); },
        serializeProps: function (props) {
            return ({
                aggressorId: props.aggressor.id,
                defenderId: props.defender.id,
            });
        },
        deserializeProps: function (props, gameLoader) {
            return ({
                aggressor: gameLoader.playersById[props.aggressorId],
                defender: gameLoader.playersById[props.defenderId],
            });
        },
    };
    exports.warDeclarationNotificationCreationScripts = {
        diplomacy: {
            onWarDeclaration: [
                {
                    key: "makeWarDeclarationNotification",
                    priority: 0,
                    script: function (aggressor, defender) {
                        activeNotificationStore_1.activeNotificationStore.makeNotification({
                            template: exports.warDeclarationNotification,
                            props: {
                                aggressor: aggressor,
                                defender: defender,
                            },
                            involvedPlayers: [aggressor, defender],
                            location: null,
                        });
                    },
                },
            ],
        },
    };
});
define("modules/defaultnotifications/notificationTemplates", ["require", "exports", "modules/defaultnotifications/notifications/battleFinishNotification", "modules/defaultnotifications/notifications/playerDiedNotification", "modules/defaultnotifications/notifications/warDeclarationNotification"], function (require, exports, battleFinishNotification_1, playerDiedNotification_1, warDeclarationNotification_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.notificationTemplates = (_a = {},
        _a[battleFinishNotification_1.battleFinishNotification.key] = battleFinishNotification_1.battleFinishNotification,
        _a[playerDiedNotification_1.playerDiedNotification.key] = playerDiedNotification_1.playerDiedNotification,
        _a[warDeclarationNotification_1.warDeclarationNotification.key] = warDeclarationNotification_1.warDeclarationNotification,
        _a);
    exports.notificationCreationScripts = [
        battleFinishNotification_1.battleFinishNotificationCreationScripts,
        playerDiedNotification_1.playerDiedNotificationCreationScripts,
        warDeclarationNotification_1.warDeclarationNotificationCreationScripts,
    ];
});
//# sourceMappingURL=index.js.map