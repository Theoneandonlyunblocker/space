module Rance
{
  export module UIComponents
  {
    export var BattleDisplayStrength = React.createClass(
    {
      displayName: "BattleDisplayStrength",
      getInitialState: function()
      {
        return(
        {
          displayedStrength: this.props.from,
          activeTween: null
        });
      },

      componentDidMount: function()
      {
        this.animateDisplayedStrength(this.props.from, this.props.to, this.props.delay);
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
      animateDisplayedStrength: function(from: number, newAmount: number, time: number)
      {
        var self = this;
        var stopped = false;
        console.log("animate display strength", this.state.displayedStrength, newAmount);

        if (this.activeTween)
        {
          this.activeTween.stop();
        }

        var animateTween = function()
        {
          if (stopped)
          {
            return;
          }

          TWEEN.update();
          self.requestAnimFrame = requestAnimFrame(animateTween);
        }

        var tween = new TWEEN.Tween(
        {
          health: from
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
          cancelAnimationFrame(self.requestAnimFrame);
          stopped = true;
          TWEEN.remove(tween);
        });

        this.activeTween = tween;

        tween.start();
        animateTween();
      },

      render: function()
      {
        return(
          React.DOM.div({className: "unit-strength-battle-display"},
            Math.ceil(this.state.displayedStrength)
          )
        );
      }
    })
  }
}
