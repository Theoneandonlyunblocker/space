/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes extends React.Props<any>
{
  handleClose: any; // TODO refactor | define prop type 123
  contentConstructor: any; // TODO refactor | define prop type 123
  contentProps: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

class TopMenuPopup_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "TopMenuPopup";

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

const Factory: React.Factory<PropTypes> = React.createFactory(TopMenuPopup_COMPONENT_TODO);
export default Factory;
