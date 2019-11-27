import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { Manufactory } from "core/src/production/Manufactory";
import { TitanChassisTemplate } from "../TitanChassisTemplate";
import { Player } from "core/src/player/Player";
import { TitanChassisList } from "./TitanChassisList";
import { TitanChassisInfo } from "./TitanChassisInfo";
import { TitanAssemblyComponents } from "./TitanAssemblyComponents";
import { getBuildableComponents } from "../getBuildableComponents";
import { TitanComponentTemplate, TitanComponentTemplatesBySlot } from "../TitanComponentTemplate";
// import { getBuildableChassis } from "../getBuildableChassis";


export type ComponentsAction =
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
const componentsReducer: React.Reducer<TitanComponentTemplatesBySlot,  ComponentsAction> = (prevState, action) =>
{
  switch (action.type)
  {
    case "clearAll":
    {
      return Object.keys(action.chassis.itemSlots).reduce((newState, currentSlotKey) =>
      {
        const availableSlots = action.chassis.itemSlots[currentSlotKey];
        newState[currentSlotKey] = Array.from({length: availableSlots});

        return newState;
      }, <TitanComponentTemplatesBySlot>{})
    }
    case "set":
    {
      return Object.keys(prevState).reduce((newState, currentSlotKey) =>
      {
        newState[currentSlotKey] = [...prevState[currentSlotKey]];

        if (currentSlotKey === action.slot)
        {
          newState[action.slot][action.index] = action.component;
        }

        return newState;
      }, <TitanComponentTemplatesBySlot>{});
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
  const [componentsBySlot, updateComponentsBySlot] = React.useReducer(componentsReducer, {});

  function setSelectedChassis(chassis: TitanChassisTemplate): void
  {
    if (chassis === selectedChassis)
    {
      return;
    }

    _setSelectedChassis(chassis);
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
          displayedChassis: props.manufactory.getManufacturableUnits(),
          onSelect: setSelectedChassis,
        }),
      ),
      ReactDOMElements.div(
      {
        className: "titan-assembling-info",
      },
        !selectedChassis ? null :
          TitanChassisInfo(
          {
            template: selectedChassis
          }),
        !selectedChassis ? null :
          TitanAssemblyComponents(
          {
            availableComponents: getBuildableComponents(props.manufactory),
            componentsBySlot: componentsBySlot,
            updateComponentsBySlot: updateComponentsBySlot,
          }),
      )
    )
  );
};

export const TitanAssemblingOverview: React.FunctionComponentFactory<PropTypes> = React.createFactory(TitanAssemblingOverviewComponent);
