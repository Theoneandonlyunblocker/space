import * as React from "react";

import {localize} from "../../../localization/localize";

import {UnlockableThing, UnlockableThingKind} from "../../templateinterfaces/UnlockableThing";

import {TechnologyUnlock} from "./TechnologyUnlock";


interface PropTypes extends React.Props<any>
{
  kind: UnlockableThingKind;
  unlocks: UnlockableThing[];
}

interface StateType
{
}

export class TechnologyUnlocksForTypeComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "TechnologyUnlocksForType";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    return React.DOM.div(
    {
      className: "technology-unlocks-for-type",
    },
      React.DOM.div(
      {
        className: "technology-unlocks-for-type-header",
      },
        this.props.kind === "item" ?
          localize("techUnlock_items")() :
          localize("techUnlock_units")(),
      ),
      React.DOM.ol(
      {
        className: "technology-unlocks-for-type-list",
      },
        this.props.unlocks.map(unlockableThing =>
        {
          return React.DOM.li(
          {
            key: unlockableThing.type,
            className: "technology-unlocks-for-type-list-item",
          },
            TechnologyUnlock(
            {
              displayName: unlockableThing.displayName,
              description: unlockableThing.description,
            }),
          );
        }),
      ),
    );
  }
}

export const TechnologyUnlocksForType: React.Factory<PropTypes> = React.createFactory(TechnologyUnlocksForTypeComponent);
