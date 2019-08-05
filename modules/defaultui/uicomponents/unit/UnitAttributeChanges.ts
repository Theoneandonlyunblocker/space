import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {UnitAttributesObject} from "../../../../src/UnitAttributes";
import { getAssetSrc } from "modules/defaultui/assets";


export interface PropTypes extends React.Props<any>
{
  attributeChanges?: Partial<UnitAttributesObject>;
}

interface StateType
{
}

type AttributeType = Exclude<keyof UnitAttributesObject, "maxActionPoints">;

function getIconSrc(attributeType: AttributeType, isPositive: boolean): string
{
  if (isPositive)
  {
    switch (attributeType)
    {
      case "attack": return getAssetSrc("statusEffect_positive_attack");
      case "defence": return getAssetSrc("statusEffect_positive_defence");
      case "intelligence": return getAssetSrc("statusEffect_positive_intelligence");
      case "speed": return getAssetSrc("statusEffect_positive_speed");
    }
  }
  // can't do 'else' here: https://github.com/microsoft/TypeScript/issues/11572
  switch (attributeType)
  {
    case "attack": return getAssetSrc("statusEffect_negative_attack");
    case "defence": return getAssetSrc("statusEffect_negative_defence");
    case "intelligence": return getAssetSrc("statusEffect_negative_intelligence");
    case "speed": return getAssetSrc("statusEffect_negative_speed");
  }
}

export class UnitAttributeChangesComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "UnitAttributeChanges";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const attributeElements: React.ReactHTMLElement<any>[] = [];

    if (this.props.attributeChanges)
    {
      for (const attributeType in this.props.attributeChanges)
      {
        if (attributeType === "maxActionPoints")
        {
          continue;
        }

        const amountChanged = this.props.attributeChanges[attributeType];

        if (!amountChanged)
        {
          continue;
        }

        const changeIsPositive = amountChanged > 0;

        const titleString = `${attributeType} ${changeIsPositive ? "+" : "-"}${amountChanged}`;

        attributeElements.push(ReactDOMElements.img(
        {
          className: `attribute-change-icon attribute-change-icon-${attributeType}`,
          src: getIconSrc(<AttributeType>attributeType, changeIsPositive),
          key: attributeType,
          title: titleString,
        }));
      }
    }

    return(
      ReactDOMElements.div(
      {
        className: "unit-attribute-changes",
      },
        attributeElements,
      )
    );
  }
}

export const UnitAttributeChanges: React.Factory<PropTypes> = React.createFactory(UnitAttributeChangesComponent);
