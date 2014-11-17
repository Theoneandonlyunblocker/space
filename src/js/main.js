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
                    }
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
                        this.setState({
                            dragging: true,
                            dragPos: {
                                width: parseInt(this.DOMNode.offsetWidth),
                                height: parseInt(this.DOMNode.offsetHeight)
                            }
                        });

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
                        width: this.state.dragPos.width,
                        height: this.state.dragPos.height
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
                this.setState({
                    dragging: false,
                    dragOffset: {
                        x: 0,
                        y: 0
                    },
                    originPosition: {
                        x: 0,
                        y: 0
                    }
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
                this.containerElement = this.props.containerElement || document.body;
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

                var activeTargets = Rance.getTargetsForAllAbilities(battle, battle.activeUnit);

                var abilityTooltip = null;

                if (this.state.hoveredUnit && activeTargets[this.state.hoveredUnit.id]) {
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

                return (React.DOM.div({ className: "battle-container" }, Rance.UIComponents.TurnOrder({
                    turnOrder: battle.turnOrder,
                    unitsBySide: battle.unitsBySide,
                    potentialDelay: this.state.potentialDelay,
                    hoveredUnit: this.state.hoveredUnit,
                    onMouseEnterUnit: this.handleMouseEnterUnit,
                    onMouseLeaveUnit: this.handleMouseLeaveUnit
                }), React.DOM.div({ className: "fleets-container" }, Rance.UIComponents.Fleet({
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
                }), abilityTooltip)));
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

                this.handleSelectRow(this.props.sortedItems[0]);

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
                    tabIndex: 1
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
                    onTouchStart: this.props.handleClick,
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
                    units: this.props.battlePrep.player.units,
                    selectedUnits: this.props.battlePrep.alreadyPlaced,
                    onDragStart: this.handleDragStart,
                    onDragEnd: this.handleDragEnd
                }), React.DOM.button({
                    className: "start-battle",
                    onClick: function () {
                        var _ = window;

                        _.battle = this.props.battlePrep.makeBattle(_.fleet2);
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
                return (React.DOM.div(null, React.DOM.div({
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
/// <reference path="../lib/pixi.d.ts" />
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
                targetingFunction: Rance.targetColumnNeighbors,
                targetRange: "close",
                effect: function (user, target) {
                    target.removeStrength(100);
                }
            };
            Abilities.wholeRowAttack = {
                name: "wholeRowAttack",
                moveDelay: 300,
                actionsUse: 1,
                targetFleets: "all",
                targetingFunction: Rance.targetRow,
                targetRange: "all",
                effect: function (user, target) {
                    target.removeStrength(100);
                }
            };

            Abilities.bombAttack = {
                name: "bombAttack",
                moveDelay: 120,
                actionsUse: 1,
                targetFleets: "enemy",
                targetingFunction: Rance.targetNeighbors,
                targetRange: "all",
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
                    Rance.Templates.Abilities.closeAttack,
                    Rance.Templates.Abilities.standBy
                ]
            };
            ShipTypes.bomberSquadron = {
                typeName: "Bomber Squadron",
                isSquadron: true,
                icon: "img\/icons\/f.png",
                maxStrength: 0.5,
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
                    Rance.Templates.Abilities.wholeRowAttack,
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
/// <reference path="../data/templates/typetemplates.ts" />
/// <reference path="../data/templates/abilitytemplates.ts" />
/// <reference path="utility.ts"/>
/// <reference path="ability.ts"/>
/// <reference path="battle.ts"/>
/// <reference path="battle.ts"/>
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
        Unit.prototype.isTargetable = function () {
            return this.currentStrength > 0;
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

            return attackStat * attackFactor;
        };
        Unit.prototype.getDamageReduction = function (damageType) {
            var defensiveStat, defenceFactor;

            switch (damageType) {
                case "physical": {
                    defensiveStat = this.attributes.defence;
                    defenceFactor = 0.08;
                    break;
                }
                case "magical": {
                    defensiveStat = this.attributes.intelligence;
                    defenceFactor = 0.07;
                    break;
                }
            }

            return defensiveStat * defenceFactor;
        };
        Unit.prototype.addToFleet = function (fleet) {
            this.fleet = fleet;
        };
        Unit.prototype.removeFromFleet = function () {
            this.fleet = null;
        };
        return Unit;
    })();
    Rance.Unit = Unit;
})(Rance || (Rance = {}));
/// <reference path="player.ts" />
/// <reference path="unit.ts" />
/// <reference path="star.ts" />
var Rance;
(function (Rance) {
    var Fleet = (function () {
        function Fleet(player, ships, location) {
            this.player = player;
            this.ships = ships;
            this.location = location;

            this.location.addFleet(this);
            this.player.addFleet(this);
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
        Fleet.prototype.split = function (newShips) {
            this.removeShips(newShips);

            var newFleet = new Fleet(this.player, newShips, this.location);
            this.location.addFleet(newFleet);

            return newFleet;
        };
        Fleet.prototype.move = function (newLocation) {
            var oldLocation = this.location;
            oldLocation.removeFleet(this);

            this.location = newLocation;
            newLocation.addFleet(this);
        };
        return Fleet;
    })();
    Rance.Fleet = Fleet;
})(Rance || (Rance = {}));
/// <reference path="unit.ts"/>
/// <reference path="fleet.ts"/>
/// <reference path="utility.ts"/>
var Rance;
(function (Rance) {
    var idGenerators = idGenerators || {};
    idGenerators.player = idGenerators.player || 0;

    var Player = (function () {
        function Player(id) {
            this.units = {};
            this.fleets = [];
            this.id = isFinite(id) ? id : idGenerators.player++;
        }
        Player.prototype.addUnit = function (unit) {
            this.units[unit.id] = unit;
        };
        Player.prototype.getAllUnits = function () {
            var allUnits = [];
            for (var unitId in this.units) {
                allUnits.push(this.units[unitId]);
            }
            return allUnits;
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
        return Player;
    })();
    Rance.Player = Player;
})(Rance || (Rance = {}));
/// <reference path="point.ts" />
/// <reference path="player.ts" />
/// <reference path="fleet.ts" />
var Rance;
(function (Rance) {
    var idGenerators = idGenerators || {};
    idGenerators.star = idGenerators.star || 0;

    var Star = (function () {
        function Star(x, y, id) {
            this.linksTo = [];
            this.linksFrom = [];
            this.fleets = {};
            this.id = isFinite(id) ? id : idGenerators.star++;

            this.x = x;
            this.y = y;
        }
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
/// <reference path="../../eventmanager.ts"/>
/// <reference path="../../star.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.FleetInfo = React.createClass({
            render: function () {
                var fleet = this.props.fleet;
                return (React.DOM.div({
                    className: "fleet-info"
                }, React.DOM.div(null, "owner: " + fleet.owner.id), Rance.UIComponents.UnitList({
                    units: fleet.ships
                })));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../../eventmanager.ts"/>
/// <reference path="../../star.ts"/>
/// <reference path="fleetinfo.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.StarInfo = React.createClass({
            getInitialState: function () {
                return ({
                    currentStar: null
                });
            },
            componentWillMount: function () {
                var self = this;
                Rance.eventManager.addEventListener("starClick", function (event) {
                    self.setStar(event.data.star);
                });
            },
            setStar: function (star) {
                this.setState({
                    currentStar: star
                });
            },
            render: function () {
                var star = this.state.currentStar;

                var toRender = [];

                if (star) {
                    toRender.push(React.DOM.div({
                        key: "id"
                    }, React.DOM.div(null, "id: " + star.id), React.DOM.div(null, "pos: " + star.x.toFixed() + ", " + star.y.toFixed())));

                    var fleets = star.getAllFleets();

                    if (fleets.length > 0) {
                        toRender.push(Rance.UIComponents.FleetInfo({
                            key: "fleetInfo",
                            fleet: fleets[0]
                        }));
                    }
                }

                return (React.DOM.div({
                    className: "star-info"
                }, toRender));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../mapgen/mapgencontrols.ts"/>
/// <reference path="starinfo.ts"/>
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
                return (React.DOM.div(null, React.DOM.div({
                    ref: "pixiContainer",
                    id: "pixi-container"
                }), Rance.UIComponents.MapGenControls({
                    mapGen: this.props.galaxyMap.mapGen,
                    renderMap: this.renderMap
                }), React.DOM.select({
                    className: "reactui-selector",
                    ref: "mapModeSelector",
                    onChange: this.switchMapMode
                }, React.DOM.option({ value: "default" }, "default"), React.DOM.option({ value: "noLines" }, "no borders")), Rance.UIComponents.StarInfo()));
            },
            componentDidMount: function () {
                this.props.renderer.setContainer(this.refs.pixiContainer.getDOMNode());
                this.props.renderer.init();
                this.props.renderer.bindRendererView();

                var mapRenderer = new Rance.MapRenderer();
                mapRenderer.setParent(renderer.layers["map"]);
                this.props.galaxyMap.mapRenderer = mapRenderer;
                mapRenderer.galaxyMap = galaxyMap;

                this.props.galaxyMap.mapRenderer.setMapMode("default");

                this.props.renderer.render();
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
                            key: "galaxyMap"
                        }));
                        break;
                    }
                }
                return (React.DOM.div({ className: "react-stage" }, elementsToRender, React.DOM.select({
                    className: "reactui-selector",
                    ref: "sceneSelector",
                    value: this.props.sceneToRender,
                    onChange: this.changeScene
                }, React.DOM.option({ value: "mapGen" }, "map generation"), React.DOM.option({ value: "galaxyMap" }, "map"), React.DOM.option({ value: "battlePrep" }, "battle setup"), React.DOM.option({ value: "battle" }, "battle"))));
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
        function ReactUI(container) {
            this.container = container;
        }
        ReactUI.prototype.switchScene = function (newScene) {
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
                galaxyMap: this.galaxyMap
            }), this.container);
        };
        return ReactUI;
    })();
    Rance.ReactUI = ReactUI;
})(Rance || (Rance = {}));
/// <reference path="eventmanager.ts"/>
/// <reference path="player.ts"/>
/// <reference path="fleet.ts"/>
var Rance;
(function (Rance) {
    var PlayerControl = (function () {
        function PlayerControl(player) {
            this.selectedFleets = [];
            this.player = player;
            this.addEventListeners();
        }
        PlayerControl.prototype.addEventListeners = function () {
            var self = this;

            Rance.eventManager.addEventListener("selectFleets", function (e) {
                self.selectedFleets = e.data;
                console.log(self.selectedFleets);
            });

            Rance.eventManager.addEventListener("setRectangleSelectTargetFN", function (e) {
                e.data.getSelectionTargetsFN = self.player.getFleetsWithPositions.bind(self.player);
            });
        };
        return PlayerControl;
    })();
    Rance.PlayerControl = PlayerControl;
})(Rance || (Rance = {}));
/// <reference path="unit.ts"/>
/// <reference path="player.ts"/>
/// <reference path="battle.ts"/>
var Rance;
(function (Rance) {
    var BattlePrep = (function () {
        function BattlePrep(player) {
            this.alreadyPlaced = {};
            this.player = player;
            this.fleet = [
                [null, null, null, null],
                [null, null, null, null]
            ];
        }
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

        BattlePrep.prototype.makeBattle = function (fleet2) {
            var battle = new Rance.Battle({
                side1: this.fleet,
                side2: fleet2
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
                diagram.cells[i].site.voronoiCell = diagram.cells[i];
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
/// <reference path="galaxymap.ts" />
/// <reference path="star.ts" />
/// <reference path="fleet.ts" />
var Rance;
(function (Rance) {
    var MapRenderer = (function () {
        function MapRenderer() {
            this.layers = {};
            this.mapModes = {};
            this.TextureCache = {};
            this.container = new PIXI.DisplayObjectContainer();

            this.initLayers();
            this.initMapModes();
        }
        MapRenderer.prototype.initLayers = function () {
            this.layers["nonFillerStars"] = {
                container: new PIXI.DisplayObjectContainer(),
                drawingFunction: function (map) {
                    var doc = new PIXI.DisplayObjectContainer();

                    var points = map.mapGen.getNonFillerPoints();

                    var onClickFN = function (star) {
                        Rance.eventManager.dispatchEvent("starClick", {
                            star: star
                        });
                    };
                    for (var i = 0; i < points.length; i++) {
                        var gfx = new PIXI.Graphics();
                        gfx.lineStyle(3, 0x00000, 1);
                        gfx.beginFill(0xFFFFFF);
                        gfx.drawEllipse(points[i].x, points[i].y, 6, 6);
                        gfx.endFill;

                        gfx.interactive = true;
                        gfx.click = onClickFN.bind(gfx, points[i]);

                        doc.addChild(gfx);
                    }

                    // gets set to 0 without this reference. no idea
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
                    gfx.lineStyle(1, 0xFF000, 1);

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
            this.layers["starLinks"] = {
                container: new PIXI.DisplayObjectContainer(),
                drawingFunction: function (map) {
                    var doc = new PIXI.DisplayObjectContainer();

                    var gfx = new PIXI.Graphics();
                    doc.addChild(gfx);
                    gfx.lineStyle(3, 0x00000, 1);

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

                    function singleFleetDrawFN(fleet) {
                        var fleetContainer = new PIXI.DisplayObjectContainer();
                        var playerColor = fleet.player.color;

                        var text = new PIXI.Text(fleet.ships.length, {
                            fill: "#" + playerColor.toString(16)
                        });

                        var containerGfx = new PIXI.Graphics();
                        containerGfx.lineStyle(1, 0x00000, 1);
                        containerGfx.beginFill(playerColor, 0.4);
                        containerGfx.drawRect(0, 0, text.width + 4, text.height + 4);
                        containerGfx.endFill();

                        containerGfx.addChild(text);
                        text.x += 2;
                        text.y += 2;
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
                    { layer: this.layers["nonFillerVoronoiLines"] },
                    { layer: this.layers["starLinks"] },
                    { layer: this.layers["nonFillerStars"] }
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
        GalaxyMap.prototype.addMapGen = function (mapGen) {
            this.mapGen = mapGen;

            this.stars = mapGen.points;
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
        };

        /**
        * @method end
        */
        Camera.prototype.end = function () {
            this.startPos = undefined;
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

            this.setSelectionTargets();
        };
        RectangleSelect.prototype.moveSelection = function (point) {
            this.current = point;
            this.drawSelectionRectangle();
        };
        RectangleSelect.prototype.endSelection = function (point) {
            this.selecting = false;

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
            gfx.beginFill(0x000000, 0.3);
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
            this.rectangleselect.startSelection(event.getLocalPosition(event.target));
        };
        MouseEventHandler.prototype.dragSelect = function (event) {
            this.rectangleselect.moveSelection(event.getLocalPosition(event.target));
        };
        MouseEventHandler.prototype.endSelect = function (event) {
            this.rectangleselect.endSelection(event.getLocalPosition(event.target));
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
        }
        Renderer.prototype.init = function () {
            PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

            this.stage = new PIXI.Stage(0xFFFF00);

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
        };
        Renderer.prototype.initLayers = function () {
            var _main = this.layers["main"] = new PIXI.DisplayObjectContainer();
            this.stage.addChild(_main);

            var _map = this.layers["map"] = new PIXI.DisplayObjectContainer();
            _main.addChild(_map);

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

            var main = this.layers["map"];
            main.interactive = true;

            main.hitArea = new PIXI.Rectangle(-10000, -10000, 20000, 20000);

            main.mousedown = main.rightdown = main.touchstart = function (event) {
                self.mouseEventHandler.mouseDown(event, "world");
            };
            main.mousemove = main.touchmove = function (event) {
                self.mouseEventHandler.mouseMove(event, "world");
            };
            main.mouseup = main.rightup = main.touchend = function (event) {
                self.mouseEventHandler.mouseUp(event, "world");
            };
            main.mouseupoutside = main.rightupoutside = main.touchendoutside = function (event) {
                self.mouseEventHandler.mouseUp(event, "world");
            };
        };
        Renderer.prototype.resize = function () {
            if (this.renderer) {
                this.renderer.resize(this.pixiContainer.offsetWidth, this.pixiContainer.offsetHeight);
            }
        };
        Renderer.prototype.render = function () {
            this.renderer.render(this.stage);
            requestAnimFrame(this.render.bind(this));
        };
        return Renderer;
    })();
    Rance.Renderer = Renderer;
})(Rance || (Rance = {}));
/// <reference path="reactui/reactui.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="battle.ts"/>
/// <reference path="ability.ts"/>
/// <reference path="player.ts"/>
/// <reference path="playercontrol.ts"/>
/// <reference path="battleprep.ts"/>
/// <reference path="mapgen.ts"/>
/// <reference path="galaxymap.ts"/>
/// <reference path="renderer.ts"/>
/// <reference path="renderer.ts"/>
var fleet1, fleet2, player1, player2, battle, battlePrep, reactUI, renderer, mapGen, galaxyMap, mapRenderer, playerControl;

var Rance;
(function (Rance) {
    document.addEventListener('DOMContentLoaded', function () {
        fleet1 = [];
        fleet2 = [];
        player1 = new Rance.Player();
        player1.color = 0xFF0000;
        player2 = new Rance.Player();
        player2.color = 0x0000FF;

        function setupFleetAndPlayer(fleet, player) {
            for (var i = 0; i < 2; i++) {
                var emptySlot = Rance.randInt(0, 3);
                var row = [];
                for (var j = 0; j < 4; j++) {
                    if (j === emptySlot) {
                        row.push(null);
                    } else {
                        var type = Rance.getRandomArrayItem(["fighterSquadron", "battleCruiser", "bomberSquadron"]);
                        var unit = new Rance.Unit(Rance.Templates.ShipTypes[type]);
                        row.push(unit);
                        player.addUnit(unit);
                    }
                }
                fleet.push(row);
            }
        }

        setupFleetAndPlayer(fleet1, player1);
        setupFleetAndPlayer(fleet2, player2);

        battlePrep = new Rance.BattlePrep(player1);

        reactUI = new Rance.ReactUI(document.getElementById("react-container"));
        reactUI.battlePrep = battlePrep;

        renderer = new Rance.Renderer();
        reactUI.renderer = renderer;

        mapGen = new Rance.MapGen();
        reactUI.mapGen = mapGen;

        galaxyMap = new Rance.GalaxyMap();
        galaxyMap.mapGen = mapGen;
        reactUI.galaxyMap = galaxyMap;

        playerControl = new Rance.PlayerControl(player1);

        reactUI.currentScene = "galaxyMap";
        reactUI.render();
    });
})(Rance || (Rance = {}));
//# sourceMappingURL=main.js.map
