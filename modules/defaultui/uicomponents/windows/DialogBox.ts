import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";

import {DefaultWindow} from "./DefaultWindow";


export interface PropTypes extends React.Props<any>
{
  title: string;
  handleOk: () => void;
  handleCancel: () => void;
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

  private readonly okButtonElement = React.createRef<HTMLButtonElement>();

  constructor(props: PropTypes)
  {
    super(props);
  }

  public componentDidMount()
  {
    this.okButtonElement.current.focus();
  }
  public render()
  {
    return(
      DefaultWindow(
      {
        title: this.props.title,
        handleClose: this.props.handleCancel,
        isResizable: false,
      },
        ReactDOMElements.div(
        {
          className: "dialog-box",
        },
          ReactDOMElements.div(
          {
            className: "dialog-box-content",
          },
            this.props.children,
          ),
          ReactDOMElements.div(
          {
            className: "dialog-box-buttons",
          },
            ReactDOMElements.button(
            {
              className: "dialog-box-button ok-button",
              onClick: this.props.handleOk,
              ref: this.okButtonElement,
            }, this.props.okText || localize("ok").toString()),
            this.props.extraButtons,
            ReactDOMElements.button(
            {
              className: "dialog-box-button cancel-button",
              onClick: this.props.handleCancel,
            }, this.props.cancelText || localize("cancel").toString()),
          ),
        ),
      )
    );
  }
}

export const DialogBox: React.Factory<PropTypes> = React.createFactory(DialogBoxComponent);
