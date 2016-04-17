/// <reference path="../../../lib/react-global.d.ts" />

import
{
  splitMultilineText
} from "../../utility";

interface PropTypes extends React.Props<any>
{
  handleClose: () => void;
  contentConstructor: React.Factory<any>;
  extraButtons: React.ReactElement<any>[];
  cancelText: boolean;
  handleOk: () => boolean; // return value: was callback successful
  contentProps: any;
  contentText: string;
  okText: string;
  closePopup: () => void;
}

interface StateType
{
}

export class ConfirmPopupComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ConfirmPopup";

  state: StateType;
  ref_TODO_okButton: React.HTMLComponent;

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
    ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_okButton).focus();
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
    var content: string | React.ReactElement<any>;
    if (this.props.contentText)
    {
      content = <string> splitMultilineText(this.props.contentText);
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
            ref: (component: React.HTMLComponent) =>
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
