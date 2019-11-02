import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { ResourceTemplate } from "core/src/templateinterfaces/ResourceTemplate";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  resource: ResourceTemplate;
  income: number;
}

function renderIncomeString(amount: number, decimals: number)
{
  return `(${amount >= 0 ? "+" : "-"}${amount.toFixed(decimals)})`;
}

const ResourceIncomeComponent: React.FunctionComponent<PropTypes> = props =>
{
  const elementProps: React.HTMLProps<HTMLSpanElement> =
  {
    className: "resource-income" + (props.income >= 0 ? " positive" : " negative"),
    title: renderIncomeString(props.income, 2),
  };

  if (props.resource.styleTextProps)
  {
    props.resource.styleTextProps(elementProps);
  }

  return(
    ReactDOMElements.span(elementProps,
      renderIncomeString(props.income, 0),
    )
  );
};

export const ResourceIncome: React.FunctionComponentFactory<PropTypes> = React.createFactory(ResourceIncomeComponent);
