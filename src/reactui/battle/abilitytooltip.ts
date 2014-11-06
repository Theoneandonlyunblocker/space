module Rance
{
  export module UIComponents
  {
    export var AbilityTooltip = React.createClass(
    {
      render: function()
      {
        var abilities = this.props.activeTargets[this.props.targetUnit.id];

        var abilityElements = [];

        var containerProps: any =
        {
          className: "ability-tooltip",
          onMouseLeave: this.props.handleMouseLeave
        };

        var parentRect = this.props.parentElement.getBoundingClientRect();

        if (this.props.facesLeft)
        {
          containerProps.className += " ability-tooltip-faces-left";

          containerProps.style =
          {
            top: parentRect.top,
            left: parentRect.right - 48 - 128
          }
        }
        else
        {
          containerProps.className += " ability-tooltip-faces-right";

          containerProps.style =
          {
            top: parentRect.top,
            left: parentRect.left + 48
          }
        }

        for (var i = 0; i < abilities.length; i++)
        {
          var ability = abilities[i];
          var data: any = {};

          data.className = "ability-tooltip-ability";

          abilityElements.push(
            React.DOM.div(data,
              ability.name
            )
          );
        }

        return(
          React.DOM.div(containerProps,
            abilityElements
          )
        );
      }
    });
  }
}