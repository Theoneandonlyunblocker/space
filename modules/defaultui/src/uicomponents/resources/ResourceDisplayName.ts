import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { ResourceTemplate } from "core/src/templateinterfaces/ResourceTemplate";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  resource: ResourceTemplate;
}

const ResourceDisplayNameComponent: React.FunctionComponent<PropTypes> = props =>
{
  const elementProps: React.HTMLProps<HTMLSpanElement> =
  {
    className: "resource-display-name",
  };

  if (props.resource.styleTextProps)
  {
    props.resource.styleTextProps(elementProps);
  }

  return(
    ReactDOMElements.span(elementProps,
      props.resource.displayName,
    )
  );
};

export const ResourceDisplayName: React.FunctionComponentFactory<PropTypes> = React.createFactory(ResourceDisplayNameComponent);
