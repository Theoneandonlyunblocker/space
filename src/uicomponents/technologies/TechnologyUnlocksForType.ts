import * as React from "react";

// TODO 2017.12.08 |
// import {localize} from "../../../localization/localize";

import {UnlockableThing, UnlockType} from "../../templateinterfaces/UnlockableThing";

import {TechnologyUnlock} from "./TechnologyUnlock";


interface PropTypes extends React.Props<any>
{
  unlockType: UnlockType;
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
        // TODO 2017.12.08 |
        "PLACEHOLDER",
        // localizeF(this.props.unlockType, "plural").capitalize(),
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
