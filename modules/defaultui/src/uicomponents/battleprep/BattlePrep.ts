import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {app} from "core/src/app/App"; // TODO global
import {BattlePrep as BattlePrepObj} from "core/src/battleprep/BattlePrep";
import { BattlePrepFormation } from "core/src/battleprep/BattlePrepFormation";
import
{
  FormationInvalidityReason,
  FormationValidity,
  FormationValidityModifier,
  FormationValidityModifierEffect,
  FormationValidityModifierSourceType,
} from "core/src/battleprep/BattlePrepFormationValidity";
import {BattleSimulator} from "core/src/ai/BattleSimulator";
import {options} from "core/src/app/Options";
import {Item} from "core/src/items/Item";
import {Unit} from "core/src/unit/Unit";
import {activeModuleData} from "core/src/app/activeModuleData";
import { extractFlagsFromFlagWord } from "core/src/generic/utility";
import * as debug from "core/src/app/debug";
import {BattleBackgroundComponent, BattleBackground} from "../battle/BattleBackground";
import {Formation} from "../battle/Formation";
import {ItemList} from "../unitlist/ItemList";
import {MenuUnitInfo} from "../unitlist/MenuUnitInfo";
import {UnitList} from "../unitlist/UnitList";

import {BattleInfo} from "./BattleInfo";
import { Player } from "core/src/player/Player";


export interface PropTypes extends React.Props<any>
{
  battlePrep: BattlePrepObj;
}

type LeftLowerElementKey = "playerFormation" | "enemyFormation" | "itemEquip";

