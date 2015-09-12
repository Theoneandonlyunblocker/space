module Rance
{
  export module UIComponents
  {
    export var BattleSceneTester = React.createClass(
    {

      displayName: "BattleSceneTester",

      initialValues:
      {
        zDistance: 5,
        xDistance: 5,
        unitsToDraw: 5,
        maxUnitsPerColumn: 5,
        degree: -0.5,
        rotationAngle: 60,
        scalingFactor: 0.02,
        facesRight: true
      },

      componentDidMount: function()
      {
        app.game = app.makeGame();
        app.initGame();
        var unit = app.humanPlayer.getAllUnits()[0];
        var image = new Image();
        image.src = "img\/ships\/battleCruiser.png";
        image.onload = this.renderScene;
      },

      renderScene: function()
      {
        var unit = app.humanPlayer.getAllUnits()[0];
        var canvas = unit.drawBattleScene(
        {
          zDistance: Number(this.refs["zDistance"].getDOMNode().value),
          xDistance: Number(this.refs["xDistance"].getDOMNode().value),
          unitsToDraw: Number(this.refs["unitsToDraw"].getDOMNode().value),
          maxUnitsPerColumn: Number(this.refs["maxUnitsPerColumn"].getDOMNode().value),
          degree: Number(this.refs["degree"].getDOMNode().value),
          rotationAngle: Number(this.refs["rotationAngle"].getDOMNode().value),
          scalingFactor: Number(this.refs["scalingFactor"].getDOMNode().value),
          facesRight: this.refs["facesRight"].getDOMNode().checked
        });

        var container = this.refs["canvasContainer"].getDOMNode();
        while (container.firstChild)
        {
          container.removeChild(container.firstChild);
        }

        container.appendChild(canvas);
      },
      resetValues: function()
      {
        for (var prop in this.initialValues)
        {
          var element = this.refs[prop].getDOMNode();
          element.value = this.initialValues[prop];
        }

        this.renderScene();
      },

      render: function()
      {
        
        return(
          React.DOM.div(
            {
              style:
              {
                display: "flex"
              }
            },
            React.DOM.div({ref: "canvasContainer", style:{flex: 1}},
              null
            ),
            React.DOM.div(
            {
              style:
              {
                display: "flex",
                flexFlow: "column"
              }
            },
              React.DOM.label(null,

                React.DOM.input(
                {
                  ref: "zDistance",
                  type: "number",
                  defaultValue: this.initialValues["zDistance"],
                  onChange: this.renderScene
                },
                  "zDistance"
                )
              ),
              React.DOM.label(null,

                React.DOM.input(
                {
                  ref: "xDistance",
                  type: "number",
                  defaultValue: this.initialValues["xDistance"],
                  onChange: this.renderScene
                },
                  "xDistance"
                )
              ),
              React.DOM.label(null,

                React.DOM.input(
                {
                  ref: "unitsToDraw",
                  type: "number",
                  defaultValue: this.initialValues["unitsToDraw"],
                  onChange: this.renderScene
                },
                  "unitsToDraw"
                )
              ),
              React.DOM.label(null,

                React.DOM.input(
                {
                  ref: "maxUnitsPerColumn",
                  type: "number",
                  defaultValue: this.initialValues["maxUnitsPerColumn"],
                  onChange: this.renderScene
                },
                  "maxUnitsPerColumn"
                )
              ),
              React.DOM.label(null,

                React.DOM.input(
                {
                  ref: "degree",
                  type: "number",
                  defaultValue: this.initialValues["degree"],
                  min: -10,
                  max: 10,
                  step: 0.05,
                  onChange: this.renderScene
                },
                  "degree"
                )
              ),
              React.DOM.label(null,

                React.DOM.input(
                {
                  ref: "rotationAngle",
                  type: "number",
                  defaultValue: this.initialValues["rotationAngle"],
                  onChange: this.renderScene
                },
                  "rotationAngle"
                )
              ),
              React.DOM.label(null,

                React.DOM.input(
                {
                  ref: "scalingFactor",
                  type: "number",
                  defaultValue: this.initialValues["scalingFactor"],
                  max: 1,
                  step: 0.005,
                  onChange: this.renderScene
                },
                  "scalingFactor"
                )
              ),
              React.DOM.label(null,

                React.DOM.input(
                {
                  ref: "facesRight",
                  type: "checkBox",
                  onChange: this.renderScene
                },
                  "facesRight"
                )
              ),
              React.DOM.button(
              {
                onClick: this.resetValues
              }, "Reset")
            )
          )
        );
      }
    })
  }
}