import * as React from "react";

import ResourceTemplate from "../../templateinterfaces/ResourceTemplate";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  resource: ResourceTemplate;
  amount: number;
  income: number;
}

interface StateType
{
}

export class ResourceComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "Resource";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const sign = this.props.income < 0 ? "" : "+";

    return(
      React.DOM.div(
      {
        className: "resource",
        title: this.props.resource.displayName + "",
      },
        React.DOM.img(
        {
          className: "resource-icon",
          src: this.props.resource.icon,
        },
          null,
        ),
        React.DOM.div(
        {
          className: "resource-amount",
        },
          `${this.props.amount} (${sign}${this.props.income} ${localize("perTurn")()})`,
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(ResourceComponent);
export default factory;
