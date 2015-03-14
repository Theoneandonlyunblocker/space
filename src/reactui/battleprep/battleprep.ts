/// <reference path="../unitlist/menuunitinfo.ts"/>

module Rance
{
  export module UIComponents
  {
    export var BattlePrep = React.createClass(
    {
      displayName: "BattlePrep",
      getInitialState: function()
      {
        return(
        {
          currentDragUnit: null,
          hoveredUnit: null,
          selectedUnit: null,
          currentDragItem: null,

          leftLowerElement: "playerFleet" // "playerFleet" || "enemyFleet" || "itemEquip"
        });
      },
      autoMakeFormation: function()
      {
        var battlePrep = this.props.battlePrep;

        battlePrep.clearPlayerFormation();
        battlePrep.playerFormation = battlePrep.makeAIFormation(
          battlePrep.availableUnits);

        battlePrep.setupPlayerFormation(battlePrep.playerFormation);

        this.forceUpdate();
      },

      handleSelectRow: function(row)
      {
        if (!row.data.unit) return;

        this.setSelectedUnit(row.data.unit);
      },

      clearSelectedUnit: function()
      {
        this.setState(
        {
          selectedUnit: null
        });
      },

      setSelectedUnit: function(unit: Unit)
      {
        if (unit === this.state.selectedUnit)
        {
          this.clearSelectedUnit();
          return;
        }

        this.setState(
        {
          selectedUnit: unit
        });
      },


      handleMouseEnterUnit: function(unit)
      {
        console.log(Date.now(), "hover unit", unit.id)
        this.setState(
        {
          hoveredUnit: unit
        });
      },

      handleMouseLeaveUnit: function()
      {
        console.log(Date.now(), "clear hover")
        this.setState(
        {
          hoveredUnit: null
        });
      },

      handleDragStart: function(unit)
      {
        this.setState(
        {
          currentDragUnit: unit,
          hoveredUnit: null
        });
      },
      handleDragEnd: function(dropSuccesful: boolean = false)
      {
        console.log(Date.now(), "handleDragEnd", dropSuccesful, this.state.currentDragUnit);
        if (!dropSuccesful && this.state.currentDragUnit)
        {
          console.log(Date.now(), "removeUnit", this.state.currentDragUnit);
          this.props.battlePrep.removeUnit(this.state.currentDragUnit);
        }

        this.setState(
        {
          currentDragUnit: null,
          hoveredUnit: null
        });

        return dropSuccesful;
      },
      handleDrop: function(position)
      {
        console.log(Date.now(), "handleDrop")
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
      },

      handleItemDragStart: function(item)
      {
        this.setState(
        {
          currentDragItem: item
        });
      },
      setLeftLowerElement: function(newElement: string)
      {
        var oldElement = this.state.leftLowerElement;
        var newState: any =
        {
          leftLowerElement: newElement
        }

        if (oldElement === "enemyFleet" || newElement === "enemyFleet")
        {
          newState.selectedUnit = null
        }

        this.setState(newState);
      },
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
      },
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
      },

      render: function()
      {

        // priority: hovered unit > selected unit > battle infd
        var leftUpperElement;

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
            this.props.battlePrep.availableUnits.indexOf(this.state.selectedUnit) !== -1;

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
          leftUpperElement = React.DOM.div(null, "battle info todo");
        }


        var leftLowerElement;
        switch (this.state.leftLowerElement)
        {
          case "playerFleet":
          {
            leftLowerElement = UIComponents.Fleet(
            {
              fleet: this.props.battlePrep.playerFormation.slice(0),

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
          case "enemyFleet":
          {
            leftLowerElement = UIComponents.Fleet(
            {
              fleet: this.props.battlePrep.enemyFormation,

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
              items: this.props.battlePrep.humanPlayer.items,
              isDraggable: true,
              onDragStart: this.handleItemDragStart,
              onDragEnd: this.handleItemDragEnd,
              onRowChange: this.handleSelectRow
            })
            break;
          }
        };

        return(
          React.DOM.div({className: "battle-prep"},
            React.DOM.div({className: "battle-prep-left"},
              React.DOM.div({className: "battle-prep-left-upper"}, leftUpperElement),
              React.DOM.div({className: "battle-prep-left-controls"},
                React.DOM.button(
                {
                  className: "battle-prep-controls-button",
                  onClick: this.setLeftLowerElement.bind(this, "itemEquip")
                }, "Equip"),
                React.DOM.button(
                {
                  className: "battle-prep-controls-button",
                  onClick: this.setLeftLowerElement.bind(this, "playerFleet")
                }, "Own"),
                React.DOM.button(
                {
                  className: "battle-prep-controls-button",
                  onClick: this.setLeftLowerElement.bind(this, "enemyFleet")
                }, "Enemy"),
                React.DOM.button(
                {
                  onClick: this.autoMakeFormation
                }, "Auto formation"),
                React.DOM.button(
                {
                  className: "battle-prep-controls-button",
                  onClick: function()
                  {
                    var battle = this.props.battlePrep.makeBattle();
                    app.reactUI.battle = battle;
                    app.reactUI.switchScene("battle");
                  }.bind(this)
                }, "Start battle")
              ),
              React.DOM.div({className: "battle-prep-left-lower"}, leftLowerElement)
            ),
            UIComponents.UnitList(
            {
              units: this.props.battlePrep.availableUnits,
              selectedUnit: this.state.selectedUnit,
              reservedUnits: this.props.battlePrep.alreadyPlaced,

              checkTimesActed: true,

              isDraggable: this.state.leftLowerElement === "playerFleet",
              onDragStart: this.handleDragStart,
              onDragEnd: this.handleDragEnd,
              onRowChange: this.handleSelectRow
            })
          )
        );
      }
    });
  }
}
