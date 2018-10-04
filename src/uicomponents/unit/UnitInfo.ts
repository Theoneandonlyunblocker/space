import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import GuardCoverage from "../../GuardCoverage";

import UnitActions from "./UnitActions";
import UnitStatus from "./UnitStatus";
import UnitStrength from "./UnitStrength";


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
  public displayName = "UnitInfo";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    let battleEndStatus: React.ReactHTMLElement<any> = null;
    if (this.props.wasDestroyed)
    {
      battleEndStatus = ReactDOMElements.div(
      {
        className: "unit-battle-end-status-container",
      },
        ReactDOMElements.div(
        {
          className: "unit-battle-end-status unit-battle-end-status-dead",
        },
          localize("destroyed_statusText")(),
        ),
      );
    }
    else if (this.props.wasCaptured)
    {
      battleEndStatus = ReactDOMElements.div(
      {
        className: "unit-battle-end-status-container",
      },
        ReactDOMElements.div(
        {
          className: "unit-battle-end-status unit-battle-end-status-captured",
        },
          localize("captured_statusText")(),
        ),
      );
    }

    return(
      ReactDOMElements.div({className: "unit-info"},
        ReactDOMElements.div({className: "unit-info-name"},
          this.props.name,
        ),
        ReactDOMElements.div({className: "unit-info-inner"},
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

const factory: React.Factory<PropTypes> = React.createFactory(UnitInfoComponent);
export default factory;
