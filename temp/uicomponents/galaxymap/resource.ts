/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class Resource extends React.Component<PropTypes, {}>
{
  displayName: string = "Resource";
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
