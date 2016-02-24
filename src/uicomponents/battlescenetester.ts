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

      getInitialState: function()
      {
        return(
        {
          activeUnit: null,
          selectedSide1Unit: null,
          selectedSide2Unit: null
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
        this.battleScene.setHoveredUnit(unit);
      },

      handleClearHover: function()
      {
        this.battleScene.setHoveredUnit(null);
      },

      selectUnit: function(unit: Unit)
      {
        var statePropForSide = unit.battleStats.side === "side1" ? "selectedSide1Unit" : "selectedSide2Unit";
        var statePropForOtherSide = unit.battleStats.side === "side1" ? "selectedSide2Unit" : "selectedSide1Unit";
        var previousSelectedUnit = this.state[statePropForSide];
        var newSelectedUnit = (previousSelectedUnit === unit) ? null : unit;

        var newStateObj: any = {};
        newStateObj[statePropForSide] = newSelectedUnit;

        var newActiveUnit = newSelectedUnit || this.state[statePropForOtherSide] || null;
        newStateObj.activeUnit = newActiveUnit;

        this.setState(newStateObj);
        this.battleScene.setActiveUnit(newActiveUnit);
      },

      handleTestAbility1: function()
      {
        var overlayTestFN = function(color: number, params: Templates.SFXParams)
        {
          var renderTexture = new PIXI.RenderTexture(params.renderer, params.width, params.height);
          var sprite = new PIXI.Sprite(renderTexture);
          var container = new PIXI.Container();

          var text = new PIXI.Text("" + params.duration, {fill: color});
          text.y -= 50;
          container.addChild(text);

          var alphaPerMillisecond = 1 / params.duration;

          var currentTime = Date.now();
          var startTime = currentTime;
          var endTime = currentTime + params.duration;
          var lastTime = currentTime;

          function animate()
          {
            currentTime = Date.now();
            var elapsedTime = currentTime - lastTime;
            lastTime = currentTime;

            renderTexture.clear();
            renderTexture.render(container);

            if (currentTime < endTime)
            {
              if (currentTime > startTime)
              {
                text.text = "" + (endTime - currentTime);
              }
              window.requestAnimationFrame(animate);
            }
            else
            {
              params.triggerEnd();
            }
          }

          params.triggerStart(container);
          animate();
        }

        var spriteTestFN = function(params: Templates.SFXParams)
        {
          var container = new PIXI.Container;

          var gfx = new PIXI.Graphics();
          gfx.beginFill(0x0000FF);
          gfx.drawRect(0, 0, 200, 200);
          gfx.endFill();
          container.addChild(gfx);

          params.triggerStart(container);
        }

        var testSFX: Templates.IBattleSFXTemplate =
        {
          duration: 1000,
          battleOverlay: app.moduleData.Templates.BattleSFX["guard"].battleOverlay,
          userOverlay: overlayTestFN.bind(null, 0xFF0000),
          enemyOverlay: overlayTestFN.bind(null, 0x00FF00),
          userSprite: spriteTestFN,
          delay: 0.3
        }

        var user = this.state.activeUnit;
        var target = user === this.state.selectedSide1Unit ? this.state.selectedSide2Unit : this.state.selectedSide1Unit;

        var bs: Rance.BattleScene = this.battleScene;
        var SFXTemplate = testSFX;

        bs.setActiveSFX(SFXTemplate, user, target);
      },

      handleTestAbility2: function()
      {
        var user = this.state.activeUnit;
        var target = user === this.state.selectedSide1Unit ? this.state.selectedSide2Unit : this.state.selectedSide1Unit;

        var bs: Rance.BattleScene = this.battleScene;
        var SFXTemplate = app.moduleData.Templates.BattleSFX["guard"];

        bs.setActiveSFX(SFXTemplate, user, target);
      },

      makeUnitElements: function(units: Unit[])
      {
        var unitElements: ReactDOMPlaceHolder[] = [];

        for (var i = 0; i < units.length; i++)
        {
          var unit = units[i];
          var style: any = {};
          if (unit === this.state.activeUnit)
          {
            style.border = "1px solid red";
          }
          if (unit === this.state.selectedSide1Unit || unit === this.state.selectedSide2Unit)
          {
            style.backgroundColor = "yellow";
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
                disabled: !(this.state.selectedSide1Unit && this.state.selectedSide2Unit)
              },
                "test ability 1"
              ),
              React.DOM.button(
              {
                className: "battle-scene-test-ability2",
                onClick: this.handleTestAbility2,
                disabled: !(this.state.selectedSide1Unit && this.state.selectedSide2Unit)
              },
                "test ability 2"
              )
            )
          )
        );
      }
    })
  }
}
