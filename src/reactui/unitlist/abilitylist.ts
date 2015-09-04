module Rance
{
  export module UIComponents
  {
    export var AbilityList = React.createClass(
    {
      displayName: "AbilityList",
      render: function()
      {
        var abilities: Templates.IAbilityTemplate[] = [];
        var baseClassName = "unit-info-ability";

        if (this.props.listPassiveSkills)
        {
          abilities = this.props.unit.getAllPassiveSkills();
          baseClassName += " passive-skill";
        }
        else
        {
          abilities = this.props.unit.getAllAbilities();
        }

        if (abilities.length < 1) return null;


        var abilityElements: ReactDOMPlaceHolder[] = [];
        var addedAbilityTypes:
        {
          [abilityType: string]: number;
        } = {};

        abilities.sort(function(_a, _b)
        {
          var a = _a.displayName.toLowerCase();
          var b = _b.displayName.toLowerCase();
          
          if (a > b) return 1;
          else if (a < b) return -1;
          else return 0;
        });

        for (var i = 0; i < abilities.length; i++)
        {
          var ability = abilities[i];
          if (!addedAbilityTypes[ability.type])
          {
            addedAbilityTypes[ability.type] = 0;
          }

          var className = baseClassName;

          if (addedAbilityTypes[ability.type] >= 1)
          {
            className += " redundant-ability";
          }

          abilityElements.push(
            React.DOM.li(
            {
              className: className,
              title: ability.description,
              key: ability.type + addedAbilityTypes[ability.type]
            },
              "[" + ability.displayName + "]"
            )
          );

          addedAbilityTypes[ability.type]++;
        }

        return(
          React.DOM.ul(
          {
            className: "ability-list"
          },
            abilityElements
          )
        );
      }
    })
  }
}
