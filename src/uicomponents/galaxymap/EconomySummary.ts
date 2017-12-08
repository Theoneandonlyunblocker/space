import * as React from "react";

import {default as EconomySummaryItem, PropTypes as EconomySummaryItemProps} from "./EconomySummaryItem";

import List from "../list/List";
import ListColumn from "../list/ListColumn";
import ListItem from "../list/ListItem";

import Player from "../../Player";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
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
    const rows: ListItem<EconomySummaryItemProps>[] = [];
    const player = this.props.player;

    for (let i = 0; i < player.controlledLocations.length; i++)
    {
      const star = player.controlledLocations[i];

      rows.push(
      {
        key: "" + star.id,
        content: EconomySummaryItem(
        {
          star: star,
          id: star.id,
          name: star.name,
          income: star.getIncome(),
        }),
      });
    }

    const columns: ListColumn<EconomySummaryItemProps>[] =
    [
      {
        label: localize("id")(),
        key: "id",
        defaultOrder: "asc",
      },
      {
        label: localize("displayName")(),
        key: "name",
        defaultOrder: "asc",
      },
      {
        label: localize("income")(),
        key: "income",
        defaultOrder: "desc",
      },
    ];

    return(
      React.DOM.div({className: "economy-summary-list fixed-table-parent"},
        List(
        {
          listItems: rows,
          initialColumns: columns,
          initialSortOrder: [columns[2]],
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(EconomySummaryComponent);
export default Factory;
