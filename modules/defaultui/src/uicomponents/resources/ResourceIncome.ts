import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { ResourceTemplate } from "core/src/templateinterfaces/ResourceTemplate";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  resource: ResourceTemplate;
  income: number;
}

const ResourceIncomeComponent: React.FunctionComponent<PropTypes> = props =>
{
  const elementProps: React.HTMLProps<HTMLSpanElement> =
  {
    className: "resource-income" + (props.income >= 0 ? " positive" : " negative"),
  };

  if (props.resource.styleTextProps)
  {
    props.resource.styleTextProps(elementProps);
  }

  return(
    ReactDOMElements.span(elementProps,
      `(${props.income >= 0 ? "+" : "-"}${props.income})`
    )
  );
};

export const ResourceIncome: React.FunctionComponentFactory<PropTypes> = React.createFactory(ResourceIncomeComponent);
