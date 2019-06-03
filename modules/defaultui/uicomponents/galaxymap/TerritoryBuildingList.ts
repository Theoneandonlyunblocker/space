import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {TerritoryBuilding} from "../../../../src/Building";

import {default as TerritoryBuildingComponent} from "./TerritoryBuilding";


export interface PropTypes extends React.Props<any>
{
  buildings: TerritoryBuilding[];
  reverse?: boolean;
}

interface StateType
{
}

export class TerritoryBuildingListComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "TerritoryBuildingList";
  shouldComponentUpdate(newProps: PropTypes)
  {
    const newBuildings = newProps.buildings;
    const oldBuildings = this.props.buildings;
    if (newBuildings.length !== oldBuildings.length) { return true; }
    else
    {
      for (let i = 0; i < newBuildings.length; i++)
      {
        if (oldBuildings.indexOf(newBuildings[i]) === -1) { return true; }
      }
    }

    return false;
  }
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    if (!this.props.buildings)
    {
      return null;
    }

    const buildings = this.props.buildings.map(building =>
    {
      return TerritoryBuildingComponent(
      {
        key: building.id,
        building: building,
      });
    });

    if (this.props.reverse)
    {
      buildings.reverse();
    }

    return(
      ReactDOMElements.div(
      {
        className: "territory-building-list",
      },
        buildings,
      )
    );
  }

}

const factory: React.Factory<PropTypes> = React.createFactory(TerritoryBuildingListComponent);
export default factory;
