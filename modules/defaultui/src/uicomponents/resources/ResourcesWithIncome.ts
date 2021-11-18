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

const ResourcesWithIncomeComponent: React.FunctionComponent<PropTypes> = props =>
{
  const allResourceTypes = Object.keys({...props.resources, ...props.income});

  return(
    ReactDOMElements.div(
    {
      className: "resources-with-income",
    },
      ResourceList(
      {
        resourceTypes: allResourceTypes,
        renderResource: resource =>
        {
          const amount = props.resources[resource.key] || 0;
          const income = props.income ?
            props.income[resource.key] || 0 :
            undefined;

          return ReactDOMElements.div(
          {
            className: "resource",
            key: resource.key,
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

export const ResourcesWithIncome: React.FunctionComponentFactory<PropTypes> = React.createFactory(ResourcesWithIncomeComponent);
