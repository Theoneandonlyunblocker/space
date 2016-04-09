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

class UnitPortrait extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitPortrait";
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

const Factory: React.Factory<PropTypes> = React.createFactory(UnitPortrait);
export default Factory;
