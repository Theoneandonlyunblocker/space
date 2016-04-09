/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

interface StateType
{
  // TODO refactor | add state type
}

class UpgradeAttributes extends React.Component<PropTypes, StateType>
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
    var rows: ReactDOMPlaceHolder[] = [];

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
