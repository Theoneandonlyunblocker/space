import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Rect} from "src/math/Rect";

import
{
  WindowContainer,
  WindowContainerComponent,
} from "./WindowContainer";


const cssPropertyPrefix = "--spacegame-window-";
const prefixedCssPropertyMap =
{
  minWidth: cssPropertyPrefix + "min-width",
  minHeight: cssPropertyPrefix + "min-height",
  maxWidth: cssPropertyPrefix + "max-width",
  maxHeight: cssPropertyPrefix + "max-height",
};

type SizeBounds =
{
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
};

export interface PropTypes extends React.Props<any>
{
  title: string;
  handleClose: () => void;
  isResizable?: boolean;
  getInitialPosition?: (ownRect: Rect, container: HTMLElement) => Rect;
  attributes?: React.HTMLAttributes<HTMLDivElement>;
}

interface StateType
{
  sizeBounds: SizeBounds;
}

export class DefaultWindowComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "DefaultWindow";
  public state: StateType;

  public readonly windowContainerComponent = React.createRef<WindowContainerComponent>();
  private readonly contentContainerElement = React.createRef<HTMLDivElement>();
  private readonly titleBarElement = React.createRef<HTMLDivElement>();


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
        containingAreaElement: document.body,
        getInitialPosition: this.props.getInitialPosition,
        isResizable: this.props.isResizable === false ? false : true,
        attributes: this.props.attributes,

        minWidth: this.state.sizeBounds.minWidth,
        minHeight: this.state.sizeBounds.minHeight,
        maxWidth: this.state.sizeBounds.maxWidth,
        maxHeight: this.state.sizeBounds.maxHeight,

        ref: this.windowContainerComponent,
      },
        ReactDOMElements.div(
        {
          className: "window",
        },
          ReactDOMElements.div(
          {
            className: "window-title-bar draggable",
            onMouseDown: this.handleTitleBarMouseDown,
            onTouchStart: this.handleTitleBarMouseDown,
            ref: this.titleBarElement,
          },
            ReactDOMElements.div(
            {
              className: "window-title",
            },
              this.props.title,
            ),
            ReactDOMElements.button(
            {
              className: "window-close-button",
              onClick: this.props.handleClose,
            }),
          ),
          ReactDOMElements.div(
          {
            className: "window-content",
            ref: this.contentContainerElement,
          },
            this.props.children,
          ),
        ),
      )
    );
  }

  private handleTitleBarMouseDown(e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>): void
  {
    this.windowContainerComponent.current.onMouseDown(e);
  }
  private getContentSizeBounds(): Partial<SizeBounds>
  {
    const bounds: Partial<SizeBounds> = {};

    const contentElements = this.contentContainerElement.current.children;

    for (let i = 0; i < contentElements.length; i++)
    {
      const contentElement = contentElements[i];

      const contentElementStyle = window.getComputedStyle(contentElement);
      const titleBarHeight = this.titleBarElement.current.getBoundingClientRect().height;


      for (const prop in this.state.sizeBounds)
      {
        const prefixedPropName = prefixedCssPropertyMap[prop];
        const valueString = contentElementStyle.getPropertyValue(prefixedPropName);

        if (valueString !== "")
        {
          let propValue = parseInt(valueString);
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

// tslint:disable-next-line:variable-name
export const DefaultWindow: React.Factory<PropTypes> = React.createFactory(DefaultWindowComponent);
