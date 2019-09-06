import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {AttitudeModifier} from "core/diplomacy/AttitudeModifier";
import {List} from "../list/List";
import {ListColumn} from "../list/ListColumn";
import {ListItem} from "../list/ListItem";
import {AutoPositionerProps, AutoPositioner} from "../mixins/AutoPositioner";
import {applyMixins} from "../mixins/applyMixins";

import {AttitudeModifierInfo, PropTypes as AttitudeModifierInfoProps} from "./AttitudeModifierInfo";


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

  private readonly ownDOMNode = React.createRef<HTMLDivElement>();

  constructor(props: PropTypes)
  {
    super(props);
    if (this.props.autoPositionerProps)
    {
      applyMixins(this, new AutoPositioner(this, this.ownDOMNode));
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
        label: localize("displayName").toString(),
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
        label: localize("attitudeModifierEffect").toString(),
        key: "strength",
        defaultOrder: "desc",
      },
      {
        label: localize("endsOn").toString(),
        key: "endTurn",
        defaultOrder: "asc",
      },
    ];

    return(
      ReactDOMElements.div(
      {
        className: "attitude-modifier-list auto-position fixed-table-parent",
        ref: this.ownDOMNode,
      },
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

export const AttitudeModifierList: React.Factory<PropTypes> = React.createFactory(AttitudeModifierListComponent);
