module Rance
{
  export module UIComponents
  {
    export var BattleSceneUnit = React.createClass(
    {
      displayName: "BattleSceneUnit",
      mixins: [React.addons.PureRenderMixin],

      componentWillReceiveProps: function(newProps: any)
      {
        if (newProps.unit !== this.props.unit)
        {
          this.renderScene(true, newProps.unit);
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

      handleResize: function()
      {
        if (this.props.unit)
        {
          this.renderScene(false, this.props.unit);
        }
      },

      getSceneProps: function(unit: Unit)
      {
        var boundingRect = this.props.getSceneBounds();

        return(
        {
          zDistance: 8,
          xDistance: 5,
          maxUnitsPerColumn: 7,
          degree: -0.5,
          rotationAngle: 70,
          scalingFactor: 0.04,
          facesRight: unit.battleStats.side === "side1",
          maxHeight: boundingRect.height,
          desiredHeight: boundingRect.height
        });
      },

      addUnit: function(animate: boolean, unit?: Unit)
      {
        var container = this.refs.sprite.getDOMNode();

        if (unit)
        {
          var scene = unit.drawBattleScene(this.getSceneProps(unit));
          if (animate)
          {
            scene.classList.add("battle-scene-unit-enter-" + this.props.side);
          }

          container.appendChild(scene);
        }
      },

      removeUnit: function(animate: boolean, onComplete?: {(): void})
      {
        var container = this.refs.sprite.getDOMNode();

        // has child. child will be removed with animation if specified, then fire callback
        if (container.firstChild)
        {
          if (animate)
          {
            var animationEndFN = function()
            {
              if (container.firstChild)
              {
                container.removeChild(container.firstChild);
              }
              onComplete();
            }
            container.firstChild.addEventListener("animationend", animationEndFN);
            container.firstChild.addEventListener("webkitAnimationEnd", animationEndFN);

            container.firstChild.classList.add("battle-scene-unit-leave-" + this.props.side);
          }
          else
          {
            container.removeChild(container.firstChild);
            if (onComplete) onComplete();
          }
        }
        // no child, fire callback immediately
        else
        {
          if (onComplete) onComplete();
        }
      },

      renderScene: function(animate: boolean, unit?: Unit)
      {
        var addUnitFN = this.addUnit.bind(this, animate, unit);

        this.removeUnit(animate, addUnitFN);
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "battle-scene-units-container",
            ref: "container"
          },
            // overlay
            React.DOM.div(
            {
              className: "battle-scene-unit-overlay",
              ref: "overlay"
            },
              null
            ),
            // scene
            React.DOM.div(
            {
              className: "battle-scene-unit-sprite",
              ref: "sprite"
            },
              null
            )
          )
        );
      }
    })
  }
}
