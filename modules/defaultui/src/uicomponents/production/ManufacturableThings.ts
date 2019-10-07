import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Player} from "core/src/player/Player";
import {Star} from "core/src/map/Star";
import { Extendables, getExtendables } from "../../extendables";


type TabKey = keyof Extendables["manufacturableThingKinds"];

export interface PropTypes extends React.Props<any>
{
  selectedStar: Star | null;
  player: Player;
  triggerUpdate: () => void;
}

interface StateType
{
  activeTab: TabKey;
}

export class ManufacturableThingsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "ManufacturableThings";


  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = {activeTab: "units"};
  }

  public render()
  {
    const extendables = getExtendables();
    const activeTabData = extendables.manufacturableThingKinds[this.state.activeTab];

    return(
      ReactDOMElements.div(
      {
        className: "manufacturable-things",
      },
        ReactDOMElements.div(
        {
          className: "manufacturable-things-tab-buttons",
        },
          Object.keys(extendables.manufacturableThingKinds).map(key =>
          {
            return ReactDOMElements.button(
            {
              key: key,
              className: "manufacturable-things-tab-button" +
                (this.state.activeTab === key ? " active-tab" : ""),
              onClick: () =>
              {
                if (this.state.activeTab !== key)
                {
                  this.setState({activeTab: key});
                }
              },
            },
              extendables.manufacturableThingKinds[key].buttonString,
            );
          }),
        ),
        ReactDOMElements.div(
        {
          className: "manufacturable-things-active-tab",
        },
          activeTabData.render(
          {
            manufacturableThings: (this.props.selectedStar && this.props.selectedStar.manufactory) ?
              activeTabData.getManufacturableThings(this.props.selectedStar.manufactory) :
              [],
            selectedLocation: this.props.selectedStar,
            player: this.props.player,
            canManufacture: Boolean(this.props.selectedStar && this.props.selectedStar.manufactory),
            triggerParentUpdate: this.props.triggerUpdate,
          }),
        ),
      )
    );
  }
}

export const ManufacturableThings: React.Factory<PropTypes> = React.createFactory(ManufacturableThingsComponent);
