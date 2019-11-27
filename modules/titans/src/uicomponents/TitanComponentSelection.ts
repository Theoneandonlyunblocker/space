import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { TitanComponentTemplate } from "../TitanComponentTemplate";
import { ItemIcon } from "modules/defaultui/src/uicomponents/unitlist/ItemIcon";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  availableComponents: TitanComponentTemplate[];
  onSelect: (component: TitanComponentTemplate) => void;
}

const TitanComponentSelectionComponent: React.FunctionComponent<PropTypes> = props =>
{
  const ownDOMNode = React.useRef<HTMLUListElement | null>(null);

  return(
    ReactDOMElements.ul(
    {
      className: "titan-component-selection",
      ref: ownDOMNode,
    },
      props.availableComponents.map(template =>
      {
        return ReactDOMElements.li(
        {
          key: template.type,
          className: "titan-component-selection-item",
          onClick: () => props.onSelect(template),
          title: `${template.displayName}\n\n${template.description}`
        },
          ItemIcon(
          {
            itemTemplate: template,
          }),
        );
      }),
    )
  );
};

export const TitanComponentSelection: React.FunctionComponentFactory<PropTypes> = React.createFactory(TitanComponentSelectionComponent);
