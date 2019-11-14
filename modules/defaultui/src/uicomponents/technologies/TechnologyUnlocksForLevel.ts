import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {UnlockableThingWithKind, UnlockableThing} from "core/src/templateinterfaces/UnlockableThing";

import {localize} from "../../../localization/localize";

import {TechnologyUnlocksForType} from "./TechnologyUnlocksForType";


export interface PropTypes extends React.Props<any>
{
  level: number;
  unlocks: UnlockableThingWithKind[];
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
    const unlocksByKind = this.props.unlocks.reduce((unlocksByKind, unlockableThingWithKind) =>
    {
      const {unlockableThing, unlockableThingKind} = unlockableThingWithKind;

      if (!unlocksByKind[unlockableThingKind])
      {
        unlocksByKind[unlockableThingKind] = [];
      }

      unlocksByKind[unlockableThingKind].push(unlockableThing);

      return unlocksByKind;
    }, <{[unlockableThingKind: string]: UnlockableThing[]}>{});

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
          Object.keys(unlocksByKind).sort().map(kind =>
          {
            return ReactDOMElements.li(
            {
              key: kind,
              className: "technology-unlocks-for-level-list-item",
            },
              TechnologyUnlocksForType(
              {
                kind: kind,
                unlocks: unlocksByKind[kind],
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
