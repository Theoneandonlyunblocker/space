/// <reference path="../../star.ts" />

namespace Rance
{
  export namespace UIComponents
  {
    export var ManufactoryStarsListItem = React.createFactory(React.createClass(
    {
      displayName: "ManufactoryStarsListItem",

      propTypes:
      {
        star: React.PropTypes.instanceOf(Star).isRequired,
        isHighlighted: React.PropTypes.bool.isRequired,
        usedCapacity: React.PropTypes.number.isRequired,
        totalCapacity: React.PropTypes.number.isRequired,

        onClick: React.PropTypes.func.isRequired
      },

      handleClick: function()
      {
        var star: Star = this.props.star;
        this.props.onClick(star);
      },

      render: function()
      {
        var star: Star = this.props.star;
        var isHighlighted: boolean = this.props.isHighlighted;
        var usedCapacity: number = this.props.usedCapacity;
        var totalCapacity: number = this.props.totalCapacity;

        var hasManufcatory = Boolean(totalCapacity);
        var hasCapacity = hasManufcatory && usedCapacity < totalCapacity;

        return(
          React.DOM.div(
          {
            className: "manufactory-stars-list-item" +
              (!hasManufcatory ? " no-manufactory" : "") +
              (isHighlighted ? " highlighted" : ""),
            onClick: this.handleClick
          },
            React.DOM.div(
            {
              className: "manufactory-stars-list-item-star-name"
            },
              star.name
            ),
            !hasManufcatory ? null : React.DOM.div(
            {
              className: "manufactory-stars-list-item-capacity" + (!hasCapacity ? " no-capacity" : "")
            },
              "" + usedCapacity + "/" + totalCapacity
            )
          )
        );
      }
    }));
  }
}
