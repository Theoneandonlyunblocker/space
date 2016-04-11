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

class LightBox_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "LightBox";

  // far from ideal as it always triggers reflow 4 times
  // cant figure out how to do resizing better since content size is dynamic
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  handleResize()
  {
    var container = React.findDOMNode(this.refs.container);
    var wrapperRect = React.findDOMNode(this.refs.wrapper).getBoundingClientRect();
    container.classList.remove("light-box-horizontal-padding");
    container.classList.remove("light-box-fill-horizontal");

    container.classList.remove("light-box-vertical-padding");
    container.classList.remove("light-box-fill-vertical");


    if (container.getBoundingClientRect().width + 10 + wrapperRect.left < window.innerWidth)
    {
      container.classList.add("light-box-horizontal-padding");
    }
    else
    {
      container.classList.add("light-box-fill-horizontal");
    }

    if (container.getBoundingClientRect().height + 10 + wrapperRect.top < window.innerHeight)
    {
      container.classList.add("light-box-vertical-padding");
    }
    else
    {
      container.classList.add("light-box-fill-vertical");
    }
  }

  componentDidMount()
  {
    window.addEventListener("resize", this.handleResize, false);
    this.handleResize();
  }
  componentWillUnmount()
  {
    window.removeEventListener("resize", this.handleResize);
  }
  componentDidUpdate()
  {
    this.handleResize();
  }

  handleClose()
  {

    if (this.refs.content.overRideLightBoxClose)
    {
      this.refs.content.overRideLightBoxClose();
    }
    else
    {
      this.props.handleClose();
    }
  }

  render()
  {
    var contentProps = extendObject(this.props.contentProps);
    contentProps.ref = "content";
    return(
      React.DOM.div(
      {
        className: "light-box-wrapper",
        ref: "wrapper"
      },
        React.DOM.div(
        {
          className: "light-box-container",
          ref: "container"
        },
          React.DOM.button(
          {
            className: "light-box-close",
            onClick: this.handleClose
          }, "X"),
          React.DOM.div(
          {
            className: "light-box-content",
            ref: "content"
          },
            this.props.contentConstructor(contentProps)
          )
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(LightBox_COMPONENT_TODO);
export default Factory;
