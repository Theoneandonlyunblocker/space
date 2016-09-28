/// <reference path="../../../lib/react-global.d.ts" />


import UnitStatus from "./UnitStatus";
import UnitStrength from "./UnitStrength";
import GuardCoverage from "../../GuardCoverage";
import UnitActions from "./UnitActions";


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
  guardType?: GuardCoverage;

  isPreparing?: boolean;
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
    var battleEndStatus: React.ReactHTMLElement<any> = null;
    if (this.props.wasDestroyed)
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
    else if (this.props.wasCaptured)
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

const Factory: React.Factory<PropTypes> = React.createFactory(UnitInfoComponent);
export default Factory;
