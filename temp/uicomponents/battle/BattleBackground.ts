/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

import Renderer from "../../../src/Renderer.ts";

export interface PropTypes extends React.Props<any>
{
  getBlurArea: () => ClientRect;
  backgroundSeed: string;
  renderer: Renderer;
}

interface StateType
{
}

interface RefTypes extends React.Refs
{
  pixiContainer: HTMLElement;
}

class BattleBackground_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "BattleBackground";

  state: StateType;
  refs: RefTypes;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleResize = this.handleResize.bind(this);  
  }
  
  handleResize()
  {
    // TODO this seems to trigger before any breakpoints, leading to 1 px immediately after
    // breakpoint where blurArea isnt correctly determined
    var blurArea = this.props.getBlurArea();

    this.props.renderer.blurProps =
    [
      blurArea.left,
      blurArea.top,
      blurArea.width,
      blurArea.height,
      this.props.backgroundSeed
    ];
  }

  componentDidMount()
  {
    this.props.renderer.isBattleBackground = true;

    this.props.renderer.bindRendererView(React.findDOMNode<HTMLElement>(this.refs.pixiContainer));

    window.addEventListener("resize", this.handleResize, false);
  }

  componentWillUnmount()
  {
    window.removeEventListener("resize", this.handleResize);
    this.props.renderer.removeRendererView();
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "battle-pixi-container",
        ref: "pixiContainer"
      },
        this.props.children
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BattleBackground_COMPONENT_TODO);
export default Factory;
