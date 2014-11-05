var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.UnitStrength = React.createClass({
            makeSquadronInfo: function () {
                return (React.DOM.div({ className: "unit-strength-container" }, this.makeStrengthText()));
            },
            makeCapitalInfo: function () {
                var text = this.makeStrengthText();
                var bar = React.DOM.div({ className: "unit-strength-bar" }, null);

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
        UIComponents.UnitInfo = React.createClass({
            render: function () {
                var unit = this.props.unit;

                return (React.DOM.div("react-unit-info", React.DOM.div({ className: "react-unit-info-name" }, this.props.name), Rance.UIComponents.UnitStrength(this.props.strengthProps)));
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
                    className: "react-unit-icon",
                    src: this.props.icon
                };

                return (React.DOM.div("react-unit-icon-container", React.DOM.img(imageProps)));
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
            render: function () {
                var unit = this.props.unit;

                var infoProps = {
                    name: unit.name,
                    strengthProps: {
                        maxStrength: unit.maxStrength,
                        currentStrength: unit.currentStrength,
                        isSquadron: unit.isSquadron
                    }
                };

                return (React.DOM.div({ className: "react-unit-container" }, Rance.UIComponents.UnitIcon({ icon: unit.template.icon })));
            }
        });
    })(Rance.UIComponents || (Rance.UIComponents = {}));
    var UIComponents = Rance.UIComponents;
})(Rance || (Rance = {}));
/// <reference path="../../lib/react.d.ts" />
/// <reference path="unit/unit.ts"/>
var Rance;
(function (Rance) {
    (function (UIComponents) {
        UIComponents.Stage = React.createClass({
            render: function () {
                return (React.DOM.div({ className: "react-stage" }, Rance.UIComponents.Unit({
                    unit: this.props.unit
                })));
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
        function ReactUI(container, unit) {
            this.container = container;
            this.unit = unit;
            this.render();
        }
        ReactUI.prototype.render = function () {
            React.renderComponent(Rance.UIComponents.Stage({ unit: this.unit }), this.container);
        };
        return ReactUI;
    })();
    Rance.ReactUI = ReactUI;
})(Rance || (Rance = {}));
var Rance;
(function (Rance) {
    (function (Templates) {
        (function (ShipTypes) {
            ShipTypes.fighterSquadron = {
                typeName: "Fighter Squadron",
                isSquadron: true,
                icon: "img\/sprites\/f.png",
                maxStrength: 0.7,
                attributes: {
                    attack: 0.8,
                    defence: 0.6,
                    intelligence: 0.4,
                    speed: 1
                }
            };
            ShipTypes.battleCruiser = {
                typeName: "Battlecruiser",
                isSquadron: false,
                icon: "img\/sprites\/b.png",
                maxStrength: 1,
                attributes: {
                    attack: 0.8,
                    defence: 0.8,
                    intelligence: 0.7,
                    speed: 0.6
                }
            };
        })(Templates.ShipTypes || (Templates.ShipTypes = {}));
        var ShipTypes = Templates.ShipTypes;
    })(Rance.Templates || (Rance.Templates = {}));
    var Templates = Rance.Templates;
})(Rance || (Rance = {}));
/// <reference path="../data/templates/typetemplates.ts" />
var Rance;
(function (Rance) {
    var Unit = (function () {
        function Unit(template) {
            this.template = template;
            this.name = template.typeName;
            this.isSquadron = template.isSquadron;
            this.setValues();
        }
        Unit.prototype.setValues = function () {
            var template = this.template;

            this.maxStrength = template.maxStrength * 1000;
            this.currentStrength = this.maxStrength;
        };
        return Unit;
    })();
    Rance.Unit = Unit;
})(Rance || (Rance = {}));
/// <reference path="reactui/reactui.ts"/>
/// <reference path="unit.ts"/>
var unit, reactUI;
var Rance;
(function (Rance) {
    document.addEventListener('DOMContentLoaded', function () {
        unit = new Rance.Unit(Rance.Templates.ShipTypes.fighterSquadron);

        reactUI = new Rance.ReactUI(document.getElementById("react-container"), unit);
    });
})(Rance || (Rance = {}));
//# sourceMappingURL=main.js.map