const BattlePrepComponent: React.FunctionComponent<PropTypes> = props =>
{
  const forceUpdateDummyReducer = React.useReducer(x => x + 1, 0);
  const forceUpdate = <() => void>forceUpdateDummyReducer[1];

  const [hoveredUnit, setHoveredUnit] = React.useState<Unit | null>(null);
  const [selectedUnit, setSelectedUnit] = React.useState<Unit | null>(null);

  const [currentlyDraggingUnit, setCurrentlyDraggingUnit] = React.useState<Unit | null>(null);
  function handleUnitDragEnd(dropWasInsideTarget: boolean = false): void
  {
    debug.log("ui", `Unit drag end '${currentlyDraggingUnit ? currentlyDraggingUnit.name : null}'. Drop was ${dropWasInsideTarget ? "inside" : "outside"} unit slot`);
    if (!dropWasInsideTarget && currentlyDraggingUnit)
    {
      if (props.battlePrep.humanFormation.hasUnit(currentlyDraggingUnit))
      {
        debug.log("ui", `Removed unit '${currentlyDraggingUnit ? currentlyDraggingUnit.name : null}' from formation after drag end without succesful drop`);
        props.battlePrep.humanFormation.removeUnit(currentlyDraggingUnit);
      }
    }

    setCurrentlyDraggingUnit(null);
  }
  function handleMouseUpOnUnitSlot(position: number[]): void
  {
    if (currentlyDraggingUnit)
    {
      debug.log("ui", `Drop unit '${currentlyDraggingUnit ? currentlyDraggingUnit.name : null}' at position ${position}`);

      props.battlePrep.humanFormation.assignUnit(currentlyDraggingUnit, position);
      setHoveredUnit(currentlyDraggingUnit);
      handleUnitDragEnd(true);
    }
    else if (currentlyDraggingItem && leftLowerElementKey === "playerFormation")
    {
      const unitAtSlot = props.battlePrep.humanFormation.getUnitAtPosition(position);
      if (unitAtSlot)
      {
        handleItemDropOnUnit(unitAtSlot);
      }
      else
      {
        handleItemDragEnd(false);
      }
    }
  }

  const [currentlyDraggingItem, setCurrentlyDraggingItem] = React.useState<Item | null>(null);
  function handleItemDragEnd(dropWasInsideTarget: boolean = false): void
  {
    if (!dropWasInsideTarget && currentlyDraggingItem && currentlyDraggingItem.unit)
    {
      currentlyDraggingItem.unequip();
    }

    setCurrentlyDraggingItem(null);
  }
  function handleItemDropOnUnit(unit: Unit): void
  {
    if (currentlyDraggingItem)
    {
      const isAlreadyEquippedOnTargetUnit = currentlyDraggingItem.unit === unit;
      if (!isAlreadyEquippedOnTargetUnit)
      {
        unit.items.addItem(currentlyDraggingItem);
        setSelectedUnit(unit);
      }
    }

    handleItemDragEnd(true);
  }
  function handleItemDropOnItemSlot(slotIndex: number): void
  {
    if (selectedUnit && currentlyDraggingItem)
    {
      selectedUnit.items.addItemAtPosition(currentlyDraggingItem, slotIndex);
    }

    handleItemDragEnd(true);
  }

  const highlightedUnit = (() =>
  {
    // need this because unmounting unitinfo when item being dragged is child of unitinfo messes up the drag handlers
    if (currentlyDraggingItem && selectedUnit)
    {
      return selectedUnit;
    }
    else
    {
      return currentlyDraggingUnit || hoveredUnit || selectedUnit;
    }
  })();

  const canInspectEnemyFormation: boolean = React.useMemo(() =>
  {
    const player = props.battlePrep.humanPlayer;
    const location = props.battlePrep.battleData.location;

    return player.starIsDetected(location);
  }, [props.battlePrep.battleData.location, props.battlePrep.humanPlayer]);
  const playerIsDefending = props.battlePrep.humanPlayer === props.battlePrep.defender;

  const humanFormationValidity = props.battlePrep.humanFormation.getFormationValidity();

  // TODO 2019.08.27 | don't think this belongs here
  const backgroundComponent = React.useRef<BattleBackgroundComponent | null>(null);
  React.useLayoutEffect(function resizeBackgroundOnMount()
  {
    backgroundComponent.current.handleResize();
  }, [backgroundComponent.current]);


  const leftUpperElement = (() =>
  {
    if (highlightedUnit)
    {
      debug.log("ui", `Render left upper element for highlighted unit '${highlightedUnit.name}'`);

      const highlightedUnitIsFriendly = highlightedUnit.fleet.player === props.battlePrep.humanPlayer;

      return MenuUnitInfo(
      {
        unit: highlightedUnit,
        onItemSlotMouseUp: handleItemDropOnItemSlot,

        itemsAreDraggable: highlightedUnitIsFriendly,
        onItemDragStart: setCurrentlyDraggingItem,
        onItemDragEnd: handleItemDragEnd,
        currentDragItem: currentlyDraggingItem,
      });
    }
    else
    {
      debug.log("ui", `Render left upper element for battle info`);

      return BattleInfo(
      {
        battlePrep: props.battlePrep,
      });
    }
  })();

  const [leftLowerElementKey, setLeftLowerElementKey] = React.useState<LeftLowerElementKey>("playerFormation");
  const leftLowerElement = (() =>
  {
    switch (leftLowerElementKey)
    {
      case "playerFormation":
      {
        return Formation(
        {
          key: "playerFormation",
          formation: props.battlePrep.humanFormation.formation,
          facesLeft: false,
          unitDisplayDataById: props.battlePrep.humanFormation.getDisplayData(),

          isInBattlePrep: true,

          hoveredUnit: hoveredUnit,
          activeUnit: selectedUnit,
          abilityTargetDisplayDataById: {},

          onMouseUp: handleMouseUpOnUnitSlot,
          onUnitClick: setSelectedUnit,
          handleMouseEnterUnit: setHoveredUnit,
          handleMouseLeaveUnit: () => setHoveredUnit(null),

          unitStrengthAnimateDuration: undefined,

          isDraggable: true,
          onDragStart: setCurrentlyDraggingUnit,
          onDragEnd: handleUnitDragEnd,
        });
      }
      case "enemyFormation":
      {
        return Formation(
        {
          key: "enemyFormation",
          formation: props.battlePrep.enemyFormation.formation,
          facesLeft: true,
          unitDisplayDataById: props.battlePrep.enemyFormation.getDisplayData(),

          isInBattlePrep: true,

          hoveredUnit: hoveredUnit,
          activeUnit: selectedUnit,
          abilityTargetDisplayDataById: {},

          onUnitClick: setSelectedUnit,
          handleMouseEnterUnit: setHoveredUnit,
          handleMouseLeaveUnit: () => setHoveredUnit(null),

          unitStrengthAnimateDuration: undefined,

          isDraggable: false,
        });
      }
      case "itemEquip":
      {
        return ItemList(
        {
          key: "itemEquip",
          items: props.battlePrep.humanPlayer.items.filter(item => !item.template.isLockedToUnit),
          isDraggable: true,
          onDragStart: setCurrentlyDraggingItem,
          onDragEnd: handleItemDragEnd,
          onRowChange: (row) =>
          {
            const unitEquippedTo = row.content.props.unit;
            if (unitEquippedTo)
            {
              setSelectedUnit(unitEquippedTo);
            }
          },
        });
      }
    }
  })();

  return(
    ReactDOMElements.div({className: "battle-prep"},
      ReactDOMElements.div({className: "battle-prep-left"},
        ReactDOMElements.div({className: "battle-prep-left-upper-wrapper"},
          BattleBackground(
          {
            getBlurArea: () => backgroundComponent.current.pixiContainer.current.getBoundingClientRect(),
            backgroundSeed: props.battlePrep.battleData.location.seed,
            backgroundDrawingFunction: activeModuleData.starBackgroundDrawingFunction,
            ref: backgroundComponent,
          },
            ReactDOMElements.div({className: "battle-prep-left-upper-inner"},
              leftUpperElement,
            ),
          ),
        ),
        ReactDOMElements.div({className: "battle-prep-left-controls"},
          ReactDOMElements.button(
          {
            className: "battle-prep-controls-button",
            onClick: () => setLeftLowerElementKey("itemEquip"),
            disabled: leftLowerElementKey === "itemEquip",
          }, localize("equip").toString()),
          ReactDOMElements.button(
          {
            className: "battle-prep-controls-button",
            onClick: () => setLeftLowerElementKey("playerFormation"),
            disabled: leftLowerElementKey === "playerFormation",
          }, localize("ownFormation").toString()),
          ReactDOMElements.button(
          {
            className: "battle-prep-controls-button",
            onClick: () => setLeftLowerElementKey("enemyFormation"),
            disabled: leftLowerElementKey === "enemyFormation" || !canInspectEnemyFormation,
            title: canInspectEnemyFormation ?
              undefined :
              localize("cantInspectEnemyFormationAsStarIsNotInDetectionRadius").toString(),
          }, localize("enemy").toString()),
          ReactDOMElements.button(
          {
            onClick: () =>
            {
              props.battlePrep.humanFormation.clearFormation();
              props.battlePrep.humanFormation.setAutoFormation(
                props.battlePrep.enemyUnits,
                props.battlePrep.enemyFormation.formation,
              );

              setLeftLowerElementKey("playerFormation");
              forceUpdate();
            },
          }, localize("autoFormation").toString()),
          ReactDOMElements.button(
          {
            onClick: () =>
            {
              app.reactUI.switchScene("galaxyMap");
            },
            disabled: playerIsDefending,
          }, localize("cancel").toString()),
          ReactDOMElements.button(
          {
            className: "battle-prep-controls-button",
            disabled: !humanFormationValidity.isValid,
            title: humanFormationValidity.isValid ? "" : localizeInvalidFormationExplanation(
              props.battlePrep.humanFormation,
              humanFormationValidity,
              props.battlePrep.humanPlayer,
              canInspectEnemyFormation,
            ),
            onClick: () =>
            {
              const battle = props.battlePrep.makeBattle();
              app.reactUI.battle = battle;
              app.reactUI.switchScene("battle");
            },
          }, localize("startBattle").toString()),
          !options.debug.enabled ? null : ReactDOMElements.button(
          {
            className: "battle-prep-controls-button",
            onClick: () =>
            {
              const battle = props.battlePrep.makeBattle();
              const simulator = new BattleSimulator(battle);
              simulator.simulateBattle();
              battle.isSimulated = false;
              simulator.finishBattle();
            },
          }, localize("simulateBattle").toString()),
        ),
        ReactDOMElements.div({className: "battle-prep-left-lower"}, leftLowerElement),
      ),
      UnitList(
      {
        units: props.battlePrep.humanFormation.units,
        selectedUnit: selectedUnit,
        reservedUnits: props.battlePrep.humanFormation.getPlacedUnits(),
        unavailableUnits: props.battlePrep.humanPlayer === props.battlePrep.attacker ?
          props.battlePrep.humanUnits.filter(unit => !unit.canFightOffensiveBattle()) :
          [],
        hoveredUnit: hoveredUnit,

        isDraggable: leftLowerElementKey === "playerFormation",
        onDragStart: (unit) =>
        {
          if (props.battlePrep.humanFormation.hasUnit(unit))
          {
            props.battlePrep.humanFormation.removeUnit(unit);
          }

          setCurrentlyDraggingUnit(unit);
        },
        onDragEnd: handleUnitDragEnd,

        onRowChange: (row) => setSelectedUnit(row.content.props.unit),
        onMouseUp: handleItemDropOnUnit,

        onMouseEnterUnit: setHoveredUnit,
        onMouseLeaveUnit: () => setHoveredUnit(null),
      }),
    )
  );
};

