import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {AttitudeModifier} from "../../AttitudeModifier";
import List from "../list/List";
import ListColumn from "../list/ListColumn";
import ListItem from "../list/ListItem";
import {AutoPositionerProps, default as AutoPositioner} from "../mixins/AutoPositioner";
import applyMixins from "../mixins/applyMixins";

import {default as AttitudeModifierInfo, PropTypes as AttitudeModifierInfoProps} from "./AttitudeModifierInfo";


export interface PropTypes extends React.Props<any>
{
  attitudeModifiers: AttitudeModifier[];

  autoPositionerProps?: AutoPositionerProps;
}

interface StateType
{
}

export class AttitudeModifierListComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "AttitudeModifierList";

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    if (this.props.autoPositionerProps)
    {
      applyMixins(this, new AutoPositioner(this));
    }
  }

  render()
  {
    const modifiers = this.props.attitudeModifiers;
    const rows: ListItem<AttitudeModifierInfoProps>[] = [];

    for (let i = 0; i < modifiers.length; i++)
    {
      const modifier = modifiers[i];
      if (modifier.isOverRidden)
      {
        continue;
      }

      rows.push(
      {
        key: modifier.template.type,
        content: AttitudeModifierInfo(
        {
          name: modifier.template.displayName,
          strength: modifier.getAdjustedStrength(),
          endTurn: modifier.endTurn,
        }),
      });
    }


    const columns: ListColumn<AttitudeModifierInfoProps>[] =
    [
      {
        label: localize("displayName")(),
        key: "name",
        defaultOrder: "asc",
        sortingFunction: (a, b) =>
        {
          let alphabeticSortOrder = 0;
          if (b.content.props.name > a.content.props.name)
          {
            alphabeticSortOrder -= 1;
          }
          else if (b.content.props.name < a.content.props.name)
          {
            alphabeticSortOrder += 1;
          }

          return alphabeticSortOrder;
        },
      },
      {
        label: localize("attitudeModifierEffect")(),
        key: "strength",
        defaultOrder: "desc",
      },
      {
        label: localize("endsOn")(),
        key: "endTurn",
        defaultOrder: "asc",
      },
    ];

    return(
      ReactDOMElements.div({className: "attitude-modifier-list auto-position fixed-table-parent"},
        List(
        {
          listItems: rows,
          initialColumns: columns,
          initialSortOrder: [columns[1], columns[0], columns[2]],
        }),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(AttitudeModifierListComponent);
export default factory;
