import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {Player} from "core/src/player/Player";
import {Star} from "core/src/map/Star";
import {BuildingTemplate} from "core/src/templateinterfaces/BuildingTemplate";
import {List} from "../list/List";
import {ListColumn} from "../list/ListColumn";
import {ListItem} from "../list/ListItem";

import {BuildableBuilding, PropTypes as BuildableBuildingProps} from "./BuildableBuilding";


export interface PropTypes extends React.Props<any>
{
  buildableBuildings: BuildingTemplate[];
  star: Star;
  player: Player;
}

interface StateType
{
}

export class BuildableBuildingListComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "BuildableBuildingList";
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = {};

    this.bindMethods();
  }
  private bindMethods()
  {
    this.buildBuilding = this.buildBuilding.bind(this);
  }

  buildBuilding(rowItem: ListItem<BuildableBuildingProps>)
  {
    const template = rowItem.content.props.template;
    this.props.player.buildBuilding(template, this.props.star);
    this.forceUpdate();
  }

  public override render()
  {
    const buildableBuildings = this.props.buildableBuildings;

    const rows: ListItem<BuildableBuildingProps>[] = [];

    for (let i = 0; i < buildableBuildings.length; i++)
    {
      const template: BuildingTemplate = buildableBuildings[i];

      rows.push(
      {
        key: template.type,
        content: BuildableBuilding(
        {
          template: template,

          typeName: template.displayName,
          buildCost: template.buildCost,
          player: this.props.player,
        }),
      });
    }

    const columns: ListColumn<BuildableBuildingProps>[] =
    [
      {
        label: localize("displayName").toString(),
        key: "typeName",
        defaultOrder: "asc",
      },
      {
        label: localize("cost").toString(),
        key: "buildCost",
        defaultOrder: "desc",
      },

    ];

    return(
      ReactDOMElements.div({className: "buildable-building-list"},
        List(
        {
          listItems: rows,
          initialColumns: columns,
          onRowChange: this.buildBuilding,
          addSpacer: true,
        }),
      )
    );
  }
}

export const BuildableBuildingList: React.Factory<PropTypes> = React.createFactory(BuildableBuildingListComponent);
