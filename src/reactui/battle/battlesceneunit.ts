module Rance
{
  export module UIComponents
  {
    export var BattleSceneUnit = React.createClass(
    {
      displayName: "BattleSceneUnit",
      mixins: [React.addons.PureRenderMixin],
      eventListenerCache: {},
      idGenerator: 0,

      componentDidUpdate: function(oldProps: any)
      {
        if (oldProps.unit !== this.props.unit)
        {
          this.renderScene(true, false, this.props.unit);
        }
        else
        {
          if (oldProps.effectSpriteFN !== this.props.effectSpriteFN)
          {
            this.renderUnit(false, true, this.props.unit);
          }
          if (oldProps.effectOverlayFN !== this.props.effectOverlayFN)
          {
            this.renderOverlay();
          }
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

      addAnimationListeners: function(element: HTMLElement, listener: () => void)
      {
        if (!element.id)
        {
          element.id = "battle-scene-unit-" + this.idGenerator++;
        }
        if (!this.eventListenerCache[element.id])
        {
          this.eventListenerCache[element.id] = [];
        }

        this.eventListenerCache[element.id].push(listener);

        element.addEventListener("animationend", listener);
        element.addEventListener("webkitAnimationEnd", listener);
      },

      removeAnimations: function(element: HTMLElement, removeListeners: boolean = false)
      {
        if (removeListeners && this.eventListenerCache[element.id])
        {
          for (var i = 0; i < this.eventListenerCache[element.id].length; i++)
          {
            var listener = this.eventListenerCache[element.id][i];
            element.removeEventListener("animationend", listener);
            element.removeEventListener("webkitAnimationEnd", listener);
          }
          this.eventListenerCache[element.id] = null;
          delete this.eventListenerCache[element.id];
        }
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
          maxHeight: boundingRect.height - 20,
          desiredHeight: boundingRect.height - 40
        });
      },

      getSFXProps: function()
      {
        var containerBounds = this.refs.container.getDOMNode().getBoundingClientRect();

        return(
        {
          user: this.props.unit,
          target: this.props.unit,
          width: containerBounds.width,
          height: containerBounds.height,
          duration: this.props.effectDuration,
          facingRight: this.props.side === "side1"
        });
      },

      addUnit: function(animateEnter: boolean, animateFade: boolean, unit?: Unit, onComplete?: () => void)
      {
        var self = this;
        var container = this.refs.sprite.getDOMNode();

        if (unit)
        {
          var SFXProps = this.getSFXProps();
          var scene: HTMLCanvasElement;
          if (this.props.effectSpriteFN && this.props.effectDuration)
          {
            scene = this.props.effectSpriteFN(this.getSFXProps());
          }
          else
          {
            scene = unit.drawBattleScene(this.getSceneProps(unit));
            this.removeAnimations(scene, true);
          }

          if (scene.height >= this.getSFXProps().height - 40)
          {
            scene.classList.add("attach-to-bottom");
          }
          else
          {
            scene.classList.remove("attach-to-bottom");
          }

          if (animateEnter || animateFade)
          {
            var animationEndFN = function(e: AnimationEvent)
            {
              if (e.animationName !== ("battle-scene-unit-enter-" + self.props.side) &&
                e.animationName !== "battle-scene-unit-fade-in")
              {
                return;
              }

              if (onComplete) onComplete();
            }
            if (animateEnter)
            {
              scene.classList.add("battle-scene-unit-enter-" + this.props.side);
            }
            else if (animateFade)
            {
              scene.classList.add("battle-scene-unit-fade-in");
            }

            container.appendChild(scene);
          }
          else
          {
            container.appendChild(scene);
            if (onComplete) onComplete();
          }

        }
        else
        {
          if (onComplete) onComplete();
        }
      },

      removeUnit: function(animateEnter: boolean, animateFade: boolean, onComplete?: {(): void})
      {
        var container = this.refs.sprite.getDOMNode();
        var self = this;

        // has child. child will be removed with animation if specified, then fire callback
        if (container.firstChild)
        {
          if (animateEnter || animateFade)
          {
            var animationEndFN = function(e: AnimationEvent)
            {
              if (e.animationName !== ("battle-scene-unit-leave-" + self.props.side) &&
                e.animationName !== "battle-scene-unit-fade-out")
              {
                return;
              }

              if (container.firstChild)
              {
                container.removeChild(container.firstChild);
              }
              if (onComplete) onComplete();
            }
            this.removeAnimations(container.firstChild, false);
            this.addAnimationListeners(container.firstChild, animationEndFN);

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

      renderUnit: function(animateEnter: boolean, animateFade: boolean, unit?: Unit)
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

      renderOverlay: function()
      {
        var container = this.refs.overlay.getDOMNode();
        if (container.firstChild)
        {
          container.removeChild(container.firstChild);
        }

        if (this.props.effectOverlayFN)
        {
          container.appendChild(this.props.effectOverlayFN(this.getSFXProps()));
        }
      },

      renderScene: function(animateEnter: boolean, animateFade: boolean, unit?: Unit)
      {
        this.renderUnit(animateEnter, animateFade, unit);
        this.renderOverlay();
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
              className: "battle-scene-unit-sprite",
              ref: "sprite"
            },
              null // unit sprite drawn on canvas
            ),
            React.DOM.div(
            {
              className: "battle-scene-unit-overlay",
              ref: "overlay"
            },
              null // unit overlay SFX drawn on canvas
            )
          )
        );
      }
    })
  }
}
