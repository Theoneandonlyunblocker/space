import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {TerritoryBuilding as TerritoryBuildingObj} from "../../../../src/Building";

import {TerritoryBuilding} from "./TerritoryBuilding";


export interface PropTypes extends React.Props<any>
{
  buildings: TerritoryBuildingObj[];
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
      return TerritoryBuilding(
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

export const TerritoryBuildingList: React.Factory<PropTypes> = React.createFactory(TerritoryBuildingListComponent);
