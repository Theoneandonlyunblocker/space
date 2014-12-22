/// <reference path="../../../lib/tween.js.d.ts" />

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
        var stopped = false;

        var animateTween = function()
        {
          if (stopped) return;

          TWEEN.update();
          requestAnimFrame(animateTween);
        }

        var tween = new TWEEN.Tween(
        {
          health: self.state.displayedStrength
        }).to(
        {
          health: newAmount
        }, time).onUpdate(function()
        {
          console.log(this.health);
          self.setState(
          {
            displayedStrength: this.health
          });
        });

        tween.onComplete(function()
        {
          stopped = true;
          TWEEN.remove(tween);
        });

        tween.start();
        animateTween();

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