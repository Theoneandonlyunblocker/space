module Rance
{
  export module UIComponents
  {
    export var PlayerFlag = React.createClass(
    {
      displayName: "PlayerFlag",
      mixins: [React.addons.PureRenderMixin],
      render: function()
      {
        var props = this.props.props;
        var flag: Flag = this.props.flag;
        props.src = flag.getCanvas(this.props.width, this.props.height, this.props.stretch).dataURL;

        return(
          React.DOM.img(props,
            null
          )
        );
      }
    })
  }
}
