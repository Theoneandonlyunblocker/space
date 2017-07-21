/// <reference path="../../../lib/tween.js.d.ts" />
import * as React from "react";

export interface PropTypes extends React.Props<any>
{
  animationDuration: number;
  from: number;
  to: number;
}

interface StateType
{
  displayedStrength?: number;
}

export class BattleDisplayStrengthComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "BattleDisplayStrength";
  state: StateType;
  activeTween: TWEEN.Tween;
  animationFrameHandle: number;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.updateDisplayStrength = this.updateDisplayStrength.bind(this);
    this.animateDisplayedStrength = this.animateDisplayedStrength.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      displayedStrength: this.props.from,
    });
  }

  componentDidMount()
  {
    this.animateDisplayedStrengthIfNeeded(this.props);
  }
  componentWillReceiveProps(newProps: PropTypes)
  {
    this.animateDisplayedStrengthIfNeeded(newProps);
  }
  componentWillUnmount()
  {
    if (this.activeTween)
    {
      this.activeTween.stop();
    }
  }

  private animateDisplayedStrengthIfNeeded(props: PropTypes)
  {
    if (isFinite(props.animationDuration) && props.to !== props.from)
    {
      this.animateDisplayedStrength(props.from, props.to, props.animationDuration);
    }
  }
  private updateDisplayStrength(newAmount: number)
  {
    this.setState(
    {
      displayedStrength: newAmount,
    });
  }
  private animateDisplayedStrength(strengthBefore: number, strengthAfter: number, duration: number)
  {
    let stopped = false;

    if (this.activeTween)
    {
      this.activeTween.stop();
    }

    if (strengthBefore === strengthAfter)
    {
      return;
    }

    const animateTween = () =>
    {
      if (stopped)
      {
        cancelAnimationFrame(this.animationFrameHandle);
        return;
      }

      TWEEN.update();
      this.animationFrameHandle = window.requestAnimationFrame(animateTween);
    };

    const tweeningHealthObject =
    {
      health: strengthBefore,
    };

    const tween = new TWEEN.Tween(tweeningHealthObject).to(
    {
      health: strengthAfter,
    }, duration);

    tween.onUpdate(() =>
    {
      this.setState(
      {
        displayedStrength: tweeningHealthObject.health,
      });
    }).easing(TWEEN.Easing.Sinusoidal.Out);

    tween.onStop(() =>
    {
      cancelAnimationFrame(this.animationFrameHandle);
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
        Math.ceil(this.state.displayedStrength),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BattleDisplayStrengthComponent);
export default Factory;
