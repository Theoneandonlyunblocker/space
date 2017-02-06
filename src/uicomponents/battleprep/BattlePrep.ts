/// <reference path="../../../lib/react-global.d.ts" />

import app from "../../App"; // TODO global

import BattlePrep from "../../BattlePrep";
import BattleSimulator from "../../BattleSimulator";
import Item from "../../Item";
import Options from "../../Options";
import Unit from "../../Unit";
import eventManager from "../../eventManager";
import {BattleBackgroundComponent, default as BattleBackground} from "../battle/BattleBackground";
import Formation from "../battle/Formation";
import ListItem from "../list/ListItem";
import ItemList from "../unitlist/ItemList";
import {PropTypes as ItemListItemPropTypes} from "../unitlist/ItemListItem";
import MenuUnitInfo from "../unitlist/MenuUnitInfo";
import UnitList from "../unitlist/UnitList";
import {PropTypes as UnitListItemPropTypes} from "../unitlist/UnitListItem";
import BattleInfo from "./BattleInfo";


export interface PropTypes extends React.Props<any>
{
  battlePrep: BattlePrep;
}

interface StateType
{
  hoveredUnit?: Unit;
  currentDragUnit?: Unit;
  leftLowerElement?: "playerFormation" | "enemyFormation" | "itemEquip";
  currentDragItem?: Item;
  selectedUnit?: Unit;
}

