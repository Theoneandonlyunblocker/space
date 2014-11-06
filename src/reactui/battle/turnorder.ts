module Rance
{
  export module UIComponents
  {
    export var TurnOrder = React.createClass(
    {
      render: function()
      {
        var turnOrder = this.props.turnOrder;

        var toRender = [];

        for (var i = 0; i < turnOrder.length && i < 8; i++)
        {
          var unit = turnOrder[i];

          var data =
          {
            key: "" + i,
            className: "turn-order-unit",
            title: "delay: " + unit.battleStats.moveDelay + "\n" +
              "speed: " + unit.attributes.speed
          };

          if (this.props.unitsBySide.side1.indexOf(unit) > -1)
          {
            data.className += " turn-order-unit-friendly";
          }
          else if (this.props.unitsBySide.side2.indexOf(unit) > -1)
          {
            data.className += " turn-order-unit-enemy"
          }

          toRender.push(
            React.DOM.div(data, unit.name)
          )
        }

        return(
          React.DOM.div({className: "turn-order-container"},
            toRender
          )
        );
      }
    });
  }
}
