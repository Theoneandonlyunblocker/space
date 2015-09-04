module Rance
{
  export module UIComponents
  {
    export var BattleSceneUnit = React.createClass(
    {
      displayName: "BattleSceneUnit",
      mixins: [React.addons.PureRenderMixin],

      componentDidUpdate: function(oldProps: any)
      {
        if (oldProps.unit !== this.props.unit)
        {
          this.renderScene(true, false, this.props.unit);
        }
        else if (
          oldProps.effectSpriteFN !== this.props.effectSpriteFN
        )
        {
          this.renderScene(false, true, this.props.unit);
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
          this.renderScene(false, false, this.props.unit);
        }
      },

      removeAnimations: function(element: HTMLElement)
      {
        element.classList.remove("battle-scene-unit-enter-" + this.props.side);
        element.classList.remove("battle-scene-unit-leave-" + this.props.side);
        element.classList.remove("battle-scene-unit-fade-in");
        element.classList.remove("battle-scene-unit-fade-out");
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

      addUnit: function(animateEnter: boolean, animateFade: boolean, unit?: Unit, onComplete?: {(): void})
      {
        var container = this.refs.sprite.getDOMNode();
        var sceneBounds = this.props.getSceneBounds();

        if (unit)
        {
          var scene;
          if (this.props.effectSpriteFN && this.props.effectDuration)
          {
            scene = this.props.effectSpriteFN(
            {
              user: this.props.unit,
              width: sceneBounds.width,
              height: sceneBounds.height,
              duration: this.props.effectDuration,
              facingRight: this.props.side === "side1"
            });
          }
          else
          {
            scene = unit.drawBattleScene(this.getSceneProps(unit));
          }
          if (animateEnter)
          {
            scene.classList.add("battle-scene-unit-enter-" + this.props.side);
          }
          else if (animateFade)
          {
            scene.addEventListener("animationend", onComplete);
            scene.addEventListener("webkitAnimationEnd", onComplete);
            scene.classList.add("battle-scene-unit-fade-in");
          }

          if (!animateFade && onComplete)
          {
            onComplete();
          }

          container.appendChild(scene);
        }
        else if (onComplete)
        {
          onComplete();
        }
      },

      removeUnit: function(animateEnter: boolean, animateFade: boolean, onComplete?: {(): void})
      {
        var container = this.refs.sprite.getDOMNode();

        // has child. child will be removed with animation if specified, then fire callback
        if (container.firstChild)
        {
          if (animateEnter || animateFade)
          {
            var animationEndFN = function()
            {
              if (container.firstChild)
              {
                container.removeChild(container.firstChild);
              }
              if (onComplete) onComplete();
            }
            this.removeAnimations(container.firstChild);
            container.firstChild.addEventListener("animationend", animationEndFN);
            container.firstChild.addEventListener("webkitAnimationEnd", animationEndFN);

            if (animateEnter)
            {
              container.firstChild.classList.add("battle-scene-unit-leave-" + this.props.side);
            }
            else if (animateFade)
            {
              container.firstChild.classList.add("battle-scene-unit-fade-out");
            }
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

      renderScene: function(animateEnter: boolean, animateFade: boolean, unit?: Unit)
      {
        if (animateFade)
        {
          this.addUnit(animateEnter, animateFade, unit);
          this.removeUnit(animateEnter, animateFade);
        }
        else
        {
          var addUnitFN = this.addUnit.bind(this, animateEnter, animateFade, unit);

          this.removeUnit(animateEnter, animateFade, addUnitFN);
        }

      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "battle-scene-unit " +
              "battle-scene-unit-" + this.props.side,
            ref: "container"
          },
            React.DOM.div(
            {
              className: "battle-scene-unit-overlay",
              ref: "overlay"
            },
              null // unit overlay SFX drawn on canvas
            ),
            React.DOM.div(
            {
              className: "battle-scene-unit-sprite",
              ref: "sprite"
            },
              null // unit sprite drawn on canvas
            )
          )
        );
      }
    })
  }
}
