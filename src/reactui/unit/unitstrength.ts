module Rance
{
  export module UIComponents
  {
    export var UnitStrength = React.createClass(
    {
      displayName: "UnitStrength",
      makeSquadronInfo: function()
      {
        return(
          React.DOM.div({className: "unit-strength-container"},
            this.makeStrengthText()
          )
        );
      },
      makeCapitalInfo: function()
      {
        var text = this.makeStrengthText();
        var bar = React.DOM.progress(
          {
            className: "unit-strength-bar",
            max: this.props.maxStrength,
            value: this.props.currentStrength
          });

        return(
          React.DOM.div({className: "unit-strength-container"},
            text,
            bar
          )
        );
      },
      makeStrengthText: function()
      {
        var critThreshhold = 0.3;
        var currentStyle =
        {
          className: "unit-strength-current"
        };

        var healthRatio = this.props.currentStrength / this.props.maxStrength;

        if (healthRatio <= critThreshhold)
        {
          currentStyle.className += " critical";
        }
        else if (this.props.currentStrength < this.props.maxStrength)
        {
          currentStyle.className += " wounded";
        }

        var containerProps =
        {
          className: (this.props.isSquadron ? "unit-strength-amount" :
            "unit-strength-amount-capital")
        }

        return(
          React.DOM.div(containerProps,
            React.DOM.span(currentStyle, this.props.currentStrength),
            React.DOM.span({className: "unit-strength-max"},
              "/" + this.props.maxStrength)
          )
        )
      },
      render: function()
      {
        var toRender;
        if (this.props.isSquadron)
        {
          toRender = this.makeSquadronInfo();
        }
        else
        {
          toRender = this.makeCapitalInfo()
        }

        return(
          toRender
        );
      }
    });
  }
}