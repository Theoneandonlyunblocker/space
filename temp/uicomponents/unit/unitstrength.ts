/// <reference path="../../../lib/tween.js.d.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class UnitStrength extends React.Component<PropTypes, {}>
{
  displayName: "UnitStrength",
  getInitialState: function()
  {
    return(
    {
      displayedStrength: this.props.currentHealth,
      activeTween: null
    });
  },
  componentWillReceiveProps: function(newProps: any)
  {
    if (newProps.animateStrength &&
      newProps.currentHealth !== this.props.currentHealth &&
      (!newProps.maxHealth || newProps.maxHealth === this.props.maxHealth)
      )
    {
      var animateDuration = newProps.animateDuration || 0;
      this.animateDisplayedStrength(
        newProps.currentHealth, animateDuration);
    }
    else
    {
      this.updateDisplayStrength(newProps.currentHealth);
    }
  },
  componentWillUnmount: function()
  {
    if (this.activeTween)
    {
      this.activeTween.stop();
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
      if (stopped)
      {
        cancelAnimationFrame(self.requestAnimFrame);
        return;
      }

      TWEEN.update();
      self.requestAnimFrame = window.requestAnimationFrame(animateTween);
    }

    var tween = new TWEEN.Tween(
    {
      health: self.state.displayedStrength
    }).to(
    {
      health: newAmount
    }, time).onUpdate(function()
    {
      self.setState(
      {
        displayedStrength: this.health
      });
    }).easing(TWEEN.Easing.Sinusoidal.Out);

    tween.onStop(function()
    {
      stopped = true;
      TWEEN.remove(tween);
    });

    this.activeTween = tween;

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

    var relativeHealth = this.state.displayedStrength / this.props.maxHealth;

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

    var healthRatio = this.state.displayedStrength / this.props.maxHealth;

    if (!this.props.isNotDetected && healthRatio <= critThreshhold)
    {
      currentStyle.className += " critical";
    }
    else if (!this.props.isNotDetected && this.state.displayedStrength < this.props.maxHealth)
    {
      currentStyle.className += " wounded";
    }

    var containerProps =
    {
      className: (this.props.isSquadron ? "unit-strength-amount" :
        "unit-strength-amount-capital")
    }

    var displayed = this.props.isNotDetected ? "???" : "" + Math.ceil(this.state.displayedStrength);
    var max = this.props.isNotDetected ? "???" : "" + this.props.maxHealth;

    return(
      React.DOM.div(containerProps,
        React.DOM.span(currentStyle, displayed),
        React.DOM.span({className: "unit-strength-max"}, "/" + max)
      )
    )
  },
  render: function()
  {
    if (this.props.isSquadron)
    {
      return this.makeSquadronInfo();
    }
    else
    {
      return this.makeCapitalInfo()
    }
  }
}
