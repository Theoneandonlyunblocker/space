import * as React from "react";
import * as ReactDOM from "react-dom";

import {localize} from "../../../localization/localize";
import app from "../../App"; // TODO global
import BattlePrep from "../../BattlePrep";
import { BattlePrepFormation } from "../../BattlePrepFormation";
import
{
  FormationInvalidityReason,
  FormationValidity,
  FormationValidityModifier,
  FormationValidityModifierEffect,
  FormationValidityModifierSourceType,
} from "../../BattlePrepFormationValidity";
import BattleSimulator from "../../BattleSimulator";
import Item from "../../Item";
import Options from "../../Options";
import Unit from "../../Unit";
import {activeModuleData} from "../../activeModuleData";
import { extractFlagsFromFlagWord } from "../../utility";
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
  hoveredUnit: Unit | null;
  currentDragUnit: Unit | null;
  leftLowerElement: "playerFormation" | "enemyFormation" | "itemEquip";
  currentDragItem: Item | null;
  selectedUnit: Unit | null;
}

export class BattlePrepComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "BattlePrep";
  public state: StateType;

  private backgroundComponent: BattleBackgroundComponent;
  private upperElement: HTMLElement | null;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      currentDragUnit: null,
      hoveredUnit: null,
      selectedUnit: null,
      currentDragItem: null,

      leftLowerElement: "playerFormation",
    };

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
    this.handleSelectUnitListRow = this.handleSelectUnitListRow.bind(this);
    this.handleSelectItemListRow = this.handleSelectItemListRow.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.getBackgroundBlurArea = this.getBackgroundBlurArea.bind(this);
  }

  public componentDidMount()
  {
    this.backgroundComponent.handleResize();
  }
  public render()
  {
    const battlePrep = this.props.battlePrep;
    const player = battlePrep.humanPlayer;

    // priority: hovered unit > selected unit > battle info
    let leftUpperElement: React.ReactElement<any>;

    const hoveredUnit = this.state.currentDragUnit || this.state.hoveredUnit;
    if (hoveredUnit)
    {
      leftUpperElement = MenuUnitInfo(
      {
        unit: hoveredUnit,
      });
    }
    else if (this.state.selectedUnit)
    {
      const selectedUnitIsFriendly = battlePrep.humanUnits.some(unit => unit === this.state.selectedUnit);

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


    let leftLowerElement: React.ReactElement<any>;
    switch (this.state.leftLowerElement)
    {
      case "playerFormation":
      {
        leftLowerElement = Formation(
        {
          key: "playerFormation",
          formation: battlePrep.humanFormation.formation,
          facesLeft: false,
          unitDisplayDataById: battlePrep.humanFormation.getDisplayData(),

          isInBattlePrep: true,

          hoveredUnit: this.state.hoveredUnit,
          activeUnit: this.state.selectedUnit,
          abilityTargetDisplayDataById: {},

          onMouseUp: this.handleDrop,
          onUnitClick: this.setSelectedUnit,
          handleMouseEnterUnit: this.handleMouseEnterUnit,
          handleMouseLeaveUnit: this.handleMouseLeaveUnit,

          unitStrengthAnimateDuration: undefined,

          isDraggable: true,
          onDragStart: this.handleDragStart.bind(null, false),
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
          unitDisplayDataById: battlePrep.enemyFormation.getDisplayData(),

          isInBattlePrep: true,

          hoveredUnit: this.state.hoveredUnit,
          activeUnit: this.state.selectedUnit,
          abilityTargetDisplayDataById: {},

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
          onRowChange: this.handleSelectItemListRow,
        });
        break;
      }
    }

    const playerIsDefending = player === battlePrep.defender;
    const humanFormationValidity = battlePrep.humanFormation.getFormationValidity();
    const canInspectEnemyFormation = this.canInspectEnemyFormation();

    return(
      React.DOM.div({className: "battle-prep"},
        React.DOM.div({className: "battle-prep-left"},
          React.DOM.div({className: "battle-prep-left-upper-wrapper", ref: component =>
          {
            this.upperElement = component;
          }},
            BattleBackground(
            {
              getBlurArea: this.getBackgroundBlurArea,
              backgroundSeed: battlePrep.battleData.location.seed,
              backgroundDrawingFunction: activeModuleData.starBackgroundDrawingFunction,
              ref: (component: BattleBackgroundComponent) =>
              {
                this.backgroundComponent = component;
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
            }, localize("equip")()),
            React.DOM.button(
            {
              className: "battle-prep-controls-button",
              onClick: this.setLeftLowerElement.bind(this, "playerFormation"),
              disabled: this.state.leftLowerElement === "playerFormation",
            }, localize("ownFormation")()),
            React.DOM.button(
            {
              className: "battle-prep-controls-button",
              onClick: this.setLeftLowerElement.bind(this, "enemyFormation"),
              disabled: this.state.leftLowerElement === "enemyFormation" || !canInspectEnemyFormation,
              title: canInspectEnemyFormation ?
                undefined :
                localize("cantInspectEnemyFormationAsStarIsNotInDetectionRadius")(),
            }, localize("enemy")()),
            React.DOM.button(
            {
              onClick: this.autoMakeFormation,
            }, localize("autoFormation")()),
            React.DOM.button(
            {
              onClick: () =>
              {
                app.reactUI.switchScene("galaxyMap");
              },
              disabled: playerIsDefending,
            }, localize("cancel")()),
            React.DOM.button(
            {
              className: "battle-prep-controls-button",
              disabled: !humanFormationValidity.isValid,
              title: humanFormationValidity.isValid ? "" : this.localizeInvalidFormationExplanation(
                battlePrep.humanFormation,
                humanFormationValidity,
              ),
              onClick: () =>
              {
                const battle = battlePrep.makeBattle();
                app.reactUI.battle = battle;
                app.reactUI.switchScene("battle");
              },
            }, localize("startBattle")()),
            !Options.debug.enabled ? null : React.DOM.button(
            {
              className: "battle-prep-controls-button",
              onClick: () =>
              {
                const battle = battlePrep.makeBattle();
                const simulator = new BattleSimulator(battle);
                simulator.simulateBattle();
                battle.isSimulated = false;
                simulator.finishBattle();
              },
            }, localize("simulateBattle")()),
          ),
          React.DOM.div({className: "battle-prep-left-lower"}, leftLowerElement),
        ),
        UnitList(
        {
          units: battlePrep.humanFormation.units,
          selectedUnit: this.state.selectedUnit,
          reservedUnits: battlePrep.humanFormation.getPlacedUnits(),
          unavailableUnits: battlePrep.humanPlayer === battlePrep.attacker ?
            battlePrep.humanUnits.filter(unit => !unit.canFightOffensiveBattle()) :
            [],
          hoveredUnit: this.state.hoveredUnit,

          isDraggable: this.state.leftLowerElement === "playerFormation",
          onDragStart: this.handleDragStart.bind(null, true),
          onDragEnd: this.handleDragEnd,

          onRowChange: this.handleSelectUnitListRow,

          onMouseEnterUnit: this.handleMouseEnterUnit,
          onMouseLeaveUnit: this.handleMouseLeaveUnit,
        }),
      )
    );
  }

  private canInspectEnemyFormation(): boolean
  {
    const player = this.props.battlePrep.humanPlayer;

    return player.starIsDetected(this.props.battlePrep.battleData.location);
  }
  private autoMakeFormation()
  {
    this.props.battlePrep.humanFormation.clearFormation();
    this.props.battlePrep.humanFormation.setAutoFormation(
      this.props.battlePrep.enemyUnits, this.props.battlePrep.enemyFormation.formation);

    this.setLeftLowerElement("playerFormation");
    this.forceUpdate();
  }
  private handleSelectUnitListRow(row: ListItem<UnitListItemPropTypes>): void
  {
    this.setSelectedUnit(row.content.props.unit);
  }
  private handleSelectItemListRow(row: ListItem<ItemListItemPropTypes>): void
  {
    if (row.content.props.unit)
    {
      this.setSelectedUnit(row.content.props.unit);
    }
  }
  private clearSelectedUnit()
  {
    this.setState(
    {
      selectedUnit: null,
    });
  }
  private setSelectedUnit(unit: Unit)
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
  private handleMouseEnterUnit(unit: Unit)
  {
    this.setState(
    {
      hoveredUnit: unit,
    });
  }
  private handleMouseLeaveUnit()
  {
    this.setState(
    {
      hoveredUnit: null,
    });
  }
  private handleDragStart(cameFromUnitList: boolean, unit: Unit)
  {
    if (cameFromUnitList && this.props.battlePrep.humanFormation.hasUnit(unit))
    {
      this.props.battlePrep.humanFormation.removeUnit(unit);
    }

    this.setState(
    {
      currentDragUnit: unit,
    });
  }
  private handleDragEnd(dropSuccessful: boolean = false)
  {
    if (!dropSuccessful && this.state.currentDragUnit)
    {
      if (this.props.battlePrep.humanFormation.hasUnit(this.state.currentDragUnit))
      {
        this.props.battlePrep.humanFormation.removeUnit(this.state.currentDragUnit);
      }
    }

    this.setState(
    {
      currentDragUnit: null,
      hoveredUnit: null,
    });

    return dropSuccessful;
  }
  private handleDrop(position: number[])
  {
    const battlePrep = this.props.battlePrep;
    if (this.state.currentDragUnit)
    {
      battlePrep.humanFormation.assignUnit(this.state.currentDragUnit, position);
    }

    this.handleDragEnd(true);
  }
  private handleItemDragStart(item: Item)
  {
    this.setState(
    {
      currentDragItem: item,
    });
  }
  private setLeftLowerElement(newElement: string)
  {
    const oldElement = this.state.leftLowerElement;
    const newState: any =
    {
      leftLowerElement: newElement,
    };

    if (oldElement === "enemyFormation" || newElement === "enemyFormation")
    {
      newState.selectedUnit = null;
    }

    this.setState(newState);
  }
  private handleItemDragEnd(dropSuccessful: boolean = false)
  {
    if (!dropSuccessful && this.state.currentDragItem && this.state.selectedUnit)
    {
      const item = this.state.currentDragItem;
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
  private handleItemDrop(index: number)
  {
    const item = this.state.currentDragItem;
    const unit = this.state.selectedUnit;
    if (unit && item)
    {
      unit.items.addItemAtPosition(item, index);
    }

    this.handleItemDragEnd(true);
  }
  private getBackgroundBlurArea()
  {
    const backgroundElement = this.upperElement;
    if (!backgroundElement)
    {
      throw new Error("Battle prep background element hasn't mounted yet");
    }

    return ReactDOM.findDOMNode(backgroundElement).getBoundingClientRect();
  }
  private localizeFormationInvalidityReason(formation: BattlePrepFormation, reason: FormationInvalidityReason): string
  {
    switch (reason)
    {
      case FormationInvalidityReason.Valid:
      {
        throw new Error("Tried to display reason for formation invalidity when formation wasn't invalid.");
      }
      case FormationInvalidityReason.NotEnoughUnits:
      {
        return localize("notEnoughUnitsPlaced")(
        {
          minUnits: formation.getValidityRestriction().minUnits,
        });
      }
    }
  }
  private localizeModifierEffect(effect: FormationValidityModifierEffect): string
  {
    const sortOrder: Required<{[K in keyof FormationValidityModifierEffect]: number}> =
    {
      minUnits: 0,
    };

    const allKeys = <(keyof FormationValidityModifierEffect)[]> Object.keys(effect);

    return allKeys.sort((a, b) =>
    {
      return sortOrder[a] - sortOrder[b];
    }).map(prop =>
    {
      switch (prop)
      {
        case "minUnits":
        {
          return localize("battlePrepValidityModifierEffect_minUnits")({minUnits: effect.minUnits});
        }
      }
    }).join(localize("listItemSeparator")());
  }
  private localizeFormationValidityModifierSource(
    formation: BattlePrepFormation,
    modifier: FormationValidityModifier,
  ): string
  {
    switch (modifier.sourceType)
    {
      case FormationValidityModifierSourceType.OffensiveBattle:
      {
        return localize("battlePrepValidityModifierSource_offensiveBattle")();
      }
      case FormationValidityModifierSourceType.AttackedInEnemyTerritory:
      {
        return localize("battlePrepValidityModifierSource_attackedInEnemyTerritory")();
      }
      case FormationValidityModifierSourceType.AttackedInNeutralTerritory:
      {
        return localize("battlePrepValidityModifierSource_attackedInNeutralTerritory")();
      }
      case FormationValidityModifierSourceType.PassiveAbility:
      {
        const humanPlayer = this.props.battlePrep.humanPlayer;

        const sourceAbility = modifier.sourcePassiveAbility.abilityTemplate;
        const sourceUnit = modifier.sourcePassiveAbility.unit;
        const sourceUnitIsKnown = sourceUnit.fleet.player === humanPlayer || this.canInspectEnemyFormation();

        if (sourceUnitIsKnown)
        {
          return localize("battlePrepValidityModifierSource_passiveAbility_known")(
          {
            abilityName: sourceAbility.displayName,
            unitName: sourceUnit.name,
          });
        }
        else
        {
          return localize("battlePrepValidityModifierSource_passiveAbility_unknown")();
        }
      }
    }
  }
  private localizeInvalidFormationExplanation(formation: BattlePrepFormation, validity: FormationValidity): string
  {
    const allReasons = extractFlagsFromFlagWord(validity.reasons, FormationInvalidityReason);

    const reasonString = allReasons.sort().map(reason =>
    {
      return this.localizeFormationInvalidityReason(formation, reason);
    }).join("\n");

    const modifiersString = validity.modifiers.map(modifier =>
    {
      const modifierEffectString = this.localizeModifierEffect(modifier.effect);

      const modifierSourceString = this.localizeFormationValidityModifierSource(
        formation,
        modifier,
      );

      return `${modifierEffectString} ${modifierSourceString}`;
    }).join("\n");

    return `${reasonString}\n\n${modifiersString}`;
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(BattlePrepComponent);
export default factory;
