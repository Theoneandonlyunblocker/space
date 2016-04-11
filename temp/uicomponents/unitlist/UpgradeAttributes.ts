/// <reference path="../../../lib/react-0.13.3.d.ts" />


import Unit from "../unit/Unit.ts";

import * as React from "react";

export interface PropTypes extends React.Props<any>
{
  unit: any; // TODO refactor | define prop type 123
  handleClick: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

class UpgradeAttributes_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "UpgradeAttributes";
  upgradeAttribute(attribute: string, e: MouseEvent)
  {
    if (e.button) return;
    this.props.handleClick(attribute);
  }
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    var unit: Unit = this.props.unit;
    var rows: React.HTMLElement[] = [];

    for (var attribute in unit.baseAttributes)
    {
      var maxAttribute = attribute === "maxActionPoints" ? 6 : 9;
      if (unit.baseAttributes[attribute] < maxAttribute)
      {
        rows.push(React.DOM.div(
        {
          className: "upgrade-attributes-attribute",
          onClick: this.upgradeAttribute.bind(this, attribute),
          key: attribute
        },
          attribute + ": " + unit.baseAttributes[attribute] + " -> " + (unit.baseAttributes[attribute] + 1)
        ))
      }
    }

    if (rows.length === 0)
    {
      return null;
    }

    return(
      React.DOM.div(
      {
        className: "upgrade-attributes"
      },
        React.DOM.div(
        {
          className: "upgrade-attributes-header"
        },
          "Upgrade stats"
        ),
        rows
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UpgradeAttributes_COMPONENT_TODO);
export default Factory;
