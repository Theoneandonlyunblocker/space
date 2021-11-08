import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Unit} from "core/src/unit/Unit";

import {localize} from "../../../localization/localize";
import { getAttributeKeysSortedForDisplay, UnitAttributesObject } from "core/src/unit/UnitAttributes";


export interface PropTypes extends React.Props<any>
{
  unit: Unit;
  handleClick: (attribute: keyof UnitAttributesObject) => void;
}

interface StateType
{
}

export class UpgradeAttributesComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "UpgradeAttributes";
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.upgradeAttribute = this.upgradeAttribute.bind(this);
  }

  public override render()
  {
    const unit = this.props.unit;
    const rows: React.ReactHTMLElement<any>[] = [];

    const attributes = getAttributeKeysSortedForDisplay();

    attributes.forEach(attribute =>
    {
      const maxAttribute = attribute === "maxActionPoints" ? 6 : 9;
      if (unit.baseAttributes[attribute] < maxAttribute)
      {
        rows.push(ReactDOMElements.li(
        {
          className: "upgrade-attributes-attribute",
          onClick: this.upgradeAttribute.bind(this, attribute),
          key: attribute,
        },
          localize("upgradeAttribute").format(
          {
            attribute: localize(attribute).toString(),
            currentLevel: unit.baseAttributes[attribute],
            nextLevel: unit.baseAttributes[attribute] + 1,
          }),
        ));
      }
    });

    return(
      ReactDOMElements.div(
      {
        className: "upgrade-attributes",
      },
        ReactDOMElements.div(
        {
          className: "upgrade-attributes-header",
        },
          localize("upgradeStats").toString(),
        ),
        ReactDOMElements.ol(
        {
          className: "upgrade-attributes-list",
        },
          rows,
        ),
      )
    );
  }

  private upgradeAttribute(attribute: keyof UnitAttributesObject, e: React.MouseEvent<HTMLLIElement>)
  {
    if (e.button) { return; }
    this.props.handleClick(attribute);
  }
}

export const UpgradeAttributes: React.Factory<PropTypes> = React.createFactory(UpgradeAttributesComponent);
