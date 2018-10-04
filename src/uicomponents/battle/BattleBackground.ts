import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import * as ReactDOM from "react-dom";

import BackgroundDrawer from "../../BackgroundDrawer";
import BackgroundDrawingFunction from "../../BackgroundDrawingFunction";
import {convertClientRectToPixiRect} from "../../pixiWrapperFunctions";


export interface PropTypes extends React.Props<any>
{
  getBlurArea: () => ClientRect;
  backgroundSeed: string;
  backgroundDrawingFunction: BackgroundDrawingFunction;
}

interface StateType
{
}

export class BattleBackgroundComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "BattleBackground";
  public state: StateType;

  pixiContainer: HTMLElement;
  backgroundDrawer: BackgroundDrawer;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
    this.backgroundDrawer = new BackgroundDrawer(
    {
      seed: this.props.backgroundSeed,
      drawBackgroundFN: this.props.backgroundDrawingFunction,
    });
  }
  private bindMethods()
  {
    this.handleResize = this.handleResize.bind(this);
  }
  public componentWillReceiveProps(newProps: PropTypes)
  {
    const propsToCheck = ["getBlurArea", "backgroundSeed", "backgroundDrawingFunction"];
    for (const prop of propsToCheck)
    {
      if (this.props[prop] !== newProps[prop])
      {
        this.handleResize();
        break;
      }
    }
  }
  public handleResize()
  {

    // TODO 2017.04.01 | this seems to trigger before any breakpoints,
    // leading to 1 px immediately after breakpoint where blurArea isnt correctly determined
    const blurarea = this.props.getBlurArea();
    this.backgroundDrawer.blurArea = convertClientRectToPixiRect(blurarea);
    this.backgroundDrawer.handleResize();
  }
  public componentDidMount()
  {
    const containerElement = ReactDOM.findDOMNode<HTMLElement>(this.pixiContainer);

    this.backgroundDrawer.bindRendererView(containerElement);

    window.addEventListener("resize", this.handleResize, false);
  }

  componentWillUnmount()
  {
    window.removeEventListener("resize", this.handleResize);
    this.backgroundDrawer.destroy();
  }

  render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "battle-pixi-container",
        ref: (component: HTMLElement) =>
        {
          this.pixiContainer = component;
        },
      },
        this.props.children,
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(BattleBackgroundComponent);
export default factory;
