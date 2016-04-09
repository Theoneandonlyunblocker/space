/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="unitstrength.ts"/>
/// <reference path="unitactions.ts"/>
/// <reference path="unitstatus.ts"/>

export interface PropTypes
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
  // TODO refactor | add state type
}

class UnitInfo extends React.Component<PropTypes, StateType>
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
    var battleEndStatus: ReactDOMPlaceHolder = null;
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
          UIComponents.UnitStatus(
          {
            guardAmount: this.props.guardAmount,
            isPreparing: this.props.isPreparing
          }),
          UIComponents.UnitStrength(
          {
            maxHealth: this.props.maxHealth,
            currentHealth: this.props.currentHealth,
            isSquadron: this.props.isSquadron,
            animateStrength: true,
            animateDuration: this.props.animateDuration
          }),
          UIComponents.UnitActions(
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

const Factory = React.createFactory(UnitInfo);
export default Factory;
