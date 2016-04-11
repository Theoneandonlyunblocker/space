/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes extends React.Props<any>
{
  className: any; // TODO refactor | define prop type 123
  imageSrc: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

class UnitPortrait_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitPortrait";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
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

const Factory: React.Factory<PropTypes> = React.createFactory(UnitPortrait_COMPONENT_TODO);
export default Factory;
