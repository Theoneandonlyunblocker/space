/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../playerflag.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class DefenceBuilding extends React.Component<PropTypes, {}>
{
  displayName: string = "DefenceBuilding";
  shouldComponentUpdate(newProps: any)
  {
    return newProps.building !== this.props.building;
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
    var building: Building = this.props.building;
    var image = app.images[building.template.iconSrc];

    return(
      React.DOM.div(
      {
        className: "defence-building"
      },
        React.DOM.img(
        {
          className: "defence-building-icon",
          src: colorImageInPlayerColor(image, building.controller),
          title: building.template.displayName
        }),
        UIComponents.PlayerFlag(
        {
          props:
          {
            className: "defence-building-controller",
            title: building.controller.name
          },
          key: "flag",
          flag: building.controller.flag
        })
      )
    );
  }

}
