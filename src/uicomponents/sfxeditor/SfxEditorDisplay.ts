import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import SfxFragment from "../../../modules/common/battlesfxfunctions/sfxfragments/SfxFragment";


interface PropTypes extends React.Props<any>
{
  hasDraggingFragment: boolean;
  moveDraggingFragment: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface StateType
{
}

export class SfxEditorDisplayComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SfxEditorDisplay";
  public state: StateType;

  public containerDiv: HTMLDivElement | null;

  renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  stage: PIXI.Container;
  fragmentContainer: PIXI.Container;
  fragments: SfxFragment<any>[] = [];

  constructor(props: PropTypes)
  {
    super(props);

    this.renderer = PIXI.autoDetectRenderer(0, 0,
    {
      autoResize: false,
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

  public addFragment(fragment: SfxFragment<any>): void
  {
    this.fragmentContainer.addChild(fragment.displayObject);
    this.fragments.push(fragment);
    this.updateRenderer();
  }
  public removeFragment(fragment: SfxFragment<any>): void
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
        className: "sfx-editor-display",
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

const factory: React.Factory<PropTypes> = React.createFactory(SfxEditorDisplayComponent);
export default factory;
