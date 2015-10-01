module Rance
{
  export module UIComponents
  {
    export var UpgradeUnit = React.createClass(
    {
      displayName: "UpgradeUnit",
      render: function()
      {
        var unit: Unit = this.props.unit;
        return(
          React.DOM.div(
          {
            className: "upgrade-unit"
          },
            React.DOM.div(
            {
              className: "upgrade-unit-header"
            },
              unit.name + "  " + "Level " + unit.level + " -> " + (unit.level + 1)
            )
          )
        );
      }
    })
  }
}
