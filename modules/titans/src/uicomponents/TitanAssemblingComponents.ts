import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { TitanComponentTemplate } from "../TitanComponentTemplate";
import { UnitItems } from "modules/defaultui/src/uicomponents/unitlist/UnitItems";
import { AutoPositionedTitanComponentSelection } from "./AutoPositionedTitanComponentSelection";
import { useOnClickOutside } from "modules/defaultui/src/uicomponents/generic/useOnClickOutside";
import {ComponentsAction} from "./TitanAssemblingOverview";


type ComponentsBySlot =
{
  [itemSlot: string]: TitanComponentTemplate[];
};
type ComponentSelectorData =
{
  slot: string;
  index: number;
};

// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  availableComponents: TitanComponentTemplate[];
  componentsBySlot: ComponentsBySlot;
  updateComponentsBySlot: React.Dispatch<ComponentsAction>;
}


const TitanAssemblingComponentsComponent: React.FunctionComponent<PropTypes> = props =>
{
  const ownDomNode = React.useRef<HTMLDivElement | null>(null);

  const [activeComponentSelector, setActiveComponentSelector] = React.useState<ComponentSelectorData | null>(null);
  const clearActiveComponentSelector = () => setActiveComponentSelector(null);

  useOnClickOutside(
  {
    parentElementRef: ownDomNode,
    onClickOutside: clearActiveComponentSelector,
  }, []);

  return(
    ReactDOMElements.div(
    {
      className: "titan-assembly-components",
      ref: ownDomNode,
    },
      UnitItems(
      {
        itemsBySlot: props.componentsBySlot,
        onClick: (slot, index) =>
        {
          const isAlreadyActive = activeComponentSelector && activeComponentSelector.slot === slot && activeComponentSelector.index === index;
          if (isAlreadyActive)
          {
            clearActiveComponentSelector();
          }
          else
          {
            setActiveComponentSelector({slot: slot, index: index});
          }
        },
        onRightClick: (slot, index) =>
        {
          props.updateComponentsBySlot({type: "set", slot: slot, index: index, component: undefined,});
        },
      }),
      !activeComponentSelector ? null : AutoPositionedTitanComponentSelection(
      {
        slot: activeComponentSelector.slot,
        index: activeComponentSelector.index,
        availableComponents: props.availableComponents.filter(component => component.slot === activeComponentSelector.slot),
        onSelect: component =>
        {
          props.updateComponentsBySlot(
          {
            type: "set",
            slot: activeComponentSelector.slot,
            index: activeComponentSelector.index,
            component: component,
          });

          clearActiveComponentSelector();
        },
        autoPositionerProps:
        {
          xSide: "innerLeft",
          ySide: "outerTop",
          positionOnUpdate: true,
          getParentClientRect: () =>
          {
            const itemGroupElement = ownDomNode.current.getElementsByClassName(`unit-item-group-${activeComponentSelector.slot}`)[0];
            const itemElement = itemGroupElement.children[activeComponentSelector.index];

            return itemElement.getBoundingClientRect();
          },
        },
      }),
    )
  );
};

export const TitanAssemblingComponents: React.FunctionComponentFactory<PropTypes> = React.createFactory(TitanAssemblingComponentsComponent);
