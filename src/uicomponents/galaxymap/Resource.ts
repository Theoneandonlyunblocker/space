/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

import ResourceTemplate from "../../templateinterfaces/ResourceTemplate";

interface PropTypes extends React.Props<any>
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
  displayName: string = "Resource";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    var sign = this.props.income < 0 ? "-" : "+";
    return(
      React.DOM.div(
      {
        className: "resource",
        title: this.props.resource.displayName + ""
      },
        React.DOM.img(
        {
          className: "resource-icon",
          src: this.props.resource.icon
        },
          null
        ),
        React.DOM.div(
        {
          className: "resource-amount"
        },
          "" + this.props.amount + " (" + sign + this.props.income + ")"
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ResourceComponent);
export default Factory;
