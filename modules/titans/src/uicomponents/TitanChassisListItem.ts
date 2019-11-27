import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { TitanChassisTemplate } from "../TitanChassisTemplate";
import { ListItemProps } from "modules/defaultui/src/uicomponents/list/ListItemProps";


// tslint:disable-next-line:no-any
export interface PropTypes extends ListItemProps, React.Props<any>
{
  chassis: TitanChassisTemplate;
  isSelected: boolean;
}

const TitanChassisListItemComponent: React.FunctionComponent<PropTypes> = props =>
{
  return(
    ReactDOMElements.tr(
    {
      className: `titan-chassis-list-item${props.isSelected ? " selected" : ""}`,
      onClick: props.handleClick,
    },
      ReactDOMElements.td(
      {
        className: "titan-chassis-list-item-cell titan-chassis-list-name",
      },
        props.chassis.displayName,
      ),
    )
  );
};

export const TitanChassisListItem: React.FunctionComponentFactory<PropTypes> = React.createFactory(TitanChassisListItemComponent);
