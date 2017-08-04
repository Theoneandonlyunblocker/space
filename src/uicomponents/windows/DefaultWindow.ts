import * as React from "react";

import
{
  default as WindowContainer,
  WindowContainerComponent,
} from "./WindowContainer";

import {Rect} from "../../Rect";

interface PropTypes extends React.Props<any>
{
  title: string;
  handleClose: () => void;
  isResizable?: boolean;
  getInitialPosition?: (ownRect: Rect, container: HTMLElement) => Rect;

  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;
}

interface StateType
{
}

export class DefaultWindowComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "DefaultWindow";
  public state: StateType;

  public windowContainerComponent: WindowContainerComponent;

  constructor(props: PropTypes)
  {
    super(props);

    this.handleTitleBarMouseDown = this.handleTitleBarMouseDown.bind(this);
  }

  public render()
  {
    return(
      WindowContainer(
      {
        isResizable: this.props.isResizable === false ? false : true,
        containerElement: document.body,

        minWidth: this.props.minWidth,
        minHeight: this.props.minHeight,
        maxWidth: this.props.maxWidth || Infinity,
        maxHeight: this.props.maxHeight || Infinity,

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
}

export const DefaultWindow: React.Factory<PropTypes> = React.createFactory(DefaultWindowComponent);
export default DefaultWindow;
