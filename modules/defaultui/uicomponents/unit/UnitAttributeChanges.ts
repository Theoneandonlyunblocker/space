import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {UnitAttributesObject} from "../../../../src/UnitAttributes";


export interface PropTypes extends React.Props<any>
{
  attributeChanges?: Partial<UnitAttributesObject>;
}

interface StateType
{
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
        const polarityString = changeIsPositive ? "positive" : "negative";
        const polaritySign = changeIsPositive ? " +" : " ";

        const imageSrc = `img/icons/statusEffect_${polaritySign}_${attributeType}.png`;

        const titleString = `${attributeType}${polarityString}${amountChanged}`;

        attributeElements.push(ReactDOMElements.img(
        {
          className: "attribute-change-icon" + "attribute-change-icon-" + "attributeType",
          src: imageSrc,
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

const factory: React.Factory<PropTypes> = React.createFactory(UnitAttributeChangesComponent);
export default factory;
