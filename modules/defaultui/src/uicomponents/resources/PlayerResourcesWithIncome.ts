import * as React from "react";
import { ResourcesWithIncome } from "./ResourcesWithIncome";
import { Player } from "core/src/player/Player";
import { useResources } from "./useResources";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  player: Player;
}

const PlayerResourcesWithIncomeComponent: React.FunctionComponent<PropTypes> = props =>
{
  const resources = useResources(props.player);

  return(
    ResourcesWithIncome(
    {
      resources: resources,
      income: props.player.getResourceIncome(),
    })
  );
};

export const PlayerResourcesWithIncome: React.FunctionComponentFactory<PropTypes> = React.createFactory(PlayerResourcesWithIncomeComponent);
