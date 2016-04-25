/// <reference path="../../../lib/tween.js.d.ts" />
/// <reference path="../../../lib/react-global.d.ts" />


export interface PropTypes extends React.Props<any>
{
  isNotDetected?: boolean;
  currentHealth: number;
  isSquadron: boolean;
  maxHealth: number;
  animateStrength?: boolean;
  animateDuration?: number;
}

interface StateType
{
  displayedStrength?: number;
}

export class UnitStrengthComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitStrength";
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
    this.makeSquadronInfo = this.makeSquadronInfo.bind(this);
    this.animateDisplayedStrength = this.animateDisplayedStrength.bind(this);
    this.makeStrengthText = this.makeStrengthText.bind(this);
    this.makeCapitalInfo = this.makeCapitalInfo.bind(this);    
  }
  
  private getInitialStateTODO(): StateType
  {
    return(
    {
      displayedStrength: this.props.currentHealth,
    });
  }
  componentWillReceiveProps(newProps: PropTypes)
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
  animateDisplayedStrength(newAmount: number, time: number)
  {
    var self = this;
    var stopped = false;

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
  }
  makeSquadronInfo()
  {
    return(
      React.DOM.div({className: "unit-strength-container"},
        this.makeStrengthText()
      )
    );
  }
  makeCapitalInfo()
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
  }
  makeStrengthText()
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
  }
  render()
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

const Factory: React.Factory<PropTypes> = React.createFactory(UnitStrengthComponent);
export default Factory;
