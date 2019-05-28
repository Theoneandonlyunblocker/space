import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {UnlockableThing} from "../../templateinterfaces/UnlockableThing";

import {TechnologyUnlocksForLevel} from "./TechnologyUnlocksForLevel";


interface PropTypes extends React.Props<any>
{
  technologyDisplayName: string;
  unlocksPerLevel: {[level: number]: UnlockableThing[]};
}

interface StateType
{
}

export class TechnologyUnlocksComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "TechnologyUnlocks";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    return(
      ReactDOMElements.ol(
      {
        className: "technology-unlocks",
      },
        Object.keys(this.props.unlocksPerLevel).map(levelString =>
        {
          return parseInt(levelString);
        }).sort((a, b) =>
        {
          return a - b;
        }).map(level =>
        {
          return ReactDOMElements.li(
          {
            key: level,
            className: "technology-unlocks-list-item",
          },
            TechnologyUnlocksForLevel(
            {
              level: level,
              unlocks: this.props.unlocksPerLevel[level],
            }),
          );
        }),
      )
    );
  }
}

// tslint:disable-next-line:variable-name
export const TechnologyUnlocks: React.Factory<PropTypes> = React.createFactory(TechnologyUnlocksComponent);
