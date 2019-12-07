import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { Resources } from "core/src/player/PlayerResources";
import { ResourceCost } from "modules/defaultui/src/uicomponents/resources/ResourceCost";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  name: string;
  chassisName: string;
  cost: Resources;

  onClick?: () => void;
}

const TitanPrototypeListItemComponent: React.FunctionComponent<PropTypes> = props =>
{
  const rowProps: React.HTMLAttributes<HTMLTableRowElement> & React.ClassAttributes<HTMLTableRowElement> =
  {
    className: "titan-assembly-list-item",
    onClick: props.onClick,
  };

  return(
    ReactDOMElements.tr(rowProps,
      ReactDOMElements.td(
      {
        className: "titan-assembly-list-item-cell titan-assembly-list-name",
      },
        props.name
      ),
      ReactDOMElements.td(
      {
        className: "titan-assembly-list-item-cell titan-assembly-list-chassis",
      },
        props.chassisName
      ),
      ReactDOMElements.td(
      {
        className: "titan-assembly-list-item-cell titan-assembly-list-cost",
      },
        ResourceCost(
        {
          cost: props.cost,
        }),
      ),
    )
  );
};

export const TitanPrototypeListItem: React.FunctionComponentFactory<PropTypes> = React.createFactory(TitanPrototypeListItemComponent);
