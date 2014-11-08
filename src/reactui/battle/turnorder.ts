module Rance
{
  export module UIComponents
  {
    export var TurnOrder = React.createClass(
    {
      render: function()
      {
        var maxUnits = 7;
        var turnOrder = this.props.turnOrder.slice(0);

        if (this.props.potentialDelay)
        {
          var fake =
          {
            isFake: true,
            id: this.props.potentialDelay.id,
            battleStats:
            {
              moveDelay: this.props.potentialDelay.delay
            }
          };

          turnOrder.push(fake);

          turnOrder.sort(turnOrderSortFunction);
        }

        var maxUnitsWithFake = maxUnits;

        if (fake && turnOrder.indexOf(fake) <= maxUnits)
        {
          maxUnitsWithFake++;
        }

        turnOrder = turnOrder.slice(0, maxUnitsWithFake);

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
            className: "turn-order-more",
            key: "more"
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
