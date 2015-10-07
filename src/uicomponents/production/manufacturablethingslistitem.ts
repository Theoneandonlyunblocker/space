module Rance
{
  export module UIComponents
  {
    export var ManufacturableThingsListItem = React.createClass(
    {
      displayName: "ManufacturableThingsListItem",

      propTypes:
      {
        template: React.PropTypes.any.isRequired,
        parentIndex: React.PropTypes.number.isRequired,
        onClick: React.PropTypes.func
      },

      handleClick: function()
      {
        if (this.props.onClick)
        {
          this.props.onClick(this.props.template, this.props.parentIndex);
        }
      },

      render: function()
      {
        var template: IManufacturableThing = this.props.template;
        return(
          React.DOM.li(
          {
            className: "manufacturable-things-list-item",
            onClick: this.handleClick
          },
            template.displayName
          )
        );
      }
    })
  }
}
