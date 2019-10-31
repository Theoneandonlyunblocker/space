import * as React from "react";
import { ResourcesWithIncome } from "./ResourcesWithIncome";
import { Player } from "core/src/player/Player";
import { useResources } from "./useResources";
import { useIncome } from "./useIncome";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  player: Player;
}

const PlayerResourcesWithIncomeComponent: React.FunctionComponent<PropTypes> = props =>
{
  const resources = useResources(props.player);
  const income = useIncome(props.player);

  return(
    ResourcesWithIncome(
    {
      resources: resources,
      income: income,
    })
  );
};

export const PlayerResourcesWithIncome: React.FunctionComponentFactory<PropTypes> = React.createFactory(PlayerResourcesWithIncomeComponent);
