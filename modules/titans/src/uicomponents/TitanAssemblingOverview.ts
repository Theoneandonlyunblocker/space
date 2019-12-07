import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { Manufactory } from "core/src/production/Manufactory";
import { TitanChassisTemplate } from "../TitanChassisTemplate";
import { Player } from "core/src/player/Player";
import { TitanChassisList } from "./TitanChassisList";
import { TitanChassisAbilities } from "./TitanChassisAbilities";
import { TitanAssemblingComponents } from "./TitanAssemblingComponents";
import { getBuildableComponents } from "../getBuildableComponents";
import { TitanComponentTemplate, TitanComponentTemplatesBySlot } from "../TitanComponentTemplate";
import { DummyUnitForAssembly } from "../DummyUnitForAssembly";
import { TitanChassisStats } from "./TitanChassisStats";
// import { getBuildableChassis } from "../getBuildableChassis";


type ComponentsState =
{
  player: Player;
  dummyUnit: DummyUnitForAssembly;
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
  const dummyUnit: DummyUnitForAssembly = prevState.dummyUnit;

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
        dummyUnit: new DummyUnitForAssembly(action.chassis, prevState.player),
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
      }
    }
  }
};


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  player: Player;
  manufactory: Manufactory;
}

const TitanAssemblingOverviewComponent: React.FunctionComponent<PropTypes> = props =>
{
  const [selectedChassis, _setSelectedChassis] = React.useState<TitanChassisTemplate>(undefined);
  const [componentsBySlot, updateComponentsBySlot] = React.useReducer(componentsReducer,
  {
    player: props.player,
    dummyUnit: undefined,
    slots: {},
  });

  function setSelectedChassis(chassis: TitanChassisTemplate): void
  {
    if (chassis === selectedChassis)
    {
      return;
    }

    _setSelectedChassis(chassis);
    updateComponentsBySlot({type: "changeChassis", chassis: chassis, player: props.player});
    updateComponentsBySlot({type: "clearAll", chassis: chassis});
  }

  return(
    ReactDOMElements.div(
    {
      className: "titan-assembling-overview",
    },
      ReactDOMElements.div(
      {
        className: "titan-chassis-list",
      },
        TitanChassisList(
        {
          // TODO 2019.11.19 |
          // displayedChassis: getBuildableChassis(props.manufactory),
          allChassis: props.manufactory.getManufacturableUnits(),
          selectedChassis: selectedChassis,
          onSelect: setSelectedChassis,
        }),
      ),
      ReactDOMElements.div(
      {
        className: "titan-assembling-info",
      },
        // !selectedChassis ? null :
        //   ReactDOMElements.div(
        //   {
        //     className: "menu-unit-info-name titan-chassis-info-name",
        //   },
        //     selectedChassis.displayName,
        //   ),
        !selectedChassis ? null :
          TitanChassisAbilities(
          {
            template: selectedChassis
          }),
        !selectedChassis ? null :
          TitanAssemblingComponents(
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
      )
    )
  );
};

export const TitanAssemblingOverview: React.FunctionComponentFactory<PropTypes> = React.createFactory(TitanAssemblingOverviewComponent);
