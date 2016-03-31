/// <reference path="../unitlist/list.ts"/>
/// <reference path="economysummaryitem.ts"/>

module Rance
{
  export module UIComponents
  {
    export var EconomySummary = React.createFactory(React.createClass(
    {
      displayName: "EconomySummary",

      render: function()
      {
        var rows: IListItem[] = [];
        var player = this.props.player;

        for (var i = 0; i < player.controlledLocations.length; i++)
        {
          var star = player.controlledLocations[i];

          var data: any =
          {
            star: star,

            id: star.id,
            name: star.name,
            income: star.getIncome(),

            rowConstructor: UIComponents.EconomySummaryItem
          };

          rows.push(
          {
            key: star.id,
            data: data
          });
        }

        var columns: IListColumn[] =
        [
          {
            label: "Id",
            key: "id",
            defaultOrder: "asc"
          },
          {
            label: "Name",
            key: "name",
            defaultOrder: "asc"
          },
          {
            label: "Income",
            key: "income",
            defaultOrder: "desc"
          }
        ];

        return(
          React.DOM.div({className: "economy-summary-list fixed-table-parent"},
            UIComponents.List(
            {
              listItems: rows,
              initialColumns: columns,
              initialSortOrder: [columns[2]]
            })
          )
        );
      }
    }));
  }
}
