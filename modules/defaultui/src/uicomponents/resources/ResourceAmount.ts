import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { ResourceTemplate } from "core/src/templateinterfaces/ResourceTemplate";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  resource: ResourceTemplate;
  amount: number;
  isInsufficient?: boolean;
}

const ResourceAmountComponent: React.FunctionComponent<PropTypes> = props =>
{
  const elementProps: React.HTMLProps<HTMLSpanElement> =
  {
    className: "resource-amount" + (props.isInsufficient ? " insufficient" : ""),
    title: props.amount.toFixed(2),
  };

  if (props.resource.styleTextProps)
  {
    props.resource.styleTextProps(elementProps);
  }

  return(
    ReactDOMElements.span(elementProps,
      props.amount.toFixed(0),
    )
  );
};

export const ResourceAmount: React.FunctionComponentFactory<PropTypes> = React.createFactory(ResourceAmountComponent);
