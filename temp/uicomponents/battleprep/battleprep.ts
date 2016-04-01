/// <reference path="battleinfo.ts"/>
/// <reference path="../unitlist/menuunitinfo.ts"/>
/// <reference path="../battle/formation.ts" />
/// <reference path="../battle/battlebackground.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class BattlePrep extends React.Component<PropTypes, {}>
{
  displayName: reactTypeTODO_any = "BattlePrep";
  getInitialState: function()
  {
    return(
    {
      currentDragUnit: null,
      hoveredUnit: null,
      selectedUnit: null,
      currentDragItem: null,

      leftLowerElement: "playerFormation" // "playerFormation" || "enemyFormation" || "itemEquip"
    });
  }
  componentDidMount: function()
  {
    this.refs.background.handleResize();
  }
  autoMakeFormation: function()
  {
    var battlePrep = this.props.battlePrep;

    battlePrep.clearPlayerFormation();
    battlePrep.playerFormation = battlePrep.makeAutoFormation(
      battlePrep.availableUnits, battlePrep.enemyUnits, battlePrep.humanPlayer);

    battlePrep.setupPlayerFormation(battlePrep.playerFormation);

    this.setLeftLowerElement("playerFormation");
    this.forceUpdate();
  }

  handleSelectRow: function(row: IListItem)
  {
    if (!row.data.unit) return;

    this.setSelectedUnit(row.data.unit);
  }

  clearSelectedUnit: function()
  {
    this.setState(
    {
      selectedUnit: null
    });
  }

  setSelectedUnit: function(unit: Unit)
  {
    if (unit === this.state.selectedUnit)
    {
      this.clearSelectedUnit();
      return;
    }

    this.setState(
    {
      selectedUnit: unit,
      hoveredUnit: null
    });
  }


  handleMouseEnterUnit: function(unit: Unit)
  {
    this.setState(
    {
      hoveredUnit: unit
    });
  }

  handleMouseLeaveUnit: function()
  {
    this.setState(
    {
      hoveredUnit: null
    });
  }

  handleDragStart: function(unit: Unit)
  {
    this.setState(
    {
      currentDragUnit: unit
    });
  }
  handleDragEnd: function(dropSuccesful: boolean = false)
  {
    if (!dropSuccesful && this.state.currentDragUnit)
    {
      this.props.battlePrep.removeUnit(this.state.currentDragUnit);
    }

    this.setState(
    {
      currentDragUnit: null,
      hoveredUnit: null
    });

    return dropSuccesful;
  }
  handleDrop: function(position: number[])
  {
    var battlePrep = this.props.battlePrep;
    if (this.state.currentDragUnit)
    {
      var unitCurrentlyInPosition = battlePrep.getUnitAtPosition(position);
      if (unitCurrentlyInPosition)
      {
        battlePrep.swapUnits(this.state.currentDragUnit, unitCurrentlyInPosition);
      }
      else
      {
        battlePrep.setUnit(this.state.currentDragUnit, position);
      }

    }

    this.handleDragEnd(true);
  }

  handleItemDragStart: function(item: Item)
  {
    this.setState(
    {
      currentDragItem: item
    });
  }
  setLeftLowerElement: function(newElement: string)
  {
    var oldElement = this.state.leftLowerElement;
    var newState: any =
    {
      leftLowerElement: newElement
    }

    if (oldElement === "enemyFormation" || newElement === "enemyFormation")
    {
      newState.selectedUnit = null
    }

    this.setState(newState);
  }
  handleItemDragEnd: function(dropSuccesful: boolean = false)
  {
    if (!dropSuccesful && this.state.currentDragItem && this.state.selectedUnit)
    {
      var item = this.state.currentDragItem;
      if (this.state.selectedUnit.items[item.template.slot] === item)
      {
        this.state.selectedUnit.removeItem(item);
      }
    }

    this.setState(
    {
      currentDragItem: null
    });
  }
  handleItemDrop: function()
  {
    var item = this.state.currentDragItem;
    var unit = this.state.selectedUnit;
    if (unit && item)
    {
      if (unit.items[item.template.slot])
      {
        unit.removeItemAtSlot(item.template.slot);
      }
      unit.addItem(item);
    }

    this.handleItemDragEnd(true);
  }

  getBackgroundBlurArea: function()
  {
    return this.refs.upper.getDOMNode().getBoundingClientRect();
  }

  render: function()
  {
    var battlePrep: Rance.BattlePrep = this.props.battlePrep;
    var player = battlePrep.humanPlayer;
    var location = battlePrep.battleData.location;

    // priority: hovered unit > selected unit > battle info
    var leftUpperElement: ReactComponentPlaceHolder;

    var hoveredUnit = this.state.currentDragUnit || this.state.hoveredUnit;
    if (hoveredUnit)
    {
      leftUpperElement = UIComponents.MenuUnitInfo(
      {
        unit: hoveredUnit
      });
    }
    else if (this.state.selectedUnit)
    {
      var selectedUnitIsFriendly =
        battlePrep.availableUnits.indexOf(this.state.selectedUnit) !== -1;


      leftUpperElement = UIComponents.MenuUnitInfo(
      {
        unit: this.state.selectedUnit,
        onMouseUp: this.handleItemDrop,

        isDraggable: selectedUnitIsFriendly,
        onDragStart: this.handleItemDragStart,
        onDragEnd: this.handleItemDragEnd,
        currentDragItem: this.state.currentDragItem
      })
    }
    else
    {
      leftUpperElement = UIComponents.BattleInfo(
      {
        battlePrep: battlePrep
      });
    }


    var leftLowerElement: ReactComponentPlaceHolder;
    switch (this.state.leftLowerElement)
    {
      case "playerFormation":
      {
        leftLowerElement = UIComponents.Formation(
        {
          key: "playerFormation",
          formation: battlePrep.playerFormation.slice(0),
          facesLeft: false,
          hoveredUnit: this.state.hoveredUnit,
          activeUnit: this.state.selectedUnit,

          onMouseUp: this.handleDrop,
          onUnitClick: this.setSelectedUnit,

          isDraggable: true,
          onDragStart: this.handleDragStart,
          onDragEnd: this.handleDragEnd,

          handleMouseEnterUnit: this.handleMouseEnterUnit,
          handleMouseLeaveUnit: this.handleMouseLeaveUnit
        });
        break;
      }
      case "enemyFormation":
      {
        leftLowerElement = UIComponents.Formation(
        {
          key: "enemyFormation",
          formation: battlePrep.enemyFormation,
          facesLeft: true,
          hoveredUnit: this.state.hoveredUnit,
          activeUnit: this.state.selectedUnit,

          onUnitClick: this.setSelectedUnit,
          isDraggable: false,

          handleMouseEnterUnit: this.handleMouseEnterUnit,
          handleMouseLeaveUnit: this.handleMouseLeaveUnit
        });
        break;
      }
      case "itemEquip":
      {
        leftLowerElement = UIComponents.ItemList(
        {
          key: "itemEquip",
          items: player.items,
          isDraggable: true,
          onDragStart: this.handleItemDragStart,
          onDragEnd: this.handleItemDragEnd,
          onRowChange: this.handleSelectRow
        })
        break;
      }
    };

    var playerIsDefending = player === battlePrep.defender;
    var humanFormationIsValid = battlePrep.humanFormationIsValid();
    var canScout = player.starIsDetected(battlePrep.battleData.location);

    return(
      React.DOM.div({className: "battle-prep"},
        React.DOM.div({className: "battle-prep-left"},
          React.DOM.div({className: "battle-prep-left-upper-wrapper", ref: "upper"},
            UIComponents.BattleBackground(
            {
              ref: "background",
              renderer: this.props.renderer,
              getBlurArea: this.getBackgroundBlurArea,
              backgroundSeed: battlePrep.battleData.location.getSeed()
            },
              React.DOM.div({className: "battle-prep-left-upper-inner"},
                leftUpperElement
              )
            )
          ),
          React.DOM.div({className: "battle-prep-left-controls"},
            React.DOM.button(
            {
              className: "battle-prep-controls-button",
              onClick: this.setLeftLowerElement.bind(this, "itemEquip"),
              disabled: this.state.leftLowerElement === "itemEquip"
            }, "Equip"),
            React.DOM.button(
            {
              className: "battle-prep-controls-button",
              onClick: this.setLeftLowerElement.bind(this, "playerFormation"),
              disabled: this.state.leftLowerElement === "playerFormation"
            }, "Own"),
            React.DOM.button(
            {
              className: "battle-prep-controls-button",
              onClick: this.setLeftLowerElement.bind(this, "enemyFormation"),
              disabled: this.state.leftLowerElement === "enemyFormation" || !canScout,
              title: canScout ? null : "Can't inspect enemy formation" +
                " as star is not in detection radius"
            }, "Enemy"),
            React.DOM.button(
            {
              onClick: this.autoMakeFormation
            }, "Auto formation"),
            React.DOM.button(
            {
              onClick: function()
              {
                app.reactUI.switchScene("galaxyMap");
              },
              disabled: playerIsDefending
            }, "Cancel"),
            React.DOM.button(
            {
              className: "battle-prep-controls-button",
              disabled: !humanFormationIsValid,
              onClick: function()
              {
                var battle = battlePrep.makeBattle();
                app.reactUI.battle = battle;
                app.reactUI.switchScene("battle");
              }.bind(this)
            }, "Start battle"),
            !Options.debugMode ? null: React.DOM.button(
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
              }.bind(this)
            }, "Simulate battle")
          ),
          React.DOM.div({className: "battle-prep-left-lower"}, leftLowerElement)
        ),
        UIComponents.UnitList(
        {
          units: battlePrep.availableUnits,
          selectedUnit: this.state.selectedUnit,
          reservedUnits: battlePrep.alreadyPlaced,
          hoveredUnit: this.state.hoveredUnit,

          checkTimesActed: true,

          isDraggable: this.state.leftLowerElement === "playerFormation",
          onDragStart: this.handleDragStart,
          onDragEnd: this.handleDragEnd,

          onRowChange: this.handleSelectRow,

          onMouseEnter: this.handleMouseEnterUnit,
          onMouseLeave: this.handleMouseLeaveUnit
        })
      )
    );
  }
}
