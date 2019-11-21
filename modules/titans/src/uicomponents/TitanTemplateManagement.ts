import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{

}

const TitanTemplateManagementComponent: React.FunctionComponent<PropTypes> = props =>
{
  // TODO 2019.11.19 |
  // const [selectedTemplate, setSelectedTemplate] = React.useState(null);

  return(
    ReactDOMElements.div(
    {
      className: "titan-template-management",
    },

    )
  );
};

export const TitanTemplateManagement: React.FunctionComponentFactory<PropTypes> = React.createFactory(TitanTemplateManagementComponent);
