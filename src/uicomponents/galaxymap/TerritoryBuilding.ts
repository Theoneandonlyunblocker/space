import * as React from "react";

import app from "../../App"; // TODO global

import {TerritoryBuilding} from "../../Building";
import {colorImageInPlayerColor} from "../../utility";
import PlayerFlag from "../PlayerFlag";


export interface PropTypes extends React.Props<any>
{
  building: TerritoryBuilding;
}

interface StateType
{
}

export class TerritoryBuildingComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "TerritoryBuilding";
  shouldComponentUpdate(newProps: PropTypes)
  {
    return newProps.building !== this.props.building;
  }
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const building = this.props.building;
    const image = app.images[building.template.iconSrc];

    return(
      React.DOM.div(
      {
        className: "territory-building",
      },
        React.DOM.img(
        {
          className: "territory-building-icon",
          src: colorImageInPlayerColor(image, building.controller),
          title: building.template.displayName,
        }),
        PlayerFlag(
        {
          props:
          {
            className: "territory-building-controller",
            title: building.controller.name.fullName,
          },
          key: "flag",
          flag: building.controller.flag,
        }),
      )
    );
  }

}

const factory: React.Factory<PropTypes> = React.createFactory(TerritoryBuildingComponent);
export default factory;
