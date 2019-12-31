import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Star} from "core/src/map/Star";

import {ManufactoryStarsListItem, PropTypes as ManufactoryStarsListItemProps} from "./ManufactoryStarsListItem";
import { List } from "../list/List";
import { ListItem } from "../list/ListItem";
import { ListColumn } from "../list/ListColumn";
import { localize } from "modules/defaultui/localization/localize";


export interface PropTypes extends React.Props<any>
{
  stars: Star[];
  highlightedStars: Star[];
  setSelectedStar: (star: Star) => void;
}

interface StateType
{
}

export class ManufactoryStarsListComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ManufactoryStarsList";

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const highlightedStarIds = new Set(this.props.highlightedStars.map(star => star.id));

    const rows: ListItem<ManufactoryStarsListItemProps>[] = this.props.stars.map(star =>
    {
      return {
        key: "" + star.id,
        content: ManufactoryStarsListItem(
        {
          star: star,
          isHighlighted: highlightedStarIds.has(star.id),
          usedCapacity: star.manufactory ? star.manufactory.buildQueue.length : 0,
          totalCapacity: star.manufactory ? star.manufactory.capacity : 0,
          onClick: this.props.setSelectedStar,
        }),
      };
    });

    const columns: ListColumn<ManufactoryStarsListItemProps>[] =
    [
      {
        label: localize("displayName").toString(),
        key: "name",
        defaultOrder: "asc",
      },
      {
        label: "",
        key: "capacity",
        defaultOrder: "desc",
        sortingFunction: (a, b) =>
        {
          const maxCapacitySort = a.content.props.totalCapacity - b.content.props.totalCapacity;
          if (maxCapacitySort)
          {
            return maxCapacitySort;
          }

          const usedCaoacitySort = a.content.props.usedCapacity - b.content.props.usedCapacity;

          return usedCaoacitySort;
        },
      }
    ];

    return(
      ReactDOMElements.div(
      {
        className: "manufactory-stars-list",
      },
        List(
        {
          listItems: rows,
          initialColumns: columns,
          initialSortOrder: [columns[1], columns[0]],
          noHeader: true,
          addSpacer: true,
          onRowChange: row =>
          {
            this.props.setSelectedStar(row.content.props.star);
          },
        }),
      )
    );
  }
}

export const ManufactoryStarsList: React.Factory<PropTypes> = React.createFactory(ManufactoryStarsListComponent);
