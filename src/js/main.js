var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.UnitStrength = React.createClass({
            makeSquadronInfo: function () {
                return (React.DOM.div({ className: "unit-strength-container" }, this.makeStrengthText()));
            },
            makeCapitalInfo: function () {
                var text = this.makeStrengthText();
                var bar = React.DOM.progress({
                    className: "unit-strength-bar",
                    max: this.props.maxStrength,
                    value: this.props.currentStrength
                });

                return (React.DOM.div({ className: "unit-strength-container" }, text, bar));
            },
            makeStrengthText: function () {
                var critThreshhold = 0.3;
                var currentStyle = {
                    className: "unit-strength-current"
                };

                var healthRatio = this.props.currentStrength / this.props.maxStrength;

                if (healthRatio <= critThreshhold) {
                    currentStyle.className += " critical";
                } else if (this.props.currentStrength < this.props.maxStrength) {
                    currentStyle.className += " wounded";
                }

                var containerProps = {
                    className: (this.props.isSquadron ? "unit-strength-amount" : "unit-strength-amount-capital")
                };

                return (React.DOM.div(containerProps, React.DOM.span(currentStyle, this.props.currentStrength), React.DOM.span({ className: "unit-strength-max" }, " / " + this.props.maxStrength)));
            },
            render: function () {
                var toRender;
                if (this.props.isSquadron) {
                    toRender = this.makeSquadronInfo();
                } else {
                    toRender = this.makeCapitalInfo();
                }

                return (toRender);
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="unitstrength.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.UnitActions = React.createClass({
            render: function () {
                var availableSrc = "img\/icons\/availableAction.png";
                var spentSrc = "img\/icons\/spentAction.png";

                var icons = [];

                for (var i = 0; i < this.props.currentActionPoints; i++) {
                    icons.push(React.DOM.img({
                        src: availableSrc,
                        key: "available" + i
                    }));
                }
                var availableCount = this.props.maxActionPoints - this.props.currentActionPoints;
                for (var i = 0; i < availableCount; i++) {
                    icons.push(React.DOM.img({
                        src: spentSrc,
                        key: "spent" + i
                    }));
                }

                return (React.DOM.div({ className: "unit-action-points" }, icons));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="unitstrength.ts"/>
/// <reference path="unitactions.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.UnitInfo = React.createClass({
            render: function () {
                var unit = this.props.unit;

                return (React.DOM.div({ className: "unit-info" }, React.DOM.div({ className: "unit-info-name" }, this.props.name), Rance.UIComponents.UnitStrength(this.props.strengthProps), Rance.UIComponents.UnitActions(this.props.actionProps)));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="unitstrength.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.UnitIcon = React.createClass({
            render: function () {
                var unit = this.props.unit;

                var imageProps = {
                    className: "unit-icon",
                    src: this.props.icon
                };

                var fillerProps = {
                    className: "unit-icon-filler"
                };

                if (this.props.isActiveUnit) {
                    fillerProps.className += " active-border";
                    imageProps.className += " active-border";
                }

                if (this.props.facesLeft) {
                    fillerProps.className += " unit-border-right";
                    imageProps.className += " unit-border-no-right";
                } else {
                    fillerProps.className += " unit-border-left";
                    imageProps.className += " unit-border-no-left";
                }

                var middleElement = this.props.icon ? React.DOM.img(imageProps) : React.DOM.div(imageProps);

                return (React.DOM.div({ className: "unit-icon-container" }, React.DOM.div(fillerProps), middleElement, React.DOM.div(fillerProps)));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="unitinfo.ts"/>
/// <reference path="uniticon.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.Unit = React.createClass({
            getInitialState: function () {
                return ({
                    hasPopup: false,
                    popupElement: null
                });
            },
            tooltipContent: function () {
                return React.DOM.div(null, "lol");

                if (!this.props.activeTargets || !this.props.activeTargets[this.props.unit.id]) {
                    return null;
                }

                var elements = [];
                var targetableOnThis = this.props.activeTargets[this.props.unit.id];

                for (var i = 0; i < targetableOnThis.length; i++) {
                    elements.push(React.DOM.div({ key: "" + i }, targetableOnThis[i].name));
                }

                return React.DOM.div(null, elements);
            },
            handleMouseEnter: function (e) {
                this.props.handleMouseEnterUnit(e, this.props.unit, this.props.facesLeft, this.getDOMNode());
            },
            handleMouseLeave: function (e) {
                this.props.handleMouseLeaveUnit(e, this.props.unit, this.props.facesLeft, this.getDOMNode());
            },
            render: function () {
                var unit = this.props.unit;

                var containerProps = {
                    className: "unit-container",
                    key: "container"
                };
                var wrapperProps = {
                    className: "unit-wrapper"
                };

                var targetable = true;

                if (unit.currentStrength <= 0) {
                    targetable = false;
                    console.log(unit, targetable);
                }

                if (targetable) {
                    wrapperProps.onMouseEnter = this.handleMouseEnter;
                    wrapperProps.onMouseLeave = this.handleMouseLeave;
                }

                if (this.props.facesLeft) {
                    containerProps.className += " enemy-unit";
                    wrapperProps.className += " enemy-unit-bg";
                } else {
                    containerProps.className += " friendly-unit";
                    wrapperProps.className += " friendly-unit-bg";
                }

                var isActiveUnit = (unit.id === this.props.activeUnit.id);

                if (isActiveUnit) {
                    containerProps.className += " active-unit";
                    wrapperProps.className += " active-unit-bg";
                }

                var infoProps = {
                    key: "info",
                    name: unit.name,
                    strengthProps: {
                        maxStrength: unit.maxStrength,
                        currentStrength: unit.currentStrength,
                        isSquadron: unit.isSquadron
                    },
                    actionProps: {
                        maxActionPoints: unit.maxActionPoints,
                        currentActionPoints: unit.battleStats.currentActionPoints
                    }
                };

                var containerElements = [
                    React.DOM.div({ className: "unit-image", key: "image" }),
                    Rance.UIComponents.UnitInfo(infoProps)
                ];

                if (this.props.facesLeft) {
                    containerElements = containerElements.reverse();
                }

                var allElements = [
                    React.DOM.div(containerProps, containerElements),
                    Rance.UIComponents.UnitIcon({
                        icon: unit.template.icon,
                        facesLeft: this.props.facesLeft,
                        key: "icon",
                        isActiveUnit: isActiveUnit
                    })
                ];

                if (this.props.facesLeft) {
                    allElements = allElements.reverse();
                }

                return (React.DOM.div(wrapperProps, allElements));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="uniticon.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.EmptyUnit = React.createClass({
            render: function () {
                var containerProps = {
                    className: "unit-container",
                    key: "container"
                };

                if (this.props.facesLeft) {
                    containerProps.className += " enemy-unit";
                } else {
                    containerProps.className += " friendly-unit";
                }

                var allElements = [
                    React.DOM.div(containerProps, null),
                    Rance.UIComponents.UnitIcon({
                        icon: null,
                        facesLeft: this.props.facesLeft,
                        key: "icon"
                    })
                ];

                if (this.props.facesLeft) {
                    allElements = allElements.reverse();
                }

                return (React.DOM.div({ className: "unit-wrapper" }, allElements));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../unit/unit.ts"/>
/// <reference path="../unit/emptyunit.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.FleetColumn = React.createClass({
            render: function () {
                var column = this.props.column;

                var units = [];

                for (var i = 0; i < column.length; i++) {
                    var data = {};

                    data.key = i;
                    data.facesLeft = this.props.facesLeft;
                    data.activeUnit = this.props.activeUnit;
                    data.activeTargets = this.props.activeTargets;
                    data.handleMouseLeaveUnit = this.props.handleMouseLeaveUnit;
                    data.handleMouseEnterUnit = this.props.handleMouseEnterUnit;

                    if (!column[i]) {
                        units.push(Rance.UIComponents.EmptyUnit(data));
                    } else {
                        data.unit = column[i];
                        units.push(Rance.UIComponents.Unit(data));
                    }
                }

                return (React.DOM.div({ className: "battle-fleet-column" }, units));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="fleetcolumn.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.Fleet = React.createClass({
            render: function () {
                var fleet = this.props.fleet;

                var columns = [];

                for (var i = 0; i < fleet.length; i++) {
                    columns.push(Rance.UIComponents.FleetColumn({
                        key: i,
                        column: fleet[i],
                        facesLeft: this.props.facesLeft,
                        activeUnit: this.props.activeUnit,
                        handleMouseEnterUnit: this.props.handleMouseEnterUnit,
                        handleMouseLeaveUnit: this.props.handleMouseLeaveUnit
                    }));
                }

                return (React.DOM.div({ className: "battle-fleet" }, columns));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.TurnCounter = React.createClass({
            render: function () {
                var turnsLeft = this.props.turnsLeft;

                var turns = [];

                var usedTurns = this.props.maxTurns - turnsLeft;

                for (var i = 0; i < usedTurns; i++) {
                    turns.push(React.DOM.div({
                        key: "used" + i,
                        className: "turn-counter used-turn"
                    }));
                }

                for (var i = 0; i < turnsLeft; i++) {
                    turns.push(React.DOM.div({
                        key: "available" + i,
                        className: "turn-counter available-turn"
                    }));
                }

                return (React.DOM.div({ className: "turns-container" }, turns));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.TurnOrder = React.createClass({
            render: function () {
                var turnOrder = this.props.turnOrder;

                var toRender = [];

                for (var i = 0; i < turnOrder.length && i < 8; i++) {
                    var unit = turnOrder[i];

                    var data = {
                        key: "" + i,
                        className: "turn-order-unit",
                        title: "delay: " + unit.battleStats.moveDelay + "\n" + "speed: " + unit.attributes.speed
                    };

                    if (this.props.unitsBySide.side1.indexOf(unit) > -1) {
                        data.className += " turn-order-unit-friendly";
                    } else if (this.props.unitsBySide.side2.indexOf(unit) > -1) {
                        data.className += " turn-order-unit-enemy";
                    }

                    toRender.push(React.DOM.div(data, unit.name));
                }

                return (React.DOM.div({ className: "turn-order-container" }, toRender));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.AbilityTooltip = React.createClass({
            handleAbilityUse: function (ability) {
                this.props.handleAbilityUse(ability, this.props.targetUnit);
            },
            render: function () {
                var abilities = this.props.activeTargets[this.props.targetUnit.id];

                var abilityElements = [];

                var containerProps = {
                    className: "ability-tooltip",
                    onMouseLeave: this.props.handleMouseLeave
                };

                var parentRect = this.props.parentElement.getBoundingClientRect();

                if (this.props.facesLeft) {
                    containerProps.className += " ability-tooltip-faces-left";

                    containerProps.style = {
                        top: parentRect.top,
                        left: parentRect.right - 96 - 128
                    };
                } else {
                    containerProps.className += " ability-tooltip-faces-right";

                    containerProps.style = {
                        top: parentRect.top,
                        left: parentRect.left + 96
                    };
                }

                for (var i = 0; i < abilities.length; i++) {
                    var ability = abilities[i];
                    var data = {};

                    data.className = "ability-tooltip-ability";
                    data.key = i;
                    data.onClick = this.handleAbilityUse.bind(null, ability);

                    abilityElements.push(React.DOM.div(data, ability.name));
                }

                return (React.DOM.div(containerProps, abilityElements));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="fleet.ts"/>
/// <reference path="turncounter.ts"/>
/// <reference path="turnorder.ts"/>
/// <reference path="abilitytooltip.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.Battle = React.createClass({
            getInitialState: function () {
                return ({
                    drawAbilityTooltip: false,
                    abilityTooltip: {
                        targetUnit: null,
                        parentElement: null
                    }
                });
            },
            clearAbilityTooltip: function () {
                this.setState({
                    drawAbilityTooltip: false,
                    abilityTooltip: {
                        targetUnit: null,
                        parentElement: null
                    }
                });
            },
            handleMouseLeaveUnit: function (e) {
                if (!this.state.drawAbilityTooltip || !this.refs.abilityTooltip)
                    return;

                if (e.nativeEvent.toElement !== this.state.abilityTooltip.parentElement && e.nativeEvent.toElement !== this.refs.abilityTooltip.getDOMNode() && e.nativeEvent.toElement.parentElement !== this.refs.abilityTooltip.getDOMNode()) {
                    this.clearAbilityTooltip();
                }
            },
            handleMouseEnterUnit: function (e, unit, facesLeft, parentElement) {
                this.setState({
                    drawAbilityTooltip: true,
                    abilityTooltip: {
                        targetUnit: unit,
                        parentElement: parentElement,
                        facesLeft: facesLeft
                    }
                });
            },
            handleAbilityUse: function (ability, target) {
                Rance.useAbility(this.props.battle, this.props.battle.activeUnit, ability, target);
                this.clearAbilityTooltip();
                this.props.battle.endTurn();
            },
            render: function () {
                var battle = this.props.battle;

                var activeTargets = Rance.getTargetsForAllAbilities(battle, battle.activeUnit);

                var abilityTooltip = null;

                if (this.state.drawAbilityTooltip && activeTargets[this.state.abilityTooltip.targetUnit.id]) {
                    abilityTooltip = Rance.UIComponents.AbilityTooltip({
                        handleAbilityUse: this.handleAbilityUse,
                        handleMouseLeave: this.handleMouseLeaveUnit,
                        targetUnit: this.state.abilityTooltip.targetUnit,
                        parentElement: this.state.abilityTooltip.parentElement,
                        facesLeft: this.state.abilityTooltip.facesLeft,
                        activeTargets: activeTargets,
                        ref: "abilityTooltip"
                    });
                }

                return (React.DOM.div({ className: "battle-container" }, Rance.UIComponents.TurnOrder({
                    turnOrder: battle.turnOrder,
                    unitsBySide: battle.unitsBySide
                }), React.DOM.div({ className: "fleets-container" }, Rance.UIComponents.Fleet({
                    fleet: battle.side1,
                    activeUnit: battle.activeUnit,
                    activeTargets: activeTargets,
                    handleMouseEnterUnit: this.handleMouseEnterUnit,
                    handleMouseLeaveUnit: this.handleMouseLeaveUnit
                }), Rance.UIComponents.TurnCounter({
                    turnsLeft: battle.turnsLeft,
                    maxTurns: battle.maxTurns
                }), Rance.UIComponents.Fleet({
                    fleet: battle.side2,
                    facesLeft: true,
                    activeUnit: battle.activeUnit,
                    activeTargets: activeTargets,
                    handleMouseEnterUnit: this.handleMouseEnterUnit,
                    handleMouseLeaveUnit: this.handleMouseLeaveUnit
                }), abilityTooltip)));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../../lib/react.d.ts" />
/// <reference path="battle/battle.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.Stage = React.createClass({
            render: function () {
                return (React.DOM.div({ className: "react-stage" }, Rance.UIComponents.Battle({ battle: this.props.battle })));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../../lib/react.d.ts" />
/// <reference path="stage.ts"/>
var Rance;
(function (Rance) {
    var ReactUI = (function () {
        function ReactUI(container, battle) {
            this.container = container;
            this.battle = battle;
            this.render();
        }
        ReactUI.prototype.render = function () {
            React.renderComponent(Rance.UIComponents.Stage({ battle: this.battle }), this.container);
        };
        return ReactUI;
    })();
    Rance.ReactUI = ReactUI;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    Rance.randInt = randInt;
    function getRandomArrayItem(target) {
        var _rnd = Math.floor(Math.random() * (target.length));
        return target[_rnd];
    }
    Rance.getRandomArrayItem = getRandomArrayItem;
    function getFrom2dArray(target, arr) {
        var result = [];
        for (var i = 0; i < arr.length; i++) {
            if ((arr[i] !== undefined) && (arr[i][0] >= 0 && arr[i][0] < target.length) && (arr[i][1] >= 0 && arr[i][1] < target[0].length)) {
                result.push(target[arr[i][0]][arr[i][1]]);
            } else {
                result.push(null);
            }
        }
        ;
        return result;
    }
    Rance.getFrom2dArray = getFrom2dArray;
    function flatten2dArray(toFlatten) {
        var flattened = [];
        for (var i = 0; i < toFlatten.length; i++) {
            for (var j = 0; j < toFlatten[i].length; j++) {
                flattened.push(toFlatten[i][j]);
            }
        }

        return flattened;
    }
    Rance.flatten2dArray = flatten2dArray;
    function reverseSide(side) {
        switch (side) {
            case "side1": {
                return "side2";
            }
            case "side2": {
                return "side1";
            }
            default: {
                throw new Error("Invalid side");
            }
        }
    }
    Rance.reverseSide = reverseSide;
})(Rance || (Rance = {}));
/// <reference path="utility.ts"/>
/// <reference path="unit.ts"/>
var Rance;
(function (Rance) {
    //**
    //**
    //X*
    //**
    Rance.targetSingle;
    Rance.targetSingle = function (fleets, target) {
        return Rance.getFrom2dArray(fleets, [target]);
    };

    //XX
    //XX
    //XX
    //XX
    Rance.targetAll;
    Rance.targetAll = function (fleets, target) {
        var allTargets = [];

        for (var i = 0; i < fleets.length; i++) {
            for (var j = 0; j < fleets[i].length; j++) {
                allTargets.push(fleets[i][j]);
            }
        }

        return allTargets;
    };

    //**
    //**
    //XX
    //**
    Rance.targetRow;
    Rance.targetRow = function (fleets, target) {
        var y = target[1];
        var allTargets = [];

        for (var i = 0; i < fleets.length; i++) {
            allTargets.push([i, y]);
        }

        return Rance.getFrom2dArray(fleets, allTargets);
    };

    //X*
    //X*
    //X*
    //X*
    Rance.targetColumn;
    Rance.targetColumn = function (fleets, target) {
        var x = target[0];
        var allTargets = [];

        for (var i = 0; i < fleets[x].length; i++) {
            allTargets.push([x, i]);
        }

        return Rance.getFrom2dArray(fleets, allTargets);
    };

    //**
    //X*
    //X*
    //X*
    Rance.targetColumnNeighbors;
    Rance.targetColumnNeighbors = function (fleets, target) {
        var x = target[0];
        var y = target[1];
        var allTargets = [];

        allTargets.push([x, y - 1]);
        allTargets.push([x, y + 1]);

        return Rance.getFrom2dArray(fleets, allTargets);
    };

    //**
    //X*
    //XX
    //X*
    Rance.targetNeighbors;
    Rance.targetNeighbors = function (fleets, target) {
        var x = target[0];
        var y = target[1];
        var allTargets = [];

        allTargets.push([x, y]);
        allTargets.push([x - 1, y]);
        allTargets.push([x + 1, y]);
        allTargets.push([x, y - 1]);
        allTargets.push([x, y + 1]);

        console.log(target, allTargets);

        return Rance.getFrom2dArray(fleets, allTargets);
    };
})(Rance || (Rance = {}));
/// <reference path="../../src/targeting.ts" />
/// <reference path="../../src/unit.ts" />
var Rance;
(function (Rance) {
    (function (Templates) {
        (function (Abilities) {
            Abilities.rangedAttack = {
                name: "rangedAttack",
                moveDelay: 100,
                actionsUse: 1,
                targetFleets: "enemy",
                targetingFunction: Rance.targetSingle,
                targetRange: "all",
                effect: function (user, target) {
                    target.removeStrength(100);
                }
            };
            Abilities.closeAttack = {
                name: "closeAttack",
                moveDelay: 90,
                actionsUse: 2,
                targetFleets: "enemy",
                targetingFunction: Rance.targetNeighbors,
                targetRange: "close",
                effect: function (user, target) {
                    target.removeStrength(100);
                }
            };
            Abilities.standBy = {
                name: "standBy",
                moveDelay: 50,
                actionsUse: "all",
                targetFleets: "all",
                targetingFunction: Rance.targetSingle,
                targetRange: "self",
                effect: function () {
                }
            };
        })(Templates.Abilities || (Templates.Abilities = {}));
        var Abilities = Templates.Abilities;
    })(Rance.Templates || (Rance.Templates = {}));
    var Templates = Rance.Templates;
})(Rance || (Rance = {}));
/// <reference path="abilitytemplates.ts"/>
var Rance;
(function (Rance) {
    (function (Templates) {
        (function (ShipTypes) {
            ShipTypes.fighterSquadron = {
                typeName: "Fighter Squadron",
                isSquadron: true,
                icon: "img\/icons\/f.png",
                maxStrength: 0.7,
                attributeLevels: {
                    attack: 0.8,
                    defence: 0.6,
                    intelligence: 0.4,
                    speed: 1
                },
                abilities: [
                    Rance.Templates.Abilities.rangedAttack,
                    Rance.Templates.Abilities.closeAttack,
                    Rance.Templates.Abilities.standBy
                ]
            };
            ShipTypes.battleCruiser = {
                typeName: "Battlecruiser",
                isSquadron: false,
                icon: "img\/icons\/b.png",
                maxStrength: 1,
                attributeLevels: {
                    attack: 0.8,
                    defence: 0.8,
                    intelligence: 0.7,
                    speed: 0.6
                },
                abilities: [
                    Rance.Templates.Abilities.rangedAttack,
                    Rance.Templates.Abilities.closeAttack,
                    Rance.Templates.Abilities.standBy
                ]
            };
        })(Templates.ShipTypes || (Templates.ShipTypes = {}));
        var ShipTypes = Templates.ShipTypes;
    })(Rance.Templates || (Rance.Templates = {}));
    var Templates = Rance.Templates;
})(Rance || (Rance = {}));
/// <reference path="unit.ts"/>
var Rance;
(function (Rance) {
    var Battle = (function () {
        function Battle(units) {
            this.unitsById = {};
            this.unitsBySide = {
                side1: [],
                side2: []
            };
            this.turnOrder = [];
            this.side1 = units.side1;
            this.side2 = units.side2;
        }
        Battle.prototype.init = function () {
            var self = this;

            ["side1", "side2"].forEach(function (sideId) {
                var side = self[sideId];
                for (var i = 0; i < side.length; i++) {
                    for (var j = 0; j < side[i].length; j++) {
                        if (side[i][j]) {
                            self.unitsById[side[i][j].id] = side[i][j];
                            self.unitsBySide[sideId].push(side[i][j]);

                            var pos = sideId === "side1" ? [i, j] : [i + 2, j];

                            self.initUnit(side[i][j], sideId, pos);
                        }
                    }
                }
            });

            this.maxTurns = 24;
            this.turnsLeft = this.maxTurns;
            this.updateTurnOrder();
            this.setActiveUnit();
        };
        Battle.prototype.forEachUnit = function (operator) {
            for (var id in this.unitsById) {
                operator.call(this, this.unitsById[id]);
            }
        };
        Battle.prototype.initUnit = function (unit, side, position) {
            unit.resetBattleStats();
            unit.setBattlePosition(this, side, position);
            this.addUnitToTurnOrder(unit);
        };
        Battle.prototype.removeUnitFromTurnOrder = function (unit) {
            var unitIndex = this.turnOrder.indexOf(unit);
            if (unitIndex < 0)
                return false;

            this.turnOrder.splice(unitIndex, 1);
        };
        Battle.prototype.addUnitToTurnOrder = function (unit) {
            var unitIndex = this.turnOrder.indexOf(unit);
            if (unitIndex >= 0)
                return false;

            this.turnOrder.push(unit);
        };
        Battle.prototype.updateTurnOrder = function () {
            function turnOrderSortFunction(a, b) {
                if (a.battleStats.moveDelay !== b.battleStats.moveDelay) {
                    return a.battleStats.moveDelay - b.battleStats.moveDelay;
                } else {
                    return a.id - b.id;
                }
            }

            this.turnOrder.sort(turnOrderSortFunction);

            function turnOrderFilterFunction(unit) {
                if (unit.battleStats.currentActionPoints <= 0) {
                    return false;
                }

                if (unit.currentStrength <= 0) {
                    return false;
                }

                return true;
            }

            this.turnOrder = this.turnOrder.filter(turnOrderFilterFunction);
        };
        Battle.prototype.setActiveUnit = function () {
            this.activeUnit = this.turnOrder[0];
        };
        Battle.prototype.endTurn = function () {
            this.turnsLeft--;
            this.updateTurnOrder();
            this.setActiveUnit();
        };
        Battle.prototype.getFleetsForSide = function (side) {
            switch (side) {
                case "all": {
                    return this.side1.concat(this.side2);
                }
                case "side1":
                case "side2": {
                    return this[side];
                }
            }
        };
        return Battle;
    })();
    Rance.Battle = Battle;
})(Rance || (Rance = {}));
/// <reference path="../data/templates/abilitytemplates.ts" />
/// <reference path="battle.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="targeting.ts"/>
var Rance;
(function (Rance) {
    function useAbility(battle, user, ability, target) {
        var isValidTarget = validateTarget(battle, user, ability, target);

        if (!isValidTarget) {
            console.warn("Invalid target");
        }

        var targetsInArea = getUnitsInAbilityArea(battle, user, ability, target.battleStats.position);

        for (var i = 0; i < targetsInArea.length; i++) {
            var target = targetsInArea[i];

            ability.effect.call(null, user, target);
        }

        user.removeActionPoints(ability.actionsUse);
        user.addMoveDelay(ability.moveDelay);
    }
    Rance.useAbility = useAbility;
    function validateTarget(battle, user, ability, target) {
        var potentialTargets = getPotentialTargets(battle, user, ability);

        return potentialTargets.indexOf(target) >= 0;
    }
    Rance.validateTarget = validateTarget;
    function getPotentialTargets(battle, user, ability) {
        if (ability.targetRange === "self") {
            return [user];
        }
        var fleetsToTarget = getFleetsToTarget(battle, user, ability);

        if (ability.targetRange === "close") {
            var farColumnForSide = {
                side1: 0,
                side2: 3
            };

            if (user.battleStats.position[0] === farColumnForSide[user.battleStats.side]) {
                return [];
            }

            var oppositeSide = Rance.reverseSide(user.battleStats.side);

            fleetsToTarget[farColumnForSide[oppositeSide]] = [null];
        }

        return Rance.flatten2dArray(fleetsToTarget).filter(Boolean);

        throw new Error();
    }
    Rance.getPotentialTargets = getPotentialTargets;
    function getFleetsToTarget(battle, user, ability) {
        var nullFleet = [
            [null, null, null, null],
            [null, null, null, null]
        ];
        var insertNullBefore;
        var toConcat;

        switch (ability.targetFleets) {
            case "all": {
                return battle.side1.concat(battle.side2);
            }
            case "ally": {
                insertNullBefore = user.battleStats.side === "side1" ? false : true;
                toConcat = battle[user.battleStats.side];
                break;
            }
            case "enemy": {
                insertNullBefore = user.battleStats.side === "side1" ? true : false;
                toConcat = battle[Rance.reverseSide(user.battleStats.side)];
                break;
            }
        }

        if (insertNullBefore) {
            return nullFleet.concat(toConcat);
        } else {
            return toConcat.concat(nullFleet);
        }
    }
    Rance.getFleetsToTarget = getFleetsToTarget;
    function getPotentialTargetsByPosition(battle, user, ability) {
        var targets = getPotentialTargets(battle, user, ability);
        var targetPositions = [];

        for (var i = 0; i < targets.length; i++) {
            targetPositions.push(targets[i].battleStats.position);
        }

        return targetPositions;
    }
    Rance.getPotentialTargetsByPosition = getPotentialTargetsByPosition;
    function getUnitsInAbilityArea(battle, user, ability, target) {
        var targetFleets = getFleetsToTarget(battle, user, ability);

        var inArea = ability.targetingFunction(targetFleets, target);

        return inArea.filter(Boolean);
    }
    Rance.getUnitsInAbilityArea = getUnitsInAbilityArea;

    function getTargetsForAllAbilities(battle, user) {
        var allTargets = {};

        for (var i = 0; i < user.abilities.length; i++) {
            var ability = user.abilities[i];

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
    Rance.getTargetsForAllAbilities = getTargetsForAllAbilities;
})(Rance || (Rance = {}));
/// <reference path="../data/templates/typetemplates.ts" />
/// <reference path="../data/templates/abilitytemplates.ts" />
/// <reference path="utility.ts"/>
/// <reference path="ability.ts"/>
var Rance;
(function (Rance) {
    var idGenerators = idGenerators || {};
    idGenerators.unit = 0;

    var Unit = (function () {
        function Unit(template) {
            this.id = idGenerators.unit++;

            this.template = template;
            this.abilities = template.abilities;
            this.name = this.id + " " + template.typeName;
            this.isSquadron = template.isSquadron;
            this.setValues();
        }
        Unit.prototype.setValues = function () {
            this.setBaseHealth();
            this.setActionPoints();
            this.setAttributes();
        };
        Unit.prototype.setBaseHealth = function () {
            var min = 500 * this.template.maxStrength;
            var max = 1000 * this.template.maxStrength;
            this.maxStrength = Rance.randInt(min, max);
            if (true) {
                this.currentStrength = this.maxStrength;
            } else {
                this.currentStrength = Rance.randInt(this.maxStrength / 10, this.maxStrength);
            }
        };
        Unit.prototype.setActionPoints = function () {
            this.maxActionPoints = Rance.randInt(3, 6);
        };
        Unit.prototype.setAttributes = function (experience, variance) {
            if (typeof experience === "undefined") { experience = 1; }
            if (typeof variance === "undefined") { variance = 1; }
            var template = this.template;

            var attributes = {
                attack: 1,
                defence: 1,
                intelligence: 1,
                speed: 1
            };

            for (var attribute in template.attributeLevels) {
                var attributeLevel = template.attributeLevels[attribute];

                var min = 8 * experience * attributeLevel + 1;
                var max = 16 * experience * attributeLevel + 1 + variance;

                attributes[attribute] = Rance.randInt(min, max);
                if (attributes[attribute] > 20)
                    attributes[attribute] = 20;
            }

            this.attributes = attributes;
        };
        Unit.prototype.getBaseMoveDelay = function () {
            return 30 - this.attributes.speed;
        };
        Unit.prototype.resetBattleStats = function () {
            this.battleStats = {
                moveDelay: this.getBaseMoveDelay(),
                currentActionPoints: this.maxActionPoints,
                battle: null,
                side: null,
                position: null
            };
        };
        Unit.prototype.setBattlePosition = function (battle, side, position) {
            this.battleStats.battle = battle;
            this.battleStats.side = side;
            this.battleStats.position = position;
        };

        Unit.prototype.removeStrength = function (amount) {
            this.currentStrength -= amount;
            if (this.currentStrength < 0) {
                this.currentStrength = 0;
            }
        };
        Unit.prototype.removeActionPoints = function (amount) {
            if (amount === "all") {
                this.battleStats.currentActionPoints = 0;
            } else if (isFinite(amount)) {
                this.battleStats.currentActionPoints -= amount;
                if (this.battleStats.currentActionPoints < 0) {
                    this.battleStats.currentActionPoints = 0;
                }
            }
        };
        Unit.prototype.addMoveDelay = function (amount) {
            this.battleStats.moveDelay += amount;
        };
        return Unit;
    })();
    Rance.Unit = Unit;
})(Rance || (Rance = {}));
/// <reference path="reactui/reactui.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="battle.ts"/>
/// <reference path="ability.ts"/>
var fleet1, fleet2, battle, reactUI;
var Rance;
(function (Rance) {
    document.addEventListener('DOMContentLoaded', function () {
        fleet1 = [];
        fleet2 = [];

        [fleet1, fleet2].forEach(function (fleet) {
            for (var i = 0; i < 2; i++) {
                var emptySlot = Rance.randInt(0, 3);
                var row = [];
                for (var j = 0; j < 4; j++) {
                    if (j === emptySlot) {
                        row.push(null);
                    } else {
                        var type = Rance.getRandomArrayItem(["fighterSquadron", "battleCruiser"]);
                        row.push(new Rance.Unit(Rance.Templates.ShipTypes[type]));
                    }
                }
                fleet.push(row);
            }
        });

        battle = new Rance.Battle({
            side1: fleet1,
            side2: fleet2
        });

        battle.init();

        reactUI = new Rance.ReactUI(document.getElementById("react-container"), battle);
    });
})(Rance || (Rance = {}));
//# sourceMappingURL=main.js.map
