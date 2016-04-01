/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class EmptyUnit extends React.Component<PropTypes, {}>
{
  displayName: string = "EmptyUnit";
  shouldComponentUpdate(newProps: any)
  {
    return newProps.facesLeft === this.props.facesLeft;
  }
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    var wrapperProps: any =
    {
      className: "unit empty-unit"
    };

    var containerProps =
    {
      className: "unit-container",
      key: "container"
    };

    if (this.props.facesLeft)
    {
      wrapperProps.className += " enemy-unit";
    }
    else
    {
      wrapperProps.className += " friendly-unit";
    }

    var allElements =
    [
      React.DOM.div(containerProps,
        null
      ),
      UIComponents.UnitIcon(
        {
          icon: null,
          facesLeft: this.props.facesLeft,
          key: "icon"
        })
    ];

    if (this.props.facesLeft)
    {
      allElements = allElements.reverse();
    }
    
    return(
      React.DOM.div(wrapperProps,
        allElements
      )
    );
  }
}
