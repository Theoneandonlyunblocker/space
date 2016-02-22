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
        battleScene.render();
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
        console.log("hover unit " + unit.name);
        this.battleScene.setUnitSprite(unit);
      },

      handleClearHover: function(unit: Unit)
      {
        console.log("clear hover " + unit.name);
        this.battleScene.clearUnitSprite(unit);
      },

      makeUnitElements: function(units: Unit[])
      {
        var unitElements: ReactDOMPlaceHolder[] = [];

        for (var i = 0; i < units.length; i++)
        {
          var unit = units[i];
          unitElements.push(React.DOM.div(
          {
            className: "battle-scene-test-controls-units-unit",
            onMouseEnter: this.handleUnitHover.bind(this, unit),
            onMouseLeave: this.handleClearHover.bind(this, unit),
            key: "" + unit.id
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
              )
            )
          )
        );
      }
    })
  }
}