function localizeFormationInvalidityReason(formation: BattlePrepFormation, reason: FormationInvalidityReason): string
{
  switch (reason)
  {
    case FormationInvalidityReason.Valid:
    {
      throw new Error("Tried to display reason for formation invalidity when formation wasn't invalid.");
    }
    case FormationInvalidityReason.NotEnoughUnits:
    {
      return localize("notEnoughUnitsPlaced").format(
      {
        minUnits: formation.getValidityRestriction().minUnits,
      });
    }
  }
}
function localizeModifierEffect(effect: FormationValidityModifierEffect): string
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
        return localize("battlePrepValidityModifierEffect_minUnits").format({minUnits: effect.minUnits});
      }
    }
  }).join(localize("listItemSeparator").toString());
}
function localizeFormationValidityModifierSource(
  formation: BattlePrepFormation,
  modifier: FormationValidityModifier,
  humanPlayer: Player,
  canInspectEnemyFormation: boolean,
): string
{
  switch (modifier.sourceType)
  {
    case FormationValidityModifierSourceType.OffensiveBattle:
    {
      return localize("battlePrepValidityModifierSource_offensiveBattle").toString();
    }
    case FormationValidityModifierSourceType.AttackedInEnemyTerritory:
    {
      return localize("battlePrepValidityModifierSource_attackedInEnemyTerritory").toString();
    }
    case FormationValidityModifierSourceType.AttackedInNeutralTerritory:
    {
      return localize("battlePrepValidityModifierSource_attackedInNeutralTerritory").toString();
    }
    case FormationValidityModifierSourceType.PassiveAbility:
    {
      // const humanPlayer = this.props.battlePrep.humanPlayer;
      const sourceAbility = modifier.sourcePassiveAbility.abilityTemplate;
      const sourceUnit = modifier.sourcePassiveAbility.unit;
      const sourceUnitIsKnown = sourceUnit.fleet.player === humanPlayer || canInspectEnemyFormation;

      if (sourceUnitIsKnown)
      {
        return localize("battlePrepValidityModifierSource_passiveAbility_known").format(
        {
          abilityName: sourceAbility.displayName,
          unitName: sourceUnit.name.toString(),
        });
      }
      else
      {
        return localize("battlePrepValidityModifierSource_passiveAbility_unknown").toString();
      }
    }
  }
}
function localizeInvalidFormationExplanation(
  formation: BattlePrepFormation,
  validity: FormationValidity,
  humanPlayer: Player,
  canInspectEnemyFormation: boolean,
): string
{
  const allReasons = extractFlagsFromFlagWord(validity.reasons, FormationInvalidityReason);

  const reasonString = allReasons.sort().map(reason =>
  {
    return localizeFormationInvalidityReason(formation, reason);
  }).join("\n");

  const modifiersString = validity.modifiers.map(modifier =>
  {
    const modifierEffectString = localizeModifierEffect(modifier.effect);

    const modifierSourceString = localizeFormationValidityModifierSource(
      formation,
      modifier,
      humanPlayer,
      canInspectEnemyFormation,
    );

    return `${modifierEffectString} ${modifierSourceString}`;
  }).join("\n");

  return `${reasonString}\n\n${modifiersString}`;
}

export const BattlePrep: React.FunctionComponentFactory<PropTypes> = React.createFactory(BattlePrepComponent);
