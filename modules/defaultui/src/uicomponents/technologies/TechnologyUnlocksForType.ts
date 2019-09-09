import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";

import {UnlockableThing, UnlockableThingKind} from "core/src/templateinterfaces/UnlockableThing";

import {TechnologyUnlock} from "./TechnologyUnlock";



function localizeUnlockableThingKind(unlockableThingKind: UnlockableThingKind)
{
  switch (unlockableThingKind)
  {
    case "building": return localize("techUnlock_buildings").toString();
    case "item":     return localize("techUnlock_items").toString();
    case "unit":     return localize("techUnlock_units").toString();
  }
}

export interface PropTypes extends React.Props<any>
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
