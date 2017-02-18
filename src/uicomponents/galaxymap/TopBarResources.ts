/// <reference path="../../../lib/react-global.d.ts" />

import app from "../../App"; // TODO global

import Player from "../../Player";
import eventManager from "../../eventManager";
import Resource from "./Resource";


export interface PropTypes extends React.Props<any>
{
  player: Player;
}

interface StateType
{
}

export class TopBarResourcesComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "TopBarResources";
  updateListener: Function = undefined;

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  componentDidMount()
  {
    this.updateListener = eventManager.addEventListener(
      "builtBuildingWithEffect_resourceIncome", this.forceUpdate.bind(this));
  }

  componentWillUnmount()
  {
    eventManager.removeEventListener("builtBuildingWithEffect_resourceIncome", this.updateListener);
  }

  render()
  {
    const player = this.props.player;
    const resourceElements: React.ReactElement<any>[] = [];
    const resourceIncome = player.getResourceIncome();
    const resourceTypes: string[] = Object.keys(player.resources);

    for (let resourceType in resourceIncome)
    {
      if (resourceTypes.indexOf(resourceType) === -1)
      {
        resourceTypes.push(resourceType);
      }
    }

    for (let i = 0; i < resourceTypes.length; i++)
    {
      const resourceType = resourceTypes[i];
      const amount = player.resources[resourceType] || 0;
      const income = resourceIncome[resourceType].amount || 0;
      if (amount === 0 && income === 0) continue;

      const resourceData =
      {
        resource: app.moduleData.Templates.Resources[resourceType],
        amount: amount,
        income: income,
        key: resourceType,
      };
      resourceElements.push(Resource(resourceData));
    }

    return(
      React.DOM.div(
      {
        className: "top-bar-resources",
      },
        resourceElements,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TopBarResourcesComponent);
export default Factory;
