/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

interface PropTypes extends React.Props<any>
{
  handleClose: any; // TODO refactor | define prop type 123
  contentConstructor: any; // TODO refactor | define prop type 123
  extraButtons: any; // TODO refactor | define prop type 123
  cancelText: boolean;
  handleOk: any; // TODO refactor | define prop type 123
  contentProps: any; // TODO refactor | define prop type 123
  contentText: string;
  okText: string;
  closePopup: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

interface RefTypes extends React.Refs
{
  okButton: HTMLElement;
}

export class ConfirmPopupComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ConfirmPopup";
  mixins: reactTypeTODO_any = [SplitMultilineText];

  state: StateType;
  refsTODO: RefTypes;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleOk = this.handleOk.bind(this);
    this.handleClose = this.handleClose.bind(this);    
  }
  
  componentDidMount()
  {
    React.findDOMNode<HTMLElement>(this.ref_TODO_okButton).focus();
  }

  handleOk()
  {
    if (!this.props.handleOk)
    {
      this.handleClose();
      return;
    }
    
    var callbackSuccesful = this.props.handleOk();

    if (callbackSuccesful !== false)
    {
      this.handleClose();
    }
  }
  handleClose()
  {
    if (this.props.handleClose)
    {
      this.props.handleClose();
    }
    this.props.closePopup();
  }

  render()
  {
    var content: React.ReactElement<any>;
    if (this.props.contentText)
    {
      content = this.splitMultilineText(this.props.contentText);
    }
    else if (this.props.contentConstructor)
    {
      content = this.props.contentConstructor(this.props.contentProps);
    }
    else
    {
      throw new Error("Confirm popup has no content");
    }

    return(
      React.DOM.div(
      {
        className: "confirm-popup draggable-container"
      },
        React.DOM.div(
        {
          className: "confirm-popup-content"
        },
          content
        ),
        React.DOM.div(
        {
          className: "popup-buttons draggable-container"
        },
          React.DOM.button(
          {
            className: "popup-button",
            onClick: this.handleOk,
            ref: (component: TODO_TYPE) =>
{
  this.ref_TODO_okButton = component;
}
          }, this.props.okText || "Confirm"),
          this.props.extraButtons,
          React.DOM.button(
          {
            className: "popup-button",
            onClick: this.handleClose
          }, this.props.cancelText || "Cancel")
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ConfirmPopupComponent);
export default Factory;