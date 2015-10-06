module Rance
{
  export module UIComponents
  {
    export var ManufacturableItems = React.createClass(
    {
      displayName: "ManufacturableItems",

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
            className: "manufacturable-items"
          },
            "items todo"
          )
        );
      }
    })
  }
}
