/// <reference path="../../../lib/react-0.13.3.d.ts" />
import ListColumn from "../unitlist/ListColumn"; // TODO refactor | autogenerated
import ListItem from "../unitlist/ListItem"; // TODO refactor | autogenerated


import List from "../unitlist/List";
import EconomySummaryItem from "./EconomySummaryItem";
import Player from "../../Player";


interface PropTypes extends React.Props<any>
{
  player: Player;
}

interface StateType
{
}

export class EconomySummaryComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "EconomySummary";

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    var rows: ListItem[] = [];
    var player = this.props.player;

    for (var i = 0; i < player.controlledLocations.length; i++)
    {
      var star = player.controlledLocations[i];

      var data =
      {
        star: star,

        id: star.id,
        name: star.name,
        income: star.getIncome(),

        rowConstructor: EconomySummaryItem
      };

      rows.push(
      {
        key: star.id,
        data: data
      });
    }

    var columns: ListColumn[] =
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
        List(
        {
          listItems: rows,
          initialColumns: columns,
          initialSortOrder: [columns[2]]
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(EconomySummaryComponent);
export default Factory;
