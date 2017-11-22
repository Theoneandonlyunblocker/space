import * as React from "react";

import GuardCoverage from "../../GuardCoverage";
import
{
  clamp,
} from "../../utility";

import {localize, localizeF} from "../../../localization/localize";


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
  displayName: string = "UnitStatus";


  state: StateType;

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

      const chanceToProtectString = localizeF("guard_chanceToProtect").format(guard);
      const protectedUnitsString = this.props.guardCoverage === GuardCoverage.All ?
        localize("guard_allUnits") :
        localize("guard_sameRowUnits");
      const damageReductionString = localizeF("reducedPhysicalDamage").format({damageReduction: damageReduction});

      const guardText = `${chanceToProtectString} ${protectedUnitsString}.` +
        `\n${damageReductionString}`;

      statusElement = React.DOM.div(
      {
        className: "status-container guard-meter-container",
      },
        React.DOM.div(
        {
          className: "guard-meter-value",
          style:
          {
            width: "" + clamp(guard, 0, 100) + "%",
          },
        }),
        React.DOM.div(
        {
          className: "status-inner-wrapper",
        },
          React.DOM.div(
          {
            className: "guard-text-container status-inner",
            title: guardText,
          },
            React.DOM.div(
            {
              className: "guard-text status-text",
            }, localize("guard_statusText")),
            React.DOM.div(
            {
              className: "guard-text-value status-text",
            }, "" + guard + "%"),
          ),
        ),
      );
    }
    else if (this.props.isPreparing)
    {
      statusElement = React.DOM.div(
      {
        className: "status-container preparation-container",
      },
        React.DOM.div(
        {
          className: "status-inner-wrapper",
        },
          React.DOM.div(
          {
            className: "preparation-text-container status-inner",
            title: localize("preparing_toolTip"),
          },
            localize("preparing_statusText"),
          ),
        ),
      );
    }

    return(
      React.DOM.div({className: "unit-status"},
        statusElement,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitStatusComponent);
export default Factory;
