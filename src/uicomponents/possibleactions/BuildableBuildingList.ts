import * as React from "react";


import Building from "../../Building";
import Player from "../../Player";
import Star from "../../Star";
import BuildingTemplate from "../../templateinterfaces/BuildingTemplate";
import List from "../list/List";
import ListColumn from "../list/ListColumn";
import ListItem from "../list/ListItem";
import {default as BuildableBuilding, PropTypes as BuildableBuildingProps} from "./BuildableBuilding";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  clearExpandedAction: () => void;
  star: Star;
  player: Player;
}

interface StateType
{
  buildingTemplates: BuildingTemplate[];
}

export class BuildableBuildingListComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "BuildableBuildingList";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.buildBuilding = this.buildBuilding.bind(this);
    this.updateBuildings = this.updateBuildings.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      buildingTemplates: this.props.star.getBuildableBuildings(),
    });
  }

  updateBuildings()
  {
    const buildingTemplates = this.props.star.getBuildableBuildings();
    this.setState(
    {
      buildingTemplates: buildingTemplates,
    });

    if (buildingTemplates.length < 1)
    {
      this.props.clearExpandedAction();
    }
  }

  buildBuilding(rowItem: ListItem<BuildableBuildingProps>)
  {
    const template = rowItem.content.props.template;

    const building = new Building(
    {
      template: template,
      location: this.props.star,
    });

    if (!building.controller)
    {
      building.controller = this.props.player;
    }

    this.props.star.addBuilding(building);
    building.controller.money -= template.buildCost;
    this.updateBuildings();
  }

  render()
  {
    if (this.state.buildingTemplates.length < 1) return null;
    const rows: ListItem<BuildableBuildingProps>[] = [];

    for (let i = 0; i < this.state.buildingTemplates.length; i++)
    {
      const template: BuildingTemplate = this.state.buildingTemplates[i];

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
        label: localize("buildingTypeName"),
        key: "typeName",
        defaultOrder: "asc",
      },
      {
        label: localize("buildingCost"),
        key: "buildCost",
        defaultOrder: "desc",
      },

    ];

    return(
      React.DOM.div({className: "buildable-item-list buildable-building-list fixed-table-parent"},
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

const Factory: React.Factory<PropTypes> = React.createFactory(BuildableBuildingListComponent);
export default Factory;
