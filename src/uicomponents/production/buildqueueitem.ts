module Rance
{
  export module UIComponents
  {
    export var BuildQueueItem = React.createClass(
    {
      displayName: "BuildQueueItem",

      propTypes:
      {
        type: React.PropTypes.string.isRequired,
        template: React.PropTypes.any.isRequired
      },

      render: function()
      {
        var template: IManufacturableThing = this.props.template;
        return(
          React.DOM.li(
          {
            className: "build-queue-item"
          },
            template.displayName
          )
        );
      }
    })
  }
}
