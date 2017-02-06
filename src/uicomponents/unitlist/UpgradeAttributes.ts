/// <reference path="../../../lib/react-global.d.ts" />


import Unit from "../../Unit";


export interface PropTypes extends React.Props<any>
{
  unit: Unit;
  handleClick: (attribute: string) => void;
}

interface StateType
{
}

export class UpgradeAttributesComponent extends React.Component<PropTypes, StateType>
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
    this.upgradeAttribute = this.upgradeAttribute.bind(this);
  }

  render()
  {
    var unit = this.props.unit;
    var rows: React.ReactHTMLElement<any>[] = [];

    const attributes = unit.baseAttributes.getAttributesTypesSortedForDisplay();

    attributes.forEach((attribute) =>
    {
      var maxAttribute = attribute === "maxActionPoints" ? 6 : 9;
      if (unit.baseAttributes[attribute] < maxAttribute)
      {
        rows.push(React.DOM.li(
        {
          className: "upgrade-attributes-attribute",
          onClick: this.upgradeAttribute.bind(this, attribute),
          key: attribute
        },
          attribute + ": " + unit.baseAttributes[attribute] + " -> " + (unit.baseAttributes[attribute] + 1)
        ))
      }
    })

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
        React.DOM.ol(
        {
          className: "upgrade-attributes-list"
        },
          rows
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UpgradeAttributesComponent);
export default Factory;
