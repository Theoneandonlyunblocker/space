/// <reference path="../mixins/autoposition.ts" />

/// <reference path="attitudemodifierinfo.ts" />

module Rance
{
  export module UIComponents
  {
    export var AttitudeModifierList = React.createClass(
    {
      displayName: "AttitudeModifierList",
      mixins: [AutoPosition],

      render: function()
      {
        var modifiers = this.props.attitudeModifiers;
        var rows = [];

        for (var i = 0; i < modifiers.length; i++)
        {
          var modifier = modifiers[i];
          if (modifier.isOverRidden) continue;

          rows.push(
          {
            key: modifier.template.type,
            data:
            {
              name: modifier.template.displayName,
              strength: modifier.getAdjustedStrength(),
              endTurn: modifier.endTurn,

              rowConstructor: UIComponents.AttitudeModifierInfo
            }
          });
        }


        var columns: any =
        [
          {
            label: "Name",
            key: "name",
            defaultOrder: "asc"
          },
          {
            label: "Effect",
            key: "strength",
            defaultOrder: "asc"
          },
          {
            label: "Ends on",
            key: "endTurn",
            defaultOrder: "desc"
          }
        ];

        return(
          React.DOM.div({className: "attitude-modifier-list"},
            UIComponents.List(
            {
              listItems: rows,
              initialColumns: columns,
              initialSortOrder: [columns[1]]
            })
          )
        );
      }
    })
  }
}
