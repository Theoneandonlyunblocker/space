import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {TerritoryBuilding} from "../../Building";
import PlayerFlag from "../PlayerFlag";


export interface PropTypes extends React.Props<any>
{
  building: TerritoryBuilding;
}

interface StateType
{
}

export class TerritoryBuildingComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "TerritoryBuilding";
  public state: StateType;

  private iconContainer = React.createRef<HTMLDivElement>();

  constructor(props: PropTypes)
  {
    super(props);
  }

  public componentDidMount(): void
  {
    this.setIconContent();
  }
  public componentDidUpdate(): void
  {
    this.setIconContent();
  }
  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "territory-building",
      },
        ReactDOMElements.div(
        {
          className: "territory-building-icon",
          ref: this.iconContainer,
          title: this.props.building.template.displayName,
        }),
        PlayerFlag(
        {
          props:
          {
            className: "territory-building-controller",
            title: this.props.building.controller.name.fullName,
          },
          key: "flag",
          flag: this.props.building.controller.flag,
        }),
      )
    );
  }

  private setIconContent(): void
  {
    const container = this.iconContainer.current;
    while (container.firstChild)
    {
      container.removeChild(container.firstChild);
    }

    container.appendChild(this.props.building.template.getIconElement(this.props.building.controller.color));
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(TerritoryBuildingComponent);
export default factory;
