/// <reference path="../../../lib/react-global.d.ts" />

import {default as BaseWindow} from "./BaseWindow";

interface PropTypes extends React.Props<any>
{
  handleOk: () => boolean; // return value: was callback successful
  handleClose?: () => void;
  extraButtons?: React.ReactNode[];
  okText?: string;
  cancelText?: string;

  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
}

interface StateType
{
}

export class DialogBoxComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "DialogBox";
  public state: StateType;

  private ref_TODO_okButton: HTMLElement;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }

  public componentDidMount()
  {
    ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_okButton).focus();
  }
  public render()
  {
    return(
      BaseWindow(
      {
        isResizable: false,
        containerElement: document.body,

        minWidth: this.props.minWidth,
        minHeight: this.props.minHeight,
        maxWidth: this.props.maxWidth,
        maxHeight: this.props.maxHeight,
      },
        React.DOM.div(
        {
          className: "confirm-popup-content",
        },
          this.props.children,
        ),
        React.DOM.div(
        {
          className: "confirm-popup-buttons",
        },
          React.DOM.button(
          {
            className: "confirm-popup-button confirm-button",
            onClick: this.handleOk,
            ref: (component: HTMLElement) =>
            {
              this.ref_TODO_okButton = component;
            },
          }, this.props.okText || "Confirm"),
          this.props.extraButtons,
          React.DOM.button(
          {
            className: "confirm-popup-button cancel-button",
            onClick: this.handleClose,
          }, this.props.cancelText || "Cancel"),
        ),
      )
    );
  }

  private bindMethods()
  {
    this.handleOk = this.handleOk.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  private handleOk()
  {
    if (!this.props.handleOk)
    {
      this.handleClose();

      return;
    }

    const callbackSuccesful = this.props.handleOk();

    if (callbackSuccesful)
    {
      this.handleClose();
    }
  }
  private handleClose()
  {
    this.props.handleClose();
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(DialogBoxComponent);
export default Factory;
