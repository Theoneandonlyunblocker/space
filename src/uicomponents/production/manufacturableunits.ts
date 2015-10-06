module Rance
{
  export module UIComponents
  {
    export var ManufacturableUnits = React.createClass(
    {
      displayName: "ManufacturableUnits",

      propTypes:
      {
        selectedStar: React.PropTypes.instanceOf(Star).isRequired,
        consolidateLocations: React.PropTypes.bool.isRequired,
        manufacturableThings: React.PropTypes.arrayOf(React.PropTypes.any).isRequired // TODO
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "manufacturable-units"
          },
            "units todo"
          )
        );
      }
    })
  }
}
