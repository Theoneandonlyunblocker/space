module Rance
{
  export module UIComponents
  {
    export var PlayerFlag = React.createClass(
    {
      displayName: "PlayerFlag",
      componentDidMount: function()
      {
        var node = this.refs.wrapper.getDOMNode();
        node.appendChild(this.props.flag.drawSvg());
      },
      render: function()
      {
        var props = this.props.props;
        props.ref = "wrapper";
        return(
          React.DOM.object(props,
            null
          )
        );
      }
    })
  }
}
