/// <reference path="../../../lib/react-global.d.ts" />

import Unit from "../../Unit";

import {localize as localizeUnit} from "../../../localization/unit/localize";
import {localize, localizeF} from "../../../localization/unitlist/localize";


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
    const unit = this.props.unit;
    const rows: React.ReactHTMLElement<any>[] = [];

    const attributes = unit.baseAttributes.getAttributesTypesSortedForDisplay();

    attributes.forEach(attribute =>
    {
      const maxAttribute = attribute === "maxActionPoints" ? 6 : 9;
      if (unit.baseAttributes[attribute] < maxAttribute)
      {
        rows.push(React.DOM.li(
        {
          className: "upgrade-attributes-attribute",
          onClick: this.upgradeAttribute.bind(this, attribute),
          key: attribute,
        },
          localizeF("upgradeAttribute").format(
          {
            attribute: localizeUnit(attribute),
            current_level: unit.baseAttributes[attribute],
            next_level: unit.baseAttributes[attribute] + 1,
          }),
        ));
      }
    });

    if (rows.length === 0)
    {
      return null;
    }

    return(
      React.DOM.div(
      {
        className: "upgrade-attributes",
      },
        React.DOM.div(
        {
          className: "upgrade-attributes-header",
        },
          localize("upgradeStats"),
        ),
        React.DOM.ol(
        {
          className: "upgrade-attributes-list",
        },
          rows,
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UpgradeAttributesComponent);
export default Factory;
