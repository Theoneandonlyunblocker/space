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
        if (this.props.battleIsStarting) return;
        if (oldProps.unit !== this.props.unit || oldProps.battleIsStarting)
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
        this.addFlag();
      },

      componentWillUnmount: function()
      {
        window.removeEventListener("resize", this.handleResize);
      },

      handleResize: function()
      {
        if (this.props.battleIsStarting)
        {
          this.removeScene();
          this.addFlag();
        }
        else if (this.props.unit)
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
      drawFlag: function(flag: Flag, facingRight: boolean)
      {
        var bounds = this.props.getSceneBounds();
        var width = bounds.width / 2;

        var canvas = flag.getCanvas(width, bounds.height, true, false);
        var context = canvas.getContext("2d");
        context.globalCompositeOperation = "destination-out";

        var gradient: CanvasGradient;
        if (facingRight)
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
      addFlag: function()
      {
        var scene = this.drawFlag(this.props.flag, this.props.side === "side1");
        this.addScene(false, false, scene);
      },
      addScene: function(animateEnter: boolean, animateFade: boolean, scene?: HTMLCanvasElement, onComplete?: () => void)
      {
        var self = this;
        var container = this.refs.sprite.getDOMNode();

        if (scene)
        {
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
      addUnit: function(animateEnter: boolean, animateFade: boolean, unit?: Unit, onComplete?: () => void)
      {
        var scene: HTMLCanvasElement;

        if (unit)
        {
          var SFXProps = this.getSFXProps();
          if (this.props.effectSpriteFN && this.props.effectDuration)
          {
            scene = this.props.effectSpriteFN(this.getSFXProps());
          }
          else
          {
            // scene = unit.drawBattleScene(this.getSceneProps(unit));
            this.removeAnimations(scene, true);
          }
          scene.classList.add("battle-scene-unit-sprite");
        }

        this.addScene(animateEnter, animateFade, scene, onComplete);
      },

      removeScene: function(animateEnter: boolean, animateFade: boolean, onComplete?: {(): void})
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
          this.removeScene(animateEnter, animateFade);
        }
        else
        {
          var addUnitFN = this.addUnit.bind(this, animateEnter, animateFade, unit);

          this.removeScene(animateEnter, animateFade, addUnitFN);
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
              className: "battle-scene-unit-sprite-container",
              ref: "sprite"
            },
              null // unit sprite drawn on canvas
            ),
            React.DOM.div(
            {
              className: "battle-scene-unit-overlay-container",
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
