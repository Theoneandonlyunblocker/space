module Rance
{
  export module UIComponents
  {
    /*
    props

      renderer
      backgroundSeed
      getBlurAreaFN()
     */
    export var BattleBackground = React.createClass(
    {
      displayName: "BattleBackground",

      handleResize: function()
      {
        var blurArea = this.props.getBlurArea();

        this.props.renderer.blurProps =
        [
          blurArea.left,
          0,
          blurArea.width,
          blurArea.height,
          this.props.backgroundSeed
        ];
      },

      componentDidMount: function()
      {
        this.props.renderer.isBattleBackground = true;

        this.handleResize();

        this.props.renderer.bindRendererView(this.refs.pixiContainer.getDOMNode());

        window.addEventListener("resize", this.handleResize, false);
      },

      componentWillUnmount: function()
      {
        window.removeEventListener("resize", this.handleResize);
        this.props.renderer.removeRendererView();
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "battle-pixi-container",
            ref: "pixiContainer"
          },
            this.props.children
          )
        );
      }
    });
  }
}