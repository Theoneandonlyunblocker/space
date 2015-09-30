module Rance
{
  export module UIComponents
  {
    export var PlayerFlag = React.createClass(
    {
      displayName: "PlayerFlag",
      mixins: [React.addons.PureRenderMixin],
      canUseDataURL: function()
      {
        var uaString = navigator.userAgent.toLowerCase();
        var isIE = uaString.indexOf("msie") !== -1 || uaString.indexOf("trident/") !== -1;
        return !isIE;
      },
      componentDidMount: function()
      {
        if (this.refs.container)
        {
          var canvas = this.props.flag.getCanvas(this.props.width, this.props.height, this.props.stretch, false);
          canvas.style.maxWidth = "100%";
          canvas.style.maxHeight = "100%";
          this.refs.container.getDOMNode().appendChild(canvas);
        }
      },
      render: function()
      {
        var props = this.props.props;
        if (this.canUseDataURL())
        {
          var flag: Flag = this.props.flag;
          props.src = flag.getCanvas(this.props.width, this.props.height, this.props.stretch).toDataURL();

          return(
            React.DOM.img(props,
              null
            )
          );
        }
        else
        {
          props.ref = "container";
          return(
            React.DOM.div(props,
              null
            )
          );
        }
      }
    })
  }
}
