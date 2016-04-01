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

export default class UnitInfo extends React.Component<PropTypes, {}>
{
  displayName: "UnitInfo",
  mixins: [React.addons.PureRenderMixin],


  render: function()
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
