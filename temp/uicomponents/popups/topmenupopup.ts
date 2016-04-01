/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class TopMenuPopup extends React.Component<PropTypes, {}>
{
  displayName: string = "TopMenuPopup";

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
    var contentProps = this.props.contentProps;
    contentProps.ref = "content";

    return(
      React.DOM.div(
      {
        className: "top-menu-popup-container draggable-container"
      },
        React.DOM.button(
        {
          className: "light-box-close",
          onClick: this.props.handleClose
        }, "X"),
        React.DOM.div(
        {
          className: "light-box-content"
        },
          this.props.contentConstructor(contentProps)
        )
      )
    );
  }
}
