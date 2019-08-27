import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {app} from "../../../../src/App"; // TODO global
import {BattlePrep as BattlePrepObj} from "../../../../src/BattlePrep";
import { BattlePrepFormation } from "../../../../src/BattlePrepFormation";
import
{
  FormationInvalidityReason,
  FormationValidity,
  FormationValidityModifier,
  FormationValidityModifierEffect,
  FormationValidityModifierSourceType,
} from "../../../../src/BattlePrepFormationValidity";
import {BattleSimulator} from "../../../../src/BattleSimulator";
import {Item} from "../../../../src/Item";
import {options} from "../../../../src/Options";
import {Unit} from "../../../../src/Unit";
import {activeModuleData} from "../../../../src/activeModuleData";
import { extractFlagsFromFlagWord } from "../../../../src/utility";
import * as debug from "../../../../src/debug";
import {BattleBackgroundComponent, BattleBackground} from "../battle/BattleBackground";
import {Formation} from "../battle/Formation";
import {ItemList} from "../unitlist/ItemList";
import {MenuUnitInfo} from "../unitlist/MenuUnitInfo";
import {UnitList} from "../unitlist/UnitList";

import {BattleInfo} from "./BattleInfo";
import { Player } from "../../../../src/Player";


export interface PropTypes extends React.Props<any>
{
  battlePrep: BattlePrepObj;
}

type LeftLowerElementKey = "playerFormation" | "enemyFormation" | "itemEquip";

// TODO 2019.08.27 | equip item on MenuUnitInfo.Item => Formation.Unit drop
const BattlePrepComponent: React.FunctionComponent<PropTypes> = props =>
{
  const forceUpdateDummyReducer = React.useReducer(x => x + 1, 0);
  const forceUpdate = <() => void>forceUpdateDummyReducer[1];

  const [hoveredUnit, setHoveredUnit] = React.useState<Unit | null>(null);
  const [selectedUnit, setSelectedUnit] = React.useState<Unit | null>(null);

  const [currentlyDraggingUnit, setCurrentlyDraggingUnit] = React.useState<Unit | null>(null);
  // TODO 2019.08.27 | rename param to dropWasOutsideTarget or something
  function handleUnitDragEnd(dropWasSuccessful: boolean = false): boolean
  {
    debug.log("ui", `Unit drag end '${currentlyDraggingUnit ? currentlyDraggingUnit.name : null}'. Drop was ${!dropWasSuccessful ? "not " : ""}succesful`);
    if (!dropWasSuccessful && currentlyDraggingUnit)
    {
      if (props.battlePrep.humanFormation.hasUnit(currentlyDraggingUnit))
      {
        debug.log("ui", `Removed unit '${currentlyDraggingUnit ? currentlyDraggingUnit.name : null}' from formation after drag end without succesful drop`);
        props.battlePrep.humanFormation.removeUnit(currentlyDraggingUnit);
      }
    }

    setCurrentlyDraggingUnit(null);
    setHoveredUnit(null); // TODO 2019.08.27 | try removing this to see if its necessary

    return dropWasSuccessful;
  }
  function handleUnitDrop(position: number[]): void
  {
    debug.log("ui", `Drop unit '${currentlyDraggingUnit ? currentlyDraggingUnit.name : null}' at position ${position}`);
    if (currentlyDraggingUnit)
    {
      props.battlePrep.humanFormation.assignUnit(currentlyDraggingUnit, position);
    }

    handleUnitDragEnd(true);
  }

  const [currentlyDraggingItem, setCurrentlyDraggingItem] = React.useState<Item | null>(null);
  // TODO 2019.08.27 | rename param to dropWasOutsideTarget or something
  function handleItemDragEnd(dropWasSuccessful: boolean = false): boolean
  {
    if (!dropWasSuccessful && currentlyDraggingItem && currentlyDraggingItem.unit)
    {
      currentlyDraggingItem.unequip();
    }

    setCurrentlyDraggingItem(null);

    return dropWasSuccessful;
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
    // need this currenlty because unmounting unitinfo when item being dragged is child of unitinfo messes up the drag handlers
    if (currentlyDraggingItem && currentlyDraggingItem.unit)
    {
      return currentlyDraggingItem.unit;
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
  }, []);



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

          onMouseUp: handleUnitDrop,
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
          items: props.battlePrep.humanPlayer.items,
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
          }, localize("equip")()),
          ReactDOMElements.button(
          {
            className: "battle-prep-controls-button",
            onClick: () => setLeftLowerElementKey("playerFormation"),
            disabled: leftLowerElementKey === "playerFormation",
          }, localize("ownFormation")()),
          ReactDOMElements.button(
          {
            className: "battle-prep-controls-button",
            onClick: () => setLeftLowerElementKey("enemyFormation"),
            disabled: leftLowerElementKey === "enemyFormation" || !canInspectEnemyFormation,
            title: canInspectEnemyFormation ?
              undefined :
              localize("cantInspectEnemyFormationAsStarIsNotInDetectionRadius")(),
          }, localize("enemy")()),
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
          }, localize("autoFormation")()),
          ReactDOMElements.button(
          {
            onClick: () =>
            {
              app.reactUI.switchScene("galaxyMap");
            },
            disabled: playerIsDefending,
          }, localize("cancel")()),
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
          }, localize("startBattle")()),
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
          }, localize("simulateBattle")()),
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
      return localize("notEnoughUnitsPlaced")(
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
        return localize("battlePrepValidityModifierEffect_minUnits")({minUnits: effect.minUnits});
      }
    }
  }).join(localize("listItemSeparator")());
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
      // const humanPlayer = this.props.battlePrep.humanPlayer;
      const sourceAbility = modifier.sourcePassiveAbility.abilityTemplate;
      const sourceUnit = modifier.sourcePassiveAbility.unit;
      const sourceUnitIsKnown = sourceUnit.fleet.player === humanPlayer || canInspectEnemyFormation;

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
