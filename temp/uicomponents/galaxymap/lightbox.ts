/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class LightBox extends React.Component<PropTypes, {}>
{
  displayName: string = "LightBox";

  // far from ideal as it always triggers reflow 4 times
  // cant figure out how to do resizing better since content size is dynamic
  state:
  {
    
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
  
  handleResize()
  {
    var container = this.refs.container.getDOMNode();
    var wrapperRect = this.refs.wrapper.getDOMNode().getBoundingClientRect();
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
