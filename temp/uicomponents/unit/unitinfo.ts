/// <reference path="unitstrength.ts"/>
/// <reference path="unitactions.ts"/>
/// <reference path="unitstatus.ts"/>

export var UnitInfo = React.createFactory(React.createClass(
{
  displayName: "UnitInfo",
  mixins: [React.addons.PureRenderMixin],

  propTypes:
  {
    name: React.PropTypes.string.isRequired,
    isSquadron: React.PropTypes.bool.isRequired,

    maxHealth: React.PropTypes.number.isRequired,
    currentHealth: React.PropTypes.number.isRequired,
    
    maxActionPoints: React.PropTypes.number.isRequired,
    currentActionPoints: React.PropTypes.number.isRequired,
    hoveredActionPointExpenditure: React.PropTypes.number.isRequired,

    isDead: React.PropTypes.bool,
    isCaptured: React.PropTypes.bool,

    guardAmount: React.PropTypes.number.isRequired,
    guardCoverage: React.PropTypes.number, // GuardCoverage enum
    isPreparing: React.PropTypes.bool,

    animateDuration: React.PropTypes.number
  },

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
}));
