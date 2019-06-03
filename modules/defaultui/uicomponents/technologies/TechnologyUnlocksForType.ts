import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {AllMessages, localize} from "../../localization/localize";

import {UnlockableThing, UnlockableThingKind} from "../../../../src/templateinterfaces/UnlockableThing";

import {TechnologyUnlock} from "./TechnologyUnlock";


const localizationKeyForUnlockableThingKind:
{
  [K in UnlockableThingKind]: keyof AllMessages;
} =
{
  building: "techUnlock_buildings",
  item: "techUnlock_items",
  unit: "techUnlock_units",
};

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
    const localizationKey = localizationKeyForUnlockableThingKind[this.props.kind];

    return ReactDOMElements.div(
    {
      className: "technology-unlocks-for-type",
    },
      ReactDOMElements.div(
      {
        className: "technology-unlocks-for-type-header",
      },
        localize(localizationKey)(),
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
