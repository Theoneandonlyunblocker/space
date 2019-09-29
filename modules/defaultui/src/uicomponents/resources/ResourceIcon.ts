import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { ResourceTemplate } from "core/src/templateinterfaces/ResourceTemplate";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  resource: ResourceTemplate;
}

const ResourceIconComponent: React.FunctionComponent<PropTypes> = props =>
{
  const iconContainer = React.useRef<HTMLDivElement | null>(null);
  React.useLayoutEffect(() =>
  {
    const renderedIcon = props.resource.getIcon();
    iconContainer.current.appendChild(renderedIcon);
  }, [props.resource]);

  return(
    ReactDOMElements.div(
    {
      className: "resource-icon",
      title: props.resource.displayName,
      ref: iconContainer,
    })
  );
};

export const ResourceIcon: React.FunctionComponentFactory<PropTypes> = React.createFactory(ResourceIconComponent);
