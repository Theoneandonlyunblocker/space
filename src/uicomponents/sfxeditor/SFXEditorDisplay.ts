/// <reference path="../../../lib/react-global.d.ts" />

import SFXFragment from "../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

interface PropTypes extends React.Props<any>
{
  hasDraggingFragment: boolean;
  moveDraggingFragment: (e: React.MouseEvent) => void;
}

interface StateType
{
}

export class SFXEditorDisplayComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXEditorDisplay";
  state: StateType;

  public containerDiv: HTMLDivElement;
  
  renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  container: PIXI.Container;
  fragments: SFXFragment<any, any>[] = [];
  
  constructor(props: PropTypes)
  {
    super(props);

    this.renderer = PIXI.autoDetectRenderer(0, 0,
    {
      autoResize: false
    });

    this.container = new PIXI.Container();

    
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
    const containerBounds = this.containerDiv.getBoundingClientRect();
    this.renderer.resize(containerBounds.width, containerBounds.height);
  }

  private bindRendererView(): void
  {
    this.containerDiv.appendChild(this.renderer.view);
    this.handleResize();
  }

  public addFragment(fragment: SFXFragment<any, any>): void
  {
    this.container.addChild(fragment.displayObject);
    this.fragments.push(fragment);
    this.updateRenderer();
  }
  public removeFragment(fragment: SFXFragment<any, any>): void
  {
    this.container.removeChild(fragment.displayObject);
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
    this.renderer.render(this.container);
  }

  
  render()
  {
    return(
      React.DOM.div(
      {
        className: "sfx-editor-display",
        ref: (element) =>
        {
          this.containerDiv = element;
        },
        onMouseMove: !this.props.hasDraggingFragment ? null :
          this.props.moveDraggingFragment
      },
        
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXEditorDisplayComponent);
export default Factory;
