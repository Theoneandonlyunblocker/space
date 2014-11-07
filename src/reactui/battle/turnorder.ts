module Rance
{
  export module UIComponents
  {
    export var TurnOrder = React.createClass(
    {
      render: function()
      {
        var maxUnits = 7;
        var turnOrder = this.props.turnOrder.slice(0, maxUnits);

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

        if (this.props.turnOrder.length !== maxUnits)
        {
          turnOrder = turnOrder.slice(0, maxUnits);
        }

        var toRender = [];

        for (var i = 0; i < turnOrder.length; i++)
        {
          var unit = turnOrder[i];

          if (unit.isFake)
          {
            toRender.push(React.DOM.div(
            {
              className: "turn-order-arrow",
              key: "" + i
            }));
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

        if (this.props.turnOrder.length > maxUnits)
        {
          toRender.push(React.DOM.div(
          {
            className: "turn-order-more"
          }, "..."));
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
