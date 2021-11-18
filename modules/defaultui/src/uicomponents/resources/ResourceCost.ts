import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { Resources, getMissingResources } from "core/src/player/PlayerResources";
import { ResourceList } from "./ResourceList";
import { ResourceAmount } from "./ResourceAmount";
import { ResourceIcon } from "./ResourceIcon";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  cost: Resources;
  availableResources?: Resources;
}

const ResourceCostComponent: React.FunctionComponent<PropTypes> = props =>
{
  const missingResources = !props.availableResources ?
    null :
    getMissingResources(props.availableResources, props.cost);

  return(
    ReactDOMElements.div(
    {
      className: "resource-cost",
    },
      ResourceList(
      {
        resourceTypes: Object.keys(props.cost),
        renderResource: resource =>
        {
          return ReactDOMElements.div(
          {
            className: "resource",
            key: resource.key,
          },
            ResourceAmount(
            {
              resource: resource,
              amount: props.cost[resource.key],
              isInsufficient: Boolean(missingResources && missingResources[resource.key]),
            }),
            ResourceIcon({resource: resource}),
          );
        },
      })
    )
  );
};

export const ResourceCost: React.FunctionComponentFactory<PropTypes> = React.createFactory(ResourceCostComponent);
