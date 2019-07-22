import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {VfxFragment} from "../../../../modules/space/battlevfx/drawingfunctions/vfxfragments/VfxFragment";


export interface PropTypes extends React.Props<any>
{
  hasDraggingFragment: boolean;
  moveDraggingFragment: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface StateType
{
}

export class VfxEditorDisplayComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "VfxEditorDisplay";
  public state: StateType;

  public containerDiv: HTMLDivElement | null;

  renderer: PIXI.Renderer;
  stage: PIXI.Container;
  fragmentContainer: PIXI.Container;
  fragments: VfxFragment<any>[] = [];

  constructor(props: PropTypes)
  {
    super(props);

    this.renderer = new PIXI.Renderer(
    {
      width: 0,
      height: 0,
      autoDensity: false,
    });

    this.stage = new PIXI.Container();
    this.fragmentContainer = new PIXI.Container();
    this.stage.addChild(this.fragmentContainer);


    this.updateRenderer = this.updateRenderer.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount(): void
  {
    this.bindRendererView();
    this.updateRenderer();

    window.addEventListener("resize", this.handleResize, false);
  }

  componentWillUnmount(): void
  {
    window.removeEventListener("resize", this.handleResize);
  }

  private handleResize(): void
  {
    const containerBounds = this.containerDiv!.getBoundingClientRect();
    this.renderer.resize(containerBounds.width, containerBounds.height);
  }

  private bindRendererView(): void
  {
    this.containerDiv!.appendChild(this.renderer.view);
    this.handleResize();
  }

  public addFragment(fragment: VfxFragment<any>): void
  {
    this.fragmentContainer.addChild(fragment.displayObject);
    this.fragments.push(fragment);
    this.updateRenderer();
  }
  public removeFragment(fragment: VfxFragment<any>): void
  {
    this.fragmentContainer.removeChild(fragment.displayObject);
    this.fragments.splice(this.fragments.indexOf(fragment), 1);
    this.updateRenderer();
  }
  public animateFragments(relativeTime: number): void
  {
    this.fragments.forEach(fragment =>
    {
      fragment.animate(relativeTime);
    });
  }
  public updateRenderer(): void
  {
    this.renderer.render(this.stage);
  }


  render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "vfx-editor-display",
        ref: element =>
        {
          this.containerDiv = element;
        },
        onMouseMove: !this.props.hasDraggingFragment ? undefined :
          this.props.moveDraggingFragment,
      },

      )
    );
  }
}

export const VfxEditorDisplay: React.Factory<PropTypes> = React.createFactory(VfxEditorDisplayComponent);
