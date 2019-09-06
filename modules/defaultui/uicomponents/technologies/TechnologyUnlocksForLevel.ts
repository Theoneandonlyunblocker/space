import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {UnlockableThing, UnlockableThingKind} from "src/templateinterfaces/UnlockableThing";

import {localize} from "../../localization/localize";

import {TechnologyUnlocksForType} from "./TechnologyUnlocksForType";


export interface PropTypes extends React.Props<any>
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
    const unlockableThingsByType: {[kind in UnlockableThingKind]?: UnlockableThing[]} = {};

    this.props.unlocks.forEach(unlockableThing =>
    {
      if (!unlockableThingsByType[unlockableThing.kind])
      {
        unlockableThingsByType[unlockableThing.kind] = [];
      }

      unlockableThingsByType[unlockableThing.kind]!.push(unlockableThing);
    });

    return(
      ReactDOMElements.div(
      {
        className: "technology-unlocks-for-level",
      },
        ReactDOMElements.div(
        {
          className: "technology-unlocks-for-level-header",
        },
          localize("technologyLevel").format(this.props.level),
        ),
        ReactDOMElements.ol(
        {
          className: "technology-unlocks-for-level-list",
        },
          Object.keys(unlockableThingsByType).sort().map(kind =>
          {
            return ReactDOMElements.li(
            {
              key: kind,
              className: "technology-unlocks-for-level-list-item",
            },
              TechnologyUnlocksForType(
              {
                kind: <UnlockableThingKind> kind,
                unlocks: unlockableThingsByType[kind],
              }),
            );
          }),
        ),
      )
    );
  }
}

// tslint:disable-next-line:variable-name
export const TechnologyUnlocksForLevel: React.Factory<PropTypes> = React.createFactory(TechnologyUnlocksForLevelComponent);
