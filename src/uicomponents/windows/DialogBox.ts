/// <reference path="../../../lib/react-global.d.ts" />

import {default as WindowContainer, WindowContainerComponent} from "./WindowContainer";

interface PropTypes extends React.Props<any>
{
  handleOk: () => void;
  handleCancel?: () => void;
  extraButtons?: React.ReactNode[];
  okText?: string;
  cancelText?: string;

  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

interface StateType
{
}

export class DialogBoxComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "DialogBox";
  public state: StateType;

  private okButtonElement: HTMLElement;
  private windowContainerComponent: WindowContainerComponent;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public componentDidMount()
  {
    ReactDOM.findDOMNode<HTMLElement>(this.okButtonElement).focus();
  }
  public render()
  {
    return(
      WindowContainer(
      {
        isResizable: false,
        containerElement: document.body,

        minWidth: this.props.minWidth || 50,
        minHeight: this.props.minHeight || 50,
        maxWidth: this.props.maxWidth || Infinity,
        maxHeight: this.props.maxHeight || Infinity,

        ref: (component: WindowContainerComponent) =>
        {
          this.windowContainerComponent = component;
        },
      },
        React.DOM.div(
        {
          className: "dialog-box draggable",
          onMouseDown: this.handleTitleBarMouseDown,
          onTouchStart: this.handleTitleBarMouseDown,
        },
          React.DOM.div(
          {
            className: "dialog-box-content",
          },
            this.props.children,
          ),
          React.DOM.div(
          {
            className: "dialog-box-buttons",
          },
            React.DOM.button(
            {
              className: "dialog-box-button ok-button",
              onClick: this.props.handleOk,
              ref: (component: HTMLElement) =>
              {
                this.okButtonElement = component;
              },
            }, this.props.okText || "Ok"),
            this.props.extraButtons,
            !this.props.handleCancel ? null :
              React.DOM.button(
              {
                className: "dialog-box-button cancel-button",
                onClick: this.props.handleCancel,
              }, this.props.cancelText || "Cancel"),
          ),
        ),
      )
    );
  }

  private handleTitleBarMouseDown(e: React.MouseEvent | React.TouchEvent): void
  {
    this.windowContainerComponent.onMouseDown(e);
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(DialogBoxComponent);
export default Factory;
