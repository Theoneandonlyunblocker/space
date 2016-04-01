export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class TopMenuPopup extends React.Component<PropTypes, {}>
{
  displayName: "TopMenuPopup";

  render: function()
  {
    var contentProps = this.props.contentProps;
    contentProps.ref = "content";

    return(
      React.DOM.div(
      {
        className: "top-menu-popup-container draggable-container"
      },
        React.DOM.button(
        {
          className: "light-box-close",
          onClick: this.props.handleClose
        }, "X"),
        React.DOM.div(
        {
          className: "light-box-content"
        },
          this.props.contentConstructor(contentProps)
        )
      )
    );
  }
}
