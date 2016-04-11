/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="unitstrength.ts"/>
/// <reference path="unitactions.ts"/>
/// <reference path="unitstatus.ts"/>


import UnitStatus from "./UnitStatus.ts";
import UnitStrength from "./UnitStrength.ts";
import GuardCoverage from "../../../src/GuardCoverage.ts";
import UnitActions from "./UnitActions.ts";


export interface PropTypes extends React.Props<any>
{
  name: string;
  isSquadron: boolean;
  maxHealth: number;
  currentHealth: number;
  maxActionPoints: number;
  currentActionPoints: number;
  hoveredActionPointExpenditure: number;
  isDead?: boolean;
  isCaptured?: boolean;
  guardAmount: number;
  guardCoverage?: number; // GuardCoverage enum

  isPreparing?: boolean;
  animateDuration?: number;
}

interface StateType
{
}

class UnitInfo_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitInfo";
  mixins: reactTypeTODO_any = [React.addons.PureRenderMixin];


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    var battleEndStatus: React.HTMLElement = null;
    if (this.props.isDead)
    {
      battleEndStatus = React.DOM.div(
      {
        className: "unit-battle-end-status-container"
      },
        React.DOM.div(
        {
          className: "unit-battle-end-status unit-battle-end-status-dead"
        },
          "Destroyed"
        )
      )
    }
    else if (this.props.isCaptured)
    {
      battleEndStatus = React.DOM.div(
      {
        className: "unit-battle-end-status-container"
      },
        React.DOM.div(
        {
          className: "unit-battle-end-status unit-battle-end-status-captured"
        },
          "Captured"
        )
      )
    }

    return(
      React.DOM.div({className: "unit-info"},
        React.DOM.div({className: "unit-info-name"},
          this.props.name
        ),
        React.DOM.div({className: "unit-info-inner"},
          UnitStatus(
          {
            guardAmount: this.props.guardAmount,
            isPreparing: this.props.isPreparing
          }),
          UnitStrength(
          {
            maxHealth: this.props.maxHealth,
            currentHealth: this.props.currentHealth,
            isSquadron: this.props.isSquadron,
            animateStrength: true,
            animateDuration: this.props.animateDuration
          }),
          UnitActions(
          {
            maxActionPoints: this.props.maxActionPoints,
            currentActionPoints: this.props.currentActionPoints,
            hoveredActionPointExpenditure: this.props.hoveredActionPointExpenditure
          }),
          battleEndStatus
        )
        
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitInfo_COMPONENT_TODO);
export default Factory;
