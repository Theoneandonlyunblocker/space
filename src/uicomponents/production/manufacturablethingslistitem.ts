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
        onClick: React.PropTypes.func,
        showCost: React.PropTypes.bool.isRequired,
        money: React.PropTypes.number
      },

      getInitialState: function()
      {
        return(
        {
          canAfford: this.props.money >= this.props.template.buildCost,
          isDisabled: !this.props.onClick
        });
      },
      
      componentWillReceiveProps: function(newProps: any)
      {
        this.setState(
        {
          canAfford: newProps.money >= newProps.template.buildCost,
          isDisabled: !newProps.onClick
        });
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
        var isDisabled: boolean = this.state.isDisabled;
        if (this.props.showCost)
        {
          isDisabled = isDisabled || !this.state.canAfford;
        }

        return(
          React.DOM.li(
          {
            className: "manufacturable-things-list-item" + (isDisabled ? " disabled" : ""),
            onClick: (isDisabled ? null : this.handleClick),
            disabled: isDisabled,
            title: template.description
          },
            React.DOM.div(
            {
              className: "manufacturable-things-list-item-name"
            },
              template.displayName
            ),
            !this.props.showCost ? null : React.DOM.div(
            {
              className: "manufacturable-things-list-item-cost money-style" +
                (this.state.canAfford ? "" : " negative")
            },
              template.buildCost
            )
          )
        );
      }
    })
  }
}
