import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import * as ReactDOM from "react-dom";

import {localize} from "../../../localization/localize";

import {default as DefaultWindow} from "./DefaultWindow";


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

  private okButtonElement: HTMLElement | null;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public componentDidMount()
  {
    (<HTMLElement>ReactDOM.findDOMNode(this.okButtonElement!)).focus();
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
              ref: component =>
              {
                this.okButtonElement = component;
              },
            }, this.props.okText || localize("ok")()),
            this.props.extraButtons,
            ReactDOMElements.button(
            {
              className: "dialog-box-button cancel-button",
              onClick: this.props.handleCancel,
            }, this.props.cancelText || localize("cancel")()),
          ),
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(DialogBoxComponent);
export default factory;
