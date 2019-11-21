import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { TitanChassisTemplate } from "../TitanChassisTemplate";
import { ProbabilityDistributionsList } from "modules/defaultui/src/uicomponents/generic/ProbabilityDistributionsList";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  template: TitanChassisTemplate;
}

const TitanChassisInfoComponent: React.FunctionComponent<PropTypes> = props =>
{
  return(
    ReactDOMElements.div(
    {
      className: "titan-chassis-info",
    },
      ReactDOMElements.div(
      {
        className: "titan-chassis-info-left",
      },
        ReactDOMElements.div(
        {
          className: "menu-unit-info-name titan-chassis-info-name",
        },
          props.template.displayName,
        ),
        ReactDOMElements.div(
        {
          className: "titan-chassis-info-abilities",
        },
          ProbabilityDistributionsList(
          {
            distributions: props.template.possibleAbilities,
            renderListItem: (abilityTemplate) =>
            {
              return ReactDOMElements.li(
              {
                className: "asd",
                key: abilityTemplate.type,
              },
                abilityTemplate.displayName,
              );
            },
            sortListItems: (a, b) => a.displayName.localeCompare(b.displayName),
          }),
        ),
      ),
    )
  );
};

export const TitanChassisInfo: React.FunctionComponentFactory<PropTypes> = React.createFactory(TitanChassisInfoComponent);
