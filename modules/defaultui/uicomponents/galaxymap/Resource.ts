import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import ResourceTemplate from "../../../../src/templateinterfaces/ResourceTemplate";


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
      ReactDOMElements.div(
      {
        className: "resource",
        title: this.props.resource.displayName + "",
      },
        ReactDOMElements.img(
        {
          className: "resource-icon",
          src: this.props.resource.getIconSrc(),
        },
          null,
        ),
        ReactDOMElements.div(
        {
          className: "resource-amount",
        },
          `${this.props.amount}`,
        ),
        ReactDOMElements.div(
        {
          className: "resource-income",
        },
          `(${sign}${this.props.income})`,
        )
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(ResourceComponent);
export default factory;
