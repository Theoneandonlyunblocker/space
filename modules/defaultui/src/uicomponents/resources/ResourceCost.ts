import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { Resources } from "core/src/player/PlayerResources";
import { ResourceList } from "./ResourceList";
import { ResourceAmount } from "./ResourceAmount";
import { ResourceIcon } from "./ResourceIcon";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  cost: Resources;
  missingResources?: Resources;
}

const ResourceCostComponent: React.FunctionComponent<PropTypes> = props =>
{

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
            key: resource.type,
          },
            ResourceAmount(
            {
              resource: resource,
              amount: props.cost[resource.type],
              isInsufficient: Boolean(props.missingResources && props.missingResources[resource.type]),
            }),
            ResourceIcon({resource: resource}),
          );
        },
      })
    )
  );
};

export const ResourceCost: React.FunctionComponentFactory<PropTypes> = React.createFactory(ResourceCostComponent);
