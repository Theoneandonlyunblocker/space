/// <reference path="../../../lib/tween.js.d.ts" />
/// <reference path="../../../lib/react-global.d.ts" />

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
      displayedStrength: newAmount
    });
  }
  private animateDisplayedStrength(from: number, to: number, duration: number)
  {
    var self = this;
    var stopped = false;

    if (this.activeTween)
    {
      this.activeTween.stop();
    }
    
    if (from === to) return;

    var animateTween = function()
    {
      if (stopped)
      {
        cancelAnimationFrame(self.animationFrameHandle);
        return;
      }

      TWEEN.update();
      self.animationFrameHandle = window.requestAnimationFrame(animateTween);
    }

    var tween = new TWEEN.Tween(
    {
      health: from
    }).to(
    {
      health: to
    }, duration).onUpdate(function()
    {
      self.setState(
      {
        displayedStrength: this.health
      });
    }).easing(TWEEN.Easing.Sinusoidal.Out);

    tween.onStop(function()
    {
      cancelAnimationFrame(self.animationFrameHandle);
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

const Factory: React.Factory<PropTypes> = React.createFactory(BattleDisplayStrengthComponent);
export default Factory;
