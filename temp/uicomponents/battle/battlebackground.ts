/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/*
props

  renderer
  backgroundSeed
  getBlurAreaFN()
 */
export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class BattleBackground extends React.Component<PropTypes, StateType>
{
  displayName: string = "BattleBackground";

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

    this.props.renderer.bindRendererView(this.refs.pixiContainer.getDOMNode());

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

const Factory = React.createFactory(BattleBackground);
export default Factory;
