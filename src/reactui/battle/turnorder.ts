module Rance
{
  export module UIComponents
  {
    export var TurnOrder = React.createClass(
    {
      render: function()
      {
        var turnOrder = this.props.turnOrder.slice(0, 7);

        if (this.props.potentialDelay)
        {
          turnOrder.push(
          {
            isFake: true,
            id: this.props.potentialDelay.id,
            battleStats:
            {
              moveDelay: this.props.potentialDelay.delay
            }
          });

          turnOrder.sort(turnOrderSortFunction);
        }

        var toRender = [];

        for (var i = 0; i < turnOrder.length; i++)
        {
          var unit = turnOrder[i];
          
          if (unit.isFake)
          {
            console.log(turnOrder)
            console.log("potential delay", this.props.potentialDelay.delay)
            console.log("unit delay", unit.battleStats.moveDelay)

            toRender.push(React.DOM.div(
            {
              className: "turn-order-arrow",
              key: "" + i
            }, "lol"));
            continue;
          }

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
