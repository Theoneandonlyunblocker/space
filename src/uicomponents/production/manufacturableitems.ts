module Rance
{
  export module UIComponents
  {
    export var ManufacturableItems = React.createClass(
    {
      displayName: "ManufacturableItems",
      mixins: [React.addons.PureRenderMixin],

      propTypes:
      {
        selectedStar: React.PropTypes.instanceOf(Star),
        consolidateLocations: React.PropTypes.bool.isRequired,
        manufacturableThings: React.PropTypes.array.isRequired,
        triggerUpdate: React.PropTypes.func.isRequired
      },

      addItemToBuildQueue: function(template: Templates.IItemTemplate)
      {
        var manufactory: Manufactory = this.props.selectedStar.manufactory;
        manufactory.addThingToQueue(template, "item");
        this.props.triggerUpdate();
      },

      render: function()
      {
        console.log("render items")
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
            UIComponents.ManufacturableThingsList(
            {
              manufacturableThings: this.props.manufacturableThings,
              onClick: this.addItemToBuildQueue
            })
          )
        );
      }
    })
  }
}
