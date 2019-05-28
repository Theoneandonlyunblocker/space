import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";


export interface PropTypes extends React.Props<any>
{
  isSquadron: boolean;
  isNotDetected?: boolean;
  currentHealth: number;
  maxHealth: number;
}

interface StateType
{
}

export class UnitStrengthComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "UnitStrength";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.makeSquadronInfo = this.makeSquadronInfo.bind(this);
    this.makeStrengthText = this.makeStrengthText.bind(this);
    this.makeCapitalInfo = this.makeCapitalInfo.bind(this);
  }
  makeSquadronInfo()
  {
    return(
      ReactDOMElements.div({className: "unit-strength-container"},
        this.makeStrengthText(),
      )
    );
  }
  makeCapitalInfo()
  {
    const text = this.makeStrengthText();

    const relativeHealth = this.props.currentHealth / this.props.maxHealth;

    const bar = ReactDOMElements.div(
    {
      className: "unit-strength-bar",
    },
      ReactDOMElements.div(
      {
        className: "unit-strength-bar-value",
        style:
        {
          width: `${relativeHealth * 100}%`,
        },
      }),
    );

    return(
      ReactDOMElements.div({className: "unit-strength-container"},
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

    const healthRatio = this.props.currentHealth / this.props.maxHealth;

    if (!this.props.isNotDetected && healthRatio <= critThreshhold)
    {
      currentStyle.className += " critical";
    }
    else if (!this.props.isNotDetected && this.props.currentHealth < this.props.maxHealth)
    {
      currentStyle.className += " wounded";
    }

    const containerProps =
    {
      className: (this.props.isSquadron ? "unit-strength-amount" :
        "unit-strength-amount-capital"),
    };

    const displayed = this.props.isNotDetected ? "???" : "" + Math.ceil(this.props.currentHealth);
    const max = this.props.isNotDetected ? "???" : "" + this.props.maxHealth;

    return(
      ReactDOMElements.div(containerProps,
        ReactDOMElements.span(currentStyle, displayed),
        ReactDOMElements.span({className: "unit-strength-max"}, "/" + max),
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

const factory: React.Factory<PropTypes> = React.createFactory(UnitStrengthComponent);
export default factory;
