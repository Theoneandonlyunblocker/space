import * as React from "react";

import
{
  default as WindowContainer,
  WindowContainerComponent,
} from "./WindowContainer";

import {Rect} from "../../Rect";


type SizeBounds =
{
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
};

interface PropTypes extends React.Props<any>
{
  title: string;
  handleClose: () => void;
  isResizable?: boolean;
  getInitialPosition?: (ownRect: Rect, container: HTMLElement) => Rect;
}

interface StateType
{
  sizeBounds: SizeBounds;
}

export class DefaultWindowComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "DefaultWindow";
  public state: StateType;

  public windowContainerComponent: WindowContainerComponent;
  private contentContainerElement: HTMLDivElement | null;
  private titleBarElement: HTMLDivElement | null;


  constructor(props: PropTypes)
  {
    super(props);

    this.handleTitleBarMouseDown = this.handleTitleBarMouseDown.bind(this);
    this.getContentSizeBounds = this.getContentSizeBounds.bind(this);

    this.state =
    {
      sizeBounds:
      {
        minWidth: 100,
        minHeight: 100,
        maxWidth: Infinity,
        maxHeight: Infinity,
      },
    };
  }

  public componentDidMount(): void
  {
    this.setState(
    {
      sizeBounds: {...this.state.sizeBounds, ...this.getContentSizeBounds()},
    });
  }
  public render()
  {
    return(
      WindowContainer(
      {
        isResizable: this.props.isResizable === false ? false : true,
        containerElement: document.body,

        minWidth: this.state.sizeBounds.minWidth,
        minHeight: this.state.sizeBounds.minHeight,
        maxWidth: this.state.sizeBounds.maxWidth,
        maxHeight: this.state.sizeBounds.maxHeight,

        ref: (component: WindowContainerComponent) =>
        {
          this.windowContainerComponent = component;
        },
      },
        React.DOM.div(
        {
          className: "window",
        },
          React.DOM.div(
          {
            className: "window-title-bar draggable",
            onMouseDown: this.handleTitleBarMouseDown,
            onTouchStart: this.handleTitleBarMouseDown,
            ref: element => this.titleBarElement = element,
          },
            React.DOM.div(
            {
              className: "window-title",
            },
              this.props.title,
            ),
            React.DOM.button(
            {
              className: "window-close-button",
              onClick: this.props.handleClose,
            }),
          ),
          React.DOM.div(
          {
            className: "window-content",
            ref: element => this.contentContainerElement = element,
          },
            this.props.children,
          ),
        ),
      )
    );
  }

  private handleTitleBarMouseDown(e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>): void
  {
    this.windowContainerComponent.onMouseDown(e);
  }
  private getContentSizeBounds(): Partial<SizeBounds>
  {
    const bounds: Partial<SizeBounds> = {};

    const contentElements = this.contentContainerElement!.children;

    for (let i = 0; i < contentElements.length; i++)
    {
      const contentElement = contentElements[i];

      const contentElementStyle = getComputedStyle(contentElement);
      const titleBarHeight = this.titleBarElement!.getBoundingClientRect().height;


      for (let prop in this.state.sizeBounds)
      {
        if (contentElementStyle[prop] !== "none")
        {
          let propValue = parseInt(contentElementStyle[prop]);
          if (prop === "minHeight" || prop === "maxHeight")
          {
            propValue += titleBarHeight;
          }

          if (!isFinite(bounds[prop]))
          {
            bounds[prop] = propValue;
          }
          else if (prop.substring(0, 3) === "min")
          {
            bounds[prop] = Math.max(bounds[prop], propValue);
          }
          else
          {
            bounds[prop] = Math.min(bounds[prop], propValue);
          }
        }
      }
    }

    return bounds;
  }
}

export const DefaultWindow: React.Factory<PropTypes> = React.createFactory(DefaultWindowComponent);
export default DefaultWindow;
