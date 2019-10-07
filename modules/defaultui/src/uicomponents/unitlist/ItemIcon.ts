import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { ItemTemplate } from "core/src/templateinterfaces/ItemTemplate";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  itemTemplate: ItemTemplate;
}

const ItemIconComponent: React.FunctionComponent<PropTypes> = props =>
{
  const iconContainer = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() =>
  {
    const renderedIcon = props.itemTemplate.getIcon();
    iconContainer.current.appendChild(renderedIcon);
  }, [props.itemTemplate]);

  return(
    ReactDOMElements.div(
    {
      className: "item-icon",
      ref: iconContainer,
    },

    )
  );
};

export const ItemIcon: React.FunctionComponentFactory<PropTypes> = React.createFactory(ItemIconComponent);
