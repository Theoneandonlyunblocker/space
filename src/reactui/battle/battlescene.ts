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
          this.renderScene("side1", newProps.unit1);
        }

        if (newProps.unit2 !== this.props.unit2)
        {
          this.renderScene("side2", newProps.unit2);
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
        if (this.props.unit1)
        {
          this.renderScene("side1", this.props.unit1);
        }
        if (this.props.unit2)
        {
          this.renderScene("side2", this.props.unit2);
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
          zDistance: 5,
          xDistance: 5,
          unitsToDraw: 20,
          maxUnitsPerColumn: 8,
          degree: -0.5,
          rotationAngle: 60,
          scalingFactor: 0.02,
          facesRight: unit.battleStats.side === "side1",
          maxHeight: boundingRect.height
        });
      },

      renderScene: function(side: string, unit?: Unit)
      {
        var container = this.getUnitsContainerForSide(side);

        while (container.firstChild)
        {
          container.removeChild(container.firstChild);
        }

        if (unit)
        {
          var scene = unit.drawBattleScene(this.getSceneProps(unit));

          container.appendChild(scene);
          console.log("render battleScene", side, unit);
        }
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
