/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class BattleDisplayStrength extends React.Component<PropTypes, {}>
{
  displayName: string = "BattleDisplayStrength";
  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  getInitialState()
  {
    return(
    {
      displayedStrength: this.props.from,
      activeTween: null
    });
  }

  componentDidMount()
  {
    this.animateDisplayedStrength(this.props.from, this.props.to, this.props.delay);
  }

  componentWillUnmount()
  {
    if (this.activeTween)
    {
      this.activeTween.stop();
    }
  }
  updateDisplayStrength(newAmount: number)
  {
    this.setState(
    {
      displayedStrength: newAmount
    });
  }
  animateDisplayedStrength(from: number, newAmount: number, time: number)
  {
    var self = this;
    var stopped = false;

    if (this.activeTween)
    {
      this.activeTween.stop();
    }
    
    if (from === newAmount) return;

    var animateTween = function()
    {
      if (stopped)
      {
        return;
      }

      TWEEN.update();
      self.requestAnimFrame = window.requestAnimationFrame(animateTween);
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
  }

  render()
  {
    return(
      React.DOM.div({className: "unit-strength-battle-display"},
        Math.ceil(this.state.displayedStrength)
      )
    );
  }
}
