import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {BackgroundDrawer} from "core/src/graphics/BackgroundDrawer";
import {BackgroundDrawingFunction} from "core/src/graphics/BackgroundDrawingFunction";
import {convertClientRectToPixiRect} from "core/src/graphics/pixiWrapperFunctions";


export interface PropTypes extends React.Props<any>
{
  getBlurArea?: () => ClientRect;
  backgroundSeed: string;
  backgroundDrawingFunction: BackgroundDrawingFunction;
}

interface StateType
{
}

export class BattleBackgroundComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "BattleBackground";
  public override state: StateType;

  public readonly pixiContainer = React.createRef<HTMLDivElement>();
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
  public override componentDidUpdate(prevProps: PropTypes)
  {
    const propsToCheck = ["getBlurArea", "backgroundSeed", "backgroundDrawingFunction"];
    for (const prop of propsToCheck)
    {
      if (this.props[prop] !== prevProps[prop])
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
    if (this.props.getBlurArea)
    {
      const blurarea = this.props.getBlurArea();
      this.backgroundDrawer.blurArea = convertClientRectToPixiRect(blurarea);
    }

    this.backgroundDrawer.handleResize();
  }
  public override componentDidMount()
  {
    this.backgroundDrawer.bindRendererView(this.pixiContainer.current);

    window.addEventListener("resize", this.handleResize, false);
  }

  public override componentWillUnmount()
  {
    window.removeEventListener("resize", this.handleResize);
    this.backgroundDrawer.destroy();
  }

  public override render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "battle-pixi-container",
        ref: this.pixiContainer,
      },
        this.props.children,
      )
    );
  }
}

export const BattleBackground: React.Factory<PropTypes> = React.createFactory(BattleBackgroundComponent);
