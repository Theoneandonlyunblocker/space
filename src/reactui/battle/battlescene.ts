module Rance
{
  export module UIComponents
  {
    export var BattleScene = React.createClass(
    {
      displayName: "BattleScene",

      componentWillReceiveProps: function(newProps: any)
      {
        if (newProps.unit1 !== this.props.unit1)
        {
          this.renderScene("side1", true, newProps.unit1);
        }

        if (newProps.unit2 !== this.props.unit2)
        {
          this.renderScene("side2", true, newProps.unit2);
        }
      },

      addTimeout: function(id: string, callBack: {(): void})
      {
        if (!this.timeouts) this.timeouts = {};

        this.timeouts[id] = window.setTimeout(callBack);
      },
      removeTimeout: function(id: string)
      {
        window.clearTimeout(this.timeouts[id]);

        this.timeouts[id] = null;
        delete this.timeouts[id];
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
        if (this.props.unit1)
        {
          this.renderScene("side1", false, this.props.unit1);
        }
        if (this.props.unit2)
        {
          this.renderScene("side2", false, this.props.unit2);
        }
      },

      getUnitsContainerForSide: function(side: string)
      {
        if (side === "side1") return this.refs["unit1Scene"].getDOMNode();
        else if (side === "side2") return this.refs["unit2Scene"].getDOMNode();
        else throw new Error("Invalid side");
      },

      getSceneProps: function(unit: Unit)
      {
        var container = this.getUnitsContainerForSide(unit.battleStats.side);
        var boundingRect = container.getBoundingClientRect();

        return(
        {
          zDistance: 8,
          xDistance: 5,
          unitsToDraw: 20,
          maxUnitsPerColumn: 8,
          degree: -0.5,
          rotationAngle: 70,
          scalingFactor: 0.04,
          facesRight: unit.battleStats.side === "side1",
          maxHeight: boundingRect.height
        });
      },

      addUnit: function(side: string, animate: boolean, unit?: Unit)
      {
        var container = this.getUnitsContainerForSide(side);

        if (unit)
        {
          var scene = unit.drawBattleScene(this.getSceneProps(unit));
          scene.classList.add("battle-scene-unit-enter");

          container.appendChild(scene);
        }
      },

      removeUnit: function(side: boolean, animate: boolean, onComplete?: {(): void})
      {
        var container = this.getUnitsContainerForSide(side);

        // has child. child will be removed with animation if specified, then fire callback
        if (container.firstChild)
        {
          if (animate)
          {
            container.firstChild.addEventListener("animationend", function()
            {
              if (container.firstChild)
              {
                container.removeChild(container.firstChild);
              }
              onComplete();
            });

            container.firstChild.classList.add("battle-scene-unit-leave");
          }
          else
          {
            container.removeChild(container.firstChild);
          }
        }
        // no child, fire callback immediately
        else
        {
          if (onComplete) onComplete();
        }
      },

      renderScene: function(side: string, animate: boolean, unit?: Unit)
      {
        var container = this.getUnitsContainerForSide(side);

        var addUnitFN = this.addUnit.bind(this, side, animate, unit);

        this.removeUnit(side, animate, addUnitFN);
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "battle-scene"
          },
            React.DOM.div(
            {
              className: "battle-scene-units-container",
              ref: "unit1Scene"
            },
              null
            ),
            React.DOM.div(
            {
              className: "battle-scene-units-container",
              ref: "unit2Scene"
            },
              null
            )
          )
        );
      }
    })
  }
}
