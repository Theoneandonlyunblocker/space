import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { TitanChassisTemplate } from "../TitanChassisTemplate";
import { ProbabilityDistributionsList } from "modules/defaultui/src/uicomponents/generic/ProbabilityDistributionsList";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  template: TitanChassisTemplate;
}

const TitanChassisAbilitiesComponent: React.FunctionComponent<PropTypes> = props =>
{
  return(
    ReactDOMElements.div(
    {
      className: "titan-chassis-abilities",
    },
      ProbabilityDistributionsList(
      {
        distributions: props.template.possibleAbilities,
        renderListItem: (abilityTemplate) =>
        {
          const isPassiveSkill = !Boolean(abilityTemplate.use);

          return ReactDOMElements.li(
          {
            key: abilityTemplate.key,
            className: `possible-ability-list-item ${isPassiveSkill ? "passive-skill" : "active-skill"}`,
            title: abilityTemplate.description,
          },
            abilityTemplate.displayName,
          );
        },
        sortListItems: (a, b) => a.displayName.localeCompare(b.displayName),
      }),
    )
  );
};

export const TitanChassisAbilities: React.FunctionComponentFactory<PropTypes> = React.createFactory(TitanChassisAbilitiesComponent);
