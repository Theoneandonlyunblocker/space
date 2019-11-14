import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {UnlockableThing} from "core/src/templateinterfaces/UnlockableThing";

import {TechnologyUnlock} from "./TechnologyUnlock";
import { getExtendables } from "../../extendables";



function localizeUnlockableThingKind(unlockableThingKind: string)
{
  return getExtendables().unlockableThingKinds[unlockableThingKind].displayName;
}

export interface PropTypes extends React.Props<any>
{
  kind: string;
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
    return ReactDOMElements.div(
    {
      className: "technology-unlocks-for-type",
    },
      ReactDOMElements.div(
      {
        className: "technology-unlocks-for-type-header",
      },
        localizeUnlockableThingKind(this.props.kind),
      ),
      ReactDOMElements.ol(
      {
        className: "technology-unlocks-for-type-list",
      },
        this.props.unlocks.map(unlockableThing =>
        {
          return ReactDOMElements.li(
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

// tslint:disable-next-line:variable-name
export const TechnologyUnlocksForType: React.Factory<PropTypes> = React.createFactory(TechnologyUnlocksForTypeComponent);
