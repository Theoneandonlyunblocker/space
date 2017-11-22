import * as React from "react";


import GuardCoverage from "../../GuardCoverage";
import UnitActions from "./UnitActions";
import UnitStatus from "./UnitStatus";
import UnitStrength from "./UnitStrength";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  name: string;
  isSquadron: boolean;
  maxHealth: number;
  currentHealth: number;
  maxActionPoints: number;
  currentActionPoints: number;
  hoveredActionPointExpenditure: number;
  wasDestroyed?: boolean;
  wasCaptured?: boolean;
  guardAmount: number;
  guardType: GuardCoverage | null;

  isPreparing: boolean;
  animateDuration?: number;
}

interface StateType
{
}

export class UnitInfoComponent extends React.PureComponent<PropTypes, StateType>
{
  displayName: string = "UnitInfo";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    let battleEndStatus: React.ReactHTMLElement<any> = null;
    if (this.props.wasDestroyed)
    {
      battleEndStatus = React.DOM.div(
      {
        className: "unit-battle-end-status-container",
      },
        React.DOM.div(
        {
          className: "unit-battle-end-status unit-battle-end-status-dead",
        },
          localize("destroyed_statusText"),
        ),
      );
    }
    else if (this.props.wasCaptured)
    {
      battleEndStatus = React.DOM.div(
      {
        className: "unit-battle-end-status-container",
      },
        React.DOM.div(
        {
          className: "unit-battle-end-status unit-battle-end-status-captured",
        },
          localize("captured_statusText"),
        ),
      );
    }

    return(
      React.DOM.div({className: "unit-info"},
        React.DOM.div({className: "unit-info-name"},
          this.props.name,
        ),
        React.DOM.div({className: "unit-info-inner"},
          UnitStatus(
          {
            guardAmount: this.props.guardAmount,
            guardCoverage: this.props.guardType,
            isPreparing: this.props.isPreparing,
          }),
          UnitStrength(
          {
            maxHealth: this.props.maxHealth,
            currentHealth: this.props.currentHealth,
            isSquadron: this.props.isSquadron,
            animateStrength: true,
            animateDuration: this.props.animateDuration,
          }),
          UnitActions(
          {
            maxActionPoints: this.props.maxActionPoints,
            currentActionPoints: this.props.currentActionPoints,
            hoveredActionPointExpenditure: this.props.hoveredActionPointExpenditure,
          }),
          battleEndStatus,
        ),

      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitInfoComponent);
export default Factory;
