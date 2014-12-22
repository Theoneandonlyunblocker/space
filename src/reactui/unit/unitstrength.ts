module Rance
{
  export module UIComponents
  {
    export var UnitStrength = React.createClass(
    {
      displayName: "UnitStrength",
      getInitialState: function()
      {
        return(
        {
          displayedStrength: this.props.currentStrength
        });
      },
      componentWillReceiveProps: function(newProps: any)
      {
        if (newProps.currentStrength !== this.props.currentStrength)
        {
          this.animateDisplayedStrength(newProps.currentStrength, 500);
        }
      },
      updateDisplayStrength: function(newAmount: number)
      {
        this.setState(
        {
          displayedStrength: newAmount
        });
      },
      animateDisplayedStrength: function(newAmount: number, time: number)
      {
        var self = this;

        var animationDelay = 10;
        var ticks = Math.round(time / animationDelay);
        var difference = this.state.displayedStrength - newAmount;
        var singleTick = difference / ticks;

        this.animateDisplayedStrengthInterval = window.setInterval(function()
        {
          if (ticks <= 0)
          {
            window.clearInterval(self.animateDisplayedStrengthInterval);
            return;
          }

          var amountToSubstract = Math.min(difference, singleTick);

          ticks--;
          self.setState(
          {
            displayedStrength: self.state.displayedStrength - amountToSubstract
          });
        }, animationDelay)

      },
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

        var relativeHealth = this.state.displayedStrength / this.props.maxStrength;

        console.log(relativeHealth)

        var bar = React.DOM.div(
        {
          className: "unit-strength-bar"
        },
          React.DOM.div(
          {
            className: "unit-strength-bar-value",
            style:
            {
              width: "" + relativeHealth * 100 + "%"
            }
          })
        );

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

        var healthRatio = this.state.displayedStrength / this.props.maxStrength;

        if (healthRatio <= critThreshhold)
        {
          currentStyle.className += " critical";
        }
        else if (this.state.displayedStrength < this.props.maxStrength)
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
            React.DOM.span(currentStyle, Math.ceil(this.state.displayedStrength)),
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