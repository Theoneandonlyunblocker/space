import * as React from "react";

import {PartialUnitAttributes} from "../../UnitAttributes";


export interface PropTypes extends React.Props<any>
{
  attributeChanges?: PartialUnitAttributes;
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
      for (let attributeType in this.props.attributeChanges)
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

        attributeElements.push(React.DOM.img(
        {
          className: "attribute-change-icon" + "attribute-change-icon-" + "attributeType",
          src: imageSrc,
          key: attributeType,
          title: titleString,
        }));
      }
    }

    return(
      React.DOM.div(
      {
        className: "unit-attribute-changes",
      },
        attributeElements,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitAttributeChangesComponent);
export default Factory;
