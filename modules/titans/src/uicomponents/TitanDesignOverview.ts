import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { Manufactory } from "core/src/production/Manufactory";
import { TitanChassisTemplate } from "../TitanChassisTemplate";
import { Player } from "core/src/player/Player";
import { TitanChassisList } from "./TitanChassisList";
import { TitanChassisAbilities } from "./TitanChassisAbilities";
import { TitanDesignComponents } from "./TitanDesignComponents";
import { getBuildableComponents } from "../getBuildableComponents";
import { TitanComponentTemplate, TitanComponentTemplatesBySlot } from "../TitanComponentTemplate";
import { DummyUnitForTitanDesign } from "../DummyUnitForTitanDesign";
import { TitanChassisStats } from "./TitanChassisStats";
import { ResourceCost } from "modules/defaultui/src/uicomponents/resources/ResourceCost";
import { UnitSprite } from "modules/defaultui/src/uicomponents/unit/UnitSprite";
import { getBuildableChassis } from "../getBuildableChassis";
import { localize as localizeGeneric } from "modules/defaultui/localization/localize";
import { localize } from "modules/titans/localization/localize";
import { manufacturableThingKinds } from "../manufacturableThingKinds";
import { useResources } from "modules/defaultui/src/uicomponents/resources/useResources";
import { Name } from "core/src/localization/Name";
import { EditableName } from "modules/defaultui/src/uicomponents/generic/EditableName";


type ComponentsState =
{
  player: Player;
  dummyUnit: DummyUnitForTitanDesign;
  slots: TitanComponentTemplatesBySlot;
};
export type ComponentsAction =
{
  type: "changeChassis";
  chassis: TitanChassisTemplate;
  player: Player;
} |
{
  type: "clearAll";
  chassis: TitanChassisTemplate;
} |
{
  type: "set";
  slot: string;
  index: number;
  component: TitanComponentTemplate;
};
const componentsReducer: React.Reducer<ComponentsState, ComponentsAction> = (prevState, action) =>
{
  const dummyUnit: DummyUnitForTitanDesign = prevState.dummyUnit;

  function getEmptiedSlotsForChassis(chassis: TitanChassisTemplate): TitanComponentTemplatesBySlot
  {
    return Object.keys(chassis.itemSlots).reduce((newState, currentSlotKey) =>
    {
      const availableSlots = chassis.itemSlots[currentSlotKey];
      newState[currentSlotKey] = Array.from({length: availableSlots});

      return newState;
    }, <TitanComponentTemplatesBySlot>{});
  }

  switch (action.type)
  {
    case "changeChassis":
    {
      return {
        player: prevState.player,
        dummyUnit: new DummyUnitForTitanDesign(action.chassis, prevState.player),
        slots: getEmptiedSlotsForChassis(action.chassis),
      };
    }
    case "clearAll":
    {
      dummyUnit.removeAllItems();

      return {
        player: prevState.player,
        dummyUnit: prevState.dummyUnit,
        slots: getEmptiedSlotsForChassis(action.chassis),
      };
    }
    case "set":
    {
      dummyUnit.addItemAtPosition(action.component, action.index, action.slot);

      return {
        player: prevState.player,
        dummyUnit: prevState.dummyUnit,
        slots: Object.keys(prevState.slots).reduce((newSlots, currentSlotKey) =>
        {
          newSlots[currentSlotKey] = [...prevState.slots[currentSlotKey]];

          if (currentSlotKey === action.slot)
          {
            newSlots[action.slot][action.index] = action.component;
          }

          return newSlots;
        }, <TitanComponentTemplatesBySlot>{}),
      };
    }
  }
};


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  player: Player;
  manufactory: Manufactory;
  editingPrototypeName: string | undefined;
  triggerParentUpdate: () => void;
}

const TitanDesignOverviewComponent: React.FunctionComponent<PropTypes> = props =>
{
  const [selectedChassis, _setSelectedChassis] = React.useState<TitanChassisTemplate>(undefined);
  const [componentsBySlot, updateComponentsBySlot] = React.useReducer(componentsReducer,
  {
    player: props.player,
    dummyUnit: undefined,
    slots: {},
  });
  const prototypeName = React.useRef<Name>(undefined);

  function setSelectedChassis(chassis: TitanChassisTemplate): void
  {
    if (chassis === selectedChassis)
    {
      return;
    }

    _setSelectedChassis(chassis);
    prototypeName.current = props.player.race.getUnitName(chassis);
    updateComponentsBySlot({type: "changeChassis", chassis: chassis, player: props.player});
    updateComponentsBySlot({type: "clearAll", chassis: chassis});
  }

  const playerResources = useResources(props.player);
  const canAffordToBuild = selectedChassis && props.player.canAfford(componentsBySlot.dummyUnit.getBuildCost());

  return(
    ReactDOMElements.div(
    {
      className: "titan-design-overview",
    },
      ReactDOMElements.div(
      {
        className: "titan-chassis-list",
      },
        TitanChassisList(
        {
          allChassis: getBuildableChassis(props.manufactory),
          selectedChassis: selectedChassis,
          onSelect: setSelectedChassis,
        }),
      ),
      ReactDOMElements.div(
      {
        className: "titan-design-info",
      },
        !selectedChassis ? null :
          ReactDOMElements.div(
          {
            className: "titan-design-info-protype-details",
          },
            EditableName(
            {
              key: selectedChassis.key,
              name: prototypeName.current,
              usage: "unit",
              inputAttributes:
              {
                className: "titan-prototype-name",
                title: localizeGeneric("displayName").toString() + ": " + prototypeName.current.toString(),
                size: prototypeName.current.baseName.length,
              }
            }),
            ReactDOMElements.div(
            {
              className: "titan-prototype-cost",
            },
              ResourceCost(
              {
                cost: componentsBySlot.dummyUnit.getBuildCost(),
                availableResources: playerResources,
              }),
            ),
          ),
        !selectedChassis ? null :
          TitanChassisAbilities(
          {
            template: selectedChassis
          }),
        !selectedChassis ? null :
          TitanDesignComponents(
          {
            availableComponents: getBuildableComponents(props.manufactory),
            componentsBySlot: componentsBySlot.slots,
            updateComponentsBySlot: updateComponentsBySlot,
          }),
        !selectedChassis ? null :
          TitanChassisStats(
          {
            health: componentsBySlot.dummyUnit.getMinAndMaxPossibleHealth(),
            attributes: componentsBySlot.dummyUnit.getMinAndMaxPossibleAttributes(),
          }),
        !selectedChassis ? null :
          ReactDOMElements.div(
          {
            className: "titan-chassis-sprite",
          },
            UnitSprite(
            {
              unit: componentsBySlot.dummyUnit.getUnit(),
            }),
          ),
        !selectedChassis ? null :
          ReactDOMElements.div(
          {
            className: "titan-design-info-actions",
          },
            ReactDOMElements.button(
            {
              className: "titan-design-info-action",
              disabled: !canAffordToBuild,
              title: canAffordToBuild ? "" : localizeGeneric("cantAfford").toString(),
              onClick: () =>
              {
                const prototype = componentsBySlot.dummyUnit.getPrototype(prototypeName.current);
                props.manufactory.addThingToQueue(prototype, manufacturableThingKinds.titanFromPrototype);
                props.triggerParentUpdate();
              },
            },
              localize("addToBuildQueue"),
            ),
          ),
      )
    )
  );
};

export const TitanDesignOverview: React.FunctionComponentFactory<PropTypes> = React.createFactory(TitanDesignOverviewComponent);
