module Rance
{
  export module UIComponents
  {
    export var TurnCounter = React.createClass(
    {
      displayName: "TurnCounter",
      mixins: [React.addons.PureRenderMixin],
      render: function()
      {
        var turnsLeft = this.props.turnsLeft;

        var turns = [];

        var usedTurns = this.props.maxTurns - turnsLeft;

        for (var i = 0; i < usedTurns; i++)
        {
          turns.push(
            React.DOM.div(
            {
              key: "used" + i,
              className: "turn-counter used-turn"
            })
          );
        }

        for (var i = 0; i < turnsLeft; i++)
        {
          turns.push(
            React.DOM.div(
            {
              key: "available" + i,
              className: "turn-counter available-turn"
            })
          );
        }

        return(
          React.DOM.div({className: "turns-container"},
            turns
          )
        );
      }
    });
  }
}