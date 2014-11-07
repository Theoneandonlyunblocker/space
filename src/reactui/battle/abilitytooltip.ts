module Rance
{
  export module UIComponents
  {
    export var AbilityTooltip = React.createClass(
    {

      handleAbilityUse: function(ability)
      {
        this.props.handleAbilityUse(ability, this.props.targetUnit)
      },

      handleMouseEnterAbility: function(e, ability)
      {
        this.props.handleMouseEnterAbility(e, ability);
      },

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
            left: parentRect.right - 96 - 128
          }
        }
        else
        {
          containerProps.className += " ability-tooltip-faces-right";

          containerProps.style =
          {
            top: parentRect.top,
            left: parentRect.left + 96
          }
        }

        for (var i = 0; i < abilities.length; i++)
        {
          var ability = abilities[i];
          var data: any = {};

          data.className = "ability-tooltip-ability";
          data.key = i;
          data.onClick = this.handleAbilityUse.bind(null, ability);

          data.onMouseEnter = function(e)
          {
            this.handleMouseEnterAbility(e, ability);
          }.bind(this);
          data.onMouseLeave = this.props.handleMouseLeaveAbility;

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