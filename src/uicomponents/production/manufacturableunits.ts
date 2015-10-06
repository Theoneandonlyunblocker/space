module Rance
{
  export module UIComponents
  {
    export var ManufacturableUnits = React.createClass(
    {
      displayName: "ManufacturableUnits",

      propTypes:
      {
        selectedStar: React.PropTypes.instanceOf(Star),
        consolidateLocations: React.PropTypes.bool.isRequired,
        manufacturableThings: React.PropTypes.object.isRequired // TODO
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "manufacturable-units"
          },
            React.DOM.div(
            {
              className: "manufactory-upgrade-buttons-container"
            },
              React.DOM.button(
              {
                className: "manufactory-upgrade-button manufactory-units-upgrade-strength-button"
              },
                "Upgrade strength"
              ),
              React.DOM.button(
              {
                className: "manufactory-upgrade-button manufactory-units-upgrade-stats-button"
              },
                "Upgrade stats"
              )
            ),
            "todo units"
          )
        );
      }
    })
  }
}
