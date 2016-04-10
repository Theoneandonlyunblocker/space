/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class Resource_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "Resource";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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

const Factory: React.Factory<PropTypes> = React.createFactory(Resource_COMPONENT_TODO);
export default Factory;
