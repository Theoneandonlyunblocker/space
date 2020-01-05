import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {Manufactory} from "core/src/production/Manufactory";

import {ManufacturableThingsList} from "./ManufacturableThingsList";
import { Player } from "core/src/player/Player";
import { useResources } from "../resources/useResources";
import { ResourceCost } from "../resources/ResourceCost";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  manufactory: Manufactory;
  triggerUpdate: () => void;
  player: Player;
}

const BuildQueueComponent: React.FunctionComponent<PropTypes> = props =>
{
  const resources = useResources(props.player);
  const manufactory = props.manufactory;
  const manufactoryUpgradeCost = manufactory.getCapacityUpgradeCost();

  const manufactoryIsAtMaxLevel = manufactory.capacity >= manufactory.maxCapacity;
  const canAffordManufactoryUpgrade = props.player.canAfford(manufactoryUpgradeCost);
  const canUpgradeManufactory = !manufactoryIsAtMaxLevel && canAffordManufactoryUpgrade;

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
          title: localize("upgradeManufactoryCapacityTooltip").toString(),
          disabled: !canUpgradeManufactory,
          onClick: () =>
          {
            manufactory.upgradeCapacity(1);
            props.triggerUpdate();
          },
        },
          ReactDOMElements.div(
          {
            className: "manufactory-upgrade-button-text",
          },
            ReactDOMElements.span(
            {
              className: "manufactory-upgrade-button-prompt",
            },
              `${localize("upgradeManufactoryCapacity").toString()} `,
            ),
            ReactDOMElements.span(
            {
              className: "manufactory-upgrade-button-capacity",
              title: `${localize("currentCapacity").format(manufactory.capacity)}\n${localize("maxCapacity").format(manufactory.maxCapacity)}`
            },
              `${manufactory.capacity}/${manufactory.maxCapacity}`,
            ),
          ),
          ResourceCost(
          {
            cost: manufactoryUpgradeCost,
            availableResources: resources,
          }),
        ),
      ),
      ManufacturableThingsList(
      {
        manufacturableThings: manufactory.buildQueue.map(manufacturableThingWithKind => manufacturableThingWithKind.template),
        onClick: (template, parentIndex) =>
        {
          manufactory.removeThingAtIndex(parentIndex);
          props.triggerUpdate();
        },
        showCost: false,
        player: props.player,
      }),
    )
  );
};

export const BuildQueue: React.FunctionComponentFactory<PropTypes> = React.createFactory(BuildQueueComponent);
