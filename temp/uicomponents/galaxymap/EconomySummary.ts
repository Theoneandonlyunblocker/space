/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../unitlist/list.ts"/>
/// <reference path="economysummaryitem.ts"/>


import List from "../unitlist/List.ts";
import EconomySummaryItem from "./EconomySummaryItem.ts";


export interface PropTypes extends React.Props<any>
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class EconomySummary_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "EconomySummary";

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
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

        rowConstructor: EconomySummaryItem
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

const Factory: React.Factory<PropTypes> = React.createFactory(EconomySummary_COMPONENT_TODO);
export default Factory;
