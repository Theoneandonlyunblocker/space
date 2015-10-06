module Rance
{
  export module UIComponents
  {
    export var ManufacturableItems = React.createClass(
    {
      displayName: "ManufacturableItems",

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
            className: "manufacturable-items"
          },
            React.DOM.div(
            {
              className: "manufactory-upgrade-buttons-container"
            },
              React.DOM.button(
              {
                className: "manufactory-upgrade-button manufactory-items-upgrade-button"
              },
                "Upgrade items"
              )
            ),
            "todo items"
          )
        );
      }
    })
  }
}
