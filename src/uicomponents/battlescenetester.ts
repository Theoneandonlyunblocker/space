var tester: any;
var bs: Rance.BattleScene;

module Rance
{
  export module UIComponents
  {
    export var BattleSceneTester = React.createClass(
    {
      displayName: "BattleSceneTester",
      idGenerator: 0,
      battle: null,
      battleScene: null,
      deferredClearHover: null,

      getInitialState: function()
      {
        return(
        {
          selectedUnit: null
        });
      },

      componentWillMount: function()
      {
        var side1Units: Unit[] = [];
        var side2Units: Unit[] = [];
        for (var i = 0; i < 5; i++)
        {
          side1Units.push(this.makeUnit());
          side2Units.push(this.makeUnit());
        }

        var side1Player = this.makePlayer();
        var side2Player = this.makePlayer();

        var battle = this.battle = this.makeBattle(
        {
          side1Units: side1Units,
          side2Units: side2Units,
          side1Player: side1Player,
          side2Player: side2Player
        });

        battle.init();
      },

      componentDidMount: function()
      {
        var battleScene = this.battleScene = new Rance.BattleScene(this.refs["main"].getDOMNode());
        battleScene.resume();
        tester = this;
        bs = battleScene;
      },

      makeUnit: function()
      {
        var template = getRandomProperty(app.moduleData.Templates.Units);
        return new Rance.Unit(template, this.idGenerator++);
      },

      makePlayer: function()
      {
        var player = new Player(false, this.idGenerator++);
        player.name = "player " + player.id;
        player.makeColorScheme();
        player.makeRandomFlag();
      },

      makeFormation: function(units: Unit[])
      {
        var formation: Unit[][] = [];
        var unitsIndex: number = 0;

        for (var i = 0; i < 2; i++)
        {
          formation.push([]);
          for (var j = 0; j < 3; j++)
          {
            var unitToAdd = units[unitsIndex] ? units[unitsIndex] : null;
            formation[i].push(unitToAdd);
            unitsIndex++;
          }
        }

        return formation;
      },

      makeBattle: function(props:
      {
        side1Units: Unit[];
        side2Units: Unit[];

        side1Player: Player;
        side2Player: Player;
      })
      {
        return new Rance.Battle(
        {
          battleData:
          {
            location: null,
            building: null,
            attacker:
            {
              player: props.side1Player,
              ships: props.side1Units
            },
            defender:
            {
              player: props.side2Player,
              ships: props.side2Units
            }
          },

          side1: this.makeFormation(props.side1Units),
          side2: this.makeFormation(props.side2Units),

          side1Player: props.side1Player,
          side2Player: props.side2Player
        });
      },

      handleUnitHover: function(unit: Unit)
      {
        if (this.deferredClearHover)
        {
          window.clearTimeout(this.deferredClearHover);
          this.deferredClearHover = null;
        }

        this.battleScene.getBattleSceneUnit(unit).enterUnitSprite(unit);
      },

      handleClearHover: function(unit: Unit)
      {
        this.battleScene.getBattleSceneUnit(unit).exitUnitSprite(unit);
        // this.deferredClearHover = window.setTimeout(function()
        // {
        //   window.clearTimeout(this.deferredClearHover);
        //   this.deferredClearHover = null;
        // }.bind(this), 200);
      },

      selectUnit: function(unit: Unit)
      {
        console.log("select unit " + unit.name);
        this.setState(
        {
          selectedUnit: unit
        });
      },

      handleTestAbility1: function()
      {
        var overlayTestFN = function(params: Templates.SFXParams)
        {
          var renderTexture = new PIXI.RenderTexture(params.renderer, params.width, params.height);
          var sprite = new PIXI.Sprite(renderTexture);
          var container = new PIXI.Container();

          var gfx = new PIXI.Graphics();
          gfx.beginFill(0xFF0000);
          gfx.drawRect(0, 0, 200, 200);
          gfx.endFill();
          container.addChild(gfx);

          var alphaPerMillisecond = 1 / params.duration;

          var startTime = Date.now();
          var endTime = startTime + params.duration;
          var lastTime = startTime;

          function animate()
          {
            var currentTime = Date.now();
            var elapsedTime = currentTime - lastTime;
            lastTime = currentTime;

            renderTexture.clear();
            renderTexture.render(container);

            if (currentTime < endTime)
            {
              gfx.alpha -= alphaPerMillisecond * elapsedTime;
              window.requestAnimationFrame(animate);
            }
            else
            {
              console.log("trigger overlayTest end");
              params.triggerEnd();
            }
          }

          console.log("trigger overlayTest start");
          params.triggerStart(container);
          animate();
        }

        var overlay = this.battleScene.getBattleSceneUnitOverlay(this.state.selectedUnit);
        overlay.setOverlay(overlayTestFN, this.state.selectedUnit, 2000);
      },

      makeUnitElements: function(units: Unit[])
      {
        var unitElements: ReactDOMPlaceHolder[] = [];

        for (var i = 0; i < units.length; i++)
        {
          var unit = units[i];
          var style: any = null;
          if (unit === this.state.selectedUnit)
          {
            style =
            {
              backgroundColor: "yellow"
            }
          }
          unitElements.push(React.DOM.div(
          {
            className: "battle-scene-test-controls-units-unit",
            onMouseEnter: this.handleUnitHover.bind(this, unit),
            onMouseLeave: this.handleClearHover.bind(this, unit),
            onClick: this.selectUnit.bind(this, unit),
            key: "" + unit.id,
            style: style
          },
            unit.name
          ))
        }


        return unitElements;
      },

      render: function()
      {
        var battle: Battle = this.battle;

        var side1UnitElements: ReactDOMPlaceHolder[] = this.makeUnitElements(battle.unitsBySide["side1"]);
        var side2UnitElements: ReactDOMPlaceHolder[] = this.makeUnitElements(battle.unitsBySide["side2"]);

        return(
          React.DOM.div(
          {
            className: "battle-scene-test"
          },
            React.DOM.div(
            {
              className: "battle-scene-test-pixi-container",
              ref: "main"
            },
              null
            ),
            React.DOM.div(
            {
              className: "battle-scene-test-controls"
            },
              React.DOM.div(
              {
                className: "battle-scene-test-controls-units"
              },
                React.DOM.div(
                {
                  className: "battle-scene-test-controls-units-side1"
                },
                  side1UnitElements
                ),
                React.DOM.div(
                {
                  className: "battle-scene-test-controls-units-side2"
                },
                  side2UnitElements
                )
              ),
              React.DOM.button(
              {
                className: "battle-scene-test-ability1",
                onClick: this.handleTestAbility1,
                disabled: !this.state.selectedUnit
              },
                "test ability 1"
              )
            )
          )
        );
      }
    })
  }
}
