import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import GuardCoverage from "../../GuardCoverage";
import
{
  clamp,
} from "../../utility";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  guardAmount: number;
  guardCoverage: GuardCoverage | null;
  isPreparing: boolean;
}

interface StateType
{
}

export class UnitStatusComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "UnitStatus";


  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    let statusElement: React.ReactHTMLElement<any> | null = null;

    if (this.props.guardAmount > 0)
    {
      const guard = this.props.guardAmount;
      const damageReduction = Math.min(50, guard / 2);

      const protectString = localize("guard_chanceToProtect")(
      {
        protChance: guard,
        guardCoverage: this.props.guardCoverage,
      });
      const damageReductionString = localize("reducedPhysicalDamage")({damageReduction: damageReduction});

      const guardText = `${protectString}` +
        `\n${damageReductionString}`;

      statusElement = ReactDOMElements.div(
      {
        className: "status-container guard-meter-container",
      },
        ReactDOMElements.div(
        {
          className: "guard-meter-value",
          style:
          {
            width: "" + clamp(guard, 0, 100) + "%",
          },
        }),
        ReactDOMElements.div(
        {
          className: "status-inner-wrapper",
        },
          ReactDOMElements.div(
          {
            className: "guard-text-container status-inner",
            title: guardText,
          },
            ReactDOMElements.div(
            {
              className: "guard-text status-text",
            }, localize("guard_statusText")()),
            ReactDOMElements.div(
            {
              className: "guard-text-value status-text",
            }, "" + guard + "%"),
          ),
        ),
      );
    }
    else if (this.props.isPreparing)
    {
      statusElement = ReactDOMElements.div(
      {
        className: "status-container preparation-container",
      },
        ReactDOMElements.div(
        {
          className: "status-inner-wrapper",
        },
          ReactDOMElements.div(
          {
            className: "preparation-text-container status-inner",
            title: localize("preparing_tooltip")(),
          },
            localize("preparing_statusText")(),
          ),
        ),
      );
    }

    return(
      ReactDOMElements.div({className: "unit-status"},
        statusElement,
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(UnitStatusComponent);
export default factory;
