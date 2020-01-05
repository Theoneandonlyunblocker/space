import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Player} from "core/src/player/Player";
import {Star} from "core/src/map/Star";

import {localize} from "../../../localization/localize";
import { useResources } from "../resources/useResources";
import { Manufactory } from "core/src/production/Manufactory";
import { ResourceCost } from "../resources/ResourceCost";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  star: Star;
  player: Player;
  triggerUpdate: () => void;
}

const ConstructManufactoryComponent: React.FunctionComponent<PropTypes> = props =>
{
  const resources = useResources(props.player);
  const manufactoryBuildCost = Manufactory.getBuildCost();
  const canAffordToConstructManufactory = props.player.canAfford(manufactoryBuildCost);

  return(
    ReactDOMElements.div(
    {
      className: "build-queue",
    },
      ReactDOMElements.div(
      {
        className: "production-list-header",
      },
        ReactDOMElements.button(
        {
          className: "manufactory-upgrade-button",
          disabled: !canAffordToConstructManufactory,
          onClick: () =>
          {
            props.star.buildManufactory();
            props.player.removeResources(manufactoryBuildCost);
            props.triggerUpdate();
          }
        },
          ReactDOMElements.span(
          {
            className: "manufactory-upgrade-button-prompt",
          },
            localize("constructManufactory").toString(),
          ),
          ResourceCost(
          {
            cost: manufactoryBuildCost,
            availableResources: resources,
          }),
        ),
      ),
    )
  );
};

export const ConstructManufactory: React.Factory<PropTypes> = React.createFactory(ConstructManufactoryComponent);
