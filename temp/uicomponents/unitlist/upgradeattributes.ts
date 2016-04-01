export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class UpgradeAttributes extends React.Component<PropTypes, {}>
{
  displayName: "UpgradeAttributes";
  upgradeAttribute: function(attribute: string, e: MouseEvent)
  {
    if (e.button) return;
    this.props.handleClick(attribute);
  }
  render: function()
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
