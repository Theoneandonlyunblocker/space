/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class ConfirmPopup extends React.Component<PropTypes, {}>
{
  displayName: string = "ConfirmPopup";
  mixins: reactTypeTODO_any = [SplitMultilineText];

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  componentDidMount()
  {
    this.refs.okButton.getDOMNode().focus();
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  handleClose()
  {
    if (this.props.handleClose)
    {
      this.props.handleClose();
    }
    this.props.closePopup();
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    var content: ReactComponentPlaceHolder;
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
            ref: "okButton"
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
