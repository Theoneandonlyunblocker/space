import * as React from "react";

import {UnlockableThing, UnlockType} from "../../templateinterfaces/UnlockableThing";

import {localize} from "../../../localization/localize";

import {TechnologyUnlocksForType} from "./TechnologyUnlocksForType";


interface PropTypes extends React.Props<any>
{
  level: number;
  unlocks: UnlockableThing[];
}

interface StateType
{
}

export class TechnologyUnlocksForLevelComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "TechnologyUnlocksForLevel";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    const unlockableThingsByType: {[unlockType in UnlockType]?: UnlockableThing[]} = {};

    this.props.unlocks.forEach(unlockableThing =>
    {
      if (!unlockableThingsByType[unlockableThing.unlockType])
      {
        unlockableThingsByType[unlockableThing.unlockType] = [];
      }

      unlockableThingsByType[unlockableThing.unlockType]!.push(unlockableThing);
    });

    return(
      React.DOM.div(
      {
        className: "technology-unlocks-for-level",
      },
        React.DOM.div(
        {
          className: "technology-unlocks-for-level-header",
        },
          `${localizeF("technologyLevel").capitalize()} ${this.props.level}`,
        ),
        React.DOM.ol(
        {
          className: "technology-unlocks-for-level-list",
        },
          Object.keys(unlockableThingsByType).sort().map(unlockType =>
          {
            return React.DOM.li(
            {
              key: unlockType,
              className: "technology-unlocks-for-level-list-item",
            },
              TechnologyUnlocksForType(
              {
                unlockType: <UnlockType>unlockType,
                unlocks: unlockableThingsByType[unlockType],
              }),
            );
          }),
        ),
      )
    );
  }
}

export const TechnologyUnlocksForLevel: React.Factory<PropTypes> = React.createFactory(TechnologyUnlocksForLevelComponent);
