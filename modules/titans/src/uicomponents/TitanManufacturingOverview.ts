import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import { Star } from "core/src/map/Star";
import {DefaultWindow} from "modules/defaultui/src/uicomponents/windows/DefaultWindow";
import { Player } from "core/src/player/Player";
import { localize } from "modules/titans/localization/localize";
import { useTitanAssemblingCapacity } from "./useTitanAssemblingCapacity";
import { titanForge } from "../buildings/templates/titanForge";
import { TitanDesignOverview } from "./TitanDesignOverview";
import { TitanPrototype } from "../TitanPrototype";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  selectedLocation: Star | undefined;
  manufacturableThings: TitanPrototype[];
  triggerParentUpdate: () => void;
  canManufacture: boolean;
  player: Player;
}

const TitanManufacturingOverviewComponent: React.FunctionComponent<PropTypes> = props =>
{
  const assemblingCapacity = useTitanAssemblingCapacity(props.selectedLocation);
  const canAssemble = props.canManufacture && assemblingCapacity > 0;

  const [designingWindowIsOpen, setDesigningWindowOpenness] = React.useState<boolean>(false);
  function toggledesigningWindow(): void
  {
    if (designingWindowIsOpen)
    {
      setDesigningWindowOpenness(false);
    }
    else
    {
      setDesigningWindowOpenness(true);
    }
  }

  return(
    ReactDOMElements.div(
    {
      className: "titan-manufacturing-overview",
    },
      ReactDOMElements.div(
      {
        className: "titan-manufacturing-overview-action",
      },
        !canAssemble ?
          ReactDOMElements.button(
          {
            className: "titan-manufacturing-overview-action-button",
            onClick: () =>
            {
              props.player.buildBuilding(titanForge, props.selectedLocation);
            },
          },
            localize("buildTitanForge"),
          ) :
          ReactDOMElements.button(
          {
            className: "titan-manufacturing-overview-action-button",
            onClick: () =>
            {
              toggledesigningWindow();
            }
          },
            localize("designTitan"),
          ),
        !designingWindowIsOpen ? null :
          DefaultWindow(
          {
            title: localize("designTitan"),
            handleClose: () => setDesigningWindowOpenness(false),
          },
            TitanDesignOverview(
            {
              player: props.player,
              manufactory: props.selectedLocation.manufactory,
              editingPrototypeName: undefined,
              triggerParentUpdate: props.triggerParentUpdate,
            }),
          ),
      ),
    )
  );
};

export const TitanManufacturingOverview: React.FunctionComponentFactory<PropTypes> = React.createFactory(TitanManufacturingOverviewComponent);
