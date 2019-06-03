import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import Player from "../../../../src/Player";
import Star from "../../../../src/Star";
import {BuildingTemplate} from "../../../../src/templateinterfaces/BuildingTemplate";
import List from "../list/List";
import ListColumn from "../list/ListColumn";
import ListItem from "../list/ListItem";

import {default as BuildableBuilding, PropTypes as BuildableBuildingProps} from "./BuildableBuilding";


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
  public state: StateType;

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

  render()
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
        label: localize("buildingTypeName")(),
        key: "typeName",
        defaultOrder: "asc",
      },
      {
        label: localize("buildingCost")(),
        key: "buildCost",
        defaultOrder: "desc",
      },

    ];

    return(
      ReactDOMElements.div({className: "buildable-item-list buildable-building-list fixed-table-parent"},
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

const factory: React.Factory<PropTypes> = React.createFactory(BuildableBuildingListComponent);
export default factory;
