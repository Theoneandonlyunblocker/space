/// <reference path="battlesceneunit.ts" />

module Rance
{
  export module UIComponents
  {
    export var BattleScene = React.createClass(
    {
      displayName: "BattleScene",
      mixins: [React.addons.PureRenderMixin],
      cachedSFXWidth: null,

      componentDidUpdate: function(oldProps: any)
      {
        if (this.props.effectSFX && this.props.effectSFX.battleOverlay)
        {
          if ( !oldProps.effectSFX ||
            this.props.effectSFX.battleOverlay !== oldProps.effectSFX.battleOverlay ||
            this.props.unit1 !== oldProps.unit1 || this.props.unit2 !== oldProps.unit2)
          {
            this.drawBattleOverlay();
          }
        }
        else if (oldProps.effectSFX && oldProps.effectSFX.battleOverlay)
        {
          this.clearBattleOverlay();
        }
      },

      componentDidMount: function()
      {
        window.addEventListener("resize", this.handleResize, false);
      },

      componentWillUnmount: function()
      {
        window.removeEventListener("resize", this.handleResize);
      },

      getSceneBounds: function()
      {
        return this.refs.wrapper.getDOMNode().getBoundingClientRect();
      },

      handleResize: function()
      {
        if (this.cachedSFXWidth)
        {
          this.resizeScene(this.cachedSFXWidth);
        }
      },

      resizeSceneToCanvas: function(overlayCanvas: HTMLCanvasElement)
      {
        var leftoverWidth = this.resizeScene(overlayCanvas.width);
        if (leftoverWidth !== 0) this.cachedSFXWidth = overlayCanvas.width;
      },

      resizeScene: function(width: number)
      {
        var scene = this.refs.scene.getDOMNode();

        var wrapperBounds = this.refs.wrapper.getDOMNode().getBoundingClientRect();
        var leftoverWidth2 = (wrapperBounds.width - width) / 2;

        if (leftoverWidth2 <= 0)
        {
          scene.style.width = "";
          scene.style.left = "";
        }
        else
        {
          scene.style.width = "" +  width + "px";
          scene.style.left = "" +  leftoverWidth2 + "px";
        }

        return leftoverWidth2;
      },
      clearBattleOverlay: function()
      {
        var container = this.refs.overlay.getDOMNode();
        if (container.firstChild)
        {
          container.removeChild(container.firstChild);
        }
      },

      drawBattleOverlay: function()
      {
        var container = this.refs.overlay.getDOMNode();
        if (container.firstChild)
        {
          container.removeChild(container.firstChild);
        }

        var bounds = this.getSceneBounds();
        var battleOverlay = this.props.effectSFX.battleOverlay(
        {
          user: this.props.unit1IsActive ? this.props.unit1 : this.props.unit2,
          target: this.props.unit1IsActive ? this.props.unit2 : this.props.unit1,
          width: bounds.width,
          height: bounds.height,
          duration: this.props.effectDuration,
          facingRight: this.props.unit1IsActive ? true : false,
          onLoaded: this.resizeSceneToCanvas
        });

        container.appendChild(battleOverlay);
      },

      render: function()
      {
        var unit1SpriteFN: Function, unit1OverlayFN: Function,
          unit2SpriteFN: Function, unit2OverlayFN: Function;
        if (this.props.effectSFX)
        {
          if (this.props.unit1IsActive)
          {
            unit1SpriteFN = this.props.effectSFX.userSprite;
            unit1OverlayFN = this.props.effectSFX.userOverlay;

            unit2OverlayFN = this.props.effectSFX.enemyOverlay;
          }
          else
          {
            unit2SpriteFN = this.props.effectSFX.userSprite;
            unit2OverlayFN = this.props.effectSFX.userOverlay;

            unit1OverlayFN = this.props.effectSFX.enemyOverlay;
          }
        }


        return(
          React.DOM.div(
          {
            className: "battle-scene-wrapper",
            ref: "wrapper"
          },
            React.DOM.div(
            {
              className: "battle-scene",
              ref: "scene"
            },
              React.DOM.div(
              {
                className: "battle-scene-units-container"
              },
                UIComponents.BattleSceneUnit(
                {
                  unit: this.props.unit1,
                  side: "side1",

                  effectDuration: this.props.effectDuration,
                  effectSpriteFN: unit1SpriteFN,
                  effectOverlayFN: unit1OverlayFN,

                  getSceneBounds: this.getSceneBounds
                }),
                UIComponents.BattleSceneUnit(
                {
                  unit: this.props.unit2,
                  side: "side2",

                  effectDuration: this.props.effectDuration,
                  effectSpriteFN: unit2SpriteFN,
                  effectOverlayFN: unit2OverlayFN,

                  getSceneBounds: this.getSceneBounds
                })
              ),
              React.DOM.div(
              {
                className: "battle-scene-overlay-container",
                ref: "overlay"
              },
                null // battle overlay SFX drawn on canvas
              )
            )
          )
        );
      }
    })
  }
}
