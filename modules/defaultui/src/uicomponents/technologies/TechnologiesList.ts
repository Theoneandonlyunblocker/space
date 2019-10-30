import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";

import {Technology} from "./Technology";
import { Player } from "core/src/player/Player";
import { useResearchSpeed } from "./useResearchSpeed";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  player: Player;
}

const TechnologiesListComponent: React.FunctionComponent<PropTypes> = props =>
{
  const researchSpeed = useResearchSpeed(props.player);
  const playerTechnology = props.player.playerTechnology;

  const rows: React.ReactElement<any>[] = [];

  for (const key in playerTechnology.technologies)
  {
    rows.push(Technology(
    {
      playerTechnology: playerTechnology,
      technology: playerTechnology.technologies[key].technology,
      researchPoints: researchSpeed,
      key: key,
    }));
  }

  return(
    ReactDOMElements.div(
    {
      className: "technologies-list-container",
    },
      ReactDOMElements.div(
      {
        className: "technologies-list",
      },
        rows,
      ),
      ReactDOMElements.div(
      {
        className: "technologies-list-research-speed",
      },
        `${localize("researchSpeed")}: ${researchSpeed} ${localize("perTurn")}`,
      ),
    )
  );
};

export const TechnologiesList: React.FunctionComponentFactory<PropTypes> = React.createFactory(TechnologiesListComponent);
