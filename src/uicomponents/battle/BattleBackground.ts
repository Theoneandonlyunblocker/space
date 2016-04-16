/// <reference path="../../../lib/react-0.13.3.d.ts" />

import Renderer from "../../Renderer";

interface PropTypes extends React.Props<any>
{
  getBlurArea: () => ClientRect;
  backgroundSeed: string;
  renderer: Renderer;
}

interface StateType
{
}

export class BattleBackgroundComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "BattleBackground";
  state: StateType;
  
  ref_TODO_pixiContainer: React.HTMLComponent;

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

    this.props.renderer.bindRendererView(React.findDOMNode<HTMLElement>(this.ref_TODO_pixiContainer));

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
        ref: (component: React.HTMLComponent) =>
        {
          this.ref_TODO_pixiContainer = component;
        }
      },
        this.props.children
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BattleBackgroundComponent);
export default Factory;
