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
      const animateDuration = Math.max(newProps.animateDuration || 0, 0);
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
      displayedStrength: newAmount,
    });
  }
  animateDisplayedStrength(newAmount: number, time: number)
  {
    let stopped = false;

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
      health: this.state.displayedStrength,
    };

    const tween = new TWEEN.Tween(tweeningHealthObject).to(
    {
      health: newAmount,
    }, time);

    tween.onUpdate(() =>
    {
      this.setState(
      {
        displayedStrength: tweeningHealthObject.health,
      });
    }).easing(TWEEN.Easing.Sinusoidal.Out);

    tween.onStop(() =>
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
        this.makeStrengthText(),
      )
    );
  }
  makeCapitalInfo()
  {
    const text = this.makeStrengthText();

    const relativeHealth = this.state.displayedStrength / this.props.maxHealth;

    const bar = React.DOM.div(
    {
      className: "unit-strength-bar",
    },
      React.DOM.div(
      {
        className: "unit-strength-bar-value",
        style:
        {
          width: "" + relativeHealth * 100 + "%",
        },
      }),
    );

    return(
      React.DOM.div({className: "unit-strength-container"},
        text,
        bar,
      )
    );
  }
  makeStrengthText()
  {
    const critThreshhold = 0.3;
    const currentStyle =
    {
      className: "unit-strength-current",
    };

    const healthRatio = this.state.displayedStrength / this.props.maxHealth;

    if (!this.props.isNotDetected && healthRatio <= critThreshhold)
    {
      currentStyle.className += " critical";
    }
    else if (!this.props.isNotDetected && this.state.displayedStrength < this.props.maxHealth)
    {
      currentStyle.className += " wounded";
    }

    const containerProps =
    {
      className: (this.props.isSquadron ? "unit-strength-amount" :
        "unit-strength-amount-capital"),
    };

    const displayed = this.props.isNotDetected ? "???" : "" + Math.ceil(this.state.displayedStrength);
    const max = this.props.isNotDetected ? "???" : "" + this.props.maxHealth;

    return(
      React.DOM.div(containerProps,
        React.DOM.span(currentStyle, displayed),
        React.DOM.span({className: "unit-strength-max"}, "/" + max),
      )
    );
  }
  render()
  {
    if (this.props.isSquadron)
    {
      return this.makeSquadronInfo();
    }
    else
    {
      return this.makeCapitalInfo();
    }
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitStrengthComponent);
export default Factory;
