import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { Resources } from "core/src/player/PlayerResources";
import { ResourceIcon } from "./ResourceIcon";
import { ResourceAmount } from "./ResourceAmount";
import { ResourceIncome } from "./ResourceIncome";
import { ResourceList } from "./ResourceList";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  resources: Resources;
  income?: Resources;
}

const PlayerResourcesComponent: React.FunctionComponent<PropTypes> = props =>
{
  const allResourceTypes = Object.keys({...props.resources, ...props.income});


  return(
    ReactDOMElements.div(
    {
      className: "player-resources",
    },
      ResourceList(
      {
        resourceTypes: allResourceTypes,
        renderResource: resource =>
        {
          const amount = props.resources[resource.type] || 0;
          const income = props.income ?
            props.income[resource.type] || 0 :
            undefined;

          return ReactDOMElements.div(
          {
            className: "resource",
            key: resource.type,
          },
            ResourceIcon({resource: resource}),
            ResourceAmount({resource: resource, amount: amount}),
            ResourceIncome({resource: resource, income: income}),
          );
        },
      }),
    )
  );
};

export const PlayerResources: React.FunctionComponentFactory<PropTypes> = React.createFactory(PlayerResourcesComponent);
