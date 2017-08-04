import * as React from "react";
import * as ReactDOM from "react-dom";

import {default as DefaultWindow} from "./DefaultWindow";

import {localize} from "../../../localization/localize";


interface PropTypes extends React.Props<any>
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

  private okButtonElement: HTMLElement;

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
      DefaultWindow(
      {
        title: this.props.title,
        handleClose: this.props.handleCancel,
        isResizable: false,
      },
        React.DOM.div(
        {
          className: "dialog-box",
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
            }, this.props.okText || localize("ok")),
            this.props.extraButtons,
            React.DOM.button(
            {
              className: "dialog-box-button cancel-button",
              onClick: this.props.handleCancel,
            }, this.props.cancelText || localize("cancel")),
          ),
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(DialogBoxComponent);
export default Factory;