export class BattlePrepComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "BattlePrep";
  state: StateType;
  ref_TODO_background: BattleBackgroundComponent;
  ref_TODO_upper: HTMLElement;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleMouseEnterUnit = this.handleMouseEnterUnit.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleItemDragStart = this.handleItemDragStart.bind(this);
    this.setLeftLowerElement = this.setLeftLowerElement.bind(this);
    this.handleItemDragEnd = this.handleItemDragEnd.bind(this);
    this.handleItemDrop = this.handleItemDrop.bind(this);
    this.setSelectedUnit = this.setSelectedUnit.bind(this);
    this.handleMouseLeaveUnit = this.handleMouseLeaveUnit.bind(this);
    this.clearSelectedUnit = this.clearSelectedUnit.bind(this);
    this.autoMakeFormation = this.autoMakeFormation.bind(this);
    this.handleSelectRow = this.handleSelectRow.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.getBackgroundBlurArea = this.getBackgroundBlurArea.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      currentDragUnit: null,
      hoveredUnit: null,
      selectedUnit: null,
      currentDragItem: null,

      leftLowerElement: "playerFormation",
    });
  }
  componentDidMount()
  {
    this.ref_TODO_background.handleResize();
  }
  autoMakeFormation()
  {
    this.props.battlePrep.humanFormation.clearFormation();
    this.props.battlePrep.humanFormation.setAutoFormation(
      this.props.battlePrep.enemyUnits, this.props.battlePrep.enemyFormation.formation);

    this.setLeftLowerElement("playerFormation");
    this.forceUpdate();
  }

  handleSelectRow(row: ListItem<UnitListItemPropTypes | ItemListItemPropTypes>)
  {
    if (!row.content.props.unit)
    {
      return;
    }

    this.setSelectedUnit(row.content.props.unit);
  }

  clearSelectedUnit()
  {
    this.setState(
    {
      selectedUnit: null,
    });
  }

  setSelectedUnit(unit: Unit)
  {
    if (unit === this.state.selectedUnit)
    {
      this.clearSelectedUnit();
      return;
    }

    this.setState(
    {
      selectedUnit: unit,
      hoveredUnit: null,
    });
  }


  handleMouseEnterUnit(unit: Unit)
  {
    this.setState(
    {
      hoveredUnit: unit,
    });
  }

  handleMouseLeaveUnit()
  {
    this.setState(
    {
      hoveredUnit: null,
    });
  }

  handleDragStart(unit: Unit)
  {
    this.setState(
    {
      currentDragUnit: unit,
    });
  }
  handleDragEnd(dropSuccesful: boolean = false)
  {
    if (!dropSuccesful && this.state.currentDragUnit)
    {
      this.props.battlePrep.humanFormation.removeUnit(this.state.currentDragUnit);
    }

    this.setState(
    {
      currentDragUnit: null,
      hoveredUnit: null,
    });

    return dropSuccesful;
  }
  handleDrop(position: number[])
  {
    var battlePrep = this.props.battlePrep;
    if (this.state.currentDragUnit)
    {
      battlePrep.humanFormation.setUnit(this.state.currentDragUnit, position);
    }

    this.handleDragEnd(true);
  }

  handleItemDragStart(item: Item)
  {
    this.setState(
    {
      currentDragItem: item,
    });
  }
  setLeftLowerElement(newElement: string)
  {
    var oldElement = this.state.leftLowerElement;
    var newState: any =
    {
      leftLowerElement: newElement,
    };

    if (oldElement === "enemyFormation" || newElement === "enemyFormation")
    {
      newState.selectedUnit = null;
    }

    this.setState(newState);
  }
  handleItemDragEnd(dropSuccesful: boolean = false)
  {
    if (!dropSuccesful && this.state.currentDragItem && this.state.selectedUnit)
    {
      var item = this.state.currentDragItem;
      if (this.state.selectedUnit.items.hasItem(item))
      {
        this.state.selectedUnit.items.removeItem(item);
      }
    }

    this.setState(
    {
      currentDragItem: null,
    });
  }
  handleItemDrop(index: number)
  {
    var item = this.state.currentDragItem;
    var unit = this.state.selectedUnit;
    if (unit && item)
    {
      unit.items.addItemAtPosition(item, index);
    }

    this.handleItemDragEnd(true);
  }

  getBackgroundBlurArea()
  {
    return ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_upper).getBoundingClientRect();
  }

  render()
  {
    var battlePrep = this.props.battlePrep;
    var player = battlePrep.humanPlayer;

    // priority: hovered unit > selected unit > battle info
    var leftUpperElement: React.ReactElement<any>;

    var hoveredUnit = this.state.currentDragUnit || this.state.hoveredUnit;
    if (hoveredUnit)
    {
      leftUpperElement = MenuUnitInfo(
      {
        unit: hoveredUnit,
      });
    }
    else if (this.state.selectedUnit)
    {
      var selectedUnitIsFriendly = battlePrep.humanUnits.some(unit => unit === this.state.selectedUnit);

      leftUpperElement = MenuUnitInfo(
      {
        unit: this.state.selectedUnit,
        onMouseUp: this.handleItemDrop,

        isDraggable: selectedUnitIsFriendly,
        onDragStart: this.handleItemDragStart,
        onDragEnd: this.handleItemDragEnd,
        currentDragItem: this.state.currentDragItem,
      });
    }
    else
    {
      leftUpperElement = BattleInfo(
      {
        battlePrep: battlePrep,
      });
    }


    var leftLowerElement: React.ReactElement<any>;
    switch (this.state.leftLowerElement)
    {
      case "playerFormation":
      {
        leftLowerElement = Formation(
        {
          key: "playerFormation",
          formation: battlePrep.humanFormation.formation,
          facesLeft: false,
          unitDisplayDataByID: battlePrep.humanFormation.getDisplayData(),

          isInBattlePrep: true,

          hoveredUnit: this.state.hoveredUnit,
          activeUnit: this.state.selectedUnit,

          onMouseUp: this.handleDrop,
          onUnitClick: this.setSelectedUnit,
          handleMouseEnterUnit: this.handleMouseEnterUnit,
          handleMouseLeaveUnit: this.handleMouseLeaveUnit,

          unitStrengthAnimateDuration: undefined,

          isDraggable: true,
          onDragStart: this.handleDragStart,
          onDragEnd: this.handleDragEnd,
        });
        break;
      }
      case "enemyFormation":
      {
        leftLowerElement = Formation(
        {
          key: "enemyFormation",
          formation: battlePrep.enemyFormation.formation,
          facesLeft: true,
          unitDisplayDataByID: battlePrep.enemyFormation.getDisplayData(),

          isInBattlePrep: true,

          hoveredUnit: this.state.hoveredUnit,
          activeUnit: this.state.selectedUnit,

          onUnitClick: this.setSelectedUnit,
          handleMouseEnterUnit: this.handleMouseEnterUnit,
          handleMouseLeaveUnit: this.handleMouseLeaveUnit,

          unitStrengthAnimateDuration: undefined,

          isDraggable: false,
        });
        break;
      }
      case "itemEquip":
      {
        leftLowerElement = ItemList(
        {
          key: "itemEquip",
          items: player.items,
          isDraggable: true,
          onDragStart: this.handleItemDragStart,
          onDragEnd: this.handleItemDragEnd,
          onRowChange: this.handleSelectRow,
        });
        break;
      }
    };

    var playerIsDefending = player === battlePrep.defender;
    const humanFormationValidity = battlePrep.humanFormation.getFormationValidity();
    var canScout = player.starIsDetected(battlePrep.battleData.location);

    return(
      React.DOM.div({className: "battle-prep"},
        React.DOM.div({className: "battle-prep-left"},
          React.DOM.div({className: "battle-prep-left-upper-wrapper", ref: (component: HTMLElement) =>
          {
            this.ref_TODO_upper = component;
          }},
            BattleBackground(
            {
              getBlurArea: this.getBackgroundBlurArea,
              backgroundSeed: battlePrep.battleData.location.getSeed(),
              backgroundDrawingFunction: app.moduleData.starBackgroundDrawingFunction,
              ref: (component: BattleBackgroundComponent) =>
              {
                this.ref_TODO_background = component;
              },
            },
              React.DOM.div({className: "battle-prep-left-upper-inner"},
                leftUpperElement,
              ),
            ),
          ),
          React.DOM.div({className: "battle-prep-left-controls"},
            React.DOM.button(
            {
              className: "battle-prep-controls-button",
              onClick: this.setLeftLowerElement.bind(this, "itemEquip"),
              disabled: this.state.leftLowerElement === "itemEquip",
            }, "Equip"),
            React.DOM.button(
            {
              className: "battle-prep-controls-button",
              onClick: this.setLeftLowerElement.bind(this, "playerFormation"),
              disabled: this.state.leftLowerElement === "playerFormation",
            }, "Own"),
            React.DOM.button(
            {
              className: "battle-prep-controls-button",
              onClick: this.setLeftLowerElement.bind(this, "enemyFormation"),
              disabled: this.state.leftLowerElement === "enemyFormation" || !canScout,
              title: canScout ? null : "Can't inspect enemy formation" +
                " as star is not in detection radius",
            }, "Enemy"),
            React.DOM.button(
            {
              onClick: this.autoMakeFormation,
            }, "Auto formation"),
            React.DOM.button(
            {
              onClick: function()
              {
                app.reactUI.switchScene("galaxyMap");
              },
              disabled: playerIsDefending,
            }, "Cancel"),
            React.DOM.button(
            {
              className: "battle-prep-controls-button",
              disabled: !humanFormationValidity.isValid,
              title: humanFormationValidity.description,
              onClick: function()
              {
                var battle = battlePrep.makeBattle();
                app.reactUI.battle = battle;
                app.reactUI.switchScene("battle");
              }.bind(this),
            }, "Start battle"),
            !Options.debug.enabled ? null: React.DOM.button(
            {
              className: "battle-prep-controls-button",
              onClick: function()
              {
                var battle = battlePrep.makeBattle();
                var simulator = new BattleSimulator(battle);
                simulator.simulateBattle();
                simulator.finishBattle();
                eventManager.dispatchEvent("setCameraToCenterOn", battle.battleData.location);
                eventManager.dispatchEvent("switchScene", "galaxyMap");
              }.bind(this),
            }, "Simulate battle"),
          ),
          React.DOM.div({className: "battle-prep-left-lower"}, leftLowerElement),
        ),
        UnitList(
        {
          units: battlePrep.humanFormation.units,
          selectedUnit: this.state.selectedUnit,
          reservedUnits: battlePrep.humanFormation.placedUnitPositionsByID,
          hoveredUnit: this.state.hoveredUnit,

          checkTimesActed: true,

          isDraggable: this.state.leftLowerElement === "playerFormation",
          onDragStart: this.handleDragStart,
          onDragEnd: this.handleDragEnd,

          onRowChange: this.handleSelectRow,

          onMouseEnterUnit: this.handleMouseEnterUnit,
          onMouseLeave: this.handleMouseLeaveUnit,
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(BattlePrepComponent);
export default Factory;
