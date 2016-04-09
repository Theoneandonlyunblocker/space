/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class UnitPortrait extends React.Component<PropTypes, {}>
{
  displayName: string = "UnitPortrait";
  state:
  {
    
  }

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
    var props: any = {};
    props.className = "unit-portrait " + (this.props.className || "");
    if (this.props.imageSrc)
    {
      props.style = 
      {
        backgroundImage: 'url("' + this.props.imageSrc + '")'
      }
    }

    return(
      React.DOM.div(props,
        null
      )
    );
  }
}
