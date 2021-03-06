import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {Player} from "core/src/player/Player";
import {List} from "../list/List";
import {ListColumn} from "../list/ListColumn";
import {ListItem} from "../list/ListItem";

import {EconomySummaryItem, PropTypes as EconomySummaryItemProps} from "./EconomySummaryItem";


export interface PropTypes extends React.Props<any>
{
  player: Player;
}

interface StateType
{
}

export class EconomySummaryComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "EconomySummary";

  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override render()
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
          // TODO 2019.10.04 | implement for resources
          income: star.getResourceIncome().money || 0,
        }),
      });
    }

    const columns: ListColumn<EconomySummaryItemProps>[] =
    [
      {
        label: localize("id").toString(),
        key: "id",
        defaultOrder: "asc",
      },
      {
        label: localize("displayName").toString(),
        key: "name",
        defaultOrder: "asc",
      },
      {
        label: localize("income").toString(),
        key: "income",
        defaultOrder: "desc",
      },
    ];

    return(
      ReactDOMElements.div({className: "economy-summary-list"},
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

export const EconomySummary: React.Factory<PropTypes> = React.createFactory(EconomySummaryComponent);
