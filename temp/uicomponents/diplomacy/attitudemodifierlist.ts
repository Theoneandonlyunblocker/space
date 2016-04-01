/// <reference path="../mixins/autoposition.ts" />

/// <reference path="attitudemodifierinfo.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class AttitudeModifierList extends React.Component<PropTypes, Empty>
{
  displayName: "AttitudeModifierList",
  mixins: [AutoPosition],

  render: function()
  {
    var modifiers = this.props.attitudeModifiers;
    var rows: IListItem[] = [];

    rows.push(
    {
      key: "baseOpinion",
      data:
      {
        name: "AI Personality",
        strength: this.props.baseOpinion,
        endTurn: -1,
        sortOrder: -1,

        rowConstructor: UIComponents.AttitudeModifierInfo
      }
    });

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
          sortOrder: 0,

          rowConstructor: UIComponents.AttitudeModifierInfo
        }
      });
    }


    var columns: IListColumn[] =
    [
      {
        label: "Name",
        key: "name",
        defaultOrder: "asc",
        propToSortBy: "sortOrder"
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
      React.DOM.div({className: "attitude-modifier-list auto-position fixed-table-parent"},
        UIComponents.List(
        {
          listItems: rows,
          initialColumns: columns,
          initialSortOrder: [columns[0], columns[1], columns[2]]
        })
      )
    );
  }
}
