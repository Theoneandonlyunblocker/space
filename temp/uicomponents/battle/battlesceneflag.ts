/// <reference path="../../flag.ts" />

export namespace UIComponents
{
  export var BattleSceneFlag = React.createFactory(React.createClass(
  {
    displayName: "BattleSceneFlag",
    flagCanvas: null,

    propTypes:
    {
      flag: React.PropTypes.instanceOf(Flag).isRequired,
      facingRight: React.PropTypes.bool.isRequired
    },

    componentDidMount: function()
    {
      this.setFlag();

      window.addEventListener("resize", this.handleResize, false);
    },

    componentWillUnmount: function()
    {
      window.removeEventListener("resize", this.handleResize);
    },

    handleResize: function()
    {
      this.setFlag();
    },

    setFlag: function()
    {
      var DOMNode = this.getDOMNode();
      if (this.flagCanvas)
      {
        DOMNode.removeChild(this.flagCanvas);
      }

      this.flagCanvas = this.drawFlag();
      this.getDOMNode().appendChild(this.flagCanvas);
    },

    drawFlag: function()
    {
      var bounds = this.getDOMNode().getBoundingClientRect();
      var width = bounds.width;

      var canvas = this.props.flag.getCanvas(width, bounds.height, true, false);
      var context = canvas.getContext("2d");
      context.globalCompositeOperation = "destination-out";

      var gradient: CanvasGradient;
      if (this.props.facingRight)
      {
        gradient = context.createLinearGradient(0, 0, width, 0);
      }
      else
      {
        gradient = context.createLinearGradient(width, 0, 0, 0);
      }

      gradient.addColorStop(0.0, "rgba(255, 255, 255, 0.3)");
      gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.5)");
      gradient.addColorStop(0.8, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(1.0, "rgba(255, 255, 255, 1.0)");

      context.fillStyle = gradient;
      context.fillRect(0, 0, width, bounds.height);

      canvas.classList.add("battle-scene-start-player-flag");

      return canvas
    },

    render: function()
    {
      return(
        React.DOM.div(
        {
          className: "battle-scene-flag-container"
        },
          null
        )
      );
    }
  }));
}
