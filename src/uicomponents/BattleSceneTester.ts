/// <reference path="../../lib/react-global.d.ts" />


import Unit from "../Unit";
import Player from "../Player";
import Battle from "../Battle";
import BattleScene from "../BattleScene";
import SFXParams from "../templateinterfaces/SFXParams";
import BattleSFXTemplate from "../templateinterfaces/BattleSFXTemplate";
import
{
  getRandomProperty,
  extendObject
} from "../utility";


import app from "../App"; // TODO global

export interface PropTypes extends React.Props<any>
{
}

interface StateType
{
  selectedSide1Unit?: Unit;
  selectedSFXTemplateKey?: string;
  activeUnit?: Unit;
  selectedSide2Unit?: Unit;
  duration?: number;
}

export class BattleSceneTesterComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "BattleSceneTester";
  battle: Battle = null;
  battleScene: BattleScene = null;

  state: StateType;
  
  ref_TODO_main: HTMLElement;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialStateTODO();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.useSelectedAbility = this.useSelectedAbility.bind(this);
    this.makeBattle = this.makeBattle.bind(this);
    this.selectUnit = this.selectUnit.bind(this);
    this.makeUnitElements = this.makeUnitElements.bind(this);
    this.makeFormation = this.makeFormation.bind(this);
    this.handleTestAbility1 = this.handleTestAbility1.bind(this);
    this.makeUnit = this.makeUnit.bind(this);
    this.handleUnitHover = this.handleUnitHover.bind(this);
    this.handleClearHover = this.handleClearHover.bind(this);
    this.handleChangeDuration = this.handleChangeDuration.bind(this);
    this.handleSelectSFXTemplate = this.handleSelectSFXTemplate.bind(this);    
  }
  
  private getInitialStateTODO(): StateType
  {
    var side1Units: Unit[] = [];
    var side2Units: Unit[] = [];
    for (let i = 0; i < 5; i++)
    {
      side1Units.push(this.makeUnit());
      side2Units.push(this.makeUnit());
    }

    var side1Player = Player.createDummyPlayer();
    var side2Player = Player.createDummyPlayer();

    var battle = this.battle = this.makeBattle(
    {
      side1Units: side1Units,
      side2Units: side2Units,
      side1Player: side1Player,
      side2Player: side2Player
    });

    battle.init();

    const initialSFXTemplateKey = "rocketAttack";
    const initialSFXTemplate = app.moduleData.Templates.BattleSFX[initialSFXTemplateKey];

    return(
    {
      activeUnit: side1Units[0],
      selectedSide1Unit: side1Units[0],
      selectedSide2Unit: side2Units[0],
      selectedSFXTemplateKey: initialSFXTemplateKey,

      duration: initialSFXTemplate.duration
    });
  }

  componentDidMount()
  {
    var battleScene = this.battleScene = new BattleScene(ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_main));
    battleScene.resume();
    battleScene.activeUnit = this.state.selectedSide1Unit;
    battleScene.updateUnits()
  }

  makeUnit()
  {
    var template = getRandomProperty(app.moduleData.Templates.Units);
    return new Unit(template);
  }

  makeFormation(units: Unit[])
  {
    var formation: Unit[][] = [];
    var unitsIndex: number = 0;

    for (let i = 0; i < 2; i++)
    {
      formation.push([]);
      for (let j = 0; j < 3; j++)
      {
        var unitToAdd = units[unitsIndex] ? units[unitsIndex] : null;
        formation[i].push(unitToAdd);
        unitsIndex++;
      }
    }

    return formation;
  }

  makeBattle(props:
  {
    side1Units: Unit[];
    side2Units: Unit[];

    side1Player: Player;
    side2Player: Player;
  })
  {
    return new Battle(
    {
      battleData:
      {
        location: null,
        building: null,
        attacker:
        {
          player: props.side1Player,
          units: props.side1Units
        },
        defender:
        {
          player: props.side2Player,
          units: props.side2Units
        }
      },

      side1: this.makeFormation(props.side1Units),
      side2: this.makeFormation(props.side2Units),

      side1Player: props.side1Player,
      side2Player: props.side2Player
    });
  }

  handleUnitHover(unit: Unit)
  {
    this.battleScene.hoveredUnit = unit;
    this.battleScene.updateUnits();
  }

  handleClearHover()
  {
    this.battleScene.hoveredUnit = null;
    this.battleScene.updateUnits();
  }

  selectUnit(unit: Unit)
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
    this.battleScene.activeUnit = newActiveUnit;
    this.battleScene.updateUnits();
  }

  handleSelectSFXTemplate(e: React.FormEvent)
  {
    const target = <HTMLInputElement> e.target;
    const SFXTemplate = app.moduleData.Templates.BattleSFX[target.value];

    this.setState(
    {
      selectedSFXTemplateKey: target.value,
      duration: SFXTemplate.duration
    });
  }

  handleChangeDuration(e: React.FormEvent)
  {
    var target = <HTMLInputElement> e.target;
    this.setState(
    {
      duration: parseInt(target.value)
    });
  }

  handleTestAbility1()
  {
    var overlayTestFN = function(color: number, params: SFXParams)
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

    var spriteTestFN = function(params: SFXParams)
    {
      var container = new PIXI.Container;

      var gfx = new PIXI.Graphics();
      gfx.beginFill(0x0000FF);
      gfx.drawRect(0, 0, 200, 200);
      gfx.endFill();
      container.addChild(gfx);

      params.triggerStart(container);
    }

    var testSFX: BattleSFXTemplate =
    {
      duration: 1000,
      battleOverlay: app.moduleData.Templates.BattleSFX["guard"].battleOverlay,
      userOverlay: overlayTestFN.bind(null, 0xFF0000),
      enemyOverlay: overlayTestFN.bind(null, 0x00FF00),
      userSprite: spriteTestFN
    }

    var user = this.state.activeUnit;
    var target = user === this.state.selectedSide1Unit ? this.state.selectedSide2Unit : this.state.selectedSide1Unit;

    var bs: BattleScene = this.battleScene;
    var SFXTemplate = testSFX;

    bs.handleAbilityUse(
    {
      user: user,
      target: target,
      SFXTemplate: SFXTemplate,
      triggerEffectCallback: function(){console.log("triggerEffect")},
      onSFXStartCallback: function(){console.log("onSFXStart")},
      afterFinishedCallback: function(){console.log("afterFinishedCallback")}
    });
  }

  useSelectedAbility()
  {
    var user = this.state.activeUnit;
    var target = user === this.state.selectedSide1Unit ? this.state.selectedSide2Unit : this.state.selectedSide1Unit;

    var bs: BattleScene = this.battleScene;
    var SFXTemplate = extendObject(app.moduleData.Templates.BattleSFX[this.state.selectedSFXTemplateKey]);

    if (this.state.duration)
    {
      SFXTemplate.duration = this.state.duration;
    }

    bs.handleAbilityUse(
    {
      user: user,
      target: target,
      SFXTemplate: SFXTemplate,
      triggerEffectCallback: function(){console.log("triggerEffect")},
      onSFXStartCallback: function(){console.log("onSFXStart")},
      afterFinishedCallback: function(){console.log("afterFinishedCallback")}
    });
  }

  makeUnitElements(units: Unit[])
  {
    var unitElements: React.ReactHTMLElement<any>[] = [];

    for (let i = 0; i < units.length; i++)
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
  }

  render()
  {
    var battle: Battle = this.battle;

    var side1UnitElements: React.ReactHTMLElement<any>[] = this.makeUnitElements(battle.unitsBySide["side1"]);
    var side2UnitElements: React.ReactHTMLElement<any>[] = this.makeUnitElements(battle.unitsBySide["side2"]);

    var SFXTemplateSelectOptions: React.ReactHTMLElement<any>[] = [];

    for (let key in app.moduleData.Templates.BattleSFX)
    {
      var template = app.moduleData.Templates.BattleSFX[key];

      SFXTemplateSelectOptions.push(React.DOM.option(
      {
        value: key,
        key: key
      },
        key
      ));
    }

    return(
      React.DOM.div(
      {
        className: "battle-scene-test"
      },
        React.DOM.div(
        {
          className: "battle-scene-test-pixi-container",
          ref: (component: HTMLElement) =>
          {
            this.ref_TODO_main = component;
          }
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
          React.DOM.select(
          {
            value: this.state.selectedSFXTemplateKey,
            onChange: this.handleSelectSFXTemplate
          },
            SFXTemplateSelectOptions
          ),
          React.DOM.button(
          {
            className: "battle-scene-test-ability2",
            onClick: this.useSelectedAbility,
            disabled: !this.state.selectedSFXTemplateKey || !(this.state.selectedSide1Unit && this.state.selectedSide2Unit)
          },
            "use ability"
          ),
          React.DOM.input(
          {
            type: "number",
            step: 100,
            min: 100,
            max: 20000,
            value: "" + this.state.duration,
            onChange: this.handleChangeDuration,
            placeholder: "duration"
          },
            null
          )
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BattleSceneTesterComponent);
export default Factory;
