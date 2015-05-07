/// <reference path="battleinfo.ts"/>
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

        this.setLeftLowerElement("playerFleet");
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
          selectedUnit: unit,
          hoveredUnit: null
        });
      },


      handleMouseEnterUnit: function(unit)
      {
        console.log("handleMouseEnterUnit", unit.id);
        this.setState(
        {
          hoveredUnit: unit
        });
      },

      handleMouseLeaveUnit: function()
      {
        this.setState(
        {
          hoveredUnit: null
        });
      },

      handleDragStart: function(unit)
      {
        this.setState(
        {
          currentDragUnit: unit
        });
      },
      handleDragEnd: function(dropSuccesful: boolean = false)
      {
        console.log("handleDragEnd", dropSuccesful);
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
      },
      handleDrop: function(position)
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

      getBackgroundBlurArea: function()
      {
        return this.refs.upper.getDOMNode().getBoundingClientRect();
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
          leftUpperElement = UIComponents.BattleInfo(
          {
            battlePrep: this.props.battlePrep
          });
          //leftUpperElement = React.DOM.div(null, "battle info todo");
        }


        var leftLowerElement;
        switch (this.state.leftLowerElement)
        {
          case "playerFleet":
          {
            leftLowerElement = UIComponents.Fleet(
            {
              key: "playerFleet",
              fleet: this.props.battlePrep.playerFormation.slice(0),
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
          case "enemyFleet":
          {
            leftLowerElement = UIComponents.Fleet(
            {
              key: "enemyFleet",
              fleet: this.props.battlePrep.enemyFormation,
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
              React.DOM.div({className: "battle-prep-left-upper-wrapper", ref: "upper"},
                UIComponents.BattleBackground(
                {
                  renderer: this.props.renderer,
                  getBlurArea: this.getBackgroundBlurArea,
                  backgroundSeed: this.props.battlePrep.battleData.location.getBackgroundSeed()
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
                  onClick: this.setLeftLowerElement.bind(this, "playerFleet"),
                  disabled: this.state.leftLowerElement === "playerFleet"
                }, "Own"),
                React.DOM.button(
                {
                  className: "battle-prep-controls-button",
                  onClick: this.setLeftLowerElement.bind(this, "enemyFleet"),
                  disabled: this.state.leftLowerElement === "enemyFleet"
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
                  }
                }, "Cancel"),
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
              hoveredUnit: this.state.hoveredUnit,

              checkTimesActed: true,

              isDraggable: this.state.leftLowerElement === "playerFleet",
              onDragStart: this.handleDragStart,
              onDragEnd: this.handleDragEnd,

              onRowChange: this.handleSelectRow,

              onMouseEnter: this.handleMouseEnterUnit,
              onMouseLeave: this.handleMouseLeaveUnit
            })
          )
        );
      }
    });
  }
}
