/// <reference path="../lib/pixi.d.ts" />
var Rance;
(function (Rance) {
    function EventManager() {
    }
    Rance.EventManager = EventManager;
    ;

    var et = PIXI.EventTarget;

    et.mixin(EventManager.prototype);

    Rance.eventManager = new EventManager();
})(Rance || (Rance = {}));
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

                return (React.DOM.div(containerProps, React.DOM.span(currentStyle, this.props.currentStrength), React.DOM.span({ className: "unit-strength-max" }, "/" + this.props.maxStrength)));
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
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.UnitStatus = React.createClass({
            render: function () {
                var statusElement = null;

                if (this.props.guard.value > 0) {
                    var guard = this.props.guard;
                    statusElement = React.DOM.div({
                        className: "guard-wrapper"
                    }, React.DOM.progress({
                        className: "guard-meter",
                        max: 100,
                        value: guard.value
                    }), React.DOM.div({
                        className: "guard-text-container"
                    }, React.DOM.div({
                        className: "guard-text"
                    }, "Guard"), React.DOM.div({
                        className: "guard-amount"
                    }, "" + guard.value + "%")));
                }

                return (React.DOM.div({ className: "unit-status" }, statusElement));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="unitstrength.ts"/>
/// <reference path="unitactions.ts"/>
/// <reference path="unitstatus.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.UnitInfo = React.createClass({
            render: function () {
                var unit = this.props.unit;

                return (React.DOM.div({ className: "unit-info" }, React.DOM.div({ className: "unit-info-name" }, unit.name), Rance.UIComponents.UnitStatus({
                    guard: unit.battleStats.guard
                }), Rance.UIComponents.UnitStrength({
                    maxStrength: unit.maxStrength,
                    currentStrength: unit.currentStrength,
                    isSquadron: unit.isSquadron
                }), Rance.UIComponents.UnitActions({
                    maxActionPoints: unit.maxActionPoints,
                    currentActionPoints: unit.battleStats.currentActionPoints
                })));
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
/// <reference path="../../../lib/react.d.ts" />
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.Draggable = {
            getDefaultProps: function () {
                return ({
                    dragThreshhold: 5
                });
            },
            getInitialState: function () {
                return ({
                    mouseDown: false,
                    dragging: false,
                    dragOffset: {
                        x: 0,
                        y: 0
                    },
                    mouseDownPosition: {
                        x: 0,
                        y: 0
                    },
                    originPosition: {
                        x: 0,
                        y: 0
                    },
                    clone: null
                });
            },
            handleMouseDown: function (e) {
                var clientRect = this.DOMNode.getBoundingClientRect();

                this.addEventListeners();

                this.setState({
                    mouseDown: true,
                    mouseDownPosition: {
                        x: e.pageX,
                        y: e.pageY
                    },
                    originPosition: {
                        x: clientRect.left + document.body.scrollLeft,
                        y: clientRect.top + document.body.scrollTop
                    },
                    dragOffset: {
                        x: e.clientX - clientRect.left,
                        y: e.clientY - clientRect.top
                    }
                });
            },
            handleMouseMove: function (e) {
                if (e.clientX === 0 && e.clientY === 0)
                    return;

                if (!this.state.dragging) {
                    var deltaX = Math.abs(e.pageX - this.state.mouseDownPosition.x);
                    var deltaY = Math.abs(e.pageY - this.state.mouseDownPosition.y);

                    var delta = deltaX + deltaY;

                    if (delta >= this.props.dragThreshhold) {
                        var stateObj = {
                            dragging: true,
                            dragPos: {
                                width: parseInt(this.DOMNode.offsetWidth),
                                height: parseInt(this.DOMNode.offsetHeight)
                            }
                        };

                        if (this.props.makeClone) {
                            var clone = this.DOMNode.cloneNode(true);
                            Rance.recursiveRemoveAttribute(clone, "data-reactid");

                            this.DOMNode.parentNode.appendChild(clone);
                            stateObj.clone = clone;
                        }

                        this.setState(stateObj);

                        if (this.onDragStart) {
                            this.onDragStart(e);
                        }
                    }
                }

                if (this.state.dragging) {
                    this.handleDrag(e);
                }
            },
            handleDrag: function (e) {
                var x = e.pageX - this.state.dragOffset.x;
                var y = e.pageY - this.state.dragOffset.y;

                var domWidth = this.state.dragPos.width || parseInt(this.DOMNode.offsetWidth);
                var domHeight = this.state.dragPos.height || parseInt(this.DOMNode.offsetHeight);

                var containerWidth = parseInt(this.containerElement.offsetWidth);
                var containerHeight = parseInt(this.containerElement.offsetHeight);

                var x2 = x + domWidth;
                var y2 = y + domHeight;

                if (x < 0) {
                    x = 0;
                } else if (x2 > containerWidth) {
                    x = containerWidth - domWidth;
                }
                ;

                if (y < 0) {
                    y = 0;
                } else if (y2 > containerHeight) {
                    y = containerHeight - domHeight;
                }
                ;

                this.setState({
                    dragPos: {
                        top: y,
                        left: x,
                        width: this.props.makeClone ? null : this.state.dragPos.width,
                        height: this.props.makeClone ? null : this.state.dragPos.height
                    }
                });

                //this.DOMNode.style.left = x+"px";
                //this.DOMNode.style.top = y+"px";
                if (this.onDragMove) {
                    this.onDragMove(x, y);
                }
            },
            handleMouseUp: function (e) {
                this.setState({
                    mouseDown: false,
                    mouseDownPosition: {
                        x: 0,
                        y: 0
                    }
                });

                if (this.state.dragging) {
                    this.handleDragEnd(e);
                }

                this.removeEventListeners();
            },
            handleDragEnd: function (e) {
                if (this.state.clone) {
                    this.state.clone.parentNode.removeChild(this.state.clone);
                }
                this.setState({
                    dragging: false,
                    dragOffset: {
                        x: 0,
                        y: 0
                    },
                    originPosition: {
                        x: 0,
                        y: 0
                    },
                    clone: null
                });

                if (this.onDragEnd) {
                    var endSuccesful = this.onDragEnd(e);

                    if (!endSuccesful) {
                        this.DOMNode.style.left = this.state.originPosition.x + "px";
                        this.DOMNode.style.top = this.state.originPosition.y + "px";
                    } else {
                        this.DOMNode.style.left = this.props.position.left;
                        this.DOMNode.style.top = this.props.position.top;
                    }
                }
            },
            addEventListeners: function () {
                var self = this;
                this.containerElement.addEventListener("mousemove", self.handleMouseMove);
                document.addEventListener("mouseup", self.handleMouseUp);
            },
            removeEventListeners: function () {
                var self = this;
                this.containerElement.removeEventListener("mousemove", self.handleMouseMove);
                document.removeEventListener("mouseup", self.handleMouseUp);
            },
            componentDidMount: function () {
                this.DOMNode = this.getDOMNode();
                this.containerElement = document.body;
                if (this.props.containerElement) {
                    if (this.props.containerElement.getDOMNode) {
                        // React component
                        this.containerElement = this.props.containerElement.getDOMNode();
                    } else
                        this.containerElement = this.props.containerElement;
                }
            },
            componentWillUnmount: function () {
                this.removeEventListeners();
            }
        };
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="unitinfo.ts"/>
/// <reference path="uniticon.ts"/>
/// <reference path="../mixins/draggable.ts" />
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.Unit = React.createClass({
            mixins: [Rance.UIComponents.Draggable],
            getInitialState: function () {
                return ({
                    hasPopup: false,
                    popupElement: null
                });
            },
            onDragStart: function (e) {
                this.props.onDragStart(this.props.unit);
            },
            onDragEnd: function (e) {
                this.props.onDragEnd();
            },
            handleMouseEnter: function (e) {
                if (!this.props.handleMouseEnterUnit)
                    return;

                this.props.handleMouseEnterUnit(this.props.unit);
            },
            handleMouseLeave: function (e) {
                if (!this.props.handleMouseLeaveUnit)
                    return;

                this.props.handleMouseLeaveUnit(e);
            },
            render: function () {
                var unit = this.props.unit;

                var containerProps = {
                    className: "unit-container",
                    key: "container"
                };
                var wrapperProps = {
                    className: "unit",
                    id: "unit-id_" + unit.id
                };

                wrapperProps.onMouseEnter = this.handleMouseEnter;
                wrapperProps.onMouseLeave = this.handleMouseLeave;

                if (this.props.isDraggable) {
                    wrapperProps.className += " draggable";
                    wrapperProps.onMouseDown = this.handleMouseDown;
                }

                if (this.state.dragging) {
                    wrapperProps.style = this.state.dragPos;
                    wrapperProps.className += " dragging";
                }

                if (this.props.facesLeft) {
                    wrapperProps.className += " enemy-unit";
                } else {
                    wrapperProps.className += " friendly-unit";
                }

                var isActiveUnit = (this.props.activeUnit && unit.id === this.props.activeUnit.id);

                if (isActiveUnit) {
                    wrapperProps.className += " active-unit";
                }

                var isInPotentialTargetArea = (this.props.targetsInPotentialArea && this.props.targetsInPotentialArea.indexOf(unit) >= 0);

                if (isInPotentialTargetArea) {
                    wrapperProps.className += " target-unit";
                }

                if (this.props.hoveredUnit && this.props.hoveredUnit.id === unit.id) {
                    wrapperProps.className += " hovered-unit";
                }

                var infoProps = {
                    key: "info",
                    unit: unit
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
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.EmptyUnit = React.createClass({
            render: function () {
                var wrapperProps = {
                    className: "unit empty-unit"
                };

                var containerProps = {
                    className: "unit-container",
                    key: "container"
                };

                if (this.props.facesLeft) {
                    wrapperProps.className += " enemy-unit";
                } else {
                    wrapperProps.className += " friendly-unit";
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
        UIComponents.UnitWrapper = React.createClass({
            handleMouseUp: function () {
                this.props.onMouseUp(this.props.position);
            },
            render: function () {
                var allElements = [];

                var wrapperProps = {
                    className: "unit-wrapper"
                };

                if (this.props.onMouseUp) {
                    wrapperProps.onMouseUp = this.handleMouseUp;
                }
                ;

                var empty = Rance.UIComponents.EmptyUnit({
                    facesLeft: this.props.facesLeft,
                    key: "empty_" + this.props.key,
                    position: this.props.position
                });

                allElements.push(empty);

                if (this.props.unit) {
                    var unit = Rance.UIComponents.Unit(this.props);
                    allElements.push(unit);
                }

                return (React.DOM.div(wrapperProps, allElements));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../unit/unit.ts"/>
/// <reference path="../unit/emptyunit.ts"/>
/// <reference path="../unit/unitwrapper.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.FleetColumn = React.createClass({
            render: function () {
                var column = this.props.column;

                var absoluteColumnPosition = this.props.columnPosInOwnFleet + (this.props.facesLeft ? 2 : 0);

                var units = [];

                for (var i = 0; i < column.length; i++) {
                    var data = {};

                    data.key = i;
                    data.unit = column[i];
                    data.position = [absoluteColumnPosition, i];
                    data.facesLeft = this.props.facesLeft;
                    data.activeUnit = this.props.activeUnit;
                    data.activeTargets = this.props.activeTargets;
                    data.hoveredUnit = this.props.hoveredUnit;
                    data.handleMouseLeaveUnit = this.props.handleMouseLeaveUnit;
                    data.handleMouseEnterUnit = this.props.handleMouseEnterUnit;
                    data.targetsInPotentialArea = this.props.targetsInPotentialArea;

                    data.onMouseUp = this.props.onMouseUp;

                    data.isDraggable = this.props.isDraggable;
                    data.onDragStart = this.props.onDragStart;
                    data.onDragEnd = this.props.onDragEnd;

                    /*
                    if (!data.unit)
                    {
                    units.push(UIComponents.EmptyUnit(data));
                    }
                    else
                    {
                    units.push(UIComponents.Unit(data));
                    }*/
                    units.push(Rance.UIComponents.UnitWrapper(data));
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
                        columnPosInOwnFleet: i,
                        facesLeft: this.props.facesLeft,
                        activeUnit: this.props.activeUnit,
                        hoveredUnit: this.props.hoveredUnit,
                        handleMouseEnterUnit: this.props.handleMouseEnterUnit,
                        handleMouseLeaveUnit: this.props.handleMouseLeaveUnit,
                        targetsInPotentialArea: this.props.targetsInPotentialArea,
                        onMouseUp: this.props.onMouseUp,
                        isDraggable: this.props.isDraggable,
                        onDragStart: this.props.onDragStart,
                        onDragEnd: this.props.onDragEnd
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
            getInitialState: function () {
                return ({
                    maxUnits: 7
                });
            },
            componentDidMount: function () {
                this.setMaxUnits();

                window.addEventListener("resize", this.setMaxUnits);
            },
            componentWillUnmount: function () {
                window.removeEventListener("resize", this.setMaxUnits);
            },
            setMaxUnits: function () {
                var minUnits = 7;

                var containerElement = this.getDOMNode();

                var containerWidth = containerElement.getBoundingClientRect().width;
                containerWidth -= 30;
                var unitElementWidth = 160;

                var ceil = Math.ceil(containerWidth / unitElementWidth);

                this.setState({
                    maxUnits: Math.max(ceil, minUnits)
                });
            },
            render: function () {
                var maxUnits = this.state.maxUnits;
                var turnOrder = this.props.turnOrder.slice(0);

                if (this.props.potentialDelay) {
                    var fake = {
                        isFake: true,
                        id: this.props.potentialDelay.id,
                        battleStats: {
                            moveDelay: this.props.potentialDelay.delay
                        }
                    };

                    turnOrder.push(fake);

                    turnOrder.sort(Rance.turnOrderSortFunction);
                }

                var maxUnitsWithFake = maxUnits;

                if (fake && turnOrder.indexOf(fake) <= maxUnits) {
                    maxUnitsWithFake++;
                }

                turnOrder = turnOrder.slice(0, maxUnitsWithFake);

                var toRender = [];

                for (var i = 0; i < turnOrder.length; i++) {
                    var unit = turnOrder[i];

                    if (unit.isFake) {
                        toRender.push(React.DOM.div({
                            className: "turn-order-arrow",
                            key: "" + i
                        }));
                        continue;
                    }

                    var data = {
                        key: "" + i,
                        className: "turn-order-unit",
                        title: "delay: " + unit.battleStats.moveDelay + "\n" + "speed: " + unit.attributes.speed,
                        onMouseEnter: this.props.onMouseEnterUnit.bind(null, unit),
                        onMouseLeave: this.props.onMouseLeaveUnit
                    };

                    if (this.props.unitsBySide.side1.indexOf(unit) > -1) {
                        data.className += " turn-order-unit-friendly";
                    } else if (this.props.unitsBySide.side2.indexOf(unit) > -1) {
                        data.className += " turn-order-unit-enemy";
                    }

                    if (this.props.hoveredUnit && unit.id === this.props.hoveredUnit.id) {
                        data.className += " turn-order-unit-hover";
                    }

                    toRender.push(React.DOM.div(data, unit.name));
                }

                if (this.props.turnOrder.length > maxUnits) {
                    toRender.push(React.DOM.div({
                        className: "turn-order-more",
                        key: "more"
                    }, "..."));
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
                    data.onClick = this.props.handleAbilityUse.bind(null, ability, this.props.targetUnit);

                    data.onMouseEnter = this.props.handleMouseEnterAbility.bind(null, ability);
                    data.onMouseLeave = this.props.handleMouseLeaveAbility;

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
                    abilityTooltip: {
                        parentElement: null,
                        facesLeft: null
                    },
                    hoveredAbility: null,
                    hoveredUnit: null
                });
            },
            clearHoveredUnit: function () {
                this.setState({
                    hoveredUnit: false,
                    abilityTooltip: {
                        parentElement: null
                    },
                    hoveredAbility: null,
                    potentialDelay: null,
                    targetsInPotentialArea: []
                });
            },
            handleMouseLeaveUnit: function (e) {
                if (!this.state.hoveredUnit)
                    return;

                var toElement = e.nativeEvent.toElement || e.nativeEvent.relatedTarget;

                if (!toElement) {
                    this.clearHoveredUnit();
                    return;
                }

                if (!this.refs.abilityTooltip) {
                    this.clearHoveredUnit();
                    return;
                }

                var tooltipElement = this.refs.abilityTooltip.getDOMNode();

                if (toElement !== this.state.abilityTooltip.parentElement && (this.refs.abilityTooltip && toElement !== tooltipElement) && toElement.parentElement !== tooltipElement) {
                    this.clearHoveredUnit();
                }
            },
            handleMouseEnterUnit: function (unit) {
                if (this.props.battle.ended)
                    return;

                var facesLeft = unit.battleStats.side === "side2";
                var parentElement = this.getUnitElement(unit);

                this.setState({
                    abilityTooltip: {
                        parentElement: parentElement,
                        facesLeft: facesLeft
                    },
                    hoveredUnit: unit
                });
            },
            getUnitElement: function (unit) {
                return document.getElementById("unit-id_" + unit.id);
            },
            handleAbilityUse: function (ability, target) {
                Rance.useAbility(this.props.battle, this.props.battle.activeUnit, ability, target);
                this.clearHoveredUnit();
                this.props.battle.endTurn();
            },
            finishBattle: function () {
                var battle = this.props.battle;
                if (!battle.ended)
                    throw new Error();

                battle.finishBattle();
            },
            handleMouseEnterAbility: function (ability) {
                var targetsInPotentialArea = Rance.getUnitsInAbilityArea(this.props.battle, this.props.battle.activeUnit, ability, this.state.hoveredUnit.battleStats.position);

                this.setState({
                    hoveredAbility: ability,
                    potentialDelay: {
                        id: this.props.battle.activeUnit.id,
                        delay: this.props.battle.activeUnit.battleStats.moveDelay + ability.moveDelay
                    },
                    targetsInPotentialArea: targetsInPotentialArea
                });
            },
            handleMouseLeaveAbility: function () {
                this.setState({
                    hoveredAbility: null,
                    potentialDelay: null,
                    targetsInPotentialArea: []
                });
            },
            render: function () {
                var battle = this.props.battle;

                if (!battle.ended) {
                    var activeTargets = Rance.getTargetsForAllAbilities(battle, battle.activeUnit);
                }

                var abilityTooltip = null;

                if (!battle.ended && this.state.hoveredUnit && activeTargets[this.state.hoveredUnit.id]) {
                    abilityTooltip = Rance.UIComponents.AbilityTooltip({
                        handleAbilityUse: this.handleAbilityUse,
                        handleMouseLeave: this.handleMouseLeaveUnit,
                        handleMouseEnterAbility: this.handleMouseEnterAbility,
                        handleMouseLeaveAbility: this.handleMouseLeaveAbility,
                        targetUnit: this.state.hoveredUnit,
                        parentElement: this.state.abilityTooltip.parentElement,
                        facesLeft: this.state.abilityTooltip.facesLeft,
                        activeTargets: activeTargets,
                        ref: "abilityTooltip"
                    });
                }

                return (React.DOM.div({ className: "battle-container" }, React.DOM.div({
                    className: "battle-upper"
                }, React.DOM.div({ className: "battle-upper-background" }, null), Rance.UIComponents.TurnOrder({
                    turnOrder: battle.turnOrder,
                    unitsBySide: battle.unitsBySide,
                    potentialDelay: this.state.potentialDelay,
                    hoveredUnit: this.state.hoveredUnit,
                    onMouseEnterUnit: this.handleMouseEnterUnit,
                    onMouseLeaveUnit: this.handleMouseLeaveUnit
                })), React.DOM.div({ className: "fleets-container" }, Rance.UIComponents.Fleet({
                    fleet: battle.side1,
                    activeUnit: battle.activeUnit,
                    hoveredUnit: this.state.hoveredUnit,
                    activeTargets: activeTargets,
                    targetsInPotentialArea: this.state.targetsInPotentialArea,
                    handleMouseEnterUnit: this.handleMouseEnterUnit,
                    handleMouseLeaveUnit: this.handleMouseLeaveUnit
                }), Rance.UIComponents.TurnCounter({
                    turnsLeft: battle.turnsLeft,
                    maxTurns: battle.maxTurns
                }), Rance.UIComponents.Fleet({
                    fleet: battle.side2,
                    facesLeft: true,
                    activeUnit: battle.activeUnit,
                    hoveredUnit: this.state.hoveredUnit,
                    activeTargets: activeTargets,
                    targetsInPotentialArea: this.state.targetsInPotentialArea,
                    handleMouseEnterUnit: this.handleMouseEnterUnit,
                    handleMouseLeaveUnit: this.handleMouseLeaveUnit
                }), abilityTooltip), battle.ended ? React.DOM.button({
                    className: "end-battle-button",
                    onClick: this.finishBattle
                }, "end") : null));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.SplitMultilineText = {
            splitMultilineText: function (text) {
                if (Array.isArray(text)) {
                    var returnArr = [];
                    for (var i = 0; i < text.length; i++) {
                        returnArr.push(text[i]);
                        returnArr.push(React.DOM.br(null));
                    }
                    return returnArr;
                } else {
                    return text;
                }
            }
        };
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../mixins/splitmultilinetext.ts" />
var Rance;
(function (Rance) {
    (function (UIComponents) {
        /**
        * props:
        *   listItems
        *   initialColumns
        *
        * state:
        *   selected
        *   columns
        *   sortBy
        *
        * children:
        *   listelement:
        *     key
        *     tr
        *     getData()
        *
        *  columns:
        *    props (classes etc)
        *    label
        *    sorting (alphabet, numeric, null)
        *    title?
        */
        UIComponents.List = React.createClass({
            mixins: [Rance.UIComponents.SplitMultilineText],
            getInitialState: function () {
                var initialColumn = this.props.initialColumn || this.props.initialColumns[0];

                var initialSelected = this.props.listItems[0];

                return ({
                    columns: this.props.initialColumns,
                    selected: initialSelected,
                    sortBy: {
                        column: initialColumn,
                        order: initialColumn.defaultOrder || "desc",
                        currColumnIndex: this.props.initialColumns.indexOf(initialColumn)
                    }
                });
            },
            componentDidMount: function () {
                var self = this;

                //this.handleSelectRow(this.props.sortedItems[0]);
                this.getDOMNode().addEventListener("keydown", function (event) {
                    switch (event.keyCode) {
                        case 40: {
                            self.shiftSelection(1);
                            break;
                        }
                        case 38: {
                            self.shiftSelection(-1);
                            break;
                        }
                        default: {
                            return;
                        }
                    }
                });
            },
            handleSelectColumn: function (column) {
                if (column.notSortable)
                    return;
                var order;
                if (this.state.sortBy.column.key === column.key) {
                    // flips order
                    order = this.state.sortBy.order === "desc" ? "asc" : "desc";
                } else {
                    order = column.defaultOrder;
                }

                this.setState({
                    sortBy: {
                        column: column,
                        order: order,
                        currColumnIndex: this.state.columns.indexOf(column)
                    }
                });
            },
            handleSelectRow: function (row) {
                if (this.props.onRowChange)
                    this.props.onRowChange.call(null, row);

                this.setState({
                    selected: row
                });
            },
            sort: function () {
                var self = this;
                var selectedColumn = this.state.sortBy.column;

                var initialPropToSortBy = selectedColumn.propToSortBy || selectedColumn.key;

                var itemsToSort = this.props.listItems;

                var defaultSortFN = function (a, b) {
                    var propToSortBy = initialPropToSortBy;
                    var nextIndex = self.state.sortBy.currColumnIndex;

                    for (var i = 0; i < self.state.columns.length; i++) {
                        if (a.data[propToSortBy] === b.data[propToSortBy]) {
                            nextIndex = (nextIndex + 1) % self.state.columns.length;
                            var nextColumn = self.state.columns[nextIndex];
                            propToSortBy = nextColumn.propToSortBy || nextColumn.key;
                        } else {
                            break;
                        }
                    }

                    return a.data[propToSortBy] > b.data[propToSortBy] ? 1 : -1;
                };

                if (selectedColumn.sortingFunction) {
                    itemsToSort.sort(function (a, b) {
                        var sortFNResult = selectedColumn.sortingFunction(a, b);
                        if (sortFNResult === 0) {
                            sortFNResult = defaultSortFN(a, b);
                        }
                        return sortFNResult;
                    });
                } else {
                    itemsToSort.sort(defaultSortFN);
                }

                if (this.state.sortBy.order === "desc") {
                    itemsToSort.reverse();
                }

                //else if (this.state.sortBy.order !== "desc") throw new Error("Invalid sort parameter");
                this.props.sortedItems = itemsToSort;
            },
            shiftSelection: function (amountToShift) {
                var reverseIndexes = {};
                for (var i = 0; i < this.props.sortedItems.length; i++) {
                    reverseIndexes[this.props.sortedItems[i].key] = i;
                }
                ;
                var currSelectedIndex = reverseIndexes[this.state.selected.key];
                var nextIndex = (currSelectedIndex + amountToShift) % this.props.sortedItems.length;
                if (nextIndex < 0) {
                    nextIndex += this.props.sortedItems.length;
                }
                this.setState({
                    selected: this.props.sortedItems[nextIndex]
                });
            },
            render: function () {
                var self = this;
                var columns = [];
                var headerLabels = [];

                this.state.columns.forEach(function (column) {
                    var colProps = {
                        key: column.key
                    };

                    if (self.props.colStylingFN) {
                        colProps = self.props.colStylingFN(column, colProps);
                    }

                    columns.push(React.DOM.col(colProps));

                    var sortStatus = null;

                    if (!column.notSortable)
                        sortStatus = "sortable";

                    if (self.state.sortBy.column && self.state.sortBy.column.key === column.key) {
                        sortStatus += " sorted-" + self.state.sortBy.order;
                    } else if (!column.notSortable)
                        sortStatus += " unsorted";

                    headerLabels.push(React.DOM.th({
                        className: sortStatus,
                        title: column.title || colProps.title || null,
                        onMouseDown: self.handleSelectColumn.bind(null, column),
                        onTouchStart: self.handleSelectColumn.bind(null, column),
                        key: column.key
                    }, column.label));
                });

                this.sort();

                var sortedItems = this.props.sortedItems;

                var rows = [];

                sortedItems.forEach(function (item) {
                    item.data.key = item.key;
                    item.data.activeColumns = self.state.columns;
                    item.data.handleClick = self.handleSelectRow.bind(null, item);
                    item.data.isSelected = (self.state.selected && self.state.selected.key === item.key);
                    var row = item.data.rowConstructor(item.data);

                    rows.push(row);
                });

                return (React.DOM.table({
                    tabIndex: 1,
                    className: "react-list"
                }, React.DOM.colgroup(null, columns), React.DOM.thead(null, React.DOM.tr(null, headerLabels)), React.DOM.tbody(null, rows)));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../mixins/draggable.ts" />
/// <reference path="../unit/unitstrength.ts" />
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.UnitListItem = React.createClass({
            mixins: [Rance.UIComponents.Draggable],
            onDragStart: function (e) {
                this.props.onDragStart(this.props.unit);
            },
            onDragEnd: function (e) {
                this.props.onDragEnd();
            },
            makeCell: function (type) {
                var cellProps = {};
                cellProps.key = type;
                cellProps.className = "unit-list-item-cell" + " unit-list-" + type;

                var cellContent;

                switch (type) {
                    case "strength": {
                        cellContent = Rance.UIComponents.UnitStrength({
                            maxStrength: this.props.maxStrength,
                            currentStrength: this.props.currentStrength,
                            isSquadron: true
                        });

                        break;
                    }
                    default: {
                        cellContent = this.props[type];

                        break;
                    }
                }

                return (React.DOM.td(cellProps, cellContent));
            },
            render: function () {
                var unit = this.props.unit;
                var columns = this.props.activeColumns;

                var cells = [];

                for (var i = 0; i < columns.length; i++) {
                    var cell = this.makeCell(columns[i].key);

                    cells.push(cell);
                }

                var rowProps = {
                    className: "unit-list-item draggable",
                    onClick: this.props.handleClick,
                    onTouchStart: this.handleMouseDown,
                    onMouseDown: this.handleMouseDown
                };

                if (this.props.isSelected) {
                    rowProps.className += " selected";
                }
                ;

                if (this.props.isReserved) {
                    rowProps.className += " reserved";
                }

                if (this.state.dragging) {
                    rowProps.style = this.state.dragPos;
                    rowProps.className += " dragging";
                }

                return (React.DOM.tr(rowProps, cells));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="list.ts" />
/// <reference path="unitlistitem.ts" />
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.UnitList = React.createClass({
            render: function () {
                var rows = [];

                for (var id in this.props.units) {
                    var unit = this.props.units[id];

                    var data = {
                        unit: unit,
                        id: unit.id,
                        name: unit.name,
                        typeName: unit.template.typeName,
                        strength: "" + unit.currentStrength + " / " + unit.maxStrength,
                        currentStrength: unit.currentStrength,
                        maxStrength: unit.maxStrength,
                        maxActionPoints: unit.maxActionPoints,
                        attack: unit.attributes.attack,
                        defence: unit.attributes.defence,
                        intelligence: unit.attributes.intelligence,
                        speed: unit.attributes.speed,
                        rowConstructor: Rance.UIComponents.UnitListItem,
                        makeClone: true,
                        isReserved: (this.props.selectedUnits && this.props.selectedUnits[unit.id]),
                        onDragStart: this.props.onDragStart,
                        onDragEnd: this.props.onDragEnd
                    };

                    rows.push({
                        key: unit.id,
                        data: data
                    });
                }

                var columns = [
                    {
                        label: "Id",
                        key: "id",
                        defaultOrder: "asc"
                    },
                    {
                        label: "Type",
                        key: "typeName",
                        defaultOrder: "asc"
                    },
                    {
                        label: "Strength",
                        key: "strength",
                        defaultOrder: "desc",
                        sortingFunction: function (a, b) {
                            return a.data.currentStrength - b.data.currentStrength;
                        }
                    },
                    {
                        label: "Act",
                        key: "maxActionPoints",
                        defaultOrder: "desc"
                    },
                    {
                        label: "Atk",
                        key: "attack",
                        defaultOrder: "desc"
                    },
                    {
                        label: "Def",
                        key: "defence",
                        defaultOrder: "desc"
                    },
                    {
                        label: "Int",
                        key: "intelligence",
                        defaultOrder: "desc"
                    },
                    {
                        label: "Spd",
                        key: "speed",
                        defaultOrder: "desc"
                    }
                ];

                return (React.DOM.div({ className: "unit-list" }, Rance.UIComponents.List({
                    listItems: rows,
                    initialColumns: columns
                })));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.BattlePrep = React.createClass({
            getInitialState: function () {
                return ({
                    currentDragUnit: null
                });
            },
            handleDragStart: function (unit) {
                this.setState({
                    currentDragUnit: unit
                });
            },
            handleDragEnd: function (dropSuccesful) {
                if (typeof dropSuccesful === "undefined") { dropSuccesful = false; }
                if (!dropSuccesful && this.state.currentDragUnit) {
                    this.props.battlePrep.removeUnit(this.state.currentDragUnit);
                }

                this.setState({
                    currentDragUnit: null
                });
            },
            handleDrop: function (position) {
                var battlePrep = this.props.battlePrep;
                if (this.state.currentDragUnit) {
                    var unitCurrentlyInPosition = battlePrep.getUnitAtPosition(position);
                    if (unitCurrentlyInPosition) {
                        battlePrep.swapUnits(this.state.currentDragUnit, unitCurrentlyInPosition);
                    } else {
                        battlePrep.setUnit(this.state.currentDragUnit, position);
                    }
                }

                this.handleDragEnd(true);
            },
            render: function () {
                var fleet = Rance.UIComponents.Fleet({
                    fleet: this.props.battlePrep.fleet,
                    onMouseUp: this.handleDrop,
                    isDraggable: true,
                    onDragStart: this.handleDragStart,
                    onDragEnd: this.handleDragEnd
                });

                return (React.DOM.div({ className: "battle-prep" }, fleet, Rance.UIComponents.UnitList({
                    units: this.props.battlePrep.availableUnits,
                    selectedUnits: this.props.battlePrep.alreadyPlaced,
                    onDragStart: this.handleDragStart,
                    onDragEnd: this.handleDragEnd
                }), React.DOM.button({
                    className: "start-battle",
                    onClick: function () {
                        var _ = window;

                        _.battle = this.props.battlePrep.makeBattle();
                        _.reactUI.battle = _.battle;
                        _.reactUI.switchScene("battle");
                    }.bind(this)
                }, "Start battle")));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.MapGen = React.createClass({
            makeMap: function () {
                var mapGen = this.props.mapGen;

                mapGen.makeMap(Rance.Templates.MapGen.defaultMap);

                var doc = mapGen.drawMap();
                this.props.renderer.layers.map.removeChildren();
                this.props.renderer.layers.map.addChild(doc);
            },
            clearMap: function () {
                this.props.mapGen.reset();

                var doc = mapGen.drawMap();
                this.props.renderer.layers.map.removeChildren();
                this.props.renderer.layers.map.addChild(doc);
            },
            render: function () {
                return (React.DOM.div({
                    className: "galaxy-map"
                }, React.DOM.div({
                    ref: "pixiContainer",
                    id: "pixi-container"
                }), React.DOM.div({
                    className: "map-gen-controls"
                }, React.DOM.button({
                    onClick: this.makeMap
                }, "make"), React.DOM.button({
                    onClick: this.clearMap
                }, "clear"))));
            },
            componentDidMount: function () {
                this.props.renderer.setContainer(this.refs.pixiContainer.getDOMNode());
                this.props.renderer.init();
                this.props.renderer.bindRendererView();
                this.props.renderer.render();
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.MapGenControls = React.createClass({
            makeMap: function () {
                this.props.mapGen.makeMap(Rance.Templates.MapGen.defaultMap);
                this.props.renderMap();
            },
            clearMap: function () {
                this.props.mapGen.reset();
                this.props.renderMap();
            },
            render: function () {
                return (React.DOM.div({
                    className: "map-gen-controls"
                }, React.DOM.button({
                    onClick: this.makeMap
                }, "make"), React.DOM.button({
                    onClick: this.clearMap
                }, "clear")));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../mixins/draggable.ts" />
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.Popup = React.createClass({
            mixins: [Rance.UIComponents.Draggable],
            onDragStart: function () {
                this.zIndex = this.props.incrementZIndex();
            },
            render: function () {
                var divProps = {
                    className: "react-popup draggable",
                    onTouchStart: this.handleMouseDown,
                    onMouseDown: this.handleMouseDown,
                    style: {
                        top: this.state.dragPos ? this.state.dragPos.top : 0,
                        left: this.state.dragPos ? this.state.dragPos.left : 0,
                        zIndex: this.zIndex
                    }
                };

                if (this.state.dragging) {
                    divProps.className += " dragging";
                }

                return (React.DOM.div(divProps, this.props.content));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="popup.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.PopupManager = React.createClass({
            componentWillMount: function () {
                this.listeners = {};
                var self = this;
                this.listeners["makePopup"] = Rance.eventManager.addEventListener("makePopup", function (e) {
                    self.makePopup(e.data);
                });
                this.listeners["closePopup"] = Rance.eventManager.addEventListener("closePopup", function (e) {
                    self.closePopup(e.data);
                });
            },
            componentWillUnmount: function () {
                for (var listenerId in this.listeners) {
                    Rance.eventManager.removeEventListener(listenerId, this.listeners[listenerId]);
                }
            },
            getInitialState: function () {
                return ({
                    popups: []
                });
            },
            incrementZIndex: function () {
                if (!this.currentZIndex)
                    this.currentZIndex = 0;

                return this.currentZIndex++;
            },
            getPopupId: function () {
                if (!this.popupId)
                    this.popupId = 0;

                return this.popupId++;
            },
            hasPopup: function (id) {
                for (var i = 0; i < this.state.popups.length; i++) {
                    if (this.state.popups[i].id === id)
                        return true;
                }

                return false;
            },
            closePopup: function (id) {
                if (!this.hasPopup)
                    throw new Error("No such popup");

                var newPopups = [];

                for (var i = 0; i < this.state.popups.length; i++) {
                    if (this.state.popups[i].id !== id) {
                        newPopups.push(this.state.popups[i]);
                    }
                }

                this.setState({ popups: newPopups });
            },
            makePopup: function (props) {
                var popups = this.state.popups.concat({
                    content: props.content,
                    id: this.getPopupId()
                });

                this.setState({
                    popups: popups
                });
            },
            render: function () {
                var popups = this.state.popups;

                var toRender = [];

                for (var i = 0; i < popups.length; i++) {
                    var popup = popups[i];

                    toRender.push(Rance.UIComponents.Popup({
                        content: popup.content,
                        key: popup.id,
                        incrementZIndex: this.incrementZIndex,
                        closePopup: this.closePopup
                    }));
                }

                return (React.DOM.div({
                    className: "popup-container"
                }, toRender));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.TopBar = React.createClass({
            render: function () {
                var player = this.props.player;

                var income = player.getIncome();

                var incomeClass = "top-bar-money-income";
                if (income < 0)
                    incomeClass += " negative";

                return (React.DOM.div({
                    className: "top-bar"
                }, React.DOM.div({
                    className: "top-bar-player"
                }, React.DOM.img({
                    className: "top-bar-player-icon",
                    src: player.icon
                }), React.DOM.div({
                    className: "top-bar-player-name"
                }, player.name)), React.DOM.div({
                    className: "top-bar-money"
                }, React.DOM.div({
                    className: "top-bar-money-current"
                }, "Money: " + player.money), React.DOM.div({
                    className: incomeClass
                }, "(+" + player.getIncome() + ")"))));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.FleetControls = React.createClass({
            deselectFleet: function () {
                Rance.eventManager.dispatchEvent("deselectFleet", this.props.fleet);
            },
            selectFleet: function () {
                Rance.eventManager.dispatchEvent("selectFleets", [this.props.fleet]);
            },
            splitFleet: function () {
                Rance.eventManager.dispatchEvent("splitFleet", this.props.fleet);
            },
            render: function () {
                return (React.DOM.div({
                    className: "fleet-controls"
                }, React.DOM.button({
                    className: "fleet-controls-split",
                    onClick: this.splitFleet
                }, "split"), React.DOM.button({
                    className: "fleet-controls-deselect",
                    onClick: this.deselectFleet
                }, "deselect"), !this.props.hasMultipleSelected ? null : React.DOM.button({
                    className: "fleet-controls-select",
                    onClick: this.selectFleet
                }, "select")));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="fleetcontrols.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.FleetInfo = React.createClass({
            render: function () {
                var fleet = this.props.fleet;
                if (!fleet)
                    return null;
                var totalStrength = fleet.getTotalStrength();

                return (React.DOM.div({
                    className: "fleet-info"
                }, React.DOM.div({
                    className: "fleet-info-header"
                }, React.DOM.div({
                    className: "fleet-info-name"
                }, fleet.name), React.DOM.div({
                    className: "fleet-info-shipcount"
                }, fleet.ships.length), React.DOM.div({
                    className: "fleet-info-strength"
                }, totalStrength.current + "/" + totalStrength.max), React.DOM.div({
                    className: "fleet-info-contols"
                }, Rance.UIComponents.FleetControls({
                    fleet: fleet,
                    hasMultipleSelected: this.props.hasMultipleSelected
                }))), React.DOM.div({
                    className: "fleet-info-move-points"
                }, "Moves: " + fleet.getMinCurrentMovePoints() + "/" + fleet.getMinMaxMovePoints())));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../unit/unitstrength.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.ShipInfo = React.createClass({
            render: function () {
                var ship = this.props.ship;

                return (React.DOM.div({
                    className: "ship-info"
                }, React.DOM.div({
                    className: "ship-info-icon-container"
                }, React.DOM.img({
                    className: "ship-info-icon",
                    src: ship.template.icon
                })), React.DOM.div({
                    className: "ship-info-info"
                }, React.DOM.div({
                    className: "ship-info-name"
                }, ship.name), React.DOM.div({
                    className: "ship-info-type"
                }, ship.template.typeName)), Rance.UIComponents.UnitStrength({
                    maxStrength: ship.maxStrength,
                    currentStrength: ship.currentStrength,
                    isSquadron: true
                })));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../mixins/draggable.ts" />
/// <reference path="../unit/unitstrength.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.DraggableShipInfo = React.createClass({
            mixins: [Rance.UIComponents.Draggable],
            onDragStart: function (e) {
                this.props.onDragStart(this.props.ship);
            },
            onDragEnd: function (e) {
                this.props.onDragEnd(e);
            },
            render: function () {
                var ship = this.props.ship;

                var divProps = {
                    className: "ship-info draggable",
                    onTouchStart: this.handleMouseDown,
                    onMouseDown: this.handleMouseDown
                };

                if (this.state.dragging) {
                    divProps.style = this.state.dragPos;
                    divProps.className += " dragging";
                }

                return (React.DOM.div(divProps, React.DOM.div({
                    className: "ship-info-icon-container"
                }, React.DOM.img({
                    className: "ship-info-icon",
                    src: ship.template.icon
                })), React.DOM.div({
                    className: "ship-info-info"
                }, React.DOM.div({
                    className: "ship-info-name"
                }, ship.name), React.DOM.div({
                    className: "ship-info-type"
                }, ship.template.typeName)), Rance.UIComponents.UnitStrength({
                    maxStrength: ship.maxStrength,
                    currentStrength: ship.currentStrength,
                    isSquadron: true
                })));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="shipinfo.ts"/>
/// <reference path="draggableshipinfo.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.FleetContents = React.createClass({
            handleMouseUp: function () {
                if (!this.props.onMouseUp)
                    return;

                this.props.onMouseUp(this.props.fleet);
            },
            render: function () {
                var shipInfos = [];

                var draggableContent = (this.props.onDragStart || this.props.onDragEnd);

                for (var i = 0; i < this.props.fleet.ships.length; i++) {
                    if (!draggableContent) {
                        shipInfos.push(Rance.UIComponents.ShipInfo({
                            key: this.props.fleet.ships[i].id,
                            ship: this.props.fleet.ships[i]
                        }));
                    } else {
                        shipInfos.push(Rance.UIComponents.DraggableShipInfo({
                            key: this.props.fleet.ships[i].id,
                            ship: this.props.fleet.ships[i],
                            onDragStart: this.props.onDragStart,
                            onDragMove: this.props.onDragMove,
                            onDragEnd: this.props.onDragEnd
                        }));
                    }
                }

                if (draggableContent) {
                    shipInfos.push(React.DOM.div({
                        className: "fleet-contents-dummy-ship",
                        key: "dummy"
                    }));
                }

                return (React.DOM.div({
                    className: "fleet-contents",
                    onMouseUp: this.handleMouseUp
                }, shipInfos));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="fleetinfo.ts"/>
/// <reference path="fleetcontents.ts"/>
///
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.FleetSelection = React.createClass({
            mergeFleets: function () {
                Rance.eventManager.dispatchEvent("mergeFleets", null);
            },
            reorganizeFleets: function () {
                Rance.eventManager.dispatchEvent("startReorganizingFleets", this.props.selectedFleets);
            },
            render: function () {
                var selectedFleets = this.props.selectedFleets;
                if (!selectedFleets || selectedFleets.length <= 0) {
                    return null;
                }

                var allFleetsInSameLocation = true;
                var hasMultipleSelected = selectedFleets.length >= 2;

                for (var i = 1; i < selectedFleets.length; i++) {
                    if (selectedFleets[i].location !== selectedFleets[i - 1].location) {
                        allFleetsInSameLocation = false;
                        break;
                    }
                }
                var fleetInfos = [];

                for (var i = 0; i < selectedFleets.length; i++) {
                    var infoProps = {
                        key: selectedFleets[i].id,
                        fleet: selectedFleets[i],
                        hasMultipleSelected: hasMultipleSelected
                    };

                    fleetInfos.push(Rance.UIComponents.FleetInfo(infoProps));
                }

                var fleetSelectionControls = null;

                if (hasMultipleSelected) {
                    var mergeProps = {
                        className: "fleet-selection-controls-merge"
                    };
                    if (allFleetsInSameLocation) {
                        mergeProps.onClick = this.mergeFleets;
                    } else {
                        mergeProps.disabled = true;
                        mergeProps.className += " disabled";
                    }

                    var reorganizeProps = {
                        className: "fleet-selection-controls-reorganize"
                    };
                    if (allFleetsInSameLocation && selectedFleets.length === 2) {
                        reorganizeProps.onClick = this.reorganizeFleets;
                    } else {
                        reorganizeProps.disabled = true;
                        reorganizeProps.className += " disabled";
                    }

                    fleetSelectionControls = React.DOM.div({
                        className: "fleet-selection-controls"
                    }, React.DOM.button(reorganizeProps, "reorganize"), React.DOM.button(mergeProps, "merge"));
                }

                var fleetContents = null;

                if (!hasMultipleSelected) {
                    fleetContents = Rance.UIComponents.FleetContents({
                        fleet: selectedFleets[0]
                    });
                }

                return (React.DOM.div({
                    className: "fleet-selection"
                }, fleetSelectionControls, hasMultipleSelected ? null : fleetInfos, React.DOM.div({
                    className: "fleet-selection-selected-wrapper"
                }, React.DOM.div({
                    className: "fleet-selection-selected"
                }, hasMultipleSelected ? fleetInfos : null, fleetContents))));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="fleetcontents.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.FleetReorganization = React.createClass({
            getInitialState: function () {
                return ({
                    currentDragUnit: null
                });
            },
            handleDragStart: function (unit) {
                this.setState({
                    currentDragUnit: unit
                });
            },
            handleDragEnd: function (dropSuccesful) {
                if (typeof dropSuccesful === "undefined") { dropSuccesful = false; }
                this.setState({
                    currentDragUnit: null
                });
            },
            handleDrop: function (fleet) {
                var draggingUnit = this.state.currentDragUnit;
                if (draggingUnit) {
                    var oldFleet = draggingUnit.fleet;

                    oldFleet.transferShip(fleet, draggingUnit);
                    Rance.eventManager.dispatchEvent("playerControlUpdated", null);
                }

                this.handleDragEnd(true);
            },
            render: function () {
                var selectedFleets = this.props.fleets;
                if (!selectedFleets || selectedFleets.length < 1) {
                    return null;
                }

                return (React.DOM.div({
                    className: "fleet-reorganization"
                }, React.DOM.div({
                    className: "fleet-reorganization-header"
                }, "Reorganize fleets"), React.DOM.div({
                    className: "fleet-reorganization-subheader"
                }, React.DOM.div({
                    className: "fleet-reorganization-subheader-fleet-name" + " fleet-reorganization-subheader-fleet-name-left"
                }, selectedFleets[0].name), React.DOM.div({
                    className: "fleet-reorganization-subheader-center"
                }, null), React.DOM.div({
                    className: "fleet-reorganization-subheader-fleet-name" + " fleet-reorganization-subheader-fleet-name-right"
                }, selectedFleets[1].name)), React.DOM.div({
                    className: "fleet-reorganization-contents"
                }, Rance.UIComponents.FleetContents({
                    fleet: selectedFleets[0],
                    onMouseUp: this.handleDrop,
                    onDragStart: this.handleDragStart,
                    onDragEnd: this.handleDragEnd
                }), React.DOM.div({
                    className: "fleet-reorganization-contents-divider"
                }, null), Rance.UIComponents.FleetContents({
                    fleet: selectedFleets[1],
                    onMouseUp: this.handleDrop,
                    onDragStart: this.handleDragStart,
                    onDragEnd: this.handleDragEnd
                })), React.DOM.div({
                    className: "fleet-reorganization-footer"
                }, React.DOM.button({
                    className: "close-reorganization",
                    onClick: this.props.closeReorganization
                }, "Close"))));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.DefenceBuilding = React.createClass({
            render: function () {
                var building = this.props.building;
                console.log(building.controller.icon);
                return (React.DOM.div({
                    className: "defence-building"
                }, React.DOM.img({
                    className: "defence-building-icon",
                    src: Rance.colorImageInPlayerColor(building.template.icon, building.controller)
                }), React.DOM.img({
                    className: "defence-building-controller",
                    src: building.controller.icon
                })));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="defencebuilding.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.DefenceBuildingList = React.createClass({
            render: function () {
                if (!this.props.buildings)
                    return null;

                var buildings = [];

                for (var i = 0; i < this.props.buildings.length; i++) {
                    buildings.push(Rance.UIComponents.DefenceBuilding({
                        key: i,
                        building: this.props.buildings[i]
                    }));
                }

                return (React.DOM.div({
                    className: "defence-building-list"
                }, buildings));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="defencebuildinglist.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.StarInfo = React.createClass({
            render: function () {
                var star = this.props.selectedStar;
                if (!star)
                    return null;

                return (React.DOM.div({
                    className: "star-info"
                }, React.DOM.div({
                    className: "star-info-name"
                }, star.name), React.DOM.div({
                    className: "star-info-owner"
                }, star.owner ? star.owner.name : null), React.DOM.div({
                    className: "star-info-location"
                }, "x: " + star.x.toFixed() + " y: " + star.y.toFixed()), React.DOM.div({
                    className: "star-info-income"
                }, "Income: " + star.getIncome()), Rance.UIComponents.DefenceBuildingList({
                    buildings: star.buildings["defence"]
                })));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.AttackTarget = React.createClass({
            handleAttack: function () {
                Rance.eventManager.dispatchEvent("attackTarget", this.props.attackTarget);
            },
            render: function () {
                var target = this.props.attackTarget;

                return (React.DOM.div({
                    className: "attack-target",
                    onClick: this.handleAttack
                }, React.DOM.div({
                    className: "attack-target-type"
                }, target.type), React.DOM.img({
                    className: "attack-target-player-icon",
                    src: target.enemy.icon
                })));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.BuildableBuilding = React.createClass({
            makeCell: function (type) {
                var cellProps = {};
                cellProps.key = type;
                cellProps.className = "buildable-building-list-item-cell " + type;

                var cellContent;

                switch (type) {
                    case ("buildCost"): {
                        if (this.props.player.money < this.props.buildCost) {
                            cellProps.className += " negative";
                        }
                    }
                    default: {
                        cellContent = this.props[type];

                        break;
                    }
                }

                return (React.DOM.td(cellProps, cellContent));
            },
            render: function () {
                var player = this.props.player;
                var cells = [];
                var columns = this.props.activeColumns;

                for (var i = 0; i < columns.length; i++) {
                    cells.push(this.makeCell(columns[i].key));
                }

                var props = {
                    className: "buildable-item buildable-building",
                    onClick: this.props.handleClick
                };
                if (player.money < this.props.buildCost) {
                    props.onClick = null;
                    props.disabled = true;
                    props.className += " disabled";
                }

                return (React.DOM.tr(props, cells));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../unitlist/list.ts" />
/// <reference path="buildablebuilding.ts" />
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.BuildableBuildingList = React.createClass({
            getInitialState: function () {
                return ({
                    buildingTemplates: this.props.star.getBuildableBuildings()
                });
            },
            updateBuildings: function () {
                this.setState({
                    buildingTemplates: this.props.star.getBuildableBuildings()
                });

                Rance.eventManager.dispatchEvent("playerControlUpdated");
            },
            buildBuilding: function (rowItem) {
                var template = rowItem.data.template;

                var building = new Rance.Building({
                    template: template,
                    location: this.props.star
                });

                if (!building.controller)
                    building.controller = player1;

                this.props.star.addBuilding(building);
                building.controller.money -= template.buildCost;
                this.updateBuildings();
            },
            render: function () {
                if (this.state.buildingTemplates.length < 1)
                    return null;
                var rows = [];

                for (var i = 0; i < this.state.buildingTemplates.length; i++) {
                    var template = this.state.buildingTemplates[i];

                    var data = {
                        template: template,
                        typeName: template.name,
                        buildCost: template.buildCost,
                        player: this.props.player,
                        rowConstructor: Rance.UIComponents.BuildableBuilding
                    };

                    rows.push({
                        key: i,
                        data: data
                    });
                }

                var columns = [
                    {
                        label: "Name",
                        key: "typeName",
                        defaultOrder: "asc"
                    },
                    {
                        label: "Cost",
                        key: "buildCost",
                        defaultOrder: "desc"
                    }
                ];

                return (React.DOM.div({ className: "buildable-item-list buildable-building-list" }, Rance.UIComponents.List({
                    listItems: rows,
                    initialColumns: columns,
                    onRowChange: this.buildBuilding
                })));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../lib/pixi.d.ts" />
/// <reference path="../lib/clipper.d.ts" />
var Rance;
(function (Rance) {
    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    Rance.randInt = randInt;
    function randRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    Rance.randRange = randRange;
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

    function turnOrderSortFunction(a, b) {
        if (a.battleStats.moveDelay !== b.battleStats.moveDelay) {
            return a.battleStats.moveDelay - b.battleStats.moveDelay;
        } else {
            return a.id - b.id;
        }
    }
    Rance.turnOrderSortFunction = turnOrderSortFunction;

    function makeRandomShip() {
        var allTypes = Object.keys(Rance.Templates.ShipTypes);
        var type = getRandomArrayItem(allTypes);

        var unit = new Rance.Unit(Rance.Templates.ShipTypes[type]);

        return unit;
    }
    Rance.makeRandomShip = makeRandomShip;

    function centerDisplayObjectContainer(toCenter) {
        toCenter.x -= toCenter.width / 2;
    }
    Rance.centerDisplayObjectContainer = centerDisplayObjectContainer;
    function rectContains(rect, point) {
        var x = point.x;
        var y = point.y;

        var x1 = Math.min(rect.x1, rect.x2);
        var x2 = Math.max(rect.x1, rect.x2);
        var y1 = Math.min(rect.y1, rect.y2);
        var y2 = Math.max(rect.y1, rect.y2);

        return ((x >= x1 && x <= x2) && (y >= y1 && y <= y2));
    }
    Rance.rectContains = rectContains;

    function hexToString(hex) {
        hex = Math.round(hex);
        var converted = hex.toString(16);
        return '000000'.substr(0, 6 - converted.length) + converted;
    }
    Rance.hexToString = hexToString;
    function stringToHex(text) {
        if (text.charAt(0) === "#") {
            text = text.substring(1, 7);
        }

        return parseInt(text, 16);
    }
    Rance.stringToHex = stringToHex;

    function makeTempPlayerIcon(player, size) {
        var canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;

        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#" + hexToString(player.color);
        ctx.fillRect(0, 0, size, size);

        return canvas.toDataURL();
    }
    Rance.makeTempPlayerIcon = makeTempPlayerIcon;
    function colorImageInPlayerColor(imageSrc, player) {
        var image = new Image();
        image.src = imageSrc;
        var canvas = document.createElement("canvas");

        canvas.width = image.width;
        canvas.height = image.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);

        ctx.globalCompositeOperation = "source-in";

        ctx.fillStyle = "#" + hexToString(player.color);
        ctx.fillRect(0, 0, image.width, image.height);

        return canvas.toDataURL();
    }
    Rance.colorImageInPlayerColor = colorImageInPlayerColor;
    function addFleet(player, shipAmount) {
        var ships = [];
        for (var i = 0; i < shipAmount; i++) {
            ships.push(makeRandomShip());
        }
        var fleet = new Rance.Fleet(player, ships, mapGen.points[0]);
    }
    Rance.addFleet = addFleet;

    function cloneObject(toClone) {
        var result = {};
        for (var prop in toClone) {
            result[prop] = toClone[prop];
        }
        return result;
    }
    Rance.cloneObject = cloneObject;
    function recursiveRemoveAttribute(parent, attribute) {
        parent.removeAttribute(attribute);

        for (var i = 0; i < parent.children.length; i++) {
            recursiveRemoveAttribute(parent.children[i], attribute);
        }
    }
    Rance.recursiveRemoveAttribute = recursiveRemoveAttribute;

    function clamp(value, min, max) {
        if (value < min)
            return min;
        else if (value > max)
            return max;
        else
            return value;
    }
    Rance.clamp = clamp;
    function getAngleBetweenDegrees(degA, degB) {
        var angle = Math.abs(degB - degA) % 360;
        var distance = Math.min(360 - angle, angle);

        //console.log(degA, degB, distance);
        return distance;
    }
    Rance.getAngleBetweenDegrees = getAngleBetweenDegrees;
    function shiftPolygon(polygon, amount) {
        return polygon.map(function (point) {
            return ({
                x: point.x + amount,
                y: point.y + amount
            });
        });
    }
    Rance.shiftPolygon = shiftPolygon;
    function convertCase(polygon) {
        if (isFinite(polygon[0].x)) {
            return polygon.map(function (point) {
                return ({
                    X: point.x,
                    Y: point.y
                });
            });
        } else {
            return polygon.map(function (point) {
                return ({
                    x: point.X,
                    y: point.Y
                });
            });
        }
    }
    Rance.convertCase = convertCase;
    function offsetPolygon(polygon, amount) {
        polygon = convertCase(polygon);
        var scale = 100;
        ClipperLib.JS.ScaleUpPath(polygon, scale);

        var co = new ClipperLib.ClipperOffset(1, 0.25);
        co.AddPath(polygon, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
        var offsetted = new ClipperLib.Path();

        co.Execute(offsetted, amount * scale);

        var converted = convertCase(offsetted[0]);

        return converted.map(function (point) {
            return ({
                x: point.x / scale,
                y: point.y / scale
            });
        });
    }
    Rance.offsetPolygon = offsetPolygon;
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

        allTargets.push([x, y]);
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

        return Rance.getFrom2dArray(fleets, allTargets);
    };
})(Rance || (Rance = {}));
/// <reference path="../../src/targeting.ts" />
/// <reference path="../../src/unit.ts" />
var Rance;
(function (Rance) {
    (function (Templates) {
        (function (Effects) {
            Effects.dummyTargetColumn = {
                name: "dummyTargetColumn",
                targetFleets: "enemy",
                targetingFunction: Rance.targetColumn,
                targetRange: "all",
                effect: function () {
                }
            };
            Effects.dummyTargetAll = {
                name: "dummyTargetAll",
                targetFleets: "enemy",
                targetingFunction: Rance.targetAll,
                targetRange: "all",
                effect: function () {
                }
            };
            Effects.rangedAttack = {
                name: "rangedAttack",
                targetFleets: "enemy",
                targetingFunction: Rance.targetSingle,
                targetRange: "all",
                effect: function (user, target) {
                    var baseDamage = 100;
                    var damageType = "physical";

                    var damageIncrease = user.getAttackDamageIncrease(damageType);
                    var damage = baseDamage * damageIncrease;

                    target.recieveDamage(damage, damageType);
                }
            };
            Effects.closeAttack = {
                name: "closeAttack",
                targetFleets: "enemy",
                targetingFunction: Rance.targetColumnNeighbors,
                targetRange: "close",
                effect: function (user, target) {
                    var baseDamage = 100;
                    var damageType = "physical";

                    var damageIncrease = user.getAttackDamageIncrease(damageType);
                    var damage = baseDamage * damageIncrease;

                    console.log(baseDamage, damageIncrease, damage);
                    target.recieveDamage(damage, damageType);
                }
            };
            Effects.wholeRowAttack = {
                name: "wholeRowAttack",
                targetFleets: "all",
                targetingFunction: Rance.targetRow,
                targetRange: "all",
                effect: function (user, target) {
                    target.removeStrength(100);
                }
            };

            Effects.bombAttack = {
                name: "bombAttack",
                targetFleets: "enemy",
                targetingFunction: Rance.targetNeighbors,
                targetRange: "all",
                effect: function (user, target) {
                    target.removeStrength(100);
                }
            };
            Effects.guardColumn = {
                name: "guardColumn",
                targetFleets: "all",
                targetingFunction: Rance.targetSingle,
                targetRange: "self",
                effect: function (user, target) {
                    var guardPerInt = 20;
                    var guardAmount = guardPerInt * user.attributes.intelligence;
                    user.addGuard(guardAmount, "column");
                }
            };

            Effects.standBy = {
                name: "standBy",
                targetFleets: "all",
                targetingFunction: Rance.targetSingle,
                targetRange: "self",
                effect: function () {
                }
            };
        })(Templates.Effects || (Templates.Effects = {}));
        var Effects = Templates.Effects;
    })(Rance.Templates || (Rance.Templates = {}));
    var Templates = Rance.Templates;
})(Rance || (Rance = {}));
/// <reference path="effecttemplates.ts" />
var Rance;
(function (Rance) {
    (function (Templates) {
        (function (Abilities) {
            Abilities.dummyTargetColumn = {
                name: "dummyTargetColumn",
                moveDelay: 0,
                actionsUse: 0,
                mainEffect: Rance.Templates.Effects.dummyTargetColumn
            };
            Abilities.dummyTargetAll = {
                name: "dummyTargetAll",
                moveDelay: 0,
                actionsUse: 0,
                mainEffect: Rance.Templates.Effects.dummyTargetAll
            };
            Abilities.rangedAttack = {
                name: "rangedAttack",
                moveDelay: 100,
                actionsUse: 1,
                mainEffect: Rance.Templates.Effects.rangedAttack
            };
            Abilities.closeAttack = {
                name: "closeAttack",
                moveDelay: 90,
                actionsUse: 2,
                mainEffect: Rance.Templates.Effects.closeAttack
            };
            Abilities.wholeRowAttack = {
                name: "wholeRowAttack",
                moveDelay: 300,
                actionsUse: 1,
                mainEffect: Rance.Templates.Effects.wholeRowAttack
            };

            Abilities.bombAttack = {
                name: "bombAttack",
                moveDelay: 120,
                actionsUse: 1,
                mainEffect: Rance.Templates.Effects.bombAttack
            };
            Abilities.guardColumn = {
                name: "guardColumn",
                moveDelay: 100,
                actionsUse: 1,
                mainEffect: Rance.Templates.Effects.guardColumn
            };

            Abilities.standBy = {
                name: "standBy",
                moveDelay: 50,
                actionsUse: "all",
                mainEffect: Rance.Templates.Effects.standBy
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
                type: "fighterSquadron",
                typeName: "Fighter Squadron",
                isSquadron: true,
                buildCost: 100,
                icon: "img\/icons\/f.png",
                maxStrength: 0.7,
                maxMovePoints: 2,
                attributeLevels: {
                    attack: 0.8,
                    defence: 0.6,
                    intelligence: 0.4,
                    speed: 1
                },
                abilities: [
                    Rance.Templates.Abilities.closeAttack,
                    Rance.Templates.Abilities.standBy
                ]
            };
            ShipTypes.bomberSquadron = {
                type: "bomberSquadron",
                typeName: "Bomber Squadron",
                isSquadron: true,
                buildCost: 200,
                icon: "img\/icons\/f.png",
                maxStrength: 0.5,
                maxMovePoints: 1,
                attributeLevels: {
                    attack: 0.7,
                    defence: 0.4,
                    intelligence: 0.5,
                    speed: 0.8
                },
                abilities: [
                    Rance.Templates.Abilities.rangedAttack,
                    Rance.Templates.Abilities.bombAttack,
                    Rance.Templates.Abilities.standBy
                ]
            };
            ShipTypes.battleCruiser = {
                type: "battleCruiser",
                typeName: "Battlecruiser",
                isSquadron: false,
                buildCost: 200,
                icon: "img\/icons\/b.png",
                maxStrength: 1,
                maxMovePoints: 1,
                attributeLevels: {
                    attack: 0.8,
                    defence: 0.8,
                    intelligence: 0.7,
                    speed: 0.6
                },
                abilities: [
                    Rance.Templates.Abilities.rangedAttack,
                    Rance.Templates.Abilities.wholeRowAttack,
                    Rance.Templates.Abilities.standBy
                ]
            };
            ShipTypes.scout = {
                type: "scout",
                typeName: "Scout",
                isSquadron: true,
                buildCost: 200,
                icon: "img\/icons\/f.png",
                maxStrength: 0.6,
                maxMovePoints: 2,
                attributeLevels: {
                    attack: 0.5,
                    defence: 0.5,
                    intelligence: 0.8,
                    speed: 0.7
                },
                abilities: [
                    Rance.Templates.Abilities.rangedAttack,
                    Rance.Templates.Abilities.standBy
                ]
            };
            ShipTypes.shieldBoat = {
                type: "shieldBoat",
                typeName: "Shield Boat",
                isSquadron: false,
                buildCost: 200,
                icon: "img\/icons\/b.png",
                maxStrength: 0.9,
                maxMovePoints: 1,
                attributeLevels: {
                    attack: 0.5,
                    defence: 0.9,
                    intelligence: 0.6,
                    speed: 0.4
                },
                abilities: [
                    Rance.Templates.Abilities.guardColumn,
                    Rance.Templates.Abilities.rangedAttack,
                    Rance.Templates.Abilities.standBy
                ]
            };
        })(Templates.ShipTypes || (Templates.ShipTypes = {}));
        var ShipTypes = Templates.ShipTypes;
    })(Rance.Templates || (Rance.Templates = {}));
    var Templates = Rance.Templates;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (Templates) {
        (function (Buildings) {
            Buildings.sectorCommand = {
                type: "sectorCommand",
                category: "defence",
                name: "Sector Command",
                icon: "img\/buildings\/sectorCommand.png",
                buildCost: 200,
                maxPerType: 1,
                maxUpgradeLevel: 4
            };
            Buildings.starBase = {
                type: "starBase",
                category: "defence",
                name: "Starbase",
                icon: "img\/buildings\/starBase.png",
                buildCost: 200,
                maxPerType: 3,
                maxUpgradeLevel: 1
            };
            Buildings.commercialPort = {
                type: "commercialPort",
                category: "economy",
                name: "Commercial Spaceport",
                icon: "img\/buildings\/commercialPort.png",
                buildCost: 200,
                maxPerType: 1,
                maxUpgradeLevel: 4
            };
        })(Templates.Buildings || (Templates.Buildings = {}));
        var Buildings = Templates.Buildings;
    })(Rance.Templates || (Rance.Templates = {}));
    var Templates = Rance.Templates;
})(Rance || (Rance = {}));
/// <reference path="../data/templates/buildingtemplates.ts" />
/// <reference path="star.ts" />
/// <reference path="player.ts" />
var Rance;
(function (Rance) {
    var Building = (function () {
        function Building(props) {
            this.template = props.template;
            this.location = props.location;
            this.controller = props.controller || this.location.owner;
            this.upgradeLevel = props.upgradeLevel || 1;
        }
        Building.prototype.getPossibleUpgrades = function () {
            var upgrades = [];
            if (this.template.upgradeInto) {
                upgrades = upgrades.concat(this.template.upgradeInto);
            }

            if (this.upgradeLevel < this.template.maxUpgradeLevel) {
                upgrades.push({
                    type: this.template.type,
                    level: this.upgradeLevel + 1
                });
            }

            return upgrades;
        };
        Building.prototype.setController = function (newController) {
            var oldController = this.controller;
            if (oldController === newController)
                return;

            this.controller = newController;
            this.location.updateController();
        };
        return Building;
    })();
    Rance.Building = Building;
})(Rance || (Rance = {}));
/// <reference path="point.ts" />
/// <reference path="player.ts" />
/// <reference path="fleet.ts" />
/// <reference path="building.ts" />
var Rance;
(function (Rance) {
    var idGenerators = idGenerators || {};
    idGenerators.star = idGenerators.star || 0;

    var Star = (function () {
        function Star(x, y, id) {
            this.linksTo = [];
            this.linksFrom = [];
            this.fleets = {};
            this.buildings = {};
            this.id = isFinite(id) ? id : idGenerators.star++;
            this.name = "Star " + this.id;

            this.x = x;
            this.y = y;
        }
        // BUILDINGS
        Star.prototype.addBuilding = function (building) {
            if (!this.buildings[building.template.category]) {
                this.buildings[building.template.category] = [];
            }

            var buildings = this.buildings[building.template.category];

            if (buildings.indexOf(building) >= 0) {
                throw new Error("Already has building");
            }

            buildings.push(building);

            if (building.template.category === "defence") {
                this.updateController();
            }
        };
        Star.prototype.removeBuilding = function (building) {
            if (!this.buildings[building.template.category] || this.buildings[building.template.category].indexOf(building) < 0) {
                throw new Error("Location doesn't have building");
            }

            var buildings = this.buildings[building.template.category];

            this.buildings[building.template.category] = buildings.splice(buildings.indexOf(building), 1);
        };

        Star.prototype.getSecondaryController = function () {
            if (!this.buildings["defence"])
                return null;

            var defenceBuildings = this.buildings["defence"];
            for (var i = 0; i < defenceBuildings.length; i++) {
                if (defenceBuildings[i].controller !== this.owner) {
                    return defenceBuildings[i].controller;
                }
            }

            return null;
        };
        Star.prototype.updateController = function () {
            if (!this.buildings["defence"])
                return null;

            var oldOwner = this.owner;
            if (oldOwner) {
                if (oldOwner === newOwner)
                    return;

                oldOwner.removeStar(this);
            }
            var newOwner = this.buildings["defence"][0].controller;

            newOwner.addStar(this);

            this.owner = newOwner;

            Rance.eventManager.dispatchEvent("renderMap");
        };
        Star.prototype.getIncome = function () {
            var tempBuildingIncome = 0;
            if (this.buildings["economy"])
                tempBuildingIncome = this.buildings["economy"].length * 20;
            return this.baseIncome + tempBuildingIncome;
        };
        Star.prototype.getBuildingsByType = function (buildingTemplate) {
            var categoryBuildings = this.buildings[buildingTemplate.category];

            var buildings = [];

            if (categoryBuildings) {
                for (var i = 0; i < categoryBuildings.length; i++) {
                    if (categoryBuildings[i].template.type === buildingTemplate.type) {
                        buildings.push(categoryBuildings[i]);
                    }
                }
            }

            return buildings;
        };
        Star.prototype.getBuildableBuildings = function () {
            var canBuild = [];
            for (var buildingType in Rance.Templates.Buildings) {
                var template = Rance.Templates.Buildings[buildingType];
                var alreadyBuilt = this.getBuildingsByType(template);

                if (alreadyBuilt.length < template.maxPerType) {
                    canBuild.push(template);
                }
            }

            return canBuild;
        };

        // FLEETS
        Star.prototype.getAllFleets = function () {
            var allFleets = [];

            for (var playerId in this.fleets) {
                allFleets = allFleets.concat(this.fleets[playerId]);
            }

            return allFleets;
        };
        Star.prototype.getFleetIndex = function (fleet) {
            if (!this.fleets[fleet.player.id])
                return -1;

            return this.fleets[fleet.player.id].indexOf(fleet);
        };
        Star.prototype.hasFleet = function (fleet) {
            return this.getFleetIndex(fleet) >= 0;
        };
        Star.prototype.addFleet = function (fleet) {
            if (!this.fleets[fleet.player.id]) {
                this.fleets[fleet.player.id] = [];
            }

            if (this.hasFleet(fleet))
                return false;

            this.fleets[fleet.player.id].push(fleet);
        };
        Star.prototype.addFleets = function (fleets) {
            for (var i = 0; i < fleets.length; i++) {
                this.addFleet(fleets[i]);
            }
        };
        Star.prototype.removeFleet = function (fleet) {
            var fleetIndex = this.getFleetIndex(fleet);

            if (fleetIndex < 0)
                return false;

            this.fleets[fleet.player.id].splice(fleetIndex, 1);
        };
        Star.prototype.removeFleets = function (fleets) {
            for (var i = 0; i < fleets.length; i++) {
                this.removeFleet(fleets[i]);
            }
        };
        Star.prototype.getAllShipsOfPlayer = function (player) {
            var allShips = [];

            var fleets = this.fleets[player.id];
            if (!fleets)
                return [];

            for (var i = 0; i < fleets.length; i++) {
                allShips = allShips.concat(fleets[i].ships);
            }

            return allShips;
        };
        Star.prototype.getTargetsForPlayer = function (player) {
            var buildingTarget = this.getFirstEnemyDefenceBuilding(player);
            var buildingController = buildingTarget ? buildingTarget.controller : null;
            var fleetOwners = this.getEnemyFleetOwners(player, buildingController);

            var targets = [];

            if (buildingTarget) {
                targets.push({
                    type: "building",
                    enemy: buildingTarget.controller,
                    building: buildingTarget,
                    ships: this.getAllShipsOfPlayer(buildingTarget.controller)
                });
            }
            for (var i = 0; i < fleetOwners.length; i++) {
                targets.push({
                    type: "fleet",
                    enemy: fleetOwners[i],
                    building: null,
                    ships: this.getAllShipsOfPlayer(fleetOwners[i])
                });
            }

            return targets;
        };
        Star.prototype.getFirstEnemyDefenceBuilding = function (player) {
            if (!this.buildings["defence"])
                return null;

            var defenceBuildings = this.buildings["defence"].slice(0);
            if (this.owner === player)
                defenceBuildings = defenceBuildings.reverse();

            for (var i = defenceBuildings.length - 1; i >= 0; i--) {
                if (defenceBuildings[i].controller.id !== player.id) {
                    return defenceBuildings[i];
                }
            }

            return null;
        };
        Star.prototype.getEnemyFleetOwners = function (player, excludedTarget) {
            var fleetOwners = [];

            for (var playerId in this.fleets) {
                if (playerId == player.id)
                    continue;
                else if (excludedTarget && playerId == excludedTarget.id)
                    continue;
                else if (this.fleets[playerId].length < 1)
                    continue;

                fleetOwners.push(this.fleets[playerId][0].player);
            }

            return fleetOwners;
        };

        // MAP GEN
        Star.prototype.setPosition = function (x, y) {
            this.x = x;
            this.y = y;
        };
        Star.prototype.hasLink = function (linkTo) {
            return this.linksTo.indexOf(linkTo) >= 0 || this.linksFrom.indexOf(linkTo) >= 0;
        };
        Star.prototype.addLink = function (linkTo) {
            if (this.hasLink(linkTo))
                return;

            this.linksTo.push(linkTo);
            linkTo.linksFrom.push(this);
        };
        Star.prototype.removeLink = function (linkTo) {
            if (!this.hasLink(linkTo))
                return;

            var toIndex = this.linksTo.indexOf(linkTo);
            if (toIndex >= 0) {
                this.linksTo.splice(toIndex, 1);
            } else {
                this.linksFrom.splice(this.linksFrom.indexOf(linkTo), 1);
            }

            linkTo.removeLink(this);
        };
        Star.prototype.getAllLinks = function () {
            return this.linksTo.concat(this.linksFrom);
        };
        Star.prototype.clearLinks = function () {
            this.linksTo = [];
            this.linksFrom = [];
        };
        Star.prototype.getLinksByRegion = function () {
            var linksByRegion = {};

            var allLinks = this.getAllLinks();

            for (var i = 0; i < allLinks.length; i++) {
                var star = allLinks[i];
                var region = star.region;

                if (!linksByRegion[region]) {
                    linksByRegion[region] = [];
                }

                linksByRegion[region].push(star);
            }

            return linksByRegion;
        };
        Star.prototype.severLinksToRegion = function (regionToSever) {
            var linksByRegion = this.getLinksByRegion();
            var links = linksByRegion[regionToSever];

            for (var i = 0; i < links.length; i++) {
                var star = links[i];

                this.removeLink(star);
            }
        };
        Star.prototype.severLinksToFiller = function () {
            var linksByRegion = this.getLinksByRegion();
            var fillerRegions = Object.keys(linksByRegion).filter(function (region) {
                return region.indexOf("filler") >= 0;
            });

            for (var i = 0; i < fillerRegions.length; i++) {
                this.severLinksToRegion(fillerRegions[i]);
            }
        };
        Star.prototype.severLinksToNonCenter = function () {
            var self = this;

            var linksByRegion = this.getLinksByRegion();
            var nonCenterRegions = Object.keys(linksByRegion).filter(function (region) {
                return region !== self.region && region !== "center";
            });

            for (var i = 0; i < nonCenterRegions.length; i++) {
                this.severLinksToRegion(nonCenterRegions[i]);
            }
        };
        Star.prototype.getNeighbors = function () {
            var neighbors = [];

            for (var i = 0; i < this.voronoiCell.halfedges.length; i++) {
                var edge = this.voronoiCell.halfedges[i].edge;

                if (edge.lSite !== null && edge.lSite.id !== this.id) {
                    neighbors.push(edge.lSite);
                } else if (edge.rSite !== null && edge.rSite.id !== this.id) {
                    neighbors.push(edge.rSite);
                }
            }

            return neighbors;
        };
        Star.prototype.severLinksToNonAdjacent = function () {
            var allLinks = this.getAllLinks();

            var neighborVoronoiIds = this.voronoiCell.getNeighborIds();

            for (var i = 0; i < allLinks.length; i++) {
                var star = allLinks[i];

                if (neighborVoronoiIds.indexOf(star.voronoiId) < 0) {
                    this.removeLink(star);
                }
            }
        };
        return Star;
    })();
    Rance.Star = Star;
})(Rance || (Rance = {}));
/// <reference path="player.ts" />
/// <reference path="unit.ts" />
/// <reference path="star.ts" />
var Rance;
(function (Rance) {
    var idGenerators = idGenerators || {};
    idGenerators.fleets = idGenerators.fleets || 0;

    var Fleet = (function () {
        function Fleet(player, ships, location, id) {
            this.ships = [];
            this.player = player;
            this.location = location;
            this.id = isFinite(id) ? id : idGenerators.fleets++;
            this.name = "Fleet " + this.id;

            this.location.addFleet(this);
            this.player.addFleet(this);

            this.addShips(ships);

            Rance.eventManager.dispatchEvent("renderMap", null);
        }
        Fleet.prototype.getShipIndex = function (ship) {
            return this.ships.indexOf(ship);
        };
        Fleet.prototype.hasShip = function (ship) {
            return this.getShipIndex(ship) >= 0;
        };
        Fleet.prototype.deleteFleet = function () {
            this.location.removeFleet(this);
            this.player.removeFleet(this);

            Rance.eventManager.dispatchEvent("renderMap", null);
        };
        Fleet.prototype.mergeWith = function (fleet) {
            fleet.addShips(this.ships);
            this.deleteFleet();
        };
        Fleet.prototype.addShip = function (ship) {
            if (this.hasShip(ship))
                return false;

            this.ships.push(ship);
            ship.addToFleet(this);
        };
        Fleet.prototype.addShips = function (ships) {
            for (var i = 0; i < ships.length; i++) {
                this.addShip(ships[i]);
            }
        };
        Fleet.prototype.removeShip = function (ship) {
            var index = this.getShipIndex(ship);

            if (index < 0)
                return false;

            this.ships.splice(index, 1);
            ship.removeFromFleet();

            if (this.ships.length <= 0) {
                this.deleteFleet();
            }
        };
        Fleet.prototype.removeShips = function (ships) {
            for (var i = 0; i < ships.length; i++) {
                this.removeShip(ships[i]);
            }
        };
        Fleet.prototype.transferShip = function (fleet, ship) {
            if (fleet === this)
                return;
            var index = this.getShipIndex(ship);

            if (index < 0)
                return false;

            fleet.addShip(ship);

            this.ships.splice(index, 1);
            Rance.eventManager.dispatchEvent("renderMap", null);
        };
        Fleet.prototype.split = function () {
            var newFleet = new Fleet(this.player, [], this.location);
            this.location.addFleet(newFleet);

            return newFleet;
        };
        Fleet.prototype.getMinCurrentMovePoints = function () {
            if (!this.ships[0])
                return 0;

            var min = this.ships[0].currentMovePoints;

            for (var i = 0; i < this.ships.length; i++) {
                min = Math.min(this.ships[i].currentMovePoints, min);
            }
            return min;
        };
        Fleet.prototype.getMinMaxMovePoints = function () {
            if (!this.ships[0])
                return 0;

            var min = this.ships[0].maxMovePoints;

            for (var i = 0; i < this.ships.length; i++) {
                min = Math.min(this.ships[i].maxMovePoints, min);
            }
            return min;
        };
        Fleet.prototype.canMove = function () {
            for (var i = 0; i < this.ships.length; i++) {
                if (this.ships[i].currentMovePoints <= 0) {
                    return false;
                }
            }

            if (this.getMinCurrentMovePoints() > 0) {
                return true;
            }

            return false;
        };
        Fleet.prototype.subtractMovePoints = function () {
            for (var i = 0; i < this.ships.length; i++) {
                this.ships[i].currentMovePoints--;
            }
        };
        Fleet.prototype.move = function (newLocation) {
            if (newLocation === this.location)
                return;
            if (!this.canMove())
                return;

            var oldLocation = this.location;
            oldLocation.removeFleet(this);

            this.location = newLocation;
            newLocation.addFleet(this);

            this.subtractMovePoints();

            Rance.eventManager.dispatchEvent("renderMap", null);
            Rance.eventManager.dispatchEvent("updateSelection", null);
        };
        Fleet.prototype.getPathTo = function (newLocation) {
            var a = Rance.aStar(this.location, newLocation);

            if (!a)
                return;

            var path = Rance.backTrace(a.came, newLocation);

            return path;
        };
        Fleet.prototype.pathFind = function (newLocation, onMove) {
            var path = this.getPathTo(newLocation);

            var interval = window.setInterval(function () {
                if (!path || path.length <= 0) {
                    window.clearInterval(interval);
                    return;
                }

                var move = path.shift();
                this.move(move.star);
                if (onMove)
                    onMove();
            }.bind(this), 250);
        };
        Fleet.prototype.getFriendlyFleetsAtOwnLocation = function () {
            return this.location.fleets[this.player.id];
        };
        Fleet.prototype.getTotalStrength = function () {
            var total = {
                current: 0,
                max: 0
            };

            for (var i = 0; i < this.ships.length; i++) {
                total.current += this.ships[i].currentStrength;
                total.max += this.ships[i].maxStrength;
            }

            return total;
        };
        return Fleet;
    })();
    Rance.Fleet = Fleet;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (Templates) {
        (function (SubEmblems) {
            SubEmblems.comm = {
                type: "both",
                foregroundOnly: true,
                imageSrc: "comm.png"
            };
            SubEmblems.comm3 = {
                type: "both",
                foregroundOnly: true,
                imageSrc: "comm3.png"
            };
            SubEmblems.fasc12 = {
                type: "both",
                foregroundOnly: true,
                imageSrc: "fasc12.png"
            };
            SubEmblems.fasc2 = {
                type: "both",
                foregroundOnly: true,
                imageSrc: "fasc2.png"
            };
            SubEmblems.fasc8 = {
                type: "both",
                foregroundOnly: true,
                imageSrc: "fasc8.png"
            };
            SubEmblems.fasc9 = {
                type: "both",
                foregroundOnly: true,
                imageSrc: "fasc9.png"
            };
            SubEmblems.mon13 = {
                type: "both",
                foregroundOnly: true,
                imageSrc: "mon13.png"
            };
            SubEmblems.mon16 = {
                type: "both",
                foregroundOnly: true,
                imageSrc: "mon16.png"
            };
            SubEmblems.mon18 = {
                type: "both",
                foregroundOnly: true,
                imageSrc: "mon18.png"
            };
            SubEmblems.mon26 = {
                type: "both",
                foregroundOnly: true,
                imageSrc: "mon26.png"
            };
            SubEmblems.mon9 = {
                type: "both",
                foregroundOnly: true,
                imageSrc: "mon9.png"
            };
        })(Templates.SubEmblems || (Templates.SubEmblems = {}));
        var SubEmblems = Templates.SubEmblems;
    })(Rance.Templates || (Rance.Templates = {}));
    var Templates = Rance.Templates;
})(Rance || (Rance = {}));
/// <reference path="../lib/husl.d.ts" />
/// <reference path="../data/templates/colorranges.ts" />
var Rance;
(function (Rance) {
    function hex2rgb(hex) {
        return ([
            (hex >> 16 & 0xFF) / 255,
            (hex >> 8 & 0xFF) / 255,
            (hex & 0xFF) / 255
        ]);
    }
    Rance.hex2rgb = hex2rgb;

    function rgb2hex(rgb) {
        return ((rgb[0] * 255 << 16) + (rgb[1] * 255 << 8) + rgb[2] * 255);
    }
    Rance.rgb2hex = rgb2hex;

    //http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
    /* accepts parameters
    * h  Object = {h:x, s:y, v:z}
    * OR
    * h, s, v
    */
    function hsvToRgb(h, s, v) {
        var r, g, b, i, f, p, q, t;

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
        return [r, g, b];
    }
    Rance.hsvToRgb = hsvToRgb;
    function hslToRgb(h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0)
                    t += 1;
                if (t > 1)
                    t -= 1;
                if (t < 1 / 6)
                    return p + (q - p) * 6 * t;
                if (t < 1 / 2)
                    return q;
                if (t < 2 / 3)
                    return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [r, g, b];
    }
    Rance.hslToRgb = hslToRgb;
    function rgbToHsv(r, g, b) {
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {
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
    }
    Rance.rgbToHsv = rgbToHsv;
    function rgbToHsl(r, g, b) {
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
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

        return [h, s, l];
    }
    Rance.rgbToHsl = rgbToHsl;

    function hslToHex(h, s, l) {
        return rgb2hex(hslToRgb(h, s, l));
    }
    Rance.hslToHex = hslToHex;
    function hsvToHex(h, s, v) {
        return rgb2hex(hsvToRgb(h, s, v));
    }
    Rance.hsvToHex = hsvToHex;

    function hexToHsl(hex) {
        return rgbToHsl.apply(null, hex2rgb(hex));
    }
    Rance.hexToHsl = hexToHsl;
    function hexToHsv(hex) {
        return rgbToHsv.apply(null, hex2rgb(hex));
    }
    Rance.hexToHsv = hexToHsv;

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
    Rance.excludeFromRanges = excludeFromRanges;

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
    Rance.getIntersectingRanges = getIntersectingRanges;

    function excludeFromRange(range, toExclude) {
        if (toExclude.max < range.min || toExclude.min > range.max) {
            return null;
        } else if (toExclude.min < range.min && toExclude.max > range.max) {
            return null;
        }

        if (toExclude.min <= range.min) {
            return ([{ min: toExclude.max, max: range.max }]);
        } else if (toExclude.max >= range.max) {
            return ([{ min: range.min, max: toExclude.min }]);
        }

        var a = {
            min: range.min,
            max: toExclude.min
        };
        var b = {
            min: toExclude.max,
            max: range.max
        };

        return [a, b];
    }
    Rance.excludeFromRange = excludeFromRange;

    function randomSelectFromRanges(ranges) {
        var totalWeight = 0;
        var rangesByRelativeWeight = {};
        var currentRelativeWeight = 0;

        for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            if (!isFinite(range.max))
                range.max = 1;
            if (!isFinite(range.min))
                range.min = 0;
            var weight = range.max - range.min;

            totalWeight += weight;
        }
        for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            var relativeWeight = (range.max - range.min) / totalWeight;
            if (totalWeight === 0)
                relativeWeight = 1;
            currentRelativeWeight += relativeWeight;
            rangesByRelativeWeight[currentRelativeWeight] = range;
        }

        var rand = Math.random();
        var selectedRange;

        var sortedWeights = Object.keys(rangesByRelativeWeight).map(function (w) {
            return parseFloat(w);
        });

        var sortedWeights = sortedWeights.sort();

        for (var i = 0; i < sortedWeights.length; i++) {
            if (rand < sortedWeights[i]) {
                selectedRange = rangesByRelativeWeight[sortedWeights[i]];
                break;
            }
        }
        if (!selectedRange)
            console.log(rangesByRelativeWeight);

        return Rance.randRange(selectedRange.min, selectedRange.max);
    }
    Rance.randomSelectFromRanges = randomSelectFromRanges;

    function makeRandomVibrantColor() {
        var hRanges = [
            { min: 0, max: 150 / 360 },
            { min: 180 / 360, max: 290 / 360 },
            { min: 320 / 360, max: 1 }
        ];
        return [randomSelectFromRanges(hRanges), Rance.randRange(0.8, 0.9), Rance.randRange(0.88, 0.92)];
    }
    Rance.makeRandomVibrantColor = makeRandomVibrantColor;
    function makeRandomDeepColor() {
        // yellow
        if (Math.random() < 0.1) {
            return [Rance.randRange(15 / 360, 80 / 360), Rance.randRange(0.92, 1), Rance.randRange(0.92, 1)];
        }
        var hRanges = [
            { min: 0, max: 15 / 360 },
            { min: 80 / 360, max: 195 / 360 },
            { min: 210 / 360, max: 1 }
        ];
        return [randomSelectFromRanges(hRanges), 1, Rance.randRange(0.55, 0.65)];
    }
    Rance.makeRandomDeepColor = makeRandomDeepColor;
    function makeRandomLightColor() {
        return [Rance.randRange(0, 360), Rance.randRange(0.55, 0.65), 1];
    }
    Rance.makeRandomLightColor = makeRandomLightColor;

    function makeRandomColor(values) {
        values = values || {};
        var color = {};

        ["h", "s", "l"].forEach(function (v) {
            if (!values[v])
                values[v] = [];
        });

        for (var value in values) {
            if (values[value].length < 1) {
                values[value] = [{ min: 0, max: 1 }];
            }

            color[value] = randomSelectFromRanges(values[value]);
        }

        return [color.h, color.s, color.l];
    }
    Rance.makeRandomColor = makeRandomColor;
    function colorFromScalars(color) {
        return [color[0] * 360, color[1] * 100, color[2] * 100];
    }
    Rance.colorFromScalars = colorFromScalars;
    function scalarsFromColor(scalars) {
        return [scalars[0] / 360, scalars[1] / 100, scalars[2] / 100];
    }
    Rance.scalarsFromColor = scalarsFromColor;

    function makeContrastingColor(props) {
        var initialRanges = props.initialRanges || {};
        var exclusions = props.minDifference || {};
        var maxDifference = props.maxDifference || {};
        var color = props.color;
        var hMaxDiffernece = isFinite(maxDifference.h) ? maxDifference.h : 360;
        var sMaxDiffernece = isFinite(maxDifference.s) ? maxDifference.s : 100;
        var lMaxDiffernece = isFinite(maxDifference.l) ? maxDifference.l : 100;

        var hRange = initialRanges.h || { min: 0, max: 360 };
        var sRange = initialRanges.s || { min: 50, max: 100 };
        var lRange = initialRanges.l || { min: 0, max: 100 };

        var hExclusion = exclusions.h || 30;

        var hMin = (color[0] - hExclusion) % 360;
        var hMax = (color[0] + hExclusion) % 360;

        var hRange2 = excludeFromRange(hRange, { min: hMin, max: hMax });

        var h = randomSelectFromRanges(hRange2);
        h = Rance.clamp(h, color[0] - hMaxDiffernece, color[0] + hMaxDiffernece);
        var hDistance = Rance.getAngleBetweenDegrees(h, color[0]);
        var relativeHDistance = 1 / (180 / hDistance);

        var lExclusion = exclusions.l || 30;

        // if (relativeHDistance < 0.2)
        // {
        //   lExclusion /= 2;
        //   clamp(lExclusion, 0, 100);
        // }
        //
        var lMin = Rance.clamp(color[2] - lExclusion, lRange.min, 100);
        var lMax = Rance.clamp(color[2] + lExclusion, lMin, 100);

        var sExclusion = exclusions.s || 0;
        var sMin = Rance.clamp(color[1] - sExclusion, sRange.min, 100);
        var sMax = Rance.clamp(color[1] + sExclusion, sMin, 100);

        var ranges = {
            h: [{ min: h, max: h }],
            s: excludeFromRange(sRange, { min: sMin, max: sMax }),
            l: excludeFromRange(lRange, { min: lMin, max: lMax })
        };

        return makeRandomColor(ranges);
    }
    Rance.makeContrastingColor = makeContrastingColor;
    function hexToHusl(hex) {
        return HUSL.fromHex(Rance.hexToString(hex));
    }
    Rance.hexToHusl = hexToHusl;
    function generateMainColor() {
        var color;
        var hexColor;
        var genType;
        if (Math.random() < 0.4) {
            color = makeRandomDeepColor();
            hexColor = hsvToHex.apply(null, color);
            genType = "deep";
        } else if (Math.random() < 0.4) {
            color = makeRandomVibrantColor();
            hexColor = hsvToHex.apply(null, color);
            genType = "vibrant";
        } else if (Math.random() < 0.4) {
            color = makeRandomLightColor();
            hexColor = hsvToHex.apply(null, color);
            genType = "light";
        } else {
            color = makeRandomColor({
                s: [{ min: 1, max: 1 }],
                l: [{ min: 0.92, max: 1 }]
            });
            hexColor = Rance.stringToHex(HUSL.toHex.apply(null, colorFromScalars(color)));
            genType = "husl";
        }

        var huslColor = hexToHusl(hexColor);
        huslColor[2] = Rance.clamp(huslColor[2], 30, 100);
        hexColor = Rance.stringToHex(HUSL.toHex.apply(null, huslColor));
        return hexColor;
    }
    Rance.generateMainColor = generateMainColor;
    function generateSecondaryColor(mainColor) {
        var huslColor = hexToHusl(mainColor);
        var hexColor;

        if (huslColor[2] < 0.4 || Math.random() < 0.4) {
            var contrastingColor = makeContrastingColor({
                color: huslColor,
                minDifference: {
                    h: 30,
                    l: 40
                },
                maxDifference: {
                    h: 80,
                    l: 60
                }
            });
            hexColor = Rance.stringToHex(HUSL.toHex.apply(null, contrastingColor));
        } else {
            function contrasts(c1, c2) {
                return ((c1[2] < c2[2] - 20 || c1[2] > c2[2] + 20));
            }
            function makeColor(c1, easing) {
                var hsvColor = hexToHsv(c1);

                hsvColor = colorFromScalars(hsvColor);
                var contrastingColor = makeContrastingColor({
                    color: hsvColor,
                    initialRanges: {
                        l: { min: 60 * easing, max: 100 }
                    },
                    minDifference: {
                        h: 20 * easing,
                        s: 30 * easing
                    },
                    maxDifference: {
                        h: 100
                    }
                });

                var hex = hsvToHex.apply(null, scalarsFromColor(contrastingColor));

                return hexToHusl(hex);
            }

            var huslBg = hexToHusl(mainColor);
            var easing = 1;
            var candidateColor = makeColor(mainColor, easing);

            while (!contrasts(huslBg, candidateColor)) {
                easing -= 0.1;
                candidateColor = makeColor(mainColor, easing);
            }

            hexColor = Rance.stringToHex(HUSL.toHex.apply(null, candidateColor));
        }

        return hexColor;
    }
    Rance.generateSecondaryColor = generateSecondaryColor;
    function generateColorScheme(mainColor) {
        var mainColor = isFinite(mainColor) ? mainColor : generateMainColor();
        var secondaryColor = generateSecondaryColor(mainColor);

        return ({
            main: mainColor,
            secondary: secondaryColor
        });
    }
    Rance.generateColorScheme = generateColorScheme;

    function checkRandomGenHues(amt) {
        var maxBarSize = 80;
        var hues = {};
        for (var i = 0; i < amt; i++) {
            var color = generateMainColor();
            var hue = colorFromScalars(hexToHsv(color))[0];
            var roundedHue = Math.round(hue / 10) * 10;

            if (!hues[roundedHue])
                hues[roundedHue] = 0;
            hues[roundedHue]++;
        }

        var min;
        var max;

        for (var _hue in hues) {
            var count = hues[_hue];

            if (!min) {
                min = count;
            }
            if (!max) {
                max = count;
            }

            min = Math.min(min, count);
            max = Math.max(max, count);
        }

        var args = [""];
        var toPrint = "";

        for (var _hue in hues) {
            var hue = parseInt(_hue);
            var color = hsvToHex(hue / 360, 1, 1);
            var count = hues[_hue];

            var difference = max - min;
            var relative = (count - min) / difference;

            var chars = relative * maxBarSize;

            var line = "\n%c ";
            for (var i = 0; i < chars; i++) {
                line += "#";
            }
            toPrint += line;
            args.push("color: " + "#" + Rance.hexToString(color));
        }

        args[0] = toPrint;

        console.log.apply(console, args);
    }
    Rance.checkRandomGenHues = checkRandomGenHues;
})(Rance || (Rance = {}));
/// <reference path="../lib/rng.d.ts" />
/// <reference path="../data/templates/subemblemtemplates.ts" />
/// <reference path="color.ts"/>
var Rance;
(function (Rance) {
    var Emblem = (function () {
        function Emblem(color) {
            this.color = color;
        }
        Emblem.prototype.isForegroundOnly = function () {
            if (this.inner.foregroundOnly)
                return true;
            if (this.outer && this.outer.foregroundOnly)
                return true;

            return false;
        };
        Emblem.prototype.generateRandom = function (minAlpha, rng) {
            var rng = rng || new RNG(Math.random);
            this.alpha = rng.uniform();
            this.alpha = Rance.clamp(this.alpha, minAlpha, 1);

            this.generateSubEmblems(rng);
        };
        Emblem.prototype.generateSubEmblems = function (rng) {
            var allEmblems = [];

            for (var subEmblem in Rance.Templates.SubEmblems) {
                allEmblems.push(Rance.Templates.SubEmblems[subEmblem]);
            }

            var mainEmblem = Rance.getRandomArrayItem(allEmblems);

            if (mainEmblem.type === "both") {
                this.inner = mainEmblem;
                return;
            } else if (mainEmblem.type === "inner" || mainEmblem.type === "outer") {
                this[mainEmblem.type] = mainEmblem;
            } else {
                if (rng.uniform() > 0.5) {
                    this.inner = mainEmblem;
                    return;
                } else if (mainEmblem.type === "inner-or-both") {
                    this.inner = mainEmblem;
                } else {
                    this.outer = mainEmblem;
                }
            }

            if (mainEmblem.type === "inner" || mainEmblem.type === "inner-or-both") {
                var subEmblem = Rance.getRandomArrayItem(allEmblems.filter(function (emblem) {
                    return (emblem.type === "outer" || emblem.type === "outer-or-both");
                }));

                this.outer = subEmblem;
            } else if (mainEmblem.type === "outer" || mainEmblem.type === "outer-or-both") {
                var subEmblem = Rance.getRandomArrayItem(allEmblems.filter(function (emblem) {
                    return (emblem.type === "inner" || emblem.type === "inner-or-both");
                }));

                this.inner = subEmblem;
            }
        };
        Emblem.prototype.draw = function () {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");

            ctx.globalAlpha = this.alpha;

            var inner = this.drawSubEmblem(this.inner);
            canvas.width = inner.width;
            canvas.height = inner.height;
            ctx.drawImage(inner, 0, 0);

            if (this.outer) {
                var outer = this.drawSubEmblem(this.outer);
                ctx.drawImage(outer, 0, 0);
            }

            return canvas;
        };

        Emblem.prototype.drawSubEmblem = function (toDraw) {
            var image = new Image();
            image.src = Rance.images["emblems"][toDraw.imageSrc].src;

            var width = image.width;
            var height = image.height;

            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");

            ctx.drawImage(image, 0, 0);

            ctx.globalCompositeOperation = "source-in";

            ctx.fillStyle = "#" + Rance.hexToString(this.color);
            ctx.fillRect(0, 0, width, height);

            return canvas;
        };
        return Emblem;
    })();
    Rance.Emblem = Emblem;
})(Rance || (Rance = {}));
/// <reference path="../lib/rng.d.ts" />
/// <reference path="emblem.ts" />
/// <reference path="color.ts"/>
var Rance;
(function (Rance) {
    var Flag = (function () {
        function Flag(props) {
            this.width = props.width;
            this.height = props.height || props.width;

            this.mainColor = props.mainColor;
            this.secondaryColor = props.secondaryColor;
            this.tetriaryColor = props.tetriaryColor;
            this.backgroundEmblem = props.backgroundEmblem;
            this.foregroundEmblem = props.foregroundEmblem;
        }
        Flag.prototype.generateRandom = function (seed) {
            this.seed = seed || Math.random();

            var rng = new RNG(this.seed);

            this.foregroundEmblem = new Rance.Emblem(this.secondaryColor);
            this.foregroundEmblem.generateRandom(100, rng);

            if (!this.foregroundEmblem.isForegroundOnly() && rng.uniform() > 0.5) {
                this.backgroundEmblem = new Rance.Emblem(this.tetriaryColor);
                this.backgroundEmblem.generateRandom(40, rng);
            }
        };
        Flag.prototype.draw = function () {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            var ctx = canvas.getContext("2d");

            ctx.globalCompositeOperation = "source-over";

            ctx.fillStyle = "#" + Rance.hexToString(this.mainColor);
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fillStyle = "#00FF00";

            if (this.backgroundEmblem) {
                var background = this.backgroundEmblem.draw();
                var x = (this.width - background.width) / 2;
                var y = (this.height - background.height) / 2;
                ctx.drawImage(background, x, y);
            }

            var foreground = this.foregroundEmblem.draw();
            var x = (this.width - foreground.width) / 2;
            var y = (this.height - foreground.height) / 2;
            ctx.drawImage(foreground, x, y);

            return canvas;
        };
        return Flag;
    })();
    Rance.Flag = Flag;
})(Rance || (Rance = {}));
/// <reference path="unit.ts"/>
/// <reference path="fleet.ts"/>
/// <reference path="utility.ts"/>
/// <reference path="building.ts" />
/// <reference path="star.ts" />
/// <reference path="flag.ts" />
var Rance;
(function (Rance) {
    var idGenerators = idGenerators || {};
    idGenerators.player = idGenerators.player || 0;

    var Player = (function () {
        function Player(id) {
            this.units = {};
            this.fleets = [];
            this.controlledLocations = [];
            this.id = isFinite(id) ? id : idGenerators.player++;
            this.name = "Player " + this.id;
            this.money = 1000;
        }
        Player.prototype.makeColorScheme = function () {
            var scheme = Rance.generateColorScheme(this.color);

            this.color = scheme.main;
            this.secondaryColor = scheme.secondary;
        };

        Player.prototype.makeFlag = function () {
            if (!this.color || !this.secondaryColor)
                this.makeColorScheme();

            this.flag = new Rance.Flag({
                width: 46,
                mainColor: this.color,
                secondaryColor: this.secondaryColor
            });

            this.flag.generateRandom();
            var canvas = this.flag.draw();
            this.icon = canvas.toDataURL();
            console.log(this.icon);

            var self = this;
        };
        Player.prototype.addUnit = function (unit) {
            this.units[unit.id] = unit;
        };
        Player.prototype.removeUnit = function (unit) {
            this.units[unit.id] = null;
            delete this.units[unit.id];
        };
        Player.prototype.getAllUnits = function () {
            var allUnits = [];
            for (var unitId in this.units) {
                allUnits.push(this.units[unitId]);
            }
            return allUnits;
        };
        Player.prototype.forEachUnit = function (operator) {
            for (var unitId in this.units) {
                operator(this.units[unitId]);
            }
        };
        Player.prototype.getFleetIndex = function (fleet) {
            return this.fleets.indexOf(fleet);
        };
        Player.prototype.addFleet = function (fleet) {
            if (this.getFleetIndex(fleet) >= 0) {
                return;
            }

            this.fleets.push(fleet);
        };
        Player.prototype.removeFleet = function (fleet) {
            var fleetIndex = this.getFleetIndex(fleet);

            if (fleetIndex <= 0) {
                return;
            }

            this.fleets.splice(fleetIndex, 1);
        };
        Player.prototype.getFleetsWithPositions = function () {
            var positions = [];

            for (var i = 0; i < this.fleets.length; i++) {
                var fleet = this.fleets[i];

                positions.push({
                    position: fleet.location,
                    data: fleet
                });
            }

            return positions;
        };

        Player.prototype.hasStar = function (star) {
            return (this.controlledLocations.indexOf(star) >= 0);
        };
        Player.prototype.addStar = function (star) {
            if (this.hasStar(star))
                return false;

            this.controlledLocations.push(star);
        };
        Player.prototype.removeStar = function (star) {
            var index = this.controlledLocations.indexOf(star);

            if (index < 0)
                return false;

            this.controlledLocations.splice(index, 1);
        };
        Player.prototype.getIncome = function () {
            var income = 0;

            for (var i = 0; i < this.controlledLocations.length; i++) {
                income += this.controlledLocations[i].getIncome();
            }

            return income;
        };
        Player.prototype.getBuildableShips = function () {
            var templates = [];

            for (var type in Rance.Templates.ShipTypes) {
                templates.push(Rance.Templates.ShipTypes[type]);
            }

            return templates;
        };
        Player.prototype.getIsland = function (start) {
            var self = this;
            var connected = {};

            var toConnect = [start];

            while (toConnect.length > 0) {
                var current = toConnect.pop();
                var neighbors = current.getNeighbors();
                var newFriendlyNeighbors = neighbors.filter(function (s) {
                    return (s.owner && !connected[s.id] && s.owner.id === self.id);
                });

                toConnect = toConnect.concat(newFriendlyNeighbors);

                connected[current.id] = current;
            }

            var island = [];
            for (var id in connected) {
                island.push(connected[id]);
            }

            return island;
        };
        Player.prototype.getAllIslands = function () {
            var unConnected = this.controlledLocations.slice(0);
            var islands = [];

            while (unConnected.length > 0) {
                var current = unConnected.pop();

                var currentIsland = this.getIsland(current);

                islands.push(currentIsland);
                unConnected = unConnected.filter(function (s) {
                    return currentIsland.indexOf(s) < 0;
                });
            }

            return islands;
        };
        Player.prototype.getBorderEdges = function () {
            var islands = this.getAllIslands();
            var edges = [];

            for (var i = 0; i < islands.length; i++) {
                var island = [];

                for (var j = 0; j < islands[i].length; j++) {
                    var star = islands[i][j];
                    var halfedges = star.voronoiCell.halfedges;

                    for (var k = 0; k < halfedges.length; k++) {
                        var edge = halfedges[k].edge;
                        if (!edge.lSite || !edge.rSite) {
                            island.push(edge);
                        } else if (edge.lSite.owner !== this || edge.rSite.owner !== this) {
                            island.push(edge);
                        }
                    }
                }
                edges.push(island);
            }
            return edges;
        };
        Player.prototype.getBorderPolygons = function () {
            var edgeGroups = this.getBorderEdges();
            var polys = [];

            for (var i = 0; i < edgeGroups.length; i++) {
                var island = edgeGroups[i];
                var poly = [];

                var edgesByLocation = {};

                function setVertex(vertex, edge) {
                    var x = Math.round(vertex.x);
                    var y = Math.round(vertex.y);
                    if (!edgesByLocation[x]) {
                        edgesByLocation[x] = {};
                    }
                    if (!edgesByLocation[x][y]) {
                        edgesByLocation[x][y] = [];
                    }

                    edgesByLocation[x][y].push(edge);
                }
                function setEdge(edge) {
                    setVertex(edge.va, edge);
                    setVertex(edge.vb, edge);
                }
                function removeEdge(edge) {
                    var a = edgesByLocation[edge.va.x][edge.va.y];
                    var b = edgesByLocation[edge.vb.x][edge.vb.y];

                    a.splice(a.indexOf(edge));
                    b.splice(b.indexOf(edge));
                }
                function getEdges(x, y) {
                    return edgesByLocation[Math.round(x)][Math.round(y)];
                }
                function getOtherVertex(edge, vertex) {
                    if (edge.va === vertex)
                        return edge.vb;
                    else
                        return edge.va;
                }
                function getOtherEdgeAtVertex(vertex, edge) {
                    var edges = getEdges(vertex.x, vertex.y);
                    return edges.filter(function (toFilter) {
                        return toFilter !== edge;
                    })[0];
                }
                function getNext(currentVertex, currentEdge) {
                    var nextVertex = getOtherVertex(currentEdge, currentVertex);
                    var nextEdge = getOtherEdgeAtVertex(nextVertex, currentEdge);

                    return ({
                        vertex: nextVertex,
                        edge: nextEdge
                    });
                }

                for (var j = 0; j < island.length; j++) {
                    setEdge(island[j]);
                }
                var edgesDone = [];

                var currentEdge = island[0];
                var currentVertex = currentEdge.va;
                poly.push(currentVertex);

                while (edgesDone.length !== island.length) {
                    edgesDone.push(currentEdge);

                    if (!getNext(currentVertex, currentEdge).edge)
                        debugger;
                    var next = getNext(currentVertex, currentEdge);

                    currentEdge = next.edge;
                    currentVertex = next.vertex;

                    poly.push(next.vertex);
                }

                polys.push(poly);
            }
            return polys;
        };
        return Player;
    })();
    Rance.Player = Player;
})(Rance || (Rance = {}));
/// <reference path="player.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="star.ts"/>
/// <reference path="building.ts"/>
/// <reference path="battledata.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="eventmanager.ts"/>
var Rance;
(function (Rance) {
    var Battle = (function () {
        function Battle(props) {
            this.unitsById = {};
            this.unitsBySide = {
                side1: [],
                side2: []
            };
            this.turnOrder = [];
            this.ended = false;
            this.side1 = props.side1;
            this.side1Player = props.side1Player;
            this.side2 = props.side2;
            this.side2Player = props.side2Player;
            this.battleData = props.battleData;
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

            this.maxTurns = 25;
            this.turnsLeft = this.maxTurns;
            this.updateTurnOrder();
            this.setActiveUnit();

            if (this.checkBattleEnd()) {
                this.endBattle();
            }
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
            this.turnOrder.sort(Rance.turnOrderSortFunction);

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

            var shouldEnd = this.checkBattleEnd();
            if (shouldEnd)
                this.endBattle();
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
        Battle.prototype.endBattle = function () {
            this.ended = true;

            this.forEachUnit(function (unit) {
                if (unit.currentStrength <= 0) {
                    unit.die();
                }
            });

            Rance.eventManager.dispatchEvent("battleEnd", null);
        };
        Battle.prototype.finishBattle = function () {
            this.forEachUnit(function (unit) {
                unit.resetBattleStats();
            });

            var victor = this.getVictor();
            if (this.battleData.building) {
                if (victor) {
                    this.battleData.building.setController(victor);
                }
            }
            Rance.eventManager.dispatchEvent("switchScene", "galaxyMap");
            window.setTimeout(function () {
                renderer.camera.centerOnPosition(this.battleData.location);
            }.bind(this), 20);
        };
        Battle.prototype.getVictor = function () {
            if (this.getTotalHealthForSide("side1").current <= 0) {
                return this.side2Player;
            } else if (this.getTotalHealthForSide("side2").current <= 0) {
                return this.side1Player;
            }

            return null;
        };
        Battle.prototype.getTotalHealthForSide = function (side) {
            var health = {
                current: 0,
                max: 0
            };

            var units = this.unitsBySide[side];

            for (var i = 0; i < units.length; i++) {
                var unit = units[i];
                health.current += unit.currentStrength;
                health.max += unit.maxStrength;
            }

            return health;
        };
        Battle.prototype.checkBattleEnd = function () {
            if (!this.activeUnit)
                return true;

            if (this.turnsLeft <= 0)
                return true;

            if (this.getTotalHealthForSide("side1").current <= 0 || this.getTotalHealthForSide("side2").current <= 0) {
                return true;
            }

            return false;
        };
        return Battle;
    })();
    Rance.Battle = Battle;
})(Rance || (Rance = {}));
/// <reference path="../data/templates/effecttemplates.ts" />
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

        target = getTargetOrGuard(battle, user, ability, target);

        var previousUserGuard = user.battleStats.guard.value;

        var effectsToCall = [ability.mainEffect];
        if (ability.secondaryEffects) {
            effectsToCall = effectsToCall.concat(ability.secondaryEffects);
        }

        for (var i = 0; i < effectsToCall.length; i++) {
            var effect = effectsToCall[i];
            var targetsInArea = getUnitsInEffectArea(battle, user, effect, target.battleStats.position);

            for (var j = 0; j < targetsInArea.length; j++) {
                var target = targetsInArea[j];

                effect.effect.call(null, user, target);
            }
        }

        user.removeActionPoints(ability.actionsUse);
        user.addMoveDelay(ability.moveDelay);

        if (user.battleStats.guard.value < previousUserGuard) {
            user.removeAllGuard();
        }
    }
    Rance.useAbility = useAbility;
    function validateTarget(battle, user, ability, target) {
        var potentialTargets = getPotentialTargets(battle, user, ability);

        return potentialTargets.indexOf(target) >= 0;
    }
    Rance.validateTarget = validateTarget;
    function getTargetOrGuard(battle, user, ability, target) {
        var guarding = getGuarders(battle, user, ability, target);

        guarding = guarding.sort(function (a, b) {
            return a.battleStats.guard.value - b.battleStats.guard.value;
        });

        for (var i = 0; i < guarding.length; i++) {
            var guardRoll = Math.random() * 100;
            if (guardRoll <= guarding[i].battleStats.guard.value) {
                return guarding[i];
            }
        }

        return target;
    }
    Rance.getTargetOrGuard = getTargetOrGuard;
    function getGuarders(battle, user, ability, target) {
        var allEnemies = getPotentialTargets(battle, user, Rance.Templates.Abilities.dummyTargetAll);

        var guarders = allEnemies.filter(function (unit) {
            if (unit.battleStats.guard.coverage === "all") {
                return unit.battleStats.guard.value > 0;
            } else if (unit.battleStats.guard.coverage === "column") {
                // same column
                if (unit.battleStats.position[0] === target.battleStats.position[0]) {
                    return unit.battleStats.guard.value > 0;
                }
            }
        });

        return guarders;
    }
    Rance.getGuarders = getGuarders;
    function getPotentialTargets(battle, user, ability) {
        if (ability.mainEffect.targetRange === "self") {
            return [user];
        }
        var fleetsToTarget = getFleetsToTarget(battle, user, ability.mainEffect);

        if (ability.mainEffect.targetRange === "close") {
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

        var fleetFilterFN = function (target) {
            if (!Boolean(target)) {
                return false;
            } else if (!target.isTargetable()) {
                return false;
            }

            return true;
        };

        return Rance.flatten2dArray(fleetsToTarget).filter(fleetFilterFN);

        throw new Error();
    }
    Rance.getPotentialTargets = getPotentialTargets;
    function getFleetsToTarget(battle, user, effect) {
        var nullFleet = [
            [null, null, null, null],
            [null, null, null, null]
        ];
        var insertNullBefore;
        var toConcat;

        switch (effect.targetFleets) {
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
        return getUnitsInEffectArea(battle, user, ability.mainEffect, target);
    }
    Rance.getUnitsInAbilityArea = getUnitsInAbilityArea;
    function getUnitsInEffectArea(battle, user, effect, target) {
        var targetFleets = getFleetsToTarget(battle, user, effect);

        var inArea = effect.targetingFunction(targetFleets, target);

        return inArea.filter(Boolean);
    }
    Rance.getUnitsInEffectArea = getUnitsInEffectArea;

    function getTargetsForAllAbilities(battle, user) {
        if (!user || !battle.activeUnit) {
            return false;
        }

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
var Rance;
(function (Rance) {
    // todo: use a heap instead of this crap
    var PriorityQueue = (function () {
        function PriorityQueue() {
            this.items = {};
        }
        PriorityQueue.prototype.isEmpty = function () {
            if (Object.keys(this.items).length > 0)
                return false;
            else
                return true;
        };

        PriorityQueue.prototype.push = function (priority, data) {
            if (!this.items[priority]) {
                this.items[priority] = [];
            }

            this.items[priority].push(data);
        };
        PriorityQueue.prototype.pop = function () {
            var highestPriority = Math.min.apply(null, Object.keys(this.items));

            var toReturn = this.items[highestPriority].pop();
            if (this.items[highestPriority].length < 1) {
                delete this.items[highestPriority];
            }
            return toReturn;
        };
        PriorityQueue.prototype.peek = function () {
            var highestPriority = Math.min.apply(null, Object.keys(this.items));
            var toReturn = this.items[highestPriority][0];

            return [highestPriority, toReturn.mapPosition[1], toReturn.mapPosition[2]];
        };
        return PriorityQueue;
    })();
    Rance.PriorityQueue = PriorityQueue;
})(Rance || (Rance = {}));
/// <reference path="star.ts" />
/// <reference path="priorityqueue.ts" />
var Rance;
(function (Rance) {
    function backTrace(graph, target) {
        var parent = graph[target.id];

        if (!parent)
            return [];

        var path = [
            {
                star: target,
                cost: parent.cost
            }
        ];

        while (parent) {
            path.push({
                star: parent.star,
                cost: parent.cost
            });
            parent = graph[parent.star.id];
        }
        path.reverse();
        path[0].cost = null;

        return path;
    }
    Rance.backTrace = backTrace;

    function aStar(start, target) {
        var frontier = new Rance.PriorityQueue();
        frontier.push(0, start);

        //var frontier = new EasyStar.PriorityQueue("p", 1);
        //frontier.insert({p: 0, tile: start})
        var cameFrom = {};
        var costSoFar = {};
        cameFrom[start.id] = null;
        costSoFar[start.id] = 0;

        while (!frontier.isEmpty()) {
            var current = frontier.pop();

            //var current = frontier.shiftHighestPriorityElement().tile;
            if (current === target)
                return { came: cameFrom, cost: costSoFar, queue: frontier };

            var neighbors = current.getAllLinks();

            for (var i = 0; i < neighbors.length; i++) {
                var neigh = neighbors[i];
                if (!neigh)
                    continue;

                var moveCost = 1;

                var newCost = costSoFar[current.id] + moveCost;

                if (costSoFar[neigh.id] === undefined || newCost < costSoFar[neigh.id]) {
                    costSoFar[neigh.id] = newCost;

                    // ^ done
                    var dx = Math.abs(neigh.id[1] - target.id[1]);
                    var dy = Math.abs(neigh.id[2] - target.id[2]);
                    var priority = newCost;
                    frontier.push(priority, neigh);

                    //frontier.insert({p: priority, tile: neigh});
                    cameFrom[neigh.id] = {
                        star: current,
                        cost: moveCost
                    };
                }
            }
        }

        return null;
    }
    Rance.aStar = aStar;
})(Rance || (Rance = {}));
/// <reference path="../data/templates/typetemplates.ts" />
/// <reference path="../data/templates/abilitytemplates.ts" />
/// <reference path="utility.ts"/>
/// <reference path="ability.ts"/>
/// <reference path="battle.ts"/>
/// <reference path="pathfinding.ts"/>
var Rance;
(function (Rance) {
    var idGenerators = idGenerators || {};
    idGenerators.unit = idGenerators.unit || 0;

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
            this.resetBattleStats();

            this.maxMovePoints = this.template.maxMovePoints;
            this.resetMovePoints();
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

                var min = 4 * experience * attributeLevel + 1;
                var max = 8 * experience * attributeLevel + 1 + variance;

                attributes[attribute] = Rance.randInt(min, max);
                if (attributes[attribute] > 9)
                    attributes[attribute] = 9;
            }

            this.attributes = attributes;
        };
        Unit.prototype.getBaseMoveDelay = function () {
            return 30 - this.attributes.speed;
        };
        Unit.prototype.resetMovePoints = function () {
            this.currentMovePoints = this.maxMovePoints;
        };
        Unit.prototype.resetBattleStats = function () {
            this.battleStats = {
                moveDelay: this.getBaseMoveDelay(),
                currentActionPoints: this.maxActionPoints,
                battle: null,
                side: null,
                position: null,
                guard: {
                    coverage: null,
                    value: 0
                }
            };
        };
        Unit.prototype.setBattlePosition = function (battle, side, position) {
            this.battleStats.battle = battle;
            this.battleStats.side = side;
            this.battleStats.position = position;
        };

        Unit.prototype.removeStrength = function (amount) {
            this.currentStrength -= Math.round(amount);
            if (this.currentStrength < 0) {
                this.currentStrength = 0;
            }

            this.removeGuard(50);
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
        Unit.prototype.isTargetable = function () {
            return this.currentStrength > 0;
        };
        Unit.prototype.recieveDamage = function (amount, damageType) {
            var damageReduction = this.getDamageReduction(damageType);

            var adjustedDamage = amount * damageReduction;

            this.removeStrength(adjustedDamage);
        };
        Unit.prototype.getAttackDamageIncrease = function (damageType) {
            var attackStat, attackFactor;

            switch (damageType) {
                case "physical": {
                    attackStat = this.attributes.attack;
                    attackFactor = 0.1;
                    break;
                }
                case "magical": {
                    attackStat = this.attributes.intelligence;
                    attackFactor = 0.1;
                    break;
                }
            }

            return 1 + attackStat * attackFactor;
        };
        Unit.prototype.getDamageReduction = function (damageType) {
            var defensiveStat, defenceFactor;

            switch (damageType) {
                case "physical": {
                    defensiveStat = this.attributes.defence;
                    var guardAmount = Math.min(this.battleStats.guard.value, 100);
                    defensiveStat *= (1 + guardAmount / 100);
                    defenceFactor = 0.08;
                    break;
                }
                case "magical": {
                    defensiveStat = this.attributes.intelligence;
                    defenceFactor = 0.07;
                    break;
                }
            }

            console.log(1 - defensiveStat * defenceFactor);
            return 1 - defensiveStat * defenceFactor;
        };
        Unit.prototype.addToFleet = function (fleet) {
            this.fleet = fleet;
        };
        Unit.prototype.removeFromFleet = function () {
            this.fleet = null;
        };
        Unit.prototype.die = function () {
            var player = this.fleet.player;

            player.removeUnit(this);
            this.fleet.removeShip(this);
        };
        Unit.prototype.removeGuard = function (amount) {
            this.battleStats.guard.value -= amount;
            if (this.battleStats.guard.value < 0)
                this.removeAllGuard();
        };
        Unit.prototype.addGuard = function (amount, coverage) {
            this.battleStats.guard.value += amount;
            this.battleStats.guard.coverage = coverage;
        };
        Unit.prototype.removeAllGuard = function () {
            this.battleStats.guard.value = 0;
            this.battleStats.guard.coverage = null;
        };
        return Unit;
    })();
    Rance.Unit = Unit;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.BuildableShip = React.createClass({
            makeCell: function (type) {
                var cellProps = {};
                cellProps.key = type;
                cellProps.className = "buildable-ship-list-item-cell " + type;

                var cellContent;

                switch (type) {
                    case ("buildCost"): {
                        if (this.props.player.money < this.props.buildCost) {
                            cellProps.className += " negative";
                        }
                    }
                    default: {
                        cellContent = this.props[type];
                        break;
                    }
                }

                return (React.DOM.td(cellProps, cellContent));
            },
            render: function () {
                var player = this.props.player;
                var cells = [];
                var columns = this.props.activeColumns;

                for (var i = 0; i < columns.length; i++) {
                    cells.push(this.makeCell(columns[i].key));
                }

                var props = {
                    className: "buildable-item buildable-ship",
                    onClick: this.props.handleClick
                };
                if (player.money < this.props.buildCost) {
                    props.onClick = null;
                    props.disabled = true;
                    props.className += " disabled";
                }

                return (React.DOM.tr(props, cells));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../../unit.ts" />
/// <reference path="../../fleet.ts" />
/// <reference path="../unitlist/list.ts" />
/// <reference path="buildableship.ts" />
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.BuildableShipsList = React.createClass({
            getInitialState: function () {
                return ({
                    shipTemplates: this.props.player.getBuildableShips()
                });
            },
            buildShip: function (rowItem) {
                var template = rowItem.data.template;

                var ship = new Rance.Unit(template);
                this.props.player.addUnit(ship);

                var fleet = new Rance.Fleet(this.props.player, [ship], this.props.star);

                this.props.player.money -= template.buildCost;

                Rance.eventManager.dispatchEvent("playerControlUpdated");
            },
            render: function () {
                if (this.state.shipTemplates.length < 1)
                    return null;
                var rows = [];

                for (var i = 0; i < this.state.shipTemplates.length; i++) {
                    var template = this.state.shipTemplates[i];

                    var data = {
                        template: template,
                        typeName: template.typeName,
                        buildCost: template.buildCost,
                        player: this.props.player,
                        rowConstructor: Rance.UIComponents.BuildableShip
                    };

                    rows.push({
                        key: i,
                        data: data
                    });
                }

                var columns = [
                    {
                        label: "Name",
                        key: "typeName",
                        defaultOrder: "asc"
                    },
                    {
                        label: "Cost",
                        key: "buildCost",
                        defaultOrder: "desc"
                    }
                ];

                return (React.DOM.div({ className: "buildable-item-list buildable-ship-list" }, Rance.UIComponents.List({
                    listItems: rows,
                    initialColumns: columns,
                    onRowChange: this.buildShip
                })));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="attacktarget.ts"/>
/// <reference path="buildablebuildinglist.ts"/>
/// <reference path="buildableshipslist.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.PossibleActions = React.createClass({
            getInitialState: function () {
                return ({
                    expandedAction: null,
                    expandedActionElement: null
                });
            },
            componentWillReceiveProps: function (newProps) {
                if (this.props.selectedStar !== newProps.selectedStar && this.state.expandedActionElement) {
                    this.setState({
                        expandedAction: null,
                        expandedActionElement: null
                    });
                }
            },
            buildBuildings: function () {
                if (this.state.expandedAction === "buildBuildings") {
                    this.setState({
                        expandedAction: null,
                        expandedActionElement: null
                    });
                } else {
                    this.setState({
                        expandedAction: "buildBuildings",
                        expandedActionElement: this.makeExpandedAction("buildBuildings")
                    });
                }
            },
            buildShips: function () {
                if (this.state.expandedAction === "buildShips") {
                    this.setState({
                        expandedAction: null,
                        expandedActionElement: null
                    });
                } else {
                    this.setState({
                        expandedAction: "buildShips",
                        expandedActionElement: this.makeExpandedAction("buildShips")
                    });
                }
            },
            makeExpandedAction: function (action) {
                switch (action) {
                    case "buildBuildings": {
                        if (!this.props.selectedStar)
                            return null;

                        return (React.DOM.div({
                            className: "expanded-action"
                        }, Rance.UIComponents.BuildableBuildingList({
                            player: this.props.player,
                            star: this.props.selectedStar
                        })));
                    }
                    case "buildShips": {
                        if (!this.props.selectedStar)
                            return null;

                        return (React.DOM.div({
                            className: "expanded-action"
                        }, Rance.UIComponents.BuildableShipsList({
                            player: this.props.player,
                            star: this.props.selectedStar
                        })));
                    }
                    default: {
                        return null;
                    }
                }
            },
            render: function () {
                var allActions = [];

                var attackTargets = this.props.attackTargets;
                if (attackTargets && attackTargets.length > 0) {
                    var attackTargetComponents = [];
                    for (var i = 0; i < attackTargets.length; i++) {
                        var props = {
                            key: i,
                            attackTarget: attackTargets[i]
                        };

                        attackTargetComponents.push(Rance.UIComponents.AttackTarget(props));
                    }
                    allActions.push(React.DOM.div({
                        className: "possible-action",
                        key: "attackActions"
                    }, React.DOM.div({ className: "possible-action-title" }, "attack"), attackTargetComponents));
                }

                var star = this.props.selectedStar;
                if (star) {
                    if (star.owner === this.props.player) {
                        allActions.push(React.DOM.div({
                            className: "possible-action",
                            onClick: this.buildShips,
                            key: "buildShipActions"
                        }, "build ship"));

                        if (star.getBuildableBuildings().length > 0) {
                            allActions.push(React.DOM.div({
                                className: "possible-action",
                                onClick: this.buildBuildings,
                                key: "buildActions"
                            }, "construct"));
                        }
                    }
                }

                var possibleActions = React.DOM.div({
                    className: "possible-actions"
                }, allActions);

                return (React.DOM.div({
                    className: "possible-actions-container"
                }, allActions.length > 0 ? possibleActions : null, this.state.expandedActionElement));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="topbar.ts"/>
/// <reference path="fleetselection.ts"/>
/// <reference path="fleetreorganization.ts"/>
/// <reference path="starinfo.ts"/>
/// <reference path="../possibleactions/possibleactions.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.GalaxyMapUI = React.createClass({
            endTurn: function () {
                Rance.eventManager.dispatchEvent("endTurn", null);
            },
            getInitialState: function () {
                var pc = this.props.playerControl;

                return ({
                    selectedFleets: pc.selectedFleets,
                    currentlyReorganizing: pc.currentlyReorganizing,
                    selectedStar: pc.selectedStar,
                    attackTargets: pc.currentAttackTargets
                });
            },
            updateSelection: function () {
                var pc = this.props.playerControl;

                var star = null;
                if (pc.selectedStar)
                    star = pc.selectedStar;
                else if (pc.areAllFleetsInSameLocation()) {
                    star = pc.selectedFleets[0].location;
                }
                ;

                this.setState({
                    selectedFleets: pc.selectedFleets,
                    currentlyReorganizing: pc.currentlyReorganizing,
                    selectedStar: star,
                    attackTargets: pc.currentAttackTargets
                });
            },
            closeReorganization: function () {
                Rance.eventManager.dispatchEvent("endReorganizingFleets");
                this.updateSelection();
            },
            render: function () {
                return (React.DOM.div({
                    className: "galaxy-map-ui"
                }, React.DOM.div({
                    className: "galaxy-map-ui-top"
                }, Rance.UIComponents.TopBar({
                    player: this.props.player
                }), React.DOM.div({
                    className: "fleet-selection-container"
                }, Rance.UIComponents.FleetSelection({
                    selectedFleets: this.state.selectedFleets
                }), Rance.UIComponents.FleetReorganization({
                    fleets: this.state.currentlyReorganizing,
                    closeReorganization: this.closeReorganization
                }))), React.DOM.div({
                    className: "galaxy-map-ui-bottom-left"
                }, Rance.UIComponents.PossibleActions({
                    attackTargets: this.state.attackTargets,
                    selectedStar: this.state.selectedStar,
                    player: this.props.player
                }), Rance.UIComponents.StarInfo({
                    selectedStar: this.state.selectedStar
                })), React.DOM.button({
                    className: "end-turn-button",
                    onClick: this.endTurn
                }, "End turn")));
            },
            componentWillMount: function () {
                Rance.eventManager.addEventListener("playerControlUpdated", this.updateSelection);
            },
            componentWillUnmount: function () {
                Rance.eventManager.removeEventListener("playerControlUpdated", this.updateSelection);
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../mapgen/mapgencontrols.ts"/>
/// <reference path="../popups/popupmanager.ts"/>
/// <reference path="galaxymapui.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.GalaxyMap = React.createClass({
            renderMap: function () {
                this.props.galaxyMap.mapRenderer.render();
            },
            switchMapMode: function () {
                var newMode = this.refs.mapModeSelector.getDOMNode().value;

                this.props.galaxyMap.mapRenderer.setMapMode(newMode);
            },
            render: function () {
                return (React.DOM.div({
                    className: "galaxy-map"
                }, React.DOM.div({
                    ref: "pixiContainer",
                    id: "pixi-container"
                }, Rance.UIComponents.GalaxyMapUI({
                    playerControl: this.props.playerControl,
                    player: this.props.player
                }), Rance.UIComponents.PopupManager({})), React.DOM.select({
                    className: "reactui-selector",
                    ref: "mapModeSelector",
                    onChange: this.switchMapMode
                }, React.DOM.option({ value: "default" }, "default"), React.DOM.option({ value: "noLines" }, "no borders"), React.DOM.option({ value: "income" }, "income"))));
            },
            componentDidMount: function () {
                if (mapRenderer)
                    mapRenderer.resetContainer();

                if (!this.props.galaxyMap.mapGen.points[0]) {
                    this.props.galaxyMap.mapGen.makeMap(Rance.Templates.MapGen.defaultMap);
                }

                this.props.renderer.setContainer(this.refs.pixiContainer.getDOMNode());
                this.props.renderer.init();
                this.props.renderer.bindRendererView();

                mapRenderer = new Rance.MapRenderer();
                mapRenderer.setParent(renderer.layers["map"]);
                this.props.galaxyMap.mapRenderer = mapRenderer;
                mapRenderer.galaxyMap = galaxyMap;

                this.props.galaxyMap.mapRenderer.setMapMode("default");

                this.props.renderer.render();

                this.renderMap();

                this.props.renderer.camera.centerOnPosition(this.props.galaxyMap.mapGen.points[0]);
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.FlagMaker = React.createClass({
            makeFlags: function (delay) {
                if (typeof delay === "undefined") { delay = 0; }
                var flags = [];
                var parent = this.refs.flags.getDOMNode();

                while (parent.lastChild) {
                    parent.removeChild(parent.lastChild);
                }

                for (var i = 0; i < 100; i++) {
                    var colorScheme = Rance.generateColorScheme();

                    var flag = new Rance.Flag({
                        width: 46,
                        mainColor: colorScheme.main,
                        secondaryColor: colorScheme.secondary
                    });

                    flag.generateRandom();

                    var canvas = flag.draw();

                    flags.push(flag);
                }

                function makeHslStringFromHex(hex) {
                    var hsl = Rance.hexToHsv(hex);

                    hsl = Rance.colorFromScalars(hsl);
                    hsl = hsl.map(function (v) {
                        return v.toFixed();
                    });

                    return hsl.join(", ");
                }

                window.setTimeout(function (e) {
                    for (var i = 0; i < flags.length; i++) {
                        var canvas = flags[i].draw();
                        parent.appendChild(canvas);

                        canvas.setAttribute("title", "bgColor: " + makeHslStringFromHex(flags[i].mainColor) + "\n" + "emblemColor: " + makeHslStringFromHex(flags[i].secondaryColor) + "\n");

                        canvas.onclick = function (e) {
                            console.log(Rance.hexToHusl(this.mainColor));
                            console.log(Rance.hexToHusl(this.secondaryColor));
                        }.bind(flags[i]);
                    }
                }, delay);
            },
            componentDidMount: function () {
                this.makeFlags();
            },
            render: function () {
                return (React.DOM.div(null, React.DOM.div({
                    className: "flags",
                    ref: "flags"
                }), React.DOM.button({
                    onClick: this.makeFlags
                }, "make flags")));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../../lib/react.d.ts" />
/// <reference path="battle/battle.ts"/>
/// <reference path="unitlist/unitlist.ts"/>
/// <reference path="battleprep/battleprep.ts"/>
/// <reference path="mapgen/mapgen.ts"/>
/// <reference path="galaxymap/galaxymap.ts"/>
/// <reference path="flagmaker.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.Stage = React.createClass({
            changeScene: function () {
                var newScene = this.refs.sceneSelector.getDOMNode().value;

                this.props.changeSceneFunction(newScene);
            },
            render: function () {
                var elementsToRender = [];

                switch (this.props.sceneToRender) {
                    case "battle": {
                        elementsToRender.push(Rance.UIComponents.Battle({
                            battle: this.props.battle,
                            key: "battle"
                        }));
                        break;
                    }
                    case "mapGen": {
                        elementsToRender.push(Rance.UIComponents.MapGen({
                            renderer: this.props.renderer,
                            mapGen: this.props.mapGen,
                            key: "mapGen"
                        }));
                        break;
                    }
                    case "battlePrep": {
                        elementsToRender.push(Rance.UIComponents.BattlePrep({
                            battlePrep: this.props.battlePrep,
                            key: "battlePrep"
                        }));
                        break;
                    }
                    case "galaxyMap": {
                        elementsToRender.push(Rance.UIComponents.GalaxyMap({
                            renderer: this.props.renderer,
                            galaxyMap: this.props.galaxyMap,
                            playerControl: this.props.playerControl,
                            player: this.props.player,
                            key: "galaxyMap"
                        }));
                        break;
                    }
                    case "flagMaker": {
                        elementsToRender.push(Rance.UIComponents.FlagMaker());
                        break;
                    }
                }
                return (React.DOM.div({ className: "react-stage" }, elementsToRender, React.DOM.select({
                    className: "reactui-selector",
                    ref: "sceneSelector",
                    value: this.props.sceneToRender,
                    onChange: this.changeScene
                }, React.DOM.option({ value: "mapGen" }, "map generation"), React.DOM.option({ value: "galaxyMap" }, "map"), React.DOM.option({ value: "battlePrep" }, "battle setup"), React.DOM.option({ value: "battle" }, "battle"), React.DOM.option({ value: "flagMaker" }, "make flags"))));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../../lib/react.d.ts" />
/// <reference path="../eventmanager.ts"/>
/// <reference path="stage.ts"/>
var Rance;
(function (Rance) {
    var ReactUI = (function () {
        function ReactUI(container) {
            this.container = container;
            this.addEventListeners();
        }
        ReactUI.prototype.addEventListeners = function () {
            var self = this;
            Rance.eventManager.addEventListener("switchScene", function (e) {
                self.switchScene(e.data);
            });
        };
        ReactUI.prototype.switchScene = function (newScene) {
            console.log(newScene);
            this.currentScene = newScene;
            this.render();
        };
        ReactUI.prototype.render = function () {
            this.stage = React.renderComponent(Rance.UIComponents.Stage({
                sceneToRender: this.currentScene,
                changeSceneFunction: this.switchScene.bind(this),
                battle: this.battle,
                battlePrep: this.battlePrep,
                renderer: this.renderer,
                mapGen: this.mapGen,
                galaxyMap: this.galaxyMap,
                playerControl: this.playerControl,
                player: this.player
            }), this.container);
        };
        return ReactUI;
    })();
    Rance.ReactUI = ReactUI;
})(Rance || (Rance = {}));
/// <reference path="eventmanager.ts"/>
/// <reference path="player.ts"/>
/// <reference path="fleet.ts"/>
/// <reference path="star.ts"/>
/// <reference path="battledata.ts"/>
var Rance;
(function (Rance) {
    var PlayerControl = (function () {
        function PlayerControl(player) {
            this.selectedFleets = [];
            this.currentlyReorganizing = [];
            this.preventingGhost = false;
            this.player = player;
            this.addEventListeners();
        }
        PlayerControl.prototype.addEventListeners = function () {
            var self = this;

            Rance.eventManager.addEventListener("updateSelection", function (e) {
                self.updateSelection();
            });

            Rance.eventManager.addEventListener("selectFleets", function (e) {
                self.selectFleets(e.data);
            });
            Rance.eventManager.addEventListener("deselectFleet", function (e) {
                self.deselectFleet(e.data);
            });
            Rance.eventManager.addEventListener("mergeFleets", function (e) {
                self.mergeFleets();
            });

            Rance.eventManager.addEventListener("splitFleet", function (e) {
                self.splitFleet(e.data);
            });
            Rance.eventManager.addEventListener("startReorganizingFleets", function (e) {
                self.startReorganizingFleets(e.data);
            });
            Rance.eventManager.addEventListener("endReorganizingFleets", function (e) {
                self.endReorganizingFleets();
            });

            Rance.eventManager.addEventListener("starClick", function (e) {
                self.selectStar(e.data);
            });
            Rance.eventManager.addEventListener("starRightClick", function (e) {
                self.moveFleets(e.data);
            });

            Rance.eventManager.addEventListener("setRectangleSelectTargetFN", function (e) {
                e.data.getSelectionTargetsFN = self.player.getFleetsWithPositions.bind(self.player);
            });

            Rance.eventManager.addEventListener("attackTarget", function (e) {
                self.attackTarget(e.data);
            });
        };
        PlayerControl.prototype.preventGhost = function (delay) {
            this.preventingGhost = true;
            var self = this;
            var timeout = window.setTimeout(function () {
                self.preventingGhost = false;
                window.clearTimeout(timeout);
            }, delay);
        };
        PlayerControl.prototype.clearSelection = function () {
            this.selectedFleets = [];
            this.selectedStar = null;
        };
        PlayerControl.prototype.updateSelection = function (endReorganizingFleets) {
            if (typeof endReorganizingFleets === "undefined") { endReorganizingFleets = true; }
            if (endReorganizingFleets)
                this.endReorganizingFleets();
            this.currentAttackTargets = this.getCurrentAttackTargets();

            Rance.eventManager.dispatchEvent("playerControlUpdated", null);
        };

        PlayerControl.prototype.areAllFleetsInSameLocation = function () {
            if (this.selectedFleets.length <= 0)
                return false;

            for (var i = 1; i < this.selectedFleets.length; i++) {
                if (this.selectedFleets[i].location !== this.selectedFleets[i - 1].location) {
                    return false;
                }
            }

            return true;
        };
        PlayerControl.prototype.selectFleets = function (fleets) {
            this.clearSelection();

            for (var i = 0; i < fleets.length; i++) {
                if (fleets[i].ships.length < 1) {
                    if (this.currentlyReorganizing.indexOf(fleets[i]) >= 0)
                        continue;
                    fleets[i].deleteFleet();
                    fleets.splice(i, 1);
                }
            }

            this.selectedFleets = fleets;

            this.updateSelection();
            if (fleets.length > 0) {
                this.preventGhost(15);
            }
        };
        PlayerControl.prototype.deselectFleet = function (fleet) {
            var fleetIndex = this.selectedFleets.indexOf(fleet);

            if (fleetIndex < 0)
                return;

            this.selectedFleets.splice(fleetIndex, 1);

            this.updateSelection();
        };
        PlayerControl.prototype.getMasterFleetForMerge = function () {
            return this.selectedFleets[0];
        };
        PlayerControl.prototype.mergeFleets = function () {
            var fleets = this.selectedFleets;
            var master = this.getMasterFleetForMerge();

            fleets.splice(fleets.indexOf(master), 1);
            var slaves = fleets;

            for (var i = 0; i < slaves.length; i++) {
                slaves[i].mergeWith(master);
            }

            this.clearSelection();
            this.selectedFleets = [master];
            this.updateSelection();
        };
        PlayerControl.prototype.selectStar = function (star) {
            if (this.preventingGhost)
                return;
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
            if (fleet.ships.length <= 0)
                return;
            this.endReorganizingFleets();
            var newFleet = fleet.split();

            this.currentlyReorganizing = [fleet, newFleet];
            this.selectedFleets = [fleet, newFleet];

            this.updateSelection(false);
        };
        PlayerControl.prototype.startReorganizingFleets = function (fleets) {
            if (fleets.length !== 2 || fleets[0].location !== fleets[1].location || this.selectedFleets.length !== 2 || this.selectedFleets.indexOf(fleets[0]) < 0 || this.selectedFleets.indexOf(fleets[1]) < 0) {
                throw new Error("cant reorganize fleets");
            }
            this.currentlyReorganizing = fleets;

            this.updateSelection(false);
        };
        PlayerControl.prototype.endReorganizingFleets = function () {
            for (var i = 0; i < this.currentlyReorganizing.length; i++) {
                var fleet = this.currentlyReorganizing[i];
                if (fleet.ships.length <= 0) {
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
            if (this.selectedFleets.length < 1)
                return [];
            if (!this.areAllFleetsInSameLocation())
                return [];

            var location = this.selectedFleets[0].location;
            var possibleTargets = location.getTargetsForPlayer(this.player);

            return possibleTargets;
        };

        PlayerControl.prototype.attackTarget = function (target) {
            if (this.currentAttackTargets.indexOf(target) < 0)
                return false;

            var currentLocation = this.selectedFleets[0].location;

            var battleData = {
                location: currentLocation,
                building: target.building,
                attacker: {
                    player: this.player,
                    ships: currentLocation.getAllShipsOfPlayer(this.player)
                },
                defender: {
                    player: target.enemy,
                    ships: target.ships
                }
            };

            // TODO
            battlePrep = new Rance.BattlePrep(this.player, battleData);
            reactUI.battlePrep = battlePrep;
            reactUI.switchScene("battlePrep");
        };
        return PlayerControl;
    })();
    Rance.PlayerControl = PlayerControl;
})(Rance || (Rance = {}));
/// <reference path="unit.ts"/>
/// <reference path="player.ts"/>
/// <reference path="battle.ts"/>
/// <reference path="battledata.ts"/>
var Rance;
(function (Rance) {
    var BattlePrep = (function () {
        function BattlePrep(player, battleData) {
            this.alreadyPlaced = {};
            this.player = player;
            this.battleData = battleData;

            this.fleet = [
                [null, null, null, null],
                [null, null, null, null]
            ];

            this.setAvailableUnits();
        }
        BattlePrep.prototype.setAvailableUnits = function () {
            if (this.battleData.attacker.player === this.player) {
                this.availableUnits = this.battleData.attacker.ships;
                this.enemy = this.battleData.defender.player;
                this.enemyUnits = this.battleData.defender.ships;
            } else {
                this.availableUnits = this.battleData.defender.ships;
                this.enemy = this.battleData.attacker.player;
                this.enemyUnits = this.battleData.attacker.ships;
            }
        };

        // TODO
        BattlePrep.prototype.makeEnemyFleet = function () {
            var fleet = [
                [null, null, null, null],
                [null, null, null, null]
            ];

            function divmod(x, y) {
                var a = Math.floor(x / y);
                var b = x % y;
                return [a, b];
            }

            for (var i = 0; i < this.enemyUnits.length; i++) {
                var d = divmod(i, 3);

                if (d[0] > 1)
                    break;

                fleet[d[0]][d[1]] = this.enemyUnits[i];
            }

            return fleet;
        };

        BattlePrep.prototype.getUnitPosition = function (unit) {
            return this.alreadyPlaced[unit.id];
        };
        BattlePrep.prototype.getUnitAtPosition = function (position) {
            return this.fleet[position[0]][position[1]];
        };
        BattlePrep.prototype.setUnit = function (unit, position) {
            this.removeUnit(unit);

            if (!position) {
                return;
            }

            var oldUnitInPosition = this.getUnitAtPosition(position);

            if (oldUnitInPosition) {
                this.removeUnit(oldUnitInPosition);
            }

            this.fleet[position[0]][position[1]] = unit;
            this.alreadyPlaced[unit.id] = position;
        };
        BattlePrep.prototype.swapUnits = function (unit1, unit2) {
            if (unit1 === unit2)
                return;

            var new1Pos = this.getUnitPosition(unit2);
            var new2Pos = this.getUnitPosition(unit1);

            this.setUnit(unit1, new1Pos);
            this.setUnit(unit2, new2Pos);
        };
        BattlePrep.prototype.removeUnit = function (unit) {
            var currentPosition = this.getUnitPosition(unit);

            if (!currentPosition)
                return;

            this.fleet[currentPosition[0]][currentPosition[1]] = null;

            this.alreadyPlaced[unit.id] = null;
            delete this.alreadyPlaced[unit.id];
        };

        BattlePrep.prototype.makeBattle = function () {
            var battle = new Rance.Battle({
                battleData: this.battleData,
                side1: this.fleet,
                side2: this.makeEnemyFleet(),
                side1Player: this.player,
                side2Player: this.enemy
            });

            battle.init();

            return battle;
        };
        return BattlePrep;
    })();
    Rance.BattlePrep = BattlePrep;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (Templates) {
        (function (MapGen) {
            MapGen.defaultMap = {
                mapOptions: {
                    width: 600,
                    height: 600
                },
                starGeneration: {
                    galaxyType: "spiral",
                    totalAmount: 60,
                    arms: 5,
                    centerSize: 0.4,
                    amountInCenter: 0.3
                },
                relaxation: {
                    timesToRelax: 5,
                    dampeningFactor: 2
                }
            };
        })(Templates.MapGen || (Templates.MapGen = {}));
        var MapGen = Templates.MapGen;
    })(Rance.Templates || (Rance.Templates = {}));
    var Templates = Rance.Templates;
})(Rance || (Rance = {}));
/// <reference path="point.ts"/>
var Rance;
(function (Rance) {
    var Triangle = (function () {
        function Triangle(a, b, c) {
            this.a = a;
            this.b = b;
            this.c = c;
        }
        Triangle.prototype.getPoints = function () {
            return [this.a, this.b, this.c];
        };
        Triangle.prototype.getCircumCenter = function () {
            if (!this.circumRadius) {
                this.calculateCircumCircle();
            }

            return [this.circumCenterX, this.circumCenterY];
        };
        Triangle.prototype.calculateCircumCircle = function (tolerance) {
            if (typeof tolerance === "undefined") { tolerance = 0.00001; }
            var pA = this.a;
            var pB = this.b;
            var pC = this.c;

            var m1, m2;
            var mx1, mx2;
            var my1, my2;
            var cX, cY;

            if (Math.abs(pB.y - pA.y) < tolerance) {
                m2 = -(pC.x - pB.x) / (pC.y - pB.y);
                mx2 = (pB.x + pC.x) * 0.5;
                my2 = (pB.y + pC.y) * 0.5;

                cX = (pB.x + pA.x) * 0.5;
                cY = m2 * (cX - mx2) + my2;
            } else {
                m1 = -(pB.x - pA.x) / (pB.y - pA.y);
                mx1 = (pA.x + pB.x) * 0.5;
                my1 = (pA.y + pB.y) * 0.5;

                if (Math.abs(pC.y - pB.y) < tolerance) {
                    cX = (pC.x + pB.x) * 0.5;
                    cY = m1 * (cX - mx1) + my1;
                } else {
                    m2 = -(pC.x - pB.x) / (pC.y - pB.y);
                    mx2 = (pB.x + pC.x) * 0.5;
                    my2 = (pB.y + pC.y) * 0.5;

                    cX = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
                    cY = m1 * (cX - mx1) + my1;
                }
            }

            this.circumCenterX = cX;
            this.circumCenterY = cY;

            mx1 = pB.x - cX;
            my1 = pB.y - cY;
            this.circumRadius = Math.sqrt(mx1 * mx1 + my1 * my1);
        };
        Triangle.prototype.circumCircleContainsPoint = function (point) {
            this.calculateCircumCircle();
            var x = point.x - this.circumCenterX;
            var y = point.y - this.circumCenterY;

            var contains = x * x + y * y <= this.circumRadius * this.circumRadius;

            return (contains);
        };
        Triangle.prototype.getEdges = function () {
            var edges = [
                [this.a, this.b],
                [this.b, this.c],
                [this.c, this.a]
            ];

            return edges;
        };
        Triangle.prototype.getAmountOfSharedVerticesWith = function (toCheckAgainst) {
            var ownPoints = this.getPoints();
            var otherPoints = toCheckAgainst.getPoints();
            var shared = 0;

            for (var i = 0; i < ownPoints.length; i++) {
                if (otherPoints.indexOf(ownPoints[i]) >= 0) {
                    shared++;
                }
            }

            return shared;
        };
        return Triangle;
    })();
    Rance.Triangle = Triangle;
})(Rance || (Rance = {}));
/// <reference path="triangle.ts" />
/// <reference path="point.ts" />
var Rance;
(function (Rance) {
    function triangulate(vertices) {
        var triangles = [];

        var superTriangle = makeSuperTriangle(vertices);
        triangles.push(superTriangle);

        for (var i = 0; i < vertices.length; i++) {
            var vertex = vertices[i];
            var edgeBuffer = [];

            for (var j = 0; j < triangles.length; j++) {
                var triangle = triangles[j];

                if (triangle.circumCircleContainsPoint(vertex)) {
                    var edges = triangle.getEdges();
                    edgeBuffer = edgeBuffer.concat(edges);
                    triangles.splice(j, 1);
                    j--;
                }
            }
            if (i >= vertices.length)
                continue;

            for (var j = edgeBuffer.length - 2; j >= 0; j--) {
                for (var k = edgeBuffer.length - 1; k >= j + 1; k--) {
                    if (edgesEqual(edgeBuffer[k], edgeBuffer[j])) {
                        edgeBuffer.splice(k, 1);
                        edgeBuffer.splice(j, 1);
                        k--;
                        continue;
                    }
                }
            }
            for (var j = 0; j < edgeBuffer.length; j++) {
                var newTriangle = new Rance.Triangle(edgeBuffer[j][0], edgeBuffer[j][1], vertex);

                triangles.push(newTriangle);
            }
        }

        /*
        for (var i = triangles.length - 1; i >= 0; i--)
        {
        if (triangles[i].getAmountOfSharedVerticesWith(superTriangle))
        {
        triangles.splice(i, 1);
        }
        }*/
        return ({
            triangles: triangles,
            superTriangle: superTriangle
        });
    }
    Rance.triangulate = triangulate;

    function voronoiFromTriangles(triangles) {
        var trianglesPerPoint = {};
        var voronoiData = {};

        for (var i = 0; i < triangles.length; i++) {
            var triangle = triangles[i];
            var points = triangle.getPoints();

            for (var j = 0; j < points.length; j++) {
                if (!trianglesPerPoint[points[j]]) {
                    trianglesPerPoint[points[j]] = [];
                    voronoiData[points[j]] = {
                        point: points[j]
                    };
                }

                trianglesPerPoint[points[j]].push(triangle);
            }
        }
        function makeTrianglePairs(triangles) {
            var toMatch = triangles.slice(0);
            var pairs = [];

            for (var i = toMatch.length - 2; i >= 0; i--) {
                for (var j = toMatch.length - 1; j >= i + 1; j--) {
                    var matchingVertices = toMatch[i].getAmountOfSharedVerticesWith(toMatch[j]);

                    if (matchingVertices === 2) {
                        pairs.push([toMatch[j], toMatch[i]]);
                    }
                }
            }

            return pairs;
        }

        for (var point in trianglesPerPoint) {
            var pointTriangles = trianglesPerPoint[point];

            var trianglePairs = makeTrianglePairs(pointTriangles);
            voronoiData[point].lines = [];

            for (var i = 0; i < trianglePairs.length; i++) {
                voronoiData[point].lines.push([
                    trianglePairs[i][0].getCircumCenter(),
                    trianglePairs[i][1].getCircumCenter()
                ]);
            }
        }

        return voronoiData;
    }
    Rance.voronoiFromTriangles = voronoiFromTriangles;

    function getCentroid(vertices) {
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
            y: y
        });
    }
    Rance.getCentroid = getCentroid;

    function makeSuperTriangle(vertices, highestCoordinateValue) {
        var max;

        if (highestCoordinateValue) {
            max = highestCoordinateValue;
        } else {
            max = vertices[0].x;

            for (var i = 0; i < vertices.length; i++) {
                if (vertices[i].x > max) {
                    max = vertices[i].x;
                }
                if (vertices[i].y > max) {
                    max = vertices[i].y;
                }
            }
        }

        var triangle = new Rance.Triangle({
            x: 3 * max,
            y: 0
        }, {
            x: 0,
            y: 3 * max
        }, {
            x: -3 * max,
            y: -3 * max
        });

        return (triangle);
    }
    Rance.makeSuperTriangle = makeSuperTriangle;

    function pointsEqual(p1, p2) {
        return (p1.x === p2.x && p1.y === p2.y);
    }
    Rance.pointsEqual = pointsEqual;

    function edgesEqual(e1, e2) {
        return ((pointsEqual(e1[0], e2[0]) && pointsEqual(e1[1], e2[1])) || (pointsEqual(e1[0], e2[1]) && pointsEqual(e1[1], e2[0])));
    }
    Rance.edgesEqual = edgesEqual;
})(Rance || (Rance = {}));
/// <reference path="../lib/voronoi.d.ts" />
/// <reference path="../data/templates/mapgentemplates.ts" />
/// <reference path="triangulation.ts" />
/// <reference path="triangle.ts" />
/// <reference path="star.ts" />
/// <reference path="utility.ts" />
var Rance;
(function (Rance) {
    var MapGen = (function () {
        function MapGen() {
            this.points = [];
            this.regions = {};
            this.triangles = [];
            this.galaxyConstructors = {};
            this.galaxyConstructors = {
                spiral: this.makeSpiralPoints
            };
        }
        MapGen.prototype.reset = function () {
            this.points = [];
            this.regions = {};
            this.triangles = [];
            this.voronoiDiagram = null;

            this.nonFillerPoints = [];
            this.nonFillerVoronoiLines = [];
        };
        MapGen.prototype.makeMap = function (options) {
            this.reset();

            this.maxWidth = options.mapOptions.width;
            this.maxHeight = options.mapOptions.height || this.maxWidth;

            this.points = this.generatePoints(options.starGeneration);

            this.makeVoronoi();
            this.relaxPoints(options.relaxation);

            this.triangulate();
            this.severArmLinks();

            for (var i = 0; i < 4; i++) {
                var units = player1.getAllUnits();
                var fleet = new Rance.Fleet(player1, [units[i]], this.points[i]);
                this.points[i].owner = player1;
                player1.addStar(this.points[i]);
                var sectorCommand = new Rance.Building({
                    template: Rance.Templates.Buildings.sectorCommand,
                    location: this.points[i]
                });
                this.points[i].addBuilding(sectorCommand);
                var player = i > 1 ? player2 : player1;
                for (var j = 0; j < 2; j++) {
                    var starBase = new Rance.Building({
                        template: Rance.Templates.Buildings.starBase,
                        location: this.points[i],
                        controller: player
                    });
                    this.points[i].addBuilding(starBase);
                }
            }

            for (var i = 4; i < 8; i++) {
                var units = player2.getAllUnits();
                var fleet = new Rance.Fleet(player2, [units[i - 4]], this.points[i]);
                this.points[i].owner = player2;
                player2.addStar(this.points[i]);
                var sectorCommand = new Rance.Building({
                    template: Rance.Templates.Buildings.sectorCommand,
                    location: this.points[i]
                });
                this.points[i].addBuilding(sectorCommand);
                var player = i > 5 ? player1 : player2;
                for (var j = 0; j < 2; j++) {
                    var starBase = new Rance.Building({
                        template: Rance.Templates.Buildings.starBase,
                        location: this.points[i],
                        controller: player
                    });
                    this.points[i].addBuilding(starBase);
                }
            }

            var units = player2.getAllUnits();
            var fleet = new Rance.Fleet(player2, [units[4]], this.points[8]);

            return this;
        };

        MapGen.prototype.generatePoints = function (options) {
            var amountInArms = 1 - options.amountInCenter;

            var starGenerationProps = {
                amountPerArm: options.totalAmount / options.arms * amountInArms,
                arms: options.arms,
                amountInCenter: options.totalAmount * options.amountInCenter,
                centerSize: options.centerSize
            };

            var galaxyConstructor = this.galaxyConstructors[options.galaxyType];

            return galaxyConstructor.call(this, starGenerationProps);
        };
        MapGen.prototype.makeRegion = function (name) {
            this.regions[name] = {
                id: name,
                points: []
            };
        };
        MapGen.prototype.makeSpiralPoints = function (props) {
            var totalArms = props.arms * 2;
            var amountPerArm = props.amountPerArm;
            var amountPerFillerArm = amountPerArm / 2;

            var amountInCenter = props.amountInCenter;
            var centerThreshhold = props.centerSize || 0.35;

            var points = [];
            var armDistance = Math.PI * 2 / totalArms;
            var armOffsetMax = props.armOffsetMax || 0.5;
            var armRotationFactor = props.arms / 3;
            var galaxyRotation = Rance.randRange(0, Math.PI * 2);
            var minBound = Math.min(this.maxWidth, this.maxHeight);
            var minBound2 = minBound / 2;

            var makePoint = function makePointFN(distanceMin, distanceMax, region, armOffsetMax) {
                var distance = Rance.randRange(distanceMin, distanceMax);
                var offset = Math.random() * armOffsetMax - armOffsetMax / 2;
                offset *= (1 / distance);

                if (offset < 0)
                    offset = Math.pow(offset, 2) * -1;
                else
                    offset = Math.pow(offset, 2);

                var armRotation = distance * armRotationFactor;
                var angle = arm * armDistance + galaxyRotation + offset + armRotation;

                var x = Math.cos(angle) * distance * this.maxWidth + this.maxWidth;
                var y = Math.sin(angle) * distance * this.maxHeight + this.maxHeight;

                var point = new Rance.Star(x, y);

                point.distance = distance;
                point.region = region;
                point.baseIncome = Rance.randInt(2, 10) * 10;

                return point;
            }.bind(this);

            this.makeRegion("center");

            var currentArmIsFiller = false;
            for (var i = 0; i < totalArms; i++) {
                var arm = i;
                var region = (currentArmIsFiller ? "filler_" : "arm_") + arm;
                var amountForThisArm = currentArmIsFiller ? amountPerFillerArm : amountPerArm;
                var maxOffsetForThisArm = currentArmIsFiller ? armOffsetMax / 2 : armOffsetMax;
                this.makeRegion(region);

                var amountForThisCenter = Math.round(amountInCenter / totalArms);

                for (var j = 0; j < amountForThisArm; j++) {
                    var point = makePoint(centerThreshhold, 1, region, maxOffsetForThisArm);

                    points.push(point);
                    this.regions[region].points.push(point);
                }

                for (var j = 0; j < amountForThisCenter; j++) {
                    var point = makePoint(0, centerThreshhold, "center", armOffsetMax);
                    points.push(point);
                    this.regions["center"].points.push(point);
                }

                currentArmIsFiller = !currentArmIsFiller;
            }

            return points;
        };
        MapGen.prototype.triangulate = function () {
            if (!this.points || this.points.length < 3)
                throw new Error();
            var triangulationData = Rance.triangulate(this.points);
            this.triangles = this.cleanTriangles(triangulationData.triangles, triangulationData.superTriangle);

            this.makeLinks();
        };
        MapGen.prototype.clearLinks = function () {
            for (var i = 0; i < this.points.length; i++) {
                this.points[i].clearLinks();
            }
        };
        MapGen.prototype.makeLinks = function () {
            if (!this.triangles || this.triangles.length < 1)
                throw new Error();

            this.clearLinks();

            for (var i = 0; i < this.triangles.length; i++) {
                var edges = this.triangles[i].getEdges();
                for (var j = 0; j < edges.length; j++) {
                    edges[j][0].addLink(edges[j][1]);
                }
            }
        };
        MapGen.prototype.severArmLinks = function () {
            for (var i = 0; i < this.points.length; i++) {
                var star = this.points[i];
                star.severLinksToFiller();
                star.severLinksToNonAdjacent();

                if (star.distance > 0.8) {
                    star.severLinksToNonCenter();
                }
            }
        };
        MapGen.prototype.makeVoronoi = function () {
            if (!this.points || this.points.length < 3)
                throw new Error();

            var boundingBox = {
                xl: 0,
                xr: this.maxWidth * 2,
                yt: 0,
                yb: this.maxHeight * 2
            };

            var voronoi = new Voronoi();

            var diagram = voronoi.compute(this.points, boundingBox);

            this.voronoiDiagram = diagram;

            for (var i = 0; i < diagram.cells.length; i++) {
                var cell = diagram.cells[i];
                cell.site.voronoiCell = cell;
                cell.site.voronoiCell.vertices = this.getVerticesFromCell(cell);
            }
        };
        MapGen.prototype.cleanTriangles = function (triangles, superTriangle) {
            for (var i = triangles.length - 1; i >= 0; i--) {
                if (triangles[i].getAmountOfSharedVerticesWith(superTriangle)) {
                    triangles.splice(i, 1);
                }
            }

            return triangles;
        };
        MapGen.prototype.getVerticesFromCell = function (cell) {
            var vertices = [];

            for (var i = 0; i < cell.halfedges.length; i++) {
                vertices.push(cell.halfedges[i].getStartpoint());
            }

            return vertices;
        };
        MapGen.prototype.relaxPointsOnce = function (dampeningFactor) {
            if (typeof dampeningFactor === "undefined") { dampeningFactor = 0; }
            var relaxedPoints = [];

            for (var i = 0; i < this.voronoiDiagram.cells.length; i++) {
                var cell = this.voronoiDiagram.cells[i];
                var point = cell.site;
                var vertices = this.getVerticesFromCell(cell);
                var centroid = Rance.getCentroid(vertices);
                var timesToDampen = point.distance * dampeningFactor;

                for (var j = 0; j < timesToDampen; j++) {
                    centroid.x = (centroid.x + point.x) / 2;
                    centroid.y = (centroid.y + point.y) / 2;
                }

                point.setPosition(centroid.x, centroid.y);
            }
        };
        MapGen.prototype.relaxPoints = function (options) {
            if (!this.points)
                throw new Error();

            if (!this.voronoiDiagram)
                this.makeVoronoi();

            for (var i = 0; i < options.timesToRelax; i++) {
                this.relaxPointsOnce(options.dampeningFactor);
                this.makeVoronoi();
            }
        };
        MapGen.prototype.getNonFillerPoints = function () {
            if (!this.points)
                return [];
            if (!this.nonFillerPoints || this.nonFillerPoints.length <= 0) {
                this.nonFillerPoints = this.points.filter(function (point) {
                    return point.region.indexOf("filler") < 0;
                });
            }

            return this.nonFillerPoints;
        };
        MapGen.prototype.getNonFillerVoronoiLines = function () {
            if (!this.voronoiDiagram)
                return [];
            if (!this.nonFillerVoronoiLines || this.nonFillerVoronoiLines.length <= 0) {
                this.nonFillerVoronoiLines = this.voronoiDiagram.edges.filter(function (edge) {
                    var adjacentSites = [edge.lSite, edge.rSite];
                    var adjacentFillerSites = 0;
                    var maxAllowedFillerSites = 2;

                    for (var i = 0; i < adjacentSites.length; i++) {
                        var site = adjacentSites[i];

                        if (!site) {
                            // draw all border edges
                            return true;

                            // draw all non filler border edges
                            maxAllowedFillerSites--;
                            if (adjacentFillerSites >= maxAllowedFillerSites) {
                                return false;
                            }
                            continue;
                        }
                        ;

                        if (site.region.indexOf("filler") >= 0) {
                            adjacentFillerSites++;
                            if (adjacentFillerSites >= maxAllowedFillerSites) {
                                return false;
                            }
                        }
                    }

                    return true;
                });
            }

            return this.nonFillerVoronoiLines;
        };
        MapGen.prototype.drawMap = function () {
            function vectorToPoint(vector) {
                return new PIXI.Point(vector[0], vector[1]);
            }

            var minBound = Math.min(this.maxWidth, this.maxHeight);
            var minBound2 = minBound / 2;

            var doc = new PIXI.DisplayObjectContainer();

            // VORONOI POLYS
            // if (this.voronoiDiagram)
            // {
            //   for (var i = 0; i < this.voronoiDiagram.cells.length; i++)
            //   {
            //     var cell = this.voronoiDiagram.cells[i];
            //     var cellVertices = this.getVerticesFromCell(cell);
            //     var poly = new PIXI.Polygon(cellVertices);
            //     var polyGfx: any = new PIXI.Graphics();
            //     polyGfx.interactive = true;
            //     polyGfx.lineStyle(6, 0xFF0000, 1);
            //     polyGfx.beginFill(0x0000FF, 0.3);
            //     polyGfx.drawShape(poly);
            //     polyGfx.endFill();
            //     polyGfx.cell = cell;
            //     polyGfx.rightclick = function()
            //     {
            //       console.log(this.cell)
            //     }
            //     polyGfx.mouseover = function()
            //     {
            //       this.position.y -= 10
            //     }
            //     polyGfx.mouseout = function()
            //     {
            //       this.position.y += 10
            //     }
            //     doc.addChild(polyGfx);
            //   }
            // }
            var gfx = new PIXI.Graphics();
            doc.addChild(gfx);

            // VORONOI LINES
            gfx.lineStyle(1, 0xFF0000, 1);

            var voronoiLines = this.getNonFillerVoronoiLines();

            for (var i = 0; i < voronoiLines.length; i++) {
                var line = voronoiLines[i];
                gfx.moveTo(line.va.x, line.va.y);
                gfx.lineTo(line.vb.x, line.vb.y);
            }

            gfx.lineStyle(3, 0x000000, 1);

            for (var i = 0; i < this.points.length; i++) {
                var star = this.points[i];
                var links = star.linksTo;

                for (var j = 0; j < links.length; j++) {
                    gfx.moveTo(star.x, star.y);
                    gfx.lineTo(star.linksTo[j].x, star.linksTo[j].y);
                }
            }

            // STARS
            var points = this.getNonFillerPoints();

            for (var i = 0; i < points.length; i++) {
                var fillColor = 0xFF0000;
                if (points[i].region == "center") {
                    fillColor = 0x00FF00;
                } else if (points[i].region.indexOf("filler") >= 0) {
                    fillColor = 0x0000FF;
                }
                ;

                gfx.beginFill(fillColor);
                gfx.drawEllipse(points[i].x, points[i].y, 6, 6);
                gfx.endFill();
            }

            // height is defined as a getter and somehow gets set to 0
            // if its not uselessly referenced here
            doc.height;

            this.drawnMap = doc;
            return doc;
        };
        return MapGen;
    })();
    Rance.MapGen = MapGen;
})(Rance || (Rance = {}));
/// <reference path="../lib/pixi.d.ts" />
/// <reference path="eventmanager.ts"/>
/// <reference path="utility.ts"/>
/// <reference path="color.ts"/>
/// <reference path="galaxymap.ts" />
/// <reference path="star.ts" />
/// <reference path="fleet.ts" />
var Rance;
(function (Rance) {
    var MapRenderer = (function () {
        function MapRenderer() {
            this.occupationShaders = {};
            this.layers = {};
            this.mapModes = {};
            this.TextureCache = {};
            this.container = new PIXI.DisplayObjectContainer();

            this.initLayers();
            this.initMapModes();

            this.addEventListeners();
        }
        MapRenderer.prototype.addEventListeners = function () {
            Rance.eventManager.addEventListener("renderMap", this.render.bind(this));

            renderer.camera.onMove = this.updateShaderOffsets.bind(this);
            renderer.camera.onZoom = this.updateShaderZoom.bind(this);
        };
        MapRenderer.prototype.updateShaderOffsets = function (x, y) {
            for (var owner in this.occupationShaders) {
                for (var occupier in this.occupationShaders[owner]) {
                    var shader = this.occupationShaders[owner][occupier];
                    shader.uniforms.offset.value = { x: -x, y: y };
                }
            }
        };
        MapRenderer.prototype.updateShaderZoom = function (zoom) {
            for (var owner in this.occupationShaders) {
                for (var occupier in this.occupationShaders[owner]) {
                    var shader = this.occupationShaders[owner][occupier];
                    shader.uniforms.zoom.value = zoom;
                }
            }
        };
        MapRenderer.prototype.getOccupationShader = function (owner, occupier) {
            if (!this.occupationShaders[owner.id]) {
                this.occupationShaders[owner.id] = {};
            }

            if (!this.occupationShaders[owner.id][occupier.id]) {
                var baseColor = PIXI.hex2rgb(owner.color);
                baseColor.push(1.0);
                var occupierColor = PIXI.hex2rgb(occupier.color);
                occupierColor.push(1.0);

                var uniforms = {
                    baseColor: { type: "4fv", value: baseColor },
                    lineColor: { type: "4fv", value: occupierColor },
                    gapSize: { type: "1f", value: 3.0 },
                    offset: { type: "2f", value: { x: 0.0, y: 0.0 } },
                    zoom: { type: "1f", value: 1.0 }
                };

                var shaderSrc = [
                    "precision mediump float;",
                    "uniform sampler2D uSampler;",
                    "varying vec2 vTextureCoord;",
                    "varying vec4 vColor;",
                    "uniform vec4 baseColor;",
                    "uniform vec4 lineColor;",
                    "uniform float gapSize;",
                    "uniform vec2 offset;",
                    "uniform float zoom;",
                    "void main( void )",
                    "{",
                    "  vec2 position = gl_FragCoord.xy + offset;",
                    "  position.x += position.y;",
                    "  float scaled = floor(position.x * 0.1 / zoom);",
                    "  float res = mod(scaled, gapSize);",
                    "  if(res > 0.0)",
                    "  {",
                    "    gl_FragColor = mix(gl_FragColor, baseColor, 0.5);",
                    "  }",
                    "  else",
                    "  {",
                    "    gl_FragColor = mix(gl_FragColor, lineColor, 0.5);",
                    "  }",
                    "}"
                ];

                this.occupationShaders[owner.id][occupier.id] = new PIXI.AbstractFilter(shaderSrc, uniforms);
            }

            return this.occupationShaders[owner.id][occupier.id];
        };
        MapRenderer.prototype.initLayers = function () {
            this.layers["nonFillerStars"] = {
                container: new PIXI.DisplayObjectContainer(),
                drawingFunction: function (map) {
                    var doc = new PIXI.DisplayObjectContainer();

                    var points = map.mapGen.getNonFillerPoints();

                    var mouseDownFN = function (event) {
                        Rance.eventManager.dispatchEvent("mouseDown", event);
                    };
                    var mouseUpFN = function (event) {
                        Rance.eventManager.dispatchEvent("mouseUp", event);
                    };
                    var onClickFN = function (star) {
                        Rance.eventManager.dispatchEvent("starClick", star);
                    };
                    var rightClickFN = function (star) {
                        Rance.eventManager.dispatchEvent("starRightClick", star);
                    };
                    for (var i = 0; i < points.length; i++) {
                        var gfx = new PIXI.Graphics();
                        gfx.star = points[i];
                        gfx.lineStyle(2, 0x222222, 1);
                        gfx.beginFill(0xFFFF00);
                        gfx.drawEllipse(points[i].x, points[i].y, 6, 6);
                        gfx.endFill;

                        gfx.interactive = true;
                        gfx.hitArea = new PIXI.Polygon(points[i].voronoiCell.vertices);
                        gfx.mousedown = mouseDownFN;
                        gfx.mouseup = mouseUpFN;
                        gfx.click = function (event) {
                            if (event.originalEvent.button !== 0)
                                return;

                            onClickFN(this.star);
                        }.bind(gfx);
                        gfx.rightclick = rightClickFN.bind(gfx, points[i]);

                        doc.addChild(gfx);
                    }

                    // gets set to 0 without this reference. no idea
                    doc.height;
                    return doc;
                }
            };
            this.layers["starOwners"] = {
                container: new PIXI.DisplayObjectContainer(),
                drawingFunction: function (map) {
                    var doc = new PIXI.DisplayObjectContainer();
                    var points = map.mapGen.getNonFillerPoints();

                    for (var i = 0; i < points.length; i++) {
                        var star = points[i];
                        if (!star.owner)
                            continue;

                        var poly = new PIXI.Polygon(star.voronoiCell.vertices);
                        var gfx = new PIXI.Graphics();
                        gfx.beginFill(star.owner.color, 0.5);
                        gfx.drawShape(poly);
                        gfx.endFill;
                        doc.addChild(gfx);

                        var occupier = star.getSecondaryController();
                        if (occupier) {
                            gfx.filters = [this.getOccupationShader(star.owner, occupier)];

                            //gfx.filters = [testFilter];
                            var mask = new PIXI.Graphics();
                            mask.beginFill();
                            mask.drawShape(poly);
                            mask.endFill();
                            gfx.mask = mask;
                            gfx.addChild(mask);
                        }
                    }
                    doc.height;
                    return doc;
                }
            };
            this.layers["starIncome"] = {
                container: new PIXI.DisplayObjectContainer(),
                drawingFunction: function (map) {
                    var doc = new PIXI.DisplayObjectContainer();
                    var points = map.mapGen.getNonFillerPoints();
                    var incomeBounds = map.getIncomeBounds();

                    function getRelativeValue(min, max, value) {
                        var difference = max - min;
                        if (difference < 1)
                            difference = 1;

                        // clamps to n different colors
                        var threshhold = difference / 10;
                        if (threshhold < 1)
                            threshhold = 1;
                        var relative = (Math.round(value / threshhold) * threshhold - min) / (difference);
                        return relative;
                    }

                    var colorIndexes = {};

                    function getRelativeColor(min, max, value) {
                        if (!colorIndexes[value]) {
                            if (value < 0)
                                value = 0;
                            else if (value > 1)
                                value = 1;

                            var deviation = Math.abs(0.5 - value) * 2;

                            var hue = 110 * value;
                            var saturation = 0.5 + 0.2 * deviation;
                            var lightness = 0.6 + 0.25 * deviation;

                            colorIndexes[value] = Rance.hslToHex(hue / 360, saturation, lightness / 2);
                        }
                        return colorIndexes[value];
                    }

                    for (var i = 0; i < points.length; i++) {
                        var star = points[i];
                        var income = star.getIncome();
                        var relativeIncome = getRelativeValue(incomeBounds.min, incomeBounds.max, income);
                        var color = getRelativeColor(incomeBounds.min, incomeBounds.max, relativeIncome);

                        var poly = new PIXI.Polygon(star.voronoiCell.vertices);
                        var gfx = new PIXI.Graphics();
                        gfx.beginFill(color, 0.6);
                        gfx.drawShape(poly);
                        gfx.endFill;
                        doc.addChild(gfx);
                    }
                    doc.height;
                    return doc;
                }
            };
            this.layers["nonFillerVoronoiLines"] = {
                container: new PIXI.DisplayObjectContainer(),
                drawingFunction: function (map) {
                    var doc = new PIXI.DisplayObjectContainer();

                    var gfx = new PIXI.Graphics();
                    doc.addChild(gfx);
                    gfx.lineStyle(1, 0xC0C0C0, 0.5);

                    var lines = map.mapGen.getNonFillerVoronoiLines();

                    for (var i = 0; i < lines.length; i++) {
                        var line = lines[i];
                        gfx.moveTo(line.va.x, line.va.y);
                        gfx.lineTo(line.vb.x, line.vb.y);
                    }

                    doc.height;
                    return doc;
                }
            };
            this.layers["ownerBorders"] = {
                container: new PIXI.DisplayObjectContainer(),
                drawingFunction: function (map) {
                    var doc = new PIXI.DisplayObjectContainer();
                    var gfx = new PIXI.Graphics();
                    doc.addChild(gfx);

                    gfx.lineStyle(4, player1.secondaryColor, 1);

                    /*
                    var edges = player1.getBorderPolygons()[0];
                    
                    var i = 0;
                    
                    var interval = window.setInterval(function()
                    {
                    var vertex = edges[i];
                    gfx.moveTo(vertex.x, vertex.y);
                    gfx.lineTo(edges[i + 1].x, edges[i + 1].y);
                    i++;
                    
                    if (i === edges.length - 2)
                    {
                    console.log(edges, i, edges[i +1])
                    gfx.beginFill(0xFF0000, 1);
                    gfx.drawEllipse(edges[i+1].x, edges[i+1].y, 10, 10);
                    gfx.endFill();
                    }
                    
                    if (i >= edges.length - 1) window.clearInterval(interval);
                    }, 500);
                    */
                    /*
                    var edges = player1.getBorderEdges()[0];
                    
                    var interval = window.setInterval(function()
                    {
                    var edge = edges.shift();
                    gfx.moveTo(edge.va.x, edge.va.y);
                    gfx.lineTo(edge.vb.x, edge.vb.y);
                    gfx.beginFill(0xFF0000, 0.5);
                    gfx.drawEllipse(edge.va.x, edge.va.y, 3, 3);
                    gfx.endFill();
                    if (edges.length < 1) window.clearInterval(interval);
                    }, 500);
                    */
                    var players = [player1];

                    for (var i = 0; i < players.length; i++) {
                        var player = players[i];
                        var polys = player.getBorderPolygons();

                        for (var j = 0; j < polys.length; j++) {
                            var poly = polys[j];
                            var inset = Rance.offsetPolygon(poly, -2);

                            gfx.lineStyle(4, player.secondaryColor, 1);
                            gfx.beginFill(0x000000, 0);
                            gfx.drawShape(new PIXI.Polygon(inset));
                            gfx.endFill;

                            gfx.lineStyle(4, 0x0000FF, 1);
                            gfx.beginFill(0x000000, 0);
                            gfx.drawShape(new PIXI.Polygon(poly));
                            gfx.endFill;
                        }
                    }

                    doc.height;
                    return doc;
                }
            };
            this.layers["starLinks"] = {
                container: new PIXI.DisplayObjectContainer(),
                drawingFunction: function (map) {
                    var doc = new PIXI.DisplayObjectContainer();

                    var gfx = new PIXI.Graphics();
                    doc.addChild(gfx);
                    gfx.lineStyle(2, 0xDDDDDD, 1);

                    var points = map.mapGen.getNonFillerPoints();

                    for (var i = 0; i < points.length; i++) {
                        var star = points[i];
                        var links = star.linksTo;

                        for (var j = 0; j < links.length; j++) {
                            gfx.moveTo(star.x, star.y);
                            gfx.lineTo(star.linksTo[j].x, star.linksTo[j].y);
                        }
                    }
                    doc.height;
                    return doc;
                }
            };
            this.layers["fleets"] = {
                container: new PIXI.DisplayObjectContainer(),
                drawingFunction: function (map) {
                    var doc = new PIXI.DisplayObjectContainer();
                    var stars = map.mapGen.getNonFillerPoints();

                    var mouseDownFN = function (event) {
                        Rance.eventManager.dispatchEvent("mouseDown", event);
                    };
                    var mouseUpFN = function (event) {
                        Rance.eventManager.dispatchEvent("mouseUp", event);
                    };

                    function fleetClickFn(fleet) {
                        Rance.eventManager.dispatchEvent("selectFleets", [fleet]);
                    }

                    function singleFleetDrawFN(fleet) {
                        var fleetContainer = new PIXI.DisplayObjectContainer();
                        var playerColor = fleet.player.color;

                        var text = new PIXI.Text(fleet.ships.length, {
                            //fill: "#" + playerColor.toString(16)
                            fill: "#FFFFFF",
                            stroke: "#000000",
                            strokeThickness: 3
                        });

                        var containerGfx = new PIXI.Graphics();
                        containerGfx.lineStyle(1, 0x00000, 1);
                        containerGfx.beginFill(playerColor, 0.7);
                        containerGfx.drawRect(0, 0, text.width + 4, text.height + 4);
                        containerGfx.endFill();

                        containerGfx.interactive = true;
                        containerGfx.click = fleetClickFn.bind(containerGfx, fleet);
                        containerGfx.mousedown = mouseDownFN;
                        containerGfx.mouseup = mouseUpFN;

                        containerGfx.addChild(text);
                        text.x += 2;
                        text.y += 2;
                        containerGfx.y -= 10;
                        fleetContainer.addChild(containerGfx);

                        return fleetContainer;
                    }

                    for (var i = 0; i < stars.length; i++) {
                        var star = stars[i];
                        var fleets = star.getAllFleets();
                        if (!fleets || fleets.length <= 0)
                            continue;

                        var fleetsContainer = new PIXI.DisplayObjectContainer();
                        fleetsContainer.x = star.x;
                        fleetsContainer.y = star.y - 30;
                        doc.addChild(fleetsContainer);

                        for (var j = 0; j < fleets.length; j++) {
                            var drawnFleet = singleFleetDrawFN(fleets[j]);
                            drawnFleet.position.x = fleetsContainer.width;
                            fleetsContainer.addChild(drawnFleet);
                        }

                        fleetsContainer.x -= fleetsContainer.width / 2;
                    }

                    doc.height;
                    return doc;
                }
            };
        };
        MapRenderer.prototype.initMapModes = function () {
            this.mapModes["default"] = {
                name: "default",
                layers: [
                    { layer: this.layers["starOwners"] },
                    { layer: this.layers["ownerBorders"] },
                    { layer: this.layers["nonFillerVoronoiLines"] },
                    { layer: this.layers["starLinks"] },
                    { layer: this.layers["nonFillerStars"] },
                    { layer: this.layers["fleets"] }
                ]
            };
            this.mapModes["noLines"] = {
                name: "noLines",
                layers: [
                    { layer: this.layers["starLinks"] },
                    { layer: this.layers["nonFillerStars"] },
                    { layer: this.layers["fleets"] }
                ]
            };
            this.mapModes["income"] = {
                name: "income",
                layers: [
                    { layer: this.layers["starIncome"] },
                    { layer: this.layers["nonFillerVoronoiLines"] },
                    { layer: this.layers["starLinks"] },
                    { layer: this.layers["nonFillerStars"] },
                    { layer: this.layers["fleets"] }
                ]
            };
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
        MapRenderer.prototype.drawLayer = function (layer) {
            layer.container.removeChildren();
            layer.container.addChild(layer.drawingFunction.call(this, this.galaxyMap));
        };
        MapRenderer.prototype.setMapMode = function (newMapMode) {
            if (!this.mapModes[newMapMode]) {
                throw new Error("Invalid mapmode");
                return;
            }

            if (this.currentMapMode && this.currentMapMode.name === newMapMode) {
                return;
            }

            this.currentMapMode = this.mapModes[newMapMode];

            this.resetContainer();
            this.render();
        };
        MapRenderer.prototype.render = function () {
            this.resetContainer();

            for (var i = 0; i < this.currentMapMode.layers.length; i++) {
                var layer = this.currentMapMode.layers[i].layer;

                this.drawLayer(layer);
                this.container.addChild(layer.container);
            }
        };
        return MapRenderer;
    })();
    Rance.MapRenderer = MapRenderer;
})(Rance || (Rance = {}));
/// <reference path="../lib/voronoi.d.ts" />
/// <reference path="star.ts" />
/// <reference path="mapgen.ts" />
/// <reference path="maprenderer.ts" />
var Rance;
(function (Rance) {
    var GalaxyMap = (function () {
        function GalaxyMap() {
        }
        GalaxyMap.prototype.setMapGen = function (mapGen) {
            this.mapGen = mapGen;

            this.stars = mapGen.points;
        };
        GalaxyMap.prototype.getIncomeBounds = function () {
            var min, max;

            for (var i = 0; i < this.mapGen.points.length; i++) {
                var star = this.mapGen.points[i];
                var income = star.getIncome();
                if (!min)
                    min = max = income;
                else {
                    if (income < min)
                        min = income;
                    else if (income > max)
                        max = income;
                }
            }

            return ({
                min: min,
                max: max
            });
        };
        return GalaxyMap;
    })();
    Rance.GalaxyMap = GalaxyMap;
})(Rance || (Rance = {}));
/// <reference path="../lib/pixi.d.ts" />
var Rance;
(function (Rance) {
    /**
    * @class Camera
    * @constructor
    */
    var Camera = (function () {
        /**
        * [constructor description]
        * @param {PIXI.DisplayObjectContainer} container [DOC the camera views and manipulates]
        * @param {number}                      bound     [How much of the container is allowed to leave the camera view.
        * 0.0 to 1.0]
        */
        function Camera(container, bound) {
            this.bounds = {};
            this.currZoom = 1;
            this.container = container;
            this.bounds.min = bound;
            this.bounds.max = Number((1 - bound).toFixed(1));
            var screenElement = window.getComputedStyle(document.getElementById("pixi-container"), null);
            this.screenWidth = parseInt(screenElement.width);
            this.screenHeight = parseInt(screenElement.height);

            this.addEventListeners();
            this.setBounds();
        }
        /**
        * @method addEventListeners
        * @private
        */
        Camera.prototype.addEventListeners = function () {
            var self = this;

            window.addEventListener("resize", function (e) {
                var container = document.getElementById("pixi-container");
                if (!container)
                    return;
                var style = window.getComputedStyle(container, null);
                self.screenWidth = parseInt(style.width);
                self.screenHeight = parseInt(style.height);
            }, false);

            Rance.eventManager.addEventListener("centerCameraAt", function (e) {
                self.centerOnPosition(e.data);
            });
        };

        /**
        * @method setBound
        * @private
        */
        Camera.prototype.setBounds = function () {
            var rect = this.container.getLocalBounds();
            this.width = this.screenWidth;
            this.height = this.screenHeight;
            this.bounds = {
                xMin: (this.width * this.bounds.min) - rect.width * this.container.scale.x,
                xMax: (this.width * this.bounds.max),
                yMin: (this.height * this.bounds.min) - rect.height * this.container.scale.y,
                yMax: (this.height * this.bounds.max),
                min: this.bounds.min,
                max: this.bounds.max
            };
        };

        /**
        * @method startScroll
        * @param {number[]} mousePos [description]
        */
        Camera.prototype.startScroll = function (mousePos) {
            this.setBounds();
            this.startClick = mousePos;
            this.startPos = [this.container.position.x, this.container.position.y];

            var ui = document.getElementsByClassName("galaxy-map-ui")[0];
            if (ui)
                ui.classList.add("prevent-pointer-events");

            var popups = document.getElementsByClassName("popup-container")[0];
            if (popups)
                popups.classList.add("prevent-pointer-events");
        };

        /**
        * @method end
        */
        Camera.prototype.end = function () {
            this.startPos = undefined;

            var ui = document.getElementsByClassName("galaxy-map-ui")[0];
            if (ui)
                ui.classList.remove("prevent-pointer-events");
            var popups = document.getElementsByClassName("popup-container")[0];
            if (popups)
                popups.classList.remove("prevent-pointer-events");
        };

        /**
        * @method getDelta
        * @param {number[]} currPos [description]
        */
        Camera.prototype.getDelta = function (currPos) {
            var x = this.startClick[0] - currPos[0];
            var y = this.startClick[1] - currPos[1];
            return [-x, -y];
        };

        /**
        * @method move
        * @param {number[]} currPos [description]
        */
        Camera.prototype.move = function (currPos) {
            var delta = this.getDelta(currPos);
            this.container.position.x = this.startPos[0] + delta[0];
            this.container.position.y = this.startPos[1] + delta[1];
            this.clampEdges();

            if (this.onMove) {
                this.onMove(this.container.position.x, this.container.position.y);
            }
        };
        Camera.prototype.getScreenCenter = function () {
            return ({
                x: this.width / 2,
                y: this.height / 2
            });
        };
        Camera.prototype.centerOnPosition = function (pos) {
            this.setBounds();
            var wt = this.container.worldTransform;

            var localPos = wt.apply(pos);
            var center = this.getScreenCenter();

            this.container.position.x += center.x - localPos.x;
            this.container.position.y += center.y - localPos.y;

            this.clampEdges();

            if (this.onMove) {
                this.onMove(this.container.position.x, this.container.position.y);
            }
        };

        /**
        * @method zoom
        * @param {number} zoomAmount [description]
        */
        Camera.prototype.zoom = function (zoomAmount) {
            if (zoomAmount > 1) {
                //zoomAmount = 1;
            }

            var container = this.container;
            var oldZoom = this.currZoom;

            var zoomDelta = oldZoom - zoomAmount;
            var rect = container.getLocalBounds();

            //these 2 get position of screen center in relation to the container
            //0: far left 1: far right
            var xRatio = 1 - ((container.x - this.screenWidth / 2) / rect.width / oldZoom + 1);
            var yRatio = 1 - ((container.y - this.screenHeight / 2) / rect.height / oldZoom + 1);

            var xDelta = rect.width * xRatio * zoomDelta;
            var yDelta = rect.height * yRatio * zoomDelta;
            container.position.x += xDelta;
            container.position.y += yDelta;
            container.scale.set(zoomAmount, zoomAmount);
            this.currZoom = zoomAmount;

            if (this.onMove) {
                this.onMove(this.container.position.x, this.container.position.y);
            }
            if (this.onZoom) {
                this.onZoom(this.currZoom);
            }
        };

        /**
        * @method deltaZoom
        * @param {number} delta [description]
        * @param {number} scale [description]
        */
        Camera.prototype.deltaZoom = function (delta, scale) {
            if (delta === 0) {
                return;
            }

            //var scaledDelta = absDelta + scale / absDelta;
            var direction = delta < 0 ? "out" : "in";
            var adjDelta = 1 + Math.abs(delta) * scale;
            if (direction === "out") {
                this.zoom(this.currZoom / adjDelta);
            } else {
                this.zoom(this.currZoom * adjDelta);
            }
        };

        /**
        * @method clampEdges
        * @private
        */
        Camera.prototype.clampEdges = function () {
            var x = this.container.position.x;
            var y = this.container.position.y;

            //horizontal
            //left edge
            if (x < this.bounds.xMin) {
                x = this.bounds.xMin;
            } else if (x > this.bounds.xMax) {
                x = this.bounds.xMax;
            }

            //vertical
            //top
            if (y < this.bounds.yMin) {
                y = this.bounds.yMin;
            } else if (y > this.bounds.yMax) {
                y = this.bounds.yMax;
            }

            this.container.position.set(x, y);
        };
        return Camera;
    })();
    Rance.Camera = Camera;
})(Rance || (Rance = {}));
/// <reference path="../lib/pixi.d.ts" />
/// <reference path="eventmanager.ts"/>
/// <reference path="point.ts" />
var Rance;
(function (Rance) {
    var RectangleSelect = (function () {
        function RectangleSelect(parentContainer) {
            this.parentContainer = parentContainer;
            this.graphics = new PIXI.Graphics();
            parentContainer.addChild(this.graphics);

            this.addEventListeners();
        }
        RectangleSelect.prototype.addEventListeners = function () {
            var self = this;

            Rance.eventManager.dispatchEvent("setRectangleSelectTargetFN", this);
        };

        RectangleSelect.prototype.startSelection = function (point) {
            this.selecting = true;
            this.start = point;
            this.current = point;

            var ui = document.getElementsByClassName("galaxy-map-ui")[0];
            if (ui)
                ui.classList.add("prevent-pointer-events");

            var popups = document.getElementsByClassName("popup-container")[0];
            if (popups)
                popups.classList.add("prevent-pointer-events");

            this.setSelectionTargets();
        };
        RectangleSelect.prototype.moveSelection = function (point) {
            this.current = point;
            this.drawSelectionRectangle();
        };
        RectangleSelect.prototype.endSelection = function (point) {
            this.selecting = false;
            var ui = document.getElementsByClassName("galaxy-map-ui")[0];
            if (ui)
                ui.classList.remove("prevent-pointer-events");
            var popups = document.getElementsByClassName("popup-container")[0];
            if (popups)
                popups.classList.remove("prevent-pointer-events");

            this.graphics.clear();

            var inSelection = this.getAllInSelection();
            Rance.eventManager.dispatchEvent("selectFleets", inSelection);

            this.start = null;
            this.current = null;
        };

        RectangleSelect.prototype.drawSelectionRectangle = function () {
            if (!this.current)
                return;

            var gfx = this.graphics;
            var bounds = this.getBounds();

            gfx.clear();
            gfx.lineStyle(1, 0xFFFFFF, 1);
            gfx.beginFill(0x000000, 0);
            gfx.drawRect(bounds.x1, bounds.y1, bounds.width, bounds.height);
            gfx.endFill();
        };
        RectangleSelect.prototype.setSelectionTargets = function () {
            if (!this.getSelectionTargetsFN)
                return;

            this.toSelectFrom = this.getSelectionTargetsFN();
        };
        RectangleSelect.prototype.getBounds = function () {
            var x1 = Math.min(this.start.x, this.current.x);
            var x2 = Math.max(this.start.x, this.current.x);
            var y1 = Math.min(this.start.y, this.current.y);
            var y2 = Math.max(this.start.y, this.current.y);

            return ({
                x1: x1,
                x2: x2,
                y1: y1,
                y2: y2,
                width: x2 - x1,
                height: y2 - y1
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
            var x = point.x;
            var y = point.y;

            var bounds = this.getBounds();

            return ((x >= bounds.x1 && x <= bounds.x2) && (y >= bounds.y1 && y <= bounds.y2));
        };
        return RectangleSelect;
    })();
    Rance.RectangleSelect = RectangleSelect;
})(Rance || (Rance = {}));
/// <reference path="fleet.ts"/>
/// <reference path="camera.ts"/>
/// <reference path="renderer.ts"/>
/// <reference path="rectangleselect.ts"/>
var Rance;
(function (Rance) {
    var MouseEventHandler = (function () {
        function MouseEventHandler(renderer, camera) {
            this.preventingGhost = false;
            this.renderer = renderer;
            this.camera = camera;
            this.rectangleselect = new Rance.RectangleSelect(renderer.layers["select"]);
            this.currAction = undefined;

            window.oncontextmenu = function (event) {
                var eventTarget = event.target;
                if (eventTarget.localName !== "canvas")
                    return;
                event.preventDefault();
                event.stopPropagation();
            };

            this.addEventListeners();
        }
        MouseEventHandler.prototype.addEventListeners = function () {
            var self = this;

            var _canvas = document.getElementById("pixi-container");
            _canvas.addEventListener("DOMMouseScroll", function (e) {
                if (e.target.localName !== "canvas")
                    return;
                self.camera.deltaZoom(-e.detail, 0.05);
            });
            _canvas.addEventListener("mousewheel", function (e) {
                if (e.target.localName !== "canvas")
                    return;
                self.camera.deltaZoom(e.wheelDelta / 40, 0.05);
            });
            _canvas.addEventListener("mouseout", function (e) {
                if (e.target.localName !== "canvas")
                    return;
            });

            Rance.eventManager.addEventListener("mouseDown", function (e) {
                self.mouseDown(e.content, "world");
            });
            Rance.eventManager.addEventListener("mouseUp", function (e) {
                self.mouseUp(e.content, "world");
            });
        };
        MouseEventHandler.prototype.preventGhost = function (delay) {
            this.preventingGhost = true;
            var self = this;
            var timeout = window.setTimeout(function () {
                self.preventingGhost = false;
                window.clearTimeout(timeout);
            }, delay);
        };
        MouseEventHandler.prototype.mouseDown = function (event, targetType) {
            if (targetType === "stage") {
                if (event.originalEvent.ctrlKey || event.originalEvent.metaKey || event.originalEvent.button === 1) {
                    this.startScroll(event);
                }
            } else if (targetType === "world") {
                if (event.originalEvent.button === 0) {
                    this.startSelect(event);
                }
            }
        };

        MouseEventHandler.prototype.mouseMove = function (event, targetType) {
            if (targetType === "stage") {
                if (this.currAction === "scroll") {
                    this.scrollMove(event);
                } else if (this.currAction === "zoom") {
                    this.zoomMove(event);
                }
            } else {
                if (this.currAction === "select") {
                    this.dragSelect(event);
                }
            }
        };
        MouseEventHandler.prototype.mouseUp = function (event, targetType) {
            if (this.currAction === undefined)
                return;

            if (targetType === "stage") {
                if (this.currAction === "scroll") {
                    this.endScroll(event);
                    this.preventGhost(15);
                } else if (this.currAction === "zoom") {
                    this.endZoom(event);
                    this.preventGhost(15);
                }
            } else {
                if (this.currAction === "select") {
                    if (!this.preventingGhost)
                        this.endSelect(event);
                }
            }
        };

        MouseEventHandler.prototype.startScroll = function (event) {
            if (this.currAction === "select")
                this.stashedAction = "select";
            this.currAction = "scroll";
            this.startPoint = [event.global.x, event.global.y];
            this.camera.startScroll(this.startPoint);
        };
        MouseEventHandler.prototype.scrollMove = function (event) {
            this.camera.move([event.global.x, event.global.y]);
        };
        MouseEventHandler.prototype.endScroll = function (event) {
            this.camera.end();
            this.startPoint = undefined;
            this.currAction = this.stashedAction;
            this.stashedAction = undefined;
        };
        MouseEventHandler.prototype.zoomMove = function (event) {
            var delta = event.global.x + this.currPoint[1] - this.currPoint[0] - event.global.y;
            this.camera.deltaZoom(delta, 0.005);
            this.currPoint = [event.global.x, event.global.y];
        };
        MouseEventHandler.prototype.endZoom = function (event) {
            this.startPoint = undefined;
            this.currAction = this.stashedAction;
            this.stashedAction = undefined;
        };
        MouseEventHandler.prototype.startZoom = function (event) {
            if (this.currAction === "select")
                this.stashedAction = "select";
            this.currAction = "zoom";
            this.startPoint = this.currPoint = [event.global.x, event.global.y];
        };
        MouseEventHandler.prototype.startSelect = function (event) {
            this.currAction = "select";
            this.rectangleselect.startSelection(event.getLocalPosition(this.renderer.layers["main"]));
        };
        MouseEventHandler.prototype.dragSelect = function (event) {
            this.rectangleselect.moveSelection(event.getLocalPosition(this.renderer.layers["main"]));
        };
        MouseEventHandler.prototype.endSelect = function (event) {
            this.rectangleselect.endSelection(event.getLocalPosition(this.renderer.layers["main"]));
            this.currAction = undefined;
        };
        MouseEventHandler.prototype.hover = function (event) {
        };
        return MouseEventHandler;
    })();
    Rance.MouseEventHandler = MouseEventHandler;
})(Rance || (Rance = {}));
/// <reference path="../lib/pixi.d.ts" />
/// <reference path="camera.ts"/>
/// <reference path="mouseeventhandler.ts"/>
var Rance;
(function (Rance) {
    var Renderer = (function () {
        function Renderer() {
            this.layers = {};
            PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

            this.stage = new PIXI.Stage(0x101060);
        }
        Renderer.prototype.init = function () {
            if (!this.renderer) {
                var containerStyle = window.getComputedStyle(this.pixiContainer);
                this.renderer = PIXI.autoDetectRenderer(parseInt(containerStyle.width), parseInt(containerStyle.height), {
                    autoResize: false,
                    antialias: true
                });
            } else {
                this.removeRendererView();
            }

            this.initLayers();
            this.addCamera();

            this.addEventListeners();
        };
        Renderer.prototype.setContainer = function (element) {
            this.pixiContainer = element;
        };
        Renderer.prototype.removeRendererView = function () {
            this.renderer.view.parentNode.removeChild(this.renderer.view);
        };
        Renderer.prototype.bindRendererView = function () {
            this.pixiContainer.appendChild(this.renderer.view);
            this.renderer.view.setAttribute("id", "pixi-canvas");

            this.resize();
        };
        Renderer.prototype.initLayers = function () {
            this.stage.removeChildren();

            var _main = this.layers["main"] = new PIXI.DisplayObjectContainer();
            this.stage.addChild(_main);

            var _map = this.layers["map"] = new PIXI.DisplayObjectContainer();
            _main.addChild(_map);

            var _background = this.layers["background"] = new PIXI.DisplayObjectContainer();
            _map.addChild(_background);

            _background.filters = [testFilter];

            var _select = this.layers["select"] = new PIXI.DisplayObjectContainer();
            _main.addChild(_select);
        };
        Renderer.prototype.addCamera = function () {
            this.camera = new Rance.Camera(this.layers["main"], 0.5);
            this.mouseEventHandler = new Rance.MouseEventHandler(this, this.camera);
        };
        Renderer.prototype.addEventListeners = function () {
            var self = this;
            window.addEventListener("resize", this.resize.bind(this), false);

            this.stage.mousedown = this.stage.rightdown = this.stage.touchstart = function (event) {
                self.mouseEventHandler.mouseDown(event, "stage");
            };
            this.stage.mousemove = this.stage.touchmove = function (event) {
                self.mouseEventHandler.mouseMove(event, "stage");
            };
            this.stage.mouseup = this.stage.rightup = this.stage.touchend = function (event) {
                self.mouseEventHandler.mouseUp(event, "stage");
            };
            this.stage.mouseupoutside = this.stage.rightupoutside = this.stage.touchendoutside = function (event) {
                self.mouseEventHandler.mouseUp(event, "stage");
            };

            var main = this.layers["background"];
            main.interactive = true;

            main.hitArea = new PIXI.Rectangle(-10000, -10000, 20000, 20000);

            main.mousedown = main.rightdown = main.touchstart = function (event) {
                if (event.target !== main)
                    return;
                self.mouseEventHandler.mouseDown(event, "world");
            };
            main.mousemove = main.touchmove = function (event) {
                if (event.target !== main)
                    return;
                self.mouseEventHandler.mouseMove(event, "world");
            };
            main.mouseup = main.rightup = main.touchend = function (event) {
                if (event.target !== main)
                    return;
                self.mouseEventHandler.mouseUp(event, "world");
            };
            main.mouseupoutside = main.rightupoutside = main.touchendoutside = function (event) {
                if (event.target !== main)
                    return;
                self.mouseEventHandler.mouseUp(event, "world");
            };
        };
        Renderer.prototype.resize = function () {
            if (this.renderer && document.body.contains(this.renderer.view)) {
                var w = this.pixiContainer.offsetWidth;
                var h = this.pixiContainer.offsetHeight;
                this.renderer.resize(w, h);
                this.layers["background"].filterArea = new PIXI.Rectangle(0, 0, w, h);
            }
        };
        Renderer.prototype.render = function () {
            this.renderer.render(this.stage);
            uniformManager.updateTime();
            requestAnimFrame(this.render.bind(this));
        };
        return Renderer;
    })();
    Rance.Renderer = Renderer;
})(Rance || (Rance = {}));
/// <reference path="player.ts"/>
/// <reference path="playercontrol.ts"/>
/// <reference path="galaxymap.ts"/>
/// <reference path="eventmanager.ts"/>
var Rance;
(function (Rance) {
    var Game = (function () {
        function Game(map, players, humanPlayer) {
            this.galaxyMap = map;
            this.playerOrder = players;
            this.humanPlayer = humanPlayer;

            this.addEventListeners();
        }
        Game.prototype.addEventListeners = function () {
            var self = this;

            Rance.eventManager.addEventListener("endTurn", function (e) {
                self.endTurn();
            });
        };

        Game.prototype.endTurn = function () {
            this.setNextPlayer();
            this.processPlayerStartTurn(this.activePlayer);

            // TODO
            if (this.activePlayer !== this.humanPlayer) {
                this.endTurn();
            }

            Rance.eventManager.dispatchEvent("updateSelection", null);
        };
        Game.prototype.processPlayerStartTurn = function (player) {
            var resetShipMovementFN = function (ship) {
                ship.resetMovePoints();
            };

            player.forEachUnit(resetShipMovementFN);
            player.money += player.getIncome();
        };

        Game.prototype.setNextPlayer = function () {
            this.playerOrder.push(this.playerOrder.shift());

            this.activePlayer = this.playerOrder[0];
        };
        return Game;
    })();
    Rance.Game = Game;
})(Rance || (Rance = {}));
/// <reference path="../lib/pixi.d.ts" />
var Rance;
(function (Rance) {
    var Loader = (function () {
        function Loader(onLoaded) {
            this.loaded = {
                DOM: false,
                emblems: false
            };
            this.imageCache = {};
            this.onLoaded = onLoaded;
            PIXI.dontSayHello = true;
            this.startTime = new Date().getTime();

            this.loadDOM();
            this.loadEmblems();
        }
        Loader.prototype.spritesheetToDataURLs = function (sheetData, sheetImg) {
            var self = this;
            var frames = {};

            (function splitSpritesheetFN() {
                for (var sprite in sheetData.frames) {
                    var frame = sheetData.frames[sprite].frame;

                    var canvas = document.createElement("canvas");
                    canvas.width = frame.w;
                    canvas.height = frame.h;
                    var context = canvas.getContext("2d");

                    context.drawImage(sheetImg, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);

                    var image = new Image();
                    image.src = canvas.toDataURL();

                    frames[sprite] = image;
                }
            }());

            return frames;
        };
        Loader.prototype.loadDOM = function () {
            var self = this;
            if (document.readyState === "interactive" || document.readyState === "complete") {
                self.loaded.DOM = true;
                self.checkLoaded();
            } else {
                document.addEventListener('DOMContentLoaded', function () {
                    self.loaded.DOM = true;
                    self.checkLoaded();
                });
            }
        };
        Loader.prototype.loadEmblems = function () {
            var self = this;
            var loader = new PIXI.JsonLoader("img\/emblems\/sprites.json");
            loader.addEventListener("loaded", function (event) {
                var spriteImages = self.spritesheetToDataURLs(event.target.json, event.target.texture.source);
                self.imageCache["emblems"] = spriteImages;
                self.loaded.emblems = true;
                self.checkLoaded();
            });

            loader.load();
        };
        Loader.prototype.checkLoaded = function () {
            for (var prop in this.loaded) {
                if (!this.loaded[prop]) {
                    return;
                }
            }
            var elapsed = new Date().getTime() - this.startTime;
            console.log("Loaded in " + elapsed + " ms");
            this.onLoaded.call();
        };
        return Loader;
    })();
    Rance.Loader = Loader;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    var UniformManager = (function () {
        function UniformManager() {
            this.registeredObjects = {};
            this.timeCount = 0;
        }
        UniformManager.prototype.registerObject = function (uniformType, shader) {
            if (!this.registeredObjects[uniformType]) {
                this.registeredObjects[uniformType] = [];
            }

            this.registeredObjects[uniformType].push(shader);
        };

        UniformManager.prototype.updateTime = function () {
            this.timeCount += 0.01;

            if (!this.registeredObjects["time"])
                return;

            for (var i = 0; i < this.registeredObjects["time"].length; i++) {
                this.registeredObjects["time"][i].uniforms.time.value = this.timeCount;
            }
        };
        return UniformManager;
    })();
    Rance.UniformManager = UniformManager;
})(Rance || (Rance = {}));
/// <reference path="reactui/reactui.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="player.ts"/>
/// <reference path="playercontrol.ts"/>
/// <reference path="battleprep.ts"/>
/// <reference path="mapgen.ts"/>
/// <reference path="galaxymap.ts"/>
/// <reference path="renderer.ts"/>
/// <reference path="game.ts"/>
/// <reference path="loader.ts"/>
/// <reference path="shaders/uniformmanager.ts"/>
var player1, player2, battle, battlePrep, game, reactUI, renderer, mapGen, galaxyMap, mapRenderer, playerControl;
var uniforms, testFilter, uniformManager;

var Rance;
(function (Rance) {
    Rance.images;
    Rance.loader = new Rance.Loader(function () {
        init();
    });

    function init() {
        Rance.images = Rance.loader.imageCache;

        player1 = new Rance.Player();

        //player1.color = 0xC02020;
        player1.makeFlag();
        player2 = new Rance.Player();

        //player2.color = 0x2020C0;
        player2.makeFlag();

        function setupFleetAndPlayer(player) {
            for (var i = 0; i < 8; i++) {
                var unit = Rance.makeRandomShip();
                player.addUnit(unit);
            }
        }

        setupFleetAndPlayer(player1);
        setupFleetAndPlayer(player2);

        uniforms = {
            bgColor: { type: "3fv", value: PIXI.hex2rgb(0x101040) },
            time: { type: "1f", value: 0.0 }
        };

        var shaderSrc = [
            "precision mediump float;",
            "uniform vec3 bgColor;",
            "uniform float time;",
            "float density = 0.005;",
            "float rand(vec2 p)",
            "{",
            "  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));",
            "}",
            "void main(void)",
            "{",
            "  vec2 pos = floor(gl_FragCoord.xy);",
            "  float color = 0.0;",
            "  float starGenValue = rand(gl_FragCoord.xy);",
            "  ",
            "  if (starGenValue < density)",
            "  {",
            "    float r = rand(gl_FragCoord.xy + vec2(4.20, 6.9));",
            "    color = r * (0.1 * sin(time * (r * 5.0) + 720.0 * r) + 0.75);",
            "    gl_FragColor = vec4(vec3(color), 1.0);",
            "  }",
            "  else",
            "  {",
            "    gl_FragColor = vec4(bgColor, 1.0);",
            "  }",
            "}"
        ];

        testFilter = new PIXI.AbstractFilter(shaderSrc, uniforms);

        uniformManager = new Rance.UniformManager();
        uniformManager.registerObject("time", testFilter);

        reactUI = new Rance.ReactUI(document.getElementById("react-container"));

        reactUI.player = player1;

        renderer = new Rance.Renderer();
        reactUI.renderer = renderer;

        mapGen = new Rance.MapGen();
        reactUI.mapGen = mapGen;

        galaxyMap = new Rance.GalaxyMap();
        galaxyMap.setMapGen(mapGen);
        reactUI.galaxyMap = galaxyMap;

        playerControl = new Rance.PlayerControl(player1);
        reactUI.playerControl = playerControl;

        game = new Rance.Game(galaxyMap, [player1, player2], player1);

        reactUI.currentScene = "galaxyMap";
        reactUI.render();
    }
    ;
})(Rance || (Rance = {}));
//# sourceMappingURL=main.js.map
