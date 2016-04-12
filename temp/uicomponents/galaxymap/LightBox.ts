/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

interface PropTypes extends React.Props<any>
{
  handleClose: any; // TODO refactor | define prop type 123
  contentConstructor: any; // TODO refactor | define prop type 123
  contentProps: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

interface RefTypes extends React.Refs
{
  wrapper: HTMLElement;
  container: HTMLElement;
  content: HTMLElement;
}

export class LightBoxComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "LightBox";

  // far from ideal as it always triggers reflow 4 times
  // cant figure out how to do resizing better since content size is dynamic
  state: StateType;
  refsTODO: RefTypes;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleResize = this.handleResize.bind(this);
    this.handleClose = this.handleClose.bind(this);    
  }
  
  handleResize()
  {
    var container = React.findDOMNode<HTMLElement>(this.ref_TODO_container);
    var wrapperRect = React.findDOMNode<HTMLElement>(this.ref_TODO_wrapper).getBoundingClientRect();
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

    if (this.ref_TODO_content.overRideLightBoxClose)
    {
      this.ref_TODO_content.overRideLightBoxClose();
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
        ref: (component: TODO_TYPE) =>
{
  this.ref_TODO_wrapper = component;
}
      },
        React.DOM.div(
        {
          className: "light-box-container",
          ref: (component: TODO_TYPE) =>
{
  this.ref_TODO_container = component;
}
        },
          React.DOM.button(
          {
            className: "light-box-close",
            onClick: this.handleClose
          }, "X"),
          React.DOM.div(
          {
            className: "light-box-content",
            ref: (component: TODO_TYPE) =>
{
  this.ref_TODO_content = component;
}
          },
            this.props.contentConstructor(contentProps)
          )
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(LightBoxComponent);
export default Factory;
